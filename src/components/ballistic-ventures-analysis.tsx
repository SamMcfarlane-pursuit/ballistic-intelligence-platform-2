"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  Zap,
  Shield,
  Eye,
  Brain,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react'

interface PortfolioCompany {
  id: string
  name: string
  description: string
  founded_year: number
  location: string
  cybersecurity_category: string
  funding_stage: 'pre-seed' | 'seed' | 'series-a'
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
  exit_type?: 'acquired' | 'ipo' | 'none'
  acquirer?: string
  exit_date?: string
  exit_value?: number
}

interface InvestmentCriteria {
  id: string
  criteria: string
  description: string
  importance: 'high' | 'medium' | 'low'
  companies_meeting: number
  total_companies: number
}

export default function BallisticVenturesAnalysis() {
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioCompany[]>([])
  const [investmentCriteria, setInvestmentCriteria] = useState<InvestmentCriteria[]>([])
  const [selectedCompany, setSelectedCompany] = useState<PortfolioCompany | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load portfolio data from API
    const loadData = async () => {
      setLoading(true)
      
      try {
        const [portfolioResponse, criteriaResponse] = await Promise.all([
          fetch('/api/ballistic-portfolio'),
          fetch('/api/investment-criteria')
        ])

        if (portfolioResponse.ok && criteriaResponse.ok) {
          const portfolioData = await portfolioResponse.json()
          const criteriaData = await criteriaResponse.json()
          
          setPortfolioCompanies(portfolioData.data)
          setInvestmentCriteria(criteriaData.data)
        }
      } catch (error) {
        console.error('Error loading Ballistic Ventures data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const totalFunding = portfolioCompanies.reduce((sum, company) => sum + company.funding_amount, 0)
  const avgFunding = portfolioCompanies.length > 0 ? totalFunding / portfolioCompanies.length : 0
  const exitedCompanies = portfolioCompanies.filter(c => c.exit_type === 'acquired').length
  const avgMarketTraction = portfolioCompanies.length > 0 
    ? portfolioCompanies.reduce((sum, company) => sum + company.market_traction, 0) / portfolioCompanies.length 
    : 0

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
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
      'Threat Detection': <Eye className="h-4 w-4" />,
      'Identity Security': <Users className="h-4 w-4" />,
      'Supply Chain Security': <Target className="h-4 w-4" />,
      'Quantum Security': <Brain className="h-4 w-4" />
    }
    return icons[category as keyof typeof icons] || <Shield className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading Ballistic Ventures portfolio analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Award className="h-8 w-8" />
          Ballistic Ventures Portfolio Analysis
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Deep analysis of Ballistic Ventures' focused portfolio of 18 cybersecurity companies over 3 years,
          emphasizing quality over quantity with strategic pre-seed to Series A investments
        </p>
      </div>

      {/* Portfolio Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Size</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioCompanies.length}</div>
            <p className="text-xs text-muted-foreground">Quality-focused</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalFunding / 1000000).toFixed(0)}M</div>
            <p className="text-xs text-muted-foreground">Across all rounds</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(avgFunding / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Pre-seed to Series A</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Exits</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exitedCompanies}</div>
            <p className="text-xs text-muted-foreground">Including Pangaea → CrowdStrike</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. PMF Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMarketTraction.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Product-market fit</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portfolio Companies</TabsTrigger>
          <TabsTrigger value="criteria">Investment Criteria</TabsTrigger>
          <TabsTrigger value="analysis">Deep Analysis</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid gap-4">
            {portfolioCompanies.map((company) => (
              <Card key={company.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getCategoryIcon(company.cybersecurity_category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{company.name}</CardTitle>
                          {getStageBadge(company.funding_stage)}
                          {company.exit_type === 'acquired' && (
                            <Badge className="bg-green-100 text-green-800">
                              <Star className="h-3 w-3 mr-1" />
                              Acquired
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="mb-3">
                          {company.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {company.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Founded {company.founded_year}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {company.employee_range}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${(company.funding_amount / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(company.funding_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Key Metrics</h4>
                        <div className="space-y-1 text-sm">
                          {company.users && <div><strong>Users:</strong> {company.users}</div>}
                          {company.revenue && <div><strong>Revenue:</strong> {company.revenue}</div>}
                          {company.growth && <div><strong>Growth:</strong> {company.growth}</div>}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Product-Market Fit</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {company.active_users ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                            <span className="text-sm">Active Users</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {company.paying_customers ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                            <span className="text-sm">Paying Customers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {company.mssp_integration ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                            <span className="text-sm">MSSP Integration</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Market Traction</h4>
                        <div className="space-y-2">
                          <Progress value={company.market_traction} className="w-full" />
                          <div className="text-sm text-center">
                            {company.market_traction}% traction
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {company.exit_type === 'acquired' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-800">
                          <Star className="h-5 w-5" />
                          <span className="font-medium">Successful Exit</span>
                        </div>
                        <div className="text-sm text-green-700 mt-1">
                          Acquired by {company.acquirer} for ${(company.exit_value! / 1000000).toFixed(0)}M
                          on {new Date(company.exit_date!).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    
                    {company.website && (
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(company.website, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ballistic Ventures Investment Criteria</CardTitle>
              <CardDescription>
                Key indicators and requirements for cybersecurity investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investmentCriteria.map((criteria) => {
                  const percentage = (criteria.companies_meeting / criteria.total_companies) * 100
                  return (
                    <div key={criteria.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{criteria.criteria}</h4>
                          {getImportanceBadge(criteria.importance)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {criteria.companies_meeting}/{criteria.total_companies} companies meet criteria
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{criteria.description}</p>
                      <div className="space-y-1">
                        <Progress value={percentage} className="w-full" />
                        <div className="text-sm text-center">
                          {percentage.toFixed(0)}% portfolio compliance
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding Stage Distribution</CardTitle>
                <CardDescription>Breakdown of portfolio by funding stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['pre-seed', 'seed', 'series-a'].map((stage) => {
                    const companies = portfolioCompanies.filter(c => c.funding_stage === stage)
                    const totalAmount = companies.reduce((sum, c) => sum + c.funding_amount, 0)
                    const percentage = (companies.length / portfolioCompanies.length) * 100
                    
                    return (
                      <div key={stage} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium capitalize">{stage}</span>
                          <span className="text-sm text-muted-foreground">
                            {companies.length} companies • ${(totalAmount / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <Progress value={percentage} className="w-full" />
                        <div className="text-sm text-center">{percentage.toFixed(0)}% of portfolio</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cybersecurity Categories</CardTitle>
                <CardDescription>Portfolio distribution by security category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(portfolioCompanies.map(c => c.cybersecurity_category))).map((category) => {
                    const companies = portfolioCompanies.filter(c => c.cybersecurity_category === category)
                    const totalAmount = companies.reduce((sum, c) => sum + c.funding_amount, 0)
                    const percentage = (companies.length / portfolioCompanies.length) * 100
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          <span className="font-medium">{category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{companies.length} companies</span>
                          <span>${(totalAmount / 1000000).toFixed(1)}M</span>
                        </div>
                        <Progress value={percentage} className="w-full" />
                        <div className="text-sm text-center">{percentage.toFixed(0)}% of portfolio</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product-Market Fit Analysis</CardTitle>
              <CardDescription>Deep dive into PMF indicators across the portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {portfolioCompanies.filter(c => c.active_users).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active User Base</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {portfolioCompanies.filter(c => c.paying_customers).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Paying Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {portfolioCompanies.filter(c => c.mssp_integration).length}
                    </div>
                    <div className="text-sm text-muted-foreground">MSSP Integration Ready</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Market Traction by Company</h4>
                  {portfolioCompanies.map((company) => (
                    <div key={company.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{company.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {company.market_traction}% traction
                        </span>
                      </div>
                      <Progress value={company.market_traction} className="w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Key Investment Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Quality Over Quantity</h4>
                    <p className="text-sm text-blue-700">
                      Ballistic Ventures maintains a focused portfolio of just 18 companies over 3 years, 
                      allowing for deep involvement and strategic support rather than broad market coverage.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Early-Stage Focus</h4>
                    <p className="text-sm text-green-700">
                      Strong emphasis on pre-seed to Series A investments, with 60% of portfolio in early stages, 
                      enabling maximum impact and value creation from the ground up.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">Product-Market Fit Priority</h4>
                    <p className="text-sm text-purple-700">
                      100% of portfolio companies have active user engagement, 80% have paying customers, 
                      demonstrating a strong focus on validated business models and market demand.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Successful Exit Strategy</h4>
                    <p className="text-sm text-yellow-700">
                      Notable success with Pangaea's acquisition by CrowdStrike for $85M, validating the 
                      investment thesis and providing strong returns for limited partners.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitive Advantages</CardTitle>
                <CardDescription>What makes Ballistic Ventures unique in cybersecurity investing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Operator-Led Approach</h4>
                        <p className="text-sm text-muted-foreground">
                          Team consists of former cybersecurity operators with deep domain expertise
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Strategic Focus</h4>
                        <p className="text-sm text-muted-foreground">
                          Exclusively focused on cybersecurity, enabling deeper market understanding
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Hands-On Support</h4>
                        <p className="text-sm text-muted-foreground">
                          Active involvement in portfolio company development and strategy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Long-Term Vision</h4>
                        <p className="text-sm text-muted-foreground">
                          Patient capital approach focused on building category leaders
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}