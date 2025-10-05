"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  Scatter,
  ScatterChart,
  ReferenceLine,
  LabelList
} from 'recharts'
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Calendar,
  DollarSign,
  Building2,
  AlertTriangle,
  Zap,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info
} from 'lucide-react'

interface DataPoint {
  date: string
  value: number
  label?: string
  category?: string
}

interface ChartData {
  month: string
  amount: number
  deals: number
  averageSize: number
  growth: number
}

interface StageData {
  name: string
  value: number
  color: string
  count: number
  growth: number
}

interface EnhancedDataVisualizationProps {
  fundingOverTime: ChartData[]
  fundingByStage: StageData[]
  vulnerabilities?: Array<{
    id: string
    title: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    affectedCompanies: number
    discoveredDate: string
  }>
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

export default function EnhancedDataVisualization({ 
  fundingOverTime, 
  fundingByStage, 
  vulnerabilities = [] 
}: EnhancedDataVisualizationProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'6m' | '1y' | 'all'>('1y')
  const [selectedChartType, setSelectedChartType] = useState<'line' | 'bar' | 'area' | 'composed'>('line')
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hoveredData, setHoveredData] = useState<any>(null)

  // Filter data based on selected timeframe
  const filteredData = useMemo(() => {
    if (selectedTimeframe === 'all') return fundingOverTime
    const months = selectedTimeframe === '6m' ? 6 : 12
    return fundingOverTime.slice(-months)
  }, [fundingOverTime, selectedTimeframe])

  // Calculate trend analysis
  const trendAnalysis = useMemo(() => {
    if (filteredData.length < 2) return null
    
    const first = filteredData[0]
    const last = filteredData[filteredData.length - 1]
    const totalGrowth = ((last.amount - first.amount) / first.amount) * 100
    const avgGrowth = filteredData.reduce((sum, item, index) => {
      if (index === 0) return sum
      return sum + ((item.amount - filteredData[index - 1].amount) / filteredData[index - 1].amount) * 100
    }, 0) / (filteredData.length - 1)

    return {
      totalGrowth,
      avgGrowth,
      trend: totalGrowth > 0 ? 'up' : totalGrowth < 0 ? 'down' : 'stable'
    }
  }, [filteredData])

  // Generate annotations for significant events
  const annotations = useMemo(() => {
    if (!showAnnotations) return []
    
    return filteredData
      .filter(item => item.growth > 20 || item.growth < -10)
      .map(item => ({
        x: item.month,
        y: item.amount,
        label: item.growth > 20 ? 'High Growth' : 'Significant Drop',
        value: item.growth
      }))
  }, [filteredData, showAnnotations])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-lg min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-slate-900">{data.month}</h4>
            <Badge variant="outline" className="text-xs">
              {selectedTimeframe.toUpperCase()}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Funding Amount</span>
              <span className="text-sm font-semibold text-blue-600">${data.amount}M</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Number of Deals</span>
              <span className="text-sm font-semibold text-green-600">{data.deals}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Average Size</span>
              <span className="text-sm font-semibold text-purple-600">${data.averageSize}M</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Growth Rate</span>
              <div className="flex items-center gap-1">
                {data.growth > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                ) : data.growth < 0 ? (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                ) : (
                  <Minus className="h-3 w-3 text-slate-600" />
                )}
                <span className={`text-sm font-semibold ${
                  data.growth > 0 ? 'text-emerald-600' : 
                  data.growth < 0 ? 'text-red-600' : 'text-slate-600'
                }`}>
                  {data.growth > 0 ? '+' : ''}{data.growth}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Enhanced pie chart with interactive features
  const EnhancedPieChart = () => (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={fundingByStage}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            dataKey="value"
            label={({ name, percent, value }) => `${name}: $${value}M (${(percent * 100).toFixed(1)}%)`}
            labelLine={false}
            className="text-xs cursor-pointer"
            onMouseEnter={(data) => setHoveredData(data)}
            onMouseLeave={() => setHoveredData(null)}
          >
            {fundingByStage.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke="white" 
                strokeWidth={2}
                opacity={hoveredData && hoveredData.name !== entry.name ? 0.3 : 1}
              />
            ))}
          </Pie>
          <Tooltip content={CustomTooltip} />
          <Legend 
            verticalAlign="bottom" 
            height={60}
            iconType="circle"
            className="text-xs"
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center statistics */}
      {hoveredData && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white rounded-lg p-3 shadow-lg border border-slate-200">
          <div className="text-lg font-bold text-slate-900">${hoveredData.value}M</div>
          <div className="text-xs text-slate-600">{hoveredData.name}</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {hoveredData.growth > 0 ? (
              <ArrowUpRight className="h-3 w-3 text-emerald-600" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-600" />
            )}
            <span className={`text-xs font-medium ${
              hoveredData.growth > 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {hoveredData.growth > 0 ? '+' : ''}{hoveredData.growth}%
            </span>
          </div>
        </div>
      )}
    </div>
  )

  // Main chart rendering based on selected type
  const renderMainChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    }

    switch (selectedChartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={CustomTooltip} />
            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            {annotations.map((annotation, index) => (
              <ReferenceLine
                key={index}
                x={annotation.x}
                stroke={annotation.value > 0 ? "#10b981" : "#ef4444"}
                strokeDasharray="3 3"
              />
            ))}
          </BarChart>
        )
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={CustomTooltip} />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              fill="url(#colorGradient)"
              strokeWidth={3}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        )
      
      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={CustomTooltip} />
            <Area 
              type="monotone" 
              dataKey="amount" 
              fill="#3b82f6" 
              fillOpacity={0.3}
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Bar dataKey="deals" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Line 
              type="monotone" 
              dataKey="averageSize" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        )
      
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={CustomTooltip} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
            />
            {annotations.map((annotation, index) => (
              <ReferenceLine
                key={index}
                x={annotation.x}
                stroke={annotation.value > 0 ? "#10b981" : "#ef4444"}
                strokeDasharray="3 3"
              />
            ))}
          </LineChart>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls Panel */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-slate-900">Data Visualization Controls</h3>
              <Badge variant="outline" className="text-xs">
                Interactive
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
                <SelectTrigger className="w-32 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedChartType} onValueChange={(value: any) => setSelectedChartType(value)}>
                <SelectTrigger className="w-32 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="composed">Composed</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnnotations(!showAnnotations)}
                className="h-9 text-xs"
              >
                <Info className="h-3 w-3 mr-1" />
                Annotations
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-9 text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                {isFullscreen ? 'Exit Full' : 'Fullscreen'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis Summary */}
      {trendAnalysis && (
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Funding Trend Analysis</h4>
                  <p className="text-xs text-slate-600">Based on {selectedTimeframe} data</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    {trendAnalysis.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                    ) : trendAnalysis.trend === 'down' ? (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-slate-600" />
                    )}
                    <span className={`text-lg font-bold ${
                      trendAnalysis.trend === 'up' ? 'text-emerald-600' : 
                      trendAnalysis.trend === 'down' ? 'text-red-600' : 'text-slate-600'
                    }`}>
                      {trendAnalysis.totalGrowth > 0 ? '+' : ''}{trendAnalysis.totalGrowth.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Total Growth</p>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {trendAnalysis.avgGrowth > 0 ? '+' : ''}{trendAnalysis.avgGrowth.toFixed(1)}%
                  </div>
                  <p className="text-xs text-slate-600">Avg Monthly</p>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={`${
                    trendAnalysis.trend === 'up' ? 'border-emerald-200 text-emerald-700' :
                    trendAnalysis.trend === 'down' ? 'border-red-200 text-red-700' :
                    'border-slate-200 text-slate-700'
                  }`}
                >
                  {trendAnalysis.trend === 'up' ? 'Growing' : trendAnalysis.trend === 'down' ? 'Declining' : 'Stable'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Charts */}
      <div className={`grid ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'} gap-6`}>
        {/* Funding Over Time Chart */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              Funding Over Time
              <Badge variant="outline" className="text-xs">
                {selectedTimeframe.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[400px]">
              <ChartContainer>
                {renderMainChart()}
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funding by Stage Chart */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              Funding by Stage
              <Badge variant="outline" className="text-xs">
                Interactive
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <EnhancedPieChart />
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Total Funding</p>
                <p className="text-lg font-bold text-blue-600">
                  ${filteredData.reduce((sum, item) => sum + item.amount, 0)}M
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Across {filteredData.length} months
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Total Deals</p>
                <p className="text-lg font-bold text-green-600">
                  {filteredData.reduce((sum, item) => sum + item.deals, 0)}
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Average ${(filteredData.reduce((sum, item) => sum + item.averageSize, 0) / filteredData.length).toFixed(1)}M per deal
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Active Threats</p>
                <p className="text-lg font-bold text-red-600">
                  {vulnerabilities.length}
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              {vulnerabilities.filter(v => v.severity === 'critical').length} critical
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Top Stage</p>
                <p className="text-lg font-bold text-purple-600">
                  {fundingByStage.reduce((max, item) => item.value > max.value ? item : max).name}
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              ${fundingByStage.reduce((max, item) => item.value > max.value ? item : max).value}M
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}