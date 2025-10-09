'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface FundingChartProps {
  data?: {
    stageBreakdown?: Array<{
      stage: string
      count: number
      totalFunding: number
      averageFunding: number
    }>
    yearlyTrends?: Array<{
      year: number
      funding: number
      deals: number
    }>
  }
}

export function FundingChart({ data }: FundingChartProps) {
  if (!data?.stageBreakdown) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funding by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.stageBreakdown.map(stage => ({
    stage: stage.stage.replace('-', ' ').toUpperCase(),
    companies: stage.count,
    funding: Math.round(stage.totalFunding / 1000000), // Convert to millions
    avgFunding: Math.round(stage.averageFunding / 1000000)
  }))

  const formatCurrency = (value: number) => `$${value}M`
  const formatTooltip = (value: number, name: string) => {
    if (name === 'funding' || name === 'avgFunding') {
      return [`$${value}M`, name === 'funding' ? 'Total Funding' : 'Avg Funding']
    }
    return [value, 'Companies']
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding Distribution by Stage</CardTitle>
        <p className="text-sm text-gray-600">
          Investment rounds and funding amounts across different stages
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="stage" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                label={{ value: 'Companies', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{ value: 'Funding ($M)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="companies" 
                fill="#3b82f6" 
                name="Companies"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                yAxisId="right"
                dataKey="funding" 
                fill="#10b981" 
                name="Total Funding ($M)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {chartData.reduce((sum, item) => sum + item.companies, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ${chartData.reduce((sum, item) => sum + item.funding, 0)}M
            </div>
            <div className="text-sm text-gray-600">Total Funding</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${Math.round(chartData.reduce((sum, item) => sum + item.avgFunding, 0) / chartData.length)}M
            </div>
            <div className="text-sm text-gray-600">Avg per Stage</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}