// News & Signals Agent - Monitor business signals indicating company momentum
// Mission: Monitor and categorize business signals indicating company momentum
// Execution: Once every 24 hours at 2:00 AM, runs for each company in database

interface BusinessSignal {
  companyId: string
  eventType: 'partnership' | 'product_launch' | 'executive_hire' | 'customer_win' | 'acquisition' | 'award' | 'funding' | 'other'
  eventDate: string
  summary: string
  sentiment: 'positive' | 'neutral' | 'negative'
  sourceUrl: string
  confidence: number
}

interface CompanyNews {
  companyName: string
  articles: NewsArticle[]
  signals: BusinessSignal[]
}

interface NewsArticle {
  title: string
  content: string
  publishedDate: string
  sourceUrl: string
  source: 'website' | 'newsapi' | 'rss'
}

export class NewsSignalsAgent {
  private companies: string[] = []
  private signals: BusinessSignal[] = []

  constructor() {
    // Initialize with companies from database
    this.companies = [
      'Exabeam', 'Securonix', 'Vectra', 'Cybereason', 'CrowdStrike',
      'SentinelOne', 'Okta', 'Zscaler', 'Palo Alto Networks'
    ]
  }

  // Main execution method - runs daily at 2:00 AM
  async executeSignalsMonitoring(): Promise<any> {
    console.log('📡 Starting News & Signals Agent...')
    console.log(`🎯 Monitoring ${this.companies.length} companies for business signals`)
    
    try {
      const allSignals: BusinessSignal[] = []
      
      for (const company of this.companies) {
        console.log(`\n🔍 Processing signals for ${company}...`)
        
        // Phase 1: Gather (Targeted Monitoring)
        const companyNews = await this.gatherCompanyNews(company)
        
        // Phase 2: Process (Event Extraction)
        const extractedSignals = await this.processNewsForSignals(company, companyNews)
        
        // Phase 3: Analyze (Sentiment & Timeline)
        const analyzedSignals = await this.analyzeSignals(extractedSignals)
        
        allSignals.push(...analyzedSignals)
        
        // Rate limiting between companies
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
      // Save all signals to database
      this.signals.push(...allSignals)
      
      return {
        success: true,
        data: {
          companiesProcessed: this.companies.length,
          signalsDetected: allSignals.length,
          signalsByType: this.groupSignalsByType(allSignals),
          signalsBySentiment: this.groupSignalsBySentiment(allSignals),
          topSignals: allSignals.slice(0, 10),
          timestamp: new Date().toISOString()
        }
      }
      
    } catch (error) {
      console.error('❌ News & Signals Agent failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      }
    }
  }

  // Phase 1: Gather (Targeted Monitoring)
  private async gatherCompanyNews(companyName: string): Promise<CompanyNews> {
    console.log(`📰 Phase 1: Gathering news for ${companyName}`)
    
    const companyNews: CompanyNews = {
      companyName,
      articles: [],
      signals: []
    }

    try {
      // Company website monitoring
      const websiteNews = await this.monitorCompanyWebsite(companyName)
      companyNews.articles.push(...websiteNews)

      // NewsAPI targeted searches
      const newsApiArticles = await this.searchNewsAPI(companyName)
      companyNews.articles.push(...newsApiArticles)

      // Social media monitoring (manual check for MVP)
      await this.createSocialMediaVerificationTask(companyName)

      console.log(`✅ Gathered ${companyNews.articles.length} articles for ${companyName}`)
      return companyNews
      
    } catch (error) {
      console.error(`❌ Failed to gather news for ${companyName}:`, error)
      return companyNews
    }
  }

  // Phase 2: Process (Event Extraction)
  private async processNewsForSignals(companyName: string, companyNews: CompanyNews): Promise<BusinessSignal[]> {
    console.log(`🧠 Phase 2: Processing ${companyNews.articles.length} articles for signals`)
    
    const signals: BusinessSignal[] = []

    for (const article of companyNews.articles) {
      try {
        const extractedSignals = await this.extractSignalsFromArticle(companyName, article)
        signals.push(...extractedSignals)
      } catch (error) {
        console.error(`❌ Failed to process article: ${article.title}`, error)
      }
    }

    console.log(`✅ Extracted ${signals.length} signals from articles`)
    return signals
  }

  // Phase 3: Analyze (Sentiment & Timeline)
  private async analyzeSignals(signals: BusinessSignal[]): Promise<BusinessSignal[]> {
    console.log(`📊 Phase 3: Analyzing ${signals.length} signals`)
    
    const analyzedSignals: BusinessSignal[] = []

    for (const signal of signals) {
      // Validate event relevance
      if (this.isRelevantSignal(signal)) {
        // Assign sentiment based on event type
        signal.sentiment = this.assignSentiment(signal.eventType)
        analyzedSignals.push(signal)
      }
    }

    console.log(`✅ Validated ${analyzedSignals.length} relevant signals`)
    return analyzedSignals
  }

  // Helper: Monitor company website for news
  private async monitorCompanyWebsite(companyName: string): Promise<NewsArticle[]> {
    // Mock website monitoring - in production, scrape /blog, /newsroom, /press pages
    const mockArticles: NewsArticle[] = [
      {
        title: `${companyName} Announces Strategic Partnership with Microsoft`,
        content: `${companyName} today announced a strategic partnership with Microsoft to enhance cybersecurity solutions...`,
        publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        sourceUrl: `https://www.${companyName.toLowerCase()}.com/news/microsoft-partnership`,
        source: 'website'
      },
      {
        title: `${companyName} Launches New AI-Powered Threat Detection Platform`,
        content: `${companyName} unveiled its latest AI-powered threat detection platform, featuring advanced machine learning capabilities...`,
        publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        sourceUrl: `https://www.${companyName.toLowerCase()}.com/news/ai-platform-launch`,
        source: 'website'
      }
    ]

    return mockArticles
  }

  // Helper: Search NewsAPI for company mentions
  private async searchNewsAPI(companyName: string): Promise<NewsArticle[]> {
    // Mock NewsAPI search - in production, use actual NewsAPI
    const searchQueries = [
      `"${companyName}" AND (partnership OR integration)`,
      `"${companyName}" AND ("new product" OR launch)`,
      `"${companyName}" AND (acquisition OR "acquires")`
    ]

    const mockArticles: NewsArticle[] = [
      {
        title: `${companyName} Partners with AWS for Enhanced Cloud Security`,
        content: `Cybersecurity firm ${companyName} announced a new partnership with Amazon Web Services...`,
        publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        sourceUrl: `https://techcrunch.com/${companyName.toLowerCase()}-aws-partnership`,
        source: 'newsapi'
      }
    ]

    return mockArticles
  }

  // Helper: Extract signals from article using AI
  private async extractSignalsFromArticle(companyName: string, article: NewsArticle): Promise<BusinessSignal[]> {
    // Mock AI extraction - in production, use Gemini 2.0 Flash
    const mockPrompt = `
    Analyze this article about ${companyName}.
    Identify business events and categorize as:
    - Partnership: "partners with", "integrates with", "collaboration"
    - Product Launch: "launches", "unveils", "releases", "introduces"
    - Executive Hire: "appoints", "hires", "names", "CXO joins"
    - Customer Win: "customer story", "[Fortune 500] selects", "case study"
    - Acquisition: "acquires", "acquisition of"
    - Award/Recognition: "named", "recognized", "award"

    For each event, extract:
    - Event type
    - Event date
    - 2-sentence summary
    - Sentiment (positive/neutral/negative)
    `

    // Mock extraction result
    const signals: BusinessSignal[] = []

    if (article.title.toLowerCase().includes('partnership') || article.content.toLowerCase().includes('partnership')) {
      signals.push({
        companyId: companyName,
        eventType: 'partnership',
        eventDate: article.publishedDate,
        summary: `${companyName} announced a strategic partnership to enhance their cybersecurity offerings. This collaboration is expected to expand their market reach and capabilities.`,
        sentiment: 'positive',
        sourceUrl: article.sourceUrl,
        confidence: 0.9
      })
    }

    if (article.title.toLowerCase().includes('launch') || article.content.toLowerCase().includes('launch')) {
      signals.push({
        companyId: companyName,
        eventType: 'product_launch',
        eventDate: article.publishedDate,
        summary: `${companyName} launched a new product or service offering. The launch represents continued innovation and market expansion efforts.`,
        sentiment: 'positive',
        sourceUrl: article.sourceUrl,
        confidence: 0.85
      })
    }

    return signals
  }

  // Helper: Create social media verification task
  private async createSocialMediaVerificationTask(companyName: string): Promise<void> {
    console.log(`📱 Creating social media verification task for ${companyName}`)
    // In production, create task in verification_tasks table
  }

  // Helper: Validate signal relevance
  private isRelevantSignal(signal: BusinessSignal): boolean {
    // Discard generic news, keep only company-specific announcements
    return signal.confidence > 0.7 && signal.summary.length > 50
  }

  // Helper: Assign sentiment based on event type
  private assignSentiment(eventType: string): 'positive' | 'neutral' | 'negative' {
    const positiveEvents = ['partnership', 'product_launch', 'customer_win', 'award', 'funding']
    const neutralEvents = ['executive_hire']
    const negativeEvents = ['layoffs', 'security_incident', 'lawsuit']

    if (positiveEvents.includes(eventType)) return 'positive'
    if (negativeEvents.includes(eventType)) return 'negative'
    return 'neutral'
  }

  // Helper: Group signals by type
  private groupSignalsByType(signals: BusinessSignal[]): Record<string, number> {
    return signals.reduce((acc, signal) => {
      acc[signal.eventType] = (acc[signal.eventType] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  // Helper: Group signals by sentiment
  private groupSignalsBySentiment(signals: BusinessSignal[]): Record<string, number> {
    return signals.reduce((acc, signal) => {
      acc[signal.sentiment] = (acc[signal.sentiment] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  // Get all signals for a specific company
  getCompanySignals(companyName: string): BusinessSignal[] {
    return this.signals.filter(signal => signal.companyId === companyName)
  }

  // Get agent status
  getAgentStatus() {
    return {
      name: 'News & Signals Agent',
      status: 'operational',
      companiesMonitored: this.companies.length,
      signalsDetected: this.signals.length,
      lastRun: new Date().toISOString(),
      capabilities: [
        'Company website monitoring',
        'NewsAPI targeted searches',
        'AI-powered event extraction',
        'Sentiment analysis',
        'Signal validation and categorization'
      ],
      workflow: [
        'Phase 1: Gather - Monitor websites and news sources',
        'Phase 2: Process - Extract events with AI',
        'Phase 3: Analyze - Validate and categorize signals'
      ]
    }
  }
}