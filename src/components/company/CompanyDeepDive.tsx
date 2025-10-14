'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecureActionButton } from '@/components/ui/secure-button'
import { 
  Building,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Globe,
  Mail,
  Phone,
  Award,
  Target,
  Briefcase,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Share,
  Bookmark,
  Download
} from 'lucide-react'
import Link from 'next/link'

interface CompanySnapshot {
  id: string
  name: string
  website: string
  location: string
  foundedYear: number
  employeeRange: string
  category: string
  description: string
  logo?: string
  status: 'active' | 'acquired' | 'closed'
  lastUpdated: string
}

interface FundingRound {
  id: string
  roundType: string
  amount: number
  date: string
  leadInvestor: string
  participants: string[]
  valuation?: number
  source: string
}

interface TeamMember {
  name: string
  role: string
  linkedinUrl?: string
  previousCompanies?: string[]
  background: string
}

interface Customer {
  name: string
  type: 'enterprise' | 'government' | 'startup'
  relationship: 'customer' | 'partner' | 'integration'
  source: string
}

interface NewsEvent {
  id: string
  title: string
  description: string
  date: string
  type: 'funding' | 'partnership' | 'product' | 'hiring' | 'acquisition' | 'other'
  sentiment: 'positive' | 'neutral' | 'negative'
  source: string
  sourceUrl: string
}

interface CompanyIntelligence {
  snapshot: CompanySnapshot
  fundingHistory: FundingRound[]
  team: TeamMember[]
  customers: Customer[]
  recentNews: NewsEvent[]
  competitivePosition: {
    marketPosition: string
    keyCompetitors: string[]
    differentiators: string[]
  }
  investmentMetrics: {
    totalFunding: number
    lastRoundDate: string
    investorCount: number
    momentum: number
    riskScore: number
  }
  dataSourceBreakdown: {
    crunchbase: number
    linkedin: number
    newsArticles: number
    companyWebsite: number
    patents: number
    other: number
  }
}

interface CompanyDeepDiveProps {
  companyId: string
}

export default function CompanyDeepDive({ companyId }: CompanyDeepDiveProps) {
  const [intelligence, setIntelligence] = useState<CompanyIntelligence | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Prevent SSR issues
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
      const response = await fetch(`/api/company-profile?id=${companyId}`)
      const data = await response.json()
      
      if (data.success) {
        setIntelligence(data.data)
      } else {
        // Mock data for demonstration
        setIntelligence(getMockCompanyData(companyId))
      }
    } catch (error) {
      console.error('Failed to load company intelligence:', error)
      // Fallback to mock data
      setIntelligence(getMockCompanyData(companyId))
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'acquired': return 'bg-blue-100 text-blue-800'
      case 'closed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'negative': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building className="h-12 w-12 mx-auto mb-4 animate-pulse text-blue-500" />
          <p className="text-lg font-medium">Loading Company Intelligence...</p>
          <p className="text-sm text-muted-foreground">Aggregating data from multiple sources</p>
        </div>
      </div>
    )
  }

  if (!intelligence) {
    return (
      <div className="text-center py-12">
        <Building className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-xl font-semibold mb-2">Company Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested company could not be found in our database.</p>
        <Link href="/executive">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/executive">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{intelligence.snapshot.name}</h1>
            <p className="text-muted-foreground">{intelligence.snapshot.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <SecureActionButton size="sm" variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </SecureActionButton>
          <SecureActionButton size="sm" variant="outline">
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </SecureActionButton>
          <SecureActionButton size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </SecureActionButton>
        </div>
      </div>

      {/* Company Snapshot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Snapshot
          </CardTitle>
          <CardDescription>
            Core firmographic data and business overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <Badge className={getStatusColor(intelligence.snapshot.status)}>
                  {intelligence.snapshot.status}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Website</div>
                <a 
                  href={intelligence.snapshot.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  {intelligence.snapshot.website.replace('https://', '')}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Location</div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {intelligence.snapshot.location}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Founded</div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {intelligence.snapshot.foundedYear}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Employees</div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {intelligence.snapshot.employeeRange}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Total Funding</div>
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <DollarSign className="h-3 w-3" />
                  {formatCurrency(intelligence.investmentMetrics.totalFunding)}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Momentum Score</div>
                <div className="flex items-center gap-2">
                  <Progress value={intelligence.investmentMetrics.momentum} className="flex-1" />
                  <span className="text-sm font-medium">{intelligence.investmentMetrics.momentum}/100</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Risk Score</div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={intelligence.investmentMetrics.riskScore} 
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">{intelligence.investmentMetrics.riskScore}/100</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">Description</div>
            <p className="text-sm leading-relaxed">{intelligence.snapshot.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Data Aggregation Sources
          </CardTitle>
          <CardDescription>
            Intelligence gathered from {Object.values(intelligence.dataSourceBreakdown).reduce((a, b) => a + b, 0)} data points across multiple sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(intelligence.dataSourceBreakdown).map(([source, count]) => (
              <div key={source} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-xs text-muted-foreground capitalize">{source.replace(/([A-Z])/g, ' $1')}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="funding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="funding">Funding History</TabsTrigger>
          <TabsTrigger value="team">Team & Leadership</TabsTrigger>
          <TabsTrigger value="news">Recent News</TabsTrigger>
          <TabsTrigger value="competitive">Market Position</TabsTrigger>
        </TabsList>

        {/* Funding History */}
        <TabsContent value="funding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funding History</CardTitle>
              <CardDescription>
                Chronological list of all known funding rounds with participating investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {intelligence.fundingHistory.map((round, index) => (
                  <div key={round.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{round.roundType}</Badge>
                          <span className="text-sm text-muted-foreground">{round.date}</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(round.amount)}
                        </div>
                        {round.valuation && (
                          <div className="text-sm text-muted-foreground">
                            Valuation: {formatCurrency(round.valuation)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Lead Investor</div>
                        <div className="text-sm text-muted-foreground">{round.leadInvestor}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-2">Participating Investors</div>
                      <div className="flex flex-wrap gap-2">
                        {round.participants.map((investor, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {investor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Source: {round.source}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team & Leadership */}
        <TabsContent value="team" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Team Members</CardTitle>
                <CardDescription>
                  Leadership and key personnel identified through various sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intelligence.team.map((member, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                        </div>
                        {member.linkedinUrl && (
                          <a 
                            href={member.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{member.background}</p>
                      {member.previousCompanies && member.previousCompanies.length > 0 && (
                        <div>
                          <div className="text-xs font-medium mb-1">Previous Experience</div>
                          <div className="flex flex-wrap gap-1">
                            {member.previousCompanies.map((company, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Known Customers & Partners</CardTitle>
                <CardDescription>
                  Publicly disclosed relationships and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {intelligence.customers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {customer.type} • {customer.relationship}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {customer.source}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recent News */}
        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent News & Events</CardTitle>
              <CardDescription>
                Timeline of business signals and events identified by AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {intelligence.recentNews.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {getSentimentIcon(event.sentiment)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{event.type}</Badge>
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                        </div>
                        <h4 className="font-medium mb-2">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Source: {event.source}</span>
                          <a 
                            href={event.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                          >
                            View Article <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitive Position */}
        <TabsContent value="competitive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Position</div>
                    <p className="text-sm text-muted-foreground">
                      {intelligence.competitivePosition.marketPosition}
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Key Differentiators</div>
                    <div className="space-y-2">
                      {intelligence.competitivePosition.differentiators.map((diff, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{diff}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Competitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {intelligence.competitivePosition.keyCompetitors.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{competitor}</span>
                      <Button variant="outline" size="sm">
                        Compare
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock data function for demonstration
function getMockCompanyData(companyId: string): CompanyIntelligence {
  return {
    snapshot: {
      id: companyId,
      name: 'QuantumShield Security',
      website: 'https://quantumshield.com',
      location: 'Tel Aviv, Israel',
      foundedYear: 2022,
      employeeRange: '50-100',
      category: 'AI Security',
      description: 'QuantumShield develops quantum-resistant AI-powered threat detection systems for enterprise environments. Their proprietary algorithms can identify and neutralize advanced persistent threats that traditional security solutions miss.',
      status: 'active',
      lastUpdated: '2024-10-14'
    },
    fundingHistory: [
      {
        id: '1',
        roundType: 'Seed',
        amount: 4500000,
        date: '2023-03-15',
        leadInvestor: 'Aleph VC',
        participants: ['Bessemer Venture Partners', 'Cyber Mentor Fund', 'Individual Angels'],
        source: 'Crunchbase'
      },
      {
        id: '2',
        roundType: 'Series A',
        amount: 22000000,
        date: '2024-10-01',
        leadInvestor: 'Ballistic Ventures',
        participants: ['Aleph VC', 'Microsoft Ventures', 'Team8', 'Glilot Capital'],
        valuation: 85000000,
        source: 'TechCrunch'
      }
    ],
    team: [
      {
        name: 'Dr. Sarah Chen',
        role: 'CEO & Co-Founder',
        linkedinUrl: 'https://linkedin.com/in/sarahchen',
        previousCompanies: ['Unit 8200', 'Check Point'],
        background: 'Former Unit 8200 intelligence officer with PhD in Quantum Computing from Technion'
      },
      {
        name: 'Michael Rodriguez',
        role: 'CTO & Co-Founder',
        linkedinUrl: 'https://linkedin.com/in/mrodriguez',
        previousCompanies: ['Google', 'DeepMind'],
        background: 'Former Google AI researcher specializing in adversarial machine learning'
      }
    ],
    customers: [
      {
        name: 'Microsoft Azure',
        type: 'enterprise',
        relationship: 'partner',
        source: 'Press Release'
      },
      {
        name: 'Bank Hapoalim',
        type: 'enterprise',
        relationship: 'customer',
        source: 'Case Study'
      }
    ],
    recentNews: [
      {
        id: '1',
        title: 'QuantumShield Raises $22M Series A',
        description: 'Led by Ballistic Ventures to accelerate quantum-resistant security platform development',
        date: '2024-10-01',
        type: 'funding',
        sentiment: 'positive',
        source: 'TechCrunch',
        sourceUrl: 'https://techcrunch.com/quantumshield-series-a'
      },
      {
        id: '2',
        title: 'Microsoft Partnership Announced',
        description: 'Strategic integration with Azure Security Center for quantum threat detection',
        date: '2024-09-15',
        type: 'partnership',
        sentiment: 'positive',
        source: 'Microsoft Blog',
        sourceUrl: 'https://microsoft.com/blog/quantumshield'
      }
    ],
    competitivePosition: {
      marketPosition: 'Emerging leader in quantum-resistant AI security with strong technical differentiation and strategic partnerships',
      keyCompetitors: ['Darktrace', 'CrowdStrike Falcon', 'SentinelOne', 'Vectra AI'],
      differentiators: [
        'Quantum-resistant algorithms',
        'Real-time AI threat detection',
        'Zero false positive architecture',
        'Cloud-native deployment'
      ]
    },
    investmentMetrics: {
      totalFunding: 26500000,
      lastRoundDate: '2024-10-01',
      investorCount: 8,
      momentum: 94,
      riskScore: 18
    },
    dataSourceBreakdown: {
      crunchbase: 15,
      linkedin: 8,
      newsArticles: 23,
      companyWebsite: 12,
      patents: 3,
      other: 7
    }
  }
}