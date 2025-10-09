'use client'

import { Building2, DollarSign, Calendar, Briefcase, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SummaryCardsProps {
  data?: {
    companies?: { total: number; trend: string; color: string }
    funding?: { total: number; formatted: string; trend: string; color: string }
    conventions?: { total: number; trend: string; color: string }
    portfolio?: { total: number; trend: string; color: string }
  }
}

export function SummaryCards({ data }: SummaryCardsProps) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Companies Tracked',
      value: data.companies?.total || 0,
      trend: data.companies?.trend || '+0%',
      icon: Building2,
      color: 'blue'
    },
    {
      title: 'Total Funding',
      value: data.funding?.formatted || '$0',
      trend: data.funding?.trend || '+0%',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Conventions',
      value: data.conventions?.total || 0,
      trend: data.conventions?.trend || '+0',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Portfolio Companies',
      value: data.portfolio?.total || 0,
      trend: data.portfolio?.trend || '+0',
      icon: Briefcase,
      color: 'orange'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const isPositiveTrend = card.trend.startsWith('+')
        const Icon = card.icon
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <Icon className={cn(
                "h-4 w-4",
                card.color === 'blue' && "text-blue-600",
                card.color === 'green' && "text-green-600",
                card.color === 'purple' && "text-purple-600",
                card.color === 'orange' && "text-orange-600"
              )} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </div>
              <div className="flex items-center space-x-1">
                {isPositiveTrend ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <Badge 
                  variant={isPositiveTrend ? "default" : "destructive"}
                  className="text-xs"
                >
                  {card.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}