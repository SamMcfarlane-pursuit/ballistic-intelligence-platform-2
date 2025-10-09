import { NextRequest, NextResponse } from 'next/server'
// Database integration will be implemented with proper PostgreSQL setup
// import { FundingDatabase } from '@/lib/database/funding-database'
// const db = new FundingDatabase()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const company = searchParams.get('company')
    const investor = searchParams.get('investor')
    const roundType = searchParams.get('roundType')
    const minAmount = searchParams.get('minAmount')
    const maxAmount = searchParams.get('maxAmount')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const source = searchParams.get('source')

    // Build dynamic query
    let query = `
      SELECT 
        fr.id,
        c.name as company_name,
        fr.round_type,
        fr.amount_usd,
        fr.announced_date,
        fr.valuation_usd,
        fr.source,
        fr.source_url,
        fr.confidence_score,
        c.industry,
        c.headquarters,
        COALESCE(
          STRING_AGG(
            CASE WHEN fri.role = 'lead' THEN i.name END, 
            ', ' ORDER BY i.name
          ), 
          ''
        ) as lead_investors,
        COALESCE(
          STRING_AGG(
            CASE WHEN fri.role = 'participant' THEN i.name END, 
            ', ' ORDER BY i.name
          ), 
          ''
        ) as participating_investors
      FROM funding_rounds fr
      JOIN companies c ON fr.company_id = c.id
      LEFT JOIN funding_round_investors fri ON fr.id = fri.funding_round_id
      LEFT JOIN investors i ON fri.investor_id = i.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    // Add filters
    if (company) {
      query += ` AND c.normalized_name ILIKE $${paramIndex}`
      params.push(`%${company.toLowerCase()}%`)
      paramIndex++
    }

    if (investor) {
      query += ` AND EXISTS (
        SELECT 1 FROM funding_round_investors fri2 
        JOIN investors i2 ON fri2.investor_id = i2.id 
        WHERE fri2.funding_round_id = fr.id 
        AND i2.normalized_name ILIKE $${paramIndex}
      )`
      params.push(`%${investor.toLowerCase()}%`)
      paramIndex++
    }

    if (roundType) {
      query += ` AND fr.round_type = $${paramIndex}`
      params.push(roundType)
      paramIndex++
    }

    if (minAmount) {
      query += ` AND fr.amount_usd >= $${paramIndex}`
      params.push(parseInt(minAmount))
      paramIndex++
    }

    if (maxAmount) {
      query += ` AND fr.amount_usd <= $${paramIndex}`
      params.push(parseInt(maxAmount))
      paramIndex++
    }

    if (startDate) {
      query += ` AND fr.announced_date >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      query += ` AND fr.announced_date <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    if (source) {
      query += ` AND fr.source = $${paramIndex}`
      params.push(source)
      paramIndex++
    }

    query += `
      GROUP BY fr.id, c.name, c.industry, c.headquarters
      ORDER BY fr.announced_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)

    // Execute query (mock implementation for now)
    const mockResults = [
      {
        id: 1,
        company_name: 'SecureAI Technologies',
        round_type: 'Series A',
        amount_usd: 25000000,
        announced_date: '2024-01-15',
        valuation_usd: 100000000,
        source: 'techcrunch',
        source_url: 'https://techcrunch.com/2024/01/15/secureai-raises-25m',
        confidence_score: 0.95,
        industry: 'Cybersecurity',
        headquarters: 'San Francisco, CA',
        lead_investors: 'Andreessen Horowitz',
        participating_investors: 'Sequoia Capital, Kleiner Perkins'
      },
      {
        id: 2,
        company_name: 'CloudDefense Pro',
        round_type: 'Series B',
        amount_usd: 45000000,
        announced_date: '2024-01-10',
        valuation_usd: 300000000,
        source: 'venturebeat',
        source_url: 'https://venturebeat.com/2024/01/10/clouddefense-45m-series-b',
        confidence_score: 0.92,
        industry: 'Cloud Security',
        headquarters: 'Austin, TX',
        lead_investors: 'Accel Partners',
        participating_investors: 'Index Ventures, Lightspeed Venture Partners'
      },
      {
        id: 3,
        company_name: 'ThreatHunter AI',
        round_type: 'Seed',
        amount_usd: 8000000,
        announced_date: '2024-01-08',
        valuation_usd: 40000000,
        source: 'techcrunch',
        source_url: 'https://techcrunch.com/2024/01/08/threathunter-ai-seed-round',
        confidence_score: 0.88,
        industry: 'AI Security',
        headquarters: 'Boston, MA',
        lead_investors: 'Y Combinator',
        participating_investors: 'Founders Fund, Data Collective'
      }
    ]

    // Apply client-side filtering for demo
    let filteredResults = mockResults

    if (company) {
      filteredResults = filteredResults.filter(r => 
        r.company_name.toLowerCase().includes(company.toLowerCase())
      )
    }

    if (investor) {
      filteredResults = filteredResults.filter(r => 
        r.lead_investors.toLowerCase().includes(investor.toLowerCase()) ||
        r.participating_investors.toLowerCase().includes(investor.toLowerCase())
      )
    }

    if (roundType) {
      filteredResults = filteredResults.filter(r => r.round_type === roundType)
    }

    if (minAmount) {
      filteredResults = filteredResults.filter(r => r.amount_usd >= parseInt(minAmount))
    }

    if (maxAmount) {
      filteredResults = filteredResults.filter(r => r.amount_usd <= parseInt(maxAmount))
    }

    // Format response
    const fundingRounds = filteredResults.map(row => ({
      id: row.id,
      companyName: row.company_name,
      roundType: row.round_type,
      amountUsd: row.amount_usd,
      announcedDate: row.announced_date,
      valuationUsd: row.valuation_usd,
      leadInvestors: row.lead_investors ? row.lead_investors.split(', ') : [],
      participatingInvestors: row.participating_investors ? row.participating_investors.split(', ') : [],
      source: row.source,
      sourceUrl: row.source_url,
      confidenceScore: row.confidence_score,
      industry: row.industry,
      headquarters: row.headquarters
    }))

    return NextResponse.json({
      success: true,
      data: {
        fundingRounds,
        pagination: {
          limit,
          offset,
          total: filteredResults.length,
          hasMore: filteredResults.length === limit
        }
      }
    })

  } catch (error) {
    console.error('Error fetching funding data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch funding data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'scrape') {
      // Simulate scraping process for demo
      // In production, this would trigger actual web scraping
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock scraping results
      const mockResults = {
        articlesScraped: 15,
        fundingEventsExtracted: 8,
        fundingEventsProcessed: 6
      }

      return NextResponse.json({
        success: true,
        data: mockResults
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in POST request:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}