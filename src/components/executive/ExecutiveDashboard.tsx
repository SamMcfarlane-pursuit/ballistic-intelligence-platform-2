'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecureButton, SecureActionButton } from '@/components/ui/secure-button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Building,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Award,
  Briefcase,
  Globe,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Filter,
  Download,
  Mail,
  Calendar,
  ExternalLink,
  Plus,
  Eye,
  Star,
  ArrowRight,
  Lightbulb,
  Shield,
  Rocket,
  Brain
} from 'lucide-react'

interface ExecutiveMetrics {
  totalFunding: number
  totalCompanies: number
  avgFundingSize: number
  topSectors: Array<{ name: string; count: number; funding: number }>
  fundingTrend: Array<{ month: string; amount: number; deals: number }>
  portfolioValue: number
  activeDeals: number
  pipelineValue: number
}

interface InvestmentOpportunity {
  id: string
  companyName: string
  sector: string
  fundingStage: string
  fundingAmount: number
  momentum: number
  riskScore: number
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'pass'
  keyMetrics: {
    teamScore: number
    marketSize: number
    traction: number
    technology: number
  }
  recentSignals: Array<{
    type: string
    description: string
    date: string
    impact: 'positive' | 'neutral' | 'negative'
  }>
  nextActions: string[]
}

interface PortfolioCompany {
  name: string
  sector: string
  investmentAmount: number
  currentValuation: number
  momentum: number
  lastUpdate: string
  status: 'thriving' | 'growing' | 'stable' | 'concerning'
  keyEvents: Array<{
    type: string
    description: string
    date: string
  }>
}

interface MarketIntelligence {
  sectorTrends: Array<{
    sector: string
    growth: number
    fundingVolume: number
    dealCount: number
    avgValuation: number
  }>
  competitiveThreats: Array<{
    company: string
    threat: string
    severity: 'high' | 'medium' | 'low'
    description: string
  }>
  emergingTechnologies: Array<{
    technology: string
    adoptionRate: number
    marketPotential: number
    companies: string[]
  }>
}

export default function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null)
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioCompany[]>([])
  const [marketIntel, setMarketIntel] = useState<MarketIntelligence | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [selectedSector, setSelectedSector] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [selectedTimeframe, selectedSector])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Simulate loading comprehensive executive data
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setMetrics({
        totalFunding: 2400000000, // $2.4B
        totalCompanies: 156,
        avgFundingSize: 15400000, // $15.4M
        topSectors: [
          { name: 'Cloud Security', count: 45, funding: 680000000 },
          { name: 'Identity & Access', count: 32, funding: 520000000 },
          { name: 'Threat Intelligence', count: 28, funding: 450000000 },
          { name: 'Zero Trust', count: 25, funding: 380000000 },
          { name: 'AI Security', count: 26, funding: 370000000 }
        ],
        fundingTrend: [
          { month: 'Jan', amount: 180000000, deals: 12 },
          { month: 'Feb', amount: 220000000, deals: 15 },
          { month: 'Mar', amount: 195000000, deals: 13 },
          { month: 'Apr', amount: 240000000, deals: 16 },
          { month: 'May', amount: 280000000, deals: 18 },
          { month: 'Jun', amount: 320000000, deals: 21 }
        ],
        portfolioValue: 1200000000, // $1.2B
        activeDeals: 8,
        pipelineValue: 450000000 // $450M
      })

      setOpportunities([
        {
          id: '1',
          companyName: 'CyberGuard Pro',
          sector: 'Cloud Security',
          fundingStage: 'Series A',
          fundingAmount: 15000000,
          momentum: 92,
          riskScore: 25,
          recommendation: 'strong_buy',
          keyMetrics: {
            teamScore: 95,
            marketSize: 88,
            traction: 85,
            technology: 92
          },
          recentSignals: [
            { type: 'Partnership', description: 'Strategic partnership with AWS', date: '2024-10-10', impact: 'positive' },
            { type: 'Customer Win', description: 'Fortune 500 enterprise client', date: '2024-10-08', impact: 'positive' },
            { type: 'Product Launch', description: 'AI-powered threat detection', date: '2024-10-05', impact: 'positive' }
          ],
          nextActions: [
            'Schedule due diligence call',
            'Review technical architecture',
            'Validate customer references',
            'Negotiate term sheet'
          ]
        },
        {
          id: '2',
          companyName: 'SecureFlow AI',
          sector: 'AI Security',
          fundingStage: 'Seed',
          fundingAmount: 8500000,
          momentum: 78,
          riskScore: 45,
          recommendation: 'buy',
          keyMetrics: {
            teamScore: 82,
            marketSize: 95,
            traction: 65,
            technology: 88
          },
          recentSignals: [
            { type: 'Executive Hire', description: 'Former Google VP joins as CTO', date: '2024-10-12', impact: 'positive' },
            { type: 'Funding', description: 'Oversubscribed seed round', date: '2024-10-01', impact: 'positive' }
          ],
          nextActions: [
            'Technical deep dive session',
            'Market analysis review',
            'Competitive positioning assessment'
          ]
        },
        {
          id: '3',
          companyName: 'ThreatShield',
          sector: 'Threat Intelligence',
          fundingStage: 'Series B',
          fundingAmount: 25000000,
          momentum: 65,
          riskScore: 60,
          recommendation: 'hold',
          keyMetrics: {
            teamScore: 75,
            marketSize: 82,
            traction: 78,
            technology: 70
          },
          recentSignals: [
            { type: 'Customer Churn', description: 'Lost major enterprise client', date: '2024-10-09', impact: 'negative' },
            { type: 'Product Update', description: 'Platform performance improvements', date: '2024-10-06', impact: 'neutral' }
          ],
          nextActions: [
            'Investigate customer churn',
            'Review retention metrics',
            'Assess competitive threats'
          ]
        }
      ])

      setPortfolio([
        {
          name: 'CyberSecure',
          sector: 'Cloud Security',
          investmentAmount: 12000000,
          currentValuation: 85000000,
          momentum: 88,
          lastUpdate: '2024-10-12',
          status: 'thriving',
          keyEvents: [
            { type: 'Partnership', description: 'Major cloud provider integration', date: '2024-10-10' },
            { type: 'Revenue', description: '150% YoY growth achieved', date: '2024-10-05' }
          ]
        },
        {
          name: 'ZeroTrust Pro',
          sector: 'Zero Trust',
          investmentAmount: 8000000,
          currentValuation: 45000000,
          momentum: 72,
          lastUpdate: '2024-10-11',
          status: 'growing',
          keyEvents: [
            { type: 'Product Launch', description: 'Next-gen identity platform', date: '2024-10-08' },
            { type: 'Team', description: 'VP Engineering hired', date: '2024-10-03' }
          ]
        },
        {
          name: 'ThreatIntel Corp',
          sector: 'Threat Intelligence',
          investmentAmount: 15000000,
          currentValuation: 35000000,
          momentum: 45,
          lastUpdate: '2024-10-10',
          status: 'concerning',
          keyEvents: [
            { type: 'Challenge', description: 'Customer acquisition slowdown', date: '2024-10-07' },
            { type: 'Pivot', description: 'Product strategy adjustment', date: '2024-10-02' }
          ]
        }
      ])

      setMarketIntel({
        sectorTrends: [
          { sector: 'AI Security', growth: 45, fundingVolume: 890000000, dealCount: 34, avgValuation: 26200000 },
          { sector: 'Cloud Security', growth: 32, fundingVolume: 1200000000, dealCount: 48, avgValuation: 25000000 },
          { sector: 'Zero Trust', growth: 28, fundingVolume: 650000000, dealCount: 26, avgValuation: 25000000 },
          { sector: 'Identity & Access', growth: 25, fundingVolume: 580000000, dealCount: 29, avgValuation: 20000000 }
        ],
        competitiveThreats: [
          { company: 'CrowdStrike', threat: 'Market consolidation', severity: 'high', description: 'Aggressive acquisition strategy targeting our portfolio sectors' },
          { company: 'Palo Alto Networks', threat: 'Platform expansion', severity: 'medium', description: 'Expanding into adjacent security markets' },
          { company: 'Microsoft', threat: 'Integrated solutions', severity: 'high', description: 'Bundling security with core products' }
        ],
        emergingTechnologies: [
          { technology: 'Quantum-Safe Cryptography', adoptionRate: 15, marketPotential: 95, companies: ['QuantumSecure', 'CryptoShield'] },
          { technology: 'AI-Powered SOC', adoptionRate: 35, marketPotential: 88, companies: ['AutoSOC', 'IntelliSecure'] },
          { technology: 'Behavioral Biometrics', adoptionRate: 25, marketPotential: 82, companies: ['BioSecure', 'IdentityAI'] }
        ]
      })

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_buy': return 'bg-green-500'
      case 'buy': return 'bg-blue-500'
      case 'hold': return 'bg-yellow-500'
      case 'pass': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_buy': return <TrendingUp className="h-4 w-4" />
      case 'buy': return <ArrowRight className="h-4 w-4" />
      case 'hold': return <Clock className="h-4 w-4" />
      case 'pass': return <TrendingDown className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thriving': return 'text-green-600 bg-green-50'
      case 'growing': return 'text-blue-600 bg-blue-50'
      case 'stable': return 'text-yellow-600 bg-yellow-50'
      case 'concerning': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
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

  const executeAction = async (action: string, companyName: string) => {
    console.log(`Executing action: ${action} for ${companyName}`)
    // In production, this would trigger actual workflows
    alert(`Action initiated: ${action} for ${companyName}`)
  }

  const generateReport = async (type: string) => {
    console.log(`Generating ${type} report`)
    alert(`${type} report generation started. You'll receive an email when ready.`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse text-blue-500" />
          <p className="text-lg font-medium">Loading Executive Intelligence...</p>
          <p className="text-sm text-muted-foreground">Analyzing market data and portfolio performance</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Executive Command Center
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Strategic cybersecurity investment intelligence and portfolio management
          </p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <SecureActionButton 
            onClick={() => generateReport('Executive Summary')}
            debounceMs={1000}
            maxClicksPerMinute={5}
          >
            <Download className="h-4 w-4" />
            Generate Report
          </SecureActionButton>
        </div>
      </div>

      {/* Key Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Funding Tracked</p>
                  <p className="text-3xl font-bold text-blue-900">{formatCurrency(metrics.totalFunding)}</p>
                  <p className="text-sm text-blue-600 mt-1">+18% vs last quarter</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Portfolio Value</p>
                  <p className="text-3xl font-bold text-green-900">{formatCurrency(metrics.portfolioValue)}</p>
                  <p className="text-sm text-green-600 mt-1">+24% vs last quarter</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Active Pipeline</p>
                  <p className="text-3xl font-bold text-purple-900">{formatCurrency(metrics.pipelineValue)}</p>
                  <p className="text-sm text-purple-600 mt-1">{metrics.activeDeals} active deals</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Companies Tracked</p>
                  <p className="text-3xl font-bold text-orange-900">{metrics.totalCompanies}</p>
                  <p className="text-sm text-orange-600 mt-1">Avg: {formatCurrency(metrics.avgFundingSize)}</p>
                </div>
                <Building className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="opportunities">Investment Opportunities</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Performance</TabsTrigger>
          <TabsTrigger value="market">Market Intelligence</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="actions">Action Center</TabsTrigger>
        </TabsList>

        {/* Investment Opportunities */}
        <TabsContent value="opportunities" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Investment Opportunities</h2>
            <div className="flex gap-2">
              <select 
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Sectors</option>
                <option value="cloud">Cloud Security</option>
                <option value="ai">AI Security</option>
                <option value="zero-trust">Zero Trust</option>
                <option value="identity">Identity & Access</option>
              </select>
              <SecureActionButton 
                onClick={() => generateReport('Investment Pipeline')}
                debounceMs={1000}
                maxClicksPerMinute={5}
              >
                <Filter className="h-4 w-4" />
                Filter & Export
              </SecureActionButton>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="border-2 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{opportunity.companyName}</CardTitle>
                      <CardDescription>{opportunity.sector} • {opportunity.fundingStage}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getRecommendationColor(opportunity.recommendation)} text-white`}>
                        {getRecommendationIcon(opportunity.recommendation)}
                        {opportunity.recommendation.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(opportunity.fundingAmount)}</div>
                      <div className="text-sm text-muted-foreground">Funding Size</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{opportunity.momentum}</div>
                      <div className="text-sm text-muted-foreground">Momentum Score</div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Team Quality</span>
                      <div className="flex items-center gap-2">
                        <Progress value={opportunity.keyMetrics.teamScore} className="w-16 h-2" />
                        <span className="text-sm font-medium">{opportunity.keyMetrics.teamScore}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Market Size</span>
                      <div className="flex items-center gap-2">
                        <Progress value={opportunity.keyMetrics.marketSize} className="w-16 h-2" />
                        <span className="text-sm font-medium">{opportunity.keyMetrics.marketSize}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Traction</span>
                      <div className="flex items-center gap-2">
                        <Progress value={opportunity.keyMetrics.traction} className="w-16 h-2" />
                        <span className="text-sm font-medium">{opportunity.keyMetrics.traction}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Technology</span>
                      <div className="flex items-center gap-2">
                        <Progress value={opportunity.keyMetrics.technology} className="w-16 h-2" />
                        <span className="text-sm font-medium">{opportunity.keyMetrics.technology}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Signals */}
                  <div>
                    <h4 className="font-medium mb-2">Recent Signals</h4>
                    <div className="space-y-2">
                      {opportunity.recentSignals.slice(0, 2).map((signal, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${
                            signal.impact === 'positive' ? 'bg-green-500' : 
                            signal.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                          }`} />
                          <span className="flex-1">{signal.description}</span>
                          <span className="text-muted-foreground">{signal.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <SecureActionButton
                      onClick={() => executeAction('Schedule Due Diligence', opportunity.companyName)}
                      debounceMs={500}
                      maxClicksPerMinute={10}
                      size="sm"
                      className="flex-1"
                    >
                      <Calendar className="h-3 w-3" />
                      Due Diligence
                    </SecureActionButton>
                    <SecureActionButton
                      onClick={() => executeAction('View Details', opportunity.companyName)}
                      debounceMs={300}
                      maxClicksPerMinute={20}
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="h-3 w-3" />
                      Details
                    </SecureActionButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Portfolio Performance */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Portfolio Performance</h2>
            <SecureActionButton 
              onClick={() => generateReport('Portfolio Performance')}
              debounceMs={1000}
              maxClicksPerMinute={5}
            >
              <BarChart3 className="h-4 w-4" />
              Performance Report
            </SecureActionButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {portfolio.map((company, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription>{company.sector}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(company.status)}>
                      {company.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Investment Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(company.investmentAmount)}</div>
                      <div className="text-sm text-muted-foreground">Investment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{formatCurrency(company.currentValuation)}</div>
                      <div className="text-sm text-muted-foreground">Current Value</div>
                    </div>
                  </div>

                  {/* ROI Calculation */}
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(((company.currentValuation - company.investmentAmount) / company.investmentAmount) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">ROI</div>
                  </div>

                  {/* Momentum Score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Momentum Score</span>
                      <span className="text-sm font-bold">{company.momentum}/100</span>
                    </div>
                    <Progress value={company.momentum} className="w-full" />
                  </div>

                  {/* Recent Events */}
                  <div>
                    <h4 className="font-medium mb-2">Recent Events</h4>
                    <div className="space-y-2">
                      {company.keyEvents.map((event, eventIndex) => (
                        <div key={eventIndex} className="text-sm">
                          <div className="font-medium">{event.type}</div>
                          <div className="text-muted-foreground">{event.description}</div>
                          <div className="text-xs text-muted-foreground">{event.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <SecureActionButton
                      onClick={() => executeAction('Board Meeting', company.name)}
                      debounceMs={500}
                      maxClicksPerMinute={10}
                      size="sm"
                      className="flex-1"
                    >
                      <Users className="h-3 w-3" />
                      Board Meeting
                    </SecureActionButton>
                    <SecureActionButton
                      onClick={() => executeAction('Performance Review', company.name)}
                      debounceMs={500}
                      maxClicksPerMinute={10}
                      size="sm"
                      variant="outline"
                    >
                      <BarChart3 className="h-3 w-3" />
                      Review
                    </SecureActionButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Market Intelligence */}
        <TabsContent value="market" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Market Intelligence</h2>
            <SecureActionButton 
              onClick={() => generateReport('Market Analysis')}
              debounceMs={1000}
              maxClicksPerMinute={5}
            >
              <Globe className="h-4 w-4" />
              Market Report
            </SecureActionButton>
          </div>

          {marketIntel && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sector Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sector Growth Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketIntel.sectorTrends.map((sector, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{sector.sector}</span>
                          <Badge variant="outline">+{sector.growth}%</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div>Volume: {formatCurrency(sector.fundingVolume)}</div>
                          <div>Deals: {sector.dealCount}</div>
                          <div>Avg: {formatCurrency(sector.avgValuation)}</div>
                        </div>
                        <Progress value={sector.growth} className="w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Competitive Threats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Competitive Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketIntel.competitiveThreats.map((threat, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{threat.company}</span>
                          <Badge variant={threat.severity === 'high' ? 'destructive' : threat.severity === 'medium' ? 'default' : 'secondary'}>
                            {threat.severity}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">{threat.threat}</div>
                        <div className="text-sm text-muted-foreground">{threat.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emerging Technologies */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Emerging Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {marketIntel.emergingTechnologies.map((tech, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-3">{tech.technology}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Adoption Rate</span>
                            <span>{tech.adoptionRate}%</span>
                          </div>
                          <Progress value={tech.adoptionRate} className="w-full" />
                          <div className="flex justify-between text-sm">
                            <span>Market Potential</span>
                            <span>{tech.marketPotential}%</span>
                          </div>
                          <Progress value={tech.marketPotential} className="w-full" />
                          <div className="text-sm text-muted-foreground">
                            Key Players: {tech.companies.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Advanced Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Advanced Analytics</h2>
            <SecureActionButton 
              onClick={() => generateReport('Advanced Analytics')}
              debounceMs={1000}
              maxClicksPerMinute={5}
            >
              <LineChart className="h-4 w-4" />
              Analytics Report
            </SecureActionButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funding Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Funding Trend Analysis</CardTitle>
                <CardDescription>Monthly funding volume and deal count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Interactive funding trend chart</p>
                    <p className="text-sm text-gray-400">Chart.js integration would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sector Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Distribution</CardTitle>
                <CardDescription>Investment allocation by cybersecurity sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Interactive pie chart</p>
                    <p className="text-sm text-gray-400">Sector allocation visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators and benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average ROI</span>
                    <span className="text-2xl font-bold text-green-600">247%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Success Rate</span>
                    <span className="text-2xl font-bold text-blue-600">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Time to Exit</span>
                    <span className="text-2xl font-bold text-purple-600">4.2y</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Portfolio IRR</span>
                    <span className="text-2xl font-bold text-orange-600">32%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
                <CardDescription>Portfolio risk assessment and mitigation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Market Risk</span>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Technology Risk</span>
                    <Badge variant="destructive">High</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Competitive Risk</span>
                    <Badge variant="default">Low</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Regulatory Risk</span>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Action Center */}
        <TabsContent value="actions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Action Center</h2>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {opportunities.reduce((sum, opp) => sum + opp.nextActions.length, 0)} pending actions
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Immediate Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Immediate Actions Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities.flatMap(opp => 
                    opp.nextActions.slice(0, 2).map((action, index) => (
                      <div key={`${opp.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{action}</div>
                          <div className="text-sm text-muted-foreground">{opp.companyName}</div>
                        </div>
                        <SecureActionButton
                          onClick={() => executeAction(action, opp.companyName)}
                          debounceMs={500}
                          maxClicksPerMinute={10}
                          size="sm"
                        >
                          Execute
                        </SecureActionButton>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Scheduled Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Board Meeting - CyberSecure</div>
                      <div className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</div>
                    </div>
                    <SecureActionButton
                      onClick={() => executeAction('Join Meeting', 'CyberSecure')}
                      debounceMs={300}
                      maxClicksPerMinute={20}
                      size="sm"
                      variant="outline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Join
                    </SecureActionButton>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Due Diligence Call - SecureFlow AI</div>
                      <div className="text-sm text-muted-foreground">Friday, 10:00 AM</div>
                    </div>
                    <SecureActionButton
                      onClick={() => executeAction('Prepare Materials', 'SecureFlow AI')}
                      debounceMs={500}
                      maxClicksPerMinute={10}
                      size="sm"
                      variant="outline"
                    >
                      Prepare
                    </SecureActionButton>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Portfolio Review - Q4 2024</div>
                      <div className="text-sm text-muted-foreground">Next Monday, 9:00 AM</div>
                    </div>
                    <SecureActionButton
                      onClick={() => generateReport('Q4 Portfolio Review')}
                      debounceMs={1000}
                      maxClicksPerMinute={5}
                      size="sm"
                      variant="outline"
                    >
                      Generate Report
                    </SecureActionButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SecureActionButton
                    onClick={() => generateReport('Weekly Summary')}
                    debounceMs={1000}
                    maxClicksPerMinute={5}
                    className="h-20 flex-col"
                  >
                    <Mail className="h-6 w-6 mb-2" />
                    Weekly Report
                  </SecureActionButton>
                  
                  <SecureActionButton
                    onClick={() => executeAction('Schedule Pipeline Review', 'All Companies')}
                    debounceMs={1000}
                    maxClicksPerMinute={5}
                    className="h-20 flex-col"
                  >
                    <Calendar className="h-6 w-6 mb-2" />
                    Pipeline Review
                  </SecureActionButton>
                  
                  <SecureActionButton
                    onClick={() => executeAction('Market Analysis', 'Cybersecurity')}
                    debounceMs={1000}
                    maxClicksPerMinute={5}
                    className="h-20 flex-col"
                  >
                    <Globe className="h-6 w-6 mb-2" />
                    Market Analysis
                  </SecureActionButton>
                  
                  <SecureActionButton
                    onClick={() => executeAction('Risk Assessment', 'Portfolio')}
                    debounceMs={1000}
                    maxClicksPerMinute={5}
                    className="h-20 flex-col"
                  >
                    <Shield className="h-6 w-6 mb-2" />
                    Risk Assessment
                  </SecureActionButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}