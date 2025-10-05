"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Brain,
  Target,
  Clock,
  TrendingUp,
  Zap,
  Bell,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Star,
  Eye,
  ThumbsUp,
  Paperclip,
  Send,
  UserPlus,
  Calendar,
  MapPin,
  Building2,
  DollarSign
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  expertise: string[]
  availability: 'available' | 'busy' | 'offline'
  last_active: string
  collaboration_score: number
}

interface CollaborationOpportunity {
  id: string
  title: string
  description: string
  type: 'deal_review' | 'market_analysis' | 'due_diligence' | 'strategy_session'
  priority: 'high' | 'medium' | 'low'
  deadline: string
  participants: string[]
  required_skills: string[]
  potential_value: string
}

interface SharedInsight {
  id: string
  author: string
  title: string
  content: string
  category: string
  timestamp: string
  likes: number
  comments: number
  tags: string[]
  relevance_score: number
}

interface ActiveDiscussion {
  id: string
  topic: string
  participants: string[]
  messages: number
  last_activity: string
  status: 'active' | 'resolved' | 'pending'
}

export default function CollaborationHub() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [opportunities, setOpportunities] = useState<CollaborationOpportunity[]>([])
  const [insights, setInsights] = useState<SharedInsight[]>([])
  const [discussions, setDiscussions] = useState<ActiveDiscussion[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'team' | 'opportunities' | 'insights' | 'discussions'>('team')

  useEffect(() => {
    const fetchCollaborationData = async () => {
      try {
        setLoading(true)
        
        // Simulate API call for collaboration data
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock team members
        const mockTeamMembers: TeamMember[] = [
          {
            id: '1',
            name: 'Sarah Chen',
            role: 'Investment Partner',
            expertise: ['Cloud Security', 'SaaS', 'Series A'],
            availability: 'available',
            last_active: '2 minutes ago',
            collaboration_score: 94
          },
          {
            id: '2',
            name: 'Marcus Rodriguez',
            role: 'Senior Analyst',
            expertise: ['AI/ML', 'Market Analysis', 'Due Diligence'],
            availability: 'busy',
            last_active: '15 minutes ago',
            collaboration_score: 87
          },
          {
            id: '3',
            name: 'Emily Watson',
            role: 'Technical Advisor',
            expertise: ['Cybersecurity', 'Product Review', 'Technical Due Diligence'],
            availability: 'available',
            last_active: '5 minutes ago',
            collaboration_score: 91
          },
          {
            id: '4',
            name: 'David Kim',
            role: 'Market Researcher',
            expertise: ['Market Trends', 'Competitive Analysis', 'Industry Reports'],
            availability: 'available',
            last_active: '1 hour ago',
            collaboration_score: 83
          }
        ]

        // Mock collaboration opportunities
        const mockOpportunities: CollaborationOpportunity[] = [
          {
            id: '1',
            title: 'SecureAI Series B Review',
            description: 'Need technical and market expertise for $25M Series B investment opportunity in cloud security AI platform',
            type: 'deal_review',
            priority: 'high',
            deadline: '3 days',
            participants: ['Sarah Chen', 'Emily Watson'],
            required_skills: ['Cloud Security', 'AI/ML', 'Market Analysis'],
            potential_value: '$25M'
          },
          {
            id: '2',
            title: 'Q4 Market Strategy Session',
            description: 'Collaborative session to analyze Q4 cybersecurity investment trends and adjust portfolio strategy',
            type: 'strategy_session',
            priority: 'medium',
            deadline: '1 week',
            participants: ['Marcus Rodriguez', 'David Kim'],
            required_skills: ['Market Analysis', 'Strategic Planning'],
            potential_value: 'Portfolio Optimization'
          },
          {
            id: '3',
            title: 'Zero Trust Startup Due Diligence',
            description: 'Technical due diligence required for early-stage zero trust architecture startup seeking seed funding',
            type: 'due_diligence',
            priority: 'high',
            deadline: '5 days',
            participants: ['Emily Watson'],
            required_skills: ['Cybersecurity', 'Technical Assessment', 'Architecture Review'],
            potential_value: '$5M'
          }
        ]

        // Mock shared insights
        const mockInsights: SharedInsight[] = [
          {
            id: '1',
            author: 'Marcus Rodriguez',
            title: 'AI Security Market Trends Q4 2024',
            content: 'Analysis shows 45% increase in AI security funding, with focus on generative AI security solutions and automated threat detection.',
            category: 'Market Analysis',
            timestamp: '2 hours ago',
            likes: 12,
            comments: 5,
            tags: ['AI', 'Security', 'Market Trends', 'Q4'],
            relevance_score: 88
          },
          {
            id: '2',
            author: 'Emily Watson',
            title: 'Technical Assessment: Cloud Security Platforms',
            content: 'Comparative analysis of top 5 cloud security platforms shows differentiation in API security and container protection capabilities.',
            category: 'Technical Analysis',
            timestamp: '4 hours ago',
            likes: 8,
            comments: 3,
            tags: ['Cloud Security', 'Technical', 'Comparison'],
            relevance_score: 92
          },
          {
            id: '3',
            author: 'Sarah Chen',
            title: 'Conference Intelligence: RSAC 2024 Takeaways',
            content: 'Key themes from RSAC 2024: AI-driven security, zero trust adoption, and increased M&A activity in mid-market security companies.',
            category: 'Conference Insights',
            timestamp: '6 hours ago',
            likes: 15,
            comments: 7,
            tags: ['RSAC', 'Conference', 'M&A', 'Zero Trust'],
            relevance_score: 85
          }
        ]

        // Mock active discussions
        const mockDiscussions: ActiveDiscussion[] = [
          {
            id: '1',
            topic: 'Investment Thesis: AI Security vs. Traditional Security',
            participants: ['Sarah Chen', 'Marcus Rodriguez', 'David Kim'],
            messages: 23,
            last_activity: '10 minutes ago',
            status: 'active'
          },
          {
            id: '2',
            topic: 'Due Diligence Framework for Early-Stage Startups',
            participants: ['Emily Watson', 'Marcus Rodriguez'],
            messages: 15,
            last_activity: '1 hour ago',
            status: 'active'
          },
          {
            id: '3',
            topic: 'Portfolio Company Performance Review',
            participants: ['Sarah Chen', 'Emily Watson', 'David Kim'],
            messages: 8,
            last_activity: '2 hours ago',
            status: 'resolved'
          }
        ]

        setTeamMembers(mockTeamMembers)
        setOpportunities(mockOpportunities)
        setInsights(mockInsights)
        setDiscussions(mockDiscussions)
      } catch (error) {
        console.error('Error fetching collaboration data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollaborationData()

    // Simulate real-time updates
    const interval = setInterval(() => {
      // In a real implementation, this would fetch new collaboration data
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-50 border-green-200'
      case 'busy': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'offline': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200'
      case 'resolved': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Collaboration Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading collaboration hub...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Collaboration Header */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Users className="h-5 w-5 text-blue-600" />
                Collaboration Hub
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time team intelligence sharing and collaborative decision-making
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                {teamMembers.length} Team Members
              </Badge>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Collaboration
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {[
              { id: 'team', label: 'Team', icon: Users },
              { id: 'opportunities', label: 'Opportunities', icon: Target },
              { id: 'insights', label: 'Shared Insights', icon: Brain },
              { id: 'discussions', label: 'Discussions', icon: MessageSquare }
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Active Members</span>
              </div>
              <div className="text-lg font-bold text-blue-600 mt-1">
                {teamMembers.filter(m => m.availability === 'available').length}
              </div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Open Opportunities</span>
              </div>
              <div className="text-lg font-bold text-green-600 mt-1">
                {opportunities.length}
              </div>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Shared Insights</span>
              </div>
              <div className="text-lg font-bold text-purple-600 mt-1">
                {insights.reduce((sum, insight) => sum + insight.likes, 0)}
              </div>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Active Discussions</span>
              </div>
              <div className="text-lg font-bold text-orange-600 mt-1">
                {discussions.filter(d => d.status === 'active').length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'team' && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Users className="h-4 w-4 text-blue-600" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map(member => (
                <div key={member.id} className="p-4 bg-background border border-border/60 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{member.name}</h4>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getAvailabilityColor(member.availability)}`}>
                      {member.availability}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last active: {member.last_active}</span>
                    <span>Collaboration score: {member.collaboration_score}%</span>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'opportunities' && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Target className="h-4 w-4 text-green-600" />
              Collaboration Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opportunities.map(opportunity => (
                <div key={opportunity.id} className="p-4 bg-background border border-border/60 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-sm">{opportunity.title}</h4>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(opportunity.priority)}`}>
                          {opportunity.priority} priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {opportunity.deadline}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Participants:</p>
                          <div className="flex flex-wrap gap-1">
                            {opportunity.participants.map(participant => (
                              <Badge key={participant} variant="secondary" className="text-xs">
                                {participant}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Required Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {opportunity.required_skills.map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">Potential Value: {opportunity.potential_value}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" className="text-xs">
                            <UserPlus className="h-3 w-3 mr-1" />
                            Join
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'insights' && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Brain className="h-4 w-4 text-purple-600" />
              Shared Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map(insight => (
                <div key={insight.id} className="p-4 bg-background border border-border/60 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {insight.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-purple-600">
                          {insight.relevance_score}% relevant
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{insight.content}</p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-xs text-muted-foreground">by {insight.author}</span>
                        <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {insight.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {insight.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {insight.comments}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Like
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'discussions' && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <MessageSquare className="h-4 w-4 text-orange-600" />
              Active Discussions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discussions.map(discussion => (
                <div key={discussion.id} className="p-4 bg-background border border-border/60 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-sm">{discussion.topic}</h4>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(discussion.status)}`}>
                          {discussion.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-xs text-muted-foreground">
                          Participants: {discussion.participants.join(', ')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last activity: {discussion.last_activity}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {discussion.messages} messages
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View Discussion
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}