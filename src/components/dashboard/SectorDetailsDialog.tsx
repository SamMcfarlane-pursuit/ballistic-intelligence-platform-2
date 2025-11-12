'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Building2, 
  DollarSign, 
  Globe, 
  Users,
  Target,
  BarChart3,
  AlertCircle,
  Database,
  Loader2
} from 'lucide-react'

interface SectorDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sector: {
    id: string
    name: string
    rank: number
    companies: number
    totalFunding: number
    momentumScore: number
    momentumGrowth: number
    marketGrowth?: number
    investmentTrends?: string[]
    keyPlayers?: string[]
    emergingTechnologies?: string[]
  }
  dataSource: 'brightdata' | 'crunchbase' | 'combined'
}

export default function SectorDetailsDialog({ 
  open, 
  onOpenChange, 
  sector,
  dataSource 
}: SectorDetailsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [enrichedData, setEnrichedData] = useState<any>(null)

  useEffect(() => {
    if (open && sector) {
      fetchEnrichedData()
    }
  }, [open, sector, dataSource])

  const fetchEnrichedData = async () => {
    setLoading(true)
    try {
      // Fetch from Crunchbase API
      const response = await fetch(`/api/crunchbase?action=analysis&timeframe=6m`)
      const data = await response.json()
      
      if (data.success) {
        setEnrichedData(data.data)
      }
    } catch (error) {
      console.error('Error fetching enriched data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(2)}B`
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    }
    return `$${amount}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#0066FF]">
              {sector.name}
            </DialogTitle>
            <Badge className="bg-[#0066FF] text-white">
              Rank #{sector.rank}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <Database className="h-3 w-3 mr-1" />
              {dataSource === 'combined' ? 'BrightData + Crunchbase' : 
               dataSource === 'brightdata' ? 'BrightData' : 'Crunchbase'}
            </Badge>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#0066FF] to-[#1A3766] p-4 rounded-lg text-white">
                  <div className="flex items-center mb-2">
                    <Building2 className="h-5 w-5 mr-2" />
                    <span className="text-sm opacity-90">Companies</span>
                  </div>
                  <p className="text-2xl font-bold">{sector.companies}</p>
                </div>

                <div className="bg-gradient-to-br from-[#0066FF] to-[#1A3766] p-4 rounded-lg text-white">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span className="text-sm opacity-90">Total Funding</span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(sector.totalFunding)}</p>
                </div>

                <div className="bg-gradient-to-br from-[#0066FF] to-[#1A3766] p-4 rounded-lg text-white">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    <span className="text-sm opacity-90">Momentum</span>
                  </div>
                  <p className="text-2xl font-bold">{sector.momentumScore}</p>
                </div>

                <div className="bg-gradient-to-br from-[#0066FF] to-[#1A3766] p-4 rounded-lg text-white">
                  <div className="flex items-center mb-2">
                    <Globe className="h-5 w-5 mr-2" />
                    <span className="text-sm opacity-90">Growth</span>
                  </div>
                  <p className="text-2xl font-bold">+{sector.momentumGrowth}%</p>
                </div>
              </div>

              {/* Market Analysis */}
              {enrichedData && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-[#0066FF]" />
                    Market Analysis
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Average Deal Size</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(enrichedData.average_deal_size)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Deals</p>
                      <p className="text-xl font-bold text-gray-900">
                        {enrichedData.total_deals}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Investment Trends */}
              {sector.investmentTrends && sector.investmentTrends.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-[#0066FF]" />
                    Investment Trends
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sector.investmentTrends.map((trend, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Emerging Technologies */}
              {sector.emergingTechnologies && sector.emergingTechnologies.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-[#0066FF]" />
                    Emerging Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sector.emergingTechnologies.map((tech, index) => (
                      <Badge key={index} className="bg-[#0066FF] text-white">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="companies" className="space-y-4">
              {sector.keyPlayers && sector.keyPlayers.length > 0 ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-[#0066FF]" />
                    Key Players & Leadership
                  </h3>
                  <div className="space-y-3">
                    {sector.keyPlayers.map((player, index) => {
                      // Parse company name and leadership from format: "Company (CEO: Name, CTO: Name)"
                      const match = player.match(/^(.+?)\s*\((.+)\)$/)
                      const companyName = match ? match[1].trim() : player
                      const leadership = match ? match[2] : null
                      
                      return (
                        <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-[#0066FF] transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#1A3766] rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg mb-2">{companyName}</h4>
                                {leadership && (
                                  <div className="space-y-1">
                                    {leadership.split(',').map((role, roleIndex) => {
                                      const [title, name] = role.split(':').map(s => s.trim())
                                      return (
                                        <div key={roleIndex} className="flex items-center text-sm">
                                          <Badge variant="outline" className="mr-2 bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/30">
                                            {title}
                                          </Badge>
                                          <span className="text-gray-700 font-medium">{name}</span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="ml-4">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No company data available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="funding" className="space-y-4">
              {enrichedData && enrichedData.top_investors ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-[#0066FF]" />
                    Top Investors
                  </h3>
                  <div className="space-y-3">
                    {enrichedData.top_investors.map((investor: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-bold text-gray-900">{investor.investor}</p>
                          <p className="text-sm text-gray-600">{investor.investments} investments</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#0066FF]">
                            {formatCurrency(investor.total_funding)}
                          </p>
                          <p className="text-xs text-gray-500">Total Funding</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No funding data available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              {enrichedData && enrichedData.time_trends ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-[#0066FF]" />
                    Funding Trends Over Time
                  </h3>
                  <div className="space-y-3">
                    {enrichedData.time_trends.map((trend: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-900">{trend.period}</span>
                          <Badge variant="secondary">{trend.deals} deals</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Funding</span>
                          <span className="font-bold text-[#0066FF]">
                            {formatCurrency(trend.funding)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">Avg Deal Size</span>
                          <span className="text-sm font-medium text-gray-700">
                            {formatCurrency(trend.average_deal_size)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No trend data available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
