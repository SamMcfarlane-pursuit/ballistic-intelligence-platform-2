'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecureActionButton } from '@/components/ui/secure-button'
import { 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Building,
  Calendar,
  MapPin,
  Users,
  Target,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search,
  ExternalLink,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Award,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'

interface MissedOpportunity {
  id: string
  companyName: string
  sector: string
  location: string
  fundingAmount: number
  fundingRound: string
  fundingDate: string
  leadInvestor: string
  participants: string[]
  foundedYear: number
  employeeCount: string
  description: string
  website: string
  reasonMissed: string
  discoverySource: string
  riskLevel: 'low' | 'medium' | 'high'
  opportunityScore: number
  competitiveThreats: string[]
  marketTiming: 'early' | 'optimal' | 'late'
  ballistic_fit: number
}

interface AnalysisMetrics {
  totalMissedOpportunities: number
  totalMissedFunding: number
  averageOpportunityScore: number
  topMissedSectors: Array<{ sector: string; count: number; funding: number }>
  discoverySourceBreakdown: Record<string, number>
  timeToDiscovery: {
    average: number
    median: number
    fastest: number
    slowest: number
  }
  geographicDistribution: Record<string, number>
}

interface ComparisonData {
  aiDiscovered: number
  manualTracked: number
  overlap: number
  missedPercentage: number
  lastSyncDate: string
}

export default function MissedOpportunityAnalyzer() {
  const [missedOpportunities, setMissedOpportunities] = useState<MissedOpportunity[]>([])
  const [analysisMetrics, setAnalysisMetrics] = useState<AnalysisMetrics | null>(null)
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSector, setSelectedSector] = useState('all')
  const [selectedRisk, setSelectedRisk] = useState('all')
  const [mounted, setMounted] = useState(false)

  // Prevent SSR issues
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadMissedOpportunities()
    }
  }, [mounted, selectedSector, selectedRisk])

  const loadMissedOpportunities = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/missed-opportunities?sector=${selectedSector}&risk=${selectedRisk}`)
      const data = await response.json()
      
      if (data.success) {
        setMissedOpportunities(data.data.opportunities)
        setAnalysisMetrics(data.data.metrics)
        setComparisonData(data.data.comparison)
      } else {
        // Mock data for demonstration
        const mockData = getMockMissedOpportunities()
        setMissedOpportunities(mockData.opportunities)
        setAnalysisMetrics(mockData.metrics)
        setComparisonData(mockData.comparison)
      }
    } catch (error) {
      console.error('Failed to load missed opportunities:', error)
      // Fallback to mock data
      const mockData = getMockMissedOpportunities()
      setMissedOpportunities(mockData.opportunities)
      setAnalysisMetrics(mockData.metrics)
      setComparisonData(mockData.comparison)
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'early': return 'bg-blue-100 text-blue-800'
      case 'optimal': return 'bg-green-100 text-green-800'
      case 'late': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const syncWithCRM = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/missed-opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-crm' })
      })
      
      const data = await response.json()
      if (data.success) {
        await loadMissedOpportunities()
        alert('✅ CRM sync completed successfully')
      }
    } catch (error) {
      console.error('CRM sync failed:', error)
      alert('❌ CRM sync failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 animate-pulse text-red-500" />
          <p className="text-lg font-medium">Analyzing Missed Opportunities...</p>
          <p className="text-sm text-muted-foreground">Comparing AI discoveries with manual tracking</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Missed Opportunity Analyzer
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Identify funding gaps and missed investment opportunities in cybersecurity
          </p>
        </div>
        <div className="flex gap-3">
          <SecureActionButton onClick={syncWithCRM} debounceMs={1000}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync with CRM
          </SecureActionButton>
          <SecureActionButton onClick={() => {}} debounceMs={1000}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </SecureActionButton>
        </div>
      </div>

      {/* Comparison Overview */}
      {comparisonData && (
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Coverage Gap Analysis
            </CardTitle>
            <CardDescription>
              Comparison between AI-discovered companies and manual tracking system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{comparisonData.aiDiscovered}</div>
                <div className="text-sm text-muted-foreground">AI Discovered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{comparisonData.manualTracked}</div>
                <div className="text-sm text-muted-foreground">Manually Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{comparisonData.overlap}</div>
                <div className="text-sm text-muted-foreground">Overlap</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{comparisonData.missedPercentage}%</div>
                <div className="text-sm text-muted-foreground">Missed Rate</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Last sync: {new Date(comparisonData.lastSyncDate).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      {analysisMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Missed Opportunities</p>
                  <p className="text-3xl font-bold text-red-600">{analysisMetrics.totalMissedOpportunities}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Missed Funding</p>
                  <p className="text-3xl font-bold text-orange-600">{formatCurrency(analysisMetrics.totalMissedFunding)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Opportunity Score</p>
                  <p className="text-3xl font-bold text-blue-600">{analysisMetrics.averageOpportunityScore}/100</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Discovery Time</p>
                  <p className="text-3xl font-bold text-purple-600">{analysisMetrics.timeToDiscovery.average}d</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium">Sector</label>
              <select 
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="ml-2 px-3 py-1 border rounded-md"
              >
                <option value="all">All Sectors</option>
                <option value="ai-security">AI Security</option>
                <option value="cloud-security">Cloud Security</option>
                <option value="zero-trust">Zero Trust</option>
                <option value="application-security">Application Security</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Risk Level</label>
              <select 
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="ml-2 px-3 py-1 border rounded-md"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Missed Opportunities</TabsTrigger>
          <TabsTrigger value="analysis">Sector Analysis</TabsTrigger>
          <TabsTrigger value="sources">Discovery Sources</TabsTrigger>
        </TabsList>

        {/* Missed Opportunities List */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {missedOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="border-2 border-red-100 hover:border-red-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{opportunity.companyName}</CardTitle>
                      <CardDescription>
                        {opportunity.sector} • {opportunity.location} • Founded {opportunity.foundedYear}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getRiskColor(opportunity.riskLevel)}>
                        {opportunity.riskLevel} risk
                      </Badge>
                      <Badge className={getTimingColor(opportunity.marketTiming)}>
                        {opportunity.marketTiming} timing
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Funding Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{formatCurrency(opportunity.fundingAmount)}</div>
                      <div className="text-sm text-muted-foreground">{opportunity.fundingRound}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{opportunity.opportunityScore}</div>
                      <div className="text-sm text-muted-foreground">Opportunity Score</div>
                    </div>
                  </div>

                  {/* Ballistic Fit */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Ballistic Fit</span>
                      <span className="text-sm font-bold">{opportunity.ballistic_fit}%</span>
                    </div>
                    <Progress value={opportunity.ballistic_fit} className="w-full" />
                  </div>

                  {/* Key Details */}
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Lead Investor:</span> {opportunity.leadInvestor}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Funding Date:</span> {opportunity.fundingDate}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Discovery Source:</span> {opportunity.discoverySource}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Reason Missed:</span> 
                      <span className="text-red-600 ml-1">{opportunity.reasonMissed}</span>
                    </div>
                  </div>

                  {/* Participants */}
                  <div>
                    <div className="text-sm font-medium mb-2">Other Participants</div>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.participants.map((participant, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {participant}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Competitive Threats */}
                  {opportunity.competitiveThreats.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2 text-red-600">Competitive Threats</div>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.competitiveThreats.map((threat, idx) => (
                          <Badge key={idx} variant="destructive" className="text-xs">
                            {threat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/company/${opportunity.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        <Eye className="h-3 w-3 mr-2" />
                        Deep Dive
                      </Button>
                    </Link>
                    <SecureActionButton
                      onClick={() => {}}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Add to Pipeline
                    </SecureActionButton>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(opportunity.website, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sector Analysis */}
        <TabsContent value="analysis" className="space-y-4">
          {analysisMetrics && (
            <Card>
              <CardHeader>
                <CardTitle>Top Missed Sectors</CardTitle>
                <CardDescription>
                  Sectors with the highest number of missed opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisMetrics.topMissedSectors.map((sector, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{sector.sector}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">{sector.count} companies</div>
                          <div className="text-sm text-muted-foreground">{formatCurrency(sector.funding)}</div>
                        </div>
                      </div>
                      <Progress value={(sector.count / analysisMetrics.totalMissedOpportunities) * 100} className="w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Discovery Sources */}
        <TabsContent value="sources" className="space-y-4">
          {analysisMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Discovery Source Breakdown</CardTitle>
                  <CardDescription>
                    How missed opportunities were discovered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analysisMetrics.discoverySourceBreakdown).map(([source, count]) => (
                      <div key={source} className="flex justify-between items-center">
                        <span className="capitalize">{source.replace(/([A-Z])/g, ' $1')}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Discovery Time Analysis</CardTitle>
                  <CardDescription>
                    Time from funding announcement to discovery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Average</span>
                      <span className="font-bold">{analysisMetrics.timeToDiscovery.average} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Median</span>
                      <span className="font-bold">{analysisMetrics.timeToDiscovery.median} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fastest</span>
                      <span className="font-bold text-green-600">{analysisMetrics.timeToDiscovery.fastest} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slowest</span>
                      <span className="font-bold text-red-600">{analysisMetrics.timeToDiscovery.slowest} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock data function for demonstration
function getMockMissedOpportunities() {
  return {
    opportunities: [
      {
        id: 'mo-1',
        companyName: 'SecureFlow AI',
        sector: 'AI Security',
        location: 'San Francisco, CA',
        fundingAmount: 15000000,
        fundingRound: 'Series A',
        fundingDate: '2024-09-15',
        leadInvestor: 'Andreessen Horowitz',
        participants: ['GV', 'Bessemer Venture Partners', 'CRV'],
        foundedYear: 2023,
        employeeCount: '25-50',
        description: 'AI-powered security orchestration platform',
        website: 'https://secureflow.ai',
        reasonMissed: 'Not in CRM database',
        discoverySource: 'TechCrunch',
        riskLevel: 'low' as const,
        opportunityScore: 87,
        competitiveThreats: ['Phantom Cyber', 'Demisto'],
        marketTiming: 'optimal' as const,
        ballistic_fit: 92
      },
      {
        id: 'mo-2',
        companyName: 'CloudGuard Pro',
        sector: 'Cloud Security',
        location: 'Austin, TX',
        fundingAmount: 8500000,
        fundingRound: 'Seed',
        fundingDate: '2024-08-22',
        leadInvestor: 'Accel Partners',
        participants: ['Lightspeed Venture Partners', 'Index Ventures'],
        foundedYear: 2022,
        employeeCount: '15-25',
        description: 'Multi-cloud security posture management',
        website: 'https://cloudguard.pro',
        reasonMissed: 'Late discovery - 45 days after announcement',
        discoverySource: 'Crunchbase',
        riskLevel: 'medium' as const,
        opportunityScore: 73,
        competitiveThreats: ['Prisma Cloud', 'Lacework'],
        marketTiming: 'late' as const,
        ballistic_fit: 78
      }
    ],
    metrics: {
      totalMissedOpportunities: 23,
      totalMissedFunding: 287000000,
      averageOpportunityScore: 79,
      topMissedSectors: [
        { sector: 'AI Security', count: 8, funding: 125000000 },
        { sector: 'Cloud Security', count: 6, funding: 89000000 },
        { sector: 'Zero Trust', count: 5, funding: 73000000 },
        { sector: 'Application Security', count: 4, funding: 45000000 }
      ],
      discoverySourceBreakdown: {
        'TechCrunch': 8,
        'Crunchbase': 6,
        'VentureBeat': 4,
        'LinkedIn': 3,
        'Other': 2
      },
      timeToDiscovery: {
        average: 28,
        median: 21,
        fastest: 3,
        slowest: 89
      },
      geographicDistribution: {
        'San Francisco': 8,
        'New York': 5,
        'Austin': 3,
        'Boston': 3,
        'Tel Aviv': 2,
        'Other': 2
      }
    },
    comparison: {
      aiDiscovered: 1247,
      manualTracked: 892,
      overlap: 869,
      missedPercentage: 18.4,
      lastSyncDate: '2024-10-14T10:30:00Z'
    }
  }
}