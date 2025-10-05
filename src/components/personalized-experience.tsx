"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Settings, 
  TrendingUp, 
  Target, 
  Brain,
  Bell,
  Eye,
  ThumbsUp,
  Clock,
  Star,
  Zap,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react'

interface UserPreference {
  id: string
  category: string
  preference: string
  value: string
  impact: 'high' | 'medium' | 'low'
}

interface PersonalizedInsight {
  id: string
  title: string
  description: string
  relevance_score: number
  category: string
  action_required: boolean
  deadline?: string
  personalized_reason: string
}

interface UserBehavior {
  most_used_features: string[]
  peak_usage_times: string[]
  preferred_content_types: string[]
  collaboration_pattern: string
  decision_speed: string
}

export default function PersonalizedExperience() {
  const [preferences, setPreferences] = useState<UserPreference[]>([])
  const [insights, setInsights] = useState<PersonalizedInsight[]>([])
  const [behavior, setBehavior] = useState<UserBehavior | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'insights' | 'preferences' | 'behavior'>('insights')

  useEffect(() => {
    const fetchPersonalizedData = async () => {
      try {
        setLoading(true)
        
        // Simulate API call for personalized data
        await new Promise(resolve => setTimeout(resolve, 1200))
        
        // Mock user preferences based on behavior
        const mockPreferences: UserPreference[] = [
          {
            id: '1',
            category: 'Investment Focus',
            preference: 'Preferred Funding Stages',
            value: 'Series A, Series B',
            impact: 'high'
          },
          {
            id: '2',
            category: 'Geographic Focus',
            preference: 'Target Regions',
            value: 'North America, Europe',
            impact: 'medium'
          },
          {
            id: '3',
            category: 'Content Preference',
            preference: 'Dashboard Layout',
            value: 'Compact View',
            impact: 'medium'
          },
          {
            id: '4',
            category: 'Notification Settings',
            preference: 'Alert Priority',
            value: 'High Impact Only',
            impact: 'high'
          },
          {
            id: '5',
            category: 'AI Interaction',
            preference: 'Analysis Depth',
            value: 'Detailed Reports',
            impact: 'high'
          }
        ]

        // Mock personalized insights
        const mockInsights: PersonalizedInsight[] = [
          {
            id: '1',
            title: 'Series A Opportunities in Cloud Security',
            description: 'Based on your investment pattern in early-stage cloud security companies, 3 new opportunities match your criteria with 85% fit',
            relevance_score: 92,
            category: 'investment',
            action_required: true,
            deadline: '2 weeks',
            personalized_reason: 'You\'ve invested in 4 similar companies with 3.2x average return'
          },
          {
            id: '2',
            title: 'RSAC 2024 Personalized Schedule',
            description: 'AI-recommended conference sessions based on your interests in AI security and investment trends',
            relevance_score: 88,
            category: 'conference',
            action_required: false,
            personalized_reason: 'Matches your focus areas: AI security, investment trends, networking'
          },
          {
            id: '3',
            title: 'Dashboard Optimization Detected',
            description: 'Your usage pattern suggests you\'d benefit from a customized layout prioritizing funding charts and deal flow',
            relevance_score: 76,
            category: 'ux',
            action_required: false,
            personalized_reason: 'You spend 68% of time on funding analytics and deal visualization'
          },
          {
            id: '4',
            title: 'Collaboration Opportunity',
            description: '3 team members with complementary interests in your target sectors are available for deal review',
            relevance_score: 84,
            category: 'collaboration',
            action_required: true,
            deadline: '3 days',
            personalized_reason: 'Based on your collaboration history and sector preferences'
          },
          {
            id: '5',
            title: 'Learning Recommendation',
            description: 'New market analysis techniques could improve your investment decision accuracy by 25%',
            relevance_score: 71,
            category: 'learning',
            action_required: false,
            personalized_reason: 'Your analysis patterns show opportunity for enhancement in market timing'
          }
        ]

        // Mock user behavior analysis
        const mockBehavior: UserBehavior = {
          most_used_features: ['Deal Map', 'Funding Analytics', 'AI Advisor'],
          peak_usage_times: ['9:00-11:00', '14:00-16:00'],
          preferred_content_types: ['Visual Analytics', 'Executive Summaries', 'Real-time Alerts'],
          collaboration_pattern: 'Active team collaborator',
          decision_speed: 'Fast (under 48 hours)'
        }

        setPreferences(mockPreferences)
        setInsights(mockInsights)
        setBehavior(mockBehavior)
      } catch (error) {
        console.error('Error fetching personalized data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPersonalizedData()
  }, [])

  const getRelevanceColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200'
    return 'text-orange-600 bg-orange-50 border-orange-200'
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personalized Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Personalizing your experience...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Personalization Header */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <User className="h-5 w-5 text-blue-600" />
                Personalized Experience
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered adaptation to your preferences and behavior patterns
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {[
              { id: 'insights', label: 'Personalized Insights', icon: Brain },
              { id: 'preferences', label: 'Your Preferences', icon: Settings },
              { id: 'behavior', label: 'Usage Patterns', icon: Eye }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="text-xs h-8"
              >
                <tab.icon className="h-3 w-3 mr-1" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Behavior Summary */}
          {behavior && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Top Features</span>
                </div>
                <div className="space-y-1">
                  {behavior.most_used_features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Peak Usage</span>
                </div>
                <div className="space-y-1">
                  {behavior.peak_usage_times.map((time, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      <span>{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Work Style</span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Decision Speed: </span>
                    <span className="font-medium">{behavior.decision_speed}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Collaboration: </span>
                    <span className="font-medium">{behavior.collaboration_pattern}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'insights' && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Brain className="h-4 w-4 text-purple-600" />
              Insights Tailored for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map(insight => (
                <div key={insight.id} className="p-4 bg-background border border-border/60 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge variant="outline" className={`text-xs ${getRelevanceColor(insight.relevance_score)}`}>
                          {insight.relevance_score}% relevant
                        </Badge>
                        {insight.action_required && (
                          <Badge variant="secondary" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            Action Required
                          </Badge>
                        )}
                        {insight.deadline && (
                          <Badge variant="outline" className="text-xs text-orange-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {insight.deadline}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                        <strong>Why this matters to you:</strong> {insight.personalized_reason}
                      </div>
                    </div>
                    {insight.action_required && (
                      <Button size="sm" className="h-8 text-xs">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'preferences' && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Settings className="h-4 w-4 text-blue-600" />
              Your Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preferences.map(pref => (
                <div key={pref.id} className="p-4 bg-background border border-border/60 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{pref.category}</span>
                    <Badge variant="outline" className={`text-xs ${getImpactColor(pref.impact)}`}>
                      {pref.impact} impact
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Preference:</span>
                      <p className="text-sm font-medium">{pref.preference}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Value:</span>
                      <p className="text-sm">{pref.value}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                    Edit Preference
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'behavior' && behavior && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Eye className="h-4 w-4 text-green-600" />
              Usage Patterns & Behavior
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-3">Content Preferences</h4>
                  <div className="space-y-2">
                    {behavior.preferred_content_types.map((type, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded border border-border/40">
                        <ThumbsUp className="h-3 w-3 text-green-600" />
                        <span className="text-sm">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Collaboration Style</h4>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{behavior.collaboration_pattern}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your collaboration pattern shows active engagement with team members and preference for shared decision-making.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-orange-600" />
                  <h4 className="text-sm font-medium">Personalization Effectiveness</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">94%</div>
                    <div className="text-xs text-muted-foreground">Relevance Score</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">87%</div>
                    <div className="text-xs text-muted-foreground">User Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">+42%</div>
                    <div className="text-xs text-muted-foreground">Efficiency Gain</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}