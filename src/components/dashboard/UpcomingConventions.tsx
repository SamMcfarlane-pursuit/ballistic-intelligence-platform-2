'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Convention {
  id: string
  name: string
  location: string
  startDate: string
  endDate: string
  companies: number
  daysUntil: number
}

interface UpcomingConventionsProps {
  conventions?: Convention[]
}

export function UpcomingConventions({ conventions }: UpcomingConventionsProps) {
  if (!conventions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Conventions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntilBadge = (daysUntil: number) => {
    if (daysUntil < 0) {
      return <Badge variant="secondary">Past</Badge>
    }
    if (daysUntil === 0) {
      return <Badge variant="default">Today</Badge>
    }
    if (daysUntil <= 7) {
      return <Badge variant="destructive">This Week</Badge>
    }
    if (daysUntil <= 30) {
      return <Badge variant="outline">This Month</Badge>
    }
    return <Badge variant="secondary">{daysUntil} days</Badge>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Conventions</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/conventions">
            View All
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conventions.slice(0, 5).map((convention) => (
            <div 
              key={convention.id}
              className="p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">
                  {convention.name}
                </h4>
                {getDaysUntilBadge(convention.daysUntil)}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDate(convention.startDate)} - {formatDate(convention.endDate)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{convention.location}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Users className="h-3 w-3" />
                  <span>{convention.companies} companies</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {conventions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No upcoming conventions
          </div>
        )}
      </CardContent>
    </Card>
  )
}