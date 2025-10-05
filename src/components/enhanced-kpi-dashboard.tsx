"use client"

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  DollarSign,
  Building2,
  AlertTriangle,
  Target,
  Users,
  Zap,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw,
  Filter,
  Download,
  Calendar,
  Star,
  Shield,
  Globe,
  Briefcase,
  Database,
  Lightbulb,
  Rocket,
  Search,
  Bell,
  Settings,
  ChevronRight,
  ChevronDown,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { CounterAnimation } from '@/components/transition-wrapper'

interface KPIData {
  id: string
  title: string
  value: number
  target?: number
  change: number
  changeType: 'positive' | 'negative' | 'neutral'
  unit?: string
  icon: any
  color: string
  bgColor: string
  description: string
  category: 'financial' | 'operational' | 'security' | 'growth'
  trend?: 'up' | 'down' | 'stable'
  historical?: Array<{ date: string; value: number }>
}

interface Insight {
  id: string
  type: 'opportunity' | 'risk' | 'trend' | 'alert'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  relatedMetrics: string[]
  actionable: boolean
  timestamp: Date
}

interface EnhancedKPIDashboardProps {
  metrics: KPIData[]
  timeframe?: 'day' | 'week' | 'month' | 'quarter' | 'year'
  showControls?: boolean
}

export default function EnhancedKPIDashboard({ 
  metrics, 
  timeframe = 'month',
  showControls = true 
}: EnhancedKPIDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'financial' | 'operational' | 'security' | 'growth'>('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe)
  const [sortBy, setSortBy] = useState<'value' | 'change' | 'impact'>('impact')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'detailed'>('grid')
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)
  const [isRealTime, setIsRealTime] = useState(true)
  const [liveUpdates, setLiveUpdates] = useState<{[key: string]: number}>({})

  // Filter metrics by category
  const filteredMetrics = useMemo(() => {
    let filtered = selectedCategory === 'all' 
      ? metrics 
      : metrics.filter(metric => metric.category === selectedCategory)
    
    // Sort metrics
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.value - a.value
        case 'change':
          return Math.abs(b.change) - Math.abs(a.change)
        case 'impact':
          const aImpact = Math.abs(a.change) * (a.target ? a.value / a.target : 1)
          const bImpact = Math.abs(b.change) * (b.target ? b.value / b.target : 1)
          return bImpact - aImpact
        default:
          return 0
      }
    })
    
    return filtered
  }, [metrics, selectedCategory, sortBy])

  // Generate insights based on metrics
  const insights = useMemo(() => {
    const generatedInsights: Insight[] = []
    
    filteredMetrics.forEach(metric => {
      // High growth opportunity
      if (metric.change > 20 && metric.changeType === 'positive') {
        generatedInsights.push({
          id: `${metric.id}-opportunity`,
          type: 'opportunity',
          title: `Strong growth in ${metric.title}`,
          description: `${metric.title} shows exceptional growth of ${metric.change}%, indicating significant market opportunity.`,
          impact: 'high',
          relatedMetrics: [metric.id],
          actionable: true,
          timestamp: new Date()
        })
      }
      
      // Risk alert
      if (metric.change < -10 && metric.changeType === 'negative') {
        generatedInsights.push({
          id: `${metric.id}-risk`,
          type: 'risk',
          title: `Declining performance in ${metric.title}`,
          description: `${metric.title} has decreased by ${Math.abs(metric.change)}%, requiring immediate attention.`,
          impact: 'high',
          relatedMetrics: [metric.id],
          actionable: true,
          timestamp: new Date()
        })
      }
      
      // Target achievement
      if (metric.target && metric.value >= metric.target) {
        generatedInsights.push({
          id: `${metric.id}-achievement`,
          type: 'trend',
          title: `Target achieved for ${metric.title}`,
          description: `${metric.title} has reached its target of ${metric.target}${metric.unit || ''}.`,
          impact: 'medium',
          relatedMetrics: [metric.id],
          actionable: false,
          timestamp: new Date()
        })
      }
    })
    
    return generatedInsights.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 }
      return impactOrder[b.impact] - impactOrder[a.impact]
    })
  }, [filteredMetrics])

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return
    
    const interval = setInterval(() => {
      const updates: {[key: string]: number} = {}
      filteredMetrics.forEach(metric => {
        // Simulate small random changes
        const change = (Math.random() - 0.5) * 0.05
        updates[metric.id] = metric.value + (metric.value * change)
      })
      setLiveUpdates(updates)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [filteredMetrics, isRealTime])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalMetrics = filteredMetrics.length
    const positiveChanges = filteredMetrics.filter(m => m.changeType === 'positive').length
    const negativeChanges = filteredMetrics.filter(m => m.changeType === 'negative').length
    const avgChange = filteredMetrics.reduce((sum, m) => sum + m.change, 0) / totalMetrics
    
    return {
      totalMetrics,
      positiveChanges,
      negativeChanges,
      avgChange: avgChange || 0,
      healthScore: Math.round((positiveChanges / totalMetrics) * 100)
    }
  }, [filteredMetrics])

  // Get icon for insight type
  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity':
        return <Lightbulb className="h-4 w-4 text-emerald-600" />
      case 'risk':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case 'alert':
        return <Bell className="h-4 w-4 text-orange-600" />
      default:
        return <Info className="h-4 w-4 text-slate-600" />
    }
  }

  // Get color for insight impact
  const getImpactColor = (impact: Insight['impact']) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  // Enhanced metric card component
  const EnhancedMetricCard = ({ metric }: { metric: KPIData }) => {
    const isExpanded = expandedMetric === metric.id
    const currentValue = liveUpdates[metric.id] || metric.value
    
    const getChangeIcon = () => {
      switch (metric.changeType) {
        case 'positive':
          return <ArrowUpRight className="h-4 w-4" />
        case 'negative':
          return <ArrowDownRight className="h-4 w-4" />
        default:
          return <Minus className="h-4 w-4" />
      }
    }

    const getChangeColor = () => {
      switch (metric.changeType) {
        case 'positive':
          return 'text-emerald-600'
        case 'negative':
          return 'text-red-600'
        default:
          return 'text-slate-600'
      }
    }

    const getChangeBg = () => {
      switch (metric.changeType) {
        case 'positive':
          return 'bg-emerald-50 border-emerald-200'
        case 'negative':
          return 'bg-red-50 border-red-200'
        default:
          return 'bg-slate-50 border-slate-200'
      }
    }

    return (
      <Card 
        className={`border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${
          isExpanded ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setExpandedMetric(isExpanded ? null : metric.id)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${metric.bgColor} hover:scale-110 transition-transform duration-300`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getChangeBg()} ${getChangeColor()} border text-xs`}>
                <div className="flex items-center gap-1">
                  {getChangeIcon()}
                  {Math.abs(metric.change)}%
                </div>
              </Badge>
              {isRealTime && (
                <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-sm font-medium text-slate-600 mb-1">{metric.title}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold ${metric.color}`}>
                <CounterAnimation value={currentValue} />
                {metric.unit}
              </p>
              {metric.target && (
                <span className="text-sm text-slate-500">
                  of {metric.target}{metric.unit}
                </span>
              )}
            </div>
          </div>

          {metric.target && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-500">Progress</span>
                <span className="text-xs font-medium text-slate-700">
                  {Math.round((currentValue / metric.target) * 100)}%
                </span>
              </div>
              <Progress 
                value={(currentValue / metric.target) * 100} 
                className="h-2"
              />
            </div>
          )}

          <p className="text-xs text-slate-400 leading-relaxed">
            {metric.description}
          </p>

          {/* Historical trend mini chart */}
          {metric.historical && metric.historical.length > 0 && (
            <div className="mt-4 h-12">
              <div className="flex items-end justify-between h-full gap-1">
                {metric.historical.slice(-12).map((data, index) => {
                  const maxValue = Math.max(...metric.historical!.map(d => d.value))
                  const height = (data.value / maxValue) * 100
                  return (
                    <div
                      key={index}
                      className="flex-1 bg-blue-200 rounded-sm transition-all duration-300 hover:bg-blue-300"
                      style={{ height: `${height}%` }}
                      title={`${data.date}: ${data.value}`}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Expanded details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500">Category</span>
                  <p className="font-medium text-slate-700 capitalize">{metric.category}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Trend</span>
                  <p className="font-medium text-slate-700 capitalize">{metric.trend || 'stable'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Target</span>
                  <p className="font-medium text-slate-700">{metric.target || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Performance</span>
                  <p className="font-medium text-slate-700">
                    {metric.target ? Math.round((currentValue / metric.target) * 100) : 'N/A'}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      {showControls && (
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-900">KPI Dashboard</h3>
                <Badge variant="outline" className="text-xs">
                  {filteredMetrics.length} Metrics
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
                  <SelectTrigger className="w-32 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impact">Impact</SelectItem>
                    <SelectItem value="value">Value</SelectItem>
                    <SelectItem value="change">Change</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                  <SelectTrigger className="w-32 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid View</SelectItem>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRealTime(!isRealTime)}
                  className="h-9 text-xs"
                >
                  <Activity className="h-3 w-3 mr-1" />
                  {isRealTime ? 'Live' : 'Static'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{summaryStats.totalMetrics}</div>
              <div className="text-xs text-slate-600">Total Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{summaryStats.positiveChanges}</div>
              <div className="text-xs text-slate-600">Positive Trends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summaryStats.negativeChanges}</div>
              <div className="text-xs text-slate-600">Negative Trends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {summaryStats.avgChange > 0 ? '+' : ''}{summaryStats.avgChange.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-600">Avg Change</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">{summaryStats.healthScore}%</div>
              <div className="text-xs text-slate-600">Health Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights ({insights.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="space-y-4">
          <div className={`grid ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
            viewMode === 'list' ? 'grid-cols-1' :
            'grid-cols-1 lg:grid-cols-2'
          } gap-4`}>
            {filteredMetrics.map((metric) => (
              <EnhancedMetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-slate-50">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                            {insight.impact.toUpperCase()}
                          </Badge>
                          {insight.actionable && (
                            <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                              Actionable
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          {insight.timestamp.toLocaleDateString()} at {insight.timestamp.toLocaleTimeString()}
                        </div>
                        {insight.actionable && (
                          <Button size="sm" className="h-7 text-xs">
                            Take Action
                          </Button>
                        )}
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