'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  TrendingUp, 
  DollarSign,
  Building2,
  Users,
  ExternalLink,
  Eye,
  Play
} from 'lucide-react'
// Chart components will be implemented with simple visualizations
// import { Line, Doughnut, Bar } from 'react-chartjs-2'

interface FundingRound {
  id: number
  companyName: string
  roundType: string
  amountUsd: number
  announcedDate: string
  valuationUsd?: number
  leadInvestors: string[]
  participatingInvestors: string[]
  source: string
  sourceUrl: string
  confidenceScore: number
  industry?: string
  headquarters?: string
}

interface InvestorNetwork {
  investorA: string
  investorB: string
  coInvestmentCount: number
  totalAmount: number
  relationshipStrength: number
}

interface Analytics {
  timeline: any
  roundTypes: any
  topInvestors: Array<{
    name: string
    investments: number
    totalAmount: number
  }>
  topSectors: Array<{
    sector: string
    deals: number
    totalFunding: number
  }>
  investorNetworks: InvestorNetwork[]
  summary: {
    totalFunding: number
    totalRounds: number
    averageRoundSize: number
    uniqueInvestors: number
    uniqueCompanies: number
    growthRate: number
    lastUpdated: string
  }
}

export function FundingTrackerDashboard() {
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [filters, setFilters] = useState({
    company: '',
    investor: '',
    roundType: 'all',
    minAmount: '',
    maxAmount: '',
    source: ''
  })
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Build query parameters
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value)
      })

      const [fundingResponse, analyticsResponse] = await Promise.all([
        fetch(`/api/funding-tracker?${params}`),
        fetch('/api/funding-tracker/analytics')
      ])

      if (fundingResponse.ok) {
        const fundingData = await fundingResponse.json()
        setFundingRounds(fundingData.data.fundingRounds)
      }

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData.data)
      }

      setLastUpdate(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerScraping = async () => {
    try {
      setScraping(true)
      
      const response = await fetch('/api/funding-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scrape' })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Scraping completed:', result.data)
        await fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Error triggering scraping:', error)
    } finally {
      setScraping(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const getRoundTypeColor = (roundType: string) => {
    const colors: Record<string, string> = {
      'Seed': 'bg-green-100 text-green-800',
      'Series A': 'bg-blue-100 text-blue-800',
      'Series B': 'bg-purple-100 text-purple-800',
      'Series C': 'bg-orange-100 text-orange-800',
      'Series D+': 'bg-red-100 text-red-800'
    }
    return colors[roundType] || 'bg-gray-100 text-gray-800'
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600'
    if (score >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Funding Tracker</h1>
          <p className="text-gray-600 mt-1">
            Real-time cybersecurity funding intelligence • Last updated: {lastUpdate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={triggerScraping}
            disabled={scraping}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {scraping ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {scraping ? 'Scraping...' : 'Scrape Now'}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Funding</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(analytics.summary.totalFunding)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rounds</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatNumber(analytics.summary.totalRounds)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Round</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(analytics.summary.averageRoundSize)}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Investors</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatNumber(analytics.summary.uniqueInvestors)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Companies</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatNumber(analytics.summary.uniqueCompanies)}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {analytics.summary.growthRate.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Company name..."
                value={filters.company}
                onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <Input
              placeholder="Investor name..."
              value={filters.investor}
              onChange={(e) => setFilters(prev => ({ ...prev, investor: e.target.value }))}
            />
            
            <Select value={filters.roundType} onValueChange={(value) => setFilters(prev => ({ ...prev, roundType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Round type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rounds</SelectItem>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B</SelectItem>
                <SelectItem value="Series C">Series C</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Min amount ($M)"
              type="number"
              value={filters.minAmount}
              onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
            />
            
            <Input
              placeholder="Max amount ($M)"
              type="number"
              value={filters.maxAmount}
              onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
            />
            
            <Button onClick={fetchData} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funding Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Funding Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900">Funding Timeline</p>
                  <p className="text-sm text-gray-600">Interactive chart showing funding trends over time</p>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-2 rounded">
                      <div className="font-semibold text-blue-600">$1.35B</div>
                      <div className="text-gray-600">Jan 2024</div>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <div className="font-semibold text-green-600">32</div>
                      <div className="text-gray-600">Rounds</div>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <div className="font-semibold text-purple-600">+42%</div>
                      <div className="text-gray-600">Growth</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Round Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Round Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <div className="w-32 h-32 rounded-full border-8 border-green-500 border-t-blue-500 border-r-purple-500 border-b-orange-500 border-l-red-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold">100%</div>
                        <div className="text-xs text-gray-600">Rounds</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Seed (35%)</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Series A (28%)</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span>Series B (20%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Investors and Sectors */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Investors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topInvestors.map((investor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{investor.name}</p>
                      <p className="text-sm text-gray-600">{investor.investments} investments</p>
                    </div>
                    <p className="font-semibold text-blue-600">
                      {formatCurrency(investor.totalAmount)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Sectors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topSectors.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{sector.sector}</p>
                      <p className="text-sm text-gray-600">{sector.deals} deals</p>
                    </div>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(sector.totalFunding)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Investor Networks */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Investor Network Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.investorNetworks.map((network, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{network.investorA}</span>
                      <span className="text-gray-400">↔</span>
                      <span className="font-medium text-sm">{network.investorB}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {(network.relationshipStrength * 100).toFixed(0)}% strength
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Co-investments: {network.coInvestmentCount}</div>
                    <div>Total amount: {formatCurrency(network.totalAmount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Funding Rounds Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Funding Rounds ({fundingRounds.length})</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Company</th>
                  <th className="text-left p-2">Round</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Lead Investors</th>
                  <th className="text-left p-2">Source</th>
                  <th className="text-left p-2">Confidence</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fundingRounds.map((round) => (
                  <tr key={round.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{round.companyName}</p>
                        {round.industry && (
                          <p className="text-xs text-gray-600">{round.industry}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className={getRoundTypeColor(round.roundType)}>
                        {round.roundType}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{formatCurrency(round.amountUsd)}</p>
                        {round.valuationUsd && (
                          <p className="text-xs text-gray-600">
                            Val: {formatCurrency(round.valuationUsd)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <p className="text-sm">{new Date(round.announcedDate).toLocaleDateString()}</p>
                    </td>
                    <td className="p-2">
                      <div className="space-y-1">
                        {round.leadInvestors.slice(0, 2).map((investor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs mr-1">
                            {investor}
                          </Badge>
                        ))}
                        {round.leadInvestors.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{round.leadInvestors.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary" className="text-xs">
                        {round.source}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <span className={`text-sm font-medium ${getConfidenceColor(round.confidenceScore)}`}>
                        {(round.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={round.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}