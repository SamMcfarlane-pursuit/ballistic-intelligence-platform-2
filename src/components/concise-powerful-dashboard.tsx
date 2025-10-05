"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  Building2, 
  AlertTriangle, 
  TrendingUp,
  Brain,
  Search,
  Bell,
  Activity,
  Map,
  Target,
  Users,
  Zap,
  Eye,
  Clock,
  BarChart3,
  Rocket,
  Award,
  Lightbulb,
  Globe,
  Briefcase,
  Database,
  ChevronRight,
  Plus,
  Filter,
  Download,
  Settings
} from 'lucide-react'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { useAuth } from '@/components/auth-provider'
import { EnhancedLoadingScreen } from '@/components/enhanced-loading-states'
import { TransitionWrapper, CounterAnimation } from '@/components/transition-wrapper'
import { useResponsive } from '@/components/responsive-utils'
import { useToast } from '@/hooks/use-toast'

interface QuickAction {
  id: string
  label: string
  icon: any
  description: string
  color: string
  action: () => void
}

interface KeyMetric {
  id: string
  title: string
  value: number
  target: number
  change: number
  changeType: 'positive' | 'negative'
  unit: string
  icon: any
  color: string
  bgColor: string
  description: string
  trend: 'up' | 'down' | 'stable'
}

export default function ConcisePowerfulDashboard() {
  const { stats, fundingOverTime, fundingByStage, vulnerabilities, loading, error } = useDashboardData()
  const { user, hasPermission } = useAuth()
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const { toast } = useToast()
  const [currentTime, setCurrentTime] = useState('')

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Key metrics - focused on most important KPIs
  const keyMetrics: KeyMetric[] = [
    {
      id: 'total-investments',
      title: "Total Investments",
      value: stats.totalInvestment,
      target: 50,
      change: 2.4,
      changeType: 'positive',
      unit: 'M',
      icon: DollarSign,
      color: "text-slate-700",
      bgColor: "bg-slate-100",
      description: "Capital deployed across portfolio",
      trend: 'up'
    },
    {
      id: 'portfolio-companies',
      title: "Portfolio Companies",
      value: stats.companiesTracked,
      target: 10,
      change: 16.7,
      changeType: 'positive',
      unit: '',
      icon: Building2,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      description: "Active cybersecurity investments",
      trend: 'up'
    },
    {
      id: 'quarterly-return',
      title: "Quarterly Return",
      value: 12,
      target: 15,
      change: 12,
      changeType: 'positive',
      unit: '%',
      icon: TrendingUp,
      color: "text-emerald-700",
      bgColor: "bg-emerald-100",
      description: "Year-over-year growth",
      trend: 'up'
    },
    {
      id: 'active-threats',
      title: "Active Threats",
      value: stats.newVulnerabilities,
      change: -15,
      changeType: 'positive',
      unit: '',
      icon: AlertTriangle,
      color: "text-red-700",
      bgColor: "bg-red-100",
      description: "Security threats monitored",
      trend: 'down'
    }
  ]

  // Quick actions for common tasks
  const quickActions: QuickAction[] = [
    {
      id: 'new-analysis',
      label: 'New Analysis',
      icon: Brain,
      description: 'AI-powered company research',
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
      action: () => toast({ title: "AI Analysis", description: "Starting new company analysis..." })
    },
    {
      id: 'deal-flow',
      label: 'Deal Flow',
      icon: Target,
      description: 'Review investment opportunities',
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
      action: () => toast({ title: "Deal Flow", description: "Loading investment pipeline..." })
    },
    {
      id: 'threat-intel',
      label: 'Threat Intel',
      icon: Zap,
      description: 'Security landscape monitoring',
      color: 'bg-red-50 hover:bg-red-100 text-red-700',
      action: () => toast({ title: "Threat Intelligence", description: "Updating threat landscape..." })
    },
    {
      id: 'funding-trends',
      label: 'Funding Trends',
      icon: BarChart3,
      description: 'Market dynamics analysis',
      color: 'bg-green-50 hover:bg-green-100 text-green-700',
      action: () => toast({ title: "Funding Trends", description: "Loading market analysis..." })
    }
  ]

  // Recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'investment',
      title: 'New Investment: SecureFlow AI',
      description: 'Series A funding round completed',
      time: '2 hours ago',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'threat',
      title: 'Critical Vulnerability Detected',
      description: 'Zero-day exploit in supply chain',
      time: '4 hours ago',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      id: '3',
      type: 'analysis',
      title: 'AI Analysis Complete',
      description: 'CyberDefend Corp investment recommendation',
      time: '6 hours ago',
      icon: Brain,
      color: 'text-blue-600'
    },
    {
      id: '4',
      type: 'conference',
      title: 'RSAC 2024 Insights',
      description: 'Key trends and opportunities identified',
      time: '1 day ago',
      icon: Globe,
      color: 'text-purple-600'
    }
  ]

  if (loading) {
    return <EnhancedLoadingScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Connection Interrupted</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            Reconnect to Platform
          </Button>
        </div>
      </div>
    )
  }

  return (
    <TransitionWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Ballistic Intelligence</h1>
                  <p className="text-sm text-slate-500">Strategic Overview</p>
                </div>
              </div>
              
              {/* Streamlined Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {quickActions.slice(0, 3).map((action) => (
                  <Button
                    key={action.id}
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    onClick={action.action}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{currentTime}</p>
              </div>
              
              {/* Quick Actions Dropdown */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Bell className="h-4 w-4 mr-2" />
                  Alerts
                  <Badge className="ml-2 h-5 w-5 p-0 text-xs">3</Badge>
                </Button>
                
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Executive Summary</h2>
                <p className="text-blue-100">Portfolio performance and strategic overview</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">$43M</div>
                <div className="text-blue-100 text-sm">Total AUM</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">+24%</div>
                <div className="text-blue-100 text-sm">YTD Growth</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">6</div>
                <div className="text-blue-100 text-sm">Active Deals</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">18.5%</div>
                <div className="text-blue-100 text-sm">Portfolio ROI</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">3</div>
                <div className="text-blue-100 text-sm">Threats Monitored</div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {keyMetrics.map((metric, index) => (
              <Card key={metric.id} className="border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${metric.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={metric.changeType === 'positive' ? 'default' : 'destructive'}
                        className="text-xs font-semibold mb-1"
                      >
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          metric.trend === 'up' ? 'bg-green-500' : 
                          metric.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-xs text-slate-400">
                          {metric.trend === 'up' ? 'Up' : 
                           metric.trend === 'down' ? 'Down' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                      {metric.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <CounterAnimation 
                        value={metric.value} 
                        className="text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                      />
                      <span className="text-sm font-semibold text-slate-500">{metric.unit}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                      {metric.description}
                    </p>
                    
                    {/* Progress bar for target achievement */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-medium text-slate-700">
                          {Math.round((metric.value / metric.target) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            (metric.value / metric.target) >= 1 ? 'bg-green-500' :
                            (metric.value / metric.target) >= 0.8 ? 'bg-blue-500' :
                            (metric.value / metric.target) >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actionable insight */}
                    <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-600">
                        {metric.id === 'total-investments' && '📈 On track to exceed annual target by 8%'}
                        {metric.id === 'portfolio-companies' && '🎯 4 more companies needed to reach goal'}
                        {metric.id === 'quarterly-return' && '🚀 Outperforming market benchmark by 4%'}
                        {metric.id === 'active-threats' && '🛡️ Threat level decreased by 15% this month'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Custom Action
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`h-auto p-6 flex flex-col items-center gap-3 ${action.color} border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
                  onClick={action.action}
                >
                  <div className={`p-3 rounded-full bg-white/20 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm group-hover:text-white transition-colors">{action.label}</p>
                    <p className="text-xs opacity-75 mt-1 group-hover:opacity-100 transition-opacity">{action.description}</p>
                  </div>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Button>
              ))}
            </div>
            
            {/* Additional Quick Tools */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: 'New Report', icon: BarChart3, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                { label: 'Team Chat', icon: Users, color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                { label: 'Calendar', icon: Clock, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                { label: 'Documents', icon: Database, color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
                { label: 'Search', icon: Search, color: 'bg-slate-50 text-slate-700 hover:bg-slate-100' },
                { label: 'Help', icon: Lightbulb, color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' }
              ].map((tool, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`h-auto p-3 flex flex-col items-center gap-2 ${tool.color} border-0`}
                >
                  <tool.icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{tool.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="overview" className="text-sm font-medium">Overview</TabsTrigger>
              <TabsTrigger value="analytics" className="text-sm font-medium">Analytics</TabsTrigger>
              <TabsTrigger value="activities" className="text-sm font-medium">Activities</TabsTrigger>
              <TabsTrigger value="insights" className="text-sm font-medium">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Funding Overview */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Funding Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <p className="text-sm text-slate-600 font-medium">This Quarter</p>
                          <p className="text-2xl font-bold text-blue-700">$12.5M</p>
                          <p className="text-xs text-green-600 mt-1">+15% vs last</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                          <p className="text-sm text-slate-600 font-medium">YTD Growth</p>
                          <p className="text-2xl font-bold text-green-700">+24%</p>
                          <p className="text-xs text-green-600 mt-1">Above target</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700">Deals Closed</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">6</span>
                            <Badge className="text-xs bg-green-100 text-green-700">+2</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700">Avg. Deal Size</span>
                          <span className="font-semibold text-slate-900">$2.1M</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700">Pipeline Value</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">$45M</span>
                            <Badge className="text-xs bg-blue-100 text-blue-700">+12%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Threat Intelligence */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-red-600" />
                      Threat Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                          <p className="text-sm text-slate-600 font-medium">Active Threats</p>
                          <p className="text-2xl font-bold text-red-700">{stats.newVulnerabilities}</p>
                          <p className="text-xs text-red-600 mt-1">Monitoring</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                          <p className="text-sm text-slate-600 font-medium">Risk Level</p>
                          <p className="text-2xl font-bold text-orange-700">Medium</p>
                          <p className="text-xs text-orange-600 mt-1">Controlled</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700">Critical</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-red-600">1</span>
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700">High</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-orange-600">2</span>
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700">Medium</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-yellow-600">5</span>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activities" className="space-y-6">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                        <div className={`p-2 rounded-lg ${
                          activity.color === 'text-green-600' ? 'bg-green-50' :
                          activity.color === 'text-red-600' ? 'bg-red-50' :
                          activity.color === 'text-blue-600' ? 'bg-blue-50' :
                          'bg-purple-50'
                        }`}>
                          <activity.icon className={`h-5 w-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-900 mb-1">{activity.title}</p>
                          <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                          <p className="text-xs text-slate-400">{activity.time}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 mt-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI-Generated Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-blue-900 mb-2">Investment Opportunity</p>
                          <p className="text-sm text-blue-700 leading-relaxed">AI analysis identifies 3 high-potential companies in cloud security sector with strong growth indicators and market positioning.</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className="text-xs bg-blue-100 text-blue-700">High Priority</Badge>
                            <span className="text-xs text-blue-600">2 hours ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-400 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-green-900 mb-2">Market Trend</p>
                          <p className="text-sm text-green-700 leading-relaxed">Cybersecurity funding increased 28% this quarter, with focus on AI-driven security solutions and zero-trust architectures.</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className="text-xs bg-green-100 text-green-700">Trending</Badge>
                            <span className="text-xs text-green-600">4 hours ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl border-l-4 border-orange-400 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-orange-900 mb-2">Risk Alert</p>
                          <p className="text-sm text-orange-700 leading-relaxed">Supply chain vulnerabilities detected in 2 portfolio companies. Immediate action recommended to mitigate potential impact.</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className="text-xs bg-orange-100 text-orange-700">Action Required</Badge>
                            <span className="text-xs text-orange-600">6 hours ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Performance Overview Chart */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Simple Bar Chart Representation */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-slate-700">Monthly Performance</h3>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">ROI</Badge>
                          <Badge variant="outline" className="text-xs">IRR</Badge>
                          <Badge variant="outline" className="text-xs">MOIC</Badge>
                        </div>
                      </div>
                      
                      {/* Visual representation of performance data */}
                      <div className="space-y-3">
                        {[
                          { month: 'Jan', roi: 15.2, irr: 20.1, moic: 1.8 },
                          { month: 'Feb', roi: 16.1, irr: 21.3, moic: 1.9 },
                          { month: 'Mar', roi: 16.8, irr: 22.0, moic: 1.9 },
                          { month: 'Apr', roi: 17.2, irr: 22.8, moic: 2.0 },
                          { month: 'May', roi: 17.9, irr: 23.5, moic: 2.0 },
                          { month: 'Jun', roi: 18.5, irr: 24.2, moic: 2.1 }
                        ].map((data, index) => (
                          <div key={data.month} className="flex items-center gap-4">
                            <span className="text-xs font-medium text-slate-600 w-8">{data.month}</span>
                            <div className="flex-1 flex items-center gap-2">
                              <div className="flex-1 bg-slate-200 rounded-full h-2 relative overflow-hidden">
                                <div 
                                  className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-700"
                                  style={{ width: `${(data.roi / 25) * 100}%` }}
                                ></div>
                              </div>
                              <div className="flex-1 bg-slate-200 rounded-full h-2 relative overflow-hidden">
                                <div 
                                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-700"
                                  style={{ width: `${(data.irr / 30) * 100}%` }}
                                ></div>
                              </div>
                              <div className="flex-1 bg-slate-200 rounded-full h-2 relative overflow-hidden">
                                <div 
                                  className="absolute top-0 left-0 h-full bg-purple-500 rounded-full transition-all duration-700"
                                  style={{ width: `${(data.moic / 3) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="text-xs font-medium text-slate-700">
                              {data.roi}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Key Metrics Summary */}
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-green-200 rounded-lg">
                            <Award className="h-5 w-5 text-green-700" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-900">ROI</p>
                            <p className="text-xs text-green-700">Return on Investment</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-900">18.5%</p>
                          <p className="text-xs text-green-700">+2.3% this month</p>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-green-700">Target</span>
                            <span className="font-medium text-green-900">20%</span>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div className="h-2 bg-green-600 rounded-full" style={{ width: '92.5%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-200 rounded-lg">
                            <Rocket className="h-5 w-5 text-blue-700" />
                          </div>
                          <div>
                            <p className="font-semibold text-blue-900">IRR</p>
                            <p className="text-xs text-blue-700">Internal Rate of Return</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-900">24.2%</p>
                          <p className="text-xs text-blue-700">+1.8% this month</p>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-blue-700">Target</span>
                            <span className="font-medium text-blue-900">25%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div className="h-2 bg-blue-600 rounded-full" style={{ width: '96.8%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Eye className="h-5 w-5 text-indigo-600" />
                      Portfolio Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-700">Companies Performing</span>
                            <p className="text-xs text-slate-500">Above target threshold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-700">83%</p>
                          <p className="text-xs text-green-600">Above Target</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-700">At Risk</span>
                            <p className="text-xs text-slate-500">Requires attention</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-orange-700">17%</p>
                          <p className="text-xs text-orange-600">Monitoring</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-700">Exits This Year</span>
                            <p className="text-xs text-slate-500">Successful exits</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-700">2</p>
                          <p className="text-xs text-blue-600">On Track</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Investment Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <p className="text-sm text-slate-600 font-medium">Total AUM</p>
                        <p className="text-3xl font-bold text-purple-700">$43M</p>
                        <p className="text-xs text-purple-600 mt-1">+24% YTD</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-slate-600">Avg Deal Size</p>
                          <p className="text-lg font-bold text-blue-700">$2.1M</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-xs text-slate-600">Success Rate</p>
                          <p className="text-lg font-bold text-green-700">87%</p>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700">Pipeline Value</span>
                          <span className="font-semibold text-slate-900">$45M</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TransitionWrapper>
  )
}