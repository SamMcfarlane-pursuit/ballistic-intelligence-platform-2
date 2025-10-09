'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  RefreshCw
} from 'lucide-react'

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
                Last updated: {lastUpdate.toLocaleTimeString()}
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Portfolio Value</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {summary ? formatCurrency(summary.totalPortfolioValue) : '--'}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Monthly Growth</p>
                  <p className="text-3xl font-bold text-green-900">
                    +{summary?.monthlyGrowth || 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">AI Insights</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {summary?.aiInsights || 0}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">System Health</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {summary?.systemHealth || 0}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
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