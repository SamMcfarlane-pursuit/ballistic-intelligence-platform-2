'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Building2, Target, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down'
  icon: 'dollar' | 'building' | 'trending' | 'target'
}

const iconMap = {
  dollar: DollarSign,
  building: Building2,
  trending: BarChart3,
  target: Target
}

export function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  const Icon = iconMap[icon]
  const isPositive = trend === 'up'
  
  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <div className={cn(
            "flex items-center space-x-1 text-sm font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{change}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}