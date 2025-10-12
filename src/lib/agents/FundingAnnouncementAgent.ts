// Mock Gemini AI for demo purposes (replace with real implementation when API key is available)
const mockGeminiAI = {
  getGenerativeModel: () => ({
    generateContent: async (prompt: string) => ({
      response: {
        text: () => JSON.stringify({
          companyName: 'Demo Security Corp',
          theme: 'Cloud Security',
          amount: 15000000,
          fundingStage: 'Series A',
          leadInvestor: 'Demo Ventures',
          allInvestors: ['Demo Ventures', 'Tech Capital'],
          confidence: 0.9,
          isCybersecurity: true
        })
      }
    })
  })
}

interface FundingAnnouncement {
  companyName: string
  theme: string // cybersecurity sub-sector
  amount: number // in USD
  fundingStage: string
  leadInvestor: string
  allInvestors: string[]
  announcementDate: string
  sourceUrl: string
  confidence: number
  extractedText: string
}

interface DataSource {
  name: string
  url: string
  type: 'rss' | 'api' | 'scrape'
  enabled: boolean
  lastCheck: string
}

export class FundingAnnouncementAgent {
  private dataSources: DataSource[] = [
    // Tier 1: High-Signal RSS Feeds
    {
      name: 'TechCrunch Funding',
      url: 'https://techcrunch.com/category/venture/feed/',
      type: 'rss',
      enabled: true,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'PR Newswire Tech',
      url: 'https://www.prnewswire.com/rss/technology-sector.xml',
      type: 'rss',
      enabled: true,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Business Wire Security',
      url: 'https://www.businesswire.com/portal/site/home/template.PAGE/news/?javax.portlet.tpst=1&javax.portlet.prp_ba847bafb2a2d782fcbb0710b053ce01=wsrp-navigationalState%3DcategoryId%253D4294967081%257CcontentItemPage%253D1&javax.portlet.begCacheTok=com.vignette.cachetoken&javax.portlet.endCacheTok=com.vignette.cachetoken',
      type: 'rss',
      enabled: true,
      lastCheck: new Date().toISOString()
    },
    // Tier 2: Broad Coverage News API
    {
      name: 'NewsAPI Cybersecurity',
      url: 'https://newsapi.org/v2/everything?q=cybersecurity+funding+OR+security+startup+funding&sortBy=publishedAt&apiKey=',
      type: 'api',
      enabled: true,
      lastCheck: new Date().toISOString()
    }
  ]

  private geminiModel = mockGeminiAI.getGenerativeModel()

  // Phase 1: Gather - Monitor RSS feeds and news sources
  async gatherFundingNews(): Promise<string[]> {
    console.log('🔍 Phase 1: Gathering funding news from sources...')
    
    const articles: string[] = []
    
    for (const source of this.dataSources.filter(s => s.enabled)) {
      try {
        console.log(`📡 Checking ${source.name}...`)
        
        if (source.type === 'rss') {
          const rssArticles = await this.fetchRSSFeed(source.url)
          articles.push(...rssArticles)
        } else if (source.type === 'api') {
          const apiArticles = await this.fetchNewsAPI(source.url)
          articles.push(...apiArticles)
        }
        
        // Update last check time
        source.lastCheck = new Date().toISOString()
        
      } catch (error) {
        console.error(`❌ Failed to fetch from ${source.name}:`, error)
      }
    }
    
    console.log(`✅ Gathered ${articles.length} articles from ${this.dataSources.length} sources`)
    return articles
  }

  // Phase 2: Process - Extract structured data using Gemini Flash 2.0
  async processFundingAnnouncement(articleText: string, sourceUrl: string): Promise<FundingAnnouncement | null> {
    console.log('🧠 Phase 2: Processing article with Gemini Flash 2.0...')
    
    try {
      const extractionPrompt = `
        Analyze this funding announcement article and extract the following information:
        
        ORGANIZATION: Company name and all investing VC firms
        MONEY: Exact funding amount raised (convert to USD if needed)
        FUNDING STAGE: Stage like "Seed Round", "Series A", "Series B", etc.
        TECHNOLOGY: Cybersecurity sub-sector (e.g., "cloud security", "identity management", "threat detection")
        
        Article text: "${articleText}"
        
        Respond in this exact JSON format:
        {
          "companyName": "extracted company name",
          "theme": "cybersecurity sub-sector",
          "amount": funding_amount_in_usd_number,
          "fundingStage": "funding stage",
          "leadInvestor": "lead investor name",
          "allInvestors": ["investor1", "investor2"],
          "confidence": confidence_score_0_to_1,
          "isCybersecurity": true_or_false
        }
        
        Only respond with valid JSON. If this is not a cybersecurity funding announcement, set "isCybersecurity": false.
      `

      const result = await this.geminiModel.generateContent(extractionPrompt)
      const response = await result.response
      const text = response.text()
      
      // Parse the JSON response
      const extractedData = JSON.parse(text.trim())
      
      // Only process if it's a cybersecurity funding announcement
      if (!extractedData.isCybersecurity || extractedData.confidence < 0.7) {
        return null
      }
      
      const announcement: FundingAnnouncement = {
        companyName: extractedData.companyName,
        theme: extractedData.theme,
        amount: extractedData.amount,
        fundingStage: extractedData.fundingStage,
        leadInvestor: extractedData.leadInvestor,
        allInvestors: extractedData.allInvestors,
        announcementDate: new Date().toISOString(),
        sourceUrl: sourceUrl,
        confidence: extractedData.confidence,
        extractedText: articleText.substring(0, 500) + '...'
      }
      
      console.log(`✅ Extracted funding data for ${announcement.companyName}: $${announcement.amount.toLocaleString()}`)
      return announcement
      
    } catch (error) {
      console.error('❌ Failed to process article with Gemini:', error)
      return null
    }
  }

  // Phase 3: Analyze - Generate insights and recommendations
  async analyzeFundingTrends(announcements: FundingAnnouncement[]): Promise<any> {
    console.log('📊 Phase 3: Analyzing funding trends and generating insights...')
    
    if (announcements.length === 0) {
      return {
        summary: 'No new funding announcements found',
        trends: [],
        recommendations: []
      }
    }

    // Calculate funding trends
    const totalFunding = announcements.reduce((sum, a) => sum + a.amount, 0)
    const avgFunding = totalFunding / announcements.length
    
    // Group by theme/sector
    const sectorBreakdown = announcements.reduce((acc, a) => {
      acc[a.theme] = (acc[a.theme] || 0) + a.amount
      return acc
    }, {} as Record<string, number>)
    
    // Group by stage
    const stageBreakdown = announcements.reduce((acc, a) => {
      acc[a.fundingStage] = (acc[a.fundingStage] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Identify top investors
    const investorActivity = announcements.reduce((acc, a) => {
      a.allInvestors.forEach(investor => {
        acc[investor] = (acc[investor] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)
    
    const analysis = {
      summary: {
        totalAnnouncements: announcements.length,
        totalFunding: totalFunding,
        averageFunding: avgFunding,
        dateRange: {
          from: announcements[announcements.length - 1]?.announcementDate,
          to: announcements[0]?.announcementDate
        }
      },
      trends: {
        hotSectors: Object.entries(sectorBreakdown)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([sector, amount]) => ({ sector, amount, percentage: (amount / totalFunding) * 100 })),
        stageDistribution: Object.entries(stageBreakdown)
          .map(([stage, count]) => ({ stage, count, percentage: (count / announcements.length) * 100 })),
        topInvestors: Object.entries(investorActivity)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([investor, deals]) => ({ investor, deals }))
      },
      insights: [
        `${announcements.length} new cybersecurity funding announcements detected`,
        `Total funding: $${(totalFunding / 1000000).toFixed(1)}M across all deals`,
        `Average deal size: $${(avgFunding / 1000000).toFixed(1)}M`,
        `Most active sector: ${Object.entries(sectorBreakdown).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}`,
        `Most active investor: ${Object.entries(investorActivity).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}`
      ],
      recommendations: [
        'Monitor emerging sectors with increased funding activity',
        'Track investor patterns for potential partnership opportunities',
        'Analyze funding stage trends for market timing insights',
        'Investigate companies with above-average funding amounts'
      ],
      timestamp: new Date().toISOString()
    }
    
    console.log(`📈 Analysis complete: ${announcements.length} announcements, $${(totalFunding / 1000000).toFixed(1)}M total funding`)
    return analysis
  }

  // Helper: Fetch RSS feed content
  private async fetchRSSFeed(url: string): Promise<string[]> {
    try {
      // In a real implementation, you would use an RSS parser
      // For demo purposes, return mock RSS content
      return [
        'CyberSecure, a cloud security firm, today announced a $10M Series A led by Ballistic Ventures.',
        'ThreatGuard raises $25M Series B from Andreessen Horowitz for AI-powered threat detection.',
        'Identity startup ZeroTrust secures $8M seed round from Kleiner Perkins.',
        'API security company ShieldAPI announces $15M Series A from GV and Lightspeed.'
      ]
    } catch (error) {
      console.error('RSS fetch error:', error)
      return []
    }
  }

  // Helper: Fetch from NewsAPI
  private async fetchNewsAPI(baseUrl: string): Promise<string[]> {
    try {
      // In a real implementation, you would call NewsAPI with your API key
      // For demo purposes, return mock news content
      return [
        'Cybersecurity startup DataVault raises $12M Series A from Sequoia Capital for data protection platform.',
        'Network security firm FirewallPro secures $18M Series B led by Accel Partners.',
        'Endpoint security company SecurePoint announces $6M seed funding from First Round Capital.'
      ]
    } catch (error) {
      console.error('NewsAPI fetch error:', error)
      return []
    }
  }

  // Main execution method - runs the complete 3-phase workflow
  async executeFundingIntelligence(): Promise<any> {
    console.log('🚀 Starting Funding Announcement Agent...')
    console.log('📋 Mission: Automated cybersecurity funding intelligence')
    console.log('💰 Budget: $0 (using free data sources)')
    console.log('🤖 AI: Gemini Flash 2.0 for NLP processing')
    
    try {
      // Phase 1: Gather
      const articles = await this.gatherFundingNews()
      
      if (articles.length === 0) {
        return {
          success: true,
          message: 'No new articles found',
          data: { announcements: [], analysis: null }
        }
      }
      
      // Phase 2: Process
      console.log('🔄 Processing articles with Gemini Flash 2.0...')
      const announcements: FundingAnnouncement[] = []
      
      for (const article of articles) {
        const processed = await this.processFundingAnnouncement(article, 'demo-source')
        if (processed) {
          announcements.push(processed)
        }
        // Rate limiting for free tier
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Phase 3: Analyze
      const analysis = await this.analyzeFundingTrends(announcements)
      
      return {
        success: true,
        data: {
          announcements,
          analysis,
          sources: this.dataSources.map(s => ({
            name: s.name,
            enabled: s.enabled,
            lastCheck: s.lastCheck
          })),
          performance: {
            articlesProcessed: articles.length,
            validAnnouncements: announcements.length,
            successRate: (announcements.length / articles.length) * 100,
            totalFunding: announcements.reduce((sum, a) => sum + a.amount, 0),
            avgConfidence: announcements.reduce((sum, a) => sum + a.confidence, 0) / announcements.length
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Funding Announcement Agent failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      }
    }
  }

  // Get agent status and configuration
  getAgentStatus() {
    return {
      name: 'Funding Announcement Agent',
      status: 'operational',
      dataSources: this.dataSources.length,
      enabledSources: this.dataSources.filter(s => s.enabled).length,
      lastRun: new Date().toISOString(),
      capabilities: [
        'RSS feed monitoring',
        'News API integration', 
        'Gemini Flash 2.0 NLP processing',
        'Automated entity extraction',
        'Funding trend analysis',
        'Investment insights generation'
      ],
      workflow: [
        'Phase 1: Gather - Monitor RSS feeds and news APIs',
        'Phase 2: Process - Extract entities with Gemini Flash 2.0',
        'Phase 3: Analyze - Generate trends and recommendations'
      ]
    }
  }

  // Configure data sources
  configureDataSources(sources: Partial<DataSource>[]) {
    sources.forEach(sourceUpdate => {
      const existingIndex = this.dataSources.findIndex(s => s.name === sourceUpdate.name)
      if (existingIndex >= 0) {
        this.dataSources[existingIndex] = { ...this.dataSources[existingIndex], ...sourceUpdate }
      }
    })
  }
}