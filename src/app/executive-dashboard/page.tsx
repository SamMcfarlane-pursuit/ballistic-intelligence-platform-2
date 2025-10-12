'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ExecutiveLayout } from '@/components/layouts/ExecutiveLayout'
import { 
  TrendingUp, 
  Shield, 
  Brain,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Activity,
  Target,
  Zap,
  Eye,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Building,
  Calendar,
  Users,
  BarChart3,
  Lock,
  Cpu,
  Globe,
  PieChart,
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
  ResponsiveContainer
} from 'recharts'

interface ExecutiveSummary {
  totalPortfolioValue: number
  monthlyGrowth: number
  threatsBlocked: number
  aiInsights: number
  criticalAlerts: number
  systemHealth: number
}

interface QuickInsight {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  priority: 'high' | 'medium' | 'low'
}

interface DetailedMetric {
  title: string
  value: string
  description: string
  breakdown: Array<{
    label: string
    value: string
    percentage?: number
    reference?: string
  }>
  references: Array<{
    title: string
    url: string
    type: 'company' | 'report' | 'system' | 'external'
  }>
  lastUpdated: string
}

export default function ExecutiveDashboard() {
  // Initialize with working data immediately
  const [summary, setSummary] = useState<ExecutiveSummary>({
    totalPortfolioValue: 1200000000,
    monthlyGrowth: 12.5,
    threatsBlocked: 247,
    aiInsights: 89,
    criticalAlerts: 3,
    systemHealth: 98.7
  })
  
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [detailedMetrics, setDetailedMetrics] = useState<Record<string, DetailedMetric>>({
    portfolio: {
      title: 'Portfolio Value',
      value: '$1.2B',
      description: 'Total value across 23 cybersecurity companies in our investment portfolio',
      breakdown: [
        { label: 'Veza Inc.', value: '$285M', percentage: 23.8, reference: '/ballistic-portfolio#veza' },
        { label: 'Concentric Inc.', value: '$198M', percentage: 16.5, reference: '/ballistic-portfolio#concentric' },
        { label: 'Pangea', value: '$156M', percentage: 13.0, reference: '/ballistic-portfolio#pangea' },
        { label: 'Armis Security', value: '$142M', percentage: 11.8, reference: '/ballistic-portfolio#armis' },
        { label: 'Other Holdings', value: '$419M', percentage: 34.9, reference: '/ballistic-portfolio' }
      ],
      references: [
        { title: 'Ballistic Portfolio Dashboard', url: '/ballistic-portfolio', type: 'system' },
        { title: 'Veza Inc. Company Profile', url: '/ballistic-portfolio#veza', type: 'company' },
        { title: 'Q4 2024 Portfolio Report', url: '#', type: 'report' },
        { title: 'Crunchbase Portfolio Data', url: 'https://crunchbase.com', type: 'external' }
      ],
      lastUpdated: new Date().toISOString()
    },
    growth: {
      title: 'Monthly Growth',
      value: '+12.5%',
      description: 'Portfolio performance growth compared to previous month',
      breakdown: [
        { label: 'Top Performers', value: '+18.2%', percentage: 65, reference: '/ballistic-portfolio?filter=top' },
        { label: 'Stable Growth', value: '+8.4%', percentage: 25, reference: '/ballistic-portfolio?filter=stable' },
        { label: 'Underperforming', value: '-2.1%', percentage: 10, reference: '/ballistic-portfolio?filter=under' }
      ],
      references: [
        { title: 'Growth Analytics Dashboard', url: '/ballistic-portfolio?view=analytics', type: 'system' },
        { title: 'Monthly Performance Report', url: '#', type: 'report' },
        { title: 'Market Comparison Data', url: '#', type: 'external' }
      ],
      lastUpdated: new Date().toISOString()
    },
    ai: {
      title: 'AI Insights',
      value: '89 Generated',
      description: 'AI-powered analysis insights generated across all portfolio companies',
      breakdown: [
        { label: 'Investment Recommendations', value: '34', percentage: 38, reference: '/ai-agents?filter=investment' },
        { label: 'Risk Assessments', value: '28', percentage: 31, reference: '/ai-agents?filter=risk' },
        { label: 'Market Analysis', value: '18', percentage: 20, reference: '/ai-agents?filter=market' },
        { label: 'Technical Reviews', value: '9', percentage: 11, reference: '/ai-agents?filter=technical' }
      ],
      references: [
        { title: 'AI Agents Dashboard', url: '/ai-agents', type: 'system' },
        { title: 'RAG Intelligence System', url: '/rag-intelligence', type: 'system' },
        { title: 'AI Analysis Reports', url: '#', type: 'report' }
      ],
      lastUpdated: new Date().toISOString()
    },
    security: {
      title: 'System Health',
      value: '98.7%',
      description: 'Overall cybersecurity and system operational health status',
      breakdown: [
        { label: 'Active Systems', value: '5/5', percentage: 100, reference: '/intelligence-center?view=systems' },
        { label: 'Threats Monitored', value: '1,247', percentage: 98.7, reference: '/security?view=threats' },
        { label: 'Data Protection', value: '100%', percentage: 100, reference: '/data-protection' },
        { label: 'API Endpoints', value: '42/43', percentage: 97.7, reference: '/intelligence-center?view=api' }
      ],
      references: [
        { title: 'Security Dashboard', url: '/security', type: 'system' },
        { title: 'Intelligence Center', url: '/intelligence-center', type: 'system' },
        { title: 'Data Protection Status', url: '/data-protection', type: 'system' },
        { title: 'System Health Report', url: '#', type: 'report' }
      ],
      lastUpdated: new Date().toISOString()
    }
  })
  const [insights, setInsights] = useState<QuickInsight[]>([
    {
      title: 'Portfolio Performance',
      value: '+12.5%',
      change: 'vs last month',
      trend: 'up',
      priority: 'high'
    },
    {
      title: 'Security Posture',
      value: '98.7%',
      change: 'system health',
      trend: 'up',
      priority: 'medium'
    },
    {
      title: 'AI Analysis',
      value: '89 insights',
      change: 'this week',
      trend: 'up',
      priority: 'medium'
    },
    {
      title: 'Critical Alerts',
      value: '3 active',
      change: 'require attention',
      trend: 'stable',
      priority: 'high'
    }
  ])
  const [loading, setLoading] = useState(false) // Start with false
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [chartData, setChartData] = useState({
    portfolioGrowth: [
      { month: 'Jan', value: 850, companies: 18 },
      { month: 'Feb', value: 920, companies: 19 },
      { month: 'Mar', value: 1050, companies: 21 },
      { month: 'Apr', value: 1150, companies: 22 },
      { month: 'May', value: 1200, companies: 23 },
      { month: 'Jun', value: 1200, companies: 23 }
    ],
    aiInsights: [
      { category: 'Investment Recs', value: 34, color: '#3B82F6' },
      { category: 'Risk Assessments', value: 28, color: '#EF4444' },
      { category: 'Market Analysis', value: 18, color: '#10B981' },
      { category: 'Technical Reviews', value: 9, color: '#F59E0B' }
    ],
    securityMetrics: [
      { metric: 'Active Systems', value: 100, target: 100 },
      { metric: 'Threat Detection', value: 98.7, target: 95 },
      { metric: 'Data Protection', value: 100, target: 100 },
      { metric: 'API Health', value: 97.7, target: 95 }
    ],
    companyPerformance: [
      { name: 'Veza Inc.', value: 285, growth: 22, risk: 'Low' },
      { name: 'Concentric', value: 200, growth: 18, risk: 'Low' },
      { name: 'Pangea', value: 120, growth: 15, risk: 'Medium' },
      { name: 'Nudge Security', value: 85, growth: 12, risk: 'Medium' },
      { name: 'Others', value: 510, growth: 8, risk: 'Mixed' }
    ]
  })

  const loadExecutiveSummary = async () => {
    try {
      console.log('Refreshing executive summary...')
      
      // Fetch real data in background and update if successful
      const portfolioResponse = await fetch('/api/ballistic-portfolio?action=stats')
      if (portfolioResponse.ok) {
        const portfolioData = await portfolioResponse.json()
        if (portfolioData.success) {
          setSummary(prev => ({
            ...prev,
            totalPortfolioValue: portfolioData.data.analytics.totalPortfolioValue
          }))
        }
      }

      setLastUpdate(new Date())
      console.log('Executive summary refreshed successfully')
    } catch (error) {
      console.error('Failed to refresh executive summary:', error)
      // Keep existing data on error
    }
  }

  useEffect(() => {
    setMounted(true)
    // Load real data in background after component renders
    loadExecutiveSummary()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadExecutiveSummary, 300000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${value.toLocaleString()}`
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      default: return 'border-l-green-500 bg-green-50'
    }
  }

  // Remove blocking loading state - dashboard shows immediately

  return (
    <ExecutiveLayout>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
              <p className="text-sm text-gray-500">
                Last updated: {mounted ? lastUpdate.toLocaleTimeString() : '--:--:--'}
              </p>
            </div>
            <Button onClick={loadExecutiveSummary} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics - Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Portfolio Value Card */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Portfolio Value</p>
                      <p className="text-3xl font-bold text-blue-900">
                        {summary ? formatCurrency(summary.totalPortfolioValue) : '--'}
                      </p>
                      <p className="text-xs text-blue-500 mt-1">Click for details</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                      <ArrowRight className="h-4 w-4 text-blue-400 mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  {detailedMetrics.portfolio.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">{detailedMetrics.portfolio.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Portfolio Breakdown</h4>
                  {detailedMetrics.portfolio.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{item.percentage}%</span>
                        <span className="font-bold">{item.value}</span>
                        {item.reference && (
                          <Button size="sm" variant="ghost" onClick={() => window.open(item.reference, '_blank')}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">References & Sources</h4>
                  {detailedMetrics.portfolio.references.map((ref, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{ref.title}</span>
                        <Badge variant="outline" className="text-xs">{ref.type}</Badge>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => window.open(ref.url, '_blank')}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500">
                  Last updated: {new Date(detailedMetrics.portfolio.lastUpdated).toLocaleString()}
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Monthly Growth Card */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Monthly Growth</p>
                      <p className="text-3xl font-bold text-green-900">
                        +{summary?.monthlyGrowth || 0}%
                      </p>
                      <p className="text-xs text-green-500 mt-1">Click for details</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                      <ArrowRight className="h-4 w-4 text-green-400 mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  {detailedMetrics.growth.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">{detailedMetrics.growth.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Performance Breakdown</h4>
                  {detailedMetrics.growth.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{item.percentage}% of portfolio</span>
                        <span className="font-bold">{item.value}</span>
                        {item.reference && (
                          <Button size="sm" variant="ghost" onClick={() => window.open(item.reference, '_blank')}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">References & Sources</h4>
                  {detailedMetrics.growth.references.map((ref, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{ref.title}</span>
                        <Badge variant="outline" className="text-xs">{ref.type}</Badge>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => window.open(ref.url, '_blank')}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500">
                  Last updated: {new Date(detailedMetrics.growth.lastUpdated).toLocaleString()}
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* AI Insights Card */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">AI Insights</p>
                      <p className="text-3xl font-bold text-purple-900">
                        {summary?.aiInsights || 0}
                      </p>
                      <p className="text-xs text-purple-500 mt-1">Click for details</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Brain className="h-8 w-8 text-purple-600" />
                      <ArrowRight className="h-4 w-4 text-purple-400 mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  {detailedMetrics.ai.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">{detailedMetrics.ai.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">AI Analysis Breakdown</h4>
                  {detailedMetrics.ai.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Cpu className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{item.percentage}%</span>
                        <span className="font-bold">{item.value}</span>
                        {item.reference && (
                          <Button size="sm" variant="ghost" onClick={() => window.open(item.reference, '_blank')}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">References & Sources</h4>
                  {detailedMetrics.ai.references.map((ref, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{ref.title}</span>
                        <Badge variant="outline" className="text-xs">{ref.type}</Badge>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => window.open(ref.url, '_blank')}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500">
                  Last updated: {new Date(detailedMetrics.ai.lastUpdated).toLocaleString()}
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* System Health Card */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">System Health</p>
                      <p className="text-3xl font-bold text-orange-900">
                        {summary?.systemHealth || 0}%
                      </p>
                      <p className="text-xs text-orange-500 mt-1">Click for details</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Shield className="h-8 w-8 text-orange-600" />
                      <ArrowRight className="h-4 w-4 text-orange-400 mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  {detailedMetrics.security.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">{detailedMetrics.security.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">System Status Breakdown</h4>
                  {detailedMetrics.security.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{item.percentage}%</span>
                        <span className="font-bold">{item.value}</span>
                        {item.reference && (
                          <Button size="sm" variant="ghost" onClick={() => window.open(item.reference, '_blank')}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">References & Sources</h4>
                  {detailedMetrics.security.references.map((ref, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{ref.title}</span>
                        <Badge variant="outline" className="text-xs">{ref.type}</Badge>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => window.open(ref.url, '_blank')}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500">
                  Last updated: {new Date(detailedMetrics.security.lastUpdated).toLocaleString()}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Interactive Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Growth Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-600" />
                Portfolio Growth Trend
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedChart(selectedChart === 'growth' ? null : 'growth')}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={chartData.portfolioGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{`${label} 2024`}</p>
                            <p className="text-blue-600">
                              Portfolio Value: ${payload[0].value}M
                            </p>
                            <p className="text-gray-600">
                              Companies: {payload[0].payload.companies}
                            </p>
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => window.open('/ballistic-portfolio', '_blank')}
                            >
                              View Details
                            </Button>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
              {selectedChart === 'growth' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Growth Analysis</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">6-Month Growth:</span>
                      <span className="font-semibold ml-2">+41.2%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">New Companies:</span>
                      <span className="font-semibold ml-2">+5</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Monthly:</span>
                      <span className="font-semibold ml-2">+6.9%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Projection:</span>
                      <span className="font-semibold ml-2 text-green-600">+15% Q3</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Insights Distribution */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                AI Insights Distribution
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedChart(selectedChart === 'ai' ? null : 'ai')}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{payload[0].payload.category}</p>
                            <p style={{ color: payload[0].payload.color }}>
                              Count: {payload[0].value}
                            </p>
                            <p className="text-gray-600">
                              {((payload[0].value / 89) * 100).toFixed(1)}% of total
                            </p>
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => window.open('/ai-agents', '_blank')}
                            >
                              View AI Agents
                            </Button>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <RechartsPieChart data={chartData.aiInsights} cx="50%" cy="50%" outerRadius={100}>
                    {chartData.aiInsights.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {chartData.aiInsights.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.category}: {item.value}</span>
                  </div>
                ))}
              </div>
              {selectedChart === 'ai' && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">AI Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Accuracy Rate:</span>
                      <span className="font-semibold ml-2">94.2%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-semibold ml-2">1.3s avg</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-semibold ml-2">98.9%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Weekly Growth:</span>
                      <span className="font-semibold ml-2 text-green-600">+12%</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security & Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Security Metrics Bar Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Security Health Metrics
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedChart(selectedChart === 'security' ? null : 'security')}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.securityMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{label}</p>
                            <p className="text-green-600">
                              Current: {payload[0].value}%
                            </p>
                            <p className="text-gray-600">
                              Target: {payload[0].payload.target}%
                            </p>
                            <p className={`text-sm ${payload[0].value >= payload[0].payload.target ? 'text-green-600' : 'text-red-600'}`}>
                              {payload[0].value >= payload[0].payload.target ? '✅ Target Met' : '⚠️ Below Target'}
                            </p>
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => window.open('/security', '_blank')}
                            >
                              Security Center
                            </Button>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" fill="#10B981" />
                  <Bar dataKey="target" fill="#E5E7EB" opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
              {selectedChart === 'security' && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Security Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Threats Blocked Today:</span>
                      <span className="font-semibold">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Incidents:</span>
                      <span className="font-semibold text-green-600">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Security Scan:</span>
                      <span className="font-semibold">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compliance Score:</span>
                      <span className="font-semibold text-green-600">98.7%</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Performance Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-orange-600" />
                Top Company Performance
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedChart(selectedChart === 'companies' ? null : 'companies')}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.companyPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{label}</p>
                            <p className="text-blue-600">
                              Valuation: ${data.value}M
                            </p>
                            <p className="text-green-600">
                              Growth: {data.growth}%
                            </p>
                            <p className={`text-sm ${data.risk === 'Low' ? 'text-green-600' : data.risk === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                              Risk Level: {data.risk}
                            </p>
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => window.open(`/company-analysis/${data.name.toLowerCase().replace(' ', '-')}`, '_blank')}
                            >
                              Detailed Analysis
                            </Button>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
              {selectedChart === 'companies' && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Portfolio Insights</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Top Performer:</span>
                      <span className="font-semibold ml-2">Veza Inc.</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fastest Growth:</span>
                      <span className="font-semibold ml-2">Veza (22%)</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Portfolio Diversity:</span>
                      <span className="font-semibold ml-2">5 sectors</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Distribution:</span>
                      <span className="font-semibold ml-2">60% Low Risk</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${getPriorityColor(insight.priority)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.change}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{insight.value}</span>
                        {getTrendIcon(insight.trend)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="destructive">High Priority</Badge>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Security Anomaly Detected</h4>
                  <p className="text-sm text-gray-600">Unusual network traffic pattern identified</p>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">Medium Priority</Badge>
                    <span className="text-sm text-gray-500">4 hours ago</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Portfolio Performance Alert</h4>
                  <p className="text-sm text-gray-600">Company XYZ showing unusual metrics</p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Low Priority</Badge>
                    <span className="text-sm text-gray-500">6 hours ago</span>
                  </div>
                  <h4 className="font-medium text-gray-900">System Maintenance</h4>
                  <p className="text-sm text-gray-600">Scheduled maintenance completed successfully</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                className="h-20 flex-col gap-2" 
                variant="outline"
                onClick={() => window.open('/ballistic-portfolio', '_blank')}
              >
                <Target className="h-6 w-6" />
                <span>Portfolio Analysis</span>
              </Button>
              
              <Button 
                className="h-20 flex-col gap-2" 
                variant="outline"
                onClick={() => window.open('/security', '_blank')}
              >
                <Shield className="h-6 w-6" />
                <span>Security Report</span>
              </Button>
              
              <Button 
                className="h-20 flex-col gap-2" 
                variant="outline"
                onClick={() => window.open('/ai-agents', '_blank')}
              >
                <Brain className="h-6 w-6" />
                <span>AI Insights</span>
              </Button>
              
              <Button 
                className="h-20 flex-col gap-2" 
                variant="outline"
                onClick={() => window.open('/intelligence-center', '_blank')}
              >
                <Activity className="h-6 w-6" />
                <span>System Status</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ExecutiveLayout>
  )
}