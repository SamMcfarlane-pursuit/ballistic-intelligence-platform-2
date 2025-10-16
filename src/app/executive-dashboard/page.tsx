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

interface SectorData {
  id: string
  name: string
  rank: number
  companies: number
  totalFunding: number
  momentumScore: number
  momentumGrowth: number
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
        momentumGrowth: 28
      },
      {
        id: '2',
        name: 'Threat Intelligence',
        rank: 2,
        companies: 28,
        totalFunding: 520000000,
        momentumScore: 25,
        momentumGrowth: 25
      },
      {
        id: '3',
        name: 'Network Security',
        rank: 3,
        companies: 38,
        totalFunding: 720000000,
        momentumScore: 22,
        momentumGrowth: 22
      },
      {
        id: '4',
        name: 'Data Protection',
        rank: 4,
        companies: 32,
        totalFunding: 650000000,
        momentumScore: 18,
        momentumGrowth: 18
      },
      {
        id: '5',
        name: 'Identity Management',
        rank: 5,
        companies: 24,
        totalFunding: 480000000,
        momentumScore: 15,
        momentumGrowth: 15
      },
      {
        id: '6',
        name: 'Endpoint Security',
        rank: 6,
        companies: 22,
        totalFunding: 410000000,
        momentumScore: 12,
        momentumGrowth: 12
      }
    ]
    setSectors(mockSectors)
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
            ? new Date(details.fundingRounds[0].announced_date).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'short', day: 'numeric' 
              })
            : 'N/A',
          website: details?.website,
          linkedin: details?.linkedin_url
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
    // Mock data matching Figma design
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
        linkedin: 'linkedin.com/company/shieldtech'
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
        linkedin: 'linkedin.com/company/cryptoguard'
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
        linkedin: 'linkedin.com/company/threatvision'
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
        linkedin: 'linkedin.com/company/datavaultpro'
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
        description: 'Machine learning algorithm for detecting network intrusions in real-time',
        company: 'ShieldTech',
        companyId: '1',
        filingDate: 'Sep 19, 2025',
        sector: 'Network Security',
        noveltyScore: 94,
        innovationPotential: 'High Innovation Potential',
        patentNumber: 'US-2025-12345',
        status: 'Filed',
        claims: 18,
        citations: 12
      },
      {
        id: '2',
        title: 'Quantum-Resistant Encryption Protocol',
        description: 'Post-quantum cryptographic method resistant to quantum computing attacks',
        company: 'CryptoGuard',
        companyId: '2',
        filingDate: 'Sep 17, 2025',
        sector: 'Encryption',
        noveltyScore: 96,
        innovationPotential: 'High Innovation Potential',
        patentNumber: 'US-2025-12346',
        status: 'Filed',
        claims: 22,
        citations: 8
      },
      {
        id: '3',
        title: 'Multi-Cloud Security Orchestration Platform',
        description: 'Unified security management across multiple cloud providers',
        company: 'SecureCloud',
        companyId: '4',
        filingDate: 'Sep 11, 2025',
        sector: 'Cloud Security',
        noveltyScore: 91,
        innovationPotential: 'High Innovation Potential',
        patentNumber: 'US-2025-12347',
        status: 'Filed',
        claims: 15,
        citations: 6
      },
      {
        id: '4',
        title: 'Zero-Trust Identity Verification Method',
        description: 'Continuous authentication using behavioral biometrics',
        company: 'IdentityLock',
        companyId: '5',
        filingDate: 'Sep 4, 2025',
        sector: 'Identity Management',
        noveltyScore: 89,
        innovationPotential: 'High Innovation Potential',
        patentNumber: 'US-2025-12348',
        status: 'Pending',
        claims: 20,
        citations: 10
      },
      {
        id: '5',
        title: 'Real-Time Threat Intelligence Aggregation',
        description: 'AI-powered threat data collection and analysis system',
        company: 'ThreatVision',
        companyId: '3',
        filingDate: 'Aug 28, 2025',
        sector: 'Threat Intelligence',
        noveltyScore: 87,
        innovationPotential: 'High Innovation Potential',
        patentNumber: 'US-2025-12349',
        status: 'Granted',
        claims: 16,
        citations: 14
      },
      {
        id: '6',
        title: 'Advanced Data Loss Prevention Engine',
        description: 'Context-aware data classification and protection mechanism',
        company: 'DataVault Pro',
        companyId: '6',
        filingDate: 'Aug 22, 2025',
        sector: 'Data Protection',
        noveltyScore: 85,
        innovationPotential: 'High Innovation Potential',
        patentNumber: 'US-2025-12350',
        status: 'Filed',
        claims: 19,
        citations: 7
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
                    ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
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
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Filters */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {sectors.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No sector data available</p>
                  </div>
                ) : (
                  sectors.map((sector) => (
                  <Card
                    key={sector.id}
                    className="bg-white border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group relative"
                  >
                    <CardContent className="p-6">
                      {/* Sector Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{sector.name}</h3>
                            <p className="text-sm text-gray-500">{sector.companies} companies</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 px-2 py-1">
                          #{sector.rank}
                        </Badge>
                      </div>

                      {/* Total Funding */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Total Funding</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${' '}{formatCurrency(sector.totalFunding)}
                        </p>
                      </div>

                      {/* Momentum Score */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-500">Momentum Score</p>
                          <p className="text-sm font-bold text-gray-900">{sector.momentumScore}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${sector.momentumScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Growth */}
                      <div className="flex items-center space-x-2 text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-semibold">+{sector.momentumGrowth}% MoM growth</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
                )}
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
                  <Card
                    key={company.id}
                    className="bg-white border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      {/* Company Header */}
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {company.description}
                      </p>

                      {/* Company Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Sector:</span>
                          <span className="font-semibold text-gray-900">{company.sector}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Location:</span>
                          <div className="flex items-center text-gray-900">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{company.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Founded:</span>
                          <div className="flex items-center text-gray-900">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{company.founded}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Funding From:</span>
                          <div className="flex items-center text-blue-600">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{company.fundingFrom}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Total Funding:</span>
                          <span className="font-bold text-gray-900">{formatCurrency(company.totalFunding)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Last Round:</span>
                          <span className="font-semibold text-gray-900">
                            {company.lastRound} - {formatCurrency(company.lastRoundAmount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Latest Date of Funding:</span>
                          <span className="text-gray-900">{company.latestDateOfFunding}</span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Button
                        onClick={() => {
                          setSelectedCompany(company)
                          setShowDialog(true)
                        }}
                        className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 rounded-lg transition-all group-hover:border-blue-600 group-hover:text-blue-600"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
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
                    <Card
                      key={patent.id}
                      className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                    >
                      <CardContent className="p-6">
                        {/* Patent Header */}
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="flex-shrink-0">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {patent.title}
                            </h3>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4">
                          {patent.description}
                        </p>

                        {/* Patent Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Company:</span>
                            <div className="flex items-center text-blue-600">
                              <Building2 className="h-3 w-3 mr-1" />
                              <span className="font-semibold">{patent.company}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Filing Date:</span>
                            <div className="flex items-center text-gray-900">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{patent.filingDate}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Sector:</span>
                            <span className="font-semibold text-gray-900">{patent.sector}</span>
                          </div>
                        </div>

                        {/* Novelty Score */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Novelty Score:</span>
                            <div className="flex items-center">
                              <span className="text-sm font-bold text-gray-900 mr-1">{patent.noveltyScore}/100</span>
                              <TrendingUp className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${patent.noveltyScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Innovation Potential Badge */}
                        <div className="w-full">
                          <div className={`px-4 py-2 rounded-lg text-center text-sm font-semibold ${
                            patent.innovationPotential === 'High Innovation Potential'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : patent.innovationPotential === 'Medium Innovation Potential'
                              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              : 'bg-gray-50 text-gray-700 border border-gray-200'
                          }`}>
                            {patent.innovationPotential}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {selectedCompany?.name}
                </DialogTitle>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              View detailed information about {selectedCompany?.name}
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {/* About the Company */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">About the Company</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedCompany?.description}
                {selectedCompany?.team && '. Combines biometrics, behavioral analytics, and hardware tokens to reduce account takeover incidents by 94% across hybrid environments.'}
              </p>
            </div>

            {/* Team & Contact */}
            {selectedCompany?.team && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Team & Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Leadership Team</span>
                    <div className="text-right space-y-1">
                      <p className="text-gray-900">{selectedCompany.team.ceo}</p>
                      <p className="text-gray-900">{selectedCompany.team.cto}</p>
                      <p className="text-gray-900">{selectedCompany.team.head}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Links */}
            <div className="space-y-3">
              {selectedCompany?.website && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Website</span>
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {selectedCompany.website.replace('https://www.', '')}
                  </a>
                </div>
              )}
              {selectedCompany?.linkedin && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">LinkedIn</span>
                  <a
                    href={`https://${selectedCompany.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    {selectedCompany.linkedin}
                  </a>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
