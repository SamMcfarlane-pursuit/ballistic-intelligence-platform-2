'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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
  Activity,
  Brain,
  Shield,
  ArrowLeft,
  LineChart,
  MousePointer
} from 'lucide-react'
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

interface CompanyAnalysis {
  overview: {
    name: string
    sector: string
    stage: string
    valuation: string
    confidence: number
    recommendation: string
  }
  financials: {
    revenue: string
    growth: string
    burnRate: string
    runway: string
    customers: number | string
    averageContractValue: string
  }
  technology: {
    platform: string
    differentiators: string[]
    patents: number
    techScore: number
  }
  market: {
    tam: string
    sam: string
    position: string
    competitors: string[]
    marketShare: string
  }
  risks: Array<{
    risk: string
    severity: string
    mitigation: string
  }>
  opportunities: Array<{
    opportunity: string
    impact: string
    timeline: string
  }>
  ragInsights: {
    knowledgeGraphConnections: number
    semanticSimilarity: number
    marketTrends: string[]
    competitivePositioning: string
    investmentThesis: string
  }
  aiRecommendations: string[]
  lastAnalyzed: string
}

export default function CompanyAnalysisPage() {
  const params = useParams()
  const companyId = params.id as string
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [chartData, setChartData] = useState({
    revenueGrowth: [
      { quarter: 'Q1 2023', revenue: 8.2, customers: 45 },
      { quarter: 'Q2 2023', revenue: 12.1, customers: 62 },
      { quarter: 'Q3 2023', revenue: 18.5, customers: 89 },
      { quarter: 'Q4 2023', revenue: 28.3, customers: 118 },
      { quarter: 'Q1 2024', revenue: 35.7, customers: 142 },
      { quarter: 'Q2 2024', revenue: 45.0, customers: 150 }
    ],
    marketComparison: [
      { metric: 'Market Share', company: 8.5, average: 3.2, leader: 15.8 },
      { metric: 'Growth Rate', company: 220, average: 45, leader: 180 },
      { metric: 'Customer Satisfaction', company: 94, average: 78, leader: 92 },
      { metric: 'Technology Score', company: 94, average: 72, leader: 88 }
    ],
    riskAssessment: [
      { category: 'Market Risk', score: 25, max: 100 },
      { category: 'Technology Risk', score: 15, max: 100 },
      { category: 'Financial Risk', score: 30, max: 100 },
      { category: 'Competitive Risk', score: 40, max: 100 },
      { category: 'Regulatory Risk', score: 20, max: 100 }
    ],
    fundingHistory: [
      { round: 'Seed', amount: 2.5, date: '2021-03', valuation: 12 },
      { round: 'Series A', amount: 15, date: '2022-08', valuation: 65 },
      { round: 'Series B', amount: 45, date: '2024-01', valuation: 285 }
    ]
  })

  // Map company IDs to names (in a real app, this would come from a database)
  const companyNames: Record<string, string> = {
    'veza': 'Veza Inc.',
    'concentric': 'Concentric Inc.',
    'pangea': 'Pangea',
    'nudge': 'Nudge Security',
    'armis': 'Armis Security'
  }

  useEffect(() => {
    if (companyId) {
      fetchCompanyAnalysis()
    }
  }, [companyId])

  const fetchCompanyAnalysis = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const companyName = companyNames[companyId] || companyId
      const response = await fetch(`/api/rag-analysis?action=company-analysis&company=${encodeURIComponent(companyName)}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setAnalysis(data.data.analysis)
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Failed to fetch company analysis:', error)
      setError(error instanceof Error ? error.message : 'Failed to load analysis')
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'strong buy': return 'bg-green-100 text-green-800 border-green-200'
      case 'buy': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'sell': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <ExecutiveLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </ExecutiveLayout>
    )
  }

  if (error) {
    return (
      <ExecutiveLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Analysis Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchCompanyAnalysis}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Analysis
            </Button>
          </div>
        </div>
      </ExecutiveLayout>
    )
  }

  if (!analysis) {
    return (
      <ExecutiveLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Analysis Available</h2>
            <p className="text-gray-600">Company analysis not found.</p>
          </div>
        </div>
      </ExecutiveLayout>
    )
  }

  return (
    <ExecutiveLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{analysis.overview.name}</h1>
              <p className="text-gray-600">{analysis.overview.sector} • {analysis.overview.stage}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={getRecommendationColor(analysis.overview.recommendation)}>
              {analysis.overview.recommendation}
            </Badge>
            <Button onClick={fetchCompanyAnalysis} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valuation</p>
                  <p className="text-2xl font-bold">{analysis.overview.valuation}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="text-2xl font-bold">{analysis.overview.confidence}%</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tech Score</p>
                  <p className="text-2xl font-bold">{analysis.technology.techScore}/100</p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Market Position</p>
                  <p className="text-lg font-bold">{analysis.market.position}</p>
                </div>
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Growth Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-600" />
                Revenue Growth Trajectory
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedChart(selectedChart === 'revenue' ? null : 'revenue')}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={chartData.revenueGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{label}</p>
                            <p className="text-blue-600">
                              Revenue: ${payload[0].value}M
                            </p>
                            <p className="text-green-600">
                              Customers: {payload[0].payload.customers}
                            </p>
                            <p className="text-gray-600 text-sm">
                              QoQ Growth: {payload[0].payload.revenue > 8.2 ? 
                                `+${((payload[0].payload.revenue / (chartData.revenueGrowth[chartData.revenueGrowth.findIndex(d => d.quarter === label) - 1]?.revenue || payload[0].payload.revenue) - 1) * 100).toFixed(1)}%` : 
                                'Base Quarter'
                              }
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
              {selectedChart === 'revenue' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Growth Metrics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">CAGR (18 months):</span>
                      <span className="font-semibold ml-2 text-green-600">248%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Customer Growth:</span>
                      <span className="font-semibold ml-2">233%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ARR Run Rate:</span>
                      <span className="font-semibold ml-2">$45M</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Quarter Proj:</span>
                      <span className="font-semibold ml-2 text-green-600">$52M</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Market Comparison Radar Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Market Position Analysis
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedChart(selectedChart === 'market' ? null : 'market')}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={chartData.marketComparison}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 250]} />
                  <Radar 
                    name="Company" 
                    dataKey="company" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar 
                    name="Market Average" 
                    dataKey="average" 
                    stroke="#6B7280" 
                    fill="#6B7280" 
                    fillOpacity={0.1}
                    strokeWidth={1}
                  />
                  <Radar 
                    name="Market Leader" 
                    dataKey="leader" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.1}
                    strokeWidth={1}
                  />
                  <Legend />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} style={{ color: entry.color }}>
                                {entry.name}: {entry.value}
                                {label === 'Growth Rate' ? '%' : label === 'Market Share' ? '%' : '/100'}
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              {selectedChart === 'market' && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Competitive Position</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>vs Market Average:</span>
                      <span className="font-semibold text-green-600">+156% better</span>
                    </div>
                    <div className="flex justify-between">
                      <span>vs Market Leader:</span>
                      <span className="font-semibold text-blue-600">Competitive</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Strengths:</span>
                      <span className="font-semibold">Growth, Tech Score</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Opportunities:</span>
                      <span className="font-semibold">Market Share</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessment & Funding History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Assessment Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Risk Assessment Profile
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedChart(selectedChart === 'risk' ? null : 'risk')}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.riskAssessment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const riskLevel = payload[0].value < 30 ? 'Low' : payload[0].value < 60 ? 'Medium' : 'High'
                        const riskColor = payload[0].value < 30 ? '#10B981' : payload[0].value < 60 ? '#F59E0B' : '#EF4444'
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{label}</p>
                            <p style={{ color: riskColor }}>
                              Risk Score: {payload[0].value}/100
                            </p>
                            <p className="text-sm" style={{ color: riskColor }}>
                              Level: {riskLevel} Risk
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                              {payload[0].value < 30 ? 'Well managed risk area' : 
                               payload[0].value < 60 ? 'Moderate attention needed' : 
                               'Requires immediate attention'}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill={(entry) => entry < 30 ? '#10B981' : entry < 60 ? '#F59E0B' : '#EF4444'}
                  >
                    {chartData.riskAssessment.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.score < 30 ? '#10B981' : entry.score < 60 ? '#F59E0B' : '#EF4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {selectedChart === 'risk' && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Risk Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Overall Risk Score:</span>
                      <span className="font-semibold text-yellow-600">26/100 (Low)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Highest Risk:</span>
                      <span className="font-semibold">Competitive (40/100)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lowest Risk:</span>
                      <span className="font-semibold text-green-600">Technology (15/100)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Trend:</span>
                      <span className="font-semibold text-green-600">Decreasing</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Funding History Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Funding & Valuation History
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedChart(selectedChart === 'funding' ? null : 'funding')}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.fundingHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="round" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{label} Round</p>
                            <p className="text-purple-600">
                              Funding: ${payload[0].value}M
                            </p>
                            <p className="text-blue-600">
                              Valuation: ${payload[0].payload.valuation}M
                            </p>
                            <p className="text-gray-600 text-sm">
                              Date: {payload[0].payload.date}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Multiple: {(payload[0].payload.valuation / payload[0].payload.amount).toFixed(1)}x
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valuation" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
              {selectedChart === 'funding' && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Funding Insights</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Raised:</span>
                      <span className="font-semibold ml-2">$62.5M</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Valuation Growth:</span>
                      <span className="font-semibold ml-2 text-green-600">2,275%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Round Multiple:</span>
                      <span className="font-semibold ml-2">6.3x</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Round Est:</span>
                      <span className="font-semibold ml-2">Series C ($450M)</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold">{analysis.financials.revenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth:</span>
                  <span className="font-semibold text-green-600">{analysis.financials.growth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Burn Rate:</span>
                  <span className="font-semibold">{analysis.financials.burnRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Runway:</span>
                  <span className="font-semibold">{analysis.financials.runway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customers:</span>
                  <span className="font-semibold">{analysis.financials.customers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Contract:</span>
                  <span className="font-semibold">{analysis.financials.averageContractValue}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Platform */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Technology Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Platform</h4>
                  <p className="text-gray-600">{analysis.technology.platform}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Differentiators</h4>
                  <ul className="space-y-1">
                    {analysis.technology.differentiators.map((diff, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Patents:</span>
                  <span className="font-semibold">{analysis.technology.patents}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">TAM:</span>
                  <span className="font-semibold">{analysis.market.tam}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SAM:</span>
                  <span className="font-semibold">{analysis.market.sam}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Share:</span>
                  <span className="font-semibold">{analysis.market.marketShare}</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Competitors</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.market.competitors.map((competitor, index) => (
                      <Badge key={index} variant="outline">{competitor}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RAG Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Enhanced Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Investment Thesis</h4>
                  <p className="text-sm text-gray-600">{analysis.ragInsights.investmentThesis}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Market Trends</h4>
                  <ul className="space-y-1">
                    {analysis.ragInsights.marketTrends.map((trend, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Knowledge Connections:</span>
                  <span className="font-semibold">{analysis.ragInsights.knowledgeGraphConnections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Semantic Similarity:</span>
                  <span className="font-semibold">{(analysis.ragInsights.semanticSimilarity * 100).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risks and Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Risks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Key Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.risks.map((risk, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{risk.risk}</h4>
                      <Badge className={getRiskColor(risk.severity)}>{risk.severity}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{risk.mitigation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Key Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.opportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{opportunity.opportunity}</h4>
                      <Badge className={getImpactColor(opportunity.impact)}>{opportunity.impact}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{opportunity.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.aiRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last analyzed: {new Date(analysis.lastAnalyzed).toLocaleString()}
        </div>
      </div>
    </ExecutiveLayout>
  )
}