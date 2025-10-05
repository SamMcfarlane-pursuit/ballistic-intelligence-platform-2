"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  Brain,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building2
} from 'lucide-react'

interface UserAnalytics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  sessionDuration: number
  bounceRate: number
  featureUsage: FeatureUsage[]
  userJourneys: UserJourney[]
  painPoints: PainPointReport[]
  satisfaction: SatisfactionMetrics
}

interface FeatureUsage {
  feature: string
  usage: number
  users: number
  satisfaction: number
  trend: 'up' | 'down' | 'stable'
}

interface UserJourney {
  id: string
  persona: string
  steps: JourneyStep[]
  completionRate: number
  avgDuration: number
  dropoffPoints: string[]
}

interface JourneyStep {
  name: string
  duration: number
  success: boolean
  painPoints: string[]
}

interface PainPointReport {
  id: string
  description: string
  severity: 'low' | 'medium' | 'high'
  frequency: number
  affectedUsers: number
  status: 'identified' | 'investigating' | 'resolved' | 'monitoring'
  resolution?: string
  impact: string
}

interface SatisfactionMetrics {
  overall: number
  easeOfUse: number
  features: number
  performance: number
  support: number
  responses: number
}

interface UserPersona {
  id: string
  name: string
  role: string
  goals: string[]
  painPoints: string[]
  behaviors: string[]
  quote: string
  avatar: string
}

export default function UserAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPersona, setSelectedPersona] = useState<string>('all')

  // Mock user personas
  const userPersonas: UserPersona[] = [
    {
      id: 'vc',
      name: 'Sarah Chen',
      role: 'Venture Capitalist',
      goals: ['Find high-potential startups', 'Streamline deal flow', 'Track market trends'],
      painPoints: ['Too many low-quality leads', 'Time-consuming due diligence', 'Missing early opportunities'],
      behaviors: ['Checks dashboard daily', 'Attends major conferences', 'Values data-driven insights'],
      quote: 'I need to find the next unicorn before anyone else does.',
      avatar: '👩‍💼'
    },
    {
      id: 'analyst',
      name: 'Marcus Rodriguez',
      role: 'Investment Analyst',
      goals: ['Conduct thorough research', 'Build investment theses', 'Support deal evaluation'],
      painPoints: ['Limited data sources', 'Manual research processes', 'Difficulty tracking competitors'],
      behaviors: ['Deep dives into company data', 'Follows industry news', 'Collaborates with team'],
      quote: 'Data quality and depth are everything for my analysis.',
      avatar: '👨‍💻'
    },
    {
      id: 'attendee',
      name: 'Emily Watson',
      role: 'Conference Attendee',
      goals: ['Discover new technologies', 'Network with peers', 'Find investment opportunities'],
      painPoints: ['Information overload at events', 'Hard to identify relevant companies', 'Limited networking time'],
      behaviors: ['Uses mobile app during events', 'Follows up post-conference', 'Shares insights with team'],
      quote: 'Conferences are overwhelming - I need help focusing on what matters.',
      avatar: '👩‍🔬'
    },
    {
      id: 'founder',
      name: 'David Kim',
      role: 'Startup Founder',
      goals: ['Get investor attention', 'Showcase technology', 'Build partnerships'],
      painPoints: ['Standing out in crowded markets', 'Getting in front of right investors', 'Demonstrating traction'],
      behaviors: ['Active on social media', 'Networks strategically', 'Seeks feedback constantly'],
      quote: 'I just need a chance to show investors what we\'ve built.',
      avatar: '🚀'
    }
  ]

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setLoading(true)
      // In a real app, this would fetch from an API
      setTimeout(() => {
        setAnalytics({
          totalUsers: 1247,
          activeUsers: 892,
          newUsers: 156,
          sessionDuration: 8.4, // minutes
          bounceRate: 23,
          featureUsage: [
            { feature: 'Convention Tracker', usage: 85, users: 1059, satisfaction: 4.2, trend: 'up' },
            { feature: 'Company Profiles', usage: 78, users: 972, satisfaction: 4.5, trend: 'up' },
            { feature: 'AI Analysis', usage: 65, users: 810, satisfaction: 4.1, trend: 'stable' },
            { feature: 'Real-time Updates', usage: 45, users: 561, satisfaction: 3.9, trend: 'up' },
            { feature: 'Investment Criteria', usage: 38, users: 474, satisfaction: 4.3, trend: 'stable' }
          ],
          userJourneys: [
            {
              id: 'vc-discovery',
              persona: 'vc',
              steps: [
                { name: 'Dashboard Overview', duration: 2.1, success: true, painPoints: [] },
                { name: 'Convention Selection', duration: 1.8, success: true, painPoints: [] },
                { name: 'Company Filtering', duration: 3.2, success: true, painPoints: ['Too many filters'] },
                { name: 'Profile Review', duration: 5.4, success: true, painPoints: [] },
                { name: 'Contact Initiation', duration: 2.1, success: false, painPoints: ['No direct contact method'] }
              ],
              completionRate: 80,
              avgDuration: 14.6,
              dropoffPoints: ['Contact Initiation']
            },
            {
              id: 'analyst-research',
              persona: 'analyst',
              steps: [
                { name: 'Data Export', duration: 1.5, success: true, painPoints: [] },
                { name: 'Company Analysis', duration: 8.3, success: true, painPoints: ['Limited historical data'] },
                { name: 'Market Research', duration: 6.7, success: true, painPoints: [] },
                { name: 'Report Generation', duration: 4.2, success: true, painPoints: [] }
              ],
              completionRate: 95,
              avgDuration: 20.7,
              dropoffPoints: []
            }
          ],
          painPoints: [
            {
              id: 'pp1',
              description: 'Mobile app performance issues during live events',
              severity: 'high',
              frequency: 45,
              affectedUsers: 234,
              status: 'investigating',
              impact: 'Reduced engagement during critical conference periods',
              resolution: 'Implementing progressive web app with offline capabilities'
            },
            {
              id: 'pp2',
              description: 'Complex filtering interface overwhelms new users',
              severity: 'medium',
              frequency: 78,
              affectedUsers: 156,
              status: 'resolved',
              impact: 'High user drop-off during onboarding',
              resolution: 'Redesigned interface with guided filtering and presets'
            },
            {
              id: 'pp3',
              description: 'AI analysis takes too long for large datasets',
              severity: 'medium',
              frequency: 32,
              affectedUsers: 89,
              status: 'monitoring',
              impact: 'Delays in investment decision-making process',
              resolution: 'Implemented batch processing and progress indicators'
            }
          ],
          satisfaction: {
            overall: 4.2,
            easeOfUse: 4.0,
            features: 4.3,
            performance: 3.9,
            support: 4.1,
            responses: 342
          }
        })
        setLoading(false)
      }, 1000)
    }

    loadAnalytics()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'investigating': return 'bg-blue-100 text-blue-800'
      case 'monitoring': return 'bg-purple-100 text-purple-800'
      case 'identified': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading user analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return <div>Error loading analytics data</div>
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <BarChart3 className="h-8 w-8" />
          User Analytics & Optimization Dashboard
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive user behavior analysis, pain point tracking, and optimization insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.newUsers} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1)}% engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.sessionDuration}m</div>
            <p className="text-xs text-muted-foreground">
              {analytics.bounceRate}% bounce rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.satisfaction.overall}/5.0</div>
            <p className="text-xs text-muted-foreground">
              {analytics.satisfaction.responses} responses
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personas">User Personas</TabsTrigger>
          <TabsTrigger value="usage">Feature Usage</TabsTrigger>
          <TabsTrigger value="journeys">User Journeys</TabsTrigger>
          <TabsTrigger value="painpoints">Pain Points</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
        </TabsList>

        <TabsContent value="personas" className="space-y-6">
          <div className="grid gap-6">
            {userPersonas.map((persona) => (
              <Card key={persona.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{persona.avatar}</div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{persona.name}</CardTitle>
                      <CardDescription className="text-lg">{persona.role}</CardDescription>
                      <blockquote className="mt-2 text-sm italic text-muted-foreground border-l-4 border-primary pl-4">
                        "{persona.quote}"
                      </blockquote>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Goals
                      </h4>
                      <ul className="space-y-2">
                        {persona.goals.map((goal, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Pain Points
                      </h4>
                      <ul className="space-y-2">
                        {persona.painPoints.map((painPoint, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{painPoint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Behaviors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {persona.behaviors.map((behavior, index) => (
                        <Badge key={index} variant="outline">
                          {behavior}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Feature Usage Analytics
              </CardTitle>
              <CardDescription>
                Track feature adoption, user engagement, and satisfaction trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analytics.featureUsage.map((feature) => (
                <div key={feature.feature} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{feature.feature}</span>
                      {getTrendIcon(feature.trend)}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {feature.users} users
                      </span>
                      <Badge variant="outline">
                        {feature.satisfaction}/5.0
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage Rate</span>
                      <span>{feature.usage}%</span>
                    </div>
                    <Progress value={feature.usage} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journeys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                User Journey Analysis
              </CardTitle>
              <CardDescription>
                Complete user workflows with completion rates and pain points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analytics.userJourneys.map((journey) => {
                const persona = userPersonas.find(p => p.id === journey.persona)
                return (
                  <div key={journey.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{persona?.avatar}</div>
                        <div>
                          <h4 className="font-semibold">{persona?.name} - {persona?.role}</h4>
                          <p className="text-sm text-muted-foreground">
                            {journey.avgDuration}min avg duration • {journey.completionRate}% completion
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{journey.completionRate}%</div>
                        <div className="text-sm text-muted-foreground">Complete</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {journey.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="flex-shrink-0">
                            {step.success ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{step.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {step.duration}s
                              </span>
                            </div>
                            {step.painPoints.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {step.painPoints.map((painPoint, idx) => (
                                  <Badge key={idx} variant="destructive" className="text-xs">
                                    {painPoint}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {journey.dropoffPoints.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h5 className="font-medium text-red-800 mb-2">Drop-off Points:</h5>
                        <div className="flex flex-wrap gap-2">
                          {journey.dropoffPoints.map((point, index) => (
                            <Badge key={index} variant="destructive">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="painpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Pain Point Tracking & Resolution
              </CardTitle>
              <CardDescription>
                Identified user pain points with resolution status and impact analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analytics.painPoints.map((painPoint) => (
                <div key={painPoint.id} className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{painPoint.description}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{painPoint.impact}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(painPoint.severity)}>
                        {painPoint.severity}
                      </Badge>
                      <Badge className={getStatusColor(painPoint.status)}>
                        {painPoint.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="ml-2 font-medium">{painPoint.frequency} occurrences</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Affected Users:</span>
                      <span className="ml-2 font-medium">{painPoint.affectedUsers} users</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <span className="ml-2 font-medium">{painPoint.severity} severity</span>
                    </div>
                  </div>

                  {painPoint.resolution && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h5 className="font-medium text-green-800 mb-1">Resolution:</h5>
                      <p className="text-sm text-green-700">{painPoint.resolution}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                User Satisfaction Metrics
              </CardTitle>
              <CardDescription>
                Comprehensive satisfaction analysis across different aspects of the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Overall Satisfaction</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Overall Rating</span>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">{analytics.satisfaction.overall}</div>
                        <div className="text-sm text-muted-foreground">/5.0</div>
                      </div>
                    </div>
                    <Progress value={(analytics.satisfaction.overall / 5) * 100} className="h-3" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Response Volume</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{analytics.satisfaction.responses}</div>
                    <div className="text-sm text-muted-foreground">Total Responses</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Detailed Breakdown</h4>
                <div className="grid gap-4">
                  {[
                    { name: 'Ease of Use', value: analytics.satisfaction.easeOfUse, icon: <Zap className="h-4 w-4" /> },
                    { name: 'Features', value: analytics.satisfaction.features, icon: <Brain className="h-4 w-4" /> },
                    { name: 'Performance', value: analytics.satisfaction.performance, icon: <Activity className="h-4 w-4" /> },
                    { name: 'Support', value: analytics.satisfaction.support, icon: <Shield className="h-4 w-4" /> }
                  ].map((metric) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {metric.icon}
                          <span className="font-medium">{metric.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-bold">{metric.value}</div>
                          <div className="text-sm text-muted-foreground">/5.0</div>
                        </div>
                      </div>
                      <Progress value={(metric.value / 5) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}