'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { SecureActionButton } from '@/components/ui/secure-button'
import { 
  Brain,
  FileText,
  TrendingUp,
  Users,
  Lightbulb,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Download,
  RefreshCw,
  Eye,
  Link as LinkIcon,
  Star,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface PartnerNote {
  id: string
  companyName: string
  partnerName: string
  date: string
  stage: string
  decision: 'pass' | 'invest' | 'follow' | 'pending'
  keyPoints: string[]
  concerns: string[]
  strengths: string[]
  marketTiming: string
  teamAssessment: string
  techAssessment: string
  followUpDate?: string
  tags: string[]
}

interface CompanyCorrelation {
  companyName: string
  correlationScore: number
  similarityReasons: string[]
  currentStatus: string
  fundingStage: string
  lastFunding: string
  recommendedAction: 'review' | 'pass' | 'monitor'
  keyDifferences: string[]
  marketEvolution: string
}

interface TrendInsight {
  id: string
  trend: string
  confidence: number
  supportingEvidence: string[]
  relatedCompanies: string[]
  marketImplications: string
  actionableInsights: string[]
  timeframe: string
  partnerRelevance: string[]
}

interface PartnerNotesAnalyzerProps {
  partnerId?: string
}

export default function PartnerNotesAnalyzer({ partnerId }: PartnerNotesAnalyzerProps) {
  const [partnerNotes, setPartnerNotes] = useState<PartnerNote[]>([])
  const [correlations, setCorrelations] = useState<CompanyCorrelation[]>([])
  const [trendInsights, setTrendInsights] = useState<TrendInsight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedNote, setSelectedNote] = useState<PartnerNote | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadPartnerNotes()
    }
  }, [mounted, partnerId])

  const loadPartnerNotes = async () => {
    try {
      const response = await fetch(`/api/partner-intelligence?action=notes&partnerId=${partnerId || 'all'}`)
      const data = await response.json()
      
      if (data.success) {
        setPartnerNotes(data.data.notes)
        setCorrelations(data.data.correlations)
        setTrendInsights(data.data.trends)
      } else {
        // Mock data for demonstration
        const mockData = getMockPartnerData()
        setPartnerNotes(mockData.notes)
        setCorrelations(mockData.correlations)
        setTrendInsights(mockData.trends)
      }
    } catch (error) {
      console.error('Failed to load partner notes:', error)
      const mockData = getMockPartnerData()
      setPartnerNotes(mockData.notes)
      setCorrelations(mockData.correlations)
      setTrendInsights(mockData.trends)
    }
  }

  const analyzeNotes = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/partner-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze-notes',
          partnerId: partnerId,
          includeCorrelations: true,
          includeTrends: true
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setCorrelations(data.data.correlations)
        setTrendInsights(data.data.trends)
        alert('✅ Analysis complete! Found new correlations and trends.')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('❌ Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'invest': return 'bg-green-100 text-green-800'
      case 'pass': return 'bg-red-100 text-red-800'
      case 'follow': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'review': return 'bg-green-100 text-green-800'
      case 'monitor': return 'bg-blue-100 text-blue-800'
      case 'pass': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse text-blue-500" />
          <p className="text-lg font-medium">Loading Partner Intelligence...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Partner Intelligence Analyzer
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            AI-powered analysis of partner notes, company correlations, and market trends
          </p>
        </div>
        <div className="flex gap-3">
          <SecureActionButton 
            onClick={analyzeNotes} 
            debounceMs={1000}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            Analyze Notes
          </SecureActionButton>
          <SecureActionButton onClick={() => {}} debounceMs={1000}>
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </SecureActionButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
                <p className="text-3xl font-bold text-blue-600">{partnerNotes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Correlations Found</p>
                <p className="text-3xl font-bold text-green-600">{correlations.length}</p>
              </div>
              <LinkIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trend Insights</p>
                <p className="text-3xl font-bold text-purple-600">{trendInsights.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <p className="text-3xl font-bold text-red-600">
                  {Math.round((partnerNotes.filter(n => n.decision === 'pass').length / partnerNotes.length) * 100)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Correlations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Company Correlations & Second Chances
          </CardTitle>
          <CardDescription>
            Companies similar to previous passes that may now be ready for investment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {correlations.map((correlation, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{correlation.companyName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{correlation.fundingStage}</Badge>
                      <Badge className={getActionColor(correlation.recommendedAction)}>
                        {correlation.recommendedAction}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{correlation.lastFunding}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{correlation.correlationScore}%</div>
                    <div className="text-sm text-muted-foreground">Similarity</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="font-medium mb-2">Why Similar</h5>
                    <ul className="text-sm space-y-1">
                      {correlation.similarityReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Key Differences Now</h5>
                    <ul className="text-sm space-y-1">
                      {correlation.keyDifferences.map((diff, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-blue-500" />
                          {diff}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium mb-2">Market Evolution</h5>
                  <p className="text-sm text-muted-foreground">{correlation.marketEvolution}</p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/company/${correlation.companyName.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button size="sm">
                      <Eye className="h-3 w-3 mr-2" />
                      Deep Dive
                    </Button>
                  </Link>
                  <SecureActionButton
                    onClick={() => {}}
                    size="sm"
                    variant="outline"
                  >
                    <Star className="h-3 w-3 mr-2" />
                    Add to Pipeline
                  </SecureActionButton>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trend Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Trend Insights
          </CardTitle>
          <CardDescription>
            AI-identified trends from partner notes and market analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trendInsights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold">{insight.trend}</h4>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">{insight.confidence}%</div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                </div>

                <div className="mb-3">
                  <Progress value={insight.confidence} className="w-full" />
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-sm mb-1">Supporting Evidence</h5>
                    <ul className="text-sm space-y-1">
                      {insight.supportingEvidence.slice(0, 2).map((evidence, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                          {evidence}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-1">Market Implications</h5>
                    <p className="text-sm text-muted-foreground">{insight.marketImplications}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-1">Actionable Insights</h5>
                    <ul className="text-sm space-y-1">
                      {insight.actionableInsights.slice(0, 2).map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {insight.relatedCompanies.slice(0, 3).map((company, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Partner Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Partner Notes
          </CardTitle>
          <CardDescription>
            Latest investment decisions and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {partnerNotes.slice(0, 5).map((note) => (
              <div key={note.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{note.companyName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getDecisionColor(note.decision)}>
                        {note.decision}
                      </Badge>
                      <Badge variant="outline">{note.stage}</Badge>
                      <span className="text-sm text-muted-foreground">{note.date}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    by {note.partnerName}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <h5 className="font-medium text-sm mb-1 text-green-600">Strengths</h5>
                    <ul className="text-sm space-y-1">
                      {note.strengths.slice(0, 2).map((strength, idx) => (
                        <li key={idx}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-1 text-red-600">Concerns</h5>
                    <ul className="text-sm space-y-1">
                      {note.concerns.slice(0, 2).map((concern, idx) => (
                        <li key={idx}>• {concern}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-1">Assessment</h5>
                    <div className="text-sm space-y-1">
                      <div>Team: {note.teamAssessment}</div>
                      <div>Tech: {note.techAssessment}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mock data function
function getMockPartnerData() {
  return {
    notes: [
      {
        id: '1',
        companyName: 'CyberFlow AI',
        partnerName: 'Sarah Chen',
        date: '2024-09-15',
        stage: 'Series A',
        decision: 'pass' as const,
        keyPoints: ['Strong technical team', 'Competitive market', 'High burn rate'],
        concerns: ['Market timing too early', 'Strong competition from incumbents', 'Customer acquisition challenges'],
        strengths: ['Exceptional technical team', 'Novel AI approach', 'Strong IP portfolio'],
        marketTiming: 'Too early - market not ready for this solution',
        teamAssessment: 'Excellent - ex-Google AI researchers',
        techAssessment: 'Strong - proprietary algorithms',
        tags: ['AI', 'Early Stage', 'Technical Risk']
      },
      {
        id: '2',
        companyName: 'SecureVault Pro',
        partnerName: 'Michael Rodriguez',
        date: '2024-08-22',
        stage: 'Seed',
        decision: 'follow' as const,
        keyPoints: ['Good traction', 'Need more revenue', 'Strong partnerships'],
        concerns: ['Revenue growth slower than expected', 'Competitive pressure increasing'],
        strengths: ['Strong customer retention', 'Good partnership with AWS', 'Experienced team'],
        marketTiming: 'Good timing - market demand increasing',
        teamAssessment: 'Good - need stronger sales leadership',
        techAssessment: 'Solid - proven technology',
        followUpDate: '2024-12-01',
        tags: ['Cloud Security', 'Follow Up', 'Revenue Growth']
      }
    ],
    correlations: [
      {
        companyName: 'QuantumShield Security',
        correlationScore: 87,
        similarityReasons: [
          'Similar AI-powered threat detection approach',
          'Ex-Google team members like previous pass',
          'Same market segment (enterprise security)'
        ],
        currentStatus: 'Series A funded',
        fundingStage: 'Series A',
        lastFunding: '2024-10-01',
        recommendedAction: 'review' as const,
        keyDifferences: [
          'Now has 3 major enterprise customers',
          'Market timing improved - AI security demand increased',
          'Reduced burn rate by 40%',
          'Strategic partnership with Microsoft'
        ],
        marketEvolution: 'AI security market has matured significantly since our last review. Enterprise adoption has accelerated, and the competitive landscape has consolidated, creating opportunities for differentiated players.'
      }
    ],
    trends: [
      {
        id: '1',
        trend: 'AI Security Market Acceleration',
        confidence: 94,
        supportingEvidence: [
          '67% increase in AI security funding in 2024',
          'Major enterprises now have dedicated AI security budgets',
          'Regulatory pressure driving adoption (EU AI Act)',
          'High-profile AI security incidents increasing awareness'
        ],
        relatedCompanies: ['QuantumShield', 'CyberFlow AI', 'SecureAI Labs'],
        marketImplications: 'Companies we previously passed on for being "too early" in AI security may now be well-positioned as the market has matured.',
        actionableInsights: [
          'Revisit AI security companies from 2022-2023 deal flow',
          'Focus on companies with enterprise traction',
          'Look for regulatory compliance features',
          'Prioritize teams with AI/ML security expertise'
        ],
        timeframe: '12-18 months',
        partnerRelevance: ['Sarah Chen - AI Security Focus', 'Michael Rodriguez - Enterprise Sales']
      }
    ]
  }
}