'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Search, 
  TrendingUp, 
  Building2, 
  Lightbulb,
  Award,
  Users,
  Calendar,
  ExternalLink,
  Eye,
  Download,
  RefreshCw,
  Zap,
  Target,
  BarChart3
} from 'lucide-react'

interface PatentData {
  id: string
  publicationNumber: string
  title: string
  abstract: string
  inventors: string[]
  assignee: string
  filingDate: string
  publicationDate: string
  status: string
  classifications: {
    cpc: string[]
    ipc: string[]
  }
  citationCount: number
  cybersecurityRelevance: number
  innovationScore: number
  commercialPotential: number
  marketSignals: string[]
  technologyTrends: string[]
}

interface CompanyProfile {
  companyName: string
  totalPatents: number
  patentGrowthRate: number
  averageCitationCount: number
  innovationTrend: string
  patentQuality: string
  competitivePosition: number
  topTechnologies: Array<{
    technology: string
    patentCount: number
    percentage: number
  }>
  marketSignals: Array<{
    signal: string
    strength: string
    date: string
  }>
}

interface PatentAnalytics {
  totalPatents: number
  patentGrowthRate: number
  averageInnovationScore: number
  technologyDistribution: Array<{
    technology: string
    count: number
    percentage: number
    growthRate: number
  }>
  marketSignals: Array<{
    signal: string
    impact: string
    companies: string[]
    trend: string
    marketSize: number
  }>
  innovationHotspots: Array<{
    area: string
    patentCount: number
    growthRate: number
    commercialPotential: number
  }>
}

export default function PatentIntelligencePage() {
  const [patents, setPatents] = useState<PatentData[]>([])
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>([])
  const [analytics, setAnalytics] = useState<PatentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('cybersecurity')
  const [selectedView, setSelectedView] = useState<'patents' | 'companies' | 'analytics'>('patents')
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    fetchPatentIntelligence()
  }, [searchQuery])

  const fetchPatentIntelligence = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        query: searchQuery,
        limit: '50'
      })

      const response = await fetch(`/api/patent-intelligence?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setPatents(data.data.patents)
        setCompanyProfiles(data.data.companyProfiles)
        setAnalytics(data.data.analytics)
        setLastUpdate(new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error('Error fetching patent intelligence:', error)
    } finally {
      setLoading(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'abandoned':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600'
    if (score >= 0.8) return 'text-blue-600'
    if (score >= 0.7) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600'
      case 'decreasing': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-red-100 text-red-800'
    }
  }

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              Patent Intelligence Platform
            </h1>
            <p className="text-gray-600 mt-2">
              High-quality structured patent data • Growing 11% annually • Last updated: {lastUpdate}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchPatentIntelligence}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patents, technologies, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedView('patents')}
                  className={`px-4 py-2 text-sm rounded ${selectedView === 'patents' ? 'bg-white shadow-sm font-medium' : ''}`}
                >
                  Patents
                </button>
                <button
                  onClick={() => setSelectedView('companies')}
                  className={`px-4 py-2 text-sm rounded ${selectedView === 'companies' ? 'bg-white shadow-sm font-medium' : ''}`}
                >
                  Companies
                </button>
                <button
                  onClick={() => setSelectedView('analytics')}
                  className={`px-4 py-2 text-sm rounded ${selectedView === 'analytics' ? 'bg-white shadow-sm font-medium' : ''}`}
                >
                  Analytics
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patents</p>
                    <p className="text-2xl font-bold text-blue-600">{analytics.totalPatents.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{analytics.patentGrowthRate.toFixed(1)}% annually</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Innovation Score</p>
                    <p className="text-2xl font-bold text-green-600">{(analytics.averageInnovationScore * 100).toFixed(0)}%</p>
                    <p className="text-xs text-gray-500">Quality metric</p>
                  </div>
                  <Lightbulb className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Market Signals</p>
                    <p className="text-2xl font-bold text-purple-600">{analytics.marketSignals.length}</p>
                    <p className="text-xs text-gray-500">Active trends</p>
                  </div>
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hotspots</p>
                    <p className="text-2xl font-bold text-orange-600">{analytics.innovationHotspots.length}</p>
                    <p className="text-xs text-gray-500">Innovation areas</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {selectedView === 'patents' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  High-Impact Cybersecurity Patents ({patents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patents.map((patent) => (
                    <div key={patent.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{patent.title}</h3>
                            <Badge className={getStatusColor(patent.status)} variant="outline">
                              {patent.status.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-500">{patent.publicationNumber}</span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{patent.abstract}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {patent.assignee}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {patent.inventors.slice(0, 2).join(', ')}
                              {patent.inventors.length > 2 && ` +${patent.inventors.length - 2} more`}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Filed: {formatDate(patent.filingDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {patent.citationCount} citations
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {patent.technologyTrends.slice(0, 3).map((trend, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {trend}
                                </Badge>
                              ))}
                              {patent.classifications.cpc.slice(0, 2).map((cpc, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {cpc}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <span className={`text-sm font-medium ${getScoreColor(patent.cybersecurityRelevance)}`}>
                                Relevance: {(patent.cybersecurityRelevance * 100).toFixed(0)}%
                              </span>
                              <span className={`text-sm font-medium ${getScoreColor(patent.innovationScore)}`}>
                                Innovation: {(patent.innovationScore * 100).toFixed(0)}%
                              </span>
                              <span className={`text-sm font-medium ${getScoreColor(patent.commercialPotential)}`}>
                                Commercial: {(patent.commercialPotential * 100).toFixed(0)}%
                              </span>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {patent.marketSignals.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="text-xs font-medium text-gray-700 mb-2">Market Signals:</div>
                              <div className="flex flex-wrap gap-2">
                                {patent.marketSignals.slice(0, 3).map((signal, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    <Zap className="h-3 w-3 mr-1" />
                                    {signal}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedView === 'companies' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  Company Patent Profiles ({companyProfiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {companyProfiles.map((profile, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{profile.companyName}</h3>
                        <div className="flex items-center gap-3">
                          <Badge className={getQualityColor(profile.patentQuality)}>
                            {profile.patentQuality} quality
                          </Badge>
                          <span className={`text-sm font-medium ${getTrendColor(profile.innovationTrend)}`}>
                            {profile.innovationTrend}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">{profile.totalPatents}</div>
                          <div className="text-xs text-gray-600">Total Patents</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">{profile.patentGrowthRate.toFixed(1)}%</div>
                          <div className="text-xs text-gray-600">Growth Rate</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-xl font-bold text-purple-600">{profile.averageCitationCount.toFixed(1)}</div>
                          <div className="text-xs text-gray-600">Avg Citations</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-xl font-bold text-orange-600">{(profile.competitivePosition * 100).toFixed(0)}%</div>
                          <div className="text-xs text-gray-600">Competitive Position</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Top Technologies</h4>
                          <div className="space-y-2">
                            {profile.topTechnologies.map((tech, idx) => (
                              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-sm">{tech.technology}</span>
                                <div className="text-right">
                                  <div className="text-sm font-medium">{tech.patentCount}</div>
                                  <div className="text-xs text-gray-500">{tech.percentage.toFixed(1)}%</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Market Signals</h4>
                          <div className="space-y-2">
                            {profile.marketSignals.map((signal, idx) => (
                              <div key={idx} className="p-2 border rounded">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{signal.signal}</span>
                                  <Badge variant={signal.strength === 'strong' ? 'default' : 'secondary'} className="text-xs">
                                    {signal.strength}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{formatDate(signal.date)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedView === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Technology Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.technologyDistribution.map((tech, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{tech.technology}</div>
                          <div className="text-sm text-gray-600">{tech.count} patents ({tech.percentage.toFixed(1)}%)</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${tech.growthRate > 15 ? 'text-green-600' : tech.growthRate > 5 ? 'text-blue-600' : 'text-gray-600'}`}>
                            +{tech.growthRate.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">growth</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-600" />
                    Innovation Hotspots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.innovationHotspots.map((hotspot, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{hotspot.area}</h4>
                          <Badge variant="outline" className="text-xs">
                            {hotspot.patentCount} patents
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Growth Rate:</span>
                            <span className="ml-2 font-medium text-green-600">+{hotspot.growthRate.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Commercial Potential:</span>
                            <span className="ml-2 font-medium text-blue-600">{(hotspot.commercialPotential * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Market Signals & Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.marketSignals.map((signal, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{signal.signal}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={signal.impact === 'high' ? 'default' : 'secondary'} className="text-xs">
                            {signal.impact} impact
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {signal.trend}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Market Size:</span>
                          <span className="ml-2 font-medium">{formatCurrency(signal.marketSize)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Key Players:</span>
                          <span className="ml-2">{signal.companies.slice(0, 2).join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}