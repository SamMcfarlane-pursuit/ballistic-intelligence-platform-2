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
  ExternalLink, 
  RefreshCw,
  Globe,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Database,
  Award,
  Building2,
  MessageCircle,
  Calendar,
  Eye
} from 'lucide-react'

interface DiscoveryPlatform {
  id: string
  name: string
  type: 'database' | 'directory' | 'social' | 'government' | 'aggregator'
  url: string
  description: string
  freeFeatures: string[]
  howToUse: string
  region: 'global' | 'us' | 'eu' | 'uk' | 'mena'
  cybersecurityFocus: boolean
  lastChecked: string
  isActive: boolean
}

interface DealFlowOpportunity {
  id: string
  companyName: string
  description: string
  platform: string
  platformUrl: string
  fundingStage: string
  estimatedFunding: number
  cybersecurityCategory: string
  location: string
  foundedYear: number
  employeeCount: number
  lastUpdated: string
  status: 'new' | 'contacted' | 'meeting' | 'due_diligence' | 'invested' | 'passed'
  priority: 'high' | 'medium' | 'low'
  notes: string
}

interface SourcingMetrics {
  totalPlatforms: number
  activePlatforms: number
  totalOpportunities: number
  newOpportunities: number
  contactedOpportunities: number
  topCategories: Array<{
    category: string
    count: number
  }>
  topPlatforms: Array<{
    platform: string
    opportunities: number
  }>
  recentActivity: Array<{
    action: string
    company: string
    platform: string
    date: string
  }>
}

export default function DealFlowSourcing() {
  const [platforms, setPlatforms] = useState<DiscoveryPlatform[]>([])
  const [opportunities, setOpportunities] = useState<DealFlowOpportunity[]>([])
  const [metrics, setMetrics] = useState<SourcingMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterRegion, setFilterRegion] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [lastRefresh, setLastRefresh] = useState<string>('')

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [platformsRes, opportunitiesRes, metricsRes] = await Promise.all([
        fetch('/api/discovery-platforms'),
        fetch('/api/deal-flow-opportunities'),
        fetch('/api/sourcing-metrics')
      ])

      if (platformsRes.ok) {
        const platformsData = await platformsRes.json()
        setPlatforms(platformsData.data || [])
      }

      if (opportunitiesRes.ok) {
        const opportunitiesData = await opportunitiesRes.json()
        setOpportunities(opportunitiesData.data || [])
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData.data)
      }

      setLastRefresh(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error fetching deal flow data:', error)
      // Load mock data as fallback
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    // Mock discovery platforms
    const mockPlatforms: DiscoveryPlatform[] = [
      {
        id: '1',
        name: 'Crunchbase Basic',
        type: 'database',
        url: 'https://www.crunchbase.com',
        description: 'Search 1M+ startups, filter by cybersecurity and funding status',
        freeFeatures: ['Search startups', 'Filter by industry', 'Track funding rounds', 'View investor lists'],
        howToUse: 'Go to crunchbase.com → Search → Add filters: Industry: Cybersecurity, Funding Status: Active',
        region: 'global',
        cybersecurityFocus: true,
        lastChecked: '2024-01-15',
        isActive: true
      },
      {
        id: '2',
        name: 'AngelList',
        type: 'database',
        url: 'https://angel.co',
        description: 'Browse startups by sector, view open funding rounds, connect with founders',
        freeFeatures: ['Browse startups', 'View funding rounds', 'Founder connections', 'Investor matching'],
        howToUse: 'Visit angel.co → Search "Cybersecurity" → Filter by "Raising"',
        region: 'global',
        cybersecurityFocus: false,
        lastChecked: '2024-01-14',
        isActive: true
      },
      {
        id: '3',
        name: 'CyberDB',
        type: 'directory',
        url: 'https://cyberdb.co',
        description: '3,000+ cybersecurity startups, investor directory, M&A tracking',
        freeFeatures: ['Startup search', 'Investor directory', 'M&A tracking', 'Subsector filtering'],
        howToUse: 'Visit cyberdb.co → Use "Startup Search" → Filter by "Funding Stage"',
        region: 'global',
        cybersecurityFocus: true,
        lastChecked: '2024-01-15',
        isActive: true
      },
      {
        id: '4',
        name: 'Team8 Portfolio',
        type: 'directory',
        url: 'https://team8.vc/portfolio',
        description: 'Cybersecurity venture studio portfolio with funding status updates',
        freeFeatures: ['Portfolio viewing', 'Funding status', 'Company profiles', 'Team information'],
        howToUse: 'Browse team8.vc/portfolio',
        region: 'global',
        cybersecurityFocus: true,
        lastChecked: '2024-01-13',
        isActive: true
      },
      {
        id: '5',
        name: 'SBIR.gov',
        type: 'government',
        url: 'https://www.sbir.gov',
        description: 'US government database of startups receiving non-dilutive grants',
        freeFeatures: ['Grant search', 'Topic filtering', 'Award status tracking', 'Company profiles'],
        howToUse: 'Search sbir.gov → Filter: Topic: Cybersecurity + Award Status: Active',
        region: 'us',
        cybersecurityFocus: true,
        lastChecked: '2024-01-12',
        isActive: true
      },
      {
        id: '6',
        name: 'LinkedIn',
        type: 'social',
        url: 'https://linkedin.com',
        description: 'Search startups by keywords and connect with founders directly',
        freeFeatures: ['Company search', 'Founder messaging', 'Employee insights', 'Funding announcements'],
        howToUse: 'Search "cybersecurity startup raising" → Filter by company size',
        region: 'global',
        cybersecurityFocus: false,
        lastChecked: '2024-01-15',
        isActive: true
      },
      {
        id: '7',
        name: 'F6S',
        type: 'aggregator',
        url: 'https://www.f6s.com',
        description: '1.5M+ startups, accelerator applications, and grant listings',
        freeFeatures: ['Startup browsing', 'Accelerator cohorts', 'Grant listings', 'Funding status'],
        howToUse: 'Visit f6s.com → Search "Cybersecurity" → Filter by "Funding Status: Open"',
        region: 'global',
        cybersecurityFocus: false,
        lastChecked: '2024-01-14',
        isActive: true
      },
      {
        id: '8',
        name: 'MACH37 Companies',
        type: 'directory',
        url: 'https://mach37.com/companies',
        description: 'Virginia-based cybersecurity accelerator cohort directory',
        freeFeatures: ['Cohort viewing', 'Company profiles', 'Funding stage info', 'Contact details'],
        howToUse: 'Visit mach37.com/companies',
        region: 'us',
        cybersecurityFocus: true,
        lastChecked: '2024-01-10',
        isActive: true
      }
    ]

    // Mock deal flow opportunities
    const mockOpportunities: DealFlowOpportunity[] = [
      {
        id: '1',
        companyName: 'QuantumCrypt',
        description: 'Post-quantum cryptography solutions for enterprise security',
        platform: 'Crunchbase Basic',
        platformUrl: 'https://crunchbase.com',
        fundingStage: 'Seed',
        estimatedFunding: 2000000,
        cybersecurityCategory: 'Cryptography',
        location: 'Cambridge, MA',
        foundedYear: 2022,
        employeeCount: 8,
        lastUpdated: '2024-01-15',
        status: 'new',
        priority: 'high',
        notes: 'Strong technical team from MIT. Large addressable market.'
      },
      {
        id: '2',
        companyName: 'APIFortress',
        description: 'API security and management platform for modern applications',
        platform: 'AngelList',
        platformUrl: 'https://angel.co',
        fundingStage: 'Series A',
        estimatedFunding: 8000000,
        cybersecurityCategory: 'API Security',
        location: 'San Francisco, CA',
        foundedYear: 2021,
        employeeCount: 25,
        lastUpdated: '2024-01-14',
        status: 'contacted',
        priority: 'high',
        notes: 'Excellent product-market fit. Revenue growing 300% YoY.'
      },
      {
        id: '3',
        companyName: 'IoTShield',
        description: 'IoT device security and vulnerability management platform',
        platform: 'CyberDB',
        platformUrl: 'https://cyberdb.co',
        fundingStage: 'Seed',
        estimatedFunding: 3000000,
        cybersecurityCategory: 'IoT Security',
        location: 'Austin, TX',
        foundedYear: 2023,
        employeeCount: 12,
        lastUpdated: '2024-01-13',
        status: 'meeting',
        priority: 'medium',
        notes: 'Interesting technology but early stage. Need more traction data.'
      },
      {
        id: '4',
        companyName: 'CloudGuardian',
        description: 'Cloud-native security posture management with AI-driven insights',
        platform: 'Team8 Portfolio',
        platformUrl: 'https://team8.vc/portfolio',
        fundingStage: 'Series A',
        estimatedFunding: 12000000,
        cybersecurityCategory: 'Cloud Security',
        location: 'Tel Aviv, Israel',
        foundedYear: 2022,
        employeeCount: 35,
        lastUpdated: '2024-01-12',
        status: 'due_diligence',
        priority: 'high',
        notes: 'Strong team and technology. Enterprise customers growing rapidly.'
      },
      {
        id: '5',
        companyName: 'SecureAI',
        description: 'AI-powered threat detection and response automation',
        platform: 'SBIR.gov',
        platformUrl: 'https://sbir.gov',
        fundingStage: 'Pre-seed',
        estimatedFunding: 750000,
        cybersecurityCategory: 'AI Security',
        location: 'Boston, MA',
        foundedYear: 2023,
        employeeCount: 6,
        lastUpdated: '2024-01-11',
        status: 'new',
        priority: 'medium',
        notes: 'Government grant recipient. Promising technology but needs commercial validation.'
      }
    ]

    // Mock metrics
    const mockMetrics: SourcingMetrics = {
      totalPlatforms: 8,
      activePlatforms: 8,
      totalOpportunities: 5,
      newOpportunities: 2,
      contactedOpportunities: 1,
      topCategories: [
        { category: 'AI Security', count: 1 },
        { category: 'Cloud Security', count: 1 },
        { category: 'API Security', count: 1 },
        { category: 'IoT Security', count: 1 },
        { category: 'Cryptography', count: 1 }
      ],
      topPlatforms: [
        { platform: 'Crunchbase Basic', opportunities: 1 },
        { platform: 'AngelList', opportunities: 1 },
        { platform: 'CyberDB', opportunities: 1 },
        { platform: 'Team8 Portfolio', opportunities: 1 },
        { platform: 'SBIR.gov', opportunities: 1 }
      ],
      recentActivity: [
        { action: 'New Opportunity', company: 'QuantumCrypt', platform: 'Crunchbase Basic', date: '2024-01-15' },
        { action: 'Contacted', company: 'APIFortress', platform: 'AngelList', date: '2024-01-14' },
        { action: 'Meeting Scheduled', company: 'IoTShield', platform: 'CyberDB', date: '2024-01-13' },
        { action: 'Due Diligence Started', company: 'CloudGuardian', platform: 'Team8 Portfolio', date: '2024-01-12' },
        { action: 'New Opportunity', company: 'SecureAI', platform: 'SBIR.gov', date: '2024-01-11' }
      ]
    }

    setPlatforms(mockPlatforms)
    setOpportunities(mockOpportunities)
    setMetrics(mockMetrics)
    setLastRefresh(new Date().toLocaleTimeString())
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchData, 1800000)
    
    return () => clearInterval(interval)
  }, [])

  const filteredPlatforms = platforms
    .filter(platform => {
      const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           platform.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || platform.type === filterType
      const matchesRegion = filterRegion === 'all' || platform.region === filterRegion
      return matchesSearch && matchesType && matchesRegion
    })

  const filteredOpportunities = opportunities
    .filter(opportunity => {
      const matchesSearch = opportunity.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           opportunity.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || opportunity.status === filterStatus
      return matchesSearch && matchesStatus
    })

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    } else {
      return `$${amount}`
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'database': return 'bg-blue-100 text-blue-800'
      case 'directory': return 'bg-green-100 text-green-800'
      case 'social': return 'bg-purple-100 text-purple-800'
      case 'government': return 'bg-orange-100 text-orange-800'
      case 'aggregator': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'meeting': return 'bg-blue-100 text-blue-800'
      case 'due_diligence': return 'bg-purple-100 text-purple-800'
      case 'invested': return 'bg-green-100 text-green-800'
      case 'passed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getRegionIcon = (region: string) => {
    switch (region) {
      case 'global': return <Globe className="h-4 w-4" />
      case 'us': return <Building2 className="h-4 w-4" />
      case 'eu': return <Building2 className="h-4 w-4" />
      case 'uk': return <Building2 className="h-4 w-4" />
      case 'mena': return <Building2 className="h-4 w-4" />
      default: return <Globe className="h-4 w-4" />
    }
  }

  const exportToJSON = () => {
    const data = {
      platforms: filteredPlatforms,
      opportunities: filteredOpportunities,
      metrics,
      exportDate: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `deal-flow-sourcing-${new Date().toISOString().split('T')[0]}.json`
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
          <h2 className="text-2xl font-bold">Deal Flow Sourcing</h2>
          <p className="text-muted-foreground">
            Free cybersecurity startup discovery platforms and deal flow tracking • Last updated: {lastRefresh}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportToJSON}>
            <Database className="h-4 w-4 mr-2" />
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
                  <p className="text-sm font-medium text-muted-foreground">Active Platforms</p>
                  <p className="text-2xl font-bold">{metrics.activePlatforms}/{metrics.totalPlatforms}</p>
                </div>
                <Database className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Opportunities</p>
                  <p className="text-2xl font-bold">{metrics.totalOpportunities}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Opportunities</p>
                  <p className="text-2xl font-bold">{metrics.newOpportunities}</p>
                </div>
                <Star className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contacted</p>
                  <p className="text-2xl font-bold">{metrics.contactedOpportunities}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-purple-600" />
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
                  placeholder="Search platforms or opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="directory">Directory</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="aggregator">Aggregator</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="us">US</SelectItem>
                <SelectItem value="eu">EU</SelectItem>
                <SelectItem value="uk">UK</SelectItem>
                <SelectItem value="mena">MENA</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="due_diligence">Due Diligence</SelectItem>
                <SelectItem value="invested">Invested</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platforms">Discovery Platforms</TabsTrigger>
          <TabsTrigger value="opportunities">Deal Opportunities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discovery Platforms ({filteredPlatforms.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredPlatforms.map((platform) => (
                    <Card key={platform.id} className="border border-border/60">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{platform.name}</h3>
                              <Badge className={getTypeColor(platform.type)}>
                                {platform.type}
                              </Badge>
                              {platform.cybersecurityFocus && (
                                <Badge variant="default">Cyber Focus</Badge>
                              )}
                              {platform.isActive ? (
                                <Badge variant="outline" className="text-green-600">Active</Badge>
                              ) : (
                                <Badge variant="outline" className="text-red-600">Inactive</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {platform.description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Free Features:</span>
                                <div className="flex flex-wrap gap-1">
                                  {platform.freeFeatures.slice(0, 3).map((feature, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                  {platform.freeFeatures.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{platform.freeFeatures.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">How to Use:</span>
                                <span className="text-muted-foreground">{platform.howToUse}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  {getRegionIcon(platform.region)}
                                  <span>{platform.region.toUpperCase()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Last checked: {platform.lastChecked}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="sm" asChild>
                              <a href={platform.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deal Opportunities ({filteredOpportunities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Funding</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOpportunities.map((opportunity) => (
                      <TableRow key={opportunity.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{opportunity.companyName}</p>
                            <p className="text-sm text-muted-foreground">{opportunity.location}</p>
                            <p className="text-xs text-muted-foreground mt-1">{opportunity.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{opportunity.platform}</span>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={opportunity.platformUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{opportunity.fundingStage}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{formatCurrency(opportunity.estimatedFunding)}</p>
                          <p className="text-sm text-muted-foreground">{opportunity.employeeCount} employees</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{opportunity.cybersecurityCategory}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(opportunity.status)}>
                            {opportunity.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(opportunity.priority)}`}></div>
                            <span className="text-sm">{opportunity.priority}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
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
                          <p className="text-sm text-muted-foreground">{category.count} opportunities</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium">{category.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.topPlatforms.map((platform, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{platform.platform}</p>
                          <p className="text-sm text-muted-foreground">{platform.opportunities} opportunities</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">{platform.opportunities}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {activity.action === 'New Opportunity' && <Star className="h-4 w-4 text-orange-500" />}
                            {activity.action === 'Contacted' && <MessageCircle className="h-4 w-4 text-blue-500" />}
                            {activity.action === 'Meeting Scheduled' && <Calendar className="h-4 w-4 text-purple-500" />}
                            {activity.action === 'Due Diligence Started' && <TrendingUp className="h-4 w-4 text-green-500" />}
                            <span className="text-sm font-medium">{activity.action}</span>
                          </div>
                          <div>
                            <p className="font-medium">{activity.company}</p>
                            <p className="text-sm text-muted-foreground">{activity.platform}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
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