"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Building2, AlertTriangle, Calendar } from 'lucide-react'

interface DashboardMetricsProps {
  stats: {
    totalInvestment: number
    companiesTracked: number
    newVulnerabilities: number
    activeConferences: number
  }
}

export default function DashboardMetrics({ stats }: DashboardMetricsProps) {
  const metrics = [
    {
      title: "Total Investment",
      value: `$${stats.totalInvestment}M`,
      change: "+12% from last month",
      icon: DollarSign,
      color: "text-blue-600",
      borderColor: "border-l-blue-600"
    },
    {
      title: "Companies Tracked",
      value: stats.companiesTracked.toString(),
      change: "+2 new this week",
      icon: Building2,
      color: "text-green-600",
      borderColor: "border-l-green-600"
    },
    {
      title: "New Vulnerabilities",
      value: stats.newVulnerabilities.toString(),
      change: "1 critical, 2 high",
      icon: AlertTriangle,
      color: "text-red-600",
      borderColor: "border-l-red-600"
    },
    {
      title: "Active Conferences",
      value: stats.activeConferences.toString(),
      change: "2 this month",
      icon: Calendar,
      color: "text-purple-600",
      borderColor: "border-l-purple-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card 
          key={index} 
          className={`border-l-4 ${metric.borderColor} shadow-sm hover:shadow-md transition-shadow`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {metric.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}