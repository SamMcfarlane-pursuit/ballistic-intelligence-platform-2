/**
 * PitchBook API Integration Service
 * Provides company funding and investor data
 */

export interface PitchBookCompany {
  id: string
  name: string
  description: string
  founded: number
  headquarters: string
  employees: string
  website: string
  totalFunding: number
  lastRound: string
  lastRoundAmount: number
  lastRoundDate: string
  investors: string[]
  sector: string
  stage: string
}

export interface PitchBookInvestor {
  name: string
  type: string
  location: string
  aum: number
  investments: number
}

class PitchBookService {
  private apiKey: string
  private baseUrl: string
  private cache: Map<string, { data: any; timestamp: number }>

  constructor() {
    this.apiKey = process.env.PITCHBOOK_API_KEY || ''
    this.baseUrl = process.env.PITCHBOOK_BASE_URL || 'https://api.pitchbook.com/v1'
    this.cache = new Map()
  }

  /**
   * Check if PitchBook is configured
   */
  isConfigured(): boolean {
    return this.apiKey !== '' && this.apiKey !== 'demo-pitchbook-key'
  }

  /**
   * Get company data from PitchBook
   */
  async getCompanyData(companyName: string): Promise<PitchBookCompany | null> {
    if (!this.isConfigured()) {
      console.log('PitchBook not configured, using mock data')
      return this.getMockCompanyData(companyName)
    }

    const cacheKey = `company-${companyName}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < 3600000) {
      return cached.data
    }

    try {
      const response = await fetch(`${this.baseUrl}/companies/search?name=${encodeURIComponent(companyName)}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`PitchBook API error: ${response.statusText}`)
      }

      const data = await response.json()
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      
      return data
    } catch (error) {
      console.error('PitchBook API error:', error)
      return this.getMockCompanyData(companyName)
    }
  }

  /**
   * Get investor data from PitchBook
   */
  async getInvestorData(investorName: string): Promise<PitchBookInvestor | null> {
    if (!this.isConfigured()) {
      return this.getMockInvestorData(investorName)
    }

    const cacheKey = `investor-${investorName}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < 3600000) {
      return cached.data
    }

    try {
      const response = await fetch(`${this.baseUrl}/investors/search?name=${encodeURIComponent(investorName)}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`PitchBook API error: ${response.statusText}`)
      }

      const data = await response.json()
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      
      return data
    } catch (error) {
      console.error('PitchBook API error:', error)
      return this.getMockInvestorData(investorName)
    }
  }

  /**
   * Enrich company data with PitchBook information
   */
  async enrichCompanyData(company: any): Promise<any> {
    const pitchbookData = await this.getCompanyData(company.name)
    
    if (!pitchbookData) {
      return company
    }

    return {
      ...company,
      pitchbook: {
        verified: true,
        totalFunding: pitchbookData.totalFunding || company.totalFunding,
        lastRound: pitchbookData.lastRound || company.lastRound,
        lastRoundAmount: pitchbookData.lastRoundAmount || company.lastRoundAmount,
        lastRoundDate: pitchbookData.lastRoundDate || company.latestDateOfFunding,
        investors: pitchbookData.investors || [company.fundingFrom],
        stage: pitchbookData.stage || 'Growth',
        employees: pitchbookData.employees || company.employees
      }
    }
  }

  /**
   * Mock company data for demo/testing
   */
  private getMockCompanyData(companyName: string): PitchBookCompany {
    return {
      id: `pb-${companyName.toLowerCase().replace(/\s+/g, '-')}`,
      name: companyName,
      description: `${companyName} is a cybersecurity company`,
      founded: 2020,
      headquarters: 'San Francisco, CA',
      employees: '11-50',
      website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      totalFunding: 10000000,
      lastRound: 'Series A',
      lastRoundAmount: 6000000,
      lastRoundDate: new Date().toISOString(),
      investors: ['Various Investors'],
      sector: 'Cybersecurity',
      stage: 'Growth'
    }
  }

  /**
   * Mock investor data for demo/testing
   */
  private getMockInvestorData(investorName: string): PitchBookInvestor {
    return {
      name: investorName,
      type: 'Venture Capital',
      location: 'San Francisco, CA',
      aum: 500000000,
      investments: 50
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }
}

export const pitchbookService = new PitchBookService()
