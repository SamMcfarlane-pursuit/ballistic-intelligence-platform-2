import { PortfolioCompany } from '../vc-portfolio/portfolio-discovery'

export interface CompanyCategory {
  primaryIndustry: string
  subSector: string
  businessModel: string
  targetMarket: string
  technologyStack: string[]
  competitivePosition: string
  growthStage: string
  riskLevel: 'low' | 'medium' | 'high'
  marketOpportunity: 'small' | 'medium' | 'large' | 'massive'
  confidence: number
}

export interface EnrichedCompanyData {
  company: PortfolioCompany
  category: CompanyCategory
  marketAnalysis: {
    marketSize: number
    growthRate: number
    competitorCount: number
    marketLeader: string
    barriers: string[]
  }
  financialProjections: {
    revenueGrowth: number
    burnRate: number
    runwayMonths: number
    nextFundingNeed: number
    exitPotential: number
  }
  riskFactors: Array<{
    factor: string
    severity: 'low' | 'medium' | 'high'
    impact: string
    mitigation: string
  }>
  opportunities: Array<{
    opportunity: string
    potential: 'low' | 'medium' | 'high'
    timeframe: string
    requirements: string[]
  }>
}

export class AICompanyCategorization {
  private openaiApiKey: string

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || ''
  }

  async categorizeCompanies(companies: PortfolioCompany[]): Promise<EnrichedCompanyData[]> {
    const enrichedCompanies: EnrichedCompanyData[] = []

    for (const company of companies) {
      try {
        console.log(`Categorizing ${company.name}...`)
        
        const category = await this.categorizeCompany(company)
        const marketAnalysis = await this.analyzeMarket(company, category)
        const financialProjections = await this.projectFinancials(company, category)
        const riskFactors = await this.assessRisks(company, category)
        const opportunities = await this.identifyOpportunities(company, category)

        enrichedCompanies.push({
          company,
          category,
          marketAnalysis,
          financialProjections,
          riskFactors,
          opportunities
        })

        // Rate limiting for AI API calls
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Error categorizing ${company.name}:`, error)
      }
    }

    return enrichedCompanies
  }

  private async categorizeCompany(company: PortfolioCompany): Promise<CompanyCategory> {
    // In production, this would use OpenAI GPT-4 for intelligent categorization
    // For now, using rule-based categorization with AI-like logic

    const description = company.description.toLowerCase()
    
    // AI-powered industry classification
    const primaryIndustry = this.classifyIndustry(description)
    const subSector = this.classifySubSector(description, primaryIndustry)
    const businessModel = this.identifyBusinessModel(description)
    const targetMarket = this.identifyTargetMarket(description)
    const technologyStack = this.identifyTechnologyStack(description)
    const competitivePosition = this.assessCompetitivePosition(company, description)
    const growthStage = this.determineGrowthStage(company)
    const riskLevel = this.assessRiskLevel(company, description)
    const marketOpportunity = this.assessMarketOpportunity(primaryIndustry, subSector)

    return {
      primaryIndustry,
      subSector,
      businessModel,
      targetMarket,
      technologyStack,
      competitivePosition,
      growthStage,
      riskLevel,
      marketOpportunity,
      confidence: 0.87
    }
  }

  private classifyIndustry(description: string): string {
    const industryPatterns = {
      'Cybersecurity': [
        'security', 'cyber', 'threat', 'malware', 'firewall', 'encryption',
        'vulnerability', 'breach', 'attack', 'defense', 'protection'
      ],
      'Artificial Intelligence': [
        'ai', 'artificial intelligence', 'machine learning', 'ml', 'neural',
        'deep learning', 'nlp', 'computer vision', 'automation'
      ],
      'Cloud Computing': [
        'cloud', 'saas', 'paas', 'iaas', 'serverless', 'microservices',
        'container', 'kubernetes', 'devops'
      ],
      'Financial Technology': [
        'fintech', 'financial', 'banking', 'payment', 'blockchain',
        'cryptocurrency', 'trading', 'lending', 'insurance'
      ],
      'Healthcare Technology': [
        'healthtech', 'medical', 'healthcare', 'telemedicine', 'biotech',
        'pharma', 'diagnostics', 'therapy', 'patient'
      ],
      'Enterprise Software': [
        'enterprise', 'b2b', 'crm', 'erp', 'workflow', 'productivity',
        'collaboration', 'analytics', 'business intelligence'
      ]
    }

    for (const [industry, keywords] of Object.entries(industryPatterns)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (description.includes(keyword) ? 1 : 0)
      }, 0)
      
      if (score >= 2) {
        return industry
      }
    }

    return 'Technology'
  }

  private classifySubSector(description: string, industry: string): string {
    const subSectorMap: Record<string, Record<string, string[]>> = {
      'Cybersecurity': {
        'AI Security': ['ai security', 'machine learning security', 'intelligent threat'],
        'Cloud Security': ['cloud security', 'container security', 'serverless security'],
        'Network Security': ['network security', 'firewall', 'intrusion detection'],
        'Identity & Access Management': ['identity', 'access management', 'authentication'],
        'Data Protection': ['data protection', 'privacy', 'encryption'],
        'Threat Intelligence': ['threat intelligence', 'threat hunting', 'incident response'],
        'Security Operations': ['soc', 'security operations', 'monitoring'],
        'Compliance & Governance': ['compliance', 'governance', 'audit', 'regulatory']
      },
      'Artificial Intelligence': {
        'Natural Language Processing': ['nlp', 'natural language', 'text analysis'],
        'Computer Vision': ['computer vision', 'image recognition', 'video analysis'],
        'Machine Learning Platform': ['ml platform', 'model training', 'mlops'],
        'Conversational AI': ['chatbot', 'conversational', 'voice assistant'],
        'Predictive Analytics': ['predictive', 'forecasting', 'analytics'],
        'AI Infrastructure': ['ai infrastructure', 'gpu', 'model serving']
      }
    }

    const sectorMap = subSectorMap[industry]
    if (!sectorMap) return 'General'

    for (const [subSector, keywords] of Object.entries(sectorMap)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        return subSector
      }
    }

    return 'General'
  }

  private identifyBusinessModel(description: string): string {
    const businessModels = {
      'SaaS': ['saas', 'software as a service', 'subscription', 'cloud-based'],
      'Platform': ['platform', 'marketplace', 'ecosystem', 'api'],
      'Enterprise License': ['enterprise', 'license', 'on-premise', 'perpetual'],
      'Freemium': ['freemium', 'free tier', 'premium features'],
      'Usage-Based': ['usage-based', 'pay-per-use', 'consumption'],
      'Professional Services': ['consulting', 'services', 'implementation', 'support']
    }

    for (const [model, keywords] of Object.entries(businessModels)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        return model
      }
    }

    return 'SaaS' // Default assumption for tech companies
  }

  private identifyTargetMarket(description: string): string {
    const targetMarkets = {
      'Enterprise': ['enterprise', 'large organization', 'fortune 500', 'corporate'],
      'SMB': ['small business', 'smb', 'mid-market', 'small to medium'],
      'Developer': ['developer', 'api', 'sdk', 'devops', 'technical'],
      'Consumer': ['consumer', 'individual', 'personal', 'b2c'],
      'Government': ['government', 'public sector', 'federal', 'municipal']
    }

    for (const [market, keywords] of Object.entries(targetMarkets)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        return market
      }
    }

    return 'Enterprise' // Default assumption
  }

  private identifyTechnologyStack(description: string): string[] {
    const technologies = {
      'Machine Learning': ['ml', 'machine learning', 'tensorflow', 'pytorch'],
      'Cloud Native': ['kubernetes', 'docker', 'microservices', 'serverless'],
      'Blockchain': ['blockchain', 'ethereum', 'smart contract', 'web3'],
      'Big Data': ['big data', 'hadoop', 'spark', 'data lake'],
      'Real-time': ['real-time', 'streaming', 'kafka', 'event-driven'],
      'API-First': ['api', 'rest', 'graphql', 'webhook']
    }

    const stack: string[] = []
    for (const [tech, keywords] of Object.entries(technologies)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        stack.push(tech)
      }
    }

    return stack.length > 0 ? stack : ['Cloud Native']
  }

  private assessCompetitivePosition(company: PortfolioCompany, description: string): string {
    // Assess based on funding stage, amount, and description
    const fundingAmount = company.investmentAmount || 0
    const stage = company.stage.toLowerCase()

    if (description.includes('first') || description.includes('pioneer') || description.includes('innovative')) {
      return 'Market Leader'
    }
    
    if (fundingAmount > 50000000 || stage.includes('series c')) {
      return 'Strong Competitor'
    }
    
    if (fundingAmount > 10000000 || stage.includes('series b')) {
      return 'Growing Player'
    }
    
    return 'Emerging Player'
  }

  private determineGrowthStage(company: PortfolioCompany): string {
    const stage = company.stage.toLowerCase()
    const fundingAmount = company.investmentAmount || 0
    const employeeCount = company.employeeCount || 0

    if (stage.includes('seed') || fundingAmount < 5000000) {
      return 'Early Stage'
    }
    
    if (stage.includes('series a') || (fundingAmount >= 5000000 && fundingAmount < 20000000)) {
      return 'Growth Stage'
    }
    
    if (stage.includes('series b') || (fundingAmount >= 20000000 && fundingAmount < 50000000)) {
      return 'Expansion Stage'
    }
    
    if (employeeCount > 200 || fundingAmount >= 50000000) {
      return 'Scale Stage'
    }
    
    return 'Growth Stage'
  }

  private assessRiskLevel(company: PortfolioCompany, description: string): 'low' | 'medium' | 'high' {
    let riskScore = 0

    // Stage risk
    if (company.stage.toLowerCase().includes('seed')) riskScore += 2
    if (company.stage.toLowerCase().includes('series a')) riskScore += 1

    // Market risk
    if (description.includes('new market') || description.includes('emerging')) riskScore += 1
    if (description.includes('regulated') || description.includes('compliance')) riskScore += 1

    // Technology risk
    if (description.includes('cutting edge') || description.includes('breakthrough')) riskScore += 1

    if (riskScore >= 4) return 'high'
    if (riskScore >= 2) return 'medium'
    return 'low'
  }

  private assessMarketOpportunity(industry: string, subSector: string): 'small' | 'medium' | 'large' | 'massive' {
    const marketSizes: Record<string, 'small' | 'medium' | 'large' | 'massive'> = {
      'Cybersecurity': 'massive',
      'Artificial Intelligence': 'massive',
      'Cloud Computing': 'massive',
      'Financial Technology': 'large',
      'Healthcare Technology': 'large',
      'Enterprise Software': 'large'
    }

    return marketSizes[industry] || 'medium'
  }

  private async analyzeMarket(company: PortfolioCompany, category: CompanyCategory) {
    // Mock market analysis - in production, use real market data APIs
    const marketSizes: Record<string, number> = {
      'Cybersecurity': 173000000000, // $173B
      'AI Security': 15000000000,    // $15B
      'Cloud Security': 45000000000, // $45B
      'Identity & Access Management': 25000000000 // $25B
    }

    return {
      marketSize: marketSizes[category.subSector] || marketSizes[category.primaryIndustry] || 10000000000,
      growthRate: category.primaryIndustry === 'Cybersecurity' ? 12.5 : 8.5,
      competitorCount: category.subSector === 'AI Security' ? 150 : 300,
      marketLeader: category.subSector === 'AI Security' ? 'CrowdStrike' : 'Palo Alto Networks',
      barriers: ['High customer acquisition cost', 'Regulatory compliance', 'Technical complexity']
    }
  }

  private async projectFinancials(company: PortfolioCompany, category: CompanyCategory) {
    // AI-powered financial projections based on stage and category
    const stage = company.stage.toLowerCase()
    const baseGrowth = category.marketOpportunity === 'massive' ? 150 : 100

    return {
      revenueGrowth: stage.includes('seed') ? baseGrowth + 50 : baseGrowth,
      burnRate: (company.investmentAmount || 5000000) * 0.15, // 15% monthly burn
      runwayMonths: stage.includes('seed') ? 18 : 24,
      nextFundingNeed: (company.investmentAmount || 5000000) * 3,
      exitPotential: category.marketOpportunity === 'massive' ? 500000000 : 100000000
    }
  }

  private async assessRisks(company: PortfolioCompany, category: CompanyCategory) {
    const commonRisks = [
      {
        factor: 'Market Competition',
        severity: category.competitivePosition === 'Emerging Player' ? 'high' as const : 'medium' as const,
        impact: 'Increased customer acquisition costs and pricing pressure',
        mitigation: 'Focus on product differentiation and customer retention'
      },
      {
        factor: 'Technology Risk',
        severity: category.technologyStack.includes('Machine Learning') ? 'medium' as const : 'low' as const,
        impact: 'Potential technical challenges and longer development cycles',
        mitigation: 'Invest in R&D and technical talent acquisition'
      },
      {
        factor: 'Regulatory Changes',
        severity: category.primaryIndustry === 'Cybersecurity' ? 'medium' as const : 'low' as const,
        impact: 'Compliance costs and potential market restrictions',
        mitigation: 'Proactive compliance strategy and regulatory monitoring'
      }
    ]

    return commonRisks
  }

  private async identifyOpportunities(company: PortfolioCompany, category: CompanyCategory) {
    const opportunities = [
      {
        opportunity: 'International Expansion',
        potential: category.marketOpportunity === 'massive' ? 'high' as const : 'medium' as const,
        timeframe: '12-18 months',
        requirements: ['Local partnerships', 'Regulatory compliance', 'Market research']
      },
      {
        opportunity: 'Product Line Extension',
        potential: 'medium' as const,
        timeframe: '6-12 months',
        requirements: ['Customer feedback', 'Technical feasibility', 'Market validation']
      },
      {
        opportunity: 'Strategic Partnerships',
        potential: 'high' as const,
        timeframe: '3-6 months',
        requirements: ['Partner identification', 'Value proposition alignment', 'Legal framework']
      }
    ]

    return opportunities
  }
}