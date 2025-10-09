import { Pool } from 'pg'
import crypto from 'crypto'
import { ExtractedFundingData } from '../nlp/funding-extractor'

export interface FundingRound {
  id: number
  companyName: string
  roundType: string
  amountUsd: number
  announcedDate: string
  valuationUsd?: number
  leadInvestors: string[]
  participatingInvestors: string[]
  source: string
  sourceUrl: string
  confidenceScore: number
}

export interface InvestorNetwork {
  investorA: string
  investorB: string
  coInvestmentCount: number
  totalAmount: number
  relationshipStrength: number
}

export class FundingDatabase {
  private pool: Pool

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'funding_tracker',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }

  async initializeDatabase(): Promise<void> {
    const client = await this.pool.connect()
    try {
      // Read and execute schema
      const fs = require('fs').promises
      const path = require('path')
      const schemaPath = path.join(__dirname, 'funding-schema.sql')
      const schema = await fs.readFile(schemaPath, 'utf8')
      
      await client.query(schema)
      console.log('Database schema initialized successfully')
    } catch (error) {
      console.error('Error initializing database:', error)
      throw error
    } finally {
      client.release()
    }
  }

  async ingestFundingData(extractedData: ExtractedFundingData[]): Promise<number> {
    let processedCount = 0
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      for (const data of extractedData) {
        try {
          // Check for duplicates
          if (await this.isDuplicate(client, data)) {
            console.log(`Skipping duplicate: ${data.companyName} - ${data.roundType}`)
            continue
          }

          // Insert or get company
          const companyId = await this.insertOrGetCompany(client, data.companyName)

          // Insert funding round
          const fundingRoundId = await this.insertFundingRound(client, {
            companyId,
            roundType: data.roundType,
            amountUsd: data.fundingAmount,
            currency: data.currency,
            announcedDate: data.announcedDate,
            valuationUsd: data.valuation,
            source: data.source,
            sourceUrl: data.url,
            articleTitle: data.title,
            confidenceScore: data.confidence
          })

          // Insert investors and relationships
          await this.insertInvestors(client, fundingRoundId, data.leadInvestors, 'lead')
          await this.insertInvestors(client, fundingRoundId, data.participatingInvestors, 'participant')

          // Record scraped article
          await this.recordScrapedArticle(client, data)

          processedCount++
        } catch (error) {
          console.error(`Error processing funding data for ${data.companyName}:`, error)
        }
      }

      await client.query('COMMIT')
      
      // Update investor networks
      await this.updateInvestorNetworks()
      
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

    return processedCount
  }

  private async isDuplicate(client: any, data: ExtractedFundingData): Promise<boolean> {
    // Check by content hash
    const contentHash = this.generateContentHash(data)
    const hashResult = await client.query(
      'SELECT id FROM scraped_articles WHERE content_hash = $1',
      [contentHash]
    )

    if (hashResult.rows.length > 0) {
      return true
    }

    // Check by URL
    const urlResult = await client.query(
      'SELECT id FROM scraped_articles WHERE url = $1',
      [data.url]
    )

    if (urlResult.rows.length > 0) {
      return true
    }

    // Check by company, amount, and date similarity
    const normalizedCompany = this.normalizeName(data.companyName)
    const dateRange = new Date(data.announcedDate)
    const dateBefore = new Date(dateRange.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days before
    const dateAfter = new Date(dateRange.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days after

    const similarResult = await client.query(`
      SELECT fr.id 
      FROM funding_rounds fr
      JOIN companies c ON fr.company_id = c.id
      WHERE c.normalized_name = $1 
        AND fr.amount_usd BETWEEN $2 AND $3
        AND fr.announced_date BETWEEN $4 AND $5
    `, [
      normalizedCompany,
      data.fundingAmount * 0.9, // 10% tolerance
      data.fundingAmount * 1.1,
      dateBefore.toISOString().split('T')[0],
      dateAfter.toISOString().split('T')[0]
    ])

    return similarResult.rows.length > 0
  }

  private async insertOrGetCompany(client: any, companyName: string): Promise<number> {
    const normalizedName = this.normalizeName(companyName)
    
    // Try to find existing company
    const existingResult = await client.query(
      'SELECT id FROM companies WHERE normalized_name = $1',
      [normalizedName]
    )

    if (existingResult.rows.length > 0) {
      return existingResult.rows[0].id
    }

    // Insert new company
    const insertResult = await client.query(`
      INSERT INTO companies (name, normalized_name) 
      VALUES ($1, $2) 
      RETURNING id
    `, [companyName, normalizedName])

    return insertResult.rows[0].id
  }

  private async insertFundingRound(client: any, roundData: any): Promise<number> {
    const result = await client.query(`
      INSERT INTO funding_rounds (
        company_id, round_type, amount_usd, currency, announced_date,
        valuation_usd, source, source_url, article_title, confidence_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `, [
      roundData.companyId,
      roundData.roundType,
      roundData.amountUsd,
      roundData.currency,
      roundData.announcedDate.split('T')[0], // Date only
      roundData.valuationUsd,
      roundData.source,
      roundData.sourceUrl,
      roundData.articleTitle,
      roundData.confidenceScore
    ])

    return result.rows[0].id
  }

  private async insertInvestors(client: any, fundingRoundId: number, investorNames: string[], role: string): Promise<void> {
    for (const investorName of investorNames) {
      if (!investorName || investorName.trim().length === 0) continue

      try {
        // Insert or get investor
        const investorId = await this.insertOrGetInvestor(client, investorName)

        // Link investor to funding round
        await client.query(`
          INSERT INTO funding_round_investors (funding_round_id, investor_id, role)
          VALUES ($1, $2, $3)
          ON CONFLICT (funding_round_id, investor_id) DO NOTHING
        `, [fundingRoundId, investorId, role])
      } catch (error) {
        console.error(`Error inserting investor ${investorName}:`, error)
      }
    }
  }

  private async insertOrGetInvestor(client: any, investorName: string): Promise<number> {
    const normalizedName = this.normalizeName(investorName)
    
    // Try to find existing investor
    const existingResult = await client.query(
      'SELECT id FROM investors WHERE normalized_name = $1',
      [normalizedName]
    )

    if (existingResult.rows.length > 0) {
      return existingResult.rows[0].id
    }

    // Insert new investor
    const insertResult = await client.query(`
      INSERT INTO investors (name, normalized_name) 
      VALUES ($1, $2) 
      RETURNING id
    `, [investorName, normalizedName])

    return insertResult.rows[0].id
  }

  private async recordScrapedArticle(client: any, data: ExtractedFundingData): Promise<void> {
    const contentHash = this.generateContentHash(data)
    
    await client.query(`
      INSERT INTO scraped_articles (source, url, title, content_hash, published_date, processed)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (url) DO NOTHING
    `, [
      data.source,
      data.url,
      data.title,
      contentHash,
      data.announcedDate,
      true
    ])
  }

  private async updateInvestorNetworks(): Promise<void> {
    const client = await this.pool.connect()
    
    try {
      // Calculate co-investment relationships
      await client.query(`
        INSERT INTO investor_networks (
          investor_a_id, investor_b_id, co_investment_count, 
          total_co_investment_amount, first_co_investment, last_co_investment
        )
        SELECT 
          LEAST(fri1.investor_id, fri2.investor_id) as investor_a_id,
          GREATEST(fri1.investor_id, fri2.investor_id) as investor_b_id,
          COUNT(*) as co_investment_count,
          SUM(fr.amount_usd) as total_co_investment_amount,
          MIN(fr.announced_date) as first_co_investment,
          MAX(fr.announced_date) as last_co_investment
        FROM funding_round_investors fri1
        JOIN funding_round_investors fri2 ON fri1.funding_round_id = fri2.funding_round_id
        JOIN funding_rounds fr ON fri1.funding_round_id = fr.id
        WHERE fri1.investor_id < fri2.investor_id
        GROUP BY LEAST(fri1.investor_id, fri2.investor_id), GREATEST(fri1.investor_id, fri2.investor_id)
        ON CONFLICT (investor_a_id, investor_b_id) 
        DO UPDATE SET
          co_investment_count = EXCLUDED.co_investment_count,
          total_co_investment_amount = EXCLUDED.total_co_investment_amount,
          first_co_investment = EXCLUDED.first_co_investment,
          last_co_investment = EXCLUDED.last_co_investment,
          updated_at = CURRENT_TIMESTAMP
      `)

      // Update relationship strength
      await client.query(`
        UPDATE investor_networks 
        SET relationship_strength = calculate_network_strength(
          co_investment_count,
          total_co_investment_amount,
          EXTRACT(DAYS FROM (CURRENT_DATE - last_co_investment))::INTEGER
        )
      `)
    } finally {
      client.release()
    }
  }

  async getFundingRounds(limit: number = 50, offset: number = 0): Promise<FundingRound[]> {
    const result = await this.pool.query(`
      SELECT * FROM funding_rounds_with_details
      ORDER BY announced_date DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    return result.rows.map(row => ({
      id: row.id,
      companyName: row.company_name,
      roundType: row.round_type,
      amountUsd: row.amount_usd,
      announcedDate: row.announced_date,
      valuationUsd: row.valuation_usd,
      leadInvestors: row.lead_investors ? row.lead_investors.split(', ') : [],
      participatingInvestors: row.participating_investors ? row.participating_investors.split(', ') : [],
      source: row.source,
      sourceUrl: row.source_url || '',
      confidenceScore: row.confidence_score
    }))
  }

  async getInvestorNetworks(limit: number = 20): Promise<InvestorNetwork[]> {
    const result = await this.pool.query(`
      SELECT 
        ia.name as investor_a,
        ib.name as investor_b,
        in_net.co_investment_count,
        in_net.total_co_investment_amount,
        in_net.relationship_strength
      FROM investor_networks in_net
      JOIN investors ia ON in_net.investor_a_id = ia.id
      JOIN investors ib ON in_net.investor_b_id = ib.id
      ORDER BY in_net.relationship_strength DESC, in_net.co_investment_count DESC
      LIMIT $1
    `, [limit])

    return result.rows.map(row => ({
      investorA: row.investor_a,
      investorB: row.investor_b,
      coInvestmentCount: row.co_investment_count,
      totalAmount: row.total_co_investment_amount,
      relationshipStrength: parseFloat(row.relationship_strength)
    }))
  }

  private generateContentHash(data: ExtractedFundingData): string {
    const content = `${data.companyName}|${data.fundingAmount}|${data.roundType}|${data.announcedDate}`
    return crypto.createHash('sha256').update(content).digest('hex')
  }

  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+(inc|llc|corp|ltd|co|lp|llp)\.?\s*$/gi, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  async close(): Promise<void> {
    await this.pool.end()
  }
}