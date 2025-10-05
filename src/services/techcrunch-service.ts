/**
 * TechCrunch Cybersecurity Data Integration Service
 * 
 * This service handles fetching, parsing, and processing cybersecurity-related
 * funding data from TechCrunch articles and API endpoints.
 */

export interface TechCrunchArticle {
  id: string
  title: string
  url: string
  author: string
  publishedAt: string
  updatedAt: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  relevanceScore: number
  cybersecurityRelevant: boolean
}

export interface TechCrunchFundingData {
  companyName: string
  amount?: number
  currency?: string
  roundType?: string
  announcedDate?: string
  leadInvestor?: string
  investors: string[]
  sector?: string
  subSector?: string
  stage?: string
  valuation?: number
  location?: string
  description?: string
  articleId: string
  confidence: number
  extractedAt: string
}

export interface TechCrunchSearchResult {
  articles: TechCrunchArticle[]
  fundingData: TechCrunchFundingData[]
  totalResults: number
  searchQuery: string
  executedAt: string
}

class TechCrunchService {
  private readonly baseUrl = 'https://techcrunch.com'
  private readonly apiBaseUrl = 'https://techcrunch.com/wp-json/tc/v1'
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

  private readonly fundingKeywords = [
    'funding', 'investment', 'raises', 'raised', 'series a', 'series b',
    'series c', 'series d', 'seed round', 'venture capital', 'vc',
    'private equity', 'pe', 'angel investment', 'startup funding',
    'capital raise', 'funding round', 'investment round', 'financing'
  ]

  private readonly roundTypePatterns = [
    /series\s+[a-z]/i,
    /seed\s+round/i,
    /pre[\s-]?seed/i,
    /angel\s+round/i,
    /bridge\s+round/i,
    /strategic\s+investment/i,
    /private\s+equity/i,
    /venture\s+debt/i,
    /ipo/i,
    /spac/i,
    /acquisition/i,
    /merger/i
  ]

  /**
   * Search TechCrunch for cybersecurity-related funding articles
   */
  async searchCybersecurityFunding(
    query: string = '',
    limit: number = 20,
    timeframe: '1d' | '1w' | '1m' | '3m' | '6m' | '1y' = '1m'
  ): Promise<TechCrunchSearchResult> {
    try {
      // Construct search query with cybersecurity focus
      const searchQuery = this.buildSearchQuery(query)
      
      // In a real implementation, this would call TechCrunch's API or web scraping
      // For now, we'll simulate the response
      const mockResult = await this.generateMockSearchResult(searchQuery, limit, timeframe)
      
      return mockResult
    } catch (error) {
      console.error('Error searching TechCrunch:', error)
      throw new Error('Failed to search TechCrunch for cybersecurity funding data')
    }
  }

  /**
   * Extract funding information from TechCrunch articles
   */
  async extractFundingData(articles: TechCrunchArticle[]): Promise<TechCrunchFundingData[]> {
    const fundingData: TechCrunchFundingData[] = []

    for (const article of articles) {
      if (!article.cybersecurityRelevant) continue

      const extractedData = await this.extractFundingFromArticle(article)
      if (extractedData) {
        fundingData.push(extractedData)
      }
    }

    return fundingData
  }

  /**
   * Get real-time cybersecurity funding alerts from TechCrunch
   */
  async getRealTimeAlerts(): Promise<TechCrunchFundingData[]> {
    try {
      // Search for recent cybersecurity funding articles
      const result = await this.searchCybersecurityFunding('', 10, '1d')
      
      // Extract and return funding data
      return result.fundingData
    } catch (error) {
      console.error('Error getting real-time alerts:', error)
      return []
    }
  }

  /**
   * Monitor specific companies for funding announcements
   */
  async monitorCompanies(companies: string[]): Promise<TechCrunchFundingData[]> {
    try {
      const allResults: TechCrunchFundingData[] = []

      for (const company of companies) {
        const result = await this.searchCybersecurityFunding(company, 5, '1w')
        allResults.push(...result.fundingData)
      }

      // Remove duplicates based on company name and announcement date
      const uniqueResults = this.removeDuplicates(allResults)
      
      return uniqueResults
    } catch (error) {
      console.error('Error monitoring companies:', error)
      return []
    }
  }

  /**
   * Build search query with cybersecurity and funding keywords
   */
  private buildSearchQuery(userQuery: string): string {
    const baseQuery = userQuery.trim()
    
    if (baseQuery) {
      return `${baseQuery} (${this.cybersecurityKeywords.slice(0, 5).join(' OR ')})`
    }
    
    return `(${this.cybersecurityKeywords.slice(0, 3).join(' OR ')}) AND (${this.fundingKeywords.slice(0, 3).join(' OR ')})`
  }

  /**
   * Generate mock search result for demonstration
   */
  private async generateMockSearchResult(
    query: string,
    limit: number,
    timeframe: string
  ): Promise<TechCrunchSearchResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockArticles: TechCrunchArticle[] = [
      {
        id: 'tc-1',
        title: 'SecureAI raises $25M Series B to advance AI-powered threat detection',
        url: 'https://techcrunch.com/2024/01/15/secureai-raises-25m-series-b/',
        author: 'Sarah Perez',
        publishedAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        content: 'SecureAI, a cybersecurity startup using artificial intelligence for threat detection, has raised $25 million in Series B funding led by Andreessen Horowitz...',
        excerpt: 'SecureAI raises $25M Series B to advance AI-powered threat detection platform',
        category: 'funding',
        tags: ['cybersecurity', 'ai', 'funding', 'series-b', 'threat-detection'],
        relevanceScore: 95,
        cybersecurityRelevant: true
      },
      {
        id: 'tc-2',
        title: 'CloudGuard secures $15M Series A for cloud-native security platform',
        url: 'https://techcrunch.com/2024/01/10/cloudguard-secures-15m-series-a/',
        author: 'Devin Coldewey',
        publishedAt: '2024-01-10T14:15:00Z',
        updatedAt: '2024-01-10T14:15:00Z',
        content: 'CloudGuard, a startup focused on cloud-native security, has secured $15 million in Series A funding led by Accel to expand its platform for container and microservices protection...',
        excerpt: 'CloudGuard secures $15M Series A for cloud-native security platform expansion',
        category: 'funding',
        tags: ['cloud-security', 'funding', 'series-a', 'containers', 'microservices'],
        relevanceScore: 92,
        cybersecurityRelevant: true
      },
      {
        id: 'tc-3',
        title: 'ZeroTrust Networks closes $45M Series C for zero trust architecture',
        url: 'https://techcrunch.com/2024/01/08/zerotrust-networks-closes-45m-series-c/',
        author: 'Anthony Ha',
        publishedAt: '2024-01-08T16:45:00Z',
        updatedAt: '2024-01-08T16:45:00Z',
        content: 'ZeroTrust Networks, a provider of zero trust security architecture, has closed $45 million in Series C funding led by Lightspeed Venture Partners...',
        excerpt: 'ZeroTrust Networks closes $45M Series C for enterprise zero trust architecture',
        category: 'funding',
        tags: ['zero-trust', 'funding', 'series-c', 'enterprise-security', 'identity-management'],
        relevanceScore: 98,
        cybersecurityRelevant: true
      }
    ]

    const mockFundingData: TechCrunchFundingData[] = [
      {
        companyName: 'SecureAI',
        amount: 25000000,
        currency: 'USD',
        roundType: 'Series B',
        announcedDate: '2024-01-15',
        leadInvestor: 'Andreessen Horowitz',
        investors: ['Andreessen Horowitz', 'Sequoia Capital', 'Kleiner Perkins'],
        sector: 'AI Security',
        subSector: 'AI-Powered Threat Detection',
        stage: 'Growth',
        valuation: 250000000,
        location: 'San Francisco, CA',
        description: 'AI-powered cybersecurity platform using machine learning for threat detection',
        articleId: 'tc-1',
        confidence: 96,
        extractedAt: new Date().toISOString()
      },
      {
        companyName: 'CloudGuard',
        amount: 15000000,
        currency: 'USD',
        roundType: 'Series A',
        announcedDate: '2024-01-10',
        leadInvestor: 'Accel',
        investors: ['Accel', 'Index Ventures', 'Bessemer Venture Partners'],
        sector: 'Cloud Security',
        subSector: 'Cloud Native Security',
        stage: 'Early Growth',
        valuation: 120000000,
        location: 'Austin, TX',
        description: 'Cloud-native security platform for container and microservices protection',
        articleId: 'tc-2',
        confidence: 92,
        extractedAt: new Date().toISOString()
      },
      {
        companyName: 'ZeroTrust Networks',
        amount: 45000000,
        currency: 'USD',
        roundType: 'Series C',
        announcedDate: '2024-01-08',
        leadInvestor: 'Lightspeed Venture Partners',
        investors: ['Lightspeed Venture Partners', 'GV', 'Khosla Ventures'],
        sector: 'Zero Trust',
        subSector: 'Identity and Access Management',
        stage: 'Late Stage',
        valuation: 450000000,
        location: 'Boston, MA',
        description: 'Enterprise zero trust architecture platform with advanced identity management',
        articleId: 'tc-3',
        confidence: 98,
        extractedAt: new Date().toISOString()
      }
    ]

    return {
      articles: mockArticles.slice(0, limit),
      fundingData: mockFundingData.slice(0, limit),
      totalResults: mockArticles.length,
      searchQuery: query,
      executedAt: new Date().toISOString()
    }
  }

  /**
   * Extract funding information from a single article
   */
  private async extractFundingFromArticle(article: TechCrunchArticle): Promise<TechCrunchFundingData | null> {
    try {
      // In a real implementation, this would use NLP and regex patterns
      // to extract funding information from the article content
      const extracted = this.extractFundingFromText(article.content, article.title)
      
      if (!extracted) return null

      return {
        ...extracted,
        articleId: article.id,
        confidence: this.calculateConfidence(article, extracted),
        extractedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error extracting funding from article:', error)
      return null
    }
  }

  /**
   * Extract funding information from text using patterns
   */
  private extractFundingFromText(content: string, title: string): Partial<TechCrunchFundingData> | null {
    const text = `${title} ${content}`.toLowerCase()
    
    // Extract company name (simplified - would use NLP in real implementation)
    const companyMatch = title.match(/^([A-Za-z\s]+)(?:\s+raises|\s+secures|\s+closes)/i)
    const companyName = companyMatch ? companyMatch[1].trim() : 'Unknown'
    
    // Extract amount
    const amountMatch = text.match(/\$(\d+(?:\.\d+)?)\s*(million|billion|m|b)/i)
    let amount: number | undefined
    if (amountMatch) {
      const value = parseFloat(amountMatch[1])
      const unit = amountMatch[2].toLowerCase()
      amount = unit.startsWith('b') ? value * 1000000000 : value * 1000000
    }
    
    // Extract round type
    let roundType: string | undefined
    for (const pattern of this.roundTypePatterns) {
      const match = text.match(pattern)
      if (match) {
        roundType = match[0].toUpperCase()
        break
      }
    }
    
    // Extract investors (simplified)
    const investorMatch = text.match(/led by ([^,]+)/i)
    const leadInvestor = investorMatch ? investorMatch[1].trim() : undefined
    
    // Determine sector based on keywords
    let sector = 'General Cybersecurity'
    if (text.includes('ai') || text.includes('machine learning')) {
      sector = 'AI Security'
    } else if (text.includes('cloud')) {
      sector = 'Cloud Security'
    } else if (text.includes('zero trust')) {
      sector = 'Zero Trust'
    } else if (text.includes('iot')) {
      sector = 'IoT Security'
    }
    
    return {
      companyName,
      amount,
      currency: 'USD',
      roundType,
      leadInvestor,
      investors: leadInvestor ? [leadInvestor] : [],
      sector,
      stage: this.determineStage(roundType)
    }
  }

  /**
   * Determine company stage based on round type
   */
  private determineStage(roundType?: string): string {
    if (!roundType) return 'Unknown'
    
    const type = roundType.toLowerCase()
    if (type.includes('seed') || type.includes('pre-seed') || type.includes('angel')) {
      return 'Early Stage'
    } else if (type.includes('series a')) {
      return 'Early Growth'
    } else if (type.includes('series b') || type.includes('series c')) {
      return 'Growth'
    } else if (type.includes('series d') || type.includes('series e')) {
      return 'Late Stage'
    } else if (type.includes('ipo') || type.includes('spac')) {
      return 'Public'
    } else {
      return 'Unknown'
    }
  }

  /**
   * Calculate confidence score for extracted data
   */
  private calculateConfidence(article: TechCrunchArticle, extracted: Partial<TechCrunchFundingData>): number {
    let confidence = 50 // Base confidence
    
    // Boost for relevant keywords
    if (article.cybersecurityRelevant) confidence += 20
    
    // Boost for extracted amount
    if (extracted.amount) confidence += 15
    
    // Boost for extracted round type
    if (extracted.roundType) confidence += 10
    
    // Boost for article relevance score
    confidence += (article.relevanceScore / 100) * 5
    
    return Math.min(confidence, 100)
  }

  /**
   * Remove duplicate funding entries
   */
  private removeDuplicates(data: TechCrunchFundingData[]): TechCrunchFundingData[] {
    const seen = new Set()
    return data.filter(item => {
      const key = `${item.companyName}-${item.announcedDate}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    lastSync: string
    totalArticles: number
    errorRate: number
  }> {
    try {
      // Simulate health check
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        status: 'healthy',
        lastSync: new Date().toISOString(),
        totalArticles: 2847,
        errorRate: 0.02
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        lastSync: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        totalArticles: 0,
        errorRate: 1.0
      }
    }
  }
}

// Export singleton instance
export const techcrunchService = new TechCrunchService()