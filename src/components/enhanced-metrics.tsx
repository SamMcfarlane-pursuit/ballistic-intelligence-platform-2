"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  DollarSign,
  Building2,
  AlertTriangle,
  Target,
  Users,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { CounterAnimation } from '@/components/transition-wrapper'

interface MetricData {
  title: string
  value: number
  target?: number
  change: number
  changeType: 'positive' | 'negative' | 'neutral'
  unit?: string
  icon: any
  color: string
  bgColor: string
  description: string
}

interface SparklineData {
  date: string
  value: number
}

interface EnhancedMetricsProps {
  metrics: MetricData[]
  timeframe?: 'day' | 'week' | 'month' | 'quarter' | 'year'
}

export function EnhancedMetricsCard({ metric, sparklineData }: { 
  metric: MetricData
  sparklineData?: SparklineData[]
}) {
  const [isHovered, setIsHovered] = useState(false)

  const getChangeIcon = () => {
    switch (metric.changeType) {
      case 'positive':
        return <ArrowUpRight className="h-4 w-4" />
      case 'negative':
        return <ArrowDownRight className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getChangeColor = () => {
    switch (metric.changeType) {
      case 'positive':
        return 'text-emerald-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-slate-600'
    }
  }

  const getChangeBg = () => {
    switch (metric.changeType) {
      case 'positive':
        return 'bg-emerald-50 border-emerald-200'
      case 'negative':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  return (
    <Card 
      className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${metric.bgColor} group-hover:scale-110 transition-transform duration-300`}>
            <metric.icon className={`h-6 w-6 ${metric.color}`} />
          </div>
          <Badge className={`${getChangeBg()} ${getChangeColor()} border text-xs`}>
            <div className="flex items-center gap-1">
              {getChangeIcon()}
              {Math.abs(metric.change)}%
            </div>
          </Badge>
        </div>
        
        <div className="mb-3">
          <p className="text-sm font-medium text-slate-600 mb-1">{metric.title}</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${metric.color}`}>
              <CounterAnimation value={metric.value} />
              {metric.unit}
            </p>
            {metric.target && (
              <span className="text-sm text-slate-500">
                of {metric.target}{metric.unit}
              </span>
            )}
          </div>
        </div>

        {metric.target && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500">Progress</span>
              <span className="text-xs font-medium text-slate-700">
                {Math.round((metric.value / metric.target) * 100)}%
              </span>
            </div>
            <Progress 
              value={(metric.value / metric.target) * 100} 
              className="h-2"
            />
          </div>
        )}

        <p className="text-xs text-slate-400 leading-relaxed">
          {metric.description}
        </p>

        {/* Sparkline visualization */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-4 h-12">
            <div className="flex items-end justify-between h-full gap-1">
              {sparklineData.slice(-12).map((data, index) => {
                const maxValue = Math.max(...sparklineData.map(d => d.value))
                const height = (data.value / maxValue) * 100
                return (
                  <div
                    key={index}
                    className="flex-1 bg-blue-200 rounded-sm transition-all duration-300 hover:bg-blue-300"
                    style={{ height: `${height}%` }}
                    title={`${data.date}: ${data.value}`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MetricComparison({ 
  title, 
  metrics, 
  timeframe = 'month' 
}: { 
  title: string
  metrics: MetricData[]
  timeframe?: string
}) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          {title}
          <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
            {timeframe}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{metric.title}</p>
                  <p className={`text-xs font-medium ${metric.change === 'positive' ? 'text-emerald-600' : metric.change === 'negative' ? 'text-red-600' : 'text-slate-600'}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </p>
                </div>
              </div>
              <p className={`text-lg font-bold ${metric.color}`}>
                {metric.value}{metric.unit}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function PerformanceGauge({ 
  value, 
  max = 100, 
  label, 
  color = 'blue' 
}: { 
  value: number
  max?: number
  label: string
  color?: string
}) {
  const percentage = (value / max) * 100
  const getColorClass = () => {
    if (percentage >= 80) return 'text-emerald-600'
    if (percentage >= 60) return 'text-blue-600'
    if (percentage >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBgColorClass = () => {
    if (percentage >= 80) return 'bg-emerald-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="text-center">
      <div className="relative inline-flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-8 border-slate-200"></div>
        <div 
          className="absolute w-24 h-24 rounded-full border-8 border-transparent"
          style={{
            background: `conic-gradient(${getBgColorClass()} ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
            mask: 'radial-gradient(white 60%, transparent 60%)',
            WebkitMask: 'radial-gradient(white 60%, transparent 60%)'
          }}
        ></div>
        <div className="absolute">
          <span className={`text-2xl font-bold ${getColorClass()}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-700 mt-2">{label}</p>
    </div>
  )
}

export function TrendIndicator({ 
  value, 
  trend, 
  label 
}: { 
  value: string
  trend: 'up' | 'down' | 'stable'
  label: string
}) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-slate-600" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-slate-600'
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-lg font-bold text-slate-700">{value}</p>
      </div>
      <div className="flex items-center gap-2">
        {getTrendIcon()}
        <span className={`text-sm font-medium ${getTrendColor()}`}>
          {trend === 'up' ? 'Growing' : trend === 'down' ? 'Declining' : 'Stable'}
        </span>
      </div>
    </div>
  )
}

export function MetricSummaryCard({ 
  title, 
  metrics, 
  icon: Icon 
}: { 
  title: string
  metrics: { label: string; value: string; change: string }[]
  icon: any
}) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <TrendIndicator
              key={index}
              value={metric.value}
              trend={metric.change.startsWith('+') ? 'up' : metric.change.startsWith('-') ? 'down' : 'stable'}
              label={metric.label}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function RealTimeMetrics({ metrics }: { metrics: MetricData[] }) {
  const [liveUpdates, setLiveUpdates] = useState<{[key: string]: number}>({})

  useEffect(() => {
    const interval = setInterval(() => {
      const updates: {[key: string]: number} = {}
      metrics.forEach(metric => {
        // Simulate small random changes
        const change = (Math.random() - 0.5) * 0.1
        updates[metric.title] = metric.value + (metric.value * change)
      })
      setLiveUpdates(updates)
    }, 5000)

    return () => clearInterval(interval)
  }, [metrics])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
              <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            </div>
            <p className="text-xs text-slate-600 mb-1">{metric.title}</p>
            <p className={`text-lg font-bold ${metric.color}`}>
              {liveUpdates[metric.title] ? 
                liveUpdates[metric.title].toFixed(1) : 
                metric.value.toFixed(1)
              }
              {metric.unit}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Real-time</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}