"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Brain, 
  RefreshCw,
  BarChart3,
  PieChart,
  Target,
  Building2,
  Award,
  Zap,
  Activity,
  Globe,
  Briefcase,
  Shield,
  Lightbulb
} from 'lucide-react'

interface TechnicalTrends {
  technologies: Array<{
    technology: string
    companyCount: number
    totalFunding: number
    averageFunding: number
  }>
  companiesByCategory: Array<{
    category: string
    companyCount: number
    totalFunding: number
    totalPatents: number
    averageGrowthRate: number
  }>
  topPatentCompanies: Array<{
    name: string
    primary_category: string
    patents_count: number
    total_funding: number
    core_technology: string
    founded_year: number
  }>
  recentFunding: Array<{
    companyName: string
    category: string
    technology: string
    roundType: string
    amount: number
    date: string
  }>
  aiInsights: any
}

interface FinancialTrends {
  topActiveVCs: Array<{
    name: string
    investmentCount: number
    totalAmount: number
    companies: string[]
    averageInvestment: number
  }>
  recentFundingRounds: Array<{
    companyName: string
    category: string
    technology: string
    roundType: string
    amount: number
    date: string
    leadInvestor: string
  }>
  trendingSubSectors: Array<{
    sector: string
    companyCount: number
    totalFunding: number
  }>
  fundedCompanies: Array<{
    name: string
    primary_category: string
    total_funding: number
    funding_rounds_count: number
    current_stage: string
    core_technology: string
    founded_year: number
    headquarters: string
  }>
  fundingSources: {
    ventureCapital: number
    corporateVC: number
    angelInvestors: number
    privateEquity: number
    other: number
  }
  totalInvestors: number
  totalRounds: number
  totalAmount: number
  aiInsights: any
}

interface VCCompetitorData {
  topActiveVCs: Array<{
    name: string
    investments: number
    totalAmount: number
    companies: string[]
    sectors: string[]
    stages: string[]
    averageCheckSize: number
    lastInvestment: string
    portfolioDiversity: number
    stageFocus: string
  }>
  recentFundingRounds: Array<{
    companyName: string
    category: string
    technology: string
    roundType: string
    amount: number
    date: string
    leadInvestor: string
    totalCompanyFunding: number
    currentStage: string
    allInvestors: string[]
  }>
  trendingSubSectors: Array<{
    sector: string
    fundingCount: number
    totalAmount: number
    uniqueVCs: number
    averageRoundSize: number
  }>
  fundedCompanies: Array<{
    name: string
    primary_category: string
    core_technology: string
    total_funding: number
    funding_rounds_count: number
    current_stage: string
    employee_count: number
    founded_year: number
    headquarters: string
    growth_rate: number
  }>
  fundingAnalysis: {
    byStage: Record<string, number>
    bySector: Record<string, number>
    byInvestorType: Record<string, number>
    totalCapital: number
    averageRoundSize: number
  }
  marketOverview: {
    totalVCs: number
    totalRounds: number
    uniqueCompanies: number
    totalSectors: number
  }
  aiInsights: any
}

export default function ResearchDashboard() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeframe, setTimeframe] = useState('month')
  
  const [technicalData, setTechnicalData] = useState<TechnicalTrends | null>(null)
  const [financialData, setFinancialData] = useState<FinancialTrends | null>(null)
  const [vcData, setVCData] = useState<VCCompetitorData | null>(null)

  const fetchData = async () => {
    try {
      const [technicalRes, financialRes, vcRes] = await Promise.all([
        fetch('/api/technical-research-trends'),
        fetch(`/api/financial-research-trends?timeframe=${timeframe}`),
        fetch(`/api/vc-competitor-research?timeframe=${timeframe}`)
      ])

      const [technical, financial, vc] = await Promise.all([
        technicalRes.json(),
        financialRes.json(),
        vcRes.json()
      ])

      if (technical.success) setTechnicalData(technical.data)
      if (financial.success) setFinancialData(financial.data)
      if (vc.success) setVCData(vc.data)
    } catch (error) {
      console.error('Error fetching research data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchData()
  }, [timeframe])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`
    return `$${amount}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading research data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Research Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive cybersecurity technical and financial research trends
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <Button
            onClick={refreshData}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="technical" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Technical Trends
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial Trends
          </TabsTrigger>
          <TabsTrigger value="vc-competitor" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            VC Competitor
          </TabsTrigger>
        </TabsList>

        {/* Technical Research Trends */}
        <TabsContent value="technical" className="space-y-6">
          {technicalData && (
            <>
              {/* Technologies Being Used */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Technologies Being Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {technicalData.technologies.slice(0, 9).map((tech, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{tech.technology}</h4>
                          <Badge variant="outline">{tech.companyCount} companies</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Total: {formatCurrency(tech.totalFunding)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg: {formatCurrency(tech.averageFunding)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Patent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      Companies Seeking Patents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {technicalData.topPatentCompanies.slice(0, 8).map((company, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{company.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {company.primary_category} • {company.core_technology}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{company.patents_count} patents</Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatCurrency(company.total_funding)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-green-600" />
                      Categories by Innovation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {technicalData.companiesByCategory.map((category, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{category.category}</h4>
                            <Badge variant="outline">{category.companyCount} companies</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Funding:</span>
                              <span className="ml-1 font-medium">{formatCurrency(category.totalFunding)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Patents:</span>
                              <span className="ml-1 font-medium">{category.totalPatents}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Growth:</span>
                              <span className="ml-1 font-medium">{category.averageGrowthRate.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>


            </>
          )}
        </TabsContent>

        {/* Financial Research Trends */}
        <TabsContent value="financial" className="space-y-6">
          {financialData && (
            <>
              {/* Top Active VCs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Top 5 Active VCs This {timeframe === 'month' ? 'Month' : timeframe === 'year' ? 'Year' : 'Period'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {financialData.topActiveVCs.map((vc, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{vc.name}</h4>
                          <Badge variant="outline">#{index + 1}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Investments:</span>
                            <span className="font-medium">{vc.investmentCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-medium">{formatCurrency(vc.totalAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Average:</span>
                            <span className="font-medium">{formatCurrency(vc.averageInvestment)}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground">
                            Portfolio: {vc.companies.slice(0, 3).join(', ')}
                            {vc.companies.length > 3 && '...'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Funding & Trending Sectors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Recent Funding Rounds
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {financialData.recentFundingRounds.slice(0, 15).map((round, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{round.companyName}</h4>
                            <Badge variant="outline">{round.roundType}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{round.category}</span>
                            <span className="font-medium">{formatCurrency(round.amount)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {round.leadInvestor} • {formatDate(round.date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-600" />
                      Trending Sub-Sectors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {financialData.trendingSubSectors.map((sector, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{sector.sector}</h4>
                            <Badge variant="outline">{sector.companyCount} companies</Badge>
                          </div>
                          <p className="text-sm font-medium">{formatCurrency(sector.totalFunding)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Funded Companies & Funding Sources */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-purple-600" />
                      Firms Getting Funded
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {financialData.fundedCompanies.slice(0, 12).map((company, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{company.name}</h4>
                            <Badge variant="outline">{company.current_stage}</Badge>
                          </div>
                          <div className="text-sm">
                            <p className="text-muted-foreground">{company.primary_category}</p>
                            <p className="font-medium">{formatCurrency(company.total_funding)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-red-600" />
                      Where Money's Coming From
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(financialData.fundingSources).map(([source, amount], index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium capitalize">{source.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <span className="font-medium">{formatCurrency(amount)}</span>
                          </div>
                        </div>
                      ))}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-blue-900">Total Capital</h4>
                          <span className="font-medium text-blue-900">{formatCurrency(financialData.totalAmount)}</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          {financialData.totalRounds} rounds • {financialData.totalInvestors} investors
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* VC Competitor Research */}
        <TabsContent value="vc-competitor" className="space-y-6">
          {vcData && (
            <>
              {/* Top Active VCs with Competitive Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Top 5 Active VCs - Competitive Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {vcData.topActiveVCs.map((vc, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{vc.name}</h4>
                          <Badge variant="outline">#{index + 1}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Deals:</span>
                            <span className="font-medium">{vc.investments}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-medium">{formatCurrency(vc.totalAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg Check:</span>
                            <span className="font-medium">{formatCurrency(vc.averageCheckSize)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sectors:</span>
                            <span className="font-medium">{vc.portfolioDiversity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Stage:</span>
                            <span className="font-medium">{vc.stageFocus}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground">
                            Focus: {vc.sectors.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Funding with VC Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    Recent Funding Rounds - VC Competition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {vcData.recentFundingRounds.slice(0, 12).map((round, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{round.companyName}</h4>
                          <Badge variant="outline">{round.roundType}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">{round.category}</span>
                          <span className="font-medium">{formatCurrency(round.amount)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p><strong>Lead:</strong> {round.leadInvestor}</p>
                          <p><strong>Total Funding:</strong> {formatCurrency(round.totalCompanyFunding)}</p>
                          <p><strong>Stage:</strong> {round.currentStage}</p>
                          {round.allInvestors.length > 0 && (
                            <p><strong>Others:</strong> {round.allInvestors.slice(0, 3).join(', ')}
                              {round.allInvestors.length > 3 && '...'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Sub-Sectors & Market Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Trending Sub-Sectors - VC Focus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {vcData.trendingSubSectors.map((sector, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{sector.sector}</h4>
                            <Badge variant="outline">{sector.uniqueVCs} VCs</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Deals:</span>
                              <span className="ml-1 font-medium">{sector.fundingCount}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total:</span>
                              <span className="ml-1 font-medium">{formatCurrency(sector.totalAmount)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Avg Round:</span>
                              <span className="ml-1 font-medium">{formatCurrency(sector.averageRoundSize)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-600" />
                      Market Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">{vcData.marketOverview.totalVCs}</div>
                          <div className="text-sm text-muted-foreground">Active VCs</div>
                        </div>
                        <div className="p-3 border rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">{vcData.marketOverview.totalRounds}</div>
                          <div className="text-sm text-muted-foreground">Total Rounds</div>
                        </div>
                        <div className="p-3 border rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600">{vcData.marketOverview.uniqueCompanies}</div>
                          <div className="text-sm text-muted-foreground">Unique Companies</div>
                        </div>
                        <div className="p-3 border rounded-lg text-center">
                          <div className="text-2xl font-bold text-orange-600">{vcData.marketOverview.totalSectors}</div>
                          <div className="text-sm text-muted-foreground">Sectors</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 border rounded-lg">
                        <h4 className="font-medium mb-2">Capital Flow Analysis</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Total Capital:</span>
                            <span className="font-medium">{formatCurrency(vcData.fundingAnalysis.totalCapital)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Average Round Size:</span>
                            <span className="font-medium">{formatCurrency(vcData.fundingAnalysis.averageRoundSize)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}