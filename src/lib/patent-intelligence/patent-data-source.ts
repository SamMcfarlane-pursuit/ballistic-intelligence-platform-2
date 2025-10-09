import axios from 'axios'

export interface PatentData {
  id: string
  publicationNumber: string
  title: string
  abstract: string
  inventors: string[]
  assignee: string
  assigneeType: 'company' | 'individual' | 'government' | 'university'
  filingDate: string
  publicationDate: string
  grantDate?: string
  patentType: 'utility' | 'design' | 'plant' | 'provisional'
  status: 'pending' | 'granted' | 'abandoned' | 'expired'
  classifications: {
    cpc: string[]  // Cooperative Patent Classification
    ipc: string[]  // International Patent Classification
    uspc: string[] // US Patent Classification
  }
  citationCount: number
  forwardCitations: number
  backwardCitations: number
  familySize: number
  priority: {
    country: string
    date: string
    number: string
  }
  legalStatus: string
  examiner: string
  attorney?: string
  claims: number
  figures: number
  pages: number
  language: string
  cybersecurityRelevance: number // 0-1 score
  innovationScore: number // 0-1 score
  commercialPotential: number // 0-1 score
  lastUpdated: string
}

export interface CompanyPatentProfile {
  companyName: string
  normalizedName: string
  totalPatents: number
  grantedPatents: number
  pendingPatents: number
  patentGrowthRate: number
  averageCitationCount: number
  topTechnologies: Array<{
    technology: string
    patentCount: number
    percentage: number
  }>
  innovationTrend: 'increasing' | 'stable' | 'decreasing'
  patentQuality: 'high' | 'medium' | 'low'
  competitivePosition: number // 0-1 score
  recentActivity: Array<{
    date: string
    patents: number
    significance: string
  }>
  keyInventors: Array<{
    name: string
    patentCount: number
    h_index: number
  }>
  technologyFocus: string[]
  marketSignals: Array<{
    signal: string
    strength: 'strong' | 'medium' | 'weak'
    date: string
  }>
}

export class PatentDataSource {
  private usptoApiKey: string
  private googlePatentsApiKey: string
  private baseUrl = 'https://developer.uspto.gov/api/v1'

  constructor() {
    this.usptoApiKey = process.env.USPTO_API_KEY || ''
    this.googlePatentsApiKey = process.env.GOOGLE_PATENTS_API_KEY || ''
  }

  async searchCybersecurityPatents(
    query: string = 'cybersecurity OR "cyber security" OR "information security"',
    limit: number = 1000,
    startDate?: string,
    endDate?: string
  ): Promise<PatentData[]> {
    try {
      console.log(`Searching patents for: ${query}`)
      
      // Use USPTO Patent Examination Research Dataset (PatEx)
      const searchParams = {
        q: query,
        f: 'patent_number,patent_title,patent_abstract,inventor_name,assignee_name,patent_date',
        o: 'patent_date desc',
        s: limit.toString()
      }

      if (startDate) searchParams['df'] = startDate
      if (endDate) searchParams['dt'] = endDate

      // For demo, using structured mock data that represents real USPTO API response
      const mockPatentData = await this.getMockPatentData()
      
      // Process and enrich patent data
      const enrichedPatents = await Promise.all(
        mockPatentData.map(patent => this.enrichPatentData(patent))
      )

      return enrichedPatents.filter(patent => patent.cybersecurityRelevance > 0.7)
    } catch (error) {
      console.error('Patent search error:', error)
      return []
    }
  }

  async getCompanyPatentProfile(companyName: string): Promise<CompanyPatentProfile | null> {
    try {
      console.log(`Building patent profile for: ${companyName}`)
      
      // Search patents by assignee
      const companyPatents = await this.searchPatentsByAssignee(companyName)
      
      if (companyPatents.length === 0) {
        return null
      }

      // Analyze patent portfolio
      const profile = await this.analyzePatentPortfolio(companyName, companyPatents)
      
      return profile
    } catch (error) {
      console.error('Company patent profile error:', error)
      return null
    }
  }

  private async getMockPatentData(): Promise<any[]> {
    // High-quality structured patent data representing real USPTO format
    return [
      {
        patent_number: 'US11234567B2',
        patent_title: 'Machine Learning-Based Threat Detection System with Behavioral Analysis',
        patent_abstract: 'A cybersecurity system that employs machine learning algorithms to detect and classify security threats based on behavioral patterns and anomaly detection. The system includes neural networks trained on network traffic data to identify malicious activities in real-time.',
        inventor_name: ['Sarah Chen', 'Michael Rodriguez', 'David Kim'],
        assignee_name: 'CyberDefense Technologies Inc.',
        patent_date: '2024-01-15',
        filing_date: '2022-06-20',
        patent_type: 'utility',
        status: 'granted',
        cpc_classifications: ['H04L63/1408', 'G06N3/08', 'H04L63/20'],
        ipc_classifications: ['H04L29/06', 'G06N3/08'],
        citation_count: 15,
        forward_citations: 8,
        backward_citations: 23,
        claims: 20,
        figures: 12,
        pages: 45
      },
      {
        patent_number: 'US11345678B2',
        patent_title: 'Zero Trust Network Architecture with Dynamic Policy Enforcement',
        patent_abstract: 'A zero trust security framework that dynamically adjusts access policies based on user behavior, device posture, and contextual information. The system continuously validates trust levels and enforces granular access controls.',
        inventor_name: ['Alice Johnson', 'Robert Wilson', 'Lisa Thompson'],
        assignee_name: 'SecureNet Solutions LLC',
        patent_date: '2024-02-10',
        filing_date: '2022-08-15',
        patent_type: 'utility',
        status: 'granted',
        cpc_classifications: ['H04L63/102', 'H04L63/083', 'H04L63/20'],
        ipc_classifications: ['H04L29/06', 'H04L12/24'],
        citation_count: 22,
        forward_citations: 12,
        backward_citations: 31,
        claims: 25,
        figures: 18,
        pages: 52
      },
      {
        patent_number: 'US20240123456A1',
        patent_title: 'Quantum-Resistant Cryptographic Protocol for Secure Communications',
        patent_abstract: 'A post-quantum cryptographic system designed to resist attacks from quantum computers. The protocol implements lattice-based encryption algorithms and provides forward secrecy for long-term data protection.',
        inventor_name: ['Dr. Amanda Foster', 'James Park', 'Maria Garcia'],
        assignee_name: 'QuantumShield Corp',
        patent_date: '2024-03-05',
        filing_date: '2023-01-10',
        patent_type: 'utility',
        status: 'pending',
        cpc_classifications: ['H04L9/008', 'H04L9/30', 'G06N10/00'],
        ipc_classifications: ['H04L9/00', 'G06N10/00'],
        citation_count: 5,
        forward_citations: 2,
        backward_citations: 18,
        claims: 18,
        figures: 8,
        pages: 38
      },
      {
        patent_number: 'US11456789B2',
        patent_title: 'Cloud Security Orchestration Platform with Automated Incident Response',
        patent_abstract: 'An automated security orchestration platform that integrates multiple cloud security tools and provides coordinated incident response. The system uses AI to prioritize threats and execute response playbooks automatically.',
        inventor_name: ['Kevin Zhang', 'Jennifer Lee', 'Thomas Brown'],
        assignee_name: 'CloudGuard Technologies Inc.',
        patent_date: '2024-01-28',
        filing_date: '2022-09-12',
        patent_type: 'utility',
        status: 'granted',
        cpc_classifications: ['H04L63/20', 'G06F21/57', 'H04L41/16'],
        ipc_classifications: ['H04L29/06', 'G06F21/57'],
        citation_count: 18,
        forward_citations: 10,
        backward_citations: 28,
        claims: 22,
        figures: 15,
        pages: 48
      },
      {
        patent_number: 'US11567890B2',
        patent_title: 'Blockchain-Based Identity Verification System for IoT Devices',
        patent_abstract: 'A decentralized identity management system for IoT devices using blockchain technology. The system provides secure device authentication and authorization without relying on centralized authorities.',
        inventor_name: ['Daniel Martinez', 'Sophie Chen', 'Alex Kumar'],
        assignee_name: 'IoTSecure Solutions Ltd.',
        patent_date: '2024-02-20',
        filing_date: '2022-11-05',
        patent_type: 'utility',
        status: 'granted',
        cpc_classifications: ['H04L63/0823', 'H04L9/32', 'G06F21/64'],
        ipc_classifications: ['H04L29/06', 'H04L9/32'],
        citation_count: 12,
        forward_citations: 6,
        backward_citations: 20,
        claims: 16,
        figures: 10,
        pages: 42
      }
    ]
  }

  private async enrichPatentData(rawPatent: any): Promise<PatentData> {
    // Enrich raw patent data with AI-powered analysis
    const cybersecurityRelevance = this.calculateCybersecurityRelevance(
      rawPatent.patent_title,
      rawPatent.patent_abstract,
      rawPatent.cpc_classifications
    )

    const innovationScore = this.calculateInnovationScore(
      rawPatent.citation_count,
      rawPatent.forward_citations,
      rawPatent.claims,
      rawPatent.patent_date
    )

    const commercialPotential = this.calculateCommercialPotential(
      rawPatent.assignee_name,
      rawPatent.citation_count,
      cybersecurityRelevance
    )

    return {
      id: rawPatent.patent_number,
      publicationNumber: rawPatent.patent_number,
      title: rawPatent.patent_title,
      abstract: rawPatent.patent_abstract,
      inventors: rawPatent.inventor_name,
      assignee: rawPatent.assignee_name,
      assigneeType: this.determineAssigneeType(rawPatent.assignee_name),
      filingDate: rawPatent.filing_date,
      publicationDate: rawPatent.patent_date,
      grantDate: rawPatent.status === 'granted' ? rawPatent.patent_date : undefined,
      patentType: rawPatent.patent_type,
      status: rawPatent.status,
      classifications: {
        cpc: rawPatent.cpc_classifications || [],
        ipc: rawPatent.ipc_classifications || [],
        uspc: []
      },
      citationCount: rawPatent.citation_count,
      forwardCitations: rawPatent.forward_citations,
      backwardCitations: rawPatent.backward_citations,
      familySize: 1,
      priority: {
        country: 'US',
        date: rawPatent.filing_date,
        number: rawPatent.patent_number
      },
      legalStatus: rawPatent.status,
      examiner: 'USPTO Examiner',
      claims: rawPatent.claims,
      figures: rawPatent.figures,
      pages: rawPatent.pages,
      language: 'en',
      cybersecurityRelevance,
      innovationScore,
      commercialPotential,
      lastUpdated: new Date().toISOString()
    }
  }

  private calculateCybersecurityRelevance(title: string, abstract: string, classifications: string[]): number {
    let score = 0

    // Title analysis
    const cybersecurityKeywords = [
      'security', 'cyber', 'threat', 'malware', 'encryption', 'authentication',
      'firewall', 'intrusion', 'vulnerability', 'attack', 'defense', 'protection',
      'privacy', 'cryptographic', 'secure', 'authorization', 'identity'
    ]

    const titleLower = title.toLowerCase()
    const abstractLower = abstract.toLowerCase()

    cybersecurityKeywords.forEach(keyword => {
      if (titleLower.includes(keyword)) score += 0.1
      if (abstractLower.includes(keyword)) score += 0.05
    })

    // Classification analysis (CPC codes for cybersecurity)
    const cybersecurityCPC = [
      'H04L63', // Network security
      'G06F21', // Security arrangements
      'H04L9',   // Cryptographic mechanisms
      'G06F1/00' // Digital data processing
    ]

    classifications.forEach(cpc => {
      cybersecurityCPC.forEach(securityCPC => {
        if (cpc.startsWith(securityCPC)) score += 0.2
      })
    })

    return Math.min(score, 1.0)
  }

  private calculateInnovationScore(citationCount: number, forwardCitations: number, claims: number, patentDate: string): number {
    let score = 0

    // Citation-based scoring
    if (citationCount > 20) score += 0.4
    else if (citationCount > 10) score += 0.3
    else if (citationCount > 5) score += 0.2

    // Forward citation scoring (impact)
    if (forwardCitations > 15) score += 0.3
    else if (forwardCitations > 8) score += 0.2
    else if (forwardCitations > 3) score += 0.1

    // Claims complexity
    if (claims > 25) score += 0.2
    else if (claims > 15) score += 0.1

    // Recency bonus
    const patentYear = new Date(patentDate).getFullYear()
    const currentYear = new Date().getFullYear()
    if (currentYear - patentYear <= 2) score += 0.1

    return Math.min(score, 1.0)
  }

  private calculateCommercialPotential(assignee: string, citationCount: number, cybersecurityRelevance: number): number {
    let score = 0

    // Company type analysis
    if (assignee.includes('Inc') || assignee.includes('Corp') || assignee.includes('LLC')) {
      score += 0.3 // Commercial entity
    }

    // Citation impact
    if (citationCount > 15) score += 0.3
    else if (citationCount > 8) score += 0.2

    // Cybersecurity relevance boost
    score += cybersecurityRelevance * 0.4

    return Math.min(score, 1.0)
  }

  private determineAssigneeType(assignee: string): 'company' | 'individual' | 'government' | 'university' {
    const assigneeLower = assignee.toLowerCase()
    
    if (assigneeLower.includes('university') || assigneeLower.includes('college')) {
      return 'university'
    }
    
    if (assigneeLower.includes('government') || assigneeLower.includes('department of')) {
      return 'government'
    }
    
    if (assigneeLower.includes('inc') || assigneeLower.includes('corp') || 
        assigneeLower.includes('llc') || assigneeLower.includes('ltd')) {
      return 'company'
    }
    
    return 'individual'
  }

  private async searchPatentsByAssignee(companyName: string): Promise<PatentData[]> {
    // Search patents by company assignee
    const normalizedName = companyName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
    
    // Mock company-specific patent search
    const allPatents = await this.getMockPatentData()
    const companyPatents = allPatents.filter(patent => 
      patent.assignee_name.toLowerCase().includes(normalizedName)
    )

    return Promise.all(companyPatents.map(patent => this.enrichPatentData(patent)))
  }

  private async analyzePatentPortfolio(companyName: string, patents: PatentData[]): Promise<CompanyPatentProfile> {
    const totalPatents = patents.length
    const grantedPatents = patents.filter(p => p.status === 'granted').length
    const pendingPatents = patents.filter(p => p.status === 'pending').length

    // Calculate growth rate (mock calculation)
    const patentGrowthRate = this.calculatePatentGrowthRate(patents)
    
    // Average citation count
    const averageCitationCount = patents.reduce((sum, p) => sum + p.citationCount, 0) / totalPatents

    // Top technologies from CPC classifications
    const topTechnologies = this.extractTopTechnologies(patents)

    // Innovation trend analysis
    const innovationTrend = this.analyzeInnovationTrend(patents)

    // Patent quality assessment
    const patentQuality = this.assessPatentQuality(patents)

    // Competitive position
    const competitivePosition = this.calculateCompetitivePosition(patents)

    return {
      companyName,
      normalizedName: companyName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim(),
      totalPatents,
      grantedPatents,
      pendingPatents,
      patentGrowthRate,
      averageCitationCount,
      topTechnologies,
      innovationTrend,
      patentQuality,
      competitivePosition,
      recentActivity: this.analyzeRecentActivity(patents),
      keyInventors: this.identifyKeyInventors(patents),
      technologyFocus: this.identifyTechnologyFocus(patents),
      marketSignals: this.extractMarketSignals(patents)
    }
  }

  private calculatePatentGrowthRate(patents: PatentData[]): number {
    // Calculate year-over-year patent filing growth
    const patentsByYear = patents.reduce((acc, patent) => {
      const year = new Date(patent.filingDate).getFullYear()
      acc[year] = (acc[year] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const years = Object.keys(patentsByYear).map(Number).sort()
    if (years.length < 2) return 0

    const recentYear = years[years.length - 1]
    const previousYear = years[years.length - 2]
    
    const recentCount = patentsByYear[recentYear]
    const previousCount = patentsByYear[previousYear]

    return ((recentCount - previousCount) / previousCount) * 100
  }

  private extractTopTechnologies(patents: PatentData[]): Array<{technology: string, patentCount: number, percentage: number}> {
    const technologyMap = new Map<string, number>()
    
    patents.forEach(patent => {
      patent.classifications.cpc.forEach(cpc => {
        const technology = this.mapCPCToTechnology(cpc)
        technologyMap.set(technology, (technologyMap.get(technology) || 0) + 1)
      })
    })

    const totalPatents = patents.length
    return Array.from(technologyMap.entries())
      .map(([technology, count]) => ({
        technology,
        patentCount: count,
        percentage: (count / totalPatents) * 100
      }))
      .sort((a, b) => b.patentCount - a.patentCount)
      .slice(0, 5)
  }

  private mapCPCToTechnology(cpc: string): string {
    const cpcMap: Record<string, string> = {
      'H04L63': 'Network Security',
      'G06F21': 'Computer Security',
      'H04L9': 'Cryptography',
      'G06N3': 'Machine Learning',
      'H04L41': 'Network Management',
      'G06F1': 'Digital Processing',
      'H04L12': 'Data Switching Networks'
    }

    for (const [prefix, technology] of Object.entries(cpcMap)) {
      if (cpc.startsWith(prefix)) {
        return technology
      }
    }

    return 'Other Technology'
  }

  private analyzeInnovationTrend(patents: PatentData[]): 'increasing' | 'stable' | 'decreasing' {
    const recentPatents = patents.filter(p => {
      const patentYear = new Date(p.filingDate).getFullYear()
      const currentYear = new Date().getFullYear()
      return currentYear - patentYear <= 2
    })

    const olderPatents = patents.filter(p => {
      const patentYear = new Date(p.filingDate).getFullYear()
      const currentYear = new Date().getFullYear()
      return currentYear - patentYear > 2 && currentYear - patentYear <= 4
    })

    if (recentPatents.length > olderPatents.length * 1.2) return 'increasing'
    if (recentPatents.length < olderPatents.length * 0.8) return 'decreasing'
    return 'stable'
  }

  private assessPatentQuality(patents: PatentData[]): 'high' | 'medium' | 'low' {
    const avgInnovationScore = patents.reduce((sum, p) => sum + p.innovationScore, 0) / patents.length
    const avgCitationCount = patents.reduce((sum, p) => sum + p.citationCount, 0) / patents.length

    if (avgInnovationScore > 0.7 && avgCitationCount > 15) return 'high'
    if (avgInnovationScore > 0.5 && avgCitationCount > 8) return 'medium'
    return 'low'
  }

  private calculateCompetitivePosition(patents: PatentData[]): number {
    const totalCitations = patents.reduce((sum, p) => sum + p.citationCount, 0)
    const avgCommercialPotential = patents.reduce((sum, p) => sum + p.commercialPotential, 0) / patents.length
    
    // Normalize to 0-1 scale
    const citationScore = Math.min(totalCitations / 500, 1) // Assume 500 is excellent
    const commercialScore = avgCommercialPotential
    
    return (citationScore * 0.6 + commercialScore * 0.4)
  }

  private analyzeRecentActivity(patents: PatentData[]): Array<{date: string, patents: number, significance: string}> {
    // Group patents by month for recent activity
    const recentPatents = patents.filter(p => {
      const patentDate = new Date(p.filingDate)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      return patentDate >= sixMonthsAgo
    })

    const monthlyActivity = recentPatents.reduce((acc, patent) => {
      const month = patent.filingDate.substring(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(monthlyActivity).map(([date, count]) => ({
      date,
      patents: count,
      significance: count > 3 ? 'High' : count > 1 ? 'Medium' : 'Low'
    }))
  }

  private identifyKeyInventors(patents: PatentData[]): Array<{name: string, patentCount: number, h_index: number}> {
    const inventorMap = new Map<string, number>()
    
    patents.forEach(patent => {
      patent.inventors.forEach(inventor => {
        inventorMap.set(inventor, (inventorMap.get(inventor) || 0) + 1)
      })
    })

    return Array.from(inventorMap.entries())
      .map(([name, count]) => ({
        name,
        patentCount: count,
        h_index: Math.min(count, 10) // Simplified h-index calculation
      }))
      .sort((a, b) => b.patentCount - a.patentCount)
      .slice(0, 5)
  }

  private identifyTechnologyFocus(patents: PatentData[]): string[] {
    const technologies = new Set<string>()
    
    patents.forEach(patent => {
      patent.classifications.cpc.forEach(cpc => {
        technologies.add(this.mapCPCToTechnology(cpc))
      })
    })

    return Array.from(technologies).slice(0, 5)
  }

  private extractMarketSignals(patents: PatentData[]): Array<{signal: string, strength: 'strong' | 'medium' | 'weak', date: string}> {
    const signals = []
    
    // Recent high-impact patents
    const recentHighImpact = patents.filter(p => {
      const isRecent = new Date(p.filingDate) > new Date('2023-01-01')
      const isHighImpact = p.innovationScore > 0.8
      return isRecent && isHighImpact
    })

    if (recentHighImpact.length > 0) {
      signals.push({
        signal: 'High-impact innovation activity',
        strength: 'strong' as const,
        date: recentHighImpact[0].filingDate
      })
    }

    // Technology diversification
    const technologies = this.identifyTechnologyFocus(patents)
    if (technologies.length > 3) {
      signals.push({
        signal: 'Technology portfolio diversification',
        strength: 'medium' as const,
        date: new Date().toISOString().split('T')[0]
      })
    }

    return signals
  }
}