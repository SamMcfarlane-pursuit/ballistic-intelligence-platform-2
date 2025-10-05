"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BarChart3, 
  Database, 
  Zap, 
  Shield, 
  Brain, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Users,
  Server,
  Cloud,
  Lock,
  Globe,
  Cpu,
  MemoryStick,
  Wifi,
  Code,
  Settings,
  Scale,
  Lightbulb,
  FileText,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  PieChart
} from 'lucide-react'

interface TechnicalTradeoff {
  id: string
  title: string
  category: 'architecture' | 'database' | 'performance' | 'security' | 'scalability' | 'ai-ml'
  description: string
  decision: string
  alternatives: Alternative[]
  rationale: {
    pros: string[]
    cons: string[]
    justification: string
  }
  impact: {
    performance: ImpactMetric
    scalability: ImpactMetric
    maintainability: ImpactMetric
    security: ImpactMetric
    cost: ImpactMetric
  }
  futureConsiderations: string[]
  status: 'implemented' | 'evaluating' | 'planned'
  implementationDate?: string
  results?: {
    expected: string[]
    actual?: string[]
    metrics?: Record<string, number>
  }
}

interface Alternative {
  name: string
  description: string
  pros: string[]
  cons: string[]
  feasibility: 'high' | 'medium' | 'low'
}

interface ImpactMetric {
  score: number // 1-10 scale
  description: string
  trend: 'positive' | 'negative' | 'neutral'
}

export default function TechnicalTradeoffs() {
  const [tradeoffs, setTradeoffs] = useState<TechnicalTradeoff[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTradeoffs()
  }, [])

  const loadTradeoffs = async () => {
    setLoading(true)
    // Simulate API call with comprehensive tradeoff data
    setTimeout(() => {
      const mockTradeoffs: TechnicalTradeoff[] = [
        {
          id: 'arch1',
          title: 'Real-time Architecture: WebSocket vs REST Polling',
          category: 'architecture',
          description: 'Decision between WebSocket for real-time updates vs traditional REST polling for convention tracking data',
          decision: 'WebSocket with Socket.IO for real-time updates',
          alternatives: [
            {
              name: 'REST Polling',
              description: 'Traditional REST API with client-side polling',
              pros: ['Simpler implementation', 'Better browser support', 'Easier caching'],
              cons: ['Higher latency', 'Increased server load', 'Poor user experience'],
              feasibility: 'high'
            },
            {
              name: 'Server-Sent Events (SSE)',
              description: 'Unidirectional real-time updates from server',
              pros: ['Simpler than WebSocket', 'Built-in reconnection', 'HTTP-based'],
              cons: ['Unidirectional only', 'Limited browser support', 'No binary data'],
              feasibility: 'medium'
            }
          ],
          rationale: {
            pros: [
              'Real-time updates improve user experience',
              'Reduced server load compared to polling',
              'Bidirectional communication enables collaboration',
              'Better scalability for growing user base'
            ],
            cons: [
              'Increased complexity in implementation',
              'Higher memory usage on server',
              'Connection management overhead',
              'Potential firewall/proxy issues'
            ],
            justification: 'The real-time nature of convention tracking and collaborative features justify the added complexity. WebSocket provides the best user experience for time-sensitive investment decisions.'
          },
          impact: {
            performance: { score: 8, description: 'Significant performance improvement for real-time features', trend: 'positive' },
            scalability: { score: 7, description: 'Good scalability with proper connection management', trend: 'positive' },
            maintainability: { score: 6, description: 'Moderate complexity increase', trend: 'negative' },
            security: { score: 7, description: 'Secure with proper implementation', trend: 'positive' },
            cost: { score: 6, description: 'Moderate increase in infrastructure costs', trend: 'negative' }
          },
          futureConsiderations: [
            'Implement connection pooling and load balancing',
            'Add fallback to SSE for compatibility',
            'Monitor connection metrics and optimize',
            'Consider WebRTC for P2P features'
          ],
          status: 'implemented',
          implementationDate: '2024-01-10',
          results: {
            expected: [
              'Reduced latency from 5s to <100ms',
              'Improved user engagement',
              'Better collaborative features'
            ],
            actual: [
              'Average latency: 85ms',
              'User engagement increased by 45%',
              'Real-time collaboration working effectively'
            ],
            metrics: {
              latency: 85,
              engagementIncrease: 45,
              connectionSuccess: 98.5
            }
          }
        },
        {
          id: 'db1',
          title: 'Database Choice: SQLite vs PostgreSQL for Initial Development',
          category: 'database',
          description: 'Selection between SQLite for simplicity vs PostgreSQL for scalability in the initial development phase',
          decision: 'SQLite for development with migration path to PostgreSQL',
          alternatives: [
            {
              name: 'PostgreSQL',
              description: 'Full-featured relational database with strong scalability',
              pros: ['Excellent scalability', 'Advanced features', 'Better concurrency', 'Production-ready'],
              cons: ['Complex setup', 'Higher resource usage', 'Steeper learning curve'],
              feasibility: 'high'
            },
            {
              name: 'MongoDB',
              description: 'NoSQL document database for flexible schema',
              pros: ['Flexible schema', 'Horizontal scaling', 'Developer friendly'],
              cons: ['No ACID guarantees', 'Complex transactions', 'Data consistency challenges'],
              feasibility: 'medium'
            }
          ],
          rationale: {
            pros: [
              'Zero configuration for development',
              'Single file deployment simplicity',
              'Fast for read-heavy operations',
              'Easy backup and migration'
            ],
            cons: [
              'Limited concurrency support',
              'No built-in replication',
              'Scalability limitations',
              'Fewer advanced features'
            ],
            justification: 'SQLite provides the fastest path to MVP while maintaining a clear migration path to PostgreSQL for production scaling.'
          },
          impact: {
            performance: { score: 8, description: 'Excellent performance for development and moderate load', trend: 'positive' },
            scalability: { score: 4, description: 'Limited scalability without migration', trend: 'negative' },
            maintainability: { score: 9, description: 'Very easy to maintain and develop', trend: 'positive' },
            security: { score: 7, description: 'Good security with proper configuration', trend: 'positive' },
            cost: { score: 9, description: 'Very low infrastructure costs', trend: 'positive' }
          },
          futureConsiderations: [
            'Implement automated migration scripts to PostgreSQL',
            'Add connection pooling for better performance',
            'Monitor database performance metrics',
            'Plan for read replicas for scaling'
          ],
          status: 'implemented',
          implementationDate: '2024-01-01',
          results: {
            expected: [
              'Rapid development cycle',
              'Easy deployment and testing',
              'Smooth migration path'
            ],
            actual: [
              'Development time reduced by 40%',
              'Zero database configuration issues',
              'Migration scripts tested and ready'
            ],
            metrics: {
              developmentSpeed: 40,
              migrationReadiness: 100,
              performanceRating: 8.5
            }
          }
        },
        {
          id: 'perf1',
          title: 'AI Integration: Real-time Processing vs Batch Processing',
          category: 'ai-ml',
          description: 'Choice between real-time AI analysis for immediate feedback vs batch processing for better resource management',
          decision: 'Hybrid approach with real-time for critical features and batch for background analysis',
          alternatives: [
            {
              name: 'Pure Real-time',
              description: 'All AI processing happens in real-time',
              pros: ['Immediate feedback', 'Better user experience', 'Up-to-date results'],
              cons: ['High resource usage', 'Potential bottlenecks', 'Costly infrastructure'],
              feasibility: 'medium'
            },
            {
              name: 'Pure Batch',
              description: 'All AI processing in batch jobs',
              pros: ['Resource efficient', 'Cost effective', 'Predictable load'],
              cons: ['Delayed results', 'Poor user experience', 'Stale data'],
              feasibility: 'high'
            }
          ],
          rationale: {
            pros: [
              'Optimal balance between user experience and resource usage',
              'Critical features get immediate feedback',
              'Background processing doesn\'t block user actions',
              'Cost-effective scaling'
            ],
            cons: [
              'Increased system complexity',
              'Need for priority queue management',
              'Potential inconsistency between real-time and batch results',
              'More complex monitoring required'
            ],
            justification: 'The hybrid approach provides the best of both worlds: immediate feedback for critical investment decisions while optimizing resource usage for background analysis.'
          },
          impact: {
            performance: { score: 8, description: 'Good performance with responsive critical features', trend: 'positive' },
            scalability: { score: 8, description: 'Excellent scalability with load balancing', trend: 'positive' },
            maintainability: { score: 6, description: 'Moderate complexity due to hybrid approach', trend: 'negative' },
            security: { score: 8, description: 'Good security with proper isolation', trend: 'positive' },
            cost: { score: 7, description: 'Good cost optimization with batch processing', trend: 'positive' }
          },
          futureConsiderations: [
            'Implement intelligent priority queuing',
            'Add auto-scaling for AI processing',
            'Monitor and optimize batch window sizes',
            'Consider edge computing for distributed processing'
          ],
          status: 'implemented',
          implementationDate: '2024-01-15',
          results: {
            expected: [
              'Critical analysis under 1 second',
              'Background processing without user impact',
              '50% reduction in AI processing costs'
            ],
            actual: [
              'Average critical analysis: 850ms',
              'No user impact from background jobs',
              'AI costs reduced by 55%'
            ],
            metrics: {
              criticalLatency: 850,
              backgroundJobsSuccess: 99.2,
              costReduction: 55
            }
          }
        },
        {
          id: 'sec1',
          title: 'Security Approach: Zero Trust vs Traditional Security Model',
          category: 'security',
          description: 'Implementation of Zero Trust security principles vs traditional perimeter-based security',
          decision: 'Zero Trust architecture with continuous verification',
          alternatives: [
            {
              name: 'Traditional Security',
              description: 'Perimeter-based security with trusted internal network',
              pros: ['Simpler implementation', 'Lower performance overhead', 'Easier to manage'],
              cons: ['Vulnerable to insider threats', 'Single point of failure', 'Limited visibility'],
              feasibility: 'high'
            },
            {
              name: 'Hybrid Approach',
              description: 'Combination of perimeter security and selective Zero Trust',
              pros: ['Balance of security and complexity', 'Gradual implementation', 'Risk-based access'],
              cons: ['Complex configuration', 'Potential gaps in coverage', 'Higher costs'],
              feasibility: 'medium'
            }
          ],
          rationale: {
            pros: [
              'Enhanced security against modern threats',
              'Granular access control',
              'Better visibility and monitoring',
              'Protection against insider threats'
            ],
            cons: [
              'Increased implementation complexity',
              'Higher performance overhead',
              'More user friction',
              'Ongoing maintenance requirements'
            ],
            justification: 'Given the sensitive nature of investment data and the need for regulatory compliance, Zero Trust provides the best security posture despite the added complexity.'
          },
          impact: {
            performance: { score: 6, description: 'Moderate performance impact due to verification overhead', trend: 'negative' },
            scalability: { score: 8, description: 'Good scalability with distributed verification', trend: 'positive' },
            maintainability: { score: 5, description: 'Higher complexity in maintenance', trend: 'negative' },
            security: { score: 10, description: 'Excellent security posture', trend: 'positive' },
            cost: { score: 4, description: 'Higher implementation and maintenance costs', trend: 'negative' }
          },
          futureConsiderations: [
            'Implement AI-powered anomaly detection',
            'Add adaptive authentication based on risk',
            'Optimize verification processes for performance',
            'Integrate with threat intelligence feeds'
          ],
          status: 'evaluating',
          results: {
            expected: [
              'Reduced security incidents by 80%',
              'Better compliance with regulations',
              'Enhanced monitoring capabilities'
            ],
            metrics: {
              securityPosture: 9.5,
              complianceScore: 95,
              monitoringCoverage: 100
            }
          }
        },
        {
          id: 'scale1',
          title: 'Caching Strategy: Redis vs In-Memory Caching',
          category: 'scalability',
          description: 'Selection between distributed Redis caching vs local in-memory caching for performance optimization',
          decision: 'Hybrid approach with Redis for shared data and in-memory for local caches',
          alternatives: [
            {
              name: 'Redis Only',
              description: 'All caching through distributed Redis',
              pros: ['Consistent data across instances', 'Easy to scale', 'Rich feature set'],
              cons: ['Network latency', 'Single point of failure', 'Higher costs'],
              feasibility: 'high'
            },
            {
              name: 'In-Memory Only',
              description: 'Local in-memory caching in each instance',
              pros: ['Fastest performance', 'No network overhead', 'Simple implementation'],
              cons: ['Data inconsistency', 'No sharing between instances', 'Memory limits'],
              feasibility: 'medium'
            }
          ],
          rationale: {
            pros: [
              'Optimal performance with local caches',
              'Data consistency with Redis for shared data',
              'Scalable architecture',
              'Cost-effective resource usage'
            ],
            cons: [
              'Increased complexity in cache management',
              'Potential for cache inconsistency',
              'Need for cache invalidation strategies',
              'More monitoring required'
            ],
            justification: 'The hybrid approach provides the best balance of performance and consistency, using local caches for speed and Redis for shared state.'
          },
          impact: {
            performance: { score: 9, description: 'Excellent performance with multi-layer caching', trend: 'positive' },
            scalability: { score: 9, description: 'Excellent scalability with distributed architecture', trend: 'positive' },
            maintainability: { score: 6, description: 'Moderate complexity in cache management', trend: 'negative' },
            security: { score: 8, description: 'Good security with proper configuration', trend: 'positive' },
            cost: { score: 7, description: 'Good cost optimization with hybrid approach', trend: 'positive' }
          },
          futureConsiderations: [
            'Implement intelligent cache warming',
            'Add cache compression for memory optimization',
            'Monitor cache hit rates and optimize',
            'Consider edge caching for global distribution'
          ],
          status: 'planned',
          results: {
            expected: [
              'Cache hit rates above 85%',
              '50% reduction in database load',
              'Sub-millisecond response times'
            ]
          }
        }
      ]

      setTradeoffs(mockTradeoffs)
      setLoading(false)
    }, 1000)
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      architecture: <Server className="h-5 w-5" />,
      database: <Database className="h-5 w-5" />,
      performance: <Zap className="h-5 w-5" />,
      security: <Shield className="h-5 w-5" />,
      scalability: <Activity className="h-5 w-5" />,
      'ai-ml': <Brain className="h-5 w-5" />
    }
    return icons[category as keyof typeof icons] || <Settings className="h-5 w-5" />
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      architecture: 'bg-blue-100 text-blue-800',
      database: 'bg-green-100 text-green-800',
      performance: 'bg-yellow-100 text-yellow-800',
      security: 'bg-red-100 text-red-800',
      scalability: 'bg-purple-100 text-purple-800',
      'ai-ml': 'bg-indigo-100 text-indigo-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      implemented: 'bg-green-100 text-green-800',
      evaluating: 'bg-yellow-100 text-yellow-800',
      planned: 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getImpactColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'negative': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading technical tradeoffs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Scale className="h-8 w-8" />
          Technical Tradeoffs & Architecture Decisions
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive documentation of technical decisions, alternatives considered, and their impact on the system
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
          <TabsTrigger value="future">Future Considerations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Decisions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tradeoffs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Architecture decisions documented
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Implemented</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {tradeoffs.filter(t => t.status === 'implemented').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Decisions implemented
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evaluating</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {tradeoffs.filter(t => t.status === 'evaluating').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Under evaluation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Planned</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {tradeoffs.filter(t => t.status === 'planned').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Planned for future
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Decision Categories
              </CardTitle>
              <CardDescription>
                Breakdown of technical decisions by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {['architecture', 'database', 'performance', 'security', 'scalability', 'ai-ml'].map(category => {
                  const count = tradeoffs.filter(t => t.category === category).length
                  const percentage = (count / tradeoffs.length) * 100
                  return (
                    <div key={category} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl mb-2">
                        {getCategoryIcon(category)}
                      </div>
                      <div className="text-lg font-bold">{count}</div>
                      <div className="text-sm text-muted-foreground capitalize">{category}</div>
                      <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6">
          <div className="space-y-6">
            {tradeoffs.map((tradeoff) => (
              <Card key={tradeoff.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">
                        {getCategoryIcon(tradeoff.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{tradeoff.title}</CardTitle>
                          <Badge className={getCategoryColor(tradeoff.category)}>
                            {tradeoff.category}
                          </Badge>
                          <Badge className={getStatusColor(tradeoff.status)}>
                            {tradeoff.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">
                          {tradeoff.description}
                        </CardDescription>
                        <div className="mt-3">
                          <p className="text-sm font-medium">
                            Decision: <span className="text-primary">{tradeoff.decision}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Rationale */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Rationale
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Pros:</h5>
                        <ul className="space-y-1">
                          {tradeoff.rationale.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-700 mb-2">Cons:</h5>
                        <ul className="space-y-1">
                          {tradeoff.rationale.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <h5 className="font-medium text-blue-800 mb-1">Justification:</h5>
                      <p className="text-sm text-blue-700">{tradeoff.rationale.justification}</p>
                    </div>
                  </div>

                  {/* Alternatives */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Alternatives Considered
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {tradeoff.alternatives.map((alternative, index) => (
                        <Card key={index} className="border-dashed">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center justify-between">
                              {alternative.name}
                              <Badge variant="outline" className={
                                alternative.feasibility === 'high' ? 'border-green-200 text-green-800' :
                                alternative.feasibility === 'medium' ? 'border-yellow-200 text-yellow-800' :
                                'border-red-200 text-red-800'
                              }>
                                {alternative.feasibility} feasibility
                              </Badge>
                            </CardTitle>
                            <CardDescription>{alternative.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <h5 className="font-medium text-green-700 mb-1">Pros:</h5>
                              <ul className="text-sm space-y-1">
                                {alternative.pros.map((pro, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-red-700 mb-1">Cons:</h5>
                              <ul className="text-sm space-y-1">
                                {alternative.cons.map((con, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                                    <span>{con}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  {tradeoff.results && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Implementation Results
                      </h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-2">Expected:</h5>
                          <ul className="space-y-1">
                            {tradeoff.results.expected.map((expected, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span>{expected}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {tradeoff.results.actual && (
                          <div>
                            <h5 className="font-medium mb-2">Actual:</h5>
                            <ul className="space-y-1">
                              {tradeoff.results.actual.map((actual, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{actual}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {tradeoff.results.metrics && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(tradeoff.results.metrics).map(([key, value]) => (
                            <div key={key} className="text-center p-3 bg-muted rounded">
                              <div className="text-lg font-bold">{value}</div>
                              <div className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <div className="grid gap-6">
            {tradeoffs.map((tradeoff) => (
              <Card key={tradeoff.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {getCategoryIcon(tradeoff.category)}
                    {tradeoff.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-5 gap-4">
                    {Object.entries(tradeoff.impact).map(([area, metric]) => (
                      <div key={area} className="text-center p-4 border rounded-lg">
                        <div className="text-2xl mb-2">
                          {area === 'performance' && <Zap className="h-6 w-6 mx-auto" />}
                          {area === 'scalability' && <Activity className="h-6 w-6 mx-auto" />}
                          {area === 'maintainability' && <Code className="h-6 w-6 mx-auto" />}
                          {area === 'security' && <Shield className="h-6 w-6 mx-auto" />}
                          {area === 'cost' && <BarChart3 className="h-6 w-6 mx-auto" />}
                        </div>
                        <div className={`text-2xl font-bold ${getImpactColor(metric.score)}`}>
                          {metric.score}/10
                        </div>
                        <div className="text-sm font-medium capitalize mb-1">{area}</div>
                        <div className="flex items-center justify-center gap-1">
                          {getTrendIcon(metric.trend)}
                          <span className="text-xs text-muted-foreground">{metric.trend}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="future" className="space-y-6">
          <div className="space-y-6">
            {tradeoffs.map((tradeoff) => (
              <Card key={tradeoff.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {getCategoryIcon(tradeoff.category)}
                    {tradeoff.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Future Considerations
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {tradeoff.futureConsiderations.map((consideration, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{consideration}</span>
                        </div>
                      ))}
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