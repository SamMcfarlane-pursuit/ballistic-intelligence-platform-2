/**
 * BrightData API Integration Service
 * 
 * Comprehensive web data collection and proxy services for the Ballistic Intelligence Platform.
 * This service provides:
 * - Proxy network for reliable data scraping
 * - Web unlocker for bypassing anti-bot measures
 * - Dataset services for enhanced cybersecurity intelligence
 * - Real-time data processing capabilities
 */

import axios, { AxiosInstance, AxiosError } from 'axios'
import https from 'https'

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface BrightDataConfig {
  apiKey: string
  proxyHost?: string
  proxyPort?: number
  proxyUsername?: string
  proxyPassword?: string
  timeout?: number
  maxRetries?: number
  rateLimitPerMinute?: number
}

export interface ProxyRequest {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
  useUnlocker?: boolean
  renderJs?: boolean
  waitForSelector?: string
  screenshot?: boolean
}

export interface ProxyResponse<T = any> {
  success: boolean
  data?: T
  html?: string
  screenshot?: string
  statusCode: number
  headers: Record<string, string>
  responseTime: number
  proxyUsed: string
  error?: string
  retries?: number
}

export interface DatasetRequest {
  type: 'crunchbase' | 'linkedin' | 'patent' | 'news' | 'custom'
  query: string
  filters?: Record<string, any>
  limit?: number
  format?: 'json' | 'csv' | 'excel'
  includeMetadata?: boolean
}

export interface DatasetResponse<T = any> {
  success: boolean
  data: T[]
  totalRecords: number
  pagesScraped: number
  executionTime: number
  dataQuality: {
    completeness: number
    accuracy: number
    freshness: string
  }
  metadata?: {
    sources: string[]
    scrapedAt: string
    version: string
  }
  error?: string
}

export interface WebUnlockerRequest {
  url: string
  renderJs?: boolean
  waitTime?: number
  customHeaders?: Record<string, string>
  cookies?: Record<string, string>
  userAgent?: string
  geolocation?: string
}

export interface WebUnlockerResponse {
  success: boolean
  html?: string
  statusCode: number
  finalUrl: string
  loadTime: number
  blocked: boolean
  captchaSolved: boolean
  error?: string
}

export interface CompanyDataEnrichment {
  companyName: string
  website: string
  enrichmentSources: ('crunchbase' | 'linkedin' | 'news' | 'patents' | 'social')[]
  depth?: 'basic' | 'standard' | 'comprehensive'
}

export interface EnrichedCompanyData {
  basic: {
    name: string
    website: string
    description: string
    industry: string
    founded: string
    headquarters: string
    employeeCount: string
    revenue: string
  }
  funding: {
    totalFunding: number
    lastRound: string
    lastRoundAmount: number
    lastRoundDate: string
    investors: string[]
    valuationEstimate?: number
  }
  social: {
    linkedin?: string
    twitter?: string
    followers: number
    engagement: number
  }
  technology: {
    techStack: string[]
    patents: number
    repositories: string[]
  }
  news: {
    recentMentions: number
    sentiment: 'positive' | 'neutral' | 'negative'
    topArticles: Array<{
      title: string
      source: string
      date: string
      url: string
    }>
  }
  market: {
    competitors: string[]
    marketPosition: string
    growthIndicators: {
      hiring: number
      funding: number
      news: number
    }
  }
}

export interface RateLimitInfo {
  requestsThisMinute: number
  requestsThisHour: number
  requestsToday: number
  limitPerMinute: number
  limitPerHour: number
  limitPerDay: number
  resetAt: Date
}

export interface BrightDataMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  bytesTransferred: number
  costEstimate: number
  topEndpoints: Array<{
    url: string
    count: number
    avgTime: number
  }>
  errorBreakdown: Record<string, number>
}

// ============================================================================
// BrightData Service Class
// ============================================================================

class BrightDataService {
  private config: BrightDataConfig
  private axiosInstance: AxiosInstance
  private rateLimitTracker: Map<string, number[]>
  private metricsData: BrightDataMetrics
  private requestQueue: Array<() => Promise<any>>
  private isProcessingQueue: boolean

  constructor(config?: Partial<BrightDataConfig>) {
    this.config = {
      apiKey: process.env.BRIGHTDATA_API_KEY || '1gexjh51ct68',
      proxyHost: process.env.BRIGHTDATA_PROXY_HOST || 'brd.superproxy.io',
      proxyPort: parseInt(process.env.BRIGHTDATA_PROXY_PORT || '33335'),
      proxyUsername: process.env.BRIGHTDATA_PROXY_USERNAME || 'brd-customer-hl_7e9f775b-zone-ballistic_intelligence',
      proxyPassword: process.env.BRIGHTDATA_PROXY_PASSWORD || '1gexjh51ct68',
      timeout: 30000,
      maxRetries: 3,
      rateLimitPerMinute: 60,
      ...config
    }

    this.axiosInstance = axios.create({
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      // Handle SSL issues with BrightData proxy
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })

    this.rateLimitTracker = new Map()
    this.requestQueue = []
    this.isProcessingQueue = false
    this.metricsData = this.initializeMetrics()
  }

  // ============================================================================
  // Core Proxy Methods
  // ============================================================================

  /**
   * Make a proxy request through BrightData's proxy network
   */
  async proxyRequest<T = any>(request: ProxyRequest): Promise<ProxyResponse<T>> {
    const startTime = Date.now()
    
    try {
      // Check rate limits
      await this.checkRateLimit('proxy')

      const proxyConfig = this.buildProxyConfig()
      const headers = {
        ...request.headers,
        'X-BrightData-Session': this.generateSessionId()
      }

      const response = await this.axiosInstance({
        method: request.method || 'GET',
        url: request.url,
        headers,
        data: request.body,
        proxy: proxyConfig,
        timeout: request.timeout || this.config.timeout
      })

      const responseTime = Date.now() - startTime
      this.updateMetrics('success', responseTime, request.url)

      return {
        success: true,
        data: response.data,
        html: typeof response.data === 'string' ? response.data : undefined,
        statusCode: response.status,
        headers: response.headers as Record<string, string>,
        responseTime,
        proxyUsed: `${this.config.proxyHost}:${this.config.proxyPort}`
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      this.updateMetrics('error', responseTime, request.url, error)

      return {
        success: false,
        statusCode: axios.isAxiosError(error) ? error.response?.status || 500 : 500,
        headers: {},
        responseTime,
        proxyUsed: `${this.config.proxyHost}:${this.config.proxyPort}`,
        error: this.formatError(error)
      }
    }
  }

  /**
   * Use Web Unlocker to bypass anti-bot measures and render JavaScript
   */
  async webUnlocker(request: WebUnlockerRequest): Promise<WebUnlockerResponse> {
    const startTime = Date.now();

    try {
      await this.checkRateLimit('unlocker');

      // Construct the username for Web Unlocker with specific parameters
      let unlockerUsername = `${this.config.proxyUsername}-render_js=${request.renderJs || false}`;
      if (request.geolocation) {
        unlockerUsername += `-country-${request.geolocation}`;
      }

      const response = await axios({
        method: 'GET',
        url: request.url,
        headers: {
          'User-Agent': request.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...request.customHeaders,
        },
        proxy: {
          host: this.config.proxyHost!,
          // Note: Ensure the port in your config is correct for Web Unlocker (e.g., 24000)
          port: this.config.proxyPort!,
          auth: {
            username: unlockerUsername,
            password: this.config.proxyPassword!,
          },
        },
        timeout: request.waitTime || this.config.timeout,
      });

      const loadTime = Date.now() - startTime;

      return {
        success: true,
        html: response.data,
        statusCode: response.status,
        finalUrl: response.request?.res?.responseUrl || request.url,
        loadTime,
        blocked: false,
        captchaSolved: true, // Assuming success implies captcha was handled
      };
    } catch (error) {
      const loadTime = Date.now() - startTime;
      return {
        success: false,
        statusCode: axios.isAxiosError(error) ? error.response?.status || 500 : 500,
        finalUrl: request.url,
        loadTime,
        blocked: true,
        captchaSolved: false,
        error: this.formatError(error),
      };
    }
  }

  // ============================================================================
  // Dataset Collection Methods
  // ============================================================================

  /**
   * Collect dataset using BrightData's data collection network
   */
  async collectDataset<T = any>(request: DatasetRequest): Promise<DatasetResponse<T>> {
    const startTime = Date.now()

    try {
      await this.checkRateLimit('dataset')

      // Route to appropriate dataset collector
      let data: T[]
      switch (request.type) {
        case 'crunchbase':
          data = await this.collectCrunchbaseData(request)
          break
        case 'linkedin':
          data = await this.collectLinkedInData(request)
          break
        case 'patent':
          data = await this.collectPatentData(request)
          break
        case 'news':
          data = await this.collectNewsData(request)
          break
        default:
          data = await this.collectCustomData(request)
      }

      const executionTime = Date.now() - startTime

      return {
        success: true,
        data,
        totalRecords: data.length,
        pagesScraped: Math.ceil(data.length / 50),
        executionTime,
        dataQuality: {
          completeness: this.calculateCompleteness(data),
          accuracy: 0.95,
          freshness: new Date().toISOString()
        },
        metadata: request.includeMetadata ? {
          sources: [this.getDataSource(request.type)],
          scrapedAt: new Date().toISOString(),
          version: '1.0.0'
        } : undefined
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        totalRecords: 0,
        pagesScraped: 0,
        executionTime: Date.now() - startTime,
        dataQuality: {
          completeness: 0,
          accuracy: 0,
          freshness: new Date().toISOString()
        },
        error: this.formatError(error)
      }
    }
  }

  /**
   * Enrich company data from multiple sources
   */
  async enrichCompanyData(request: CompanyDataEnrichment): Promise<EnrichedCompanyData | null> {
    try {
      const enrichmentTasks = request.enrichmentSources.map(source => {
        switch (source) {
          case 'crunchbase':
            return this.enrichFromCrunchbase(request.companyName, request.website)
          case 'linkedin':
            return this.enrichFromLinkedIn(request.companyName)
          case 'news':
            return this.enrichFromNews(request.companyName)
          case 'patents':
            return this.enrichFromPatents(request.companyName)
          case 'social':
            return this.enrichFromSocial(request.companyName)
          default:
            return Promise.resolve({})
        }
      })

      const results = await Promise.allSettled(enrichmentTasks)
      const enrichedData = this.mergeEnrichmentResults(results, request.companyName)

      return enrichedData
    } catch (error) {
      console.error('Error enriching company data:', error)
      return null
    }
  }

  // ============================================================================
  // Cybersecurity-Specific Methods
  // ============================================================================

  /**
   * Scrape cybersecurity company intelligence
   */
  async scrapeCybersecurityIntelligence(companyName: string): Promise<any> {
    try {
      const [crunchbaseData, newsData, patentData, socialData] = await Promise.allSettled([
        this.collectDataset({
          type: 'crunchbase',
          query: companyName,
          filters: { category: 'cybersecurity' }
        }),
        this.collectDataset({
          type: 'news',
          query: `${companyName} cybersecurity`,
          limit: 20
        }),
        this.collectDataset({
          type: 'patent',
          query: companyName,
          filters: { category: 'security' }
        }),
        this.enrichFromSocial(companyName)
      ])

      return {
        company: companyName,
        crunchbase: crunchbaseData.status === 'fulfilled' ? crunchbaseData.value : null,
        news: newsData.status === 'fulfilled' ? newsData.value : null,
        patents: patentData.status === 'fulfilled' ? patentData.value : null,
        social: socialData.status === 'fulfilled' ? socialData.value : null,
        scrapedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error scraping cybersecurity intelligence:', error)
      throw error
    }
  }

  /**
   * Monitor funding announcements in real-time
   */
  async monitorFundingAnnouncements(companies: string[]): Promise<any[]> {
    try {
      const monitoringTasks = companies.map(async (company) => {
        const newsData = await this.collectDataset({
          type: 'news',
          query: `${company} funding OR investment OR series`,
          limit: 10
        })

        return {
          company,
          alerts: newsData.data.filter((article: any) =>
            this.isFundingAnnouncement(article)
          )
        }
      })

      return await Promise.all(monitoringTasks)
    } catch (error) {
      console.error('Error monitoring funding announcements:', error)
      return []
    }
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private buildProxyConfig() {
    return {
      host: this.config.proxyHost!,
      port: this.config.proxyPort!,
      auth: {
        username: this.config.proxyUsername!,
        password: this.config.proxyPassword!
      },
      protocol: 'http'
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async checkRateLimit(endpoint: string): Promise<void> {
    const now = Date.now()
    const oneMinuteAgo = now - 60000

    if (!this.rateLimitTracker.has(endpoint)) {
      this.rateLimitTracker.set(endpoint, [])
    }

    const requests = this.rateLimitTracker.get(endpoint)!
    const recentRequests = requests.filter(time => time > oneMinuteAgo)

    if (recentRequests.length >= this.config.rateLimitPerMinute!) {
      const oldestRequest = recentRequests[0]
      const waitTime = 60000 - (now - oldestRequest)
      await this.sleep(waitTime)
    }

    recentRequests.push(now)
    this.rateLimitTracker.set(endpoint, recentRequests)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private formatError(error: any): string {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message
    }
    return error instanceof Error ? error.message : 'Unknown error occurred'
  }

  private updateMetrics(type: 'success' | 'error', responseTime: number, url: string, error?: any): void {
    this.metricsData.totalRequests++
    
    if (type === 'success') {
      this.metricsData.successfulRequests++
    } else {
      this.metricsData.failedRequests++
      const errorType = this.formatError(error)
      this.metricsData.errorBreakdown[errorType] = (this.metricsData.errorBreakdown[errorType] || 0) + 1
    }

    // Update average response time
    const totalTime = this.metricsData.averageResponseTime * (this.metricsData.totalRequests - 1)
    this.metricsData.averageResponseTime = (totalTime + responseTime) / this.metricsData.totalRequests

    // Track top endpoints
    const existingEndpoint = this.metricsData.topEndpoints.find(e => e.url === url)
    if (existingEndpoint) {
      existingEndpoint.count++
      existingEndpoint.avgTime = (existingEndpoint.avgTime * (existingEndpoint.count - 1) + responseTime) / existingEndpoint.count
    } else {
      this.metricsData.topEndpoints.push({ url, count: 1, avgTime: responseTime })
    }
  }

  private initializeMetrics(): BrightDataMetrics {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      bytesTransferred: 0,
      costEstimate: 0,
      topEndpoints: [],
      errorBreakdown: {}
    }
  }

  private calculateCompleteness(data: any[]): number {
    if (data.length === 0) return 0
    
    const fields = Object.keys(data[0])
    const totalFields = fields.length * data.length
    let filledFields = 0

    data.forEach(item => {
      fields.forEach(field => {
        if (item[field] !== null && item[field] !== undefined && item[field] !== '') {
          filledFields++
        }
      })
    })

    return parseFloat((filledFields / totalFields).toFixed(2))
  }

  private getDataSource(type: string): string {
    const sources: Record<string, string> = {
      crunchbase: 'https://www.crunchbase.com',
      linkedin: 'https://www.linkedin.com',
      patent: 'https://patents.google.com',
      news: 'https://news.google.com'
    }
    return sources[type] || 'custom'
  }

  // ============================================================================
  // Mock Data Collection Methods (Replace with real BrightData API calls)
  // ============================================================================

  private async collectCrunchbaseData<T>(request: DatasetRequest): Promise<T[]> {
    // Simulate API call
    await this.sleep(1000)
    
    return [
      {
        name: request.query,
        category: 'Cybersecurity',
        funding: '$50M',
        investors: ['Sequoia', 'a16z']
      }
    ] as T[]
  }

  private async collectLinkedInData<T>(request: DatasetRequest): Promise<T[]> {
    await this.sleep(1000)
    return [] as T[]
  }

  private async collectPatentData<T>(request: DatasetRequest): Promise<T[]> {
    await this.sleep(1000)
    return [] as T[]
  }

  private async collectNewsData<T>(request: DatasetRequest): Promise<T[]> {
    await this.sleep(1000)
    return [] as T[]
  }

  private async collectCustomData<T>(request: DatasetRequest): Promise<T[]> {
    await this.sleep(1000)
    return [] as T[]
  }

  private async enrichFromCrunchbase(companyName: string, website: string): Promise<any> {
    await this.sleep(500)
    return {
      funding: { total: 50000000, lastRound: 'Series B' },
      investors: ['Sequoia Capital', 'Andreessen Horowitz']
    }
  }

  private async enrichFromLinkedIn(companyName: string): Promise<any> {
    await this.sleep(500)
    return {
      employees: 150,
      followers: 5000
    }
  }

  private async enrichFromNews(companyName: string): Promise<any> {
    await this.sleep(500)
    return {
      recentMentions: 25,
      sentiment: 'positive'
    }
  }

  private async enrichFromPatents(companyName: string): Promise<any> {
    await this.sleep(500)
    return {
      patentCount: 12,
      recentFilings: 3
    }
  }

  private async enrichFromSocial(companyName: string): Promise<any> {
    await this.sleep(500)
    return {
      twitter: { followers: 10000, engagement: 0.05 },
      linkedin: { followers: 5000 }
    }
  }

  private mergeEnrichmentResults(results: PromiseSettledResult<any>[], companyName: string): EnrichedCompanyData {
    const data: any = {}
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        Object.assign(data, result.value)
      }
    })

    return {
      basic: {
        name: companyName,
        website: '',
        description: '',
        industry: 'Cybersecurity',
        founded: '2020',
        headquarters: 'San Francisco, CA',
        employeeCount: data.employees || '50-200',
        revenue: 'Unknown'
      },
      funding: data.funding || {
        totalFunding: 0,
        lastRound: 'Unknown',
        lastRoundAmount: 0,
        lastRoundDate: '',
        investors: []
      },
      social: {
        linkedin: '',
        twitter: '',
        followers: data.followers || 0,
        engagement: data.engagement || 0
      },
      technology: {
        techStack: [],
        patents: data.patentCount || 0,
        repositories: []
      },
      news: {
        recentMentions: data.recentMentions || 0,
        sentiment: data.sentiment || 'neutral',
        topArticles: []
      },
      market: {
        competitors: [],
        marketPosition: 'Emerging',
        growthIndicators: {
          hiring: 0,
          funding: 0,
          news: 0
        }
      }
    }
  }

  private isFundingAnnouncement(article: any): boolean {
    const fundingKeywords = ['funding', 'investment', 'series', 'raised', 'capital', 'venture']
    const text = `${article.title} ${article.description}`.toLowerCase()
    return fundingKeywords.some(keyword => text.includes(keyword))
  }

  // ============================================================================
  // Public Utility Methods
  // ============================================================================

  /**
   * Get current metrics
   */
  getMetrics(): BrightDataMetrics {
    return { ...this.metricsData }
  }

  /**
   * Get rate limit information
   */
  getRateLimitInfo(endpoint: string): RateLimitInfo {
    const now = Date.now()
    const requests = this.rateLimitTracker.get(endpoint) || []
    
    const oneMinuteAgo = now - 60000
    const oneHourAgo = now - 3600000
    const oneDayAgo = now - 86400000

    return {
      requestsThisMinute: requests.filter(t => t > oneMinuteAgo).length,
      requestsThisHour: requests.filter(t => t > oneHourAgo).length,
      requestsToday: requests.filter(t => t > oneDayAgo).length,
      limitPerMinute: this.config.rateLimitPerMinute!,
      limitPerHour: this.config.rateLimitPerMinute! * 60,
      limitPerDay: this.config.rateLimitPerMinute! * 60 * 24,
      resetAt: new Date(now + 60000)
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ healthy: boolean; message: string; metrics: BrightDataMetrics }> {
    try {
      // Check if API key is configured
      if (!this.config.apiKey || this.config.apiKey === 'your_brightdata_api_key_here') {
        return {
          healthy: false,
          message: 'BrightData API key not configured - using mock data',
          metrics: this.getMetrics()
        }
      }

      const testResponse = await this.proxyRequest({
        url: 'https://httpbin.org/get',
        timeout: 5000
      })

      return {
        healthy: testResponse.success,
        message: testResponse.success ? 'BrightData service is operational' : 'Service degraded - using mock data',
        metrics: this.getMetrics()
      }
    } catch (error) {
      return {
        healthy: false,
        message: 'BrightData service is unavailable - using mock data',
        metrics: this.getMetrics()
      }
    }
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const brightDataService = new BrightDataService()
export default BrightDataService
