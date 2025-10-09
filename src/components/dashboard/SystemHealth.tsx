'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Activity, Wifi, Database, Zap } from 'lucide-react'

interface SystemMetrics {
  apiRequests: { current: number; status: string }
  responseTime: { current: number; status: string }
  activeUsers: { current: number; status: string }
  systemLoad: { current: number; status: string }
}

export function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/dashboard/stats?type=realtime')
        if (response.ok) {
          const data = await response.json()
          setMetrics(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch system metrics:', error)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'good':
      case 'normal':
      case 'low':
        return 'bg-green-500'
      case 'warning':
      case 'medium':
        return 'bg-yellow-500'
      case 'critical':
      case 'high':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const overallStatus = metrics ? 
    Object.values(metrics).every(m => ['healthy', 'good', 'normal', 'low'].includes(m.status)) 
      ? 'healthy' : 'warning' 
    : 'unknown'

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-2"
      >
        <div className={`h-2 w-2 rounded-full ${getStatusColor(overallStatus)}`} />
        <span className="text-sm">System {overallStatus}</span>
        <Activity className="h-4 w-4" />
      </Button>

      {showDetails && metrics && (
        <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-lg">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">System Metrics</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">API Requests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {metrics.apiRequests.current}/min
                  </span>
                  <Badge 
                    variant={metrics.apiRequests.status === 'healthy' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {metrics.apiRequests.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Response Time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {metrics.responseTime.current}ms
                  </span>
                  <Badge 
                    variant={metrics.responseTime.status === 'good' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {metrics.responseTime.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Active Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {metrics.activeUsers.current}
                  </span>
                  <Badge 
                    variant="outline"
                    className="text-xs"
                  >
                    {metrics.activeUsers.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">System Load</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {metrics.systemLoad.current}%
                  </span>
                  <Badge 
                    variant={metrics.systemLoad.status === 'low' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {metrics.systemLoad.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}