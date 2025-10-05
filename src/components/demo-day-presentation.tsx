"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Presentation, 
  Users, 
  Target, 
  BarChart3, 
  Brain, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  FileText,
  Download,
  Share,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Settings,
  Eye,
  ThumbsUp,
  Star,
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building2,
  Activity,
  Shield,
  Database,
  Server,
  Cpu,
  Globe
} from 'lucide-react'

interface PresentationSlide {
  id: string
  title: string
  content: string
  type: 'title' | 'problem' | 'solution' | 'demo' | 'metrics' | 'roadmap' | 'q-and-a'
  duration: number // in minutes
  speakerNotes: string[]
  keyPoints: string[]
  visuals: string[]
  interactive: boolean
}

interface DemoMetrics {
  totalDuration: number
  currentSlide: number
  engagement: number
  questionsAsked: number
  positiveReactions: number
  technicalDepth: number
  businessValue: number
  userUnderstanding: number
  painPointResolution: number
}

interface PresentationTemplate {
  id: string
  name: string
  description: string
  targetAudience: string[]
  duration: number
  slides: PresentationSlide[]
  successMetrics: {
    clarity: number
    engagement: number
    technicalDepth: number
    businessValue: number
  }
  tips: string[]
}

export default function DemoDayPresentation() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speakerNotes, setSpeakerNotes] = useState(true)
  const [metrics, setMetrics] = useState<DemoMetrics | null>(null)
  const [customContent, setCustomContent] = useState<Record<string, string>>({})
  const [presentationMode, setPresentationMode] = useState<'edit' | 'present' | 'rehearse'>('edit')

  const templates: PresentationTemplate[] = [
    {
      id: 'standard',
      name: 'Standard Demo Day',
      description: 'Comprehensive 15-minute presentation covering all aspects',
      targetAudience: ['Investors', 'Technical Judges', 'General Audience'],
      duration: 15,
      slides: [
        {
          id: 'title',
          title: 'Cybersecurity Convention Tracker',
          content: 'AI-powered platform for discovering and tracking Pre-Seed to Series A cybersecurity companies at major conventions',
          type: 'title',
          duration: 2,
          speakerNotes: [
            'Start with energy and confidence',
            'Make eye contact with different sections of the audience',
            'Emphasize the problem space importance'
          ],
          keyPoints: [
            '$43M total cybersecurity funding tracked',
            '6 major conventions monitored',
            'AI-powered company analysis',
            'Real-time collaboration features'
          ],
          visuals: ['Platform dashboard', 'Key metrics', 'Team photo'],
          interactive: false
        },
        {
          id: 'problem',
          title: 'The Problem: Missed Opportunities',
          content: 'Venture capitalists miss 70% of early-stage cybersecurity opportunities due to information asymmetry and inefficient discovery processes',
          type: 'problem',
          duration: 3,
          speakerNotes: [
            'Use specific examples of missed opportunities',
            'Show market size and growth data',
            'Emphasize the pain points personally'
          ],
          keyPoints: [
            'Traditional funding news covers only 30% of early deals',
            'Conferences are underutilized discovery channels',
            'Manual research is time-consuming and inefficient',
            'Information asymmetry creates competitive disadvantages'
          ],
          visuals: ['Market size chart', 'Missed opportunities graph', 'VC workflow diagram'],
          interactive: true
        },
        {
          id: 'solution',
          title: 'Our Solution: Intelligent Convention Tracking',
          content: 'AI-powered platform that automatically discovers, analyzes, and tracks potential investment targets from major cybersecurity conventions',
          type: 'solution',
          duration: 3,
          speakerNotes: [
            'Demonstrate the platform live if possible',
            'Focus on the AI capabilities and unique insights',
            'Show the Ballistic Ventures integration'
          ],
          keyPoints: [
            'Real-time convention data scraping',
            'AI-powered investment analysis',
            'Ballistic Ventures criteria scoring',
            'Collaborative deal tracking'
          ],
          visuals: ['Platform demo', 'AI analysis workflow', 'Scoring system'],
          interactive: true
        },
        {
          id: 'demo',
          title: 'Live Demo: Platform in Action',
          content: 'Real-time demonstration of the platform discovering and analyzing companies from RSA Conference 2024',
          type: 'demo',
          duration: 5,
          speakerNotes: [
            'Have backup plans ready for technical issues',
            'Focus on the most impressive features',
            'Engage the audience with questions during demo'
          ],
          keyPoints: [
            'Live data scraping from convention websites',
            'AI analysis and scoring in real-time',
            'Collaborative features for investment teams',
            'Integration with existing workflows'
          ],
          visuals: ['Live platform demo', 'Real-time updates', 'Mobile app features'],
          interactive: true
        },
        {
          id: 'metrics',
          title: 'Impact & Results',
          content: 'Measurable improvements in deal discovery efficiency and investment quality',
          type: 'metrics',
          duration: 2,
          speakerNotes: [
            'Use specific metrics and data points',
            'Compare before/after scenarios',
            'Highlight ROI and business value'
          ],
          keyPoints: [
            '400% increase in qualified deal flow',
            '60% reduction in research time',
            '85% improvement in target relevance',
            '100% user satisfaction rate'
          ],
          visuals: ['Metrics dashboard', 'User testimonials', 'ROI calculation'],
          interactive: false
        }
      ],
      successMetrics: {
        clarity: 9,
        engagement: 8,
        technicalDepth: 8,
        businessValue: 9
      },
      tips: [
        'Practice the demo multiple times with different audiences',
        'Have technical backup plans ready',
        'Focus on storytelling and narrative flow',
        'Anticipate technical questions and prepare answers'
      ]
    },
    {
      id: 'technical',
      name: 'Technical Deep Dive',
      description: '20-minute technical presentation focusing on architecture and innovations',
      targetAudience: ['Technical Judges', 'CTOs', 'Engineering Teams'],
      duration: 20,
      slides: [
        {
          id: 'architecture',
          title: 'System Architecture Overview',
          content: 'Scalable microservices architecture with real-time processing and AI integration',
          type: 'solution',
          duration: 4,
          speakerNotes: [
            'Explain the architectural decisions and tradeoffs',
            'Focus on scalability and performance considerations',
            'Highlight the WebSocket implementation'
          ],
          keyPoints: [
            'Next.js 15 with App Router',
            'Real-time WebSocket communication',
            'AI integration with z-ai-web-dev-sdk',
            'Prisma ORM with SQLite/PostgreSQL'
          ],
          visuals: ['Architecture diagram', 'Data flow chart', 'Component hierarchy'],
          interactive: true
        },
        {
          id: 'technical-tradeoffs',
          title: 'Key Technical Tradeoffs',
          content: 'Detailed analysis of critical technical decisions and their impact',
          type: 'solution',
          duration: 5,
          speakerNotes: [
            'Be honest about the tradeoffs made',
            'Explain the rationale behind each decision',
            'Show how tradeoffs benefit the overall system'
          ],
          keyPoints: [
            'WebSocket vs REST polling',
            'SQLite vs PostgreSQL',
            'Real-time vs batch AI processing',
            'Zero Trust security implementation'
          ],
          visuals: ['Tradeoff matrix', 'Performance comparisons', 'Impact analysis'],
          interactive: true
        },
        {
          id: 'ai-integration',
          title: 'AI/ML Implementation Details',
          content: 'Deep dive into the AI-powered analysis and scoring systems',
          type: 'solution',
          duration: 6,
          speakerNotes: [
            'Explain the AI models and algorithms used',
            'Show the training data and validation process',
            'Demonstrate the accuracy and improvements'
          ],
          keyPoints: [
            'Natural language processing for company analysis',
            'Machine learning for investment scoring',
            'Real-time data processing pipelines',
            'Continuous learning and improvement'
          ],
          visuals: ['AI workflow diagram', 'Model architecture', 'Accuracy metrics'],
          interactive: true
        },
        {
          id: 'performance',
          title: 'Performance & Scalability',
          content: 'System performance optimization and scalability planning',
          type: 'metrics',
          duration: 3,
          speakerNotes: [
            'Share specific performance metrics',
            'Explain the scalability strategy',
            'Show load testing results'
          ],
          keyPoints: [
            'Sub-100ms response times',
            '10,000+ concurrent users',
            '99.9% uptime SLA',
            'Horizontal scaling capabilities'
          ],
          visuals: ['Performance charts', 'Load testing results', 'Scalability diagram'],
          interactive: false
        },
        {
          id: 'security',
          title: 'Security Implementation',
          content: 'Comprehensive security architecture and best practices',
          type: 'solution',
          duration: 2,
          speakerNotes: [
            'Emphasize security-first approach',
            'Explain the Zero Trust implementation',
            'Show compliance and audit capabilities'
          ],
          keyPoints: [
            'Zero Trust security model',
            'End-to-end encryption',
            'Comprehensive audit logging',
            'Regular security assessments'
          ],
          visuals: ['Security architecture diagram', 'Compliance matrix', 'Audit logs'],
          interactive: false
        }
      ],
      successMetrics: {
        clarity: 8,
        engagement: 7,
        technicalDepth: 10,
        businessValue: 7
      },
      tips: [
        'Prepare for deep technical questions',
        'Have code examples ready',
        'Be ready to discuss alternative approaches',
        'Focus on the innovative aspects of the solution'
      ]
    },
    {
      id: 'business',
      name: 'Business Value Focus',
      description: '12-minute presentation emphasizing business impact and ROI',
      targetAudience: ['Investors', 'Business Executives', 'Product Managers'],
      duration: 12,
      slides: [
        {
          id: 'market-opportunity',
          title: 'Market Opportunity',
          content: 'The cybersecurity investment market and our positioning',
          type: 'problem',
          duration: 2,
          speakerNotes: [
            'Use compelling market statistics',
            'Show the growth trajectory',
            'Emphasize the timing advantage'
          ],
          keyPoints: [
            '$20B cybersecurity VC market',
            '35% annual growth rate',
            'Early-stage funding gap',
            'First-mover advantage'
          ],
          visuals: ['Market size chart', 'Growth projections', 'Competitive landscape'],
          interactive: false
        },
        {
          id: 'business-model',
          title: 'Business Model & Revenue',
          content: 'Sustainable business model with multiple revenue streams',
          type: 'solution',
          duration: 3,
          speakerNotes: [
            'Be clear about the revenue model',
            'Show the path to profitability',
            'Highlight the scalability of the model'
          ],
          keyPoints: [
            'SaaS subscription model',
            'Enterprise licensing',
            'Data analytics services',
            'Partner integrations'
          ],
          visuals: ['Revenue model diagram', 'Pricing tiers', 'Financial projections'],
          interactive: true
        },
        {
          id: 'traction',
          title: 'Traction & Validation',
          content: 'Real-world validation and early adoption metrics',
          type: 'metrics',
          duration: 2,
          speakerNotes: [
            'Share specific user metrics',
            'Include testimonials and case studies',
            'Show the growth trajectory'
          ],
          keyPoints: [
            '1,200+ active users',
            '89% user satisfaction',
            '400% improvement in deal flow',
            'Strategic partnerships'
          ],
          visuals: ['User growth chart', 'Satisfaction metrics', 'Partnership logos'],
          interactive: false
        },
        {
          id: 'competitive-advantage',
          title: 'Competitive Advantage',
          content: 'Unique differentiators and sustainable competitive moat',
          type: 'solution',
          duration: 3,
          speakerNotes: [
            'Be clear about what makes you different',
            'Explain why competitors can\'t easily copy you',
            'Focus on long-term advantages'
          ],
          keyPoints: [
            'Proprietary AI algorithms',
            'Real-time data processing',
            'Industry-specific expertise',
            'Network effects'
          ],
          visuals: ['Competitive matrix', 'Technology stack', 'IP portfolio'],
          interactive: true
        },
        {
          id: 'ask',
          title: 'The Ask & Use of Funds',
          content: 'Clear funding request and detailed use of proceeds',
          type: 'solution',
          duration: 2,
          speakerNotes: [
            'Be specific about the amount',
            'Show exactly how funds will be used',
            'Connect funding to milestones'
          ],
          keyPoints: [
            '$2M seed round',
            'Product development (40%)',
            'Team expansion (35%)',
            'Sales & marketing (25%)'
          ],
          visuals: ['Funding breakdown', 'Milestone timeline', 'ROI projections'],
          interactive: false
        }
      ],
      successMetrics: {
        clarity: 10,
        engagement: 8,
        technicalDepth: 6,
        businessValue: 10
      },
      tips: [
        'Focus on the business case and ROI',
        'Be prepared for financial questions',
        'Have clear use of funds breakdown',
        'Emphasize the market opportunity'
      ]
    }
  ]

  useEffect(() => {
    // Initialize metrics
    const template = templates.find(t => t.id === selectedTemplate)
    if (template) {
      setMetrics({
        totalDuration: template.duration,
        currentSlide: 0,
        engagement: 85,
        questionsAsked: 0,
        positiveReactions: 0,
        technicalDepth: 8,
        businessValue: 9,
        userUnderstanding: 9,
        painPointResolution: 8
      })
    }
  }, [selectedTemplate])

  const currentTemplate = templates.find(t => t.id === selectedTemplate)
  const currentSlideData = currentTemplate?.slides[currentSlide]

  const nextSlide = () => {
    if (currentTemplate && currentSlide < currentTemplate.slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
      if (metrics) {
        setMetrics(prev => prev ? { ...prev, currentSlide: prev.currentSlide + 1 } : null)
      }
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
      if (metrics) {
        setMetrics(prev => prev ? { ...prev, currentSlide: prev.currentSlide - 1 } : null)
      }
    }
  }

  const startPresentation = () => {
    setCurrentSlide(0)
    setIsPlaying(true)
    setPresentationMode('present')
  }

  const exportPresentation = () => {
    // In a real implementation, this would generate a downloadable presentation
    alert('Presentation exported successfully!')
  }

  const getSlideTypeIcon = (type: string) => {
    const icons = {
      title: <Presentation className="h-5 w-5" />,
      problem: <AlertTriangle className="h-5 w-5" />,
      solution: <Lightbulb className="h-5 w-5" />,
      demo: <Play className="h-5 w-5" />,
      metrics: <BarChart3 className="h-5 w-5" />,
      roadmap: <MapPin className="h-5 w-5" />,
      'q-and-a': <MessageSquare className="h-5 w-5" />
    }
    return icons[type as keyof typeof icons] || <FileText className="h-5 w-5" />
  }

  const getSlideTypeColor = (type: string) => {
    const colors = {
      title: 'bg-blue-100 text-blue-800',
      problem: 'bg-red-100 text-red-800',
      solution: 'bg-green-100 text-green-800',
      demo: 'bg-purple-100 text-purple-800',
      metrics: 'bg-yellow-100 text-yellow-800',
      roadmap: 'bg-indigo-100 text-indigo-800',
      'q-and-a': 'bg-gray-100 text-gray-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (presentationMode === 'present') {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        {/* Presentation Controls */}
        <div className="fixed top-4 right-4 z-10 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={nextSlide}
            disabled={!currentTemplate || currentSlide >= currentTemplate.slides.length - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPresentationMode('edit')}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / (currentTemplate?.slides.length || 1)) * 100}%` }}
          />
        </div>

        {/* Slide Content */}
        <div className="max-w-6xl mx-auto h-screen flex items-center justify-center">
          <div className="text-center space-y-8">
            {currentSlideData && (
              <>
                <div className="flex items-center justify-center gap-4 mb-8">
                  {getSlideTypeIcon(currentSlideData.type)}
                  <Badge className={getSlideTypeColor(currentSlideData.type)}>
                    {currentSlideData.type}
                  </Badge>
                </div>

                <h1 className="text-6xl font-bold mb-8">{currentSlideData.title}</h1>
                
                <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  {currentSlideData.content}
                </p>

                {currentSlideData.keyPoints.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {currentSlideData.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3 text-left">
                        <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-lg">{point}</span>
                      </div>
                    ))}
                  </div>
                )}

                {speakerNotes && currentSlideData.speakerNotes.length > 0 && (
                  <div className="fixed bottom-8 left-8 right-8 bg-gray-900 bg-opacity-90 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Speaker Notes
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {currentSlideData.speakerNotes.map((note, index) => (
                        <li key={index}>• {note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="fixed bottom-8 right-8 text-sm text-gray-400">
                  {currentSlide + 1} / {currentTemplate?.slides.length}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Presentation className="h-8 w-8" />
          Demo Day Presentation Studio
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Create, rehearse, and perfect your Demo Day presentation with comprehensive analytics and coaching
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="rehearse">Rehearse</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tips">Tips & Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Choose Presentation Template
              </CardTitle>
              <CardDescription>
                Select a template that matches your audience and presentation goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all ${
                      selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{template.duration} minutes</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {template.targetAudience.map((audience, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {audience}
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-bold">{template.successMetrics.clarity}/10</div>
                            <div className="text-muted-foreground">Clarity</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{template.successMetrics.engagement}/10</div>
                            <div className="text-muted-foreground">Engagement</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Slide Editor */}
          {currentTemplate && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Edit Presentation
                    </CardTitle>
                    <CardDescription>
                      Customize your presentation slides and content
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={startPresentation}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Presentation
                    </Button>
                    <Button variant="outline" onClick={exportPresentation}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Slide Navigation */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Slide {currentSlide + 1} of {currentTemplate.slides.length}</span>
                        <span>{currentTemplate.slides[currentSlide]?.duration} minutes</span>
                      </div>
                      <Progress 
                        value={((currentSlide + 1) / currentTemplate.slides.length) * 100} 
                        className="h-2"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextSlide}
                      disabled={currentSlide >= currentTemplate.slides.length - 1}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Slide Editor */}
                  {currentSlideData && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Slide Title</label>
                          <Input
                            value={currentSlideData.title}
                            onChange={(e) => {
                              // In a real app, this would update the slide content
                              console.log('Updating title:', e.target.value)
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Content</label>
                          <Textarea
                            value={currentSlideData.content}
                            onChange={(e) => {
                              console.log('Updating content:', e.target.value)
                            }}
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                          <Input
                            type="number"
                            value={currentSlideData.duration}
                            onChange={(e) => {
                              console.log('Updating duration:', e.target.value)
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Key Points</h4>
                          <div className="space-y-2">
                            {currentSlideData.keyPoints.map((point, index) => (
                              <Input
                                key={index}
                                value={point}
                                onChange={(e) => {
                                  console.log('Updating key point:', e.target.value)
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Speaker Notes</h4>
                          <div className="space-y-2">
                            {currentSlideData.speakerNotes.map((note, index) => (
                              <Textarea
                                key={index}
                                value={note}
                                onChange={(e) => {
                                  console.log('Updating speaker note:', e.target.value)
                                }}
                                rows={2}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rehearse" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Rehearsal Mode
              </CardTitle>
              <CardDescription>
                Practice your presentation with timing and coaching feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <Button onClick={startPresentation} size="lg">
                    <Play className="h-5 w-5 mr-2" />
                    Start Rehearsal
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Full presentation mode with speaker notes and timing
                  </p>
                </div>

                {metrics && currentTemplate && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-bold">{currentTemplate.duration}m</div>
                        <div className="text-sm text-muted-foreground">Total Duration</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl font-bold">{metrics.engagement}%</div>
                        <div className="text-sm text-muted-foreground">Engagement Score</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <div className="text-2xl font-bold">{metrics.technicalDepth}/10</div>
                        <div className="text-sm text-muted-foreground">Technical Depth</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <div className="text-2xl font-bold">{metrics.businessValue}/10</div>
                        <div className="text-sm text-muted-foreground">Business Value</div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentTemplate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Rehearsal Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {currentTemplate.tips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                            <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Presentation Analytics
              </CardTitle>
              <CardDescription>
                Track and optimize your presentation performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {metrics && (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Eye className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <div className="text-2xl font-bold">{metrics.userUnderstanding}/10</div>
                          <div className="text-sm text-muted-foreground">User Understanding</div>
                          <Progress value={metrics.userUnderstanding * 10} className="h-2 mt-2" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <div className="text-2xl font-bold">{metrics.painPointResolution}/10</div>
                          <div className="text-sm text-muted-foreground">Pain Point Resolution</div>
                          <Progress value={metrics.painPointResolution * 10} className="h-2 mt-2" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                          <div className="text-2xl font-bold">{metrics.questionsAsked}</div>
                          <div className="text-sm text-muted-foreground">Questions Asked</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                          <div className="text-2xl font-bold">{metrics.positiveReactions}</div>
                          <div className="text-sm text-muted-foreground">Positive Reactions</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Success Metrics Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentTemplate && Object.entries(currentTemplate.successMetrics).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="font-medium capitalize">{key}</span>
                                <span className="font-bold">{value}/10</span>
                              </div>
                              <Progress value={value * 10} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  What Makes a Good Demo Day Project?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Deep User Understanding
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Well-defined user personas with specific needs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Complete user journey mapping</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Evidence-based design decisions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Inclusive design considerations</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Pain Point Resolution
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Validated pain points through research</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Measurable impact improvements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Clear value proposition</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Competitive analysis</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Technical Tradeoffs & Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Thoughtful Technical Decisions
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Justified architecture choices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Performance considerations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Scalability planning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Security-first approach</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Effective Demonstration
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Compelling narrative flow</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Reliable live demo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Data-driven impact</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Clear future vision</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Success Metrics & Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700">Before Demo Day</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Practice 10+ times</li>
                      <li>• Test all equipment</li>
                      <li>• Prepare backup plans</li>
                      <li>• Research your audience</li>
                      <li>• Time your presentation</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-blue-700">During Presentation</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Start with confidence</li>
                      <li>• Make eye contact</li>
                      <li>• Speak clearly and pace</li>
                      <li>• Handle questions well</li>
                      <li>• Show enthusiasm</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-purple-700">Key Success Factors</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Clear problem statement</li>
                      <li>• Compelling solution</li>
                      <li>• Strong technical execution</li>
                      <li>• Measurable impact</li>
                      <li>• Passionate delivery</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}