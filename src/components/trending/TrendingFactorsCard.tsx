'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Loader2
} from 'lucide-react'

interface TrendingFactors {
  fundingMomentum: number
  growthRate: number
  marketInterest: number
  investorActivity: number
  timeRelevance: number
  overallTrending: number
}

interface CompanyTrending {
  id: string
  name: string
  category: string
  trendingScore: number
  trendingFactors: TrendingFactors
  trendDirection: 'up' | 'down' | 'stable'
  percentageChange: number
  rank: number
  lastUpdated: string
  companyDetails?: any
}

interface TrendingStats {
  totalCompanies: number
  averageTrendingScore: number
  trendingUp: number
  trendingDown: number
  stable: number
  topScore: number
  topCompany: string
}

interface TrendingSector {
  sector: string
  averageTrendingScore: number
  companyCount: number
  topCompany: string
}

export default function TrendingFactorsCard() {
  const [topTrending, setTopTrending] = useState<CompanyTrending[]>([])
  const [stats, setStats] = useState<TrendingStats | null>(null)
  const [sectors, setSectors] = useState<TrendingSector[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<'companies' | 'sectors' | 'stats'>('companies')

  useEffect(() => {
    loadTrendingData()
  }, [])

  const loadTrendingData = async () => {
    setIsLoading(true)
    try {
      // Load all trending data in parallel
      const [companiesRes, statsRes, sectorsRes] = await Promise.all([
        fetch('/api/trending-factors?action=top&limit=5'),
        fetch('/api/trending-factors?action=stats'),
        fetch('/api/trending-factors?action=sectors')
      ])

      if (companiesRes.ok) {
        const data = await companiesRes.json()
        if (data.success) {
          setTopTrending(data.data.topTrending)
        }
      }

      if (statsRes.ok) {
        const data = await statsRes.json()
        if (data.success) {
          setStats(data.data.statistics)
        }
      }

      if (sectorsRes.ok) {
        const data = await sectorsRes.json()
        if (data.success) {
          setSectors(data.data.sectors.slice(0, 5))
        }
      }
    } catch (error) {
      console.error('Failed to load trending data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendBadge = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'bg-green-100 text-green-800'
      case 'down':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'text-green-600'
    if (score >= 40) return 'text-blue-600'
    return 'text-gray-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 60) return 'bg-green-50 border-green-200'
    if (score >= 40) return 'bg-blue-50 border-blue-200'
    return 'bg-gray-50 border-gray-200'
  }

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-orange-700">Loading trending data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <Activity className="h-5 w-5 text-orange-600" />
              Trending Factors
            </CardTitle>
            <CardDescription className="text-orange-700">
              Real-time trending analysis powered by multi-factor algorithm
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedView === 'companies' ? 'default' : 'outline'}
              onClick={() => setSelectedView('companies')}
              className={selectedView === 'companies' ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              Companies
            </Button>
            <Button
              size="sm"
              variant={selectedView === 'sectors' ? 'default' : 'outline'}
              onClick={() => setSelectedView('sectors')}
              className={selectedView === 'sectors' ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              Sectors
            </Button>
            <Button
              size="sm"
              variant={selectedView === 'stats' ? 'default' : 'outline'}
              onClick={() => setSelectedView('stats')}
              className={selectedView === 'stats' ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              Stats
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Companies View */}
        {selectedView === 'companies' && (
          <div className="space-y-4">
            {topTrending.map((company, index) => (
              <div
                key={company.id}
                className={`rounded-lg border-2 overflow-hidden ${getScoreBgColor(company.trendingScore)}`}
              >
                {/* Prominent Company Header */}
                <div className="bg-white px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Company Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white text-sm font-bold flex-shrink-0">
                          #{company.rank}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                          {company.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 ml-11">
                        <span className="text-sm font-medium text-gray-600">{company.category}</span>
                        <Badge className={getTrendBadge(company.trendDirection)}>
                          {getTrendIcon(company.trendDirection)}
                          <span className="ml-1 font-semibold">{company.percentageChange}%</span>
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Right: Trending Score */}
                    <div className="text-center flex-shrink-0">
                      <div className={`text-4xl font-black ${getScoreColor(company.trendingScore)} leading-none mb-1`}>
                        {company.trendingScore}
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</div>
                    </div>
                  </div>
                </div>

                {/* Factor Breakdown */}
                <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-white">
                  <div className="grid grid-cols-5 gap-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">
                        {company.trendingFactors.fundingMomentum}
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium mt-0.5">Funding</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">
                        {company.trendingFactors.growthRate}
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium mt-0.5">Growth</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">
                        {company.trendingFactors.marketInterest}
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium mt-0.5">Market</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">
                        {company.trendingFactors.investorActivity}
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium mt-0.5">Investors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">
                        {company.trendingFactors.timeRelevance}
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium mt-0.5">Recency</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sectors View */}
        {selectedView === 'sectors' && (
          <div className="space-y-3">
            {sectors.map((sector, index) => (
              <div
                key={sector.sector}
                className={`p-4 rounded-lg border-2 ${getScoreBgColor(sector.averageTrendingScore)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-4 w-4 text-orange-600" />
                      <h4 className="font-bold text-gray-900">{sector.sector}</h4>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">{sector.companyCount}</span> companies
                      <span className="mx-1">•</span>
                      Top: <span className="font-semibold">{sector.topCompany}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(sector.averageTrendingScore)}`}>
                      {sector.averageTrendingScore}
                    </div>
                    <p className="text-xs text-gray-600">Avg Score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats View */}
        {selectedView === 'stats' && stats && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white border-2 border-orange-200">
                <div className="text-3xl font-bold text-orange-600">{stats.totalCompanies}</div>
                <div className="text-sm text-gray-600">Total Companies</div>
              </div>
              <div className="p-4 rounded-lg bg-white border-2 border-orange-200">
                <div className="text-3xl font-bold text-orange-600">{stats.averageTrendingScore}</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-bold text-green-900">Trending Up</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.trendingUp}</div>
              </div>
              <div className="text-sm text-green-700">
                {Math.round((stats.trendingUp / stats.totalCompanies) * 100)}% of companies showing upward momentum
              </div>
            </div>

            {stats.trendingDown > 0 && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <span className="font-bold text-red-900">Trending Down</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{stats.trendingDown}</div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200">
              <div className="text-sm text-purple-700 mb-1">Top Performing Company</div>
              <div className="font-bold text-xl text-purple-900">{stats.topCompany}</div>
              <div className="text-lg font-semibold text-purple-600">Score: {stats.topScore}</div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-4 pt-4 border-t border-orange-200">
          <Button
            variant="outline"
            size="sm"
            onClick={loadTrendingData}
            className="w-full text-orange-700 border-orange-300 hover:bg-orange-100"
          >
            <Activity className="h-4 w-4 mr-2" />
            Refresh Trending Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
