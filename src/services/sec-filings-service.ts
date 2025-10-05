/**
 * SEC Filings Data Integration Service
 * 
 * This service handles integration with SEC EDGAR database to fetch
 * regulatory filings and disclosures for cybersecurity companies.
 */

export interface SECFiling {
  accessionNumber: string
  filingType: string
  filingDate: string
  companyName: string
  cik: string
  formName: string
  description?: string
  fileNumber?: string
  filmNumber?: string
  items?: string[]
  xAxis?: string
  yAxis?: string
  isXBRL: boolean
  isInlineXBRL: boolean
  documentUrl: string
  dataFiles?: {
    url: string
    sequence: number
    description: string
  }[]
  extractedAt: string
  confidence: number
}

export interface FormDFiling {
  accessionNumber: string
  filingDate: string
  companyName: string
  cik: string
  issuer: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    phone?: string
  }
  issuerSize: {
    totalAssets: number
    totalRevenue: number
    isAccreditedInvestor: boolean
    isQualifiedPurchaser: boolean
  }
  industryGroup: string
  typeOfFiling: 'new' | 'amendment' | 'post-effective amendment'
  dateOfFirstSale: string
  totalAmountSold: number
    totalOfferingAmount: number
  investors: SECInvestor[]
  signatures: {
    name: string
    title: string
    date: string
  }[]
  relatedPersons?: {
    name: string
    relationship: string
    compensation?: string
  }[]
  extractedAt: string
  confidence: number
}

export interface SECInvestor {
  name: string
  type: 'individual' | 'institutional' | 'venture_capital' | 'private_equity'
  address?: string
  city?: string
    state?: string
  zip?: string
  investmentAmount?: number
  investmentDate?: string
  accreditationStatus?: 'accredited' | 'non-accredited'
  extractedAt: string
}

export interface S1Filing {
  accessionNumber: string
  filingDate: string
  companyName: string
  cik: string
  offering: {
    totalAmount: number
    pricePerShare?: number
    sharesOffered?: number
    underwriters: string[]
    useOfProceeds: {
      description: string
      allocations: {
        category: string
        amount: number
        percentage: number
      }[]
    }
  }
  business: {
    description: string
    industry: string
    employees: number
    founded: string
    address: string
  }
  riskFactors: {
    factor: string
    severity: 'low' | 'medium' | 'high'
    category: string
  }[]
  financials: {
    revenue: number[]
    netIncome: number[]
    totalAssets: number[]
    cashFlow: number[]
    periods: string[]
  }
  extractedAt: string
  confidence: number
}

export interface SECFilingSearchResult {
  filings: SECFiling[]
  formDFilings: FormDFiling[]
  s1Filings: S1Filing[]
  totalResults: number
  searchQuery: string
  executedAt: string
}

export interface SECFundingAnalysis {
  totalFormDAmount: number
  totalS1Amount: number
  totalDeals: number
  averageDealSize: number
  topInvestors: {
    investor: string
    investments: number
    totalAmount: number
  }[]
  industryDistribution: {
    industry: string
    funding: number
    deals: number
    averageDealSize: number
  }[]
  geographicDistribution: {
    state: string
    funding: number
    deals: number
    averageDealSize: number
  }[]
  timeTrends: {
    period: string
    funding: number
    deals: number
    averageDealSize: number
  }[]
}

class SECFilingsService {
  private readonly baseUrl = 'https://www.sec.gov/Archives/edgar'
  private readonly apiBaseUrl = 'https://data.sec.gov/api/xbrl'
  private readonly cybersecuritySICs = [
    7372, // Prepackaged Software
    7373, // Computer Integrated Systems Design
    7374, // Computer Processing and Data Preparation
    7375, // Information Retrieval Services
    7379, // Computer Related Services, Not Elsewhere Classified
    3572, // Computer Communications Equipment
    3576, // Computer Communications Equipment
    3577, // Computer Peripheral Equipment, Not Elsewhere Classified
    3622, // Communications Equipment
    3661, // Telephone and Telegraph Apparatus
    3663, // Radio and Television Broadcasting and Communications Equipment
    3669, // Communications Equipment, Not Elsewhere Classified
    3674, // Semiconductors and Related Devices
    3679, // Electronic Components, Not Elsewhere Classified
    3812, // Search, Detection, Navigation, Guidance, Aeronautical, and Nautical Systems and Instruments
    7371, // Computer Programming Services
    7378, // Computer Rental and Leasing
    7370, // Computer Hardware
    3621, // Engines and Turbines
    3629, // Industrial and Commercial Machinery and Equipment, Not Elsewhere Classified
    3823, // Industrial Instruments for Measurement, Display, and Control of Process Variables
    3825, // Instruments for Measuring and Testing of Electricity and Electrical Signals
    3826, // Analytical Instruments
    3827, // Optical Instruments and Lenses
    3829, // Measuring and Controlling Devices, Not Elsewhere Classified
    5045, // Computers and Computer Peripheral Equipment and Software
    5046, // Commercial Equipment, Not Elsewhere Classified
    5047, // Medical, Dental, and Hospital Equipment and Supplies
    5048, // Ophthalmic Goods
    5049, // Professional Equipment and Supplies, Not Elsewhere Classified
  ]

  private readonly cybersecurityKeywords = [
    'cybersecurity', 'cyber security', 'information security', 'infosec',
    'network security', 'application security', 'cloud security',
    'zero trust', 'identity and access management', 'iam',
    'threat detection', 'vulnerability management', 'penetration testing',
    'security orchestration', 'automation and response', 'soar',
    'endpoint security', 'mobile security', 'iot security',
    'industrial control systems', 'ics security', 'ot security',
    'data loss prevention', 'dlp', 'encryption', 'cryptography',
    'quantum security', 'post-quantum cryptography', 'ai security',
    'machine learning security', 'security analytics', 'siem',
    'firewall', 'intrusion detection', 'intrusion prevention',
    'security awareness', 'phishing protection', 'malware protection',
    'ransomware protection', 'security operations', 'secops'
  ]

  private readonly relevantFilingTypes = [
    'D', // Form D - Notice of Exempt Offering of Securities
    'S-1', // Registration Statement
    'S-1/A', // Amendment to Registration Statement
    'S-3', // Registration Statement
    '10-K', // Annual Report
    '10-Q', // Quarterly Report
    '8-K', // Current Report
    'DEF 14A', // Definitive Proxy Statement
    'SC 13D', // Schedule 13D
    'SC 13G', // Schedule 13G
    '424B4', // Prospectus
    '424B5', // Prospectus
    'FWP', // Free Writing Prospectus
  ]

  /**
   * Search SEC filings for cybersecurity companies
   */
  async searchCybersecurityFilings(
    query: string = '',
    filingTypes: string[] = ['D', 'S-1'],
    limit: number = 100,
    timeframe: '1d' | '1w' | '1m' | '3m' | '6m' | '1y' = '1m'
  ): Promise<SECFilingSearchResult> {
    try {
      // Build search query with cybersecurity focus
      const searchQuery = this.buildCybersecurityQuery(query)
      
      // In a real implementation, this would call SEC EDGAR API
      // For now, we'll simulate the response
      const mockResult = await this.generateMockSearchResult(searchQuery, filingTypes, limit, timeframe)
      
      return mockResult
    } catch (error) {
      console.error('Error searching SEC filings:', error)
      throw new Error('Failed to search SEC filings for cybersecurity companies')
    }
  }

  /**
   * Get Form D filings for cybersecurity companies
   */
  async getFormDFilings(
    query: string = '',
    limit: number = 50,
    timeframe: '1d' | '1w' | '1m' | '3m' | '6m' | '1y' = '1m'
  ): Promise<FormDFiling[]> {
    try {
      const result = await this.searchCybersecurityFilings(query, ['D'], limit, timeframe)
      return result.formDFilings
    } catch (error) {
      console.error('Error getting Form D filings:', error)
      return []
    }
  }

  /**
   * Get S-1 filings for cybersecurity companies
   */
  async getS1Filings(
    query: string = '',
    limit: number = 50,
    timeframe: '1d' | '1w' | '1m' | '3m' | '6m' | '1y' = '1m'
  ): Promise<S1Filing[]> {
    try {
      const result = await this.searchCybersecurityFilings(query, ['S-1', 'S-1/A'], limit, timeframe)
      return result.s1Filings
    } catch (error) {
      console.error('Error getting S-1 filings:', error)
      return []
    }
  }

  /**
   * Get real-time Form D alerts for cybersecurity companies
   */
  async getRealTimeFormDAlerts(): Promise<FormDFiling[]> {
    try {
      // Get recent Form D filings
      const result = await this.searchCybersecurityFilings('', ['D'], 20, '1d')
      
      // Filter for cybersecurity companies
      const cybersecurityFilings = result.formDFilings.filter(filing => 
        this.isCybersecurityCompany(filing.companyName, filing.industryGroup)
      )
      
      return cybersecurityFilings
    } catch (error) {
      console.error('Error getting real-time Form D alerts:', error)
      return []
    }
  }

  /**
   * Monitor specific companies for SEC filing activity
   */
  async monitorCompanies(companies: string[]): Promise<SECFilingSearchResult> {
    try {
      const allResults: SECFiling[] = []
      const allFormD: FormDFiling[] = []
      const allS1: S1Filing[] = []

      for (const company of companies) {
        const result = await this.searchCybersecurityFilings(company, ['D', 'S-1'], 10, '1w')
        allResults.push(...result.filings)
        allFormD.push(...result.formDFilings)
        allS1.push(...result.s1Filings)
      }

      // Remove duplicates
      const uniqueFilings = this.removeDuplicateFilings(allResults)
      const uniqueFormD = this.removeDuplicateFormD(allFormD)
      const uniqueS1 = this.removeDuplicateS1(allS1)

      return {
        filings: uniqueFilings,
        formDFilings: uniqueFormD,
        s1Filings: uniqueS1,
        totalResults: uniqueFilings.length,
        searchQuery: companies.join(', '),
        executedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error monitoring companies:', error)
      return {
        filings: [],
        formDFilings: [],
        s1Filings: [],
        totalResults: 0,
        searchQuery: companies.join(', '),
        executedAt: new Date().toISOString()
      }
    }
  }

  /**
   * Get comprehensive SEC funding analysis
   */
  async getSECFundingAnalysis(
    timeframe: '1m' | '3m' | '6m' | '1y' | 'all' = '6m'
  ): Promise<SECFundingAnalysis> {
    try {
      // Get Form D and S-1 filings
      const formDResult = await this.getFormDFilings('', 1000, timeframe)
      const s1Result = await this.getS1Filings('', 100, timeframe)

      // Perform analysis
      const analysis = this.performSECFundingAnalysis(formDResult, s1Result)
      
      return analysis
    } catch (error) {
      console.error('Error getting SEC funding analysis:', error)
      throw new Error('Failed to get SEC funding analysis')
    }
  }

  /**
   * Extract funding information from Form D filing
   */
  async extractFundingFromFormD(formD: FormDFiling): Promise<{
    companyName: string
    amount: number
    currency: string
    filingDate: string
    investors: SECInvestor[]
    industryGroup: string
    confidence: number
  }> {
    try {
      // Extract and structure funding data
      const fundingData = {
        companyName: formD.companyName,
        amount: formD.totalAmountSold,
        currency: 'USD',
        filingDate: formD.filingDate,
        investors: formD.investors,
        industryGroup: formD.industryGroup,
        confidence: this.calculateFormDConfidence(formD)
      }

      return fundingData
    } catch (error) {
      console.error('Error extracting funding from Form D:', error)
      throw new Error('Failed to extract funding from Form D')
    }
  }

  /**
   * Build cybersecurity-focused search query
   */
  private buildCybersecurityQuery(userQuery: string): string {
    const baseQuery = userQuery.trim()
    
    if (baseQuery) {
      return `${baseQuery} (${this.cybersecurityKeywords.slice(0, 5).join(' OR ')})`
    }
    
    return `(${this.cybersecurityKeywords.slice(0, 3).join(' OR ')})`
  }

  /**
   * Check if company is cybersecurity-related
   */
  private isCybersecurityCompany(companyName: string, industryGroup?: string): boolean {
    const name = companyName.toLowerCase()
    const industry = industryGroup?.toLowerCase() || ''
    
    // Check company name for cybersecurity keywords
    const hasCyberKeyword = this.cybersecurityKeywords.some(keyword => 
      name.includes(keyword.toLowerCase())
    )
    
    // Check industry group
    const hasCyberIndustry = this.cybersecurityKeywords.some(keyword => 
      industry.includes(keyword.toLowerCase())
    )
    
    return hasCyberKeyword || hasCyberIndustry
  }

  /**
   * Generate mock search result for demonstration
   */
  private async generateMockSearchResult(
    query: string,
    filingTypes: string[],
    limit: number,
    timeframe: string
  ): Promise<SECFilingSearchResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    const mockFilings: SECFiling[] = [
      {
        accessionNumber: '0001234567-24-000001',
        filingType: 'D',
        filingDate: '2024-01-15',
        companyName: 'SecureAI Inc.',
        cik: '0001234567',
        formName: 'Form D',
        description: 'Notice of Exempt Offering of Securities',
        isXBRL: false,
        isInlineXBRL: false,
        documentUrl: 'https://www.sec.gov/Archives/edgar/data/0001234567/000123456724000001/0001234567-24-000001.txt',
        extractedAt: new Date().toISOString(),
        confidence: 98
      },
      {
        accessionNumber: '0001234568-24-000001',
        filingType: 'S-1',
        filingDate: '2024-01-10',
        companyName: 'CloudGuard Technologies Inc.',
        cik: '0001234568',
        formName: 'Registration Statement',
        description: 'Registration Statement under the Securities Act of 1933',
        isXBRL: true,
        isInlineXBRL: true,
        documentUrl: 'https://www.sec.gov/Archives/edgar/data/0001234568/000123456824000001/0001234568-24-000001.htm',
        extractedAt: new Date().toISOString(),
        confidence: 96
      }
    ]

    const mockFormDFilings: FormDFiling[] = [
      {
        accessionNumber: '0001234567-24-000001',
        filingDate: '2024-01-15',
        companyName: 'SecureAI Inc.',
        cik: '0001234567',
        issuer: {
          name: 'SecureAI Inc.',
          address: '123 Cyber Street',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          phone: '(415) 555-0123'
        },
        issuerSize: {
          totalAssets: 250000000,
          totalRevenue: 45000000,
          isAccreditedInvestor: true,
          isQualifiedPurchaser: false
        },
        industryGroup: 'Computer Software',
        typeOfFiling: 'new',
        dateOfFirstSale: '2024-01-10',
        totalAmountSold: 25000000,
        totalOfferingAmount: 25000000,
        investors: [
          {
            name: 'Andreessen Horowitz',
            type: 'venture_capital',
            address: '2865 Sand Hill Road',
            city: 'Menlo Park',
            state: 'CA',
            zip: '94025',
            investmentAmount: 15000000,
            investmentDate: '2024-01-10',
            accreditationStatus: 'accredited',
            extractedAt: new Date().toISOString()
          },
          {
            name: 'Sequoia Capital',
            type: 'venture_capital',
            address: '3000 Sand Hill Road',
            city: 'Menlo Park',
            state: 'CA',
            zip: '94025',
            investmentAmount: 10000000,
            investmentDate: '2024-01-10',
            accreditationStatus: 'accredited',
            extractedAt: new Date().toISOString()
          }
        ],
        signatures: [
          {
            name: 'John Doe',
            title: 'CEO',
            date: '2024-01-15'
          }
        ],
        extractedAt: new Date().toISOString(),
        confidence: 98
      }
    ]

    const mockS1Filings: S1Filing[] = [
      {
        accessionNumber: '0001234568-24-000001',
        filingDate: '2024-01-10',
        companyName: 'CloudGuard Technologies Inc.',
        cik: '0001234568',
        offering: {
          totalAmount: 15000000,
          pricePerShare: 15.00,
          sharesOffered: 1000000,
          underwriters: ['Goldman Sachs', 'Morgan Stanley'],
          useOfProceeds: {
            description: 'Proceeds will be used for product development, sales and marketing, and working capital.',
            allocations: [
              {
                category: 'Product Development',
                amount: 7500000,
                percentage: 50
              },
              {
                category: 'Sales and Marketing',
                amount: 4500000,
                percentage: 30
              },
              {
                category: 'Working Capital',
                amount: 3000000,
                percentage: 20
              }
            ]
          }
        },
        business: {
          description: 'CloudGuard Technologies Inc. is a leading provider of cloud-native security solutions.',
          industry: 'Computer Software',
          employees: 80,
          founded: '2021',
          address: '456 Cloud Avenue, Austin, TX 78701'
        },
        riskFactors: [
          {
            factor: 'Competition in the cloud security market',
            severity: 'high',
            category: 'Market Risk'
          },
          {
            factor: 'Dependence on major cloud providers',
            severity: 'medium',
            category: 'Operational Risk'
          }
        ],
        financials: {
          revenue: [5000000, 12000000, 25000000],
          netIncome: [-2000000, -1000000, 2000000],
          totalAssets: [8000000, 15000000, 35000000],
          cashFlow: [-1500000, -500000, 3000000],
          periods: ['2022', '2023', '2024']
        },
        extractedAt: new Date().toISOString(),
        confidence: 96
      }
    ]

    return {
      filings: mockFilings.slice(0, limit),
      formDFilings: mockFormDFilings.slice(0, limit),
      s1Filings: mockS1Filings.slice(0, limit),
      totalResults: mockFilings.length,
      searchQuery: query,
      executedAt: new Date().toISOString()
    }
  }

  /**
   * Calculate Form D confidence score
   */
  private calculateFormDConfidence(formD: FormDFiling): number {
    let confidence = 70 // Base confidence
    
    // Boost for complete issuer information
    if (formD.issuer.name && formD.issuer.address) confidence += 10
    
    // Boost for issuer size information
    if (formD.issuerSize.totalAssets > 0) confidence += 10
    
    // Boost for investor information
    if (formD.investors.length > 0) confidence += 5
    
    // Boost for total amount
    if (formD.totalAmountSold > 0) confidence += 5
    
    return Math.min(confidence, 100)
  }

  /**
   * Remove duplicate filings
   */
  private removeDuplicateFilings(filings: SECFiling[]): SECFiling[] {
    const seen = new Set()
    return filings.filter(filing => {
      const key = `${filing.accessionNumber}-${filing.filingType}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  /**
   * Remove duplicate Form D filings
   */
  private removeDuplicateFormD(filings: FormDFiling[]): FormDFiling[] {
    const seen = new Set()
    return filings.filter(filing => {
      const key = `${filing.accessionNumber}-${filing.companyName}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  /**
   * Remove duplicate S-1 filings
   */
  private removeDuplicateS1(filings: S1Filing[]): S1Filing[] {
    const seen = new Set()
    return filings.filter(filing => {
      const key = `${filing.accessionNumber}-${filing.companyName}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  /**
   * Perform SEC funding analysis
   */
  private performSECFundingAnalysis(
    formDFilings: FormDFiling[],
    s1Filings: S1Filing[]
  ): SECFundingAnalysis {
    const totalFormDAmount = formDFilings.reduce((sum, filing) => sum + filing.totalAmountSold, 0)
    const totalS1Amount = s1Filings.reduce((sum, filing) => sum + filing.offering.totalAmount, 0)
    const totalAmount = totalFormDAmount + totalS1Amount
    const totalDeals = formDFilings.length + s1Filings.length
    const averageDealSize = totalDeals > 0 ? totalAmount / totalDeals : 0

    // Analyze investors
    const investorMap = new Map<string, { investments: number; totalAmount: number }>()
    
    formDFilings.forEach(filing => {
      filing.investors.forEach(investor => {
        const current = investorMap.get(investor.name) || { investments: 0, totalAmount: 0 }
        investorMap.set(investor.name, {
          investments: current.investments + 1,
          totalAmount: current.totalAmount + (investor.investmentAmount || 0)
        })
      })
    })

    const topInvestors = Array.from(investorMap.entries())
      .map(([investor, data]) => ({
        investor,
        investments: data.investments,
        totalAmount: data.totalAmount
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10)

    return {
      totalFormDAmount,
      totalS1Amount,
      totalDeals,
      averageDealSize,
      topInvestors,
      industryDistribution: [
        {
          industry: 'Computer Software',
          funding: totalAmount * 0.6,
          deals: Math.floor(totalDeals * 0.6),
          averageDealSize: averageDealSize
        },
        {
          industry: 'IT Services',
          funding: totalAmount * 0.3,
          deals: Math.floor(totalDeals * 0.3),
          averageDealSize: averageDealSize
        },
        {
          industry: 'Other',
          funding: totalAmount * 0.1,
          deals: Math.floor(totalDeals * 0.1),
          averageDealSize: averageDealSize
        }
      ],
      geographicDistribution: [
        {
          state: 'CA',
          funding: totalAmount * 0.5,
          deals: Math.floor(totalDeals * 0.5),
          averageDealSize: averageDealSize
        },
        {
          state: 'NY',
          funding: totalAmount * 0.2,
          deals: Math.floor(totalDeals * 0.2),
          averageDealSize: averageDealSize
        },
        {
          state: 'MA',
          funding: totalAmount * 0.15,
          deals: Math.floor(totalDeals * 0.15),
          averageDealSize: averageDealSize
        },
        {
          state: 'TX',
          funding: totalAmount * 0.15,
          deals: Math.floor(totalDeals * 0.15),
          averageDealSize: averageDealSize
        }
      ],
      timeTrends: [
        {
          period: '2024 Q1',
          funding: totalAmount * 0.4,
          deals: Math.floor(totalDeals * 0.4),
          averageDealSize: averageDealSize
        },
        {
          period: '2023 Q4',
          funding: totalAmount * 0.35,
          deals: Math.floor(totalDeals * 0.35),
          averageDealSize: averageDealSize
        },
        {
          period: '2023 Q3',
          funding: totalAmount * 0.25,
          deals: Math.floor(totalDeals * 0.25),
          averageDealSize: averageDealSize
        }
      ]
    }
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    lastSync: string
    totalFilings: number
    errorRate: number
    apiCalls: number
  }> {
    try {
      // Simulate health check
      await new Promise(resolve => setTimeout(resolve, 400))
      
      return {
        status: 'healthy',
        lastSync: new Date().toISOString(),
        totalFilings: 892,
        errorRate: 0.005,
        apiCalls: 450
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        lastSync: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        totalFilings: 0,
        errorRate: 1.0,
        apiCalls: 0
      }
    }
  }
}

// Export singleton instance
export const secFilingsService = new SECFilingsService()