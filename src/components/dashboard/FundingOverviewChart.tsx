'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface FundingOverviewChartProps {
  data?: {
    yearlyTrends?: Array<{
      year: number
      funding: number
      deals: number
    }>
  }
}

export function FundingOverviewChart({ data }: FundingOverviewChartProps) {
  // Mock data for the chart to match Figma design
  const chartData = [
    { month: 'Jan', funding: 120, deals: 15 },
    { month: 'Feb', funding: 180, deals: 22 },
    { month: 'Mar', funding: 150, deals: 18 },
    { month: 'Apr', funding: 220, deals: 28 },
    { month: 'May', funding: 280, deals: 35 },
    { month: 'Jun', funding: 320, deals: 42 },
    { month: 'Jul', funding: 290, deals: 38 },
    { month: 'Aug', funding: 350, deals: 45 },
    { month: 'Sep', funding: 380, deals: 48 },
    { month: 'Oct', funding: 420, deals: 52 },
    { month: 'Nov', funding: 450, deals: 58 },
    { month: 'Dec', funding: 480, deals: 62 }
  ]

  if (!data?.yearlyTrends) {
    // Use mock data when real data isn't available
  }

  const formatTooltip = (value: number, name: string) => {
    if (name === 'funding') {
      return [`$${value}M`, 'Total Funding']
    }
    return [value, 'Number of Deals']
  }

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Funding Overview
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Monthly funding trends and deal activity
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Funding ($M)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Deals</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fundingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="dealsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
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
              <Area
                type="monotone"
                dataKey="funding"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fundingGradient)"
              />
              <Area
                type="monotone"
                dataKey="deals"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#dealsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}