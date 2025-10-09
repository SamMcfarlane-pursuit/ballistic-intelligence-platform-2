'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  amount?: number
  company?: string
  stage?: string
}

interface RecentFundingProps {
  activities?: Activity[]
}

export function RecentFunding({ activities }: RecentFundingProps) {
  // Mock data to match Figma design
  const mockActivities = [
    {
      id: '1',
      type: 'funding',
      title: 'Series B Funding',
      company: 'CyberShield',
      amount: 45000000,
      stage: 'Series B',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'funding',
      title: 'Seed Round',
      company: 'SecureFlow',
      amount: 8500000,
      stage: 'Seed',
      timestamp: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      type: 'funding',
      title: 'Series A Funding',
      company: 'DataGuard Pro',
      amount: 23000000,
      stage: 'Series A',
      timestamp: '2024-01-13T09:15:00Z'
    },
    {
      id: '4',
      type: 'funding',
      title: 'Pre-Seed Round',
      company: 'ThreatHunter',
      amount: 3200000,
      stage: 'Pre-Seed',
      timestamp: '2024-01-12T16:45:00Z'
    },
    {
      id: '5',
      type: 'funding',
      title: 'Series C Funding',
      company: 'ZeroTrust Inc',
      amount: 78000000,
      stage: 'Series C',
      timestamp: '2024-01-11T11:30:00Z'
    }
  ]

  const displayActivities = activities || mockActivities

  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'pre-seed':
        return 'bg-gray-100 text-gray-800'
      case 'seed':
        return 'bg-green-100 text-green-800'
      case 'series a':
        return 'bg-blue-100 text-blue-800'
      case 'series b':
        return 'bg-purple-100 text-purple-800'
      case 'series c':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Funding
          </CardTitle>
          <Link 
            href="/funding" 
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.slice(0, 5).map((activity) => (
            <div 
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {activity.company}
                  </h4>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatAmount(activity.amount || 0)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <Badge 
                    className={`text-xs ${getStageColor(activity.stage || '')}`}
                    variant="secondary"
                  >
                    {activity.stage}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}