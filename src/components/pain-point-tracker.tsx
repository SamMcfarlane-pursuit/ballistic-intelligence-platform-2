"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target, 
  Users, 
  TrendingUp,
  Plus,
  Search,
  Filter,
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
  Building2,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

interface PainPoint {
  id: string
  title: string
  description: string
  category: 'ux' | 'performance' | 'feature' | 'technical' | 'business'
  severity: 'low' | 'medium' | 'high' | 'critical'
  priority: 'low' | 'medium' | 'high'
  status: 'identified' | 'investigating' | 'planning' | 'implementing' | 'resolved' | 'monitoring'
  reportedBy: string
  reportedDate: string
  affectedUsers: number
  frequency: number
  impact: string
  assignedTo?: string
  estimatedResolution?: string
  actualResolution?: string
  resolution?: string
  userFeedback?: string[]
  metrics: {
    before?: number
    after?: number
    improvement?: number
  }
  tags: string[]
}

interface ResolutionMetrics {
  totalPainPoints: number
  resolved: number
  inProgress: number
  avgResolutionTime: number
  userSatisfaction: number
  impactScore: number
  categoryBreakdown: Record<string, number>
  severityBreakdown: Record<string, number>
}

export default function PainPointTracker() {
  const [painPoints, setPainPoints] = useState<PainPoint[]>([])
  const [metrics, setMetrics] = useState<ResolutionMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')

  const [newPainPoint, setNewPainPoint] = useState({
    title: '',
    description: '',
    category: 'ux' as const,
    severity: 'medium' as const,
    priority: 'medium' as const,
    impact: '',
    tags: [] as string[]
  })

  useEffect(() => {
    loadPainPoints()
  }, [])

  const loadPainPoints = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockPainPoints: PainPoint[] = [
        {
          id: 'pp1',
          title: 'Mobile app crashes during live convention updates',
          description: 'Users report frequent crashes when receiving real-time updates during major conferences, causing missed opportunities.',
          category: 'technical',
          severity: 'critical',
          priority: 'high',
          status: 'implementing',
          reportedBy: 'Sarah Chen (VC)',
          reportedDate: '2024-01-15',
          affectedUsers: 45,
          frequency: 85,
          impact: 'Critical - Missing investment opportunities during peak conference periods',
          assignedTo: 'Engineering Team',
          estimatedResolution: '2024-02-01',
          metrics: { before: 85, improvement: 0 },
          tags: ['mobile', 'real-time', 'critical', 'conferences']
        },
        {
          id: 'pp2',
          title: 'Complex filtering interface overwhelms new users',
          description: 'New users find the advanced filtering options confusing and difficult to use, leading to high drop-off rates.',
          category: 'ux',
          severity: 'medium',
          priority: 'high',
          status: 'resolved',
          reportedBy: 'Marcus Rodriguez (Analyst)',
          reportedDate: '2024-01-10',
          affectedUsers: 120,
          frequency: 65,
          impact: 'High user drop-off during onboarding, reduced platform adoption',
          assignedTo: 'UX Team',
          estimatedResolution: '2024-01-20',
          actualResolution: '2024-01-18',
          resolution: 'Redesigned filtering interface with guided presets and progressive disclosure',
          userFeedback: ['Much easier to use now!', 'The presets are very helpful', 'Finally understand how to filter properly'],
          metrics: { before: 65, after: 15, improvement: 77 },
          tags: ['ux', 'onboarding', 'filters', 'new-users']
        },
        {
          id: 'pp3',
          title: 'AI analysis processing time too slow for large datasets',
          description: 'AI-powered investment analysis takes 3-5 minutes for large company datasets, causing delays in decision-making.',
          category: 'performance',
          severity: 'medium',
          priority: 'medium',
          status: 'monitoring',
          reportedBy: 'Emily Watson (Conference Attendee)',
          reportedDate: '2024-01-12',
          affectedUsers: 32,
          frequency: 45,
          impact: 'Delays in investment analysis and decision-making process',
          assignedTo: 'AI Team',
          estimatedResolution: '2024-01-25',
          actualResolution: '2024-01-24',
          resolution: 'Implemented batch processing, caching, and progress indicators',
          userFeedback: ['Much faster now', 'Progress indicators help', 'Still could be faster'],
          metrics: { before: 300, after: 90, improvement: 70 },
          tags: ['ai', 'performance', 'processing', 'large-datasets']
        },
        {
          id: 'pp4',
          title: 'Lack of direct contact methods for high-potential companies',
          description: 'Users cannot directly contact companies through the platform, requiring external research and communication.',
          category: 'feature',
          severity: 'high',
          priority: 'high',
          status: 'planning',
          reportedBy: 'David Kim (Startup Founder)',
          reportedDate: '2024-01-14',
          affectedUsers: 200,
          frequency: 90,
          impact: 'Missed connection opportunities, inefficient deal flow',
          assignedTo: 'Product Team',
          estimatedResolution: '2024-02-15',
          metrics: { before: 90, improvement: 0 },
          tags: ['features', 'contact', 'communication', 'deal-flow']
        },
        {
          id: 'pp5',
          title: 'Inadequate data export capabilities for analysts',
          description: 'Investment analysts need better data export options for creating custom reports and presentations.',
          category: 'feature',
          severity: 'medium',
          priority: 'medium',
          status: 'investigating',
          reportedBy: 'Marcus Rodriguez (Analyst)',
          reportedDate: '2024-01-16',
          affectedUsers: 25,
          frequency: 70,
          impact: 'Time-consuming manual data preparation, reduced analyst productivity',
          assignedTo: 'Product Team',
          estimatedResolution: '2024-02-10',
          metrics: { before: 70, improvement: 0 },
          tags: ['exports', 'data', 'analysts', 'reporting']
        }
      ]

      const calculatedMetrics: ResolutionMetrics = {
        totalPainPoints: mockPainPoints.length,
        resolved: mockPainPoints.filter(pp => pp.status === 'resolved').length,
        inProgress: mockPainPoints.filter(pp => ['investigating', 'planning', 'implementing'].includes(pp.status)).length,
        avgResolutionTime: 8.2, // days
        userSatisfaction: 4.1,
        impactScore: 7.8,
        categoryBreakdown: {
          ux: mockPainPoints.filter(pp => pp.category === 'ux').length,
          performance: mockPainPoints.filter(pp => pp.category === 'performance').length,
          feature: mockPainPoints.filter(pp => pp.category === 'feature').length,
          technical: mockPainPoints.filter(pp => pp.category === 'technical').length,
          business: mockPainPoints.filter(pp => pp.category === 'business').length
        },
        severityBreakdown: {
          critical: mockPainPoints.filter(pp => pp.severity === 'critical').length,
          high: mockPainPoints.filter(pp => pp.severity === 'high').length,
          medium: mockPainPoints.filter(pp => pp.severity === 'medium').length,
          low: mockPainPoints.filter(pp => pp.severity === 'low').length
        }
      }

      setPainPoints(mockPainPoints)
      setMetrics(calculatedMetrics)
      setLoading(false)
    }, 1000)
  }

  const filteredPainPoints = painPoints.filter(pp => {
    const matchesSearch = pp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pp.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || pp.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || pp.status === selectedStatus
    const matchesSeverity = selectedSeverity === 'all' || pp.severity === selectedSeverity

    return matchesSearch && matchesCategory && matchesStatus && matchesSeverity
  })

  const getCategoryColor = (category: string) => {
    const colors = {
      ux: 'bg-blue-100 text-blue-800',
      performance: 'bg-orange-100 text-orange-800',
      feature: 'bg-green-100 text-green-800',
      technical: 'bg-red-100 text-red-800',
      business: 'bg-purple-100 text-purple-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      identified: 'bg-gray-100 text-gray-800',
      investigating: 'bg-blue-100 text-blue-800',
      planning: 'bg-purple-100 text-purple-800',
      implementing: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      monitoring: 'bg-indigo-100 text-indigo-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      identified: <AlertTriangle className="h-4 w-4" />,
      investigating: <Search className="h-4 w-4" />,
      planning: <Brain className="h-4 w-4" />,
      implementing: <Zap className="h-4 w-4" />,
      resolved: <CheckCircle className="h-4 w-4" />,
      monitoring: <Activity className="h-4 w-4" />
    }
    return icons[status as keyof typeof icons] || <AlertTriangle className="h-4 w-4" />
  }

  const handleAddPainPoint = () => {
    if (!newPainPoint.title || !newPainPoint.description) return

    const painPoint: PainPoint = {
      id: `pp${Date.now()}`,
      title: newPainPoint.title,
      description: newPainPoint.description,
      category: newPainPoint.category,
      severity: newPainPoint.severity,
      priority: newPainPoint.priority,
      status: 'identified',
      reportedBy: 'Current User',
      reportedDate: new Date().toISOString().split('T')[0],
      affectedUsers: 1,
      frequency: 1,
      impact: newPainPoint.impact,
      metrics: {},
      tags: newPainPoint.tags
    }

    setPainPoints(prev => [painPoint, ...prev])
    setNewPainPoint({
      title: '',
      description: '',
      category: 'ux',
      severity: 'medium',
      priority: 'medium',
      impact: '',
      tags: []
    })
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading pain point tracker...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Target className="h-8 w-8" />
          Pain Point Tracker & Resolution System
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Identify, track, and resolve user pain points with measurable impact and user validation
        </p>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalPainPoints}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.resolved}</div>
              <p className="text-xs text-muted-foreground">
                {((metrics.resolved / metrics.totalPainPoints) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{metrics.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgResolutionTime}d</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
              <ThumbsUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.userSatisfaction}/5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.impactScore}/10</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="tracker" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tracker">Pain Point Tracker</TabsTrigger>
          <TabsTrigger value="analytics">Resolution Analytics</TabsTrigger>
          <TabsTrigger value="impact">Impact Measurement</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-6">
          {/* Add Pain Point Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Report New Pain Point</CardTitle>
                <CardDescription>
                  Help us improve by reporting issues or pain points you've experienced
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title *</label>
                    <Input
                      placeholder="Brief description of the issue"
                      value={newPainPoint.title}
                      onChange={(e) => setNewPainPoint(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={newPainPoint.category} onValueChange={(value) => setNewPainPoint(prev => ({ ...prev, category: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ux">User Experience</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="business">Business Process</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description *</label>
                  <Textarea
                    placeholder="Detailed description of the pain point..."
                    value={newPainPoint.description}
                    onChange={(e) => setNewPainPoint(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Severity</label>
                    <Select value={newPainPoint.severity} onValueChange={(value) => setNewPainPoint(prev => ({ ...prev, severity: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select value={newPainPoint.priority} onValueChange={(value) => setNewPainPoint(prev => ({ ...prev, priority: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Impact</label>
                    <Input
                      placeholder="Business impact"
                      value={newPainPoint.impact}
                      onChange={(e) => setNewPainPoint(prev => ({ ...prev, impact: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddPainPoint} disabled={!newPainPoint.title || !newPainPoint.description}>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Pain Point
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter & Search Pain Points
                </CardTitle>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pain points..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="ux">User Experience</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="business">Business Process</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="identified">Identified</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="implementing">Implementing</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pain Points List */}
          <div className="space-y-4">
            {filteredPainPoints.map((painPoint) => (
              <Card key={painPoint.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(painPoint.status)}
                        <CardTitle className="text-lg">{painPoint.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {painPoint.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className={getCategoryColor(painPoint.category)}>
                          {painPoint.category}
                        </Badge>
                        <Badge className={getSeverityColor(painPoint.severity)}>
                          {painPoint.severity}
                        </Badge>
                        <Badge className={getStatusColor(painPoint.status)}>
                          {painPoint.status}
                        </Badge>
                        <Badge variant="outline">
                          Priority: {painPoint.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {new Date(painPoint.reportedDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {painPoint.affectedUsers} users affected
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Reported by:</span>
                      <span className="ml-2 font-medium">{painPoint.reportedBy}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="ml-2 font-medium">{painPoint.frequency}% of users</span>
                    </div>
                    {painPoint.assignedTo && (
                      <div>
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span className="ml-2 font-medium">{painPoint.assignedTo}</span>
                      </div>
                    )}
                    {painPoint.estimatedResolution && (
                      <div>
                        <span className="text-muted-foreground">Est. resolution:</span>
                        <span className="ml-2 font-medium">{new Date(painPoint.estimatedResolution).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Impact:</h5>
                    <p className="text-sm text-muted-foreground">{painPoint.impact}</p>
                  </div>

                  {painPoint.resolution && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Resolution:</strong> {painPoint.resolution}
                      </AlertDescription>
                    </Alert>
                  )}

                  {painPoint.userFeedback && painPoint.userFeedback.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        User Feedback:
                      </h5>
                      <div className="space-y-2">
                        {painPoint.userFeedback.map((feedback, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <ThumbsUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feedback}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {painPoint.metrics.improvement && (
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Impact Measurement:
                      </h5>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Before:</span>
                          <span className="ml-2 font-medium">{painPoint.metrics.before}% affected</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">After:</span>
                          <span className="ml-2 font-medium">{painPoint.metrics.after}% affected</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Improvement:</span>
                          <span className="ml-2 font-medium text-green-600">{painPoint.metrics.improvement}%</span>
                        </div>
                      </div>
                      <Progress value={painPoint.metrics.improvement} className="h-2 mt-2" />
                    </div>
                  )}

                  {painPoint.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {painPoint.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics && Object.entries(metrics.categoryBreakdown).map(([category, count]) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium capitalize">{category}</span>
                        <span className="text-sm text-muted-foreground">{count} issues</span>
                      </div>
                      <Progress value={(count / metrics.totalPainPoints) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Severity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics && Object.entries(metrics.severityBreakdown).map(([severity, count]) => (
                    <div key={severity} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium capitalize">{severity}</span>
                        <span className="text-sm text-muted-foreground">{count} issues</span>
                      </div>
                      <Progress value={(count / metrics.totalPainPoints) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resolution Impact Analysis
              </CardTitle>
              <CardDescription>
                Measurable impact of resolved pain points on user experience and business metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                {painPoints.filter(pp => pp.status === 'resolved' && pp.metrics.improvement).map((painPoint) => (
                  <div key={painPoint.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{painPoint.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{painPoint.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{painPoint.metrics.improvement}%</div>
                        <div className="text-sm text-muted-foreground">improvement</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-red-50 rounded">
                        <div className="text-lg font-bold text-red-600">{painPoint.metrics.before}%</div>
                        <div className="text-sm text-red-600">Before</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{painPoint.metrics.after}%</div>
                        <div className="text-sm text-green-600">After</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{painPoint.affectedUsers}</div>
                        <div className="text-sm text-blue-600">Users Helped</div>
                      </div>
                    </div>

                    {painPoint.resolution && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <h5 className="font-medium text-green-800 mb-1">Solution:</h5>
                        <p className="text-sm text-green-700">{painPoint.resolution}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}