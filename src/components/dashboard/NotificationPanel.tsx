'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, CheckCircle, AlertTriangle, Info, TrendingUp } from 'lucide-react'

interface Alert {
  id: string
  type: 'success' | 'warning' | 'info' | 'opportunity'
  severity: 'low' | 'medium' | 'high'
  title: string
  message: string
  action?: string | null
  timestamp: string
  read?: boolean
}

interface NotificationPanelProps {
  alerts: Alert[]
  onClose: () => void
}

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  opportunity: TrendingUp
}

const colorMap = {
  success: 'text-green-600 bg-green-50',
  warning: 'text-yellow-600 bg-yellow-50',
  info: 'text-blue-600 bg-blue-50',
  opportunity: 'text-purple-600 bg-purple-50'
}

export function NotificationPanel({ alerts, onClose }: NotificationPanelProps) {
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
    <Card className="absolute right-0 top-full mt-2 w-96 z-50 shadow-lg max-h-96 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Notifications</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="space-y-1">
              {alerts.map((alert) => {
                const Icon = iconMap[alert.type]
                const colorClass = colorMap[alert.type]
                
                return (
                  <div 
                    key={alert.id}
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !alert.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {alert.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={alert.severity === 'high' ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {alert.severity}
                            </Badge>
                            {!alert.read && (
                              <div className="h-2 w-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mt-1">
                          {alert.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(alert.timestamp)}
                          </span>
                          
                          {alert.action && (
                            <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                              {alert.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        
        {alerts.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Mark all as read
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}