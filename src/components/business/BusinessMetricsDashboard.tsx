'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecureActionButton } from '@/components/ui/secure-button'
import { 
  TrendingUp,
  Target,
  Download,
  BarChart3,
  Activity,
  Briefcase,
  FileText
} from 'lucide-react'

interface BusinessMetrics {
  totalMarketValue: number
  quarterlyGrowth: number
  fundingVelocity: number
  marketPenetration: number
  competitivePosition: number
  roi: number
  portfolioPerformance: {
    totalValue: number
    unrealizedGains: number
    realizedGains: number
    irr: number
    multiple: number
  }
  marketTrends: {
    hotSectors: Array<{ name: string; growth: number; funding: number }>
    emergingOpportunities: Array<{ sector: string; potential: number; timeline: string }>
    riskFactors: Array<{ factor: string; impact: string; probability: number }>
  }
  operationalMetrics: {
    dealFlow: number
    conversionRate: number
    averageDealSize: number
    timeToClose: number
    pipelineValue: number
  }
}

export default function BusinessMetricsDashboard() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('quarterly')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadBusinessMetrics()
    }
  }, [mounted, selectedTimeframe])

  const loadBusinessMetrics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/business-metrics?timeframe=${selectedTimeframe}`)
      const data = await response.json()
      
      if (data.success) {
        setMetrics(data.data)
      } else {
        setMetrics(getMockBusinessMetrics())
      }
    } catch (error) {
      console.error('Failed to load business metrics:', error)
      setMetrics(getMockBusinessMetrics())
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`

  const downloadMetrics = async (format: 'excel' | 'pdf' | 'csv') => {
    try {
      const response = await fetch('/api/business-metrics/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, timeframe: selectedTimeframe })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `business-metrics-${selectedTimeframe}.${format}`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('❌ Download failed')
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 animate-pulse text-blue-500" />
          <p className="text-lg font-medium">Loading Business Metrics...</p>
        </div>
      </div>
    )
  }

  if (!metrics) return <div className="text-center py-12">No metrics available</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Business Metrics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Key performance indicators and market intelligence for business decisions
          </p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <SecureActionButton onClick={() => downloadMetrics('excel')} debounceMs={1000}>
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </SecureActionButton>
          <SecureActionButton onClick={() => downloadMetrics('pdf')} debounceMs={1000}>
            <FileText className="h-4 w-4 mr-2" />
            Download PDF
          </SecureActionButton>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Portfolio Value</p>
                <p className="text-3xl font-bold text-green-900">{formatCurrency(metrics.portfolioPerformance.totalValue)}</p>
                <p className="text-sm text-green-600 mt-1">+{formatPercentage(metrics.quarterlyGrowth)} this quarter</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">IRR</p>
                <p className="text-3xl font-bold text-blue-900">{formatPercentage(metrics.portfolioPerformance.irr)}</p>
                <p className="text-sm text-blue-600 mt-1">Industry: 24%</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Deal Flow</p>
                <p className="text-3xl font-bold text-purple-900">{metrics.operationalMetrics.dealFlow}</p>
                <p className="text-sm text-purple-600 mt-1">{formatPercentage(metrics.operationalMetrics.conversionRate)} conversion</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Pipeline Value</p>
                <p className="text-3xl font-bold text-orange-900">{formatCurrency(metrics.operationalMetrics.pipelineValue)}</p>
                <p className="text-sm text-orange-600 mt-1">{metrics.operationalMetrics.timeToClose} days avg close</p>
              </div>
              <Briefcase className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>    
  <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Portfolio Performance</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="downloads">Export & Reports</TabsTrigger>
        </TabsList>

        {/* Portfolio Performance */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance Breakdown</CardTitle>
                <CardDescription>Detailed financial performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Total Portfolio Value</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(metrics.portfolioPerformance.totalValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Unrealized Gains</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(metrics.portfolioPerformance.unrealizedGains)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Realized Gains</span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatCurrency(metrics.portfolioPerformance.realizedGains)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">Portfolio Multiple</span>
                    <span className="text-lg font-bold text-orange-600">
                      {metrics.portfolioPerformance.multiple.toFixed(1)}x
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance vs Benchmarks</CardTitle>
                <CardDescription>How we compare to industry standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">IRR vs Industry (24%)</span>
                      <span className="text-sm font-bold">{formatPercentage(metrics.portfolioPerformance.irr)}</span>
                    </div>
                    <Progress value={(metrics.portfolioPerformance.irr / 40) * 100} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Multiple vs Industry (2.5x)</span>
                      <span className="text-sm font-bold">{metrics.portfolioPerformance.multiple.toFixed(1)}x</span>
                    </div>
                    <Progress value={(metrics.portfolioPerformance.multiple / 5) * 100} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Market Penetration</span>
                      <span className="text-sm font-bold">{formatPercentage(metrics.marketPenetration)}</span>
                    </div>
                    <Progress value={metrics.marketPenetration} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Market Analysis */}
        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hot Sectors</CardTitle>
                <CardDescription>Fastest growing cybersecurity sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.marketTrends.hotSectors.map((sector, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{sector.name}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-600">+{formatPercentage(sector.growth)}</div>
                          <div className="text-xs text-muted-foreground">{formatCurrency(sector.funding)}</div>
                        </div>
                      </div>
                      <Progress value={sector.growth} className="w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Market risk factors and probabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.marketTrends.riskFactors.map((risk, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{risk.factor}</span>
                        <Badge variant={risk.probability > 70 ? 'destructive' : risk.probability > 40 ? 'default' : 'secondary'}>
                          {formatPercentage(risk.probability)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{risk.impact}</p>
                      <Progress value={risk.probability} className="w-full mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operations */}
        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Operational Efficiency</CardTitle>
              <CardDescription>Deal flow and operational metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{metrics.operationalMetrics.dealFlow}</div>
                  <div className="text-sm text-blue-600">Deals This Quarter</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{formatPercentage(metrics.operationalMetrics.conversionRate)}</div>
                  <div className="text-sm text-green-600">Conversion Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{formatCurrency(metrics.operationalMetrics.averageDealSize)}</div>
                  <div className="text-sm text-purple-600">Average Deal Size</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Downloads & Reports */}
        <TabsContent value="downloads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export & Download Options</CardTitle>
              <CardDescription>Download business metrics in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SecureActionButton 
                  onClick={() => downloadMetrics('excel')} 
                  className="flex-col h-24"
                  debounceMs={1000}
                >
                  <FileText className="h-8 w-8 mb-2" />
                  <span>Excel Spreadsheet</span>
                  <span className="text-xs text-muted-foreground">Detailed metrics & charts</span>
                </SecureActionButton>
                <SecureActionButton 
                  onClick={() => downloadMetrics('pdf')} 
                  className="flex-col h-24"
                  debounceMs={1000}
                >
                  <FileText className="h-8 w-8 mb-2" />
                  <span>PDF Report</span>
                  <span className="text-xs text-muted-foreground">Executive summary</span>
                </SecureActionButton>
                <SecureActionButton 
                  onClick={() => downloadMetrics('csv')} 
                  className="flex-col h-24"
                  debounceMs={1000}
                >
                  <Download className="h-8 w-8 mb-2" />
                  <span>CSV Data</span>
                  <span className="text-xs text-muted-foreground">Raw data export</span>
                </SecureActionButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock data function
function getMockBusinessMetrics(): BusinessMetrics {
  return {
    totalMarketValue: 2400000000,
    quarterlyGrowth: 18.5,
    fundingVelocity: 24.2,
    marketPenetration: 12.8,
    competitivePosition: 78.5,
    roi: 247.3,
    portfolioPerformance: {
      totalValue: 850000000,
      unrealizedGains: 620000000,
      realizedGains: 180000000,
      irr: 32.4,
      multiple: 3.2
    },
    marketTrends: {
      hotSectors: [
        { name: 'AI Security', growth: 67.2, funding: 1200000000 },
        { name: 'Cloud Security', growth: 34.8, funding: 1850000000 },
        { name: 'Zero Trust', growth: 42.1, funding: 890000000 },
        { name: 'Application Security', growth: 31.5, funding: 780000000 }
      ],
      emergingOpportunities: [
        { sector: 'Quantum Security', potential: 95, timeline: '2-3 years' },
        { sector: 'IoT Security', potential: 88, timeline: '1-2 years' }
      ],
      riskFactors: [
        { factor: 'Market Saturation', impact: 'Reduced deal flow and higher valuations', probability: 65 },
        { factor: 'Economic Downturn', impact: 'Decreased funding availability', probability: 35 },
        { factor: 'Regulatory Changes', impact: 'Compliance costs and market shifts', probability: 45 }
      ]
    },
    operationalMetrics: {
      dealFlow: 47,
      conversionRate: 12.8,
      averageDealSize: 18500000,
      timeToClose: 89,
      pipelineValue: 320000000
    }
  }
}