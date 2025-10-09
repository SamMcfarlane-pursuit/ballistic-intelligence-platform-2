'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExecutiveLayout } from '@/components/layouts/ExecutiveLayout'
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Target,
  Award,
  Users,
  Calendar,
  ExternalLink,
  Eye,
  RefreshCw,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface PortfolioCompany {
  id: string
  name: string
  focusArea: string
  investmentStage: string
  currentValuation: number
  investmentAmount: number
  ownershipPercentage: number
  revenueGrowth: number
  riskLevel: string
  exitProbability: number
  aiInsights: {
    marketTrend: string
    competitiveThreat: string
    investmentRecommendation: string
    confidenceScore: number
    keyOpportunities: string[]
    keyRisks: string[]
  }
}

interface PortfolioAnalytics {
  totalPortfolioValue: number
  totalInvested: number
  unrealizedGains: number
  irr: number
  moic: number
  performanceByStage: Array<{
    stage: string
    companies: number
    totalValue: number
    avgMultiple: number
  }>
  performanceByFocus: Array<{
    focusArea: string
    companies: number
    totalValue: number
    avgGrowthRate: number
  }>
  topPerformers: Array<{
    companyName: string
    multiple: number
    currentValue: number
    growthRate: number
  }>
  exitPipeline: Array<{
    companyName: string
    exitProbability: number
    estimatedValue: number
    timeframe: string
  }>
  marketTrends: Array<{
    trend: string
    impact: string
    affectedCompanies: string[]
  }>
}

export default function BallisticPortfolioPage() {
  const [companies, setCompanies] = useState<PortfolioCompany[]>([])
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<'overview' | 'companies' | 'performance' | 'exits'>('companies')
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    fetchPortfolioData()
    const interval = setInterval(fetchPortfolioData, 5 * 60 * 1000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/ballistic-portfolio?view=overview')
      
      if (response.ok) {
        const data = await response.json()
        setCompanies(data.data.companies)
        setAnalytics(data.data.analytics)
        setLastUpdate(new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(1)}%`
  }

  const getFocusAreaColor = (focusArea: string) => {
    const colors: Record<string, string> = {
      'ai-security': 'bg-blue-100 text-blue-800',
      'data-protection': 'bg-green-100 text-green-800',
      'application-security': 'bg-purple-100 text-purple-800',
      'workforce-security': 'bg-orange-100 text-orange-800',
      'authorization': 'bg-red-100 text-red-800',
      'disinformation': 'bg-yellow-100 text-yellow-800',
      'connected-devices': 'bg-indigo-100 text-indigo-800'
    }
    return colors[focusArea] || 'bg-gray-100 text-gray-800'
  }

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'pre-seed': 'bg-gray-100 text-gray-800',
      'seed': 'bg-green-100 text-green-800',
      'series-a': 'bg-blue-100 text-blue-800',
      'series-b': 'bg-purple-100 text-purple-800',
      'series-c': 'bg-orange-100 text-orange-800'
    }
    return colors[stage] || 'bg-gray-100 text-gray-800'
  }

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-green-500',
      'medium': 'bg-yellow-500',
      'high': 'bg-red-500'
    }
    return colors[risk] || 'bg-gray-500'
  }

  const getCompanyGradient = (focusArea: string) => {
    const gradients: Record<string, string> = {
      'application-security': 'from-blue-500 to-blue-600',
      'data-protection': 'from-green-500 to-green-600',
      'workforce-security': 'from-purple-500 to-purple-600',
      'authorization': 'from-orange-500 to-orange-600',
      'network-security': 'from-red-500 to-red-600',
      'cloud-security': 'from-cyan-500 to-cyan-600',
      'identity-management': 'from-indigo-500 to-indigo-600'
    }
    return gradients[focusArea] || 'from-gray-500 to-gray-600'
  }

  const getStageIndicator = (stage: string) => {
    switch (stage) {
      case 'seed': return 'bg-yellow-400'
      case 'series-a': return 'bg-blue-400'
      case 'series-b': return 'bg-green-400'
      case 'series-c': return 'bg-purple-400'
      default: return 'bg-gray-400'
    }
  }

  const getHealthIndicator = (growth: number) => {
    if (growth > 200) return 'bg-green-500'
    if (growth > 150) return 'bg-blue-500'
    if (growth > 100) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const getRecommendationColor = (recommendation: string) => {
    const colors: Record<string, string> = {
      'strong_buy': 'bg-green-100 text-green-800',
      'buy': 'bg-blue-100 text-blue-800',
      'hold': 'bg-yellow-100 text-yellow-800',
      'sell': 'bg-red-100 text-red-800'
    }
    return colors[recommendation] || 'bg-gray-100 text-gray-800'
  }

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ExecutiveLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              Ballistic Ventures Portfolio
            </h1>
            <p className="text-gray-600 mt-2">
              18 Revolutionary Cybersecurity Companies • Early-Stage Focus • Last updated: {lastUpdate}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchPortfolioData}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* View Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedView('overview')}
                className={`px-4 py-2 text-sm rounded ${selectedView === 'overview' ? 'bg-white shadow-sm font-medium' : ''}`}
              >
                Portfolio Overview
              </button>
              <button
                onClick={() => setSelectedView('companies')}
                className={`px-4 py-2 text-sm rounded flex items-center gap-2 ${selectedView === 'companies' ? 'bg-white shadow-sm font-medium' : ''}`}
              >
                <Building2 className="h-4 w-4" />
                Companies
                <Badge variant="secondary" className="text-xs">Enhanced</Badge>
              </button>
              <button
                onClick={() => setSelectedView('performance')}
                className={`px-4 py-2 text-sm rounded ${selectedView === 'performance' ? 'bg-white shadow-sm font-medium' : ''}`}
              >
                Performance
              </button>
              <button
                onClick={() => setSelectedView('exits')}
                className={`px-4 py-2 text-sm rounded ${selectedView === 'exits' ? 'bg-white shadow-sm font-medium' : ''}`}
              >
                Exit Pipeline
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Metrics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(analytics.totalPortfolioValue)}</p>
                    <p className="text-xs text-green-600">+{formatCurrency(analytics.unrealizedGains)} unrealized</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Invested</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.totalInvested)}</p>
                    <p className="text-xs text-gray-500">Across {companies.length} companies</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">MOIC</p>
                    <p className="text-2xl font-bold text-purple-600">{analytics.moic.toFixed(1)}x</p>
                    <p className="text-xs text-gray-500">Multiple on invested capital</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">IRR</p>
                    <p className="text-2xl font-bold text-orange-600">{formatPercentage(analytics.irr)}</p>
                    <p className="text-xs text-gray-500">Internal rate of return</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Exit Pipeline</p>
                    <p className="text-2xl font-bold text-red-600">{analytics.exitPipeline.length}</p>
                    <p className="text-xs text-gray-500">Companies ready</p>
                  </div>
                  <Award className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {selectedView === 'overview' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance by Focus Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Performance by Focus Area
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.performanceByFocus.map((focus, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {focus.focusArea.replace('-', ' ')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {focus.companies} companies • {focus.avgGrowthRate.toFixed(0)}% avg growth
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">{formatCurrency(focus.totalValue)}</div>
                          <div className="text-xs text-gray-500">portfolio value</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance by Stage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Performance by Stage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.performanceByStage.map((stage, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {stage.stage.replace('-', ' ')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {stage.companies} companies • {stage.avgMultiple.toFixed(1)}x multiple
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{formatCurrency(stage.totalValue)}</div>
                          <div className="text-xs text-gray-500">portfolio value</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Top Performing Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analytics.topPerformers.slice(0, 3).map((performer, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{performer.companyName}</h4>
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Multiple:</span>
                          <span className="font-semibold text-purple-600">{performer.multiple.toFixed(1)}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Value:</span>
                          <span className="font-medium">{formatCurrency(performer.currentValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Growth Rate:</span>
                          <span className="font-medium text-green-600">{performer.growthRate.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Market Trends & Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.marketTrends.map((trend, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{trend.trend}</h4>
                        <Badge 
                          variant={trend.impact === 'positive' ? 'default' : 'secondary'} 
                          className="text-xs"
                        >
                          {trend.impact} impact
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Affected companies: {trend.affectedCompanies.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedView === 'companies' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Portfolio Companies ({companies.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {companies.map((company) => (
                    <Card key={company.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${getCompanyGradient(company.focusArea)}`}>
                                <span className="text-white font-bold text-lg">
                                  {company.name.charAt(0)}
                                </span>
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${getStageIndicator(company.investmentStage)}`}>
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                              <p className="text-sm text-gray-600 capitalize">
                                {company.focusArea.replace('-', ' ')} • {company.investmentStage}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${getHealthIndicator(company.revenueGrowth)}`}></div>
                                <span className="text-xs text-gray-500">
                                  {company.revenueGrowth > 150 ? 'High Growth' : 
                                   company.revenueGrowth > 100 ? 'Growing' : 'Stable'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge className={getRecommendationColor(company.aiInsights.investmentRecommendation)} variant="outline">
                              {company.aiInsights.investmentRecommendation.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <div className="text-xs text-gray-500 text-right">
                              {(company.aiInsights.confidenceScore * 100).toFixed(0)}% confidence
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Valuation</span>
                            </div>
                            <div className="text-lg font-bold text-blue-900">{formatCurrency(company.currentValuation)}</div>
                            <div className="text-xs text-blue-600">
                              {((company.currentValuation / company.investmentAmount - 1) * 100).toFixed(1)}% multiple
                            </div>
                          </div>
                          
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">Growth</span>
                            </div>
                            <div className="text-lg font-bold text-green-900">{company.revenueGrowth.toFixed(0)}%</div>
                            <div className="text-xs text-green-600">Revenue growth</div>
                          </div>
                        </div>

                        {/* Investment Details */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-sm text-gray-600">Investment</div>
                              <div className="font-bold text-gray-900">{formatCurrency(company.investmentAmount)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Ownership</div>
                              <div className="font-bold text-purple-600">{company.ownershipPercentage.toFixed(1)}%</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Exit Prob.</div>
                              <div className="font-bold text-orange-600">{(company.exitProbability * 100).toFixed(0)}%</div>
                            </div>
                          </div>
                        </div>

                        {/* Risk & Market Analysis */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getRiskColor(company.riskLevel)}`}></div>
                              <span className="text-sm font-medium">Risk Level: {company.riskLevel.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {company.aiInsights.marketTrend} market
                              </span>
                            </div>
                          </div>

                          {/* Key Insights */}
                          <div className="grid grid-cols-1 gap-3">
                            <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg">
                              <div className="text-xs font-semibold text-green-800 mb-1">Key Opportunities</div>
                              <div className="text-xs text-green-700">
                                {company.aiInsights.keyOpportunities.slice(0, 2).map((opp, idx) => (
                                  <div key={idx} className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {opp}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg">
                              <div className="text-xs font-semibold text-red-800 mb-1">Key Risks</div>
                              <div className="text-xs text-red-700">
                                {company.aiInsights.keyRisks.slice(0, 2).map((risk, idx) => (
                                  <div key={idx} className="flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3 text-red-500" />
                                    {risk}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              // Open detailed company analysis
                              window.open(`/company-analysis/${company.id}`, '_blank')
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Detailed Analysis
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Open company website or external link
                              window.open(`https://${company.name.toLowerCase().replace(' ', '')}.com`, '_blank')
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Generate AI report
                              alert(`Generating AI report for ${company.name}...`)
                            }}
                          >
                            <Zap className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedView === 'exits' && analytics && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-red-600" />
                  Exit Pipeline ({analytics.exitPipeline.length} companies)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.exitPipeline.map((exit, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{exit.companyName}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {(exit.exitProbability * 100).toFixed(0)}% probability
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {exit.timeframe}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Estimated Exit Value</div>
                          <div className="text-lg font-bold text-green-600">{formatCurrency(exit.estimatedValue)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Timeframe</div>
                          <div className="text-lg font-medium text-blue-600">{exit.timeframe}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </div>
    </ExecutiveLayout>
  )
}