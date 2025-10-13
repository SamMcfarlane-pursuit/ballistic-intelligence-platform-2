/**
 * News & Signals Agent
 * Proactive monitoring and analysis of company business milestones and momentum
 * 3-Phase Framework: Gather → Process → Analyze
 */

interface CompanySignal {
  id: string
  companyName: string
  eventType: 'partnership' | 'product_launch' | 'executive_hire' | 'customer_win' | 'funding' | 'acquisition' | 'other'
  title: string
  description: string
  sentiment: 'positive' | 'neutral' | 'negative'
  confidence: number
  source: string
  sourceUrl: string
  publishedDate: Date
  extractedEntities: {
    partnerCompany?: string
    productName?: string
    executiveName?: string
    executiveTitle?: string
    customerName?: string
    fundingAmount?: number
  }
}

interface CompanyTimeline {
  companyName: string
  signals: CompanySignal[]
  momentum: {
    score: number // 0-100
    trend: 'increasing' | 'stable' | 'decreasing'
    recentActivity: number
    positiveSignals: number
    negativeSignals: number
  }
  lastUpdated: Date
}

interface MonitoringTarget {
  companyName: string
  website: string
  socialMediaAccounts: {
    linkedin?: string
    twitter?: string
    blog?: string
  }
  keyExecutives: string[]
  monitoringActive: boolean
  lastChecked: Date
}

export class NewsSignalsAgent {
  private monitoringTargets: MonitoringTarget[] = []
  private companyTimelines: Map<string, CompanyTimeline> = new Map()
  private geminiApiKey: string
  private newsApiKey: string

  constructor(geminiApiKey: string, newsApiKey: string) {
    this.geminiApiKey = geminiApiKey
    this.newsApiKey = newsApiKey
  }

  /**
   * Add company to monitoring list
   */
  addCompanyToMonitoring(company: {
    name: string
    website: string
    socialMedia?: any
    executives?: string[]
  }): void {
    const target: MonitoringTarget = {
      companyName: company.name,
      website: company.website,
      socialMediaAccounts: company.socialMedia || {},
      keyExecutives: company.executives || [],
      monitoringActive: true,
      lastChecked: new Date()
    }

    this.monitoringTargets.push(target)
    console.log(`📡 Added ${company.name} to monitoring list`)
  }

  /**
   * Phase 1: Gather - Proactive and continuous monitoring
   */
  async gatherSignals(companyName: string): Promise<any[]> {
    console.log(`📡 Phase 1: Gathering signals for ${companyName}`)
    
    const target = this.monitoringTargets.find(t => t.companyName === companyName)
    if (!target) {
      throw new Error(`Company ${companyName} not in monitoring list`)
    }

    const gatheredSignals: any[] = []

    try {
      // Method 1: Direct Source Monitoring
      const directSources = await this.monitorDirectSources(target)
      gatheredSignals.push(...directSources)

      // Method 2: Targeted News Alerts
      const newsAlerts = await this.gatherTargetedNewsAlerts(target)
      gatheredSignals.push(...newsAlerts)

      // Method 3: Social Media Monitoring
      const socialSignals = await this.monitorSocialMedia(target)
      gatheredSignals.push(...socialSignals)

      // Method 4: Executive Monitoring
      const executiveSignals = await this.monitorExecutives(target)
      gatheredSignals.push(...executiveSignals)

      console.log(`✅ Phase 1 completed: Gathered ${gatheredSignals.length} signals`)
      return gatheredSignals

    } catch (error) {
      console.error('❌ Signal gathering failed:', error)
      return []
    }
  }

  /**
   * Monitor company's direct sources (website, blog, newsroom)
   */
  private async monitorDirectSources(target: MonitoringTarget): Promise<any[]> {
    console.log(`🌐 Monitoring direct sources for ${target.companyName}`)
    
    const sources: any[] = []

    try {
      // Monitor company blog
      if (target.website) {
        const blogPosts = await this.scrapeBlogPosts(target.website)
        sources.push(...blogPosts)
      }

      // Monitor newsroom/press section
      const pressReleases = await this.scrapeNewsroom(target.website)
      sources.push(...pressReleases)

      // Monitor product pages for new launches
      const productUpdates = await this.monitorProductPages(target.website)
      sources.push(...productUpdates)

      return sources

    } catch (error) {
      console.error('Direct source monitoring failed:', error)
      return []
    }
  }

  /**
   * Scrape company blog for new posts
   */
  private async scrapeBlogPosts(website: string): Promise<any[]> {
    try {
      console.log(`📝 Scraping blog posts from ${website}`)
      
      // In production: Scrape /blog, /insights, /news pages
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock blog posts
      return [
        {
          title: 'Announcing Our New AI-Powered Threat Detection Engine',
          content: 'We are excited to launch our next-generation threat detection...',
          url: `${website}/blog/new-ai-threat-detection`,
          publishedDate: new Date(),
          source: 'company_blog'
        },
        {
          title: 'Partnership with Major Cloud Provider Announced',
          content: 'Today we announced a strategic partnership with AWS...',
          url: `${website}/blog/aws-partnership`,
          publishedDate: new Date(Date.now() - 86400000), // Yesterday
          source: 'company_blog'
        }
      ]

    } catch (error) {
      console.error('Blog scraping failed:', error)
      return []
    }
  }

  /**
   * Scrape company newsroom for press releases
   */
  private async scrapeNewsroom(website: string): Promise<any[]> {
    try {
      console.log(`📰 Scraping newsroom from ${website}`)
      
      await new Promise(resolve => setTimeout(resolve, 800))

      return [
        {
          title: 'Company Appoints New Chief Revenue Officer',
          content: 'We are pleased to announce the appointment of Sarah Johnson as CRO...',
          url: `${website}/news/new-cro-appointment`,
          publishedDate: new Date(Date.now() - 172800000), // 2 days ago
          source: 'company_newsroom'
        }
      ]

    } catch (error) {
      console.error('Newsroom scraping failed:', error)
      return []
    }
  }

  /**
   * Monitor product pages for updates and launches
   */
  private async monitorProductPages(website: string): Promise<any[]> {
    try {
      console.log(`🚀 Monitoring product pages for ${website}`)
      
      await new Promise(resolve => setTimeout(resolve, 600))

      return [
        {
          title: 'New Feature: Advanced Behavioral Analytics',
          content: 'Our latest product update includes advanced behavioral analytics...',
          url: `${website}/products/behavioral-analytics`,
          publishedDate: new Date(Date.now() - 259200000), // 3 days ago
          source: 'product_page'
        }
      ]

    } catch (error) {
      console.error('Product page monitoring failed:', error)
      return []
    }
  }

  /**
   * Gather targeted news alerts using intelligent queries
   */
  private async gatherTargetedNewsAlerts(target: MonitoringTarget): Promise<any[]> {
    console.log(`🔔 Gathering targeted news alerts for ${target.companyName}`)
    
    const alerts: any[] = []

    try {
      // Intelligent news queries
      const queries = [
        `"${target.companyName}" AND (partnership OR "new product" OR "customer win")`,
        `"${target.companyName}" AND (funding OR investment OR acquisition)`,
        `"${target.companyName}" AND (hire OR appointment OR "joins as")`,
        `"${target.companyName}" cybersecurity AND (launch OR release OR announce)`
      ]

      for (const query of queries) {
        const newsResults = await this.searchNews(query)
        alerts.push(...newsResults)
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      return alerts

    } catch (error) {
      console.error('News alert gathering failed:', error)
      return []
    }
  }

  /**
   * Search news using news API
   */
  private async searchNews(query: string): Promise<any[]> {
    try {
      console.log(`🔍 Searching news: "${query}"`)
      
      // In production: Use NewsAPI, Google News API, or similar
      await new Promise(resolve => setTimeout(resolve, 800))

      // Mock news results
      return [
        {
          title: 'CyberSecure Announces Strategic Partnership with Fortune 500 Company',
          content: 'Leading cybersecurity firm CyberSecure today announced...',
          url: 'https://techcrunch.com/cybersecure-partnership',
          publishedDate: new Date(Date.now() - 86400000),
          source: 'TechCrunch'
        },
        {
          title: 'CyberSecure Lands Major Enterprise Customer',
          content: 'CyberSecure has secured a significant customer win...',
          url: 'https://venturebeat.com/cybersecure-customer',
          publishedDate: new Date(Date.now() - 172800000),
          source: 'VentureBeat'
        }
      ]

    } catch (error) {
      console.error('News search failed:', error)
      return []
    }
  }

  /**
   * Monitor social media accounts for company updates
   */
  private async monitorSocialMedia(target: MonitoringTarget): Promise<any[]> {
    console.log(`📱 Monitoring social media for ${target.companyName}`)
    
    const socialSignals: any[] = []

    try {
      // Monitor LinkedIn company page
      if (target.socialMediaAccounts.linkedin) {
        const linkedinPosts = await this.monitorLinkedInCompany(target.socialMediaAccounts.linkedin)
        socialSignals.push(...linkedinPosts)
      }

      // Monitor Twitter/X account
      if (target.socialMediaAccounts.twitter) {
        const tweets = await this.monitorTwitterAccount(target.socialMediaAccounts.twitter)
        socialSignals.push(...tweets)
      }

      return socialSignals

    } catch (error) {
      console.error('Social media monitoring failed:', error)
      return []
    }
  }

  /**
   * Monitor LinkedIn company page
   */
  private async monitorLinkedInCompany(linkedinUrl: string): Promise<any[]> {
    try {
      console.log(`💼 Monitoring LinkedIn: ${linkedinUrl}`)
      
      await new Promise(resolve => setTimeout(resolve, 1000))

      return [
        {
          title: 'Excited to announce our Series B funding round!',
          content: 'We are thrilled to share that we have closed our Series B...',
          url: linkedinUrl + '/posts/series-b-announcement',
          publishedDate: new Date(Date.now() - 345600000), // 4 days ago
          source: 'linkedin'
        }
      ]

    } catch (error) {
      console.error('LinkedIn monitoring failed:', error)
      return []
    }
  }

  /**
   * Monitor Twitter/X account
   */
  private async monitorTwitterAccount(twitterUrl: string): Promise<any[]> {
    try {
      console.log(`🐦 Monitoring Twitter: ${twitterUrl}`)
      
      await new Promise(resolve => setTimeout(resolve, 800))

      return [
        {
          title: 'Just shipped our biggest product update yet! 🚀',
          content: 'Our new AI-powered dashboard is now live for all customers...',
          url: twitterUrl + '/status/product-update',
          publishedDate: new Date(Date.now() - 432000000), // 5 days ago
          source: 'twitter'
        }
      ]

    } catch (error) {
      console.error('Twitter monitoring failed:', error)
      return []
    }
  }

  /**
   * Monitor key executives' social media and public appearances
   */
  private async monitorExecutives(target: MonitoringTarget): Promise<any[]> {
    console.log(`👥 Monitoring executives for ${target.companyName}`)
    
    const executiveSignals: any[] = []

    try {
      for (const executive of target.keyExecutives) {
        // Monitor executive LinkedIn posts
        const linkedinActivity = await this.monitorExecutiveLinkedIn(executive)
        executiveSignals.push(...linkedinActivity)

        // Monitor speaking engagements and interviews
        const publicAppearances = await this.monitorExecutiveAppearances(executive, target.companyName)
        executiveSignals.push(...publicAppearances)
      }

      return executiveSignals

    } catch (error) {
      console.error('Executive monitoring failed:', error)
      return []
    }
  }

  /**
   * Monitor executive LinkedIn activity
   */
  private async monitorExecutiveLinkedIn(executiveName: string): Promise<any[]> {
    try {
      console.log(`💼 Monitoring LinkedIn activity for ${executiveName}`)
      
      await new Promise(resolve => setTimeout(resolve, 600))

      return [
        {
          title: `${executiveName} shares insights on cybersecurity trends`,
          content: 'Excited to share my thoughts on the future of AI in cybersecurity...',
          url: `https://linkedin.com/in/${executiveName.toLowerCase().replace(' ', '-')}/post`,
          publishedDate: new Date(Date.now() - 518400000), // 6 days ago
          source: 'executive_linkedin'
        }
      ]

    } catch (error) {
      console.error('Executive LinkedIn monitoring failed:', error)
      return []
    }
  }

  /**
   * Monitor executive public appearances and interviews
   */
  private async monitorExecutiveAppearances(executiveName: string, companyName: string): Promise<any[]> {
    try {
      console.log(`🎤 Monitoring public appearances for ${executiveName}`)
      
      await new Promise(resolve => setTimeout(resolve, 700))

      return [
        {
          title: `${executiveName} keynotes at RSA Conference`,
          content: `${companyName} CEO ${executiveName} delivered keynote on zero-trust security...`,
          url: 'https://rsaconference.com/keynote-cybersecure',
          publishedDate: new Date(Date.now() - 604800000), // 7 days ago
          source: 'conference'
        }
      ]

    } catch (error) {
      console.error('Executive appearance monitoring failed:', error)
      return []
    }
  }

  /**
   * Phase 2: Process - Event Extraction and Categorization
   */
  async processSignals(rawSignals: any[], companyName: string): Promise<CompanySignal[]> {
    console.log(`🔄 Phase 2: Processing ${rawSignals.length} signals for ${companyName}`)
    
    const processedSignals: CompanySignal[] = []

    try {
      for (const signal of rawSignals) {
        const processed = await this.extractAndCategorizeEvent(signal, companyName)
        if (processed) {
          processedSignals.push(processed)
        }
      }

      console.log(`✅ Phase 2 completed: Processed ${processedSignals.length} signals`)
      return processedSignals

    } catch (error) {
      console.error('❌ Signal processing failed:', error)
      return []
    }
  }

  /**
   * Extract and categorize business events using Gemini
   */
  private async extractAndCategorizeEvent(signal: any, companyName: string): Promise<CompanySignal | null> {
    try {
      const prompt = this.buildEventExtractionPrompt(signal.title, signal.content, companyName)
      const extraction = await this.callGeminiForEventExtraction(prompt)
      
      if (!extraction) return null

      const processedSignal: CompanySignal = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        companyName: companyName,
        eventType: extraction.eventType,
        title: signal.title,
        description: extraction.description || signal.content.slice(0, 200),
        sentiment: extraction.sentiment,
        confidence: extraction.confidence,
        source: signal.source,
        sourceUrl: signal.url,
        publishedDate: new Date(signal.publishedDate),
        extractedEntities: extraction.entities || {}
      }

      return processedSignal

    } catch (error) {
      console.error('Event extraction failed:', error)
      return null
    }
  }

  /**
   * Build prompt for event extraction
   */
  private buildEventExtractionPrompt(title: string, content: string, companyName: string): string {
    return `
You are an expert at extracting business events from news articles and company announcements.

Analyze this content about ${companyName} and extract the business event:

Title: "${title}"
Content: "${content.slice(0, 1000)}"

Categorize the event as one of:
- partnership: Strategic partnerships, integrations, collaborations
- product_launch: New products, features, services launched
- executive_hire: New executives, leadership appointments
- customer_win: New customers, case studies, customer success stories
- funding: Investment rounds, funding announcements
- acquisition: Acquisitions, mergers, strategic purchases
- other: Other significant business events

Return JSON with:
{
  "eventType": "partnership|product_launch|executive_hire|customer_win|funding|acquisition|other",
  "description": "Brief description of the event",
  "sentiment": "positive|neutral|negative",
  "confidence": 0.95,
  "entities": {
    "partnerCompany": "partner name if partnership",
    "productName": "product name if launch",
    "executiveName": "executive name if hire",
    "executiveTitle": "executive title if hire",
    "customerName": "customer name if win",
    "fundingAmount": 10000000
  }
}

Return only valid JSON, no additional text.
`
  }

  /**
   * Call Gemini for event extraction
   */
  private async callGeminiForEventExtraction(prompt: string): Promise<any | null> {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + this.geminiApiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
        })
      })

      if (!response.ok) return null

      const data = await response.json()
      const text = data.candidates[0]?.content?.parts[0]?.text
      
      if (!text) return null

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null

    } catch (error) {
      console.error('Gemini event extraction failed:', error)
      return null
    }
  }

  /**
   * Phase 3: Analyze - Strategic Picture and Momentum Analysis
   */
  async analyzeSignals(signals: CompanySignal[], companyName: string): Promise<CompanyTimeline> {
    console.log(`📊 Phase 3: Analyzing signals for ${companyName}`)
    
    try {
      // Create or update company timeline
      const timeline: CompanyTimeline = {
        companyName: companyName,
        signals: signals.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime()),
        momentum: this.calculateMomentumScore(signals),
        lastUpdated: new Date()
      }

      // Store timeline
      this.companyTimelines.set(companyName, timeline)

      console.log(`✅ Phase 3 completed: Momentum score ${timeline.momentum.score}/100`)
      return timeline

    } catch (error) {
      console.error('❌ Signal analysis failed:', error)
      throw error
    }
  }

  /**
   * Calculate company momentum score based on signals
   */
  private calculateMomentumScore(signals: CompanySignal[]): any {
    const now = Date.now()
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
    
    // Recent signals (last 30 days)
    const recentSignals = signals.filter(s => s.publishedDate.getTime() > thirtyDaysAgo)
    
    // Sentiment analysis
    const positiveSignals = signals.filter(s => s.sentiment === 'positive').length
    const negativeSignals = signals.filter(s => s.sentiment === 'negative').length
    
    // Event type weighting
    const eventWeights = {
      funding: 25,
      partnership: 20,
      customer_win: 15,
      product_launch: 15,
      executive_hire: 10,
      acquisition: 25,
      other: 5
    }
    
    // Calculate weighted score
    let weightedScore = 0
    for (const signal of recentSignals) {
      const weight = eventWeights[signal.eventType] || 5
      const sentimentMultiplier = signal.sentiment === 'positive' ? 1 : 
                                 signal.sentiment === 'negative' ? -0.5 : 0.5
      weightedScore += weight * sentimentMultiplier * signal.confidence
    }
    
    // Normalize to 0-100 scale
    const normalizedScore = Math.min(100, Math.max(0, weightedScore))
    
    // Determine trend
    const recentScore = this.calculateRecentTrend(signals)
    const trend = recentScore > 60 ? 'increasing' : 
                  recentScore < 40 ? 'decreasing' : 'stable'
    
    return {
      score: Math.round(normalizedScore),
      trend: trend,
      recentActivity: recentSignals.length,
      positiveSignals: positiveSignals,
      negativeSignals: negativeSignals
    }
  }

  /**
   * Calculate recent trend based on signal timing
   */
  private calculateRecentTrend(signals: CompanySignal[]): number {
    const now = Date.now()
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = now - (14 * 24 * 60 * 60 * 1000)
    
    const lastWeekSignals = signals.filter(s => s.publishedDate.getTime() > sevenDaysAgo)
    const previousWeekSignals = signals.filter(s => 
      s.publishedDate.getTime() > fourteenDaysAgo && 
      s.publishedDate.getTime() <= sevenDaysAgo
    )
    
    const lastWeekScore = lastWeekSignals.length * 10
    const previousWeekScore = previousWeekSignals.length * 10
    
    if (previousWeekScore === 0) return 50 // Neutral if no previous data
    
    return Math.min(100, (lastWeekScore / previousWeekScore) * 50)
  }

  /**
   * Get company timeline
   */
  getCompanyTimeline(companyName: string): CompanyTimeline | null {
    return this.companyTimelines.get(companyName) || null
  }

  /**
   * Get all monitored companies
   */
  getMonitoredCompanies(): MonitoringTarget[] {
    return this.monitoringTargets
  }

  /**
   * Execute complete monitoring cycle for a company
   */
  async executeMonitoringCycle(companyName: string): Promise<CompanyTimeline> {
    console.log(`🔄 Executing complete monitoring cycle for ${companyName}`)
    
    try {
      // Phase 1: Gather
      const rawSignals = await this.gatherSignals(companyName)
      
      // Phase 2: Process
      const processedSignals = await this.processSignals(rawSignals, companyName)
      
      // Phase 3: Analyze
      const timeline = await this.analyzeSignals(processedSignals, companyName)
      
      // Update last checked time
      const target = this.monitoringTargets.find(t => t.companyName === companyName)
      if (target) {
        target.lastChecked = new Date()
      }
      
      return timeline
      
    } catch (error) {
      console.error(`❌ Monitoring cycle failed for ${companyName}:`, error)
      throw error
    }
  }

  /**
   * Get agent status
   */
  getAgentStatus(): any {
    return {
      name: 'News & Signals Agent',
      status: 'operational',
      monitoredCompanies: this.monitoringTargets.length,
      activeTimelines: this.companyTimelines.size,
      capabilities: [
        'Direct source monitoring (blogs, newsrooms)',
        'Targeted news alerts with intelligent queries',
        'Social media monitoring (LinkedIn, Twitter)',
        'Executive activity tracking',
        'Event extraction and categorization',
        'Sentiment analysis and momentum scoring',
        'Timeline visualization and trend analysis'
      ],
      phases: {
        'Phase 1': 'Gather - Proactive monitoring of multiple sources',
        'Phase 2': 'Process - Event extraction and categorization',
        'Phase 3': 'Analyze - Strategic momentum and timeline analysis'
      }
    }
  }
}

export default NewsSignalsAgent