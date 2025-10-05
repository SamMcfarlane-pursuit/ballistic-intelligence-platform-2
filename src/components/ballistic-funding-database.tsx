"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Calendar,
  ExternalLink,
  Download,
  RefreshCw,
  Eye,
  Star,
  Target,
  Users,
  BarChart3,
  Award,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'

interface BallisticPortfolioCompany {
  id: string
  name: string
  description: string
  founded_year: number
  location: string
  cybersecurity_category: string
  funding_stage: string
  funding_amount: number
  funding_date: string
  lead_investor: string
  employee_range: string
  website?: string
  users?: string
  revenue?: string
  growth?: string
  active_users: boolean
  paying_customers: boolean
  mssp_integration: boolean
  market_traction: number
  exit_type?: string
  acquirer?: string
  exit_date?: string
  exit_value?: number
  fundingRounds: BallisticFundingRound[]
  teamMembers: BallisticTeamMember[]
}

interface BallisticFundingRound {
  id: string
  company_id: string
  round_type: string
  amount_usd: number
  announced_date: string
  lead_investor?: string
  valuation?: number
  pre_money_valuation?: number
  post_money_valuation?: number
  ballistic_participation: boolean
  investment_thesis?: string
  due_diligence_notes?: string
  board_seat: boolean
}

interface BallisticTeamMember {
  id: string
  company_id: string
  name: string
  position: string
  background?: string
  linkedin_url?: string
  is_founder: boolean
  is_ceo: boolean
  is_cto: boolean
  prior_experience?: string
}

interface CybersecurityStartup {
  id: string
  name: string
  description: string
  founded_year: number
  headquarters: string
  website?: string
  primary_category: string
  secondary_categories?: string
  target_market?: string
  total_funding: number
  funding_rounds_count: number
  last_funding_date?: string
  current_stage?: string
  employee_count?: number
  estimated_revenue?: number
  growth_rate?: number
  core_technology?: string
  patents_count: number
  market_cap?: number
  competitors?: string
  is_ballistic_portfolio: boolean
  ballistic_notes?: string
  fundingRounds: CybersecurityStartupFunding[]
  teamMembers: CybersecurityStartupTeam[]
  acquisitions: Acquisition[]
}

interface CybersecurityStartupFunding {
  id: string
  startup_id: string
  round_type: string
  amount_usd: number
  announced_date: string
  lead_investor?: string
  valuation?: number
  investors?: string
  investment_thesis?: string
}

interface CybersecurityStartupTeam {
  id: string
  startup_id: string
  name: string
  position: string
  background?: string
  linkedin_url?: string
  is_founder: boolean
  prior_companies?: string
  education?: string
  expertise?: string
}

interface Acquisition {
  id: string
  startup_id: string
  acquirer: string
  acquisition_date: string
  acquisition_value?: number
  deal_type?: string
  premium_percentage?: number
  earnout: boolean
  earnout_terms?: string
  strategic_rationale?: string
  integration_status?: string
}

interface DatabaseMetrics {
  totalPortfolioCompanies: number
  totalInvested: number
  averageInvestment: number
  successfulExits: number
  totalStartupsTracked: number
  totalFundingTracked: number
  topCategories: Array<{
    category: string
    count: number
    funding: number
  }>
  recentActivity: Array<{
    type: string
    company: string
    amount: number
    date: string
  }>
}

export default function BallisticFundingDatabase() {
  const [portfolioCompanies, setPortfolioCompanies] = useState<BallisticPortfolioCompany[]>([])
  const [cybersecurityStartups, setCybersecurityStartups] = useState<CybersecurityStartup[]>([])
  const [metrics, setMetrics] = useState<DatabaseMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStage, setFilterStage] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('funding_amount')
  const [lastRefresh, setLastRefresh] = useState<string>('')

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [portfolioRes, startupsRes, metricsRes] = await Promise.all([
        fetch('/api/ballistic-portfolio'),
        fetch('/api/cybersecurity-startups'),
        fetch('/api/ballistic-metrics')
      ])

      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json()
        setPortfolioCompanies(portfolioData.data || [])
      }

      if (startupsRes.ok) {
        const startupsData = await startupsRes.json()
        setCybersecurityStartups(startupsData.data || [])
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData.data)
      }

      setLastRefresh(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error fetching data:', error)
      // Load mock data as fallback
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    // Mock portfolio companies
    const mockPortfolio: BallisticPortfolioCompany[] = [
      {
        id: '1',
        name: 'SecureShield AI',
        description: 'AI-powered threat detection and response platform',
        founded_year: 2021,
        location: 'Palo Alto, CA',
        cybersecurity_category: 'AI Security',
        funding_stage: 'Series A',
        funding_amount: 15000000,
        funding_date: '2023-06-15',
        lead_investor: 'Ballistic Ventures',
        employee_range: '50-100',
        website: 'https://secureshield.ai',
        users: '10K+',
        revenue: '$5M ARR',
        growth: '300% YoY',
        active_users: true,
        paying_customers: true,
        mssp_integration: true,
        market_traction: 85,
        fundingRounds: [],
        teamMembers: []
      },
      {
        id: '2',
        name: 'CloudFortress',
        description: 'Cloud-native security posture management',
        founded_year: 2020,
        location: 'Austin, TX',
        cybersecurity_category: 'Cloud Security',
        funding_stage: 'Series B',
        funding_amount: 35000000,
        funding_date: '2023-09-20',
        lead_investor: 'Ballistic Ventures',
        employee_range: '100-200',
        website: 'https://cloudfortress.com',
        users: '50K+',
        revenue: '$20M ARR',
        growth: '250% YoY',
        active_users: true,
        paying_customers: true,
        mssp_integration: true,
        market_traction: 92,
        exit_type: 'acquired',
        acquirer: 'Cisco',
        exit_date: '2024-01-15',
        exit_value: 450000000,
        fundingRounds: [],
        teamMembers: []
      }
    ]

    // Mock cybersecurity startups
    const mockStartups: CybersecurityStartup[] = [
      {
        id: '1',
        name: 'ThreatHunter Pro',
        description: 'Advanced threat hunting platform',
        founded_year: 2022,
        headquarters: 'Boston, MA',
        website: 'https://threathunter.pro',
        primary_category: 'Threat Detection',
        secondary_categories: '["AI/ML", "Endpoint Security"]',
        target_market: 'Enterprise',
        total_funding: 8000000,
        funding_rounds_count: 2,
        last_funding_date: '2023-11-10',
        current_stage: 'Series A',
        employee_count: 25,
        estimated_revenue: 2000000,
        growth_rate: 150,
        core_technology: 'AI/ML',
        patents_count: 3,
        is_ballistic_portfolio: false,
        ballistic_notes: 'Potential investment target',
        fundingRounds: [],
        teamMembers: [],
        acquisitions: []
      },
      {
        id: '2',
        name: 'ZeroTrust Networks',
        description: 'Zero trust architecture solutions',
        founded_year: 2021,
        headquarters: 'Seattle, WA',
        website: 'https://zerotrust.networks',
        primary_category: 'Network Security',
        secondary_categories: '["Zero Trust", "Identity"]',
        target_market: 'Enterprise',
        total_funding: 12000000,
        funding_rounds_count: 3,
        last_funding_date: '2023-10-05',
        current_stage: 'Series B',
        employee_count: 45,
        estimated_revenue: 5000000,
        growth_rate: 200,
        core_technology: 'Zero Trust',
        patents_count: 5,
        is_ballistic_portfolio: true,
        ballistic_notes: 'Strong portfolio company',
        fundingRounds: [],
        teamMembers: [],
        acquisitions: []
      }
    ]

    // Mock metrics
    const mockMetrics: DatabaseMetrics = {
      totalPortfolioCompanies: 12,
      totalInvested: 185000000,
      averageInvestment: 15416667,
      successfulExits: 3,
      totalStartupsTracked: 247,
      totalFundingTracked: 3200000000,
      topCategories: [
        { category: 'AI Security', count: 45, funding: 850000000 },
        { category: 'Cloud Security', count: 38, funding: 720000000 },
        { category: 'Threat Detection', count: 32, funding: 580000000 },
        { category: 'Zero Trust', count: 28, funding: 520000000 },
        { category: 'Identity Security', count: 24, funding: 480000000 }
      ],
      recentActivity: [
        { type: 'Funding', company: 'SecureShield AI', amount: 15000000, date: '2023-06-15' },
        { type: 'Exit', company: 'CloudFortress', amount: 450000000, date: '2024-01-15' },
        { type: 'Funding', company: 'ZeroTrust Networks', amount: 12000000, date: '2023-10-05' }
      ]
    }

    setPortfolioCompanies(mockPortfolio)
    setCybersecurityStartups(mockStartups)
    setMetrics(mockMetrics)
    setLastRefresh(new Date().toLocaleTimeString())
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 300000)
    
    return () => clearInterval(interval)
  }, [])

  const filteredPortfolio = portfolioCompanies
    .filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || company.cybersecurity_category === filterCategory
      const matchesStage = filterStage === 'all' || company.funding_stage === filterStage
      return matchesSearch && matchesCategory && matchesStage
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'funding_amount':
          return b.funding_amount - a.funding_amount
        case 'founded_year':
          return a.founded_year - b.founded_year
        case 'market_traction':
          return b.market_traction - a.market_traction
        default:
          return 0
      }
    })

  const filteredStartups = cybersecurityStartups
    .filter(startup => {
      const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           startup.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || startup.primary_category === filterCategory
      const matchesStage = filterStage === 'all' || startup.current_stage === filterStage
      return matchesSearch && matchesCategory && matchesStage
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'total_funding':
          return b.total_funding - a.total_funding
        case 'founded_year':
          return a.founded_year - b.founded_year
        case 'employee_count':
          return (b.employee_count || 0) - (a.employee_count || 0)
        default:
          return 0
      }
    })

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else {
      return `$${(amount / 1000).toFixed(1)}K`
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'pre-seed': return 'bg-gray-100 text-gray-800'
      case 'seed': return 'bg-green-100 text-green-800'
      case 'series-a': return 'bg-blue-100 text-blue-800'
      case 'series-b': return 'bg-purple-100 text-purple-800'
      case 'series-c': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportToJSON = () => {
    const data = {
      portfolioCompanies: filteredPortfolio,
      cybersecurityStartups: filteredStartups,
      metrics,
      exportDate: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ballistic-funding-database-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Ballistic Ventures Funding Database</h2>
          <p className="text-muted-foreground">
            Comprehensive database of cybersecurity startups and portfolio companies • Last updated: {lastRefresh}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportToJSON}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio Companies</p>
                  <p className="text-2xl font-bold">{metrics.totalPortfolioCompanies}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Invested</p>
                  <p className="text-2xl font-bold">{formatCurrency(metrics.totalInvested)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Successful Exits</p>
                  <p className="text-2xl font-bold">{metrics.successfulExits}</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Startups Tracked</p>
                  <p className="text-2xl font-bold">{metrics.totalStartupsTracked}</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="AI Security">AI Security</SelectItem>
                <SelectItem value="Cloud Security">Cloud Security</SelectItem>
                <SelectItem value="Threat Detection">Threat Detection</SelectItem>
                <SelectItem value="Zero Trust">Zero Trust</SelectItem>
                <SelectItem value="Identity Security">Identity Security</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="series-a">Series A</SelectItem>
                <SelectItem value="series-b">Series B</SelectItem>
                <SelectItem value="series-c">Series C+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funding_amount">Funding Amount</SelectItem>
                <SelectItem value="founded_year">Founded Year</SelectItem>
                <SelectItem value="market_traction">Market Traction</SelectItem>
                <SelectItem value="employee_count">Employee Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList>
          <TabsTrigger value="portfolio">Portfolio Companies</TabsTrigger>
          <TabsTrigger value="startups">Cybersecurity Startups</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Companies ({filteredPortfolio.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Funding</TableHead>
                      <TableHead>Traction</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPortfolio.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-muted-foreground">{company.location}</p>
                            <p className="text-xs text-muted-foreground mt-1">{company.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{company.cybersecurity_category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStageColor(company.funding_stage)}>
                            {company.funding_stage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{formatCurrency(company.funding_amount)}</p>
                          <p className="text-sm text-muted-foreground">{company.funding_date}</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs">{company.market_traction}% traction</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-xs">{company.growth} growth</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {company.exit_type ? (
                            <Badge variant="destructive">
                              {company.exit_type === 'acquired' ? 'Acquired' : company.exit_type}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {company.website && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="startups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cybersecurity Startups ({filteredStartups.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Total Funding</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Ballistic</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStartups.map((startup) => (
                      <TableRow key={startup.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{startup.name}</p>
                            <p className="text-sm text-muted-foreground">{startup.headquarters}</p>
                            <p className="text-xs text-muted-foreground mt-1">{startup.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{startup.primary_category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStageColor(startup.current_stage || '')}>
                            {startup.current_stage || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{formatCurrency(startup.total_funding)}</p>
                          <p className="text-sm text-muted-foreground">{startup.funding_rounds_count} rounds</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{startup.employee_count || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{startup.growth_rate}% growth</p>
                        </TableCell>
                        <TableCell>
                          {startup.is_ballistic_portfolio ? (
                            <Badge variant="default">Portfolio</Badge>
                          ) : (
                            <Badge variant="outline">Tracked</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {startup.website && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={startup.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.topCategories.map((category, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{category.category}</p>
                          <p className="text-sm text-muted-foreground">{category.count} companies</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(category.funding)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{activity.company}</p>
                          <p className="text-sm text-muted-foreground">{activity.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(activity.amount)}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}