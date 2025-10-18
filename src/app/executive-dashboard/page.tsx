'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { 
  BarChart3,
  TrendingUp,
  FileText,
  Building2,
  MapPin,
  Calendar,
  Users,
  Globe,
  Linkedin,
  X,
  ChevronDown,
  Check,
  Search,
  Grid,
  List,
  Filter,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Alert, AlertDescription } from '@/components/ui/alert'
import BrightDataMonitor from '@/components/dashboard/BrightDataMonitor'
import PatentIntelligenceCard from '@/components/dashboard/PatentIntelligenceCard'
import SectorIntelligenceCard from '@/components/dashboard/SectorIntelligenceCard'
import CompanyIntelligenceCard from '@/components/dashboard/CompanyIntelligenceCard'
import EnhancedCompanyDialog from '@/components/dashboard/EnhancedCompanyDialog'

interface SectorData {
  id: string
  name: string
  rank: number
  companies: number
  totalFunding: number
  momentumScore: number
  momentumGrowth: number
  // BrightData enhanced fields
  marketGrowth?: number
  investmentTrends?: string[]
  keyPlayers?: string[]
  emergingTechnologies?: string[]
}

interface Company {
  id: string
  name: string
  description: string
  sector: string
  location: string
  founded: number
  fundingFrom: string
  totalFunding: number
  lastRound: string
  lastRoundAmount: number
  latestDateOfFunding: string
  website?: string
  linkedin?: string
  team?: {
    ceo?: string
    cto?: string
    head?: string
  }
  // BrightData enhanced fields
  brightData?: {
    newsSentiment?: 'positive' | 'neutral' | 'negative'
    recentMentions?: number
    techStack?: string[]
    patents?: number
    competitors?: string[]
    marketPosition?: 'Emerging' | 'Growing' | 'Established' | 'Innovative'
    growthIndicators?: {
      hiring?: number
      funding?: number
      news?: number
    }
  }
}

interface Patent {
  id: string
  title: string
  description: string
  company: string
  companyId: string
  filingDate: string
  sector: string
  noveltyScore: number
  innovationPotential: 'High Innovation Potential' | 'Medium Innovation Potential' | 'Low Innovation Potential'
  patentNumber?: string
  status?: 'Filed' | 'Granted' | 'Pending'
  claims?: number
  citations?: number
  // BrightData enhanced fields
  marketImpact?: number
  competitiveLandscape?: string[]
  technologyTrends?: string[]
}

interface TrendingCompany {
  id: string
  name: string
  category: string
  trendingScore: number
  trendingFactors: {
    fundingMomentum: number
    growthRate: number
    marketInterest: number
    investorActivity: number
    timeRelevance: number
    overallTrending: number
  }
  trendDirection: 'up' | 'down' | 'stable'
  percentageChange: number
  rank: number
  companyDetails?: any
}

export default function ExecutiveDashboard() {
  const [selectedTab, setSelectedTab] = useState('trending-sectors')
  const [selectedSector, setSelectedSector] = useState('All Sectors')
  const [selectedRegion, setSelectedRegion] = useState('All Regions')
  const [selectedStage, setSelectedStage] = useState('All Stages')
  const [selectedInvestor, setSelectedInvestor] = useState('All Investors')
  const [selectedPeriod, setSelectedPeriod] = useState('90 Days')
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid')
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [sectors, setSectors] = useState<SectorData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trendingData, setTrendingData] = useState<TrendingCompany[]>([])
  const [patents, setPatents] = useState<Patent[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const sectorOptions = ['All Sectors', 'Network Security', 'Cloud Security', 'Data Protection', 'Identity Management', 'Threat Intelligence', 'Endpoint Security', 'Encryption', 'Email Security']
  const regions = ['All Regions', 'Canada', 'East Region', 'Israel', 'South Region', 'UK', 'West Region']
  const stages = ['All Stages', 'Seed', 'Series A', 'Series B', 'Series C']
  const investors = ['All Investors', 'Ballistic Ventures', 'CyberForge Capital', 'Guardian Capital', 'SecureVentures']
  const periods = ['30 Days', '60 Days', '90 Days', '180 Days']

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedTab === 'market-intelligence') {
        loadCompanies()
      } else if (selectedTab === 'patent-deep-dive') {
        loadPatents()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedTab])

  useEffect(() => {
    loadData()
  }, [selectedTab, selectedSector, selectedRegion, selectedStage, selectedInvestor, selectedPeriod])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      if (selectedTab === 'trending-sectors') {
        await loadSectors()
      } else if (selectedTab === 'market-intelligence') {
        await loadCompanies()
      } else if (selectedTab === 'patent-deep-dive') {
        await loadPatents()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadSectors = async () => {
    try {
      // Fetch trending data from API
      const response = await fetch('/api/trending-factors?action=sectors')
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load sectors')
      }

      // Transform API data to sector cards
      const sectorData: SectorData[] = data.data.sectors.map((sector: any, index: number) => ({
        id: String(index + 1),
        name: sector.sector,
        rank: index + 1,
        companies: sector.companyCount,
        totalFunding: sector.companyCount * 25000000, // Estimated based on company count
        momentumScore: sector.averageTrendingScore,
        momentumGrowth: sector.averageTrendingScore
      }))

      setSectors(sectorData.slice(0, 6)) // Top 6 sectors
    } catch (err) {
      console.error('Error loading sectors:', err)
      // Fallback to mock data if API fails
      loadMockSectors()
    }
  }

  const loadMockSectors = () => {
    const mockSectors: SectorData[] = [
      {
        id: '1',
        name: 'Cloud Security',
        rank: 1,
        companies: 45,
        totalFunding: 890000000,
        momentumScore: 28,
        momentumGrowth: 28,
        marketGrowth: 35,
        investmentTrends: ['AI/ML', 'Zero Trust'],
        keyPlayers: ['Wiz', 'Orca Security', 'Palo Alto Networks'],
        emergingTechnologies: ['Cloud Native', 'Serverless Security']
      },
      {
        id: '2',
        name: 'Threat Intelligence',
        rank: 2,
        companies: 28,
        totalFunding: 520000000,
        momentumScore: 25,
        momentumGrowth: 25,
        marketGrowth: 28,
        investmentTrends: ['AI Detection', 'Threat Hunting'],
        keyPlayers: ['Recorded Future', 'CrowdStrike', 'Splunk'],
        emergingTechnologies: ['Extended Detection', 'Threat Intelligence Platforms']
      },
      {
        id: '3',
        name: 'Network Security',
        rank: 3,
        companies: 38,
        totalFunding: 720000000,
        momentumScore: 22,
        momentumGrowth: 22,
        marketGrowth: 22,
        investmentTrends: ['Zero Trust', 'SD-WAN'],
        keyPlayers: ['Cisco', 'Fortinet', 'Palo Alto Networks'],
        emergingTechnologies: ['Secure Access Service Edge', 'Next-Gen Firewalls']
      },
      {
        id: '4',
        name: 'Data Protection',
        rank: 4,
        companies: 32,
        totalFunding: 650000000,
        momentumScore: 18,
        momentumGrowth: 18,
        marketGrowth: 20,
        investmentTrends: ['Privacy Compliance', 'Data Loss Prevention'],
        keyPlayers: ['Varonis', 'Proofpoint', 'Microsoft'],
        emergingTechnologies: ['Data Classification', 'Privacy-Preserving Computation']
      },
      {
        id: '5',
        name: 'Identity Management',
        rank: 5,
        companies: 24,
        totalFunding: 480000000,
        momentumScore: 15,
        momentumGrowth: 15,
        marketGrowth: 25,
        investmentTrends: ['Passwordless', 'Zero Trust'],
        keyPlayers: ['Okta', 'Auth0', 'Ping Identity'],
        emergingTechnologies: ['Decentralized Identity', 'Biometric Authentication']
      },
      {
        id: '6',
        name: 'Endpoint Security',
        rank: 6,
        companies: 22,
        totalFunding: 410000000,
        momentumScore: 12,
        momentumGrowth: 12,
        marketGrowth: 18,
        investmentTrends: ['EDR', 'XDR'],
        keyPlayers: ['CrowdStrike', 'SentinelOne', 'Microsoft'],
        emergingTechnologies: ['Extended Detection', 'Automated Response']
      }
    ]
    setSectors(mockSectors)
  }

  // BrightData enhanced sector loading
  const loadEnhancedSectors = async () => {
    try {
      // Fetch trending data from API
      const response = await fetch('/api/trending-factors?action=sectors')
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load sectors')
      }

      // Transform API data to sector cards with BrightData enhancements
      const sectorData: SectorData[] = data.data.sectors.map((sector: any, index: number) => ({
        id: String(index + 1),
        name: sector.sector,
        rank: index + 1,
        companies: sector.companyCount,
        totalFunding: sector.companyCount * 25000000, // Estimated based on company count
        momentumScore: sector.averageTrendingScore,
        momentumGrowth: sector.averageTrendingScore
      }))

      setSectors(sectorData.slice(0, 6)) // Top 6 sectors
    } catch (err) {
      console.error('Error loading enhanced sectors:', err)
      // Fallback to mock data if API fails
      loadMockSectors()
    }
  }

  const loadCompanies = async () => {
    try {
      // Fetch top trending companies from API
      const limit = selectedPeriod === '30 Days' ? 20 : selectedPeriod === '60 Days' ? 30 : 50
      const response = await fetch(`/api/trending-factors?action=top&limit=${limit}`)
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load companies')
      }

      // Transform API data to company cards
      const companiesData: Company[] = data.data.topTrending.map((item: TrendingCompany) => {
        const details = item.companyDetails
        return {
          id: item.id,
          name: item.name,
          description: details?.description || `${item.category} company focused on innovative security solutions`,
          sector: item.category,
          location: details?.headquarters_location || 'United States',
          founded: details?.founded_year || 2020,
          fundingFrom: details?.fundingRounds?.[0]?.lead_investor || 'Various Investors',
          totalFunding: details?.total_funding || 0,
          lastRound: details?.current_stage || 'Series A',
          lastRoundAmount: details?.fundingRounds?.[0]?.money_raised || 0,
          latestDateOfFunding: details?.fundingRounds?.[0]?.announced_date 
            ? new Date(details.fundingRounds[0].announced_date).toISOString().split('T')[0]
            : 'N/A',
          website: details?.website,
          linkedin: details?.linkedin_url,
          // Enhanced with BrightData intelligence
          brightData: {
            newsSentiment: Math.random() > 0.7 ? 'positive' : Math.random() > 0.4 ? 'neutral' : 'negative', // Mock data
            recentMentions: Math.floor(Math.random() * 50) + 10, // Mock data
            techStack: ['React', 'Node.js', 'Python', 'Docker'], // Mock data
            patents: Math.floor(Math.random() * 20) + 1, // Mock data
            competitors: ['Competitor A', 'Competitor B', 'Competitor C'], // Mock data
            marketPosition: 'Emerging', // Mock data
            growthIndicators: {
              hiring: Math.floor(Math.random() * 30) + 10, // Mock data
              funding: Math.floor(Math.random() * 50) + 20, // Mock data
              news: Math.floor(Math.random() * 40) + 15 // Mock data
            }
          }
        }
      })

      setCompanies(companiesData)
      setTrendingData(data.data.topTrending)
    } catch (err) {
      console.error('Error loading companies:', err)
      // Fallback to mock data if API fails
      loadMockCompanies()
    }
  }

  const loadMockCompanies = () => {
    // Mock data matching Figma design with BrightData enhancements
    const mockCompanies: Company[] = [
      {
        id: '1',
        name: 'ShieldTech',
        description: 'AI-powered network security platform for real-time intrusion detection',
        sector: 'Network Security',
        location: 'San Francisco, CA',
        founded: 2019,
        fundingFrom: 'Ballistic Ventures',
        totalFunding: 45000000,
        lastRound: 'Series B',
        lastRoundAmount: 25000000,
        latestDateOfFunding: 'Sep 15, 2025',
        website: 'https://www.shieldtech.io',
        linkedin: 'linkedin.com/company/shieldtech',
        brightData: {
          newsSentiment: 'positive',
          recentMentions: 32,
          techStack: ['Python', 'TensorFlow', 'Kubernetes'],
          patents: 8,
          competitors: ['CrowdStrike', 'Palo Alto Networks'],
          marketPosition: 'Growing',
          growthIndicators: {
            hiring: 25,
            funding: 45,
            news: 30
          }
        }
      },
      {
        id: '2',
        name: 'CryptoGuard',
        description: 'Post-quantum cryptography solutions for enterprise data security',
        sector: 'Encryption',
        location: 'New York, NY',
        founded: 2020,
        fundingFrom: 'CyberForge Capital',
        totalFunding: 38000000,
        lastRound: 'Series A',
        lastRoundAmount: 18000000,
        latestDateOfFunding: 'Sep 8, 2025',
        website: 'https://www.cryptoguard.com',
        linkedin: 'linkedin.com/company/cryptoguard',
        brightData: {
          newsSentiment: 'positive',
          recentMentions: 28,
          techStack: ['Rust', 'C++', 'OpenSSL'],
          patents: 12,
          competitors: ['IBM', 'Microsoft'],
          marketPosition: 'Innovative',
          growthIndicators: {
            hiring: 30,
            funding: 55,
            news: 35
          }
        }
      },
      {
        id: '3',
        name: 'ThreatVision',
        description: 'Real-time threat intelligence platform with predictive ML capabilities',
        sector: 'Threat Intelligence',
        location: 'Boston, MA',
        founded: 2021,
        fundingFrom: 'Ballistic Ventures',
        totalFunding: 22000000,
        lastRound: 'Series A',
        lastRoundAmount: 15000000,
        latestDateOfFunding: 'Sep 1, 2025',
        website: 'https://www.threatvision.ai',
        linkedin: 'linkedin.com/company/threatvision',
        brightData: {
          newsSentiment: 'neutral',
          recentMentions: 22,
          techStack: ['Python', 'PyTorch', 'Elasticsearch'],
          patents: 5,
          competitors: ['Recorded Future', 'Splunk'],
          marketPosition: 'Emerging',
          growthIndicators: {
            hiring: 20,
            funding: 35,
            news: 25
          }
        }
      },
      {
        id: '4',
        name: 'SecureCloud',
        description: 'Multi-cloud security posture management',
        sector: 'Cloud Security',
        location: 'Seattle, WA',
        founded: 2018,
        fundingFrom: 'Ballistic Ventures',
        totalFunding: 52000000,
        lastRound: 'Series B',
        lastRoundAmount: 30000000,
        latestDateOfFunding: 'Sep 28, 2025',
        website: 'https://www.securecloud.io',
        linkedin: 'linkedin.com/company/securecloud',
        team: {
          ceo: 'Sarah Chen (CEO)',
          cto: 'Michael Rodriguez (CTO)',
          head: 'Emily Watson (Head of Product)'
        },
        brightData: {
          newsSentiment: 'positive',
          recentMentions: 45,
          techStack: ['Go', 'Kubernetes', 'AWS SDK'],
          patents: 15,
          competitors: ['Wiz', 'Orca Security'],
          marketPosition: 'Established',
          growthIndicators: {
            hiring: 35,
            funding: 60,
            news: 40
          }
        }
      },
      {
        id: '5',
        name: 'IdentityLock',
        description: 'Zero-trust identity and access management with passwordless authentication',
        sector: 'Identity Management',
        location: 'London, UK',
        founded: 2020,
        fundingFrom: 'Guardian Capital',
        totalFunding: 18000000,
        lastRound: 'Series A',
        lastRoundAmount: 12000000,
        latestDateOfFunding: 'Aug 25, 2025',
        website: 'https://www.identitylock.io',
        linkedin: 'linkedin.com/company/identitylock',
        team: {
          ceo: 'Oliver Smith (CEO)',
          cto: 'Sophia Taylor (CTO)',
          head: 'Daniel Brown (Head of Product)'
        },
        brightData: {
          newsSentiment: 'positive',
          recentMentions: 18,
          techStack: ['React', 'Node.js', 'WebAuthn'],
          patents: 7,
          competitors: ['Okta', 'Auth0'],
          marketPosition: 'Growing',
          growthIndicators: {
            hiring: 28,
            funding: 40,
            news: 22
          }
        }
      },
      {
        id: '6',
        name: 'DataVault Pro',
        description: 'Enterprise data loss prevention with AI-powered discovery',
        sector: 'Data Protection',
        location: 'Austin, TX',
        founded: 2019,
        fundingFrom: 'CyberForge Capital',
        totalFunding: 41000000,
        lastRound: 'Series B',
        lastRoundAmount: 28000000,
        latestDateOfFunding: 'Sep 22, 2025',
        website: 'https://www.datavaultpro.com',
        linkedin: 'linkedin.com/company/datavaultpro',
        brightData: {
          newsSentiment: 'neutral',
          recentMentions: 26,
          techStack: ['Java', 'Spark', 'Hadoop'],
          patents: 10,
          competitors: ['Varonis', 'Proofpoint'],
          marketPosition: 'Established',
          growthIndicators: {
            hiring: 22,
            funding: 38,
            news: 28
          }
        }
      }
    ]
    setCompanies(mockCompanies)
  }

  const loadPatents = async () => {
    try {
      // In production, this would call a real API endpoint
      // const response = await fetch('/api/patents?action=recent&limit=50')
      // const data = await response.json()
      
      // For now, use mock data matching Figma design
      loadMockPatents()
    } catch (err) {
      console.error('Error loading patents:', err)
      loadMockPatents()
    }
  }

  const loadMockPatents = () => {
    const mockPatents: Patent[] = [
      {
        id: '1',
        title: 'AI-Driven Network Anomaly Detection System',
        description: 'Machine learning algorithm for detecting network intrusions in real-time with 99.7% accuracy and zero false positives.',
        company: 'ShieldTech',
        companyId: '1',
        filingDate: 'Sep 19, 2025',
        sector: 'Network Security',
        noveltyScore: 94,
        innovationPotential: 'High Innovation Potential',
        patentNumber: 'US-2025-12345',
        status: 'Filed',
        claims: 18,
        citations: 12,
        marketImpact: 87,
        competitiveLandscape: ['Wiz', 'Orca Security', 'CrowdStrike'],
        technologyTrends: ['AI/ML', 'Zero Trust']
      },
      {
        id: '2',
        title: 'Quantum-Resistant Encryption Protocol',
        description: 'Post-quantum cryptographic method resistant to quantum computing attacks with 256-bit security level.',
        company: 'CryptoGuard',
        companyId: '2',
        filingDate: 'Sep 17, 2025',
        sector: 'Encryption',
        noveltyScore: 96,
        innovationPotential: 'High Innovation Potential',
        patentNumber: 'US-2025-12346',
        status: 'Filed',
        claims: 22,
        citations: 8,
        marketImpact: 92,
        competitiveLandscape: ['IBM', 'Microsoft', 'Google'],
        technologyTrends: ['Post-Quantum', 'Cryptography']
      },
      {
        id: '3',
        title: 'Multi-Cloud Security Orchestration Platform',
        description: 'Unified security management across multiple cloud providers with automated compliance and threat response.',
        company: 'SecureCloud',
        companyId: '4',
        filingDate: 'Sep 15, 2025',
        sector: 'Cloud Security',
        noveltyScore: 89,
        innovationPotential: 'High Innovation Potential',
        patentNumber: 'US-2025-12347',
        status: 'Filed',
        claims: 15,
        citations: 14,
        marketImpact: 78,
        competitiveLandscape: ['Palo Alto Networks', 'Zscaler', 'Cisco'],
        technologyTrends: ['Cloud Native', 'Automation']
      },
      {
        id: '4',
        title: 'Behavioral Biometric Authentication System',
        description: 'Continuous authentication using behavioral patterns with 99.9% accuracy and resistance to replay attacks.',
        company: 'IdentityLock',
        companyId: '5',
        filingDate: 'Sep 12, 2025',
        sector: 'Identity Management',
        noveltyScore: 91,
        innovationPotential: 'High Innovation Potential',
        patentNumber: 'US-2025-12348',
        status: 'Filed',
        claims: 20,
        citations: 10,
        marketImpact: 85,
        competitiveLandscape: ['Okta', 'Auth0', 'Ping Identity'],
        technologyTrends: ['Biometrics', 'Zero Trust']
      },
      {
        id: '5',
        title: 'Real-Time Data Loss Prevention Engine',
        description: 'AI-powered DLP system that prevents data exfiltration with contextual understanding and minimal false positives.',
        company: 'DataVault Pro',
        companyId: '6',
        filingDate: 'Sep 10, 2025',
        sector: 'Data Protection',
        noveltyScore: 87,
        innovationPotential: 'Medium Innovation Potential',
        patentNumber: 'US-2025-12349',
        status: 'Filed',
        claims: 16,
        citations: 11,
        marketImpact: 75,
        competitiveLandscape: ['Varonis', 'Proofpoint', 'Symantec'],
        technologyTrends: ['AI/ML', 'Data Governance']
      },
      {
        id: '6',
        title: 'IoT Device Fingerprinting Technology',
        description: 'Automated identification and classification of IoT devices with passive network monitoring and risk scoring.',
        company: 'ThreatVision',
        companyId: '3',
        filingDate: 'Sep 8, 2025',
        sector: 'Threat Intelligence',
        noveltyScore: 85,
        innovationPotential: 'Medium Innovation Potential',
        patentNumber: 'US-2025-12350',
        status: 'Filed',
        claims: 14,
        citations: 9,
        marketImpact: 72,
        competitiveLandscape: ['Armis', 'Claroty', 'CyberX'],
        technologyTrends: ['IoT Security', 'Network Monitoring']
      }
    ]
    setPatents(mockPatents)
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`
    return `${amount}`
  }

  // Enhanced filtering with search
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          company.name.toLowerCase().includes(query) ||
          company.description.toLowerCase().includes(query) ||
          company.sector.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }
      
      // Sector filter
      if (selectedSector !== 'All Sectors' && company.sector !== selectedSector) return false
      
      // Investor filter
      if (selectedInvestor !== 'All Investors' && company.fundingFrom !== selectedInvestor) return false
      
      // Funding stage filter
      if (selectedStage !== 'All Stages' && company.lastRound !== selectedStage) return false
      
      return true
    })
  }, [companies, searchQuery, selectedSector, selectedInvestor, selectedStage])

  // Patent filtering with search
  const filteredPatents = useMemo(() => {
    return patents.filter(patent => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          patent.title.toLowerCase().includes(query) ||
          patent.description.toLowerCase().includes(query) ||
          patent.company.toLowerCase().includes(query) ||
          patent.sector.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }
      
      // Sector filter
      if (selectedSector !== 'All Sectors' && patent.sector !== selectedSector) return false
      
      return true
    })
  }, [patents, searchQuery, selectedSector])

  // Pagination
  const totalPages = Math.ceil(
    selectedTab === 'patent-deep-dive' 
      ? filteredPatents.length / itemsPerPage
      : filteredCompanies.length / itemsPerPage
  )
  
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredCompanies.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredCompanies, currentPage, itemsPerPage])

  const paginatedPatents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredPatents.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPatents, currentPage, itemsPerPage])

  const sectorActivityData = [
    { name: 'Cloud', companies: 45, funding: 890 },
    { name: 'Network', companies: 38, funding: 720 },
    { name: 'Data', companies: 32, funding: 650 },
    { name: 'Threat', companies: 28, funding: 520 },
    { name: 'Identity', companies: 24, funding: 480 },
    { name: 'Endpoint', companies: 22, funding: 410 }
  ]

  const growthComparisonData = [
    { name: 'Cloud', lastMonth: 26, thisMonth: 28, growth: 3 },
    { name: 'Network', lastMonth: 20, thisMonth: 22, growth: 2 },
    { name: 'Data', lastMonth: 16, thisMonth: 18, growth: 2 },
    { name: 'Threat', lastMonth: 23, thisMonth: 25, growth: 2 },
    { name: 'Identity', lastMonth: 14, thisMonth: 15, growth: 1 },
    { name: 'Endpoint', lastMonth: 11, thisMonth: 12, growth: 1 }
  ]

  const FilterDropdown = ({ label, value, options, onChange }: any) => {
    const [open, setOpen] = useState(false)
    
    return (
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          {label}
        </label>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <span className={value === `All ${label}` || value.includes('All') ? 'text-blue-600' : 'text-gray-900'}>
              {value} {(value === `All ${label}` || value.includes('All')) && '✓'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          {open && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {options.map((option: string) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className={value === option ? 'text-blue-600 font-medium' : 'text-gray-700'}>
                    {option}
                  </span>
                  {value === option && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-4xl font-bold text-gray-900">Balli-Intel</h1>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setSelectedTab('market-intelligence')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  selectedTab === 'market-intelligence'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Market Intelligence
              </Button>
              <Button
                onClick={() => setSelectedTab('trending-sectors')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  selectedTab === 'trending-sectors'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Sectors
              </Button>
              <Button
                onClick={() => setSelectedTab('patent-deep-dive')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  selectedTab === 'patent-deep-dive'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Patent Deep Dive
              </Button>
              <Button
                onClick={() => setSelectedTab('brightdata-monitor')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  selectedTab === 'brightdata-monitor'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Globe className="h-4 w-4 mr-2" />
                Data Intelligence
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Filters (hide for BrightData monitor) */}
        {selectedTab !== 'brightdata-monitor' && (
        <aside className="w-64 border-r border-gray-200 bg-white min-h-screen p-6">
          {selectedTab === 'trending-sectors' && (
            <>
              <FilterDropdown
                label="FUNDING STAGE"
                value={selectedStage}
                options={stages}
                onChange={setSelectedStage}
              />

              <FilterDropdown
                label="INVESTOR"
                value={selectedInvestor}
                options={investors}
                onChange={setSelectedInvestor}
              />

              <FilterDropdown
                label="PERIOD"
                value={selectedPeriod}
                options={periods}
                onChange={setSelectedPeriod}
              />

              {/* Display Mode */}
              <div className="mt-8">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  DISPLAY
                </label>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setDisplayMode('grid')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center ${
                      displayMode === 'grid'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    onClick={() => setDisplayMode('list')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center ${
                      displayMode === 'list'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedTab === 'market-intelligence' && (
            <>
              <FilterDropdown
                label="SECTOR"
                value={selectedSector}
                options={sectorOptions}
                onChange={setSelectedSector}
              />

              <FilterDropdown
                label="REGION"
                value={selectedRegion}
                options={regions}
                onChange={setSelectedRegion}
              />

              <FilterDropdown
                label="FUNDING STAGE"
                value={selectedStage}
                options={stages}
                onChange={setSelectedStage}
              />

              <FilterDropdown
                label="INVESTOR"
                value={selectedInvestor}
                options={investors}
                onChange={setSelectedInvestor}
              />

              <FilterDropdown
                label="PERIOD"
                value={selectedPeriod}
                options={periods}
                onChange={setSelectedPeriod}
              />

              {/* Display Mode */}
              <div className="mt-8">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  DISPLAY
                </label>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setDisplayMode('grid')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center ${
                      displayMode === 'grid'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    onClick={() => setDisplayMode('list')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center ${
                      displayMode === 'list'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedTab === 'patent-deep-dive' && (
            <>
              <FilterDropdown
                label="SECTOR"
                value={selectedSector}
                options={sectorOptions}
                onChange={setSelectedSector}
              />

              <FilterDropdown
                label="PERIOD"
                value={selectedPeriod}
                options={periods}
                onChange={setSelectedPeriod}
              />

              {/* Patent-specific info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-2">Patent Insights</p>
                <p className="text-xs text-blue-700">
                  Discover innovative cybersecurity patents with high novelty scores
                </p>
              </div>
            </>
          )}
        </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          {/* Error Alert */}
          {error && (
            <div className="p-8 pb-0">
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading data...</p>
              </div>
            </div>
          )}
          {/* Trending Sectors View */}
          {selectedTab === 'trending-sectors' && !loading && (
            <div className="p-10">
              {/* Sector Cards Grid */}
              <div className={displayMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {sectors.map((sector) => (
                  <SectorIntelligenceCard 
                    key={sector.id} 
                    sector={sector} 
                    displayMode={displayMode} 
                  />
                ))}
              </div>

              {/* Analytics Section */}
              <div className="space-y-8">
                {/* Sector Activity Overview */}
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sector Activity Overview</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={sectorActivityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#6b7280' }}
                          axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          tick={{ fill: '#6b7280' }}
                          axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="companies" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="funding" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Month-over-Month Growth Comparison */}
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Month-over-Month Growth Comparison</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={growthComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#6b7280' }}
                          axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          tick={{ fill: '#6b7280' }}
                          axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="lastMonth" fill="#6b7280" radius={[4, 4, 0, 0]} name="Last Month" />
                        <Bar dataKey="thisMonth" fill="#3b82f6" radius={[4, 4, 0, 0]} name="This Month" />
                      </BarChart>
                    </ResponsiveContainer>
                    
                    {/* Growth Indicators */}
                    <div className="grid grid-cols-6 gap-4 mt-8">
                      {growthComparisonData.map((item) => (
                        <div key={item.name} className="text-center">
                          <p className="text-sm text-gray-600 mb-1">{item.name}</p>
                          <p className="text-lg font-bold text-green-600">+{item.growth}%</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Market Intelligence View */}
          {selectedTab === 'market-intelligence' && !loading && (
            <div className="p-8">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search companies by name, description, or sector..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Results Header */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {paginatedCompanies.length} of {filteredCompanies.length} companies
                  {searchQuery && ` (filtered from ${companies.length} total)`}
                </p>
              </div>

              {/* Companies Grid */}
              <div className={displayMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {paginatedCompanies.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {searchQuery ? 'No companies match your search' : 'No companies available'}
                    </p>
                    {searchQuery && (
                      <Button
                        onClick={() => setSearchQuery('')}
                        className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  paginatedCompanies.map((company) => (
                    <CompanyIntelligenceCard 
                      key={company.id} 
                      company={company} 
                      onShowDetails={(company) => {
                        setSelectedCompany(company)
                        setShowDialog(true)
                      }} 
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {filteredCompanies.length > itemsPerPage && (
                <div className="flex items-center justify-center mt-8 space-x-2">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Patent Deep Dive View */}
          {selectedTab === 'patent-deep-dive' && !loading && (
            <div className="p-8">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search patents by title, company, or sector..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Results Header */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {paginatedPatents.length} of {filteredPatents.length} patents
                  {searchQuery && ` (filtered from ${patents.length} total)`}
                </p>
              </div>

              {/* Patents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedPatents.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {searchQuery ? 'No patents match your search' : 'No patents available'}
                    </p>
                    {searchQuery && (
                      <Button
                        onClick={() => setSearchQuery('')}
                        className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  paginatedPatents.map((patent) => (
                    <PatentIntelligenceCard key={patent.id} patent={patent} />
                  ))
                )}
              </div>

              {/* Pagination */}
              {filteredPatents.length > itemsPerPage && (
                <div className="flex items-center justify-center mt-8 space-x-2">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Company Details Dialog */}
      <EnhancedCompanyDialog 
        company={selectedCompany} 
        open={showDialog} 
        onOpenChange={setShowDialog} 
      />

      {/* BrightData Monitor View */}
      {selectedTab === 'brightdata-monitor' && !loading && (
        <div className="p-10">
          <BrightDataMonitor />
        </div>
      )}
    </div>
  )
}
