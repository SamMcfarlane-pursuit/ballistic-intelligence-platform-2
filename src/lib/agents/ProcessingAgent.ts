/**
 * Phase 2: Processing Agent
 * Transforms raw, unstructured text into clean, structured data using NLP and NER
 * Powered by Gemini Flash 2.5 Large Language Model
 */

interface EntityExtractionResult {
  organizations: string[]
  money: string[]
  fundingStage: string[]
  technology: string[]
  confidence: number
}

interface ProcessedFundingData {
  companyName: string
  theme: string
  amount: number
  fundingStage: string
  leadInvestor: string
  allInvestors: string[]
  confidence: number
  rawText: string
  extractedEntities: EntityExtractionResult
}

export class ProcessingAgent {
  private geminiApiKey: string

  constructor(apiKey: string) {
    this.geminiApiKey = apiKey
  }

  /**
   * Main processing function - transforms raw article text into structured data
   */
  async processArticle(articleText: string): Promise<ProcessedFundingData> {
    try {
      // Step 1: Extract entities using Gemini LLM
      const entities = await this.extractEntities(articleText)
      
      // Step 2: Structure the data into database format
      const structuredData = await this.structureData(entities, articleText)
      
      // Step 3: Validate and clean the structured data
      const cleanedData = this.validateAndClean(structuredData)
      
      return cleanedData
    } catch (error) {
      console.error('Processing Agent Error:', error)
      throw new Error(`Failed to process article: ${error.message}`)
    }
  }

  /**
   * Extract entities using Gemini Flash 2.5 with specialized NER prompt
   */
  private async extractEntities(text: string): Promise<EntityExtractionResult> {
    const prompt = this.buildNERPrompt(text)
    
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + this.geminiApiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1, // Low temperature for consistent extraction
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 2048,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const extractedText = data.candidates[0]?.content?.parts[0]?.text

      if (!extractedText) {
        throw new Error('No response from Gemini API')
      }

      return this.parseEntityResponse(extractedText)
    } catch (error) {
      console.error('Entity extraction failed:', error)
      throw error
    }
  }

  /**
   * Build specialized NER prompt for funding announcement extraction
   */
  private buildNERPrompt(text: string): string {
    return `
You are a specialized Named Entity Recognition (NER) system for cybersecurity funding announcements. 

Extract the following entities from this funding announcement text:

ORGANIZATION: Company names and VC firm names
MONEY: Exact funding amounts (convert to numbers)
FUNDING_STAGE: Funding round type (Seed, Series A, Series B, etc.)
TECHNOLOGY: Cybersecurity sub-sector or technology focus

Text to analyze:
"""
${text}
"""

Return your response in this exact JSON format:
{
  "organizations": ["company_name", "vc_firm_1", "vc_firm_2"],
  "money": ["10000000"],
  "fundingStage": ["Series A"],
  "technology": ["cloud security"],
  "confidence": 0.95
}

Rules:
1. Convert money amounts to numbers (e.g., "$10M" becomes "10000000")
2. Use standard funding stage names (Seed Round, Series A, Series B, etc.)
3. Identify the main company first in organizations array
4. List all investors after the main company
5. Technology should be specific cybersecurity sub-sectors
6. Confidence should be 0.0-1.0 based on clarity of information
7. Return valid JSON only, no additional text

Extract entities now:
`
  }

  /**
   * Parse the Gemini response into structured entities
   */
  private parseEntityResponse(response: string): EntityExtractionResult {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        organizations: parsed.organizations || [],
        money: parsed.money || [],
        fundingStage: parsed.fundingStage || [],
        technology: parsed.technology || [],
        confidence: parsed.confidence || 0.5
      }
    } catch (error) {
      console.error('Failed to parse entity response:', error)
      // Return default structure if parsing fails
      return {
        organizations: [],
        money: [],
        fundingStage: [],
        technology: [],
        confidence: 0.1
      }
    }
  }

  /**
   * Structure extracted entities into database format
   */
  private async structureData(entities: EntityExtractionResult, rawText: string): Promise<ProcessedFundingData> {
    // Extract company name (first organization)
    const companyName = entities.organizations[0] || 'Unknown Company'
    
    // Extract investors (remaining organizations)
    const allInvestors = entities.organizations.slice(1)
    const leadInvestor = allInvestors[0] || 'Unknown Investor'
    
    // Extract funding amount
    const amountStr = entities.money[0] || '0'
    const amount = this.parseAmount(amountStr)
    
    // Extract funding stage
    const fundingStage = entities.fundingStage[0] || 'Unknown Stage'
    
    // Extract technology theme
    const theme = entities.technology[0] || 'Cybersecurity'

    return {
      companyName,
      theme,
      amount,
      fundingStage,
      leadInvestor,
      allInvestors,
      confidence: entities.confidence,
      rawText,
      extractedEntities: entities
    }
  }

  /**
   * Parse funding amount string to number
   */
  private parseAmount(amountStr: string): number {
    try {
      // Handle already numeric strings
      if (/^\d+$/.test(amountStr)) {
        return parseInt(amountStr)
      }

      // Handle formatted amounts like "$10M", "$5.5B", etc.
      const cleanAmount = amountStr.replace(/[$,\s]/g, '').toLowerCase()
      
      let multiplier = 1
      if (cleanAmount.includes('k')) multiplier = 1000
      else if (cleanAmount.includes('m')) multiplier = 1000000
      else if (cleanAmount.includes('b')) multiplier = 1000000000

      const numericPart = parseFloat(cleanAmount.replace(/[kmb]/g, ''))
      return Math.round(numericPart * multiplier)
    } catch (error) {
      console.error('Failed to parse amount:', amountStr, error)
      return 0
    }
  }

  /**
   * Validate and clean the structured data
   */
  private validateAndClean(data: ProcessedFundingData): ProcessedFundingData {
    return {
      ...data,
      companyName: this.cleanCompanyName(data.companyName),
      theme: this.cleanTheme(data.theme),
      fundingStage: this.standardizeFundingStage(data.fundingStage),
      leadInvestor: this.cleanInvestorName(data.leadInvestor),
      allInvestors: data.allInvestors.map(inv => this.cleanInvestorName(inv)),
      amount: Math.max(0, data.amount), // Ensure non-negative
      confidence: Math.min(1, Math.max(0, data.confidence)) // Clamp 0-1
    }
  }

  /**
   * Clean and standardize company names
   */
  private cleanCompanyName(name: string): string {
    return name
      .replace(/\b(Inc|LLC|Ltd|Corp|Corporation)\b\.?/gi, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
  }

  /**
   * Clean and standardize technology themes
   */
  private cleanTheme(theme: string): string {
    const themeMap: Record<string, string> = {
      'cloud security': 'Cloud Security',
      'endpoint security': 'Endpoint Security',
      'network security': 'Network Security',
      'identity management': 'Identity & Access Management',
      'threat intelligence': 'Threat Intelligence',
      'security analytics': 'Security Analytics',
      'vulnerability management': 'Vulnerability Management',
      'incident response': 'Incident Response',
      'compliance': 'Compliance & Governance',
      'devsecops': 'DevSecOps',
      'zero trust': 'Zero Trust',
      'ai security': 'AI Security'
    }

    const lowerTheme = theme.toLowerCase()
    return themeMap[lowerTheme] || theme
  }

  /**
   * Standardize funding stage names
   */
  private standardizeFundingStage(stage: string): string {
    const stageMap: Record<string, string> = {
      'seed': 'Seed Round',
      'pre-seed': 'Pre-Seed',
      'series a': 'Series A',
      'series b': 'Series B',
      'series c': 'Series C',
      'series d': 'Series D',
      'bridge': 'Bridge Round',
      'convertible': 'Convertible Note',
      'ipo': 'IPO',
      'acquisition': 'Acquisition'
    }

    const lowerStage = stage.toLowerCase()
    return stageMap[lowerStage] || stage
  }

  /**
   * Clean investor names
   */
  private cleanInvestorName(name: string): string {
    return name
      .replace(/\b(Ventures|Capital|Partners|Fund|LP|Management)\b/gi, (match) => 
        match.charAt(0).toUpperCase() + match.slice(1).toLowerCase())
      .trim()
  }

  /**
   * Batch process multiple articles
   */
  async processBatch(articles: string[]): Promise<ProcessedFundingData[]> {
    const results: ProcessedFundingData[] = []
    
    for (let i = 0; i < articles.length; i++) {
      try {
        console.log(`Processing article ${i + 1}/${articles.length}`)
        const result = await this.processArticle(articles[i])
        results.push(result)
        
        // Add delay to respect API rate limits
        if (i < articles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error(`Failed to process article ${i + 1}:`, error)
        // Continue with next article
      }
    }
    
    return results
  }
}

export default ProcessingAgent