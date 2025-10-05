"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Filter,
  RefreshCw
} from 'lucide-react'

interface Insight {
  id: string
  type: 'business' | 'user' | 'technical' | 'convergence'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  timeframe: string
  actionable: boolean
  category: string
  metrics?: {
    label: string
    value: string
    change: string
  }[]
}

interface ConvergenceScore {
  business_alignment: number
  user_satisfaction: number
  technical_feasibility: number
  overall_score: number
  recommendations: string[]
}

export default function ConvergenceInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [convergenceScore, setConvergenceScore] = useState<ConvergenceScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [realTimeUpdates, setRealTimeUpdates] = useState(0)

  // Simulate real-time data convergence
  useEffect(() => {
    const fetchConvergenceData = async () => {
      try {
        setLoading(true)
        
        // Simulate API call for convergence insights
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock insights that demonstrate convergence
        const mockInsights: Insight[] = [
          {
            id: '1',
            type: 'convergence',
            title: 'Investment Pattern Recognition',
            description: 'AI identifies 3 companies with 85% probability of Series B funding in next 6 months based on funding patterns and market conditions',
            impact: 'high',
            confidence: 85,
            timeframe: '6 months',
            actionable: true,
            category: 'investment',
            metrics: [
              { label: 'ROI Potential', value: '245%', change: '+15%' },
              { label: 'Market Fit', value: '92%', change: '+8%' }
            ]
          },
          {
            id: '2',
            type: 'business',
            title: 'Conference ROI Optimization',
            description: 'Real-time analysis shows RSAC 2024 has 3.2x higher deal closure rate compared to other cybersecurity conferences',
            impact: 'high',
            confidence: 92,
            timeframe: 'Immediate',
            actionable: true,
            category: 'conferences',
            metrics: [
              { label: 'Deal Closure', value: '68%', change: '+22%' },
              { label: 'Lead Quality', value: '4.2/5', change: '+0.8' }
            ]
          },
          {
            id: '3',
            type: 'user',
            title: 'Dashboard Engagement Spike',
            description: 'User engagement increased 40% after implementing personalized deal flow recommendations',
            impact: 'medium',
            confidence: 78,
            timeframe: '30 days',
            actionable: true,
            category: 'ux',
            metrics: [
              { label: 'Session Duration', value: '12m', change: '+65%' },
              { label: 'Feature Adoption', value: '87%', change: '+23%' }
            ]
          },
          {
            id: '4',
            type: 'technical',
            title: 'API Performance Optimization',
            description: 'Real-time data processing latency reduced by 60% through edge computing implementation',
            impact: 'medium',
            confidence: 95,
            timeframe: 'Completed',
            actionable: false,
            category: 'performance',
            metrics: [
              { label: 'Response Time', value: '120ms', change: '-60%' },
              { label: 'Throughput', value: '2.4K/s', change: '+180%' }
            ]
          },
          {
            id: '5',
            type: 'convergence',
            title: 'Collaborative Intelligence Network',
            description: 'Cross-functional teams using shared insights show 55% faster decision-making on investment opportunities',
            impact: 'high',
            confidence: 88,
            timeframe: 'Ongoing',
            actionable: true,
            category: 'collaboration',
            metrics: [
              { label: 'Decision Speed', value: '2.1 days', change: '-55%' },
              { label: 'Team Alignment', value: '94%', change: '+31%' }
            ]
          }
        ]

        // Mock convergence score
        const mockConvergenceScore: ConvergenceScore = {
          business_alignment: 87,
          user_satisfaction: 92,
          technical_feasibility: 89,
          overall_score: 89,
          recommendations: [
            'Expand AI pattern recognition to cover emerging markets',
            'Implement real-time collaboration features for investment teams',
            'Optimize mobile experience for on-the-go decision making',
            'Enhance data visualization for complex relationship mapping'
          ]
        }

        setInsights(mockInsights)
        setConvergenceScore(mockConvergenceScore)
      } catch (error) {
        console.error('Error fetching convergence insights:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConvergenceData()

    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeUpdates(prev => prev + 1)
      // In a real implementation, this would fetch new data
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const categories = ['all', 'investment', 'conferences', 'ux', 'performance', 'collaboration']
  
  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory)

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'business': return TrendingUp
      case 'user': return Users
      case 'technical': return Zap
      case 'convergence': return Brain
      default: return Lightbulb
    }
  }

  const formatConfidence = (confidence: number) => {
    return `${confidence}%`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Convergence Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Analyzing convergence patterns...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Convergence Score Card */}
      {convergenceScore && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Convergence Alignment Score
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live</span>
                <Badge variant="outline" className="text-xs">
                  {realTimeUpdates} updates
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted-foreground/20"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(convergenceScore.business_alignment / 100) * 226}`}
                      className="text-blue-600 transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute">
                    <span className="text-lg font-bold text-blue-600">
                      {convergenceScore.business_alignment}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium mt-2">Business</p>
                <p className="text-xs text-muted-foreground">Alignment</p>
              </div>

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted-foreground/20"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(convergenceScore.user_satisfaction / 100) * 226}`}
                      className="text-green-600 transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute">
                    <span className="text-lg font-bold text-green-600">
                      {convergenceScore.user_satisfaction}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium mt-2">User</p>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
              </div>

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted-foreground/20"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(convergenceScore.technical_feasibility / 100) * 226}`}
                      className="text-purple-600 transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute">
                    <span className="text-lg font-bold text-purple-600">
                      {convergenceScore.technical_feasibility}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium mt-2">Technical</p>
                <p className="text-xs text-muted-foreground">Feasibility</p>
              </div>

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted-foreground/20"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(convergenceScore.overall_score / 100) * 226}`}
                      className="text-orange-600 transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute">
                    <span className="text-lg font-bold text-orange-600">
                      {convergenceScore.overall_score}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium mt-2">Overall</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/40">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-orange-600" />
                Strategic Recommendations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {convergenceScore.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Filter */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Brain className="h-5 w-5 text-purple-600" />
              Convergence Insights
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs h-8"
                >
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInsights.map(insight => {
              const TypeIcon = getTypeIcon(insight.type)
              return (
                <div key={insight.id} className="p-4 bg-background border border-border/60 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <TypeIcon className="h-4 w-4 text-purple-600" />
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge variant="outline" className={`text-xs ${getImpactColor(insight.impact)}`}>
                          {insight.impact} impact
                        </Badge>
                        {insight.actionable && (
                          <Badge variant="secondary" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            Actionable
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      
                      {/* Metrics */}
                      {insight.metrics && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          {insight.metrics.map((metric, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded border border-border/40">
                              <span className="text-xs text-muted-foreground">{metric.label}</span>
                              <div className="text-right">
                                <span className="text-sm font-medium">{metric.value}</span>
                                <span className={`text-xs ml-1 ${
                                  metric.change.startsWith('+') ? 'text-green-600' : 
                                  metric.change.startsWith('-') ? 'text-red-600' : 'text-muted-foreground'
                                }`}>
                                  {metric.change}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {insight.timeframe}
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          Confidence: {formatConfidence(insight.confidence)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {insight.category}
                        </Badge>
                      </div>
                    </div>
                    
                    {insight.actionable && (
                      <Button size="sm" className="h-8 text-xs">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}