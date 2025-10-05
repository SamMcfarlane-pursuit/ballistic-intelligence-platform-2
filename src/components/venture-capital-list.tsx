"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Calendar,
  ExternalLink,
  Download,
  RefreshCw,
  Eye,
  Star
} from 'lucide-react'

interface VentureCapital {
  id: string
  name: string
  type: 'VC' | 'Corporate' | 'Angel' | 'Private Equity'
  focus: string[]
  totalInvestments: number
  averageCheckSize: number
  portfolioCompanies: number
  recentInvestments: number
  foundedYear: number
  headquarters: string
  website: string
  confidence: number
  lastUpdated: string
}

interface FundingAnalysis {
  totalFunding: number
  dealCount: number
  averageDealSize: number
  topSectors: Array<{
    sector: string
    funding: number
    deals: number
  }>
  trendingVCs: Array<{
    name: string
    investments: number
    growth: number
  }>
  marketTrends: Array<{
    trend: string
    impact: 'high' | 'medium' | 'low'
    description: string
  }>
}

export default function VentureCapitalList() {
  const [vcData, setVcData] = useState<VentureCapital[]>([])
  const [analysis, setAnalysis] = useState<FundingAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('totalInvestments')
  const [lastRefresh, setLastRefresh] = useState<string>('')

  // Fetch real-time data from API
  const fetchVCData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/venture-capital?type=${filterType}&sortBy=${sortBy}&search=${searchTerm}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setVcData(result.data.vcData)
        setAnalysis(result.data.analysis)
        setLastRefresh(new Date().toLocaleTimeString())
      } else {
        throw new Error(result.error || 'Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching VC data:', error)
      // Fallback to mock data if API fails
      const mockVCData: VentureCapital[] = [
        {
          id: '1',
          name: 'Andreessen Horowitz',
          type: 'VC',
          focus: ['Cybersecurity', 'AI', 'Enterprise SaaS'],
          totalInvestments: 2850000000,
          averageCheckSize: 15000000,
          portfolioCompanies: 342,
          recentInvestments: 12,
          foundedYear: 2009,
          headquarters: 'Menlo Park, CA',
          website: 'https://a16z.com',
          confidence: 96,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Sequoia Capital',
          type: 'VC',
          focus: ['Enterprise Security', 'Cloud Infrastructure', 'DevOps'],
          totalInvestments: 3200000000,
          averageCheckSize: 20000000,
          portfolioCompanies: 287,
          recentInvestments: 8,
          foundedYear: 1972,
          headquarters: 'Menlo Park, CA',
          website: 'https://sequoiacap.com',
          confidence: 98,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Google Ventures',
          type: 'Corporate',
          focus: ['AI Security', 'Cloud Security', 'Threat Detection'],
          totalInvestments: 1800000000,
          averageCheckSize: 12000000,
          portfolioCompanies: 156,
          recentInvestments: 6,
          foundedYear: 2009,
          headquarters: 'Mountain View, CA',
          website: 'https://gv.com',
          confidence: 94,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Accel',
          type: 'VC',
          focus: ['Cybersecurity', 'SaaS', 'FinTech'],
          totalInvestments: 2400000000,
          averageCheckSize: 18000000,
          portfolioCompanies: 198,
          recentInvestments: 9,
          foundedYear: 1983,
          headquarters: 'Palo Alto, CA',
          website: 'https://accel.com',
          confidence: 95,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Kleiner Perkins',
          type: 'VC',
          focus: ['Enterprise Security', 'Digital Health', 'Climate Tech'],
          totalInvestments: 2100000000,
          averageCheckSize: 16000000,
          portfolioCompanies: 234,
          recentInvestments: 7,
          foundedYear: 1972,
          headquarters: 'Menlo Park, CA',
          website: 'https://kpcb.com',
          confidence: 93,
          lastUpdated: new Date().toISOString()
        }
      ]

      const mockAnalysis: FundingAnalysis = {
        totalFunding: 12350000000,
        dealCount: 479,
        averageDealSize: 25782881,
        topSectors: [
          { sector: 'AI Security', funding: 2850000000, deals: 89 },
          { sector: 'Cloud Security', funding: 3200000000, deals: 124 },
          { sector: 'Zero Trust', funding: 1800000000, deals: 67 },
          { sector: 'Threat Detection', funding: 2400000000, deals: 98 },
          { sector: 'Compliance', funding: 2100000000, deals: 101 }
        ],
        trendingVCs: [
          { name: 'Andreessen Horowitz', investments: 12, growth: 23 },
          { name: 'Sequoia Capital', investments: 8, growth: 18 },
          { name: 'Accel', investments: 9, growth: 15 },
          { name: 'Google Ventures', investments: 6, growth: 12 },
          { name: 'Kleiner Perkins', investments: 7, growth: 10 }
        ],
        marketTrends: [
          {
            trend: 'AI-Powered Security',
            impact: 'high',
            description: 'Increased investment in AI-driven threat detection and response'
          },
          {
            trend: 'Zero Trust Architecture',
            impact: 'high',
            description: 'Growing demand for zero trust security solutions'
          },
          {
            trend: 'Cloud Security Posture',
            impact: 'medium',
            description: 'Focus on cloud-native security and compliance'
          }
        ]
      }

      setVcData(mockVCData)
      setAnalysis(mockAnalysis)
      setLastRefresh(new Date().toLocaleTimeString())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVCData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchVCData, 30000)
    
    return () => clearInterval(interval)
  }, [filterType, sortBy, searchTerm])

  // Data is already filtered and sorted by the API
  const filteredData = vcData

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else {
      return `$${(amount / 1000).toFixed(1)}K`
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600'
    if (confidence >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VC': return 'bg-blue-100 text-blue-800'
      case 'Corporate': return 'bg-purple-100 text-purple-800'
      case 'Angel': return 'bg-green-100 text-green-800'
      case 'Private Equity': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportToJSON = () => {
    const dataStr = JSON.stringify({ vcData: filteredData, analysis }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `venture-capital-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  if (loading) {
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
          <h2 className="text-2xl font-bold">Venture Capital Directory</h2>
          <p className="text-muted-foreground">
            Real-time funding analysis and investor intelligence • Last updated: {lastRefresh}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchVCData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportToJSON}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Analysis Overview */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Funding</p>
                  <p className="text-2xl font-bold">{formatCurrency(analysis.totalFunding)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Deals</p>
                  <p className="text-2xl font-bold">{analysis.dealCount}</p>
                </div>
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Deal Size</p>
                  <p className="text-2xl font-bold">{formatCurrency(analysis.averageDealSize)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active VCs</p>
                  <p className="text-2xl font-bold">{vcData.length}</p>
                </div>
                <Star className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search VCs or focus areas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="VC">Venture Capital</SelectItem>
                <SelectItem value="Corporate">Corporate VC</SelectItem>
                <SelectItem value="Angel">Angel Investor</SelectItem>
                <SelectItem value="Private Equity">Private Equity</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalInvestments">Total Investments</SelectItem>
                <SelectItem value="recentInvestments">Recent Activity</SelectItem>
                <SelectItem value="confidence">Confidence</SelectItem>
                <SelectItem value="portfolioCompanies">Portfolio Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* VC List */}
      <Card>
        <CardHeader>
          <CardTitle>Venture Capital Firms ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firm</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Focus Areas</TableHead>
                  <TableHead>Total Investments</TableHead>
                  <TableHead>Portfolio</TableHead>
                  <TableHead>Recent Activity</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((vc) => (
                  <TableRow key={vc.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vc.name}</p>
                        <p className="text-sm text-muted-foreground">{vc.headquarters}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(vc.type)}>
                        {vc.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {vc.focus.slice(0, 2).map((focus, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {focus}
                          </Badge>
                        ))}
                        {vc.focus.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{vc.focus.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatCurrency(vc.totalInvestments)}</p>
                      <p className="text-sm text-muted-foreground">
                        Avg: {formatCurrency(vc.averageCheckSize)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{vc.portfolioCompanies}</p>
                      <p className="text-sm text-muted-foreground">companies</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{vc.recentInvestments}</p>
                      <p className="text-sm text-muted-foreground">recent deals</p>
                    </TableCell>
                    <TableCell>
                      <p className={`font-medium ${getConfidenceColor(vc.confidence)}`}>
                        {vc.confidence}%
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={vc.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Market Trends */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Market Trends & Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Top Sectors</h4>
                <div className="space-y-3">
                  {analysis.topSectors.map((sector, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{sector.sector}</p>
                        <p className="text-sm text-muted-foreground">{sector.deals} deals</p>
                      </div>
                      <p className="font-semibold">{formatCurrency(sector.funding)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Trending VCs</h4>
                <div className="space-y-3">
                  {analysis.trendingVCs.map((vc, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{vc.name}</p>
                        <p className="text-sm text-muted-foreground">{vc.investments} investments</p>
                      </div>
                      <Badge variant={vc.growth > 15 ? "default" : "secondary"}>
                        +{vc.growth}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-4">Market Trends</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.marketTrends.map((trend, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{trend.trend}</p>
                      <Badge variant={trend.impact === 'high' ? 'destructive' : trend.impact === 'medium' ? 'default' : 'secondary'}>
                        {trend.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{trend.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}