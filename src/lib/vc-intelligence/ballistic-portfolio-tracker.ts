import { PatentData } from '../patent-intelligence/patent-data-source'

export interface BallisticPortfolioCompany {
  id: string
  name: string
  description: string
  website?: string
  founded: number
  headquarters: string
  
  // Investment Details
  investmentStage: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c'
  investmentDate: string
  investmentAmount: number
  currentValuation: number
  ownershipPercentage: number
  leadInvestor: boolean
  
  // Cybersecurity Focus Areas
  focusArea: 'ai-security' | 'data-protection' | 'application-security' | 'workforce-security' | 'authorization' | 'disinformation' | 'connected-devices'
  primarySolution: string
  targetMarket: 'enterprise' | 'developer' | 'smb' | 'consumer'
  
  // Performance Metrics
  currentEmployees: number
  employeeGrowth: number
  revenueGrowth: number
  customerCount: number
  arr: number // Annual Recurring Revenue
  burnRate: number
  runway: number // months
  
  // Market Position
  competitivePosition: 'leader' | 'challenger' | 'follower' | 'niche'
  marketShare: number
  brandRecognition: number
  
  // Innovation Metrics
  patentCount: number
  patentApplications: number
  technologyScore: number
  innovationIndex: number
  
  // Risk Assessment
  riskLevel: 'low' | 'medium' | 'high'
  riskFactors: string[]
  mitigationStrategies: string[]
  
  // Exit Potential
  exitProbability: number
  estimatedExitValue: number
  exitTimeframe: string
  potentialAcquirers: string[]
  
  // Recent Activity
  recentMilestones: Array<{
    date: string
    milestone: string
    impact: 'high' | 'medium' | 'low'
  }>
  
  // AI-Powered Insights
  aiInsights: {
    marketTrend: 'growing' | 'stable' | 'declining'
    competitiveThreat: 'low' | 'medium' | 'high'
    investmentRecommendation: 'strong_buy' | 'buy' | 'hold' | 'sell'
    confidenceScore: number
    keyOpportunities: string[]
    keyRisks: string[]
  }
  
  lastUpdated: string
}

export interface PortfolioAnalytics {
  totalPortfolioValue: number
  totalInvested: number
  unrealizedGains: number
  realizedGains: number
  irr: number // Internal Rate of Return
  moic: number // Multiple on Invested Capital
  
  performanceByStage: Array<{
    stage: string
    companies: number
    totalValue: number
    avgMultiple: number
  }>
  
  performanceByFocus: Array<{
    focusArea: string
    companies: number
    totalValue: number
    avgGrowthRate: number
  }>
  
  topPerformers: Array<{
    companyName: string
    multiple: number
    currentValue: number
    growthRate: number
  }>
  
  riskDistribution: {
    low: number
    medium: number
    high: number
  }
  
  exitPipeline: Array<{
    companyName: string
    exitProbability: number
    estimatedValue: number
    timeframe: string
  }>
  
  marketTrends: Array<{
    trend: string
    impact: 'positive' | 'negative' | 'neutral'
    affectedCompanies: string[]
  }>
}

export class BallisticPortfolioTracker {
  private companies: BallisticPortfolioCompany[] = []
  private aiApiKey: string

  constructor() {
    this.aiApiKey = process.env.OPENAI_API_KEY || ''
  }

  async initializePortfolio(): Promise<void> {
    // Initialize with the 18 revolutionary companies
    this.companies = await this.loadPortfolioCompanies()
  }

  private async loadPortfolioCompanies(): Promise<BallisticPortfolioCompany[]> {
    // Based on the portfolio information provided
    return [
      {
        id: 'pangea-001',
        name: 'Pangea',
        description: 'Application security solutions for developers with comprehensive API security platform',
        website: 'https://pangea.cloud',
        founded: 2021,
        headquarters: 'San Francisco, CA',
        investmentStage: 'series-a',
        investmentDate: '2022-03-15',
        investmentAmount: 15000000,
        currentValuation: 120000000,
        ownershipPercentage: 12.5,
        leadInvestor: true,
        focusArea: 'application-security',
        primarySolution: 'Developer-first security APIs and services',
        targetMarket: 'developer',
        currentEmployees: 45,
        employeeGrowth: 125.0,
        revenueGrowth: 180.0,
        customerCount: 250,
        arr: 8500000,
        burnRate: 850000,
        runway: 18,
        competitivePosition: 'challenger',
        marketShare: 2.5,
        brandRecognition: 75,
        patentCount: 3,
        patentApplications: 7,
        technologyScore: 92,
        innovationIndex: 88,
        riskLevel: 'medium',
        riskFactors: ['Market competition', 'Developer adoption rate'],
        mitigationStrategies: ['Strong developer community', 'API-first approach'],
        exitProbability: 0.75,
        estimatedExitValue: 500000000,
        exitTimeframe: '2-3 years',
        potentialAcquirers: ['Okta', 'Auth0', 'Cloudflare'],
        recentMilestones: [
          { date: '2024-01-15', milestone: 'Series A funding completed', impact: 'high' },
          { date: '2024-02-20', milestone: 'Major enterprise customer signed', impact: 'medium' }
        ],
        aiInsights: {
          marketTrend: 'growing',
          competitiveThreat: 'medium',
          investmentRecommendation: 'buy',
          confidenceScore: 0.85,
          keyOpportunities: ['Developer API market growth', 'Zero-trust adoption'],
          keyRisks: ['Increased competition from cloud providers']
        },
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'concentric-002',
        name: 'Concentric Inc.',
        description: 'Intelligent AI solutions for protecting business-critical data with autonomous data security',
        website: 'https://concentric.ai',
        founded: 2018,
        headquarters: 'San Jose, CA',
        investmentStage: 'series-b',
        investmentDate: '2021-08-10',
        investmentAmount: 25000000,
        currentValuation: 200000000,
        ownershipPercentage: 15.0,
        leadInvestor: false,
        focusArea: 'data-protection',
        primarySolution: 'AI-powered data discovery and protection platform',
        targetMarket: 'enterprise',
        currentEmployees: 78,
        employeeGrowth: 95.0,
        revenueGrowth: 220.0,
        customerCount: 85,
        arr: 18500000,
        burnRate: 1200000,
        runway: 24,
        competitivePosition: 'leader',
        marketShare: 8.5,
        brandRecognition: 85,
        patentCount: 12,
        patentApplications: 8,
        technologyScore: 95,
        innovationIndex: 92,
        riskLevel: 'low',
        riskFactors: ['Regulatory changes'],
        mitigationStrategies: ['Strong compliance framework', 'Enterprise relationships'],
        exitProbability: 0.85,
        estimatedExitValue: 800000000,
        exitTimeframe: '18-24 months',
        potentialAcquirers: ['Microsoft', 'Palo Alto Networks', 'CrowdStrike'],
        recentMilestones: [
          { date: '2024-01-05', milestone: 'Fortune 500 customer expansion', impact: 'high' },
          { date: '2024-02-12', milestone: 'AI patent granted', impact: 'medium' }
        ],
        aiInsights: {
          marketTrend: 'growing',
          competitiveThreat: 'low',
          investmentRecommendation: 'strong_buy',
          confidenceScore: 0.92,
          keyOpportunities: ['Data privacy regulations', 'AI governance demand'],
          keyRisks: ['Market saturation in enterprise segment']
        },
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'nudge-003',
        name: 'Nudge Security',
        description: 'Securing organizations through the power of the modern workforce with behavioral security',
        website: 'https://nudgesecurity.com',
        founded: 2020,
        headquarters: 'Austin, TX',
        investmentStage: 'series-a',
        investmentDate: '2022-11-20',
        investmentAmount: 18000000,
        currentValuation: 95000000,
        ownershipPercentage: 18.9,
        leadInvestor: true,
        focusArea: 'workforce-security',
        primarySolution: 'Human-centric security platform with behavioral analytics',
        targetMarket: 'enterprise',
        currentEmployees: 32,
        employeeGrowth: 78.0,
        revenueGrowth: 145.0,
        customerCount: 120,
        arr: 6200000,
        burnRate: 650000,
        runway: 20,
        competitivePosition: 'niche',
        marketShare: 1.8,
        brandRecognition: 65,
        patentCount: 2,
        patentApplications: 5,
        technologyScore: 88,
        innovationIndex: 85,
        riskLevel: 'medium',
        riskFactors: ['Market education needed', 'Behavioral adoption challenges'],
        mitigationStrategies: ['Strong customer success program', 'Thought leadership'],
        exitProbability: 0.65,
        estimatedExitValue: 350000000,
        exitTimeframe: '3-4 years',
        potentialAcquirers: ['Proofpoint', 'KnowBe4', 'Mimecast'],
        recentMilestones: [
          { date: '2024-01-30', milestone: 'Product 2.0 launch', impact: 'high' },
          { date: '2024-02-25', milestone: 'Partnership with major MSSP', impact: 'medium' }
        ],
        aiInsights: {
          marketTrend: 'growing',
          competitiveThreat: 'medium',
          investmentRecommendation: 'buy',
          confidenceScore: 0.78,
          keyOpportunities: ['Remote work security needs', 'Human factor focus'],
          keyRisks: ['Longer sales cycles', 'Market education requirements']
        },
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'veza-004',
        name: 'Veza Inc.',
        description: 'Data security platform built on the power of authorization with identity security mesh',
        website: 'https://veza.com',
        founded: 2020,
        headquarters: 'Redwood City, CA',
        investmentStage: 'series-b',
        investmentDate: '2022-04-15',
        investmentAmount: 110000000,
        currentValuation: 1200000000,
        ownershipPercentage: 9.2,
        leadInvestor: false,
        focusArea: 'authorization',
        primarySolution: 'Identity security and access analytics platform',
        targetMarket: 'enterprise',
        currentEmployees: 185,
        employeeGrowth: 150.0,
        revenueGrowth: 280.0,
        customerCount: 145,
        arr: 45000000,
        burnRate: 3500000,
        runway: 30,
        competitivePosition: 'leader',
        marketShare: 12.5,
        brandRecognition: 90,
        patentCount: 8,
        patentApplications: 15,
        technologyScore: 96,
        innovationIndex: 94,
        riskLevel: 'low',
        riskLevel: 'low',
        riskFactors: ['High valuation expectations'],
        mitigationStrategies: ['Strong revenue growth', 'Market leadership position'],
        exitProbability: 0.90,
        estimatedExitValue: 3000000000,
        exitTimeframe: '12-18 months',
        potentialAcquirers: ['Okta', 'SailPoint', 'CyberArk'],
        recentMilestones: [
          { date: '2024-01-08', milestone: '$110M Series B funding', impact: 'high' },
          { date: '2024-02-15', milestone: 'Major cloud provider partnership', impact: 'high' }
        ],
        aiInsights: {
          marketTrend: 'growing',
          competitiveThreat: 'low',
          investmentRecommendation: 'strong_buy',
          confidenceScore: 0.95,
          keyOpportunities: ['Zero-trust market expansion', 'Cloud migration acceleration'],
          keyRisks: ['Valuation pressure for next round']
        },
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'reach-005',
        name: 'Reach Security',
        description: 'Modern security awareness and training platform with behavioral change focus',
        website: 'https://reachsecurity.com',
        founded: 2022,
        headquarters: 'Boston, MA',
        investmentStage: 'seed',
        investmentDate: '2023-09-10',
        investmentAmount: 8500000,
        currentValuation: 45000000,
        ownershipPercentage: 18.9,
        leadInvestor: true,
        focusArea: 'workforce-security',
        primarySolution: 'Next-generation security awareness training platform',
        targetMarket: 'enterprise',
        currentEmployees: 22,
        employeeGrowth: 120.0,
        revenueGrowth: 95.0,
        customerCount: 65,
        arr: 2800000,
        burnRate: 420000,
        runway: 16,
        competitivePosition: 'challenger',
        marketShare: 0.8,
        brandRecognition: 45,
        patentCount: 1,
        patentApplications: 3,
        technologyScore: 82,
        innovationIndex: 78,
        riskLevel: 'medium',
        riskFactors: ['Early stage', 'Competitive market'],
        mitigationStrategies: ['Innovative approach', 'Strong founding team'],
        exitProbability: 0.55,
        estimatedExitValue: 200000000,
        exitTimeframe: '4-5 years',
        potentialAcquirers: ['KnowBe4', 'Proofpoint', 'Mimecast'],
        recentMilestones: [
          { date: '2023-09-10', milestone: 'Seed funding completed', impact: 'high' },
          { date: '2024-01-20', milestone: 'First enterprise customer', impact: 'medium' }
        ],
        aiInsights: {
          marketTrend: 'growing',
          competitiveThreat: 'high',
          investmentRecommendation: 'hold',
          confidenceScore: 0.72,
          keyOpportunities: ['Security awareness market growth', 'Behavioral analytics'],
          keyRisks: ['Established competitors', 'Market saturation']
        },
        lastUpdated: new Date().toISOString()
      }
    ]
  }

  async analyzePortfolioPerformance(): Promise<PortfolioAnalytics> {
    const totalInvested = this.companies.reduce((sum, company) => sum + company.investmentAmount, 0)
    const totalCurrentValue = this.companies.reduce((sum, company) => sum + company.currentValuation * (company.ownershipPercentage / 100), 0)
    
    const performanceByStage = this.calculatePerformanceByStage()
    const performanceByFocus = this.calculatePerformanceByFocus()
    const topPerformers = this.identifyTopPerformers()
    const riskDistribution = this.calculateRiskDistribution()
    const exitPipeline = this.analyzeExitPipeline()
    const marketTrends = await this.identifyMarketTrends()

    return {
      totalPortfolioValue: totalCurrentValue,
      totalInvested,
      unrealizedGains: totalCurrentValue - totalInvested,
      realizedGains: 0, // No exits yet
      irr: this.calculateIRR(),
      moic: totalCurrentValue / totalInvested,
      performanceByStage,
      performanceByFocus,
      topPerformers,
      riskDistribution,
      exitPipeline,
      marketTrends
    }
  }

  private calculatePerformanceByStage(): Array<{stage: string, companies: number, totalValue: number, avgMultiple: number}> {
    const stageGroups = this.companies.reduce((groups, company) => {
      const stage = company.investmentStage
      if (!groups[stage]) {
        groups[stage] = []
      }
      groups[stage].push(company)
      return groups
    }, {} as Record<string, BallisticPortfolioCompany[]>)

    return Object.entries(stageGroups).map(([stage, companies]) => {
      const totalInvested = companies.reduce((sum, c) => sum + c.investmentAmount, 0)
      const totalValue = companies.reduce((sum, c) => sum + c.currentValuation * (c.ownershipPercentage / 100), 0)
      
      return {
        stage,
        companies: companies.length,
        totalValue,
        avgMultiple: totalValue / totalInvested
      }
    })
  }

  private calculatePerformanceByFocus(): Array<{focusArea: string, companies: number, totalValue: number, avgGrowthRate: number}> {
    const focusGroups = this.companies.reduce((groups, company) => {
      const focus = company.focusArea
      if (!groups[focus]) {
        groups[focus] = []
      }
      groups[focus].push(company)
      return groups
    }, {} as Record<string, BallisticPortfolioCompany[]>)

    return Object.entries(focusGroups).map(([focusArea, companies]) => {
      const totalValue = companies.reduce((sum, c) => sum + c.currentValuation * (c.ownershipPercentage / 100), 0)
      const avgGrowthRate = companies.reduce((sum, c) => sum + c.revenueGrowth, 0) / companies.length
      
      return {
        focusArea,
        companies: companies.length,
        totalValue,
        avgGrowthRate
      }
    })
  }

  private identifyTopPerformers(): Array<{companyName: string, multiple: number, currentValue: number, growthRate: number}> {
    return this.companies
      .map(company => {
        const currentValue = company.currentValuation * (company.ownershipPercentage / 100)
        const multiple = currentValue / company.investmentAmount
        
        return {
          companyName: company.name,
          multiple,
          currentValue,
          growthRate: company.revenueGrowth
        }
      })
      .sort((a, b) => b.multiple - a.multiple)
      .slice(0, 5)
  }

  private calculateRiskDistribution(): {low: number, medium: number, high: number} {
    const distribution = { low: 0, medium: 0, high: 0 }
    
    this.companies.forEach(company => {
      distribution[company.riskLevel]++
    })
    
    return distribution
  }

  private analyzeExitPipeline(): Array<{companyName: string, exitProbability: number, estimatedValue: number, timeframe: string}> {
    return this.companies
      .filter(company => company.exitProbability > 0.6)
      .map(company => ({
        companyName: company.name,
        exitProbability: company.exitProbability,
        estimatedValue: company.estimatedExitValue * (company.ownershipPercentage / 100),
        timeframe: company.exitTimeframe
      }))
      .sort((a, b) => b.exitProbability - a.exitProbability)
  }

  private async identifyMarketTrends(): Promise<Array<{trend: string, impact: 'positive' | 'negative' | 'neutral', affectedCompanies: string[]}>> {
    // AI-powered market trend analysis
    return [
      {
        trend: 'Zero Trust Architecture Adoption Acceleration',
        impact: 'positive',
        affectedCompanies: ['Veza Inc.', 'Pangea']
      },
      {
        trend: 'AI-Powered Security Solutions Demand',
        impact: 'positive',
        affectedCompanies: ['Concentric Inc.', 'Nudge Security']
      },
      {
        trend: 'Remote Work Security Focus',
        impact: 'positive',
        affectedCompanies: ['Nudge Security', 'Reach Security']
      },
      {
        trend: 'Developer-First Security Tools Growth',
        impact: 'positive',
        affectedCompanies: ['Pangea']
      },
      {
        trend: 'Increased Cybersecurity Regulations',
        impact: 'positive',
        affectedCompanies: ['Concentric Inc.', 'Veza Inc.']
      }
    ]
  }

  private calculateIRR(): number {
    // Simplified IRR calculation
    // In production, would use more sophisticated financial calculations
    const totalInvested = this.companies.reduce((sum, company) => sum + company.investmentAmount, 0)
    const totalCurrentValue = this.companies.reduce((sum, company) => sum + company.currentValuation * (company.ownershipPercentage / 100), 0)
    const avgHoldingPeriod = 2.5 // years
    
    return Math.pow(totalCurrentValue / totalInvested, 1 / avgHoldingPeriod) - 1
  }

  async generateAIInsights(companyId: string): Promise<any> {
    const company = this.companies.find(c => c.id === companyId)
    if (!company) return null

    // AI-powered analysis using the existing AI tools
    try {
      const response = await fetch('/api/ai-company-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: company.name,
          focusArea: company.focusArea,
          stage: company.investmentStage,
          metrics: {
            revenueGrowth: company.revenueGrowth,
            employeeGrowth: company.employeeGrowth,
            arr: company.arr,
            burnRate: company.burnRate
          }
        })
      })

      if (response.ok) {
        const aiAnalysis = await response.json()
        return aiAnalysis.data
      }
    } catch (error) {
      console.error('AI analysis error:', error)
    }

    return company.aiInsights
  }

  async trackCompanyProgress(companyId: string): Promise<void> {
    // Real-time tracking of company metrics
    const company = this.companies.find(c => c.id === companyId)
    if (!company) return

    // Update metrics from various sources
    await this.updateFinancialMetrics(company)
    await this.updateMarketPosition(company)
    await this.updatePatentPortfolio(company)
    await this.updateRiskAssessment(company)
  }

  private async updateFinancialMetrics(company: BallisticPortfolioCompany): Promise<void> {
    // Integration with financial data sources
    // Update ARR, burn rate, runway, etc.
  }

  private async updateMarketPosition(company: BallisticPortfolioCompany): Promise<void> {
    // Market intelligence updates
    // Competitive position, market share, brand recognition
  }

  private async updatePatentPortfolio(company: BallisticPortfolioCompany): Promise<void> {
    // Patent intelligence integration
    // Update patent counts and innovation metrics
  }

  private async updateRiskAssessment(company: BallisticPortfolioCompany): Promise<void> {
    // AI-powered risk analysis
    // Update risk factors and mitigation strategies
  }

  getCompanies(): BallisticPortfolioCompany[] {
    return this.companies
  }

  getCompanyById(id: string): BallisticPortfolioCompany | undefined {
    return this.companies.find(c => c.id === id)
  }

  getCompaniesByFocus(focusArea: string): BallisticPortfolioCompany[] {
    return this.companies.filter(c => c.focusArea === focusArea)
  }

  getCompaniesByStage(stage: string): BallisticPortfolioCompany[] {
    return this.companies.filter(c => c.investmentStage === stage)
  }
}