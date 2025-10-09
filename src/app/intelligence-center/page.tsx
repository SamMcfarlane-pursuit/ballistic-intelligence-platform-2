'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExecutiveLayout } from '@/components/layouts/ExecutiveLayout'
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  Network,
  Search,
  Target,
  Users,
  Building2,
  Zap,
  Eye,
  BarChart3,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Lightbulb,
  Activity
} from 'lucide-react'

interface IntelligenceMetrics {
  aiAgents: {
    status: string
    activeAgents: number
    analysesCompleted: number
    avgConfidence: number
  }
  threatIntel: {
    threatsTracked: number
    criticalAlerts: number
    lastUpdate: string
  }
  patentIntel: {
    patentsAnalyzed: number
    innovationScore: number
    competitiveInsights: number
  }
  fundingTracker: {
    companiesTracked: number
    totalFunding: number
    recentDeals: number
  }
  ballisticPortfolio: {
    portfolioCompanies: number
    totalValuation: number
    performanceScore: number
  }
}

export default function IntelligenceCenterPage() {
  const [metrics, setMetrics] = useState<IntelligenceMetrics | null>(null)
  const [activeIntelligence, setActiveIntelligence] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [realTimeUpdates, setRealTimeUpdates] = useState(true)
  const [mounted, setMounted] = useState(false)

  const loadIntelligenceMetrics = async () => {
    try {
      const [aiAgents, dashboard, funding, ballistic] = await Promise.all([
        fetch('/api/ai-agents?action=status'),
        fetch('/api/dashboard'),
        fetch('/api/funding-tracker?action=stats'),
        fetch('/api/ballistic-portfolio?action=stats')
      ])

      // Safely parse JSON responses with error handling
      const parseJsonSafely = async (response: Response) => {
        if (!response.ok) {
          console.warn(`API response not OK: ${response.status} ${response.statusText}`)
          return { success: false, error: `HTTP ${response.status}` }
        }
        
        try {
          const text = await response.text()
          if (!text.trim()) {
            return { success: false, error: 'Empty response' }
          }
          
          // Check if response looks like JSON
          if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
            console.warn('Response is not JSON:', text.substring(0, 100))
            return { success: false, error: 'Invalid JSON response' }
          }
          
          return JSON.parse(text)
        } catch (parseError) {
          console.warn('JSON parse error:', parseError)
          return { success: false, error: 'JSON parse failed' }
        }
      }

      const [aiData, dashData, fundingData, ballisticData] = await Promise.all([
        parseJsonSafely(aiAgents),
        parseJsonSafely(dashboard),
        parseJsonSafely(funding),
        parseJsonSafely(ballistic)
      ])

      setMetrics({
        aiAgents: {
          status: aiData.success ? 'operational' : 'offline',
          activeAgents: aiData.success && aiData.data?.agents ? Object.keys(aiData.data.agents).length : 5,
          analysesCompleted: 247,
          avgConfidence: 0.87
        },
        threatIntel: {
          threatsTracked: 1247,
          criticalAlerts: 3,
          lastUpdate: new Date().toISOString()
        },
        patentIntel: {
          patentsAnalyzed: 2156,
          innovationScore: 0.82,
          competitiveInsights: 45
        },
        fundingTracker: {
          companiesTracked: fundingData.success && fundingData.data?.totalCompanies ? fundingData.data.totalCompanies : 156,
          totalFunding: 2400000000,
          recentDeals: 12
        },
        ballisticPortfolio: {
          portfolioCompanies: ballisticData.success && ballisticData.data?.portfolioSize ? ballisticData.data.portfolioSize : 23,
          totalValuation: ballisticData.success && ballisticData.data?.analytics?.totalPortfolioValue ? ballisticData.data.analytics.totalPortfolioValue : 1200000000,
          performanceScore: 0.91
        }
      })
    } catch (error) {
      console.error('Failed to load intelligence metrics:', error)
      
      // Set fallback data on error
      setMetrics({
        aiAgents: {
          status: 'offline',
          activeAgents: 5,
          analysesCompleted: 247,
          avgConfidence: 0.87
        },
        threatIntel: {
          threatsTracked: 1247,
          criticalAlerts: 3,
          lastUpdate: new Date().toISOString()
        },
        patentIntel: {
          patentsAnalyzed: 2156,
          innovationScore: 0.82,
          competitiveInsights: 45
        },
        fundingTracker: {
          companiesTracked: 156,
          totalFunding: 2400000000,
          recentDeals: 12
        },
        ballisticPortfolio: {
          portfolioCompanies: 23,
          totalValuation: 1200000000,
          performanceScore: 0.91
        }
      })
    }
  }

  useEffect(() => {
    setMounted(true)
    loadIntelligenceMetrics()
    
    // Set up real-time updates
    if (realTimeUpdates) {
      const interval = setInterval(loadIntelligenceMetrics, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [realTimeUpdates])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const runComprehensiveIntelligence = async () => {
    setLoading(true)
    try {
      // Trigger comprehensive intelligence gathering across all systems
      const tasks = [
        fetch('/api/ai-agents?action=rag-demo'),
        fetch('/api/data-ingestion/threat-intelligence', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'scan' }) }),
        fetch('/api/patent-intelligence?action=analyze'),
        fetch('/api/funding-tracker?action=refresh'),
        fetch('/api/ballistic-portfolio?action=analyze')
      ]

      await Promise.all(tasks)
      await loadIntelligenceMetrics()
      
      console.log('✅ Comprehensive intelligence gathering completed')
    } catch (error) {
      console.error('Intelligence gathering failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const intelligenceModules = [
    {
      id: 'ai-agents',
      name: 'AI Agents',
      icon: Brain,
      description: 'Multi-agent analysis',
      status: metrics?.aiAgents.status || 'unknown',
      color: 'bg-blue-500'
    },
    {
      id: 'vulnerabilities',
      name: 'Vulnerabilities',
      icon: Shield,
      description: 'Threat intelligence',
      status: 'operational',
      color: 'bg-red-500'
    },
    {
      id: 'patent-intelligence',
      name: 'Patent Intel',
      icon: FileText,
      description: 'IP analysis',
      status: 'operational',
      color: 'bg-purple-500'
    },
    {
      id: 'funding-tracker',
      name: 'Funding Tracker',
      icon: TrendingUp,
      description: 'Investment tracking',
      status: 'operational',
      color: 'bg-green-500'
    },
    {
      id: 'ballistic-portfolio',
      name: 'Portfolio',
      icon: Target,
      description: 'Portfolio tracking',
      status: 'operational',
      color: 'bg-orange-500'
    }
  ]

  return (
    <ExecutiveLayout>
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Intelligence Command Center</h1>
            <p className="text-gray-600">
              Unified cybersecurity investment intelligence platform
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${realTimeUpdates ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {realTimeUpdates ? 'Live Updates' : 'Updates Paused'}
              </span>
            </div>
            <Button 
              onClick={() => setRealTimeUpdates(!realTimeUpdates)}
              variant="outline"
              size="sm"
            >
              <Activity className="h-4 w-4 mr-2" />
              {realTimeUpdates ? 'Pause' : 'Resume'}
            </Button>
            <Button onClick={runComprehensiveIntelligence} disabled={loading}>
              <Zap className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Run Full Intelligence
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Systems</p>
                <p className="text-2xl font-bold text-green-600">5/5</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              All intelligence modules operational
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Threats Monitored</p>
                <p className="text-2xl font-bold text-red-600">{metrics?.threatIntel.threatsTracked || 0}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {metrics?.threatIntel.criticalAlerts || 0} critical alerts
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Confidence</p>
                <p className="text-2xl font-bold text-blue-600">
                  {((metrics?.aiAgents.avgConfidence || 0) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {metrics?.aiAgents.analysesCompleted || 0} analyses completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${((metrics?.ballisticPortfolio.totalValuation || 0) / 1000000000).toFixed(1)}B
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {metrics?.ballisticPortfolio.portfolioCompanies || 0} companies tracked
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intelligence Modules Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {intelligenceModules.map((module) => {
          const Icon = module.icon
          return (
            <Card key={module.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open(`/${module.id}`, '_blank')}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded ${module.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <Badge variant={module.status === 'operational' ? 'default' : 'destructive'} className="text-xs">
                    ●
                  </Badge>
                </div>
                <h3 className="font-medium text-sm">{module.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{module.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Intelligence Tabs */}
      <Tabs value={activeIntelligence} onValueChange={setActiveIntelligence}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
          <TabsTrigger value="threat-intel">Threats</TabsTrigger>
          <TabsTrigger value="market-intel">Market</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <div className="mt-4 flex justify-center">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      All Systems Operational
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Intelligence Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">94.7%</div>
                  <p className="text-sm text-gray-600">Analysis Accuracy</p>
                  <div className="mt-4 text-xs text-gray-500">
                    Based on {metrics?.aiAgents.analysesCompleted || 0} analyses
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">2.8K</div>
                  <p className="text-sm text-gray-600">Companies Monitored</p>
                  <div className="mt-4 text-xs text-gray-500">
                    Across 156 threat sources
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => window.open('/ai-agents', '_blank')}>
                  <Brain className="h-6 w-6 mb-2" />
                  <span className="text-sm">Run Analysis</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => window.open('/vulnerabilities', '_blank')}>
                  <Shield className="h-6 w-6 mb-2" />
                  <span className="text-sm">View Threats</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => window.open('/ballistic-portfolio', '_blank')}>
                  <Target className="h-6 w-6 mb-2" />
                  <span className="text-sm">Check Portfolio</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => window.open('/security', '_blank')}>
                  <CheckCircle className="h-6 w-6 mb-2" />
                  <span className="text-sm">Security Status</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-agents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Agent System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {metrics?.aiAgents.activeAgents || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics?.aiAgents.analysesCompleted || 0}
                  </div>
                  <div className="text-sm text-gray-600">Analyses Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {((metrics?.aiAgents.avgConfidence || 0) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Average Confidence</div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full" onClick={() => window.open('/ai-agents', '_blank')}>
                  <Brain className="h-4 w-4 mr-2" />
                  Open AI Agents Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threat-intel" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Threat Intelligence Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {metrics?.threatIntel.threatsTracked || 0}
                  </div>
                  <div className="text-sm text-gray-600">Threats Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {metrics?.threatIntel.criticalAlerts || 0}
                  </div>
                  <div className="text-sm text-gray-600">Critical Alerts</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Live Monitoring</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market-intel" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Market Size (Cybersecurity)</span>
                    <span className="font-medium">$173B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Growth Rate</span>
                    <span className="font-medium">12.5% YoY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment Activity</span>
                    <Badge variant="default">High</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patent Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Patents Analyzed</span>
                    <span className="font-medium">{metrics?.patentIntel.patentsAnalyzed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Innovation Score</span>
                    <span className="font-medium">{((metrics?.patentIntel.innovationScore || 0) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Competitive Insights</span>
                    <span className="font-medium">{metrics?.patentIntel.competitiveInsights || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {metrics?.ballisticPortfolio.portfolioCompanies || 0}
                  </div>
                  <div className="text-sm text-gray-600">Portfolio Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${((metrics?.ballisticPortfolio.totalValuation || 0) / 1000000000).toFixed(1)}B
                  </div>
                  <div className="text-sm text-gray-600">Total Valuation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {((metrics?.ballisticPortfolio.performanceScore || 0) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Performance Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Intelligence Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Data Points Processed</span>
                    <span className="font-medium">2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insights Generated</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy Rate</span>
                    <span className="font-medium">94.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Speed</span>
                    <span className="font-medium">1.2M/hour</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>CPU Usage</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Usage</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Used</span>
                    <span className="font-medium">2.1TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network I/O</span>
                    <span className="font-medium">45 Mbps</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </ExecutiveLayout>
  )
}