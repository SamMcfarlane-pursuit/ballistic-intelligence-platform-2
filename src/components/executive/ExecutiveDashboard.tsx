'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecureButton, SecureActionButton } from '@/components/ui/secure-button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Building,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Award,
  Briefcase,
  Globe,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Filter,
  Download,
  Mail,
  Calendar,
  ExternalLink,
  Plus,
  Eye,
  Star,
  ArrowRight,
  Lightbulb,
  Shield,
  Rocket,
  Brain,
  Database,
  FileText
} from 'lucide-react'

interface ExecutiveMetrics {
  totalFunding: number
  totalCompanies: number
  avgFundingSize: number
  topSectors: Array<{ name: string; count: number; funding: number; growth: number }>
  fundingTrend: Array<{ month: string; amount: number; deals: number; growth: number; newCompanies: number }>
  portfolioValue: number
  activeDeals: number
  pipelineValue: number
  weeklyNewCompanies: number
  fundingAnnouncements: number
  geographicBreakdown: Record<string, { companies: number; funding: number; percentage: number }>
  weeklyInsights: {
    newFundingAnnouncements: number
    newCompaniesDiscovered: number
    emergingTrends: string[]
    upcomingConferences: Array<{ name: string; date: string; location: string; relevance: string }>
  }
}

interface InvestmentOpportunity {
  id: string
  companyName: string
  sector: string
  fundingStage: string
  fundingAmount: number
  momentum: number
  riskScore: number
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'pass'
  location: string
  foundedYear: number
  keyMetrics: {
    teamScore: number
    marketSize: number
    traction: number
    technology: number
    competitive: number
  }
  recentSignals: Array<{
    type: string
    description: string
    date: string
    impact: 'positive' | 'neutral' | 'negative'
  }>
  nextActions: string[]
  financials: {
    revenue: number
    growth: number
    burnRate: number
    runway: number
    customers: number
    arr: number
  }
  fundingHistory: Array<{
    round: string
    amount: number
    date: string
    lead: string
  }>
}

interface PortfolioCompany {
  name: string
  sector: string
  investmentAmount: number
  currentValuation: number
  momentum: number
  lastUpdate: string
  status: 'thriving' | 'growing' | 'stable' | 'concerning'
  keyEvents: Array<{
    type: string
    description: string
    date: string
  }>
}

interface MarketIntelligence {
  sectorTrends: Array<{
    sector: string
    growth: number
    fundingVolume: number
    dealCount: number
    avgValuation: number
  }>
  competitiveThreats: Array<{
    company: string
    threat: string
    severity: 'high' | 'medium' | 'low'
    description: string
  }>
  emergingTechnologies: Array<{
    technology: string
    adoptionRate: number
    marketPotential: number
    companies: string[]
  }>
}

export default function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null)
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioCompany[]>([])
  const [marketIntel, setMarketIntel] = useState<MarketIntelligence | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [selectedSector, setSelectedSector] = useState('all')
  const [selectedCompany, setSelectedCompany] = useState<string>('CyberSecure')
  const [isLoading, setIsLoading] = useState(false)

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [selectedTimeframe, selectedSector])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Load real data from API endpoints
      const [metricsResponse, opportunitiesResponse, portfolioResponse, marketResponse] = await Promise.all([
        fetch(`/api/executive?action=metrics&timeframe=${selectedTimeframe}&sector=${selectedSector}`),
        fetch(`/api/executive?action=opportunities&sector=${selectedSector}`),
        fetch(`/api/executive?action=portfolio&timeframe=${selectedTimeframe}`),
        fetch(`/api/executive?action=market-intelligence`)
      ])
      
      // Process API responses
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        if (metricsData.success) {
          setMetrics(metricsData.data)
        }
      }

      if (opportunitiesResponse.ok) {
        const opportunitiesData = await opportunitiesResponse.json()
        if (opportunitiesData.success) {
          setOpportunities(opportunitiesData.data)
        }
      }

      if (portfolioResponse.ok) {
        const portfolioData = await portfolioResponse.json()
        if (portfolioData.success) {
          setPortfolio(portfolioData.data)
        }
      }

      if (marketResponse.ok) {
        const marketData = await marketResponse.json()
        if (marketData.success) {
          setMarketIntel(marketData.data)
        }
      }

      // All data is now loaded from API responses above



    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_buy': return 'bg-green-500'
      case 'buy': return 'bg-blue-500'
      case 'hold': return 'bg-yellow-500'
      case 'pass': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_buy': return <TrendingUp className="h-4 w-4" />
      case 'buy': return <ArrowRight className="h-4 w-4" />
      case 'hold': return <Clock className="h-4 w-4" />
      case 'pass': return <TrendingDown className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thriving': return 'text-green-600 bg-green-50'
      case 'growing': return 'text-blue-600 bg-blue-50'
      case 'stable': return 'text-yellow-600 bg-yellow-50'
      case 'concerning': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const executeAction = async (action: string, companyName: string) => {
    try {
      console.log(`Executing action: ${action} for ${companyName}`)
      
      const response = await fetch('/api/executive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute-action',
          actionType: action,
          companyName: companyName,
          details: { timestamp: new Date().toISOString() }
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ${action} initiated for ${companyName}\n\nAction ID: ${data.data.actionId}\nStatus: ${data.data.status}\nEstimated completion: ${new Date(data.data.estimatedCompletion).toLocaleString()}`)
        
        // Refresh data after action
        await loadDashboardData()
      } else {
        throw new Error(data.error || 'Action failed')
      }
    } catch (error) {
      console.error('Action execution failed:', error)
      alert(`❌ Failed to execute ${action}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const generateReport = async (type: string) => {
    try {
      console.log(`Generating ${type} report`)
      
      const response = await fetch('/api/executive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-report',
          reportType: type,
          parameters: {
            timeframe: selectedTimeframe,
            sector: selectedSector,
            company: selectedCompany
          }
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ${type} report generation started\n\nReport ID: ${data.data.reportId}\nStatus: ${data.data.status}\nDelivery: ${data.data.deliveryMethod}\nEstimated completion: ${new Date(data.data.estimatedCompletion).toLocaleString()}`)
      } else {
        throw new Error(data.error || 'Report generation failed')
      }
    } catch (error) {
      console.error('Report generation failed:', error)
      alert(`❌ Failed to generate ${type} report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse text-blue-500" />
          <p className="text-lg font-medium">Loading Executive Intelligence...</p>
          <p className="text-sm text-muted-foreground">Analyzing market data and portfolio performance</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Executive Command Center
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Strategic cybersecurity investment intelligence and portfolio management
          </p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <SecureActionButton 
            onClick={() => generateReport('Executive Summary')}
            debounceMs={1000}
            maxClicksPerMinute={5}
          >
            <Download className="h-4 w-4" />
            Generate Report
          </SecureActionButton>
        </div>
      </div>

      {/* Weekly Intelligence Summary */}
      {metrics && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{metrics.weeklyInsights.newFundingAnnouncements}</div>
                <div className="text-sm text-indigo-600">Funding Announcements This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{metrics.weeklyInsights.newCompaniesDiscovered}</div>
                <div className="text-sm text-purple-600">New Companies Discovered</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{metrics.weeklyInsights.emergingTrends.length}</div>
                <div className="text-sm text-blue-600">Emerging Trends Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{metrics.weeklyInsights.upcomingConferences.length}</div>
                <div className="text-sm text-green-600">Upcoming Conferences</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Funding Tracked</p>
                  <p className="text-3xl font-bold text-blue-900">{formatCurrency(metrics.totalFunding)}</p>
                  <p className="text-sm text-blue-600 mt-1">+18% vs last quarter</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Portfolio Value</p>
                  <p className="text-3xl font-bold text-green-900">{formatCurrency(metrics.portfolioValue)}</p>
                  <p className="text-sm text-green-600 mt-1">+24% vs last quarter</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Active Pipeline</p>
                  <p className="text-3xl font-bold text-purple-900">{formatCurrency(metrics.pipelineValue)}</p>
                  <p className="text-sm text-purple-600 mt-1">{metrics.activeDeals} active deals</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Companies Tracked</p>
                  <p className="text-3xl font-bold text-orange-900">{metrics.totalCompanies.toLocaleString()}</p>
                  <p className="text-sm text-orange-600 mt-1">+{metrics.weeklyNewCompanies} this week</p>
                </div>
                <Building className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="opportunities">Investment Opportunities</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Performance</TabsTrigger>
          <TabsTrigger value="market">Market Intelligence</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="actions">Action Center</TabsTrigger>
        </TabsList>

        {/* Investment Opportunities */}
        <TabsContent value="opportunities" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Investment Opportunities</h2>
            <div className="flex gap-2">
              <select 
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Sectors</option>
                <option value="cloud">Cloud Security</option>
                <option value="ai">AI Security</option>
                <option value="zero-trust">Zero Trust</option>
                <option value="identity">Identity & Access</option>
              </select>
              <SecureActionButton 
                onClick={() => generateReport('Investment Pipeline')}
                debounceMs={1000}
                maxClicksPerMinute={5}
              >
                <Filter className="h-4 w-4" />
                Filter & Export
              </SecureActionButton>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="border-2 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{opportunity.companyName}</CardTitle>
                      <CardDescription>
                        {opportunity.sector} • {opportunity.fundingStage} • {opportunity.location}
                      </CardDescription>
                      <div className="text-xs text-muted-foreground mt-1">
                        Founded {opportunity.foundedYear} • {opportunity.financials.customers} customers • ARR: {formatCurrency(opportunity.financials.arr)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getRecommendationColor(opportunity.recommendation)} text-white`}>
                        {getRecommendationIcon(opportunity.recommendation)}
                        {opportunity.recommendation.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(opportunity.fundingAmount)}</div>
                      <div className="text-sm text-muted-foreground">Funding Size</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{opportunity.momentum}</div>
                      <div className="text-sm text-muted-foreground">Momentum Score</div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Team Quality</span>
                      <div className="flex items-center gap-2">
                        <Progress value={opportunity.keyMetrics.teamScore} className="w-16 h-2" />
                        <span className="text-sm font-medium">{opportunity.keyMetrics.teamScore}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Market Size</span>
                      <div className="flex items-center gap-2">
                        <Progress value={opportunity.keyMetrics.marketSize} className="w-16 h-2" />
                        <span className="text-sm font-medium">{opportunity.keyMetrics.marketSize}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Traction</span>
                      <div className="flex items-center gap-2">
                        <Progress value={opportunity.keyMetrics.traction} className="w-16 h-2" />
                        <span className="text-sm font-medium">{opportunity.keyMetrics.traction}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Technology</span>
                      <div className="flex items-center gap-2">
                        <Progress value={opportunity.keyMetrics.technology} className="w-16 h-2" />
                        <span className="text-sm font-medium">{opportunity.keyMetrics.technology}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Signals */}
                  <div>
                    <h4 className="font-medium mb-2">Recent Signals</h4>
                    <div className="space-y-2">
                      {opportunity.recentSignals.slice(0, 2).map((signal, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${
                            signal.impact === 'positive' ? 'bg-green-500' : 
                            signal.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                          }`} />
                          <span className="flex-1">{signal.description}</span>
                          <span className="text-muted-foreground">{signal.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <SecureActionButton
                      onClick={() => executeAction('Schedule Due Diligence', opportunity.companyName)}
                      debounceMs={500}
                      maxClicksPerMinute={10}
                      size="sm"
                      className="flex-1"
                    >
                      <Calendar className="h-3 w-3" />
                      Due Diligence
                    </SecureActionButton>
                    <SecureActionButton
                      onClick={() => executeAction('View Details', opportunity.companyName)}
                      debounceMs={300}
                      maxClicksPerMinute={20}
                      size="sm"
                    >
                      <Eye className="h-3 w-3" />
                      Details
                    </SecureActionButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Portfolio Performance */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Portfolio Performance</h2>
            <SecureActionButton 
              onClick={() => generateReport('Portfolio Performance')}
              debounceMs={1000}
              maxClicksPerMinute={5}
            >
              <BarChart3 className="h-4 w-4" />
              Performance Report
            </SecureActionButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {portfolio.map((company, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription>{company.sector}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(company.status)}>
                      {company.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Investment Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(company.investmentAmount)}</div>
                      <div className="text-sm text-muted-foreground">Investment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{formatCurrency(company.currentValuation)}</div>
                      <div className="text-sm text-muted-foreground">Current Value</div>
                    </div>
                  </div>

                  {/* ROI Calculation */}
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(((company.currentValuation - company.investmentAmount) / company.investmentAmount) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">ROI</div>
                  </div>

                  {/* Momentum Score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Momentum Score</span>
                      <span className="text-sm font-bold">{company.momentum}/100</span>
                    </div>
                    <Progress value={company.momentum} className="w-full" />
                  </div>

                  {/* Recent Events */}
                  <div>
                    <h4 className="font-medium mb-2">Recent Events</h4>
                    <div className="space-y-2">
                      {company.keyEvents.map((event, eventIndex) => (
                        <div key={eventIndex} className="text-sm">
                          <div className="font-medium">{event.type}</div>
                          <div className="text-muted-foreground">{event.description}</div>
                          <div className="text-xs text-muted-foreground">{event.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <SecureActionButton
                      onClick={() => executeAction('Board Meeting', company.name)}
                      debounceMs={500}
                      maxClicksPerMinute={10}
                      size="sm"
                      className="flex-1"
                    >
                      <Users className="h-3 w-3" />
                      Board Meeting
                    </SecureActionButton>
                    <Button
                      onClick={() => executeAction('Performance Review', company.name)}
                      size="sm"
                      variant="outline"
                    >
                      <BarChart3 className="h-3 w-3" />
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Market Intelligence */}
        <TabsContent value="market" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Market Intelligence</h2>
            <SecureActionButton 
              onClick={() => generateReport('Market Analysis')}
              debounceMs={1000}
              maxClicksPerMinute={5}
            >
              <Globe className="h-4 w-4" />
              Market Report
            </SecureActionButton>
          </div>

          {marketIntel && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sector Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sector Growth Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketIntel.sectorTrends.map((sector, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{sector.sector}</span>
                          <Badge variant="outline">+{sector.growth}%</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div>Volume: {formatCurrency(sector.fundingVolume)}</div>
                          <div>Deals: {sector.dealCount}</div>
                          <div>Avg: {formatCurrency(sector.avgValuation)}</div>
                        </div>
                        <Progress value={sector.growth} className="w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Competitive Threats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Competitive Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketIntel.competitiveThreats.map((threat, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{threat.company}</span>
                          <Badge variant={threat.severity === 'high' ? 'destructive' : threat.severity === 'medium' ? 'default' : 'secondary'}>
                            {threat.severity}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">{threat.threat}</div>
                        <div className="text-sm text-muted-foreground">{threat.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>
                    Focus on US and Israel markets - key cybersecurity hubs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {metrics && (
                    <div className="space-y-4">
                      {Object.entries(metrics.geographicBreakdown).map(([country, data]) => (
                        <div key={country} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{country}</span>
                            <Badge variant="outline">{data.percentage.toFixed(1)}%</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div>Companies: {data.companies.toLocaleString()}</div>
                            <div>Funding: {formatCurrency(data.funding)}</div>
                          </div>
                          <Progress value={data.percentage} className="w-full" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Emerging Technologies */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Emerging Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {marketIntel.emergingTechnologies.map((tech, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-3">{tech.technology}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Adoption Rate</span>
                            <span>{tech.adoptionRate}%</span>
                          </div>
                          <Progress value={tech.adoptionRate} className="w-full" />
                          <div className="flex justify-between text-sm">
                            <span>Market Potential</span>
                            <span>{tech.marketPotential}%</span>
                          </div>
                          <Progress value={tech.marketPotential} className="w-full" />
                          <div className="text-sm text-muted-foreground">
                            Key Players: {tech.companies.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Conference & Events Tracking */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Industry Events & Speaking Opportunities
                  </CardTitle>
                  <CardDescription>
                    Track conferences for portfolio company speaking opportunities and industry networking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {metrics && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {metrics.weeklyInsights.upcomingConferences.map((conference, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{conference.name}</h4>
                              <Badge variant={conference.relevance === 'critical' ? 'destructive' : conference.relevance === 'high' ? 'default' : 'secondary'}>
                                {conference.relevance}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>📅 {new Date(conference.date).toLocaleDateString()}</div>
                              <div>📍 {conference.location}</div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <SecureActionButton
                                onClick={() => executeAction('Submit Speaker Proposal', conference.name)}
                                debounceMs={500}
                                maxClicksPerMinute={10}
                                size="sm"
                              >
                                <Users className="h-3 w-3" />
                                Speaker Proposal
                              </SecureActionButton>
                              <Button
                                onClick={() => executeAction('Track Event', conference.name)}
                                size="sm"
                                variant="outline"
                              >
                                <Eye className="h-3 w-3" />
                                Track
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Weekly Funding Announcements */}
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          This Week's Funding Intelligence
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{metrics.weeklyInsights.newFundingAnnouncements}</div>
                            <div className="text-blue-600">New Funding Rounds</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{metrics.weeklyInsights.newCompaniesDiscovered}</div>
                            <div className="text-green-600">Companies Discovered</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{metrics.weeklyInsights.emergingTrends.length}</div>
                            <div className="text-purple-600">Emerging Trends</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm font-medium mb-2">Trending Technologies:</div>
                          <div className="flex flex-wrap gap-2">
                            {metrics.weeklyInsights.emergingTrends.map((trend, index) => (
                              <Badge key={index} variant="outline">{trend}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Advanced Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Advanced Analytics & AI Insights</h2>
            <div className="flex gap-2">
              <SecureActionButton 
                onClick={() => generateReport('AI Insights Report')}
                debounceMs={1000}
                maxClicksPerMinute={5}
              >
                <Brain className="h-4 w-4" />
                AI Insights
              </SecureActionButton>
              <SecureActionButton 
                onClick={() => generateReport('Advanced Analytics')}
                debounceMs={1000}
                maxClicksPerMinute={5}
              >
                <LineChart className="h-4 w-4" />
                Analytics Report
              </SecureActionButton>
            </div>
          </div>

          {/* AI Processing Status */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
                AI Intelligence Processing
              </CardTitle>
              <CardDescription>Real-time AI analysis of portfolio and market data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm font-medium">Portfolio Analysis</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Processing 23 companies</div>
                  <Progress value={95} className="w-full mt-2" />
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm font-medium">Market Intelligence</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Analyzing 156 companies</div>
                  <Progress value={78} className="w-full mt-2" />
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm font-medium">Risk Assessment</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Evaluating risk factors</div>
                  <Progress value={62} className="w-full mt-2" />
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm font-medium">Predictive Modeling</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Forecasting trends</div>
                  <Progress value={84} className="w-full mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Distribution Chart */}
          <Card className="bg-gradient-to-r from-indigo-50 to-cyan-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                AI Insights Distribution & Analytics
              </CardTitle>
              <CardDescription>Comprehensive AI-powered analysis breakdown and insights generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Insights Pie Chart */}
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                  <h4 className="font-semibold text-lg mb-4 text-center">AI Analysis Distribution</h4>
                  <div className="relative">
                    {/* Pie Chart Container */}
                    <div className="relative w-64 h-64 mx-auto">
                      {/* SVG Pie Chart */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Investment Recommendations - 34% */}
                        <circle
                          cx="50" cy="50" r="40"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="20"
                          strokeDasharray="34 66"
                          strokeDashoffset="0"
                          className="opacity-80"
                        />
                        {/* Risk Assessments - 28% */}
                        <circle
                          cx="50" cy="50" r="40"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="20"
                          strokeDasharray="28 72"
                          strokeDashoffset="-34"
                          className="opacity-80"
                        />
                        {/* Market Analysis - 18% */}
                        <circle
                          cx="50" cy="50" r="40"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="20"
                          strokeDasharray="18 82"
                          strokeDashoffset="-62"
                          className="opacity-80"
                        />
                        {/* Technical Reviews - 9% */}
                        <circle
                          cx="50" cy="50" r="40"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="20"
                          strokeDasharray="9 91"
                          strokeDashoffset="-80"
                          className="opacity-80"
                        />
                        {/* Other Analysis - 11% */}
                        <circle
                          cx="50" cy="50" r="40"
                          fill="none"
                          stroke="#8B5CF6"
                          strokeWidth="20"
                          strokeDasharray="11 89"
                          strokeDashoffset="-89"
                          className="opacity-80"
                        />
                      </svg>
                      
                      {/* Center Label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-800">74</div>
                          <div className="text-sm text-gray-600">Total Insights</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Investment Recommendations</span>
                        </div>
                        <span className="text-sm font-semibold">34</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">Risk Assessments</span>
                        </div>
                        <span className="text-sm font-semibold">28</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Market Analysis</span>
                        </div>
                        <span className="text-sm font-semibold">18</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Technical Reviews</span>
                        </div>
                        <span className="text-sm font-semibold">9</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Other Analysis</span>
                        </div>
                        <span className="text-sm font-semibold">8</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Performance Metrics */}
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                  <h4 className="font-semibold text-lg mb-4">AI Performance Metrics</h4>
                  <div className="space-y-4">
                    {/* Accuracy Score */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Prediction Accuracy</span>
                        <span className="text-sm font-bold text-green-600">94.7%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{width: '94.7%'}}></div>
                      </div>
                    </div>

                    {/* Processing Speed */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Processing Speed</span>
                        <span className="text-sm font-bold text-blue-600">87.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{width: '87.2%'}}></div>
                      </div>
                    </div>

                    {/* Confidence Level */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Confidence Level</span>
                        <span className="text-sm font-bold text-purple-600">91.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full" style={{width: '91.5%'}}></div>
                      </div>
                    </div>

                    {/* Data Quality */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Data Quality Score</span>
                        <span className="text-sm font-bold text-orange-600">89.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full" style={{width: '89.8%'}}></div>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-700">2.4M</div>
                        <div className="text-xs text-blue-600">Data Points Analyzed</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-700">1,247</div>
                        <div className="text-xs text-green-600">Insights Generated</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time AI Activity Feed */}
              <div className="mt-6 bg-white rounded-lg p-6 border shadow-sm">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  Real-time AI Activity Feed
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Investment Recommendation Generated</div>
                      <div className="text-xs text-gray-600">CyberGuard Pro - Strong Buy recommendation with 94% confidence</div>
                    </div>
                    <div className="text-xs text-gray-500">2 min ago</div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Market Analysis Completed</div>
                      <div className="text-xs text-gray-600">AI Security sector analysis - 45% growth potential identified</div>
                    </div>
                    <div className="text-xs text-gray-500">5 min ago</div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Risk Alert Generated</div>
                      <div className="text-xs text-gray-600">ThreatIntel Corp - Customer churn risk detected, intervention recommended</div>
                    </div>
                    <div className="text-xs text-gray-500">8 min ago</div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Predictive Model Updated</div>
                      <div className="text-xs text-gray-600">Portfolio valuation forecast updated - $1.8B projected by Q4 2025</div>
                    </div>
                    <div className="text-xs text-gray-500">12 min ago</div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Technical Review Completed</div>
                      <div className="text-xs text-gray-600">SecureFlow AI - Technology stack analysis shows strong competitive advantage</div>
                    </div>
                    <div className="text-xs text-gray-500">15 min ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Portfolio Trends with Detailed Information & Stats */}
          <Card className="border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Portfolio Growth Trend Analysis & Statistics
              </CardTitle>
              <CardDescription>Interactive portfolio analysis with detailed information input and comprehensive statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Company Selection & Detailed Analysis */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-bold text-xl text-gray-900">Detailed Company Analysis</h4>
                    <p className="text-sm text-gray-600 mt-1">Switch between companies for comprehensive individual analysis and metrics</p>
                  </div>
                  <div className="flex gap-3">
                    <select 
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm font-medium bg-white shadow-sm"
                    >
                      {portfolio.map((company) => (
                        <option key={company.name} value={company.name}>
                          {company.name} - {company.sector}
                        </option>
                      ))}
                    </select>
                    <SecureActionButton
                      onClick={() => executeAction('Deep Analysis', selectedCompany)}
                      debounceMs={1000}
                      maxClicksPerMinute={5}
                      size="sm"
                    >
                      <Brain className="h-4 w-4" />
                      AI Analysis
                    </SecureActionButton>
                  </div>
                </div>

                {/* Selected Company Detailed Dashboard */}
                {(() => {
                  const company = portfolio.find(c => c.name === selectedCompany) || portfolio[0]
                  const roi = ((company.currentValuation - company.investmentAmount) / company.investmentAmount) * 100
                  const monthlyData = selectedCompany === 'CyberSecure' ? 
                    [12, 15, 18, 22, 28, 35] : selectedCompany === 'ZeroTrust Pro' ? 
                    [8, 9, 11, 14, 18, 22] : [15, 16, 14, 12, 10, 8]
                  
                  return (
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-100 shadow-sm">
                      {/* Company Header */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                            {company.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{company.name}</h3>
                            <p className="text-lg text-gray-600">{company.sector}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${
                                company.status === 'thriving' ? 'bg-green-500' :
                                company.status === 'growing' ? 'bg-blue-500' :
                                company.status === 'stable' ? 'bg-yellow-500' :
                                'bg-red-500'
                              } text-white px-3 py-1`}>
                                {company.status.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-500">Last updated: {company.lastUpdate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600">{formatCurrency(company.currentValuation)}</div>
                          <div className="text-sm text-gray-600">Current Valuation</div>
                          <div className={`text-lg font-semibold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {roi > 0 ? '+' : ''}{roi.toFixed(1)}% ROI
                          </div>
                        </div>
                      </div>

                      {/* Detailed Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-blue-700">{formatCurrency(company.investmentAmount)}</div>
                          <div className="text-sm text-blue-600 font-medium">Initial Investment</div>
                          <div className="text-xs text-gray-600 mt-1">Investment Date: Jan 2019</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-green-700">{formatCurrency(company.currentValuation)}</div>
                          <div className="text-sm text-green-600 font-medium">Current Value</div>
                          <div className="text-xs text-gray-600 mt-1">Last Valuation: {company.lastUpdate}</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-purple-700">{company.momentum}/100</div>
                          <div className="text-sm text-purple-600 font-medium">Momentum Score</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {company.momentum >= 80 ? 'Excellent' : 
                             company.momentum >= 60 ? 'Good' : 
                             company.momentum >= 40 ? 'Fair' : 'Poor'}
                          </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-orange-700">
                            {Math.round((company.currentValuation / company.investmentAmount) * 10) / 10}x
                          </div>
                          <div className="text-sm text-orange-600 font-medium">Multiple</div>
                          <div className="text-xs text-gray-600 mt-1">Investment Multiple</div>
                        </div>
                      </div>

                      {/* Company Performance Chart */}
                      <div className="mb-6">
                        <h5 className="font-semibold text-lg mb-4">6-Month Performance Trend</h5>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="relative">
                            <div className="grid grid-cols-6 gap-3 items-end h-32 mb-2">
                              {monthlyData.map((value, index) => {
                                const maxValue = Math.max(...monthlyData)
                                const barHeight = (value / maxValue) * 100
                                const growth = index > 0 ? ((value - monthlyData[index-1]) / monthlyData[index-1] * 100) : 0
                                
                                return (
                                  <div key={index} className="relative flex flex-col items-center group">
                                    <div className="absolute -top-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                      <div>{formatCurrency(value * 1000000)}</div>
                                      {index > 0 && (
                                        <div className={growth >= 0 ? 'text-green-300' : 'text-red-300'}>
                                          {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div 
                                      className={`w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer ${
                                        company.status === 'thriving' ? 'bg-gradient-to-t from-green-400 to-green-500' :
                                        company.status === 'growing' ? 'bg-gradient-to-t from-blue-400 to-blue-500' :
                                        'bg-gradient-to-t from-red-400 to-red-500'
                                      } shadow-sm`}
                                      style={{height: `${barHeight}%`}}
                                    />
                                    
                                    <div className="text-xs font-medium text-gray-700 mt-2">
                                      {formatCurrency(value * 1000000)}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            
                            <div className="grid grid-cols-6 gap-3 text-center">
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
                                <div key={month} className="text-sm font-medium text-gray-600">
                                  {month}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Company Information */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Key Events & Milestones */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Recent Key Events
                          </h5>
                          <div className="space-y-3">
                            {company.keyEvents.map((event, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded border">
                                <div className={`w-3 h-3 rounded-full mt-1 ${
                                  event.type === 'Partnership' ? 'bg-blue-500' :
                                  event.type === 'Revenue' ? 'bg-green-500' :
                                  event.type === 'Product Launch' ? 'bg-purple-500' :
                                  event.type === 'Team' ? 'bg-orange-500' :
                                  event.type === 'Expansion' ? 'bg-indigo-500' :
                                  'bg-gray-500'
                                }`} />
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{event.type}</div>
                                  <div className="text-sm text-gray-600">{event.description}</div>
                                  <div className="text-xs text-gray-500 mt-1">{event.date}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Financial Metrics */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-3 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Financial Analysis
                          </h5>
                          <div className="space-y-4">
                            <div className="bg-white p-3 rounded border">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Investment Performance</span>
                                <span className={`text-sm font-bold ${roi >= 100 ? 'text-green-600' : roi >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                  {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                                </span>
                              </div>
                              <Progress value={Math.min(roi, 100)} className="w-full" />
                            </div>
                            
                            <div className="bg-white p-3 rounded border">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Momentum Score</span>
                                <span className="text-sm font-bold text-purple-600">{company.momentum}/100</span>
                              </div>
                              <Progress value={company.momentum} className="w-full" />
                            </div>

                            <div className="bg-white p-3 rounded border">
                              <div className="text-sm font-medium mb-2">Investment Timeline</div>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div>Initial Investment: Jan 2019</div>
                                <div>Last Valuation: {company.lastUpdate}</div>
                                <div>Hold Period: {Math.round((new Date().getTime() - new Date('2019-01-01').getTime()) / (365.25 * 24 * 60 * 60 * 1000) * 10) / 10} years</div>
                                <div>Target Exit: Q2 2025</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6 pt-4 border-t">
                        <SecureActionButton
                          onClick={() => executeAction('Detailed Report', company.name)}
                          debounceMs={1000}
                          maxClicksPerMinute={5}
                          size="sm"
                        >
                          <FileText className="h-4 w-4" />
                          Generate Report
                        </SecureActionButton>
                        <SecureActionButton
                          onClick={() => executeAction('Schedule Review', company.name)}
                          debounceMs={500}
                          maxClicksPerMinute={10}
                          size="sm"
                        >
                          <Calendar className="h-4 w-4" />
                          Schedule Review
                        </SecureActionButton>
                        <SecureActionButton
                          onClick={() => executeAction('Update Valuation', company.name)}
                          debounceMs={1000}
                          maxClicksPerMinute={5}
                          size="sm"
                        >
                          <TrendingUp className="h-4 w-4" />
                          Update Valuation
                        </SecureActionButton>
                        <SecureActionButton
                          onClick={() => executeAction('Risk Assessment', company.name)}
                          debounceMs={1000}
                          maxClicksPerMinute={5}
                          size="sm"
                        >
                          <Shield className="h-4 w-4" />
                          Risk Analysis
                        </SecureActionButton>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Detailed Portfolio Analytics Dashboard */}
              <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border">
                <h4 className="font-bold text-lg text-gray-900 mb-6">Comprehensive Portfolio Analytics</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Breakdown Chart */}
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h5 className="font-semibold mb-4">Performance Breakdown by Sector</h5>
                    <div className="space-y-4">
                      {[
                        { sector: 'Cloud Security', companies: 8, value: 450000000, growth: 32, color: 'bg-blue-500' },
                        { sector: 'AI Security', companies: 6, value: 380000000, growth: 45, color: 'bg-green-500' },
                        { sector: 'Zero Trust', companies: 4, value: 220000000, growth: 28, color: 'bg-purple-500' },
                        { sector: 'Identity & Access', companies: 3, value: 100000000, growth: 18, color: 'bg-orange-500' },
                        { sector: 'Threat Intelligence', companies: 2, value: 50000000, growth: -5, color: 'bg-red-500' }
                      ].map((sector, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 ${sector.color} rounded`}></div>
                            <div>
                              <div className="font-medium text-sm">{sector.sector}</div>
                              <div className="text-xs text-gray-600">{sector.companies} companies</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm">{formatCurrency(sector.value)}</div>
                            <div className={`text-xs ${sector.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {sector.growth > 0 ? '+' : ''}{sector.growth}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Analysis Matrix */}
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h5 className="font-semibold mb-4">Risk Analysis Matrix</h5>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {/* Risk Matrix Grid */}
                      <div className="text-center text-xs font-medium p-2">High Impact</div>
                      <div className="bg-yellow-200 p-4 rounded text-center text-xs">
                        <div className="font-bold">Medium Risk</div>
                        <div>2 companies</div>
                      </div>
                      <div className="bg-red-200 p-4 rounded text-center text-xs">
                        <div className="font-bold">High Risk</div>
                        <div>1 company</div>
                      </div>
                      
                      <div className="text-center text-xs font-medium p-2">Med Impact</div>
                      <div className="bg-green-200 p-4 rounded text-center text-xs">
                        <div className="font-bold">Low Risk</div>
                        <div>15 companies</div>
                      </div>
                      <div className="bg-yellow-200 p-4 rounded text-center text-xs">
                        <div className="font-bold">Medium Risk</div>
                        <div>3 companies</div>
                      </div>
                      
                      <div className="text-center text-xs font-medium p-2">Low Impact</div>
                      <div className="bg-green-200 p-4 rounded text-center text-xs">
                        <div className="font-bold">Low Risk</div>
                        <div>2 companies</div>
                      </div>
                      <div className="bg-green-200 p-4 rounded text-center text-xs">
                        <div className="font-bold">Low Risk</div>
                        <div>0 companies</div>
                      </div>
                    </div>
                    <div className="text-center text-xs text-gray-600">
                      <div>← Low Probability | High Probability →</div>
                    </div>
                  </div>
                </div>

                {/* Advanced Statistics */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border text-center">
                    <div className="text-lg font-bold text-blue-600">$52.2M</div>
                    <div className="text-xs text-gray-600">Average Investment</div>
                    <div className="text-xs text-blue-600 mt-1">Per Company</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border text-center">
                    <div className="text-lg font-bold text-green-600">18.5M</div>
                    <div className="text-xs text-gray-600">Median Exit Multiple</div>
                    <div className="text-xs text-green-600 mt-1">3.2x return</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border text-center">
                    <div className="text-lg font-bold text-purple-600">$450M</div>
                    <div className="text-xs text-gray-600">Pipeline Value</div>
                    <div className="text-xs text-purple-600 mt-1">8 active deals</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border text-center">
                    <div className="text-lg font-bold text-orange-600">85%</div>
                    <div className="text-xs text-gray-600">Portfolio Health</div>
                    <div className="text-xs text-orange-600 mt-1">Above target</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Overall Portfolio Trend - Enhanced Chart */}
                <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-2 border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">Overall Portfolio Performance</h4>
                      <p className="text-sm text-gray-600 mt-1">6-month growth trajectory with detailed metrics</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500 text-white px-3 py-1 text-sm">+24.3% YTD</Badge>
                      <Badge variant="outline" className="px-3 py-1 text-sm">$1.2B Portfolio</Badge>
                    </div>
                  </div>
                  
                  {/* Enhanced Chart Container */}
                  <div className="bg-white rounded-lg p-6 border shadow-sm">
                    {/* Chart Area */}
                    <div className="relative">
                      {/* Y-Axis Labels */}
                      <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 -ml-12">
                        <span>$1.4B</span>
                        <span>$1.2B</span>
                        <span>$1.0B</span>
                        <span>$0.8B</span>
                        <span>$0.6B</span>
                      </div>
                      
                      {/* Chart Grid */}
                      <div className="relative h-64 border-l-2 border-b-2 border-gray-200">
                        {/* Horizontal Grid Lines */}
                        {[0, 1, 2, 3, 4].map((line) => (
                          <div 
                            key={line}
                            className="absolute w-full border-t border-gray-100"
                            style={{ top: `${line * 25}%` }}
                          />
                        ))}
                        
                        {/* Chart Bars and Line */}
                        <div className="grid grid-cols-6 gap-4 h-full items-end px-4">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                            const values = [850, 920, 1050, 1180, 1220, 1200]
                            const growth = index > 0 ? ((values[index] - values[index-1]) / values[index-1] * 100) : 0
                            const barHeight = (values[index] / 1400) * 100
                            
                            return (
                              <div key={month} className="relative flex flex-col items-center">
                                {/* Value Display on Hover */}
                                <div className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity z-10">
                                  {formatCurrency(values[index] * 1000000)}
                                </div>
                                
                                {/* Bar */}
                                <div 
                                  className={`w-full rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer ${
                                    index === 0 ? 'bg-gradient-to-t from-blue-400 to-blue-500' :
                                    index === 1 ? 'bg-gradient-to-t from-blue-500 to-blue-600' :
                                    index === 2 ? 'bg-gradient-to-t from-green-400 to-green-500' :
                                    index === 3 ? 'bg-gradient-to-t from-green-500 to-green-600' :
                                    index === 4 ? 'bg-gradient-to-t from-green-600 to-green-700' :
                                    'bg-gradient-to-t from-green-500 to-green-600'
                                  } shadow-sm`}
                                  style={{ height: `${barHeight}%` }}
                                />
                                
                                {/* Growth Indicator */}
                                <div className={`text-xs font-semibold mt-1 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        
                        {/* Trend Line Overlay */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <polyline
                            points="8.33,76 25,63 41.67,40 58.33,16 75,13 91.67,20"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeDasharray="5,5"
                            className="opacity-60"
                          />
                          {/* Data Points */}
                          {[8.33, 25, 41.67, 58.33, 75, 91.67].map((x, index) => {
                            const y = [76, 63, 40, 16, 13, 20][index]
                            return (
                              <circle
                                key={index}
                                cx={`${x}%`}
                                cy={`${y}%`}
                                r="4"
                                fill="#3B82F6"
                                className="drop-shadow-sm"
                              />
                            )
                          })}
                        </svg>
                      </div>
                      
                      {/* X-Axis Labels */}
                      <div className="grid grid-cols-6 gap-4 mt-3 px-4">
                        {['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'].map((month, index) => (
                          <div key={month} className="text-center">
                            <div className="text-sm font-medium text-gray-700">{month.split(' ')[0]}</div>
                            <div className="text-xs text-gray-500">{month.split(' ')[1]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Chart Legend and Metrics */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-700">$1.2B</div>
                          <div className="text-xs text-blue-600">Current Value</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-700">+24.3%</div>
                          <div className="text-xs text-green-600">YTD Growth</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-700">$350M</div>
                          <div className="text-xs text-purple-600">6M Gain</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-700">23</div>
                          <div className="text-xs text-orange-600">Companies</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company-Specific Portfolio Trend Bar Chart */}
                <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">Portfolio Companies Performance</h4>
                      <p className="text-sm text-gray-600 mt-1">Individual company valuations and growth trends</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500 text-white px-3 py-1 text-sm">23 Companies</Badge>
                      <Badge variant="outline" className="px-3 py-1 text-sm">Live Data</Badge>
                    </div>
                  </div>

                  {/* Company Bar Chart */}
                  <div className="bg-white rounded-lg p-6 border shadow-sm">
                    <div className="relative">
                      {/* Y-Axis Labels for Company Chart */}
                      <div className="absolute left-0 top-0 h-80 flex flex-col justify-between text-xs text-gray-500 -ml-16">
                        <span>$100M</span>
                        <span>$80M</span>
                        <span>$60M</span>
                        <span>$40M</span>
                        <span>$20M</span>
                        <span>$0M</span>
                      </div>

                      {/* Chart Grid for Companies */}
                      <div className="relative h-80 border-l-2 border-b-2 border-gray-200">
                        {/* Horizontal Grid Lines */}
                        {[0, 1, 2, 3, 4, 5].map((line) => (
                          <div 
                            key={line}
                            className="absolute w-full border-t border-gray-100"
                            style={{ top: `${line * 20}%` }}
                          />
                        ))}

                        {/* Company Bars */}
                        <div className="flex justify-between items-end h-full px-4 gap-2">
                          {portfolio.map((company, index) => {
                            const maxValuation = 100000000 // $100M max for scaling
                            const barHeight = (company.currentValuation / maxValuation) * 100
                            const roi = ((company.currentValuation - company.investmentAmount) / company.investmentAmount) * 100
                            
                            return (
                              <div key={index} className="flex flex-col items-center group relative flex-1">
                                {/* Detailed Tooltip on Hover */}
                                <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 min-w-64 shadow-xl">
                                  <div className="text-sm font-bold mb-2">{company.name}</div>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span>Sector:</span>
                                      <span className="font-medium">{company.sector}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Investment:</span>
                                      <span className="font-medium">{formatCurrency(company.investmentAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Current Value:</span>
                                      <span className="font-medium text-green-300">{formatCurrency(company.currentValuation)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>ROI:</span>
                                      <span className={`font-bold ${roi >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                        {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Momentum:</span>
                                      <span className="font-medium text-blue-300">{company.momentum}/100</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Status:</span>
                                      <span className={`font-medium capitalize ${
                                        company.status === 'thriving' ? 'text-green-300' :
                                        company.status === 'growing' ? 'text-blue-300' :
                                        company.status === 'stable' ? 'text-yellow-300' :
                                        'text-red-300'
                                      }`}>
                                        {company.status}
                                      </span>
                                    </div>
                                  </div>
                                  {/* Tooltip Arrow */}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>

                                {/* Company Performance Bar */}
                                <div 
                                  className={`w-full rounded-t-lg transition-all duration-500 hover:scale-105 cursor-pointer shadow-lg ${
                                    company.status === 'thriving' ? 'bg-gradient-to-t from-green-500 to-green-400' :
                                    company.status === 'growing' ? 'bg-gradient-to-t from-blue-500 to-blue-400' :
                                    company.status === 'stable' ? 'bg-gradient-to-t from-yellow-500 to-yellow-400' :
                                    'bg-gradient-to-t from-red-500 to-red-400'
                                  } relative overflow-hidden`}
                                  style={{ height: `${Math.max(barHeight, 5)}%` }}
                                >
                                  {/* Value Label on Bar */}
                                  <div className="absolute inset-x-0 top-2 text-center">
                                    <div className="text-white text-xs font-bold drop-shadow">
                                      {formatCurrency(company.currentValuation)}
                                    </div>
                                  </div>
                                  
                                  {/* ROI Badge */}
                                  <div className="absolute inset-x-0 bottom-2 flex justify-center">
                                    <div className={`text-xs font-bold px-2 py-1 rounded ${
                                      roi >= 100 ? 'bg-green-600 text-white' :
                                      roi >= 50 ? 'bg-blue-600 text-white' :
                                      roi >= 0 ? 'bg-yellow-600 text-white' :
                                      'bg-red-600 text-white'
                                    }`}>
                                      {roi > 0 ? '+' : ''}{roi.toFixed(0)}%
                                    </div>
                                  </div>

                                  {/* Momentum Indicator */}
                                  <div className="absolute top-0 right-0 w-2 h-full opacity-60">
                                    <div 
                                      className={`w-full ${
                                        company.momentum >= 80 ? 'bg-green-300' :
                                        company.momentum >= 60 ? 'bg-blue-300' :
                                        company.momentum >= 40 ? 'bg-yellow-300' :
                                        'bg-red-300'
                                      }`}
                                      style={{ height: `${company.momentum}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Growth Trend Arrow */}
                                <div className="mt-1 flex justify-center">
                                  {roi >= 50 ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                  ) : roi >= 0 ? (
                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Company Names at Bottom */}
                      <div className="flex justify-between items-center mt-4 px-4 gap-2">
                        {portfolio.map((company, index) => (
                          <div key={index} className="flex-1 text-center">
                            <div className="text-sm font-bold text-gray-800 mb-1">
                              {company.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {company.sector}
                            </div>
                            <div className={`text-xs font-medium mt-1 ${
                              company.status === 'thriving' ? 'text-green-600' :
                              company.status === 'growing' ? 'text-blue-600' :
                              company.status === 'stable' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {company.status.toUpperCase()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chart Legend and Summary */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg border">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span className="text-sm font-medium">Thriving</span>
                          </div>
                          <div className="text-lg font-bold text-green-700">
                            {portfolio.filter(c => c.status === 'thriving').length}
                          </div>
                          <div className="text-xs text-green-600">Companies</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg border">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span className="text-sm font-medium">Growing</span>
                          </div>
                          <div className="text-lg font-bold text-blue-700">
                            {portfolio.filter(c => c.status === 'growing').length}
                          </div>
                          <div className="text-xs text-blue-600">Companies</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg border">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                            <span className="text-sm font-medium">Stable</span>
                          </div>
                          <div className="text-lg font-bold text-yellow-700">
                            {portfolio.filter(c => c.status === 'stable').length}
                          </div>
                          <div className="text-xs text-yellow-600">Companies</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg border">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span className="text-sm font-medium">Concerning</span>
                          </div>
                          <div className="text-lg font-bold text-red-700">
                            {portfolio.filter(c => c.status === 'concerning').length}
                          </div>
                          <div className="text-xs text-red-600">Companies</div>
                        </div>
                      </div>

                      {/* Performance Summary */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-800">
                            {formatCurrency(portfolio.reduce((sum, c) => sum + c.currentValuation, 0))}
                          </div>
                          <div className="text-xs text-gray-600">Total Portfolio Value</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-800">
                            {Math.round(portfolio.reduce((sum, c) => sum + ((c.currentValuation - c.investmentAmount) / c.investmentAmount * 100), 0) / portfolio.length)}%
                          </div>
                          <div className="text-xs text-gray-600">Average ROI</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-800">
                            {Math.round(portfolio.reduce((sum, c) => sum + c.momentum, 0) / portfolio.length)}
                          </div>
                          <div className="text-xs text-gray-600">Average Momentum</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Company Trends */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Individual Company Performance</h4>
                  {portfolio.map((company, index) => {
                    const monthlyValues = [
                      [12, 15, 18, 22, 28, 35], // CyberSecure growth
                      [8, 9, 11, 14, 18, 22],   // ZeroTrust Pro growth  
                      [15, 16, 14, 12, 10, 8]   // ThreatIntel Corp decline
                    ]
                    const companyGrowth = monthlyValues[index] || [10, 12, 14, 16, 18, 20]
                    const totalGrowth = ((companyGrowth[5] - companyGrowth[0]) / companyGrowth[0] * 100)
                    
                    return (
                      <Card key={index} className="p-4 border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {company.name.charAt(0)}
                            </div>
                            <div>
                              <h5 className="font-semibold">{company.name}</h5>
                              <p className="text-sm text-muted-foreground">{company.sector}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${
                              totalGrowth > 50 ? 'bg-green-500' :
                              totalGrowth > 0 ? 'bg-blue-500' :
                              'bg-red-500'
                            } text-white`}>
                              {totalGrowth > 0 ? '+' : ''}{totalGrowth.toFixed(1)}%
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">6M Growth</div>
                          </div>
                        </div>
                        
                        {/* Enhanced Individual Company Chart */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="relative">
                            {/* Mini Chart Container */}
                            <div className="grid grid-cols-6 gap-3 items-end h-20 mb-2">
                              {companyGrowth.map((value, monthIndex) => {
                                const maxValue = Math.max(...companyGrowth)
                                const barHeight = (value / maxValue) * 100
                                const monthGrowth = monthIndex > 0 ? ((value - companyGrowth[monthIndex-1]) / companyGrowth[monthIndex-1] * 100) : 0
                                
                                return (
                                  <div key={monthIndex} className="relative flex flex-col items-center group">
                                    {/* Tooltip on Hover */}
                                    <div className="absolute -top-12 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                      <div>{formatCurrency(value * 1000000)}</div>
                                      {monthIndex > 0 && (
                                        <div className={monthGrowth >= 0 ? 'text-green-300' : 'text-red-300'}>
                                          {monthGrowth > 0 ? '+' : ''}{monthGrowth.toFixed(1)}%
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Bar */}
                                    <div 
                                      className={`w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer ${
                                        totalGrowth > 50 ? 'bg-gradient-to-t from-green-400 to-green-500' :
                                        totalGrowth > 0 ? 'bg-gradient-to-t from-blue-400 to-blue-500' :
                                        'bg-gradient-to-t from-red-400 to-red-500'
                                      } shadow-sm`}
                                      style={{height: `${barHeight}%`}}
                                    />
                                    
                                    {/* Value Display */}
                                    <div className="text-xs font-medium text-gray-700 mt-1">
                                      {formatCurrency(value * 1000000)}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            
                            {/* Month Labels */}
                            <div className="grid grid-cols-6 gap-3 text-center">
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, monthIndex) => (
                                <div key={monthIndex} className="text-xs font-medium text-gray-600">
                                  {month}
                                </div>
                              ))}
                            </div>
                            
                            {/* Trend Line for Individual Company */}
                            <svg className="absolute inset-0 w-full h-20 pointer-events-none">
                              <polyline
                                points={companyGrowth.map((value, idx) => {
                                  const x = (idx / (companyGrowth.length - 1)) * 100
                                  const y = 100 - (value / Math.max(...companyGrowth)) * 80
                                  return `${x},${y}`
                                }).join(' ')}
                                fill="none"
                                stroke={totalGrowth > 50 ? '#10B981' : totalGrowth > 0 ? '#3B82F6' : '#EF4444'}
                                strokeWidth="2"
                                strokeDasharray="3,3"
                                className="opacity-70"
                              />
                            </svg>
                          </div>
                          
                          {/* Performance Summary */}
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Peak:</span> {formatCurrency(Math.max(...companyGrowth) * 1000000)}
                            </div>
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Current:</span> {formatCurrency(companyGrowth[companyGrowth.length - 1] * 1000000)}
                            </div>
                            <div className={`text-xs font-semibold ${totalGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              <span className="font-medium">6M:</span> {totalGrowth > 0 ? '+' : ''}{totalGrowth.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        {/* AI Insights for this company */}
                        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-l-purple-500">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">AI Insights</span>
                          </div>
                          <div className="text-sm text-gray-700">
                            {index === 0 && "Strong momentum driven by AWS partnership and enterprise client acquisition. Projected to reach $50M valuation by Q4 2024."}
                            {index === 1 && "Steady growth with government contract providing stability. Zero-trust market expansion creating new opportunities."}
                            {index === 2 && "Declining trend due to customer churn. Recommend immediate intervention and product pivot strategy review."}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {index === 0 && "High Growth Potential"}
                              {index === 1 && "Stable Performer"}
                              {index === 2 && "Requires Attention"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Confidence: {index === 0 ? '94%' : index === 1 ? '87%' : '91%'}
                            </Badge>
                          </div>
                        </div>

                        {/* Action Recommendations */}
                        <div className="flex gap-2 mt-3">
                          <Button
                            onClick={() => executeAction('Deep Dive Analysis', company.name)}
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="h-3 w-3" />
                            Deep Dive
                          </Button>
                          <Button
                            onClick={() => executeAction('Trend Forecast', company.name)}
                            size="sm"
                            variant="outline"
                          >
                            <TrendingUp className="h-3 w-3" />
                            Forecast
                          </Button>
                          {index === 2 && (
                            <Button
                              onClick={() => executeAction('Intervention Plan', company.name)}
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              Intervention
                            </Button>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>

                {/* AI-Powered Predictions */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI-Powered Portfolio Predictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-green-600">$1.8B</div>
                        <div className="text-sm text-muted-foreground">Projected Value (12M)</div>
                        <div className="text-xs text-green-600 mt-1">+50% growth potential</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">85%</div>
                        <div className="text-sm text-muted-foreground">Success Probability</div>
                        <div className="text-xs text-blue-600 mt-1">High confidence</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">Q2 2025</div>
                        <div className="text-sm text-muted-foreground">Next Exit Window</div>
                        <div className="text-xs text-purple-600 mt-1">Optimal timing</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics & Risk Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Portfolio Performance Metrics
                </CardTitle>
                <CardDescription>Key performance indicators and benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Average ROI</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">247%</div>
                      <div className="text-xs text-green-600">vs 185% industry avg</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Success Rate</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">78%</div>
                      <div className="text-xs text-blue-600">vs 65% industry avg</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Time to Exit</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">4.2y</div>
                      <div className="text-xs text-purple-600">vs 5.1y industry avg</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">Portfolio IRR</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">32%</div>
                      <div className="text-xs text-orange-600">vs 24% industry avg</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card className="border-2 border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  AI Risk Assessment
                </CardTitle>
                <CardDescription>Portfolio risk analysis with mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Market Risk</span>
                      <div className="text-xs text-muted-foreground">Cybersecurity market volatility</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Medium</Badge>
                      <div className="text-xs text-muted-foreground mt-1">Score: 65/100</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Technology Risk</span>
                      <div className="text-xs text-muted-foreground">AI disruption potential</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">High</Badge>
                      <div className="text-xs text-muted-foreground mt-1">Score: 78/100</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Competitive Risk</span>
                      <div className="text-xs text-muted-foreground">Big tech competition</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Low</Badge>
                      <div className="text-xs text-muted-foreground mt-1">Score: 35/100</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Regulatory Risk</span>
                      <div className="text-xs text-muted-foreground">Compliance changes</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Medium</Badge>
                      <div className="text-xs text-muted-foreground mt-1">Score: 55/100</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Action Center */}
        <TabsContent value="actions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Action Center</h2>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {opportunities.reduce((sum, opp) => sum + opp.nextActions.length, 0)} pending actions
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Immediate Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Immediate Actions Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities.flatMap(opp => 
                    opp.nextActions.slice(0, 2).map((action, index) => (
                      <div key={`${opp.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{action}</div>
                          <div className="text-sm text-muted-foreground">{opp.companyName}</div>
                        </div>
                        <SecureActionButton
                          onClick={() => executeAction(action, opp.companyName)}
                          debounceMs={500}
                          maxClicksPerMinute={10}
                          size="sm"
                        >
                          Execute
                        </SecureActionButton>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Scheduled Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Board Meeting - CyberSecure</div>
                      <div className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</div>
                    </div>
                    <Button
                      onClick={() => executeAction('Join Meeting', 'CyberSecure')}
                      size="sm"
                      variant="outline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Join
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Due Diligence Call - SecureFlow AI</div>
                      <div className="text-sm text-muted-foreground">Friday, 10:00 AM</div>
                    </div>
                    <Button
                      onClick={() => executeAction('Prepare Materials', 'SecureFlow AI')}
                      size="sm"
                      variant="outline"
                    >
                      Prepare
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Portfolio Review - Q4 2024</div>
                      <div className="text-sm text-muted-foreground">Next Monday, 9:00 AM</div>
                    </div>
                    <Button
                      onClick={() => generateReport('Q4 Portfolio Review')}
                      size="sm"
                      variant="outline"
                    >
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SecureActionButton
                    onClick={() => generateReport('Weekly Summary')}
                    debounceMs={1000}
                    maxClicksPerMinute={5}
                    className="h-20 flex-col"
                  >
                    <Mail className="h-6 w-6 mb-2" />
                    Weekly Report
                  </SecureActionButton>
                  
                  <SecureActionButton
                    onClick={() => executeAction('Schedule Pipeline Review', 'All Companies')}
                    debounceMs={1000}
                    maxClicksPerMinute={5}
                    className="h-20 flex-col"
                  >
                    <Calendar className="h-6 w-6 mb-2" />
                    Pipeline Review
                  </SecureActionButton>
                  
                  <SecureActionButton
                    onClick={() => executeAction('Market Analysis', 'Cybersecurity')}
                    debounceMs={1000}
                    maxClicksPerMinute={5}
                    className="h-20 flex-col"
                  >
                    <Globe className="h-6 w-6 mb-2" />
                    Market Analysis
                  </SecureActionButton>
                  
                  <SecureActionButton
                    onClick={() => executeAction('Risk Assessment', 'Portfolio')}
                    debounceMs={1000}
                    maxClicksPerMinute={5}
                    className="h-20 flex-col"
                  >
                    <Shield className="h-6 w-6 mb-2" />
                    Risk Assessment
                  </SecureActionButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}