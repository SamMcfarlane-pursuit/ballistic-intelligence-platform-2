"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Globe,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Database,
  FileText,
  Globe2,
  Search,
  Filter,
  RefreshCw,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Award,
  Star,
  Eye,
  ThumbsUp,
  MessageSquare
} from 'lucide-react'

interface DataSource {
  id: string
  name: string
  type: 'techcrunch' | 'crunchbase' | 'sec_filings' | 'other'
  status: 'active' | 'inactive' | 'error'
  lastUpdated: string
  totalRecords: number
  confidence: number
  coverage: string
  description: string
  apiEndpoint?: string
  refreshRate: string
}

interface FundingRound {
  id: string
  companyName: string
  amount: number
  currency: string
  roundType: string
  announcedDate: string
  leadInvestor?: string
  investors: string[]
  sector: string
  subSector: string
  stage: string
  valuation?: number
  dataSource: string
  confidence: number
  location?: string
  description?: string
}

interface SectorTrend {
  sector: string
  totalFunding: number
  dealCount: number
  averageDealSize: number
  growthRate: number
  topCompanies: string[]
  keyInvestors: string[]
  trend: 'up' | 'down' | 'stable'
}

interface GeographicDistribution {
  region: string
  country: string
  totalFunding: number
  dealCount: number
  averageDealSize: number
  topSectors: string[]
  growthRate: number
}

interface LandscapeMetrics {
  totalFunding: number
  totalDeals: number
  averageDealSize: number
  activeInvestors: number
  topSectors: string[]
  growthRate: number
  dataSources: number
  lastUpdate: string
}

export default function CybersecurityFundingLandscape() {
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([])
  const [sectorTrends, setSectorTrends] = useState<SectorTrend[]>([])
  const [geographicDistribution, setGeographicDistribution] = useState<GeographicDistribution[]>([])
  const [metrics, setMetrics] = useState<LandscapeMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('6m')
  const [selectedSector, setSelectedSector] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [realTimeSync, setRealTimeSync] = useState(false)

  useEffect(() => {
    const fetchFundingLandscapeData = async () => {
      try {
        setLoading(true)
        setRealTimeSync(true)
        
        // Simulate API call for funding landscape data
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock data sources
        const mockDataSources: DataSource[] = [
          {
            id: '1',
            name: 'TechCrunch Cybersecurity Coverage',
            type: 'techcrunch',
            status: 'active',
            lastUpdated: '5 minutes ago',
            totalRecords: 2847,
            confidence: 92,
            coverage: 'Global cybersecurity startup funding news',
            description: 'Real-time coverage of cybersecurity funding rounds, M&A activity, and market trends',
            refreshRate: 'Every 15 minutes'
          },
          {
            id: '2',
            name: 'Crunchbase API Integration',
            type: 'crunchbase',
            status: 'active',
            lastUpdated: '2 minutes ago',
            totalRecords: 15642,
            confidence: 96,
            coverage: 'Comprehensive company and funding data',
            description: 'Structured data on cybersecurity companies, investors, funding rounds, and acquisitions',
            refreshRate: 'Every 30 minutes'
          },
          {
            id: '3',
            name: 'SEC EDGAR Filings',
            type: 'sec_filings',
            status: 'active',
            lastUpdated: '1 hour ago',
            totalRecords: 892,
            confidence: 98,
            coverage: 'Regulatory filings and disclosures',
            description: 'Form D filings, S-1 registrations, and other regulatory disclosures for cybersecurity companies',
            refreshRate: 'Every 6 hours'
          },
          {
            id: '4',
            name: 'PitchBook Database',
            type: 'other',
            status: 'active',
            lastUpdated: '30 minutes ago',
            totalRecords: 12450,
            confidence: 94,
            coverage: 'Private market intelligence',
            description: 'Detailed private equity and venture capital data with deep cybersecurity sector coverage',
            refreshRate: 'Every hour'
          },
          {
            id: '5',
            name: 'CB Insights',
            type: 'other',
            status: 'active',
            lastUpdated: '15 minutes ago',
            totalRecords: 8750,
            confidence: 91,
            coverage: 'Market intelligence and trends',
            description: 'AI-powered market intelligence with cybersecurity sector focus and trend analysis',
            refreshRate: 'Every 45 minutes'
          }
        ]

        // Mock funding rounds
        const mockFundingRounds: FundingRound[] = [
          {
            id: '1',
            companyName: 'SecureAI',
            amount: 25000000,
            currency: 'USD',
            roundType: 'Series B',
            announcedDate: '2024-01-15',
            leadInvestor: 'Andreessen Horowitz',
            investors: ['Andreessen Horowitz', 'Sequoia Capital', 'Kleiner Perkins'],
            sector: 'AI Security',
            subSector: 'AI-Powered Threat Detection',
            stage: 'Growth',
            valuation: 250000000,
            dataSource: 'crunchbase',
            confidence: 96,
            location: 'San Francisco, CA',
            description: 'AI-powered cybersecurity platform using machine learning for threat detection'
          },
          {
            id: '2',
            companyName: 'CloudGuard',
            amount: 15000000,
            currency: 'USD',
            roundType: 'Series A',
            announcedDate: '2024-01-10',
            leadInvestor: 'Accel',
            investors: ['Accel', 'Index Ventures', 'Bessemer Venture Partners'],
            sector: 'Cloud Security',
            subSector: 'Cloud Native Security',
            stage: 'Early Growth',
            valuation: 120000000,
            dataSource: 'techcrunch',
            confidence: 92,
            location: 'Austin, TX',
            description: 'Cloud-native security platform for container and microservices protection'
          },
          {
            id: '3',
            companyName: 'ZeroTrust Networks',
            amount: 45000000,
            currency: 'USD',
            roundType: 'Series C',
            announcedDate: '2024-01-08',
            leadInvestor: 'Lightspeed Venture Partners',
            investors: ['Lightspeed Venture Partners', 'GV', 'Khosla Ventures'],
            sector: 'Zero Trust',
            subSector: 'Identity and Access Management',
            stage: 'Late Stage',
            valuation: 450000000,
            dataSource: 'sec_filings',
            confidence: 98,
            location: 'Boston, MA',
            description: 'Enterprise zero trust architecture platform with advanced identity management'
          },
          {
            id: '4',
            companyName: 'QuantumShield',
            amount: 8000000,
            currency: 'USD',
            roundType: 'Seed',
            announcedDate: '2024-01-05',
            leadInvestor: 'Y Combinator',
            investors: ['Y Combinator', 'Founders Fund', 'Data Collective'],
            sector: 'Quantum Security',
            subSector: 'Post-Quantum Cryptography',
            stage: 'Early Stage',
            valuation: 40000000,
            dataSource: 'techcrunch',
            confidence: 88,
            location: 'Palo Alto, CA',
            description: 'Quantum-resistant encryption solutions for future-proof cybersecurity'
          },
          {
            id: '5',
            companyName: 'IoTSecure',
            amount: 22000000,
            currency: 'USD',
            roundType: 'Series A',
            announcedDate: '2024-01-03',
            leadInvestor: 'Bessemer Venture Partners',
            investors: ['Bessemer Venture Partners', 'Cisco Investments', 'Intel Capital'],
            sector: 'IoT Security',
            subSector: 'IoT Device Protection',
            stage: 'Early Growth',
            valuation: 150000000,
            dataSource: 'crunchbase',
            confidence: 94,
            location: 'Tel Aviv, Israel',
            description: 'Comprehensive security platform for IoT devices and edge computing'
          }
        ]

        // Mock sector trends
        const mockSectorTrends: SectorTrend[] = [
          {
            sector: 'AI Security',
            totalFunding: 2850000000,
            dealCount: 127,
            averageDealSize: 22400000,
            growthRate: 45,
            topCompanies: ['SecureAI', 'DarkTrace', 'Cylance', 'SparkCognition'],
            keyInvestors: ['Andreessen Horowitz', 'Sequoia Capital', 'GV', 'Khosla Ventures'],
            trend: 'up'
          },
          {
            sector: 'Cloud Security',
            totalFunding: 3200000000,
            dealCount: 156,
            averageDealSize: 20500000,
            growthRate: 38,
            topCompanies: ['CloudGuard', 'Wiz', 'Orca Security', 'Lacework'],
            keyInvestors: ['Accel', 'Index Ventures', 'Greenoaks Capital', 'Sequoia Capital'],
            trend: 'up'
          },
          {
            sector: 'Zero Trust',
            totalFunding: 1800000000,
            dealCount: 89,
            averageDealSize: 20200000,
            growthRate: 52,
            topCompanies: ['ZeroTrust Networks', 'Satori', 'StrongDM', 'Cerberus Sentinel'],
            keyInvestors: ['Lightspeed Venture Partners', 'GV', 'Khosla Ventures', 'Accel'],
            trend: 'up'
          },
          {
            sector: 'IoT Security',
            totalFunding: 950000000,
            dealCount: 73,
            averageDealSize: 13000000,
            growthRate: 28,
            topCompanies: ['IoTSecure', 'Armis', 'Forescout', 'Nozomi Networks'],
            keyInvestors: ['Bessemer Venture Partners', 'Cisco Investments', 'Intel Capital', 'Samsung Ventures'],
            trend: 'up'
          },
          {
            sector: 'Quantum Security',
            totalFunding: 420000000,
            dealCount: 34,
            averageDealSize: 12300000,
            growthRate: 67,
            topCompanies: ['QuantumShield', 'ISARA Corporation', 'Quantum Xchange', 'CryptoNext'],
            keyInvestors: ['Y Combinator', 'Founders Fund', 'Data Collective', 'Samsung Ventures'],
            trend: 'up'
          }
        ]

        // Mock geographic distribution
        const mockGeographicDistribution: GeographicDistribution[] = [
          {
            region: 'North America',
            country: 'United States',
            totalFunding: 6800000000,
            dealCount: 342,
            averageDealSize: 19900000,
            topSectors: ['AI Security', 'Cloud Security', 'Zero Trust'],
            growthRate: 42
          },
          {
            region: 'Europe',
            country: 'United Kingdom',
            totalFunding: 1200000000,
            dealCount: 67,
            averageDealSize: 17900000,
            topSectors: ['Cloud Security', 'Zero Trust', 'AI Security'],
            growthRate: 35
          },
          {
            region: 'Europe',
            country: 'Israel',
            totalFunding: 950000000,
            dealCount: 58,
            averageDealSize: 16400000,
            topSectors: ['IoT Security', 'Cloud Security', 'AI Security'],
            growthRate: 48
          },
          {
            region: 'Asia',
            country: 'Singapore',
            totalFunding: 680000000,
            dealCount: 42,
            averageDealSize: 16200000,
            topSectors: ['Cloud Security', 'Zero Trust', 'Quantum Security'],
            growthRate: 55
          },
          {
            region: 'North America',
            country: 'Canada',
            totalFunding: 420000000,
            dealCount: 28,
            averageDealSize: 15000000,
            topSectors: ['AI Security', 'IoT Security', 'Cloud Security'],
            growthRate: 38
          }
        ]

        // Mock landscape metrics
        const mockMetrics: LandscapeMetrics = {
          totalFunding: 9220000000,
          totalDeals: 479,
          averageDealSize: 19200000,
          activeInvestors: 287,
          topSectors: ['Cloud Security', 'AI Security', 'Zero Trust', 'IoT Security', 'Quantum Security'],
          growthRate: 43,
          dataSources: 5,
          lastUpdate: '2 minutes ago'
        }

        setDataSources(mockDataSources)
        setFundingRounds(mockFundingRounds)
        setSectorTrends(mockSectorTrends)
        setGeographicDistribution(mockGeographicDistribution)
        setMetrics(mockMetrics)
      } catch (error) {
        console.error('Error fetching funding landscape data:', error)
      } finally {
        setLoading(false)
        setRealTimeSync(false)
      }
    }

    fetchFundingLandscapeData()

    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeSync(true)
      setTimeout(() => setRealTimeSync(false), 2000)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [selectedTimeframe])

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

  const getDataSourceIcon = (type: string) => {
    switch (type) {
      case 'techcrunch': return FileText
      case 'crunchbase': return Database
      case 'sec_filings': return FileText
      default: return Globe2
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200'
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : trend === 'down' ? Activity : Target
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      case 'stable': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Cybersecurity Funding Landscape
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Mapping funding landscape...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Landscape Overview */}
      {metrics && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Cybersecurity Funding Landscape
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive mapping of global cybersecurity investment activity
                </p>
              </div>
              <div className="flex items-center gap-2">
                {realTimeSync ? (
                  <Badge variant="outline" className="text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                    Syncing
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                )}
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <p className="text-lg font-bold text-blue-600 mt-2">{formatCurrency(metrics.totalFunding)}</p>
                <p className="text-xs text-muted-foreground">Total Funding</p>
              </div>

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600 mt-2">{formatNumber(metrics.totalDeals)}</p>
                <p className="text-xs text-muted-foreground">Total Deals</p>
              </div>

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <p className="text-lg font-bold text-purple-600 mt-2">{metrics.growthRate}%</p>
                <p className="text-xs text-muted-foreground">Growth Rate</p>
              </div>

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <Database className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <p className="text-lg font-bold text-orange-600 mt-2">{metrics.dataSources}</p>
                <p className="text-xs text-muted-foreground">Data Sources</p>
              </div>
            </div>

            {/* Top Sectors */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Top Sectors by Funding</h4>
              <div className="flex flex-wrap gap-2">
                {metrics.topSectors.map((sector, index) => (
                  <Badge key={sector} variant="outline" className="text-xs">
                    {index + 1}. {sector}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Sources */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Database className="h-4 w-4 text-orange-600" />
            Data Sources Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map(source => {
              const SourceIcon = getDataSourceIcon(source.type)
              return (
                <div key={source.id} className="p-4 bg-background border border-border/60 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <SourceIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{source.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{source.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(source.status)}`}>
                      {source.status}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">{source.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Records:</span>
                      <span className="font-medium">{formatNumber(source.totalRecords)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-medium">{source.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated:</span>
                      <span className="font-medium">{source.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Refresh:</span>
                      <span className="font-medium">{source.refreshRate}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Sync
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sector Trends */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Sector Trends Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectorTrends.map((trend, index) => {
              const TrendIcon = getTrendIcon(trend.trend)
              return (
                <div key={trend.sector} className="p-4 bg-background border border-border/60 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-sm">{trend.sector}</h4>
                        <Badge variant="outline" className={`text-xs ${getTrendColor(trend.trend)}`}>
                          <TrendIcon className="h-3 w-3 mr-1" />
                          {trend.growthRate > 0 ? '+' : ''}{trend.growthRate}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {trend.dealCount} deals
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded">
                          <div className="text-sm font-bold text-blue-600">{formatCurrency(trend.totalFunding)}</div>
                          <div className="text-xs text-muted-foreground">Total Funding</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
                          <div className="text-sm font-bold text-green-600">{formatCurrency(trend.averageDealSize)}</div>
                          <div className="text-xs text-muted-foreground">Avg Deal Size</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 border border-purple-200 rounded">
                          <div className="text-sm font-bold text-purple-600">{trend.growthRate}%</div>
                          <div className="text-xs text-muted-foreground">Growth Rate</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Top Companies</p>
                          <div className="flex flex-wrap gap-1">
                            {trend.topCompanies.slice(0, 3).map(company => (
                              <Badge key={company} variant="secondary" className="text-xs">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Key Investors</p>
                          <div className="flex flex-wrap gap-1">
                            {trend.keyInvestors.slice(0, 3).map(investor => (
                              <Badge key={investor} variant="outline" className="text-xs">
                                {investor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Funding Rounds */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <DollarSign className="h-4 w-4 text-green-600" />
              Recent Funding Rounds
            </CardTitle>
            <div className="flex gap-2">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="text-xs h-8 px-2 border border-border/60 rounded bg-background"
              >
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
                <option value="all">All Time</option>
              </select>
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fundingRounds.map(round => (
              <div key={round.id} className="p-4 bg-background border border-border/60 rounded-lg hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-sm">{round.companyName}</h4>
                      <Badge variant="outline" className="text-xs">
                        {round.roundType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {round.sector}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {round.confidence}% confidence
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{round.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Amount:</span>
                        <div className="text-sm font-medium">{formatCurrency(round.amount)}</div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Lead Investor:</span>
                        <div className="text-sm font-medium">{round.leadInvestor || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Stage:</span>
                        <div className="text-sm font-medium">{round.stage}</div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Location:</span>
                        <div className="text-sm font-medium">{round.location || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Announced: {new Date(round.announcedDate).toLocaleDateString()}</span>
                      <span>Source: {round.dataSource}</span>
                      {round.valuation && (
                        <span>Valuation: {formatCurrency(round.valuation)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Source
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <MapPin className="h-4 w-4 text-purple-600" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {geographicDistribution.map((geo, index) => (
              <div key={`${geo.region}-${geo.country}`} className="p-4 bg-background border border-border/60 rounded-lg hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Globe className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{geo.country}</h4>
                    <p className="text-xs text-muted-foreground">{geo.region}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Funding:</span>
                    <span className="font-medium">{formatCurrency(geo.totalFunding)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deal Count:</span>
                    <span className="font-medium">{geo.dealCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Deal Size:</span>
                    <span className="font-medium">{formatCurrency(geo.averageDealSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth Rate:</span>
                    <span className="font-medium text-green-600">+{geo.growthRate}%</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Top Sectors:</p>
                  <div className="flex flex-wrap gap-1">
                    {geo.topSectors.slice(0, 2).map(sector => (
                      <Badge key={sector} variant="secondary" className="text-xs">
                        {sector}
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
  )
}