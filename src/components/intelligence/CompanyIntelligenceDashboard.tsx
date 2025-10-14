'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecureActionButton } from '@/components/ui/secure-button'
import { 
  Building,
  Users,
  DollarSign,
  Calendar,
  ExternalLink,
  MapPin,
  Award,
  Briefcase,
  Globe,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Share,
  Bookmark,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface CompanyIntelligence {
  id: string
  name: string
  website: string
  description: string
  
  // Funding Intelligence
  fundingHistory: FundingRound[]
  totalFunding: number
  lastFundingDate: string
  leadInvestors: string[]
  whyInvestorsInvested: InvestorReasoning[]
  
  // Team & People Intelligence
  keyPeople: TeamMember[]
  advisors: Advisor[]
  boardMembers: BoardMember[]
  
  // Market Presence
  pressReleases: PressRelease[]
  recentNews: NewsItem[]
  conferences: ConferenceAppearance[]
  programs: Program[]
  
  // Ballistic Intelligence
  ballisticHistory: BallisticInteraction[]
  whyNotBallistic: string[]
  connectionGaps: ConnectionGap[]
  
  // Export Data
  exportableMetrics: ExportMetric[]
  chartData: ChartData[]
}

interface FundingRound {
  round: string
  amount: number
  date: string
  leadInvestor: string
  participants: string[]
  valuation?: number
  reasoning: string
}

interface InvestorReasoning {
  investor: string
  publicReasoning: string
  keyFactors: string[]
  source: string
}

interface TeamMember {
  name: string
  role: string
  background: string
  previousCompanies: string[]
  education: string
  linkedinUrl?: string
  keyConnections: string[]
}

interface ConferenceAppearance {
  conference: string
  date: string
  type: 'speaker' | 'exhibitor' | 'attendee' | 'sponsor'
  topic?: string
  stage?: string
}

interface Program {
  name: string
  type: 'accelerator' | 'incubator' | 'fellowship' | 'competition'
  year: string
  outcome: string
  connections: string[]
}

interface BallisticInteraction {
  date: string
  type: 'pitch' | 'meeting' | 'event' | 'referral'
  outcome: string
  notes: string
  followUp?: string
}

interface ConnectionGap {
  type: 'person' | 'program' | 'conference' | 'investor'
  name: string
  importance: 'high' | 'medium' | 'low'
  reason: string
  suggestedAction: string
}

interface ExportMetric {
  category: string
  metrics: Array<{ name: string; value: string | number; trend?: string }>
}

interface CompanyIntelligenceDashboardProps {
  companyId: string
}

export default function CompanyIntelligenceDashboard({ companyId }: CompanyIntelligenceDashboardProps) {
  const [intelligence, setIntelligence] = useState<CompanyIntelligence | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadCompanyIntelligence()
    }
  }, [mounted, companyId])

  const loadCompanyIntelligence = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/company-intelligence?id=${companyId}`)
      const data = await response.json()
      
      if (data.success) {
        setIntelligence(data.data)
      } else {
        // Mock data for demonstration
        setIntelligence(getMockCompanyIntelligence(companyId))
      }
    } catch (error) {
      console.error('Failed to load company intelligence:', error)
      setIntelligence(getMockCompanyIntelligence(companyId))
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = async (format: 'pdf' | 'excel' | 'presentation') => {
    try {
      const response = await fetch('/api/company-intelligence/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          format,
          includeCharts: true,
          includeMetrics: true
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${intelligence?.name}-intelligence.${format}`
        a.click()
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('❌ Export failed')
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building className="h-12 w-12 mx-auto mb-4 animate-pulse text-blue-500" />
          <p className="text-lg font-medium">Loading Company Intelligence...</p>
        </div>
      </div>
    )
  }

  if (!intelligence) {
    return <div className="text-center py-12">Company not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{intelligence.name}</h1>
          <p className="text-muted-foreground">{intelligence.description}</p>
        </div>
        <div className="flex gap-2">
          <SecureActionButton onClick={() => exportData('presentation')} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export for Deck
          </SecureActionButton>
          <SecureActionButton onClick={() => exportData('excel')} size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </SecureActionButton>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Funding</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(intelligence.totalFunding)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Funding</p>
                <p className="text-2xl font-bold text-blue-600">{intelligence.lastFundingDate}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Key People</p>
                <p className="text-2xl font-bold text-purple-600">{intelligence.keyPeople.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conferences</p>
                <p className="text-2xl font-bold text-orange-600">{intelligence.conferences.length}</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funding">Funding Intel</TabsTrigger>
          <TabsTrigger value="people">People & Team</TabsTrigger>
          <TabsTrigger value="presence">Market Presence</TabsTrigger>
          <TabsTrigger value="ballistic">Ballistic History</TabsTrigger>
          <TabsTrigger value="gaps">Connection Gaps</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent News & Press</CardTitle>
                <CardDescription>Latest company updates and media coverage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intelligence.recentNews.map((news, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium">{news.title}</h4>
                      <p className="text-sm text-muted-foreground">{news.summary}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{news.source}</Badge>
                        <span className="text-xs text-muted-foreground">{news.date}</span>
                        <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Metrics</CardTitle>
                <CardDescription>Key metrics for investor presentations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intelligence.exportableMetrics.map((category, index) => (
                    <div key={index}>
                      <h4 className="font-medium mb-2">{category.category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.metrics.map((metric, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="text-muted-foreground">{metric.name}:</span>
                            <span className="font-medium ml-1">{metric.value}</span>
                            {metric.trend && (
                              <TrendingUp className="h-3 w-3 inline ml-1 text-green-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Funding Intelligence */}
        <TabsContent value="funding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding History</CardTitle>
                <CardDescription>Who invested and when</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intelligence.fundingHistory.map((round, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge variant="outline">{round.round}</Badge>
                          <div className="text-2xl font-bold text-green-600 mt-1">
                            {formatCurrency(round.amount)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">{round.date}</div>
                          {round.valuation && (
                            <div className="text-sm">Val: {formatCurrency(round.valuation)}</div>
                          )}
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium">Lead: </span>
                        <span>{round.leadInvestor}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium">Participants: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {round.participants.map((participant, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Why they invested: </span>
                        {round.reasoning}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investor Reasoning</CardTitle>
                <CardDescription>Why firms invested in this company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intelligence.whyInvestorsInvested.map((reasoning, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium">{reasoning.investor}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{reasoning.publicReasoning}</p>
                      <div className="mb-2">
                        <span className="text-sm font-medium">Key Factors:</span>
                        <ul className="text-sm mt-1 space-y-1">
                          {reasoning.keyFactors.map((factor, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Source: {reasoning.source}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* People & Team */}
        <TabsContent value="people" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key People</CardTitle>
              <CardDescription>Team and tech are critical - who you know matters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {intelligence.keyPeople.map((person, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{person.name}</h4>
                        <p className="text-sm text-muted-foreground">{person.role}</p>
                      </div>
                      {person.linkedinUrl && (
                        <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 text-blue-600" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-sm mb-3">{person.background}</p>
                    
                    <div className="mb-3">
                      <span className="text-sm font-medium">Previous: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {person.previousCompanies.map((company, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-sm font-medium">Education: </span>
                      <span className="text-sm">{person.education}</span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Key Connections: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {person.keyConnections.map((connection, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {connection}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Presence */}
        <TabsContent value="presence" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conference Appearances</CardTitle>
                <CardDescription>Where they showcase and speak</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {intelligence.conferences.map((conf, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{conf.conference}</h4>
                        <p className="text-sm text-muted-foreground">{conf.topic}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{conf.type}</Badge>
                        <div className="text-sm text-muted-foreground mt-1">{conf.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Programs & Accelerators</CardTitle>
                <CardDescription>What programs they came out of</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {intelligence.programs.map((program, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{program.name}</h4>
                        <Badge variant="outline">{program.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{program.outcome}</p>
                      <div>
                        <span className="text-sm font-medium">Connections: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {program.connections.map((connection, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {connection}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Ballistic History */}
        <TabsContent value="ballistic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ballistic Interaction History</CardTitle>
                <CardDescription>Previous touchpoints with the company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intelligence.ballisticHistory.map((interaction, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline">{interaction.type}</Badge>
                        <span className="text-sm text-muted-foreground">{interaction.date}</span>
                      </div>
                      <p className="text-sm mb-2">{interaction.outcome}</p>
                      <p className="text-sm text-muted-foreground mb-2">{interaction.notes}</p>
                      {interaction.followUp && (
                        <div className="text-sm">
                          <span className="font-medium">Follow-up: </span>
                          {interaction.followUp}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Not Ballistic?</CardTitle>
                <CardDescription>Reasons they didn't come to us</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {intelligence.whyNotBallistic.map((reason, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span className="text-sm">{reason}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Connection Gaps */}
        <TabsContent value="gaps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connection Gaps Analysis</CardTitle>
              <CardDescription>Missing connections, programs, and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {intelligence.connectionGaps.map((gap, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{gap.name}</h4>
                        <Badge variant="outline" className="mt-1">{gap.type}</Badge>
                      </div>
                      <Badge variant={gap.importance === 'high' ? 'destructive' : gap.importance === 'medium' ? 'default' : 'secondary'}>
                        {gap.importance}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{gap.reason}</p>
                    <div className="text-sm">
                      <span className="font-medium">Suggested Action: </span>
                      {gap.suggestedAction}
                    </div>
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

// Mock data function
function getMockCompanyIntelligence(companyId: string): CompanyIntelligence {
  return {
    id: companyId,
    name: 'QuantumShield Security',
    website: 'https://quantumshield.com',
    description: 'AI-powered quantum-resistant security platform for enterprise environments',
    
    fundingHistory: [
      {
        round: 'Series A',
        amount: 22000000,
        date: '2024-10-01',
        leadInvestor: 'Andreessen Horowitz',
        participants: ['GV', 'Bessemer Venture Partners', 'CRV'],
        valuation: 85000000,
        reasoning: 'Strong technical team with quantum computing expertise, growing enterprise demand for quantum-safe security'
      }
    ],
    
    totalFunding: 26500000,
    lastFundingDate: '2024-10-01',
    leadInvestors: ['Andreessen Horowitz', 'Aleph VC'],
    
    whyInvestorsInvested: [
      {
        investor: 'Andreessen Horowitz',
        publicReasoning: 'Quantum computing poses an existential threat to current cryptography. QuantumShield is building the defense.',
        keyFactors: ['Ex-Unit 8200 team', 'Proprietary quantum-resistant algorithms', 'Early enterprise traction'],
        source: 'a16z blog post'
      }
    ],
    
    keyPeople: [
      {
        name: 'Dr. Sarah Chen',
        role: 'CEO & Co-Founder',
        background: 'Former Unit 8200 intelligence officer with PhD in Quantum Computing from Technion',
        previousCompanies: ['Unit 8200', 'Check Point'],
        education: 'PhD Quantum Computing, Technion',
        linkedinUrl: 'https://linkedin.com/in/sarahchen',
        keyConnections: ['Shlomo Kramer (Check Point)', 'Gil Shwed (Check Point)', 'Yoav Tzruya (JVP)']
      }
    ],
    
    advisors: [],
    boardMembers: [],
    
    pressReleases: [],
    recentNews: [
      {
        title: 'QuantumShield Raises $22M Series A',
        summary: 'Led by Andreessen Horowitz to accelerate quantum-resistant security platform',
        date: '2024-10-01',
        source: 'TechCrunch',
        url: 'https://techcrunch.com/quantumshield-series-a'
      }
    ],
    
    conferences: [
      {
        conference: 'RSA Conference 2024',
        date: '2024-05-06',
        type: 'speaker',
        topic: 'Quantum-Safe Cryptography for Enterprise',
        stage: 'Main Stage'
      }
    ],
    
    programs: [
      {
        name: 'Team8 Foundry',
        type: 'incubator',
        year: '2022',
        outcome: 'Graduated with seed funding',
        connections: ['Liran Tancman', 'Nadav Zafrir', 'Israel Grimberg']
      }
    ],
    
    ballisticHistory: [
      {
        date: '2023-06-15',
        type: 'pitch',
        outcome: 'Passed - too early stage',
        notes: 'Strong team but market timing concerns. Product not ready for enterprise.',
        followUp: 'Follow up in 12 months'
      }
    ],
    
    whyNotBallistic: [
      'No direct connection to Ballistic partners',
      'Came through Team8 network instead',
      'Previous pass may have created hesitation',
      'Strong Israeli investor network reduced need for US early-stage capital'
    ],
    
    connectionGaps: [
      {
        type: 'person',
        name: 'Shlomo Kramer',
        importance: 'high',
        reason: 'Key Check Point connection that could have provided warm intro',
        suggestedAction: 'Build relationship with Shlomo for future deal flow'
      }
    ],
    
    exportableMetrics: [
      {
        category: 'Financial',
        metrics: [
          { name: 'Total Funding', value: '$26.5M', trend: 'up' },
          { name: 'Last Valuation', value: '$85M', trend: 'up' },
          { name: 'Revenue Growth', value: '240% YoY', trend: 'up' }
        ]
      }
    ],
    
    chartData: []
  }
}