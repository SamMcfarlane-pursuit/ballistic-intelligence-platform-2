"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Target, 
  TrendingUp, 
  Filter,
  Search,
  Star,
  ExternalLink,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  Building2,
  Eye,
  Brain,
  Zap,
  Shield,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useConventionSocket } from '@/hooks/use-convention-socket'

interface Convention {
  id: string
  name: string
  location: string
  start_date: string
  end_date: string
  website?: string
  description?: string
  is_active: boolean
  conventionCompanies: ConventionCompany[]
}

interface ConventionCompany {
  id: string
  convention_id: string
  company_name: string
  booth_number?: string
  description?: string
  website?: string
  cybersecurity_category?: string
  funding_stage?: string
  contact_email?: string
  contact_name?: string
  product_demo: boolean
  seeking_investment: boolean
  notes?: string
  active_users_score: number
  paying_customers_score: number
  mssp_integration_score: number
  technical_innovation: number
  founder_experience: number
  market_timing_score: number
  overall_fit_score: number
  status: string
  last_contact_date?: string
  next_follow_up?: string
  convention?: {
    name: string
    location: string
    start_date: string
    end_date: string
  }
}

export default function ConventionTracker() {
  const [conventions, setConventions] = useState<Convention[]>([])
  const [companies, setCompanies] = useState<ConventionCompany[]>([])
  const [selectedConvention, setSelectedConvention] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minScore, setMinScore] = useState('0')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // WebSocket for real-time updates
  const socket = useConventionSocket({
    conventionId: selectedConvention === 'all' ? undefined : selectedConvention,
    enableUpdates: true
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [conventionsResponse, companiesResponse] = await Promise.all([
          fetch('/api/conventions?active=true'),
          fetch('/api/convention-companies')
        ])

        if (conventionsResponse.ok && companiesResponse.ok) {
          const conventionsData = await conventionsResponse.json()
          const companiesData = await companiesResponse.json()
          
          setConventions(conventionsData.data)
          setCompanies(companiesData.data)
        }
      } catch (error) {
        console.error('Error loading convention data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle real-time updates
  useEffect(() => {
    if (socket.lastUpdate) {
      const update = socket.lastUpdate
      switch (update.type) {
        case 'new_company':
          // Add new company to the list
          setCompanies(prev => [...prev, update.data])
          break
        case 'status_change':
          // Update company status or score
          setCompanies(prev => prev.map(company => 
            company.id === update.data.companyId 
              ? { ...company, ...update.data.update }
              : company
          ))
          break
        case 'score_update':
          // Update company analysis score
          setCompanies(prev => prev.map(company => 
            company.id === update.data.companyId 
              ? { ...company, overall_fit_score: update.data.analysis.overall_fit_score }
              : company
          ))
          break
        case 'convention_added':
          // Add new convention
          setConventions(prev => [...prev, update.data])
          break
      }
    }
  }, [socket.lastUpdate])

  const handleCompanyStatusUpdate = (companyId: string, conventionId: string, update: any) => {
    socket.updateCompany({
      companyId,
      conventionId,
      update,
      userId: 'current-user' // In a real app, this would be the actual user ID
    })
    
    // Optimistically update the local state
    setCompanies(prev => prev.map(company => 
      company.id === companyId 
        ? { ...company, ...update }
        : company
    ))
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.cybersecurity_category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesConvention = selectedConvention === 'all' || company.convention_id === selectedConvention
    const matchesStatus = selectedStatus === 'all' || company.status === selectedStatus
    const matchesCategory = selectedCategory === 'all' || company.cybersecurity_category === selectedCategory
    const matchesScore = company.overall_fit_score >= parseInt(minScore)

    return matchesSearch && matchesConvention && matchesStatus && matchesCategory && matchesScore
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      prospect: { label: 'Prospect', variant: 'secondary' as const, icon: <Target className="h-3 w-3" /> },
      contacted: { label: 'Contacted', variant: 'outline' as const, icon: <Mail className="h-3 w-3" /> },
      meeting: { label: 'Meeting', variant: 'default' as const, icon: <Users className="h-3 w-3" /> },
      due_diligence: { label: 'Due Diligence', variant: 'default' as const, icon: <Brain className="h-3 w-3" /> },
      invested: { label: 'Invested', variant: 'default' as const, icon: <Award className="h-3 w-3" /> },
      passed: { label: 'Passed', variant: 'secondary' as const, icon: <AlertCircle className="h-3 w-3" /> }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.prospect
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getStageBadge = (stage: string) => {
    const stageConfig = {
      'pre-seed': { label: 'Pre-Seed', className: 'bg-purple-100 text-purple-800' },
      'seed': { label: 'Seed', className: 'bg-blue-100 text-blue-800' },
      'series-a': { label: 'Series A', className: 'bg-green-100 text-green-800' }
    }
    const config = stageConfig[stage as keyof typeof stageConfig] || stageConfig['pre-seed']
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Cloud Security': <Shield className="h-4 w-4" />,
      'Threat Intelligence': <Eye className="h-4 w-4" />,
      'Identity Security': <Users className="h-4 w-4" />,
      'Quantum Security': <Brain className="h-4 w-4" />,
      'IoT Security': <Zap className="h-4 w-4" />,
      'Threat Detection': <Target className="h-4 w-4" />
    }
    return icons[category as keyof typeof icons] || <Shield className="h-4 w-4" />
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const totalCompanies = companies.length
  const avgFitScore = companies.length > 0 
    ? companies.reduce((sum, c) => sum + c.overall_fit_score, 0) / companies.length 
    : 0
  const highPotentialCompanies = companies.filter(c => c.overall_fit_score >= 80).length
  const activeConventions = conventions.filter(c => c.is_active).length

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading convention data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Calendar className="h-8 w-8" />
          Cybersecurity Convention Tracker
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover Pre-Seed to Series A cybersecurity companies from major conventions 
          and evaluate them against Ballistic Ventures investment criteria
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conventions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeConventions}</div>
            <p className="text-xs text-muted-foreground">Currently tracking</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Targets</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Companies identified</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Fit Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgFitScore.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Ballistic Ventures criteria</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Potential</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPotentialCompanies}</div>
            <p className="text-xs text-muted-foreground">80%+ fit score</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {socket.isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Live updates active</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">Disconnected</span>
            </>
          )}
        </div>
        
        {socket.scrapingProgress && (
          <Alert className="border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Scraping {socket.scrapingProgress.conventionId}: {socket.scrapingProgress.progress}% complete 
              ({socket.scrapingProgress.companiesFound} companies found) - {socket.scrapingProgress.message}
            </AlertDescription>
          </Alert>
        )}
        
        {socket.lastUpdate && (
          <div className="text-sm text-muted-foreground">
            Last update: {new Date(socket.lastUpdate.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>

      {socket.error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            WebSocket error: {socket.error}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="companies">Company Discovery</TabsTrigger>
          <TabsTrigger value="conventions">Active Conventions</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter & Search Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedConvention} onValueChange={setSelectedConvention}>
                  <SelectTrigger>
                    <SelectValue placeholder="Convention" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conventions</SelectItem>
                    {conventions.map(convention => (
                      <SelectItem key={convention.id} value={convention.id}>
                        {convention.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="due_diligence">Due Diligence</SelectItem>
                    <SelectItem value="invested">Invested</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Cloud Security">Cloud Security</SelectItem>
                    <SelectItem value="Threat Intelligence">Threat Intelligence</SelectItem>
                    <SelectItem value="Identity Security">Identity Security</SelectItem>
                    <SelectItem value="Quantum Security">Quantum Security</SelectItem>
                    <SelectItem value="IoT Security">IoT Security</SelectItem>
                    <SelectItem value="Threat Detection">Threat Detection</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={minScore} onValueChange={setMinScore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Min Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Scores</SelectItem>
                    <SelectItem value="60">60%+</SelectItem>
                    <SelectItem value="70">70%+</SelectItem>
                    <SelectItem value="80">80%+</SelectItem>
                    <SelectItem value="90">90%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Company List */}
          <div className="grid gap-4">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getCategoryIcon(company.cybersecurity_category || '')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{company.company_name}</CardTitle>
                          {getStageBadge(company.funding_stage || '')}
                          {getStatusBadge(company.status)}
                        </div>
                        <CardDescription className="mb-3">
                          {company.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {company.convention?.name}
                          </div>
                          {company.booth_number && (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              Booth {company.booth_number}
                            </div>
                          )}
                          {company.contact_name && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {company.contact_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(company.overall_fit_score)}`}>
                        {company.overall_fit_score}%
                      </div>
                      <div className="text-sm text-muted-foreground">Fit Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-3">Ballistic Ventures Criteria</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Active Users</span>
                            <span className={getScoreColor(company.active_users_score)}>
                              {company.active_users_score}%
                            </span>
                          </div>
                          <Progress value={company.active_users_score} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Paying Customers</span>
                            <span className={getScoreColor(company.paying_customers_score)}>
                              {company.paying_customers_score}%
                            </span>
                          </div>
                          <Progress value={company.paying_customers_score} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>MSSP Integration</span>
                            <span className={getScoreColor(company.mssp_integration_score)}>
                              {company.mssp_integration_score}%
                            </span>
                          </div>
                          <Progress value={company.mssp_integration_score} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Technical Innovation</span>
                            <span className={getScoreColor(company.technical_innovation)}>
                              {company.technical_innovation}%
                            </span>
                          </div>
                          <Progress value={company.technical_innovation} className="h-2" />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Investment Potential</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Founder Experience</span>
                            <span className={getScoreColor(company.founder_experience)}>
                              {company.founder_experience}%
                            </span>
                          </div>
                          <Progress value={company.founder_experience} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Market Timing</span>
                            <span className={getScoreColor(company.market_timing_score)}>
                              {company.market_timing_score}%
                            </span>
                          </div>
                          <Progress value={company.market_timing_score} className="h-2" />
                          
                          <div className="flex items-center gap-2 mt-4">
                            {company.product_demo && (
                              <Badge variant="outline" className="text-green-600">
                                <Eye className="h-3 w-3 mr-1" />
                                Demo Available
                              </Badge>
                            )}
                            {company.seeking_investment && (
                              <Badge variant="outline" className="text-blue-600">
                                <Target className="h-3 w-3 mr-1" />
                                Seeking Investment
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {company.notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Notes:</strong> {company.notes}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {company.website && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(company.website, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Website
                          </Button>
                        )}
                        {company.contact_email && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`mailto:${company.contact_email}`, '_blank')}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        )}
                      </div>
                      
                      {company.next_follow_up && (
                        <div className="text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Follow-up: {new Date(company.next_follow_up).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conventions" className="space-y-6">
          <div className="grid gap-6">
            {conventions.map((convention) => (
              <Card key={convention.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {convention.name}
                        {convention.is_active && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {convention.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {convention.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(convention.start_date).toLocaleDateString()} - {new Date(convention.end_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {convention.website && (
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(convention.website, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Site
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {convention.conventionCompanies.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Companies Tracked</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {convention.conventionCompanies.filter(c => c.overall_fit_score >= 80).length}
                        </div>
                        <div className="text-sm text-muted-foreground">High Potential</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {convention.conventionCompanies.filter(c => c.status === 'meeting' || c.status === 'due_diligence').length}
                        </div>
                        <div className="text-sm text-muted-foreground">In Pipeline</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Top Companies at {convention.name}</h4>
                      <div className="space-y-2">
                        {convention.conventionCompanies
                          .sort((a, b) => b.overall_fit_score - a.overall_fit_score)
                          .slice(0, 3)
                          .map((company) => (
                            <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                {getCategoryIcon(company.cybersecurity_category || '')}
                                <div>
                                  <div className="font-medium">{company.company_name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {company.cybersecurity_category} • {company.funding_stage}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-bold ${getScoreColor(company.overall_fit_score)}`}>
                                  {company.overall_fit_score}%
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {getStatusBadge(company.status)}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}