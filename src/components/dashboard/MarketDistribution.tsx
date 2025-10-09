'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

interface MarketDistributionProps {
  data?: {
    marketMap?: Array<{
      category: string
      companies: number
      totalFunding: number
      marketShare: number
    }>
  }
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function MarketDistribution({ data }: MarketDistributionProps) {
  if (!data?.marketMap) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.marketMap.map(item => ({
    name: item.category,
    value: item.marketShare,
    companies: item.companies,
    funding: item.totalFunding
  }))

  const formatTooltip = (value: number, name: string, props: any) => {
    return [
      `${value.toFixed(1)}%`,
      `${props.payload.companies} companies, $${(props.payload.funding / 1000000000).toFixed(1)}B`
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Distribution by Category</CardTitle>
        <p className="text-sm text-gray-600">
          Market share and funding distribution across cybersecurity categories
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="mt-4 space-y-2">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{item.value.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">
                  {item.companies} companies
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}