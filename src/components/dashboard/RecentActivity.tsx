'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, BarChart3, Calendar, Database } from 'lucide-react'

interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  category: string
}

interface RecentActivityProps {
  activities?: Activity[]
}

const iconMap = {
  data: Database,
  analysis: BarChart3,
  events: Calendar,
  company_added: Building2
}

const categoryColors = {
  data: 'bg-blue-100 text-blue-700',
  analysis: 'bg-green-100 text-green-700',
  events: 'bg-purple-100 text-purple-700',
  company: 'bg-orange-100 text-orange-700'
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity) => {
            const Icon = iconMap[activity.type as keyof typeof iconMap] || Database
            const colorClass = categoryColors[activity.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-700'
            
            return (
              <div 
                key={activity.id}
                className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="h-3 w-3" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  
                  <Badge 
                    variant="outline" 
                    className="text-xs mt-1"
                  >
                    {activity.category}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  )
}