'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface StartupsByStageChartProps {
  data?: {
    stageBreakdown?: Array<{
      stage: string
      count: number
      totalFunding: number
    }>
  }
}

export function StartupsByStageChart({ data }: StartupsByStageChartProps) {
  // Use real data if available, otherwise use mock data
  const chartData = data?.stageBreakdown?.map(stage => ({
    stage: stage.stage.replace('-', ' ').toUpperCase(),
    startups: stage.count,
    funding: Math.round(stage.totalFunding / 1000000) // Convert to millions
  })) || [
    { stage: 'SEED', startups: 45, funding: 180 },
    { stage: 'SERIES A', startups: 32, funding: 420 },
    { stage: 'SERIES B', startups: 18, funding: 650 },
    { stage: 'SERIES C', startups: 12, funding: 890 },
    { stage: 'SERIES D+', startups: 8, funding: 1200 }
  ]

  const formatTooltip = (value: number, name: string) => {
    if (name === 'funding') {
      return [`$${value}M`, 'Total Funding']
    }
    return [value, 'Number of Startups']
  }

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Startups by Stage
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Distribution across funding stages
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-600">Startups</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Funding ($M)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="stage" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                yAxisId="left"
                dataKey="startups" 
                fill="#10b981" 
                name="startups"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar 
                yAxisId="right"
                dataKey="funding" 
                fill="#f97316" 
                name="funding"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}