"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { TrendingUp, Target } from 'lucide-react'

interface FundingChartsProps {
  fundingOverTime: Array<{ month: string; amount: number }>
  fundingByStage: Array<{ name: string; value: number; color: string }>
}

export default function FundingCharts({ fundingOverTime, fundingByStage }: FundingChartsProps) {
  const chartConfig = {
    amount: {
      label: "Funding Amount",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
      {/* Funding Over Time Chart */}
      <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Funding Over Time
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer config={chartConfig} className="h-[250px] lg:h-[300px]">
            <LineChart data={fundingOverTime}>
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
              <ChartTooltip 
                content={<ChartTooltipContent />} 
                cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Funding by Stage Chart */}
      <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Target className="h-5 w-5 text-green-600" />
            Funding by Stage
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={fundingByStage}
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={30}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                className="text-xs"
              >
                {fundingByStage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-sm">{payload[0].name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${payload[0].value}M ({((payload[0].value / fundingByStage.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                className="text-xs"
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}