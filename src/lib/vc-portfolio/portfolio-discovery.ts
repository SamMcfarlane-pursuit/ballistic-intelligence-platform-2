import axios from 'axios'

export interface VCFirm {
  id: string
  name: string
  website: string
  crunchbaseUrl?: string
  linkedinUrl?: string
  portfolioPageUrl?: string
  aum?: number
  founded?: number
  headquarters: string
  focusAreas: string[]
  stagePreference: string[]
  lastUpdated: string
}

export interface PortfolioCompany {
  id: string
  name: string
  website?: string
  description: string
  industry: string
  subSector: string
  stage: string
  foundedYear?: number
  headquarters: string
  employeeCount?: number
  vcFirmId: string
  investmentDate?: string
  investmentRound?: string
  investmentAmount?: number
  currentValuation?: number
  status: 'active' | 'acquired' | 'ipo' | 'closed'
  lastFundingDate?: string
  totalFunding?: number
  confidence: number
  dataSource: string
  lastUpdated: string
}

export class VCPortfolioDiscovery {
  private crunchbaseApiKey: string
  private pitchbookApiKey: string

  constructor() {
    this.crunchbaseApiKey = process.env.CRUNCHBASE_API_KEY || ''
    this.pitchbookApiKey = process.env.PITCHBOOK_API_KEY || ''
  }

  async discoverVCPortfolios(vcFirms: VCFirm[]): Promise<PortfolioCompany[]> {
    const allPortfolioCompanies: PortfolioCompany[] = []

    for (const vcFirm of vcFirms) {
      try {
        console.log(`Discovering portfolio for ${vcFirm.name}...`)
        
        // Try multiple discovery methods
        const companies = await Promise.all([
          this.discoverFromCrunchbase(vcFirm),
          this.discoverFromWebsite(vcFirm),
          this.discoverFromPitchbook(vcFirm),
          this.discoverFromPublicSources(vcFirm)
        ])

        // Flatten and deduplicate
        const vcPortfolio = this.deduplicateCompanies(companies.flat())
        allPortfolioCompanies.push(...vcPortfolio)

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Error discovering portfolio for ${vcFirm.name}:`, error)
      }
    }

    return allPortfolioCompanies
  }

  private async discoverFromCrunchbase(vcFirm: VCFirm): Promise<PortfolioCompany[]> {
    if (!this.crunchbaseApiKey) return []

    try {
      // Crunchbase API call to get investments
      const response = await axios.get(`https://api.crunchbase.com/api/v4/entities/organizations/${vcFirm.name}/investments`, {
        headers: {
          'X-cb-user-key': this.crunchbaseApiKey
        },
        params: {
          field_ids: [
            'funding_round.funded_organization_identifier',
            'funding_round.funded_organization_description',
            'funding_round.investment_type',
            'funding_round.announced_on',
            'funding_round.money_raised'
          ].join(',')
        }
      })

      return response.data.data.map((investment: any) => ({
        id: investment.properties.funding_round.funded_organization_identifier.uuid,
        name: investment.properties.funding_round.funded_organization_identifier.value,
        description: investment.properties.funding_round.funded_organization_description || '',
        industry: this.categorizeIndustry(investment.properties.funding_round.funded_organization_description),
        subSector: this.categorizeSubSector(investment.properties.funding_round.funded_organization_description),
        stage: investment.properties.funding_round.investment_type || 'unknown',
        vcFirmId: vcFirm.id,
        investmentDate: investment.properties.funding_round.announced_on,
        investmentRound: investment.properties.funding_round.investment_type,
        investmentAmount: investment.properties.funding_round.money_raised?.value,
        status: 'active' as const,
        confidence: 0.95,
        dataSource: 'crunchbase',
        lastUpdated: new Date().toISOString(),
        headquarters: 'Unknown'
      }))
    } catch (error) {
      console.error('Crunchbase API error:', error)
      return []
    }
  }

  private async discoverFromWebsite(vcFirm: VCFirm): Promise<PortfolioCompany[]> {
    if (!vcFirm.portfolioPageUrl && !vcFirm.website) return []

    try {
      const portfolioUrl = vcFirm.portfolioPageUrl || `${vcFirm.website}/portfolio`
      
      // Mock web scraping - in production, use Puppeteer or similar
      const mockPortfolioCompanies = [
        {
          id: `${vcFirm.id}-portfolio-1`,
          name: 'CyberShield AI',
          website: 'https://cybershield.ai',
          description: 'AI-powered cybersecurity threat detection and response platform',
          industry: 'Cybersecurity',
          subSector: 'AI Security',
          stage: 'Series A',
          foundedYear: 2021,
          headquarters: 'San Francisco, CA',
          employeeCount: 45,
          vcFirmId: vcFirm.id,
          investmentDate: '2023-06-15',
          investmentRound: 'Series A',
          investmentAmount: 15000000,
          status: 'active' as const,
          confidence: 0.85,
          dataSource: 'website_scraping',
          lastUpdated: new Date().toISOString()
        },
        {
          id: `${vcFirm.id}-portfolio-2`,
          name: 'SecureCloud Pro',
          website: 'https://securecloud.pro',
          description: 'Cloud-native security platform for enterprise workloads',
          industry: 'Cybersecurity',
          subSector: 'Cloud Security',
          stage: 'Series B',
          foundedYear: 2020,
          headquarters: 'Austin, TX',
          employeeCount: 78,
          vcFirmId: vcFirm.id,
          investmentDate: '2023-09-20',
          investmentRound: 'Series B',
          investmentAmount: 25000000,
          status: 'active' as const,
          confidence: 0.88,
          dataSource: 'website_scraping',
          lastUpdated: new Date().toISOString()
        }
      ]

      return mockPortfolioCompanies
    } catch (error) {
      console.error('Website scraping error:', error)
      return []
    }
  }

  private async discoverFromPitchbook(vcFirm: VCFirm): Promise<PortfolioCompany[]> {
    if (!this.pitchbookApiKey) return []

    try {
      // Mock PitchBook API integration
      const mockPitchbookData = [
        {
          id: `${vcFirm.id}-pb-1`,
          name: 'ThreatHunter Analytics',
          description: 'Advanced threat hunting and incident response platform',
          industry: 'Cybersecurity',
          subSector: 'Threat Detection',
          stage: 'Seed',
          foundedYear: 2022,
          headquarters: 'Boston, MA',
          employeeCount: 25,
          vcFirmId: vcFirm.id,
          investmentDate: '2023-03-10',
          investmentRound: 'Seed',
          investmentAmount: 5000000,
          currentValuation: 25000000,
          status: 'active' as const,
          confidence: 0.92,
          dataSource: 'pitchbook',
          lastUpdated: new Date().toISOString()
        }
      ]

      return mockPitchbookData
    } catch (error) {
      console.error('PitchBook API error:', error)
      return []
    }
  }

  private async discoverFromPublicSources(vcFirm: VCFirm): Promise<PortfolioCompany[]> {
    try {
      // Mock public sources (SEC filings, press releases, etc.)
      const mockPublicData = [
        {
          id: `${vcFirm.id}-public-1`,
          name: 'ZeroTrust Networks',
          description: 'Zero trust network architecture and identity management',
          industry: 'Cybersecurity',
          subSector: 'Zero Trust',
          stage: 'Series C',
          foundedYear: 2019,
          headquarters: 'Seattle, WA',
          employeeCount: 120,
          vcFirmId: vcFirm.id,
          investmentDate: '2023-11-05',
          investmentRound: 'Series C',
          investmentAmount: 40000000,
          currentValuation: 200000000,
          status: 'active' as const,
          confidence: 0.78,
          dataSource: 'public_filings',
          lastUpdated: new Date().toISOString()
        }
      ]

      return mockPublicData
    } catch (error) {
      console.error('Public sources error:', error)
      return []
    }
  }

  private deduplicateCompanies(companies: PortfolioCompany[]): PortfolioCompany[] {
    const seen = new Set<string>()
    const deduplicated: PortfolioCompany[] = []

    for (const company of companies) {
      const key = this.normalizeCompanyName(company.name)
      if (!seen.has(key)) {
        seen.add(key)
        deduplicated.push(company)
      }
    }

    return deduplicated
  }

  private normalizeCompanyName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+(inc|llc|corp|ltd|co)\.?\s*$/gi, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private categorizeIndustry(description: string): string {
    const industryKeywords = {
      'Cybersecurity': ['security', 'cyber', 'threat', 'malware', 'firewall', 'encryption'],
      'AI/ML': ['artificial intelligence', 'machine learning', 'ai', 'ml', 'neural', 'deep learning'],
      'Cloud': ['cloud', 'saas', 'paas', 'iaas', 'aws', 'azure', 'gcp'],
      'Fintech': ['financial', 'fintech', 'banking', 'payment', 'blockchain', 'crypto'],
      'Healthcare': ['health', 'medical', 'pharma', 'biotech', 'telemedicine'],
      'Enterprise Software': ['enterprise', 'b2b', 'crm', 'erp', 'workflow', 'productivity']
    }

    const lowerDesc = description.toLowerCase()
    
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return industry
      }
    }

    return 'Technology'
  }

  private categorizeSubSector(description: string): string {
    const subSectorKeywords = {
      'AI Security': ['ai security', 'machine learning security', 'intelligent threat'],
      'Cloud Security': ['cloud security', 'cloud native security', 'container security'],
      'Network Security': ['network security', 'firewall', 'intrusion detection'],
      'Identity & Access': ['identity', 'access management', 'authentication', 'zero trust'],
      'Data Protection': ['data protection', 'data loss prevention', 'privacy'],
      'Threat Detection': ['threat detection', 'threat hunting', 'incident response'],
      'Compliance': ['compliance', 'governance', 'audit', 'regulatory']
    }

    const lowerDesc = description.toLowerCase()
    
    for (const [subSector, keywords] of Object.entries(subSectorKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return subSector
      }
    }

    return 'General Technology'
  }
}