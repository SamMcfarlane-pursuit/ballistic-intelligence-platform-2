"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Filter,
  RefreshCw,
  Download,
  Share2,
  Calendar,
  DollarSign,
  Building2,
  Users,
  Star,
  Eye,
  ThumbsUp,
  MessageSquare,
  Activity,
  Database,
  Cpu,
  Network
} from 'lucide-react'

interface InsightSource {
  id: string
  name: string
  type: 'funding_data' | 'market_trends' | 'vulnerability_intel' | 'conference_data' | 'team_activity'
  confidence: number
  last_updated: string
  data_points: number
}

interface ActionableInsight {
  id: string
  title: string
  description: string
  category: 'investment' | 'risk' | 'opportunity' | 'efficiency' | 'strategic'
  priority: 'critical' | 'high' | 'medium' | 'low'
  confidence: number
  timeframe: string
  business_impact: {
    financial: string
    operational: string
    strategic: string
  }
  action_steps: string[]
  success_metrics: string[]
  sources: string[]
  related_insights: string[]
  automation_potential: 'high' | 'medium' | 'low'
}

interface InsightEngine {
  total_insights_generated: number
  insights_acted_upon: number
  success_rate: number
  avg_time_to_action: string
  automation_level: number
  processing_speed: string
  data_sources: number
}

export default function ActionableInsightsEngine() {
  const [insights, setInsights] = useState<ActionableInsight[]>([])
  const [sources, setSources] = useState<InsightSource[]>([])
  const [engine, setEngine] = useState<InsightEngine | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [realTimeProcessing, setRealTimeProcessing] = useState(false)

  useEffect(() => {
    const fetchInsightsData = async () => {
      try {
        setLoading(true)
        setRealTimeProcessing(true)
        
        // Simulate API call for insights engine data
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock insight sources
        const mockSources: InsightSource[] = [
          {
            id: '1',
            name: 'Funding Rounds Database',
            type: 'funding_data',
            confidence: 94,
            last_updated: '2 minutes ago',
            data_points: 15420
          },
          {
            id: '2',
            name: 'Market Trends Analysis',
            type: 'market_trends',
            confidence: 87,
            last_updated: '5 minutes ago',
            data_points: 8750
          },
          {
            id: '3',
            name: 'Vulnerability Intelligence Feed',
            type: 'vulnerability_intel',
            confidence: 92,
            last_updated: '1 minute ago',
            data_points: 3280
          },
          {
            id: '4',
            name: 'Conference Activity Monitor',
            type: 'conference_data',
            confidence: 89,
            last_updated: '10 minutes ago',
            data_points: 2150
          },
          {
            id: '5',
            name: 'Team Collaboration Platform',
            type: 'team_activity',
            confidence: 95,
            last_updated: '30 seconds ago',
            data_points: 6420
          }
        ]

        // Mock actionable insights
        const mockInsights: ActionableInsight[] = [
          {
            id: '1',
            title: 'Emerging AI Security Investment Pattern',
            description: 'Analysis of 47 recent funding rounds reveals 3.2x increase in AI security investments, with 5 companies showing strong Series B potential within 6 months',
            category: 'investment',
            priority: 'high',
            confidence: 91,
            timeframe: '6 months',
            business_impact: {
              financial: '$45M potential portfolio value',
              operational: 'Streamlined deal sourcing process',
              strategic: 'First-mover advantage in AI security'
            },
            action_steps: [
              'Prioritize due diligence for top 3 AI security companies',
              'Allocate $15M from Q4 investment budget',
              'Establish AI security investment thesis document'
            ],
            success_metrics: [
              'Secure 2-3 investments in target companies',
              'Achieve 25% IRR on AI security portfolio',
              'Complete due diligence within 45 days'
            ],
            sources: ['Funding Rounds Database', 'Market Trends Analysis'],
            related_insights: ['2', '4'],
            automation_potential: 'high'
          },
          {
            id: '2',
            title: 'Critical Vulnerability Risk Assessment',
            description: 'Real-time monitoring detected 3 critical vulnerabilities in portfolio companies requiring immediate attention to prevent potential data breaches',
            category: 'risk',
            priority: 'critical',
            confidence: 96,
            timeframe: 'Immediate',
            business_impact: {
              financial: 'Potential $12M loss from breaches',
              operational: 'Disruption to portfolio operations',
              strategic: 'Reputational damage to fund'
            },
            action_steps: [
              'Immediate security assessment for affected companies',
              'Deploy emergency security patches',
              'Establish 24/7 monitoring for 30 days'
            ],
            success_metrics: [
              '100% vulnerability remediation within 72 hours',
              'Zero security incidents in next 30 days',
              'Security posture improvement verification'
            ],
            sources: ['Vulnerability Intelligence Feed', 'Team Collaboration Platform'],
            related_insights: ['1', '5'],
            automation_potential: 'high'
          },
          {
            id: '3',
            title: 'Conference ROI Optimization Opportunity',
            description: 'RSAC 2024 analysis shows 68% higher deal closure rate for companies with personalized conference strategies, presenting $25M opportunity',
            category: 'opportunity',
            priority: 'high',
            confidence: 88,
            timeframe: '3 months',
            business_impact: {
              financial: '$25M additional deal flow',
              operational: 'Improved conference efficiency',
              strategic: 'Enhanced industry positioning'
            },
            action_steps: [
              'Develop personalized conference engagement strategy',
              'Assign dedicated conference team members',
              'Implement real-time lead scoring system'
            ],
            success_metrics: [
              'Increase conference-sourced deals by 40%',
              'Reduce cost-per-acquisition by 25%',
              'Achieve 75% follow-up meeting rate'
            ],
            sources: ['Conference Activity Monitor', 'Market Trends Analysis'],
            related_insights: ['4'],
            automation_potential: 'medium'
          },
          {
            id: '4',
            title: 'Team Collaboration Efficiency Gain',
            description: 'AI analysis of team communication patterns reveals 35% opportunity for improved decision-making speed through structured collaboration workflows',
            category: 'efficiency',
            priority: 'medium',
            confidence: 84,
            timeframe: '2 months',
            business_impact: {
              financial: '$1.2M annual productivity savings',
              operational: 'Faster investment decisions',
              strategic: 'Improved team scalability'
            },
            action_steps: [
              'Implement structured decision-making framework',
              'Deploy AI-powered collaboration tools',
              'Establish weekly sync optimization'
            ],
            success_metrics: [
              'Reduce decision time by 35%',
              'Increase team productivity score by 25%',
              'Improve cross-functional collaboration'
            ],
            sources: ['Team Collaboration Platform', 'Funding Rounds Database'],
            related_insights: ['1', '3'],
            automation_potential: 'high'
          },
          {
            id: '5',
            title: 'Market Expansion Strategic Initiative',
            description: 'Comprehensive analysis indicates strong opportunity for expansion into European cybersecurity market with 45% projected growth over 18 months',
            category: 'strategic',
            priority: 'medium',
            confidence: 79,
            timeframe: '18 months',
            business_impact: {
              financial: '$80M European market opportunity',
              operational: 'Established European presence',
              strategic: 'Geographic diversification'
            },
            action_steps: [
              'Conduct European market due diligence',
              'Establish local partnerships and networks',
              'Allocate dedicated European investment team'
            ],
            success_metrics: [
              'Secure 5 European investments within 18 months',
              'Achieve 20% portfolio allocation to Europe',
              'Establish local office in key European hub'
            ],
            sources: ['Market Trends Analysis', 'Funding Rounds Database'],
            related_insights: ['1', '2'],
            automation_potential: 'medium'
          }
        ]

        // Mock insight engine stats
        const mockEngine: InsightEngine = {
          total_insights_generated: 1247,
          insights_acted_upon: 892,
          success_rate: 87,
          avg_time_to_action: '2.3 days',
          automation_level: 73,
          processing_speed: '1.2 seconds',
          data_sources: 5
        }

        setSources(mockSources)
        setInsights(mockInsights)
        setEngine(mockEngine)
      } catch (error) {
        console.error('Error fetching insights engine data:', error)
      } finally {
        setLoading(false)
        setRealTimeProcessing(false)
      }
    }

    fetchInsightsData()

    // Simulate real-time processing
    const interval = setInterval(() => {
      setRealTimeProcessing(true)
      setTimeout(() => setRealTimeProcessing(false), 2000)
    }, 45000) // Process every 45 seconds

    return () => clearInterval(interval)
  }, [])

  const categories = ['all', 'investment', 'risk', 'opportunity', 'efficiency', 'strategic']
  const priorities = ['all', 'critical', 'high', 'medium', 'low']
  
  const filteredInsights = insights.filter(insight => {
    const categoryMatch = selectedCategory === 'all' || insight.category === selectedCategory
    const priorityMatch = selectedPriority === 'all' || insight.priority === selectedPriority
    return categoryMatch && priorityMatch
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'investment': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'risk': return 'text-red-600 bg-red-50 border-red-200'
      case 'opportunity': return 'text-green-600 bg-green-50 border-green-200'
      case 'efficiency': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'strategic': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getAutomationColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Actionable Insights Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Processing insights...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Engine Overview */}
      {engine && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Actionable Insights Engine
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  AI-powered transformation of complex data into actionable intelligence
                </p>
              </div>
              <div className="flex items-center gap-2">
                {realTimeProcessing ? (
                  <Badge variant="outline" className="text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                    Processing
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                )}
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <p className="text-lg font-bold text-blue-600 mt-2">{engine.total_insights_generated}</p>
                <p className="text-xs text-muted-foreground">Insights Generated</p>
              </div>

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600 mt-2">{engine.insights_acted_upon}</p>
                <p className="text-xs text-muted-foreground">Insights Acted Upon</p>
              </div>

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <p className="text-lg font-bold text-purple-600 mt-2">{engine.success_rate}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <Zap className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <p className="text-lg font-bold text-orange-600 mt-2">{engine.automation_level}%</p>
                <p className="text-xs text-muted-foreground">Automation Level</p>
              </div>
            </div>

            {/* Data Sources */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {sources.map(source => (
                <div key={source.id} className="p-3 bg-muted/30 rounded-lg border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{source.name}</span>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Confidence: {source.confidence}%</div>
                    <div>Data Points: {source.data_points.toLocaleString()}</div>
                    <div>Updated: {source.last_updated}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Lightbulb className="h-4 w-4 text-orange-600" />
              Actionable Insights
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs h-8 px-2 border border-border/60 rounded bg-background"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="text-xs h-8 px-2 border border-border/60 rounded bg-background"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredInsights.map(insight => (
              <div key={insight.id} className="p-4 bg-background border border-border/60 rounded-lg hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(insight.category)}`}>
                        {insight.category}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(insight.priority)}`}>
                        {insight.priority} priority
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Confidence: {insight.confidence}%
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getAutomationColor(insight.automation_potential)}`}>
                        <Cpu className="h-3 w-3 mr-1" />
                        {insight.automation_potential} automation
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    
                    {/* Business Impact */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                        <div className="font-medium text-blue-800 mb-1">Financial Impact</div>
                        <div>{insight.business_impact.financial}</div>
                      </div>
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                        <div className="font-medium text-green-800 mb-1">Operational Impact</div>
                        <div>{insight.business_impact.operational}</div>
                      </div>
                      <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs">
                        <div className="font-medium text-purple-800 mb-1">Strategic Impact</div>
                        <div>{insight.business_impact.strategic}</div>
                      </div>
                    </div>
                    
                    {/* Action Steps */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-600" />
                        Action Steps
                      </h5>
                      <div className="space-y-1">
                        {insight.action_steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Success Metrics */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Success Metrics
                      </h5>
                      <div className="space-y-1">
                        {insight.success_metrics.map((metric, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Timeframe: {insight.timeframe}
                      </div>
                      <div className="flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        Sources: {insight.sources.length}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="text-xs">
                      Take Action
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}