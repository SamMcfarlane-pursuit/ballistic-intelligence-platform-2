"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  TrendingUp,
  Activity,
  Zap,
  Clock,
  RefreshCw,
  Wifi,
  WifiOff,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'sonner'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface RealTimeData {
  metrics: {
    totalInvestment: number
    companiesTracked: number
    newVulnerabilities: number
  }
  activities: Array<{
    id: string
    type: 'investment' | 'threat' | 'conference' | 'update'
    title: string
    description: string
    value: string
    timestamp: Date
  }>
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Simulate real-time notifications
  useEffect(() => {
    const generateNotification = (): Notification => {
      const types = ['success', 'warning', 'error', 'info'] as const
      const type = types[Math.floor(Math.random() * types.length)]
      
      const notifications = {
        success: {
          title: 'Investment Update',
          message: 'New funding round completed successfully'
        },
        warning: {
          title: 'Security Alert',
          message: 'Unusual activity detected in portfolio'
        },
        error: {
          title: 'System Alert',
          message: 'Data synchronization interrupted'
        },
        info: {
          title: 'Market Update',
          message: 'New cybersecurity trends detected'
        }
      }

      return {
        id: Date.now().toString(),
        type,
        ...notifications[type],
        timestamp: new Date(),
        read: false
      }
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newNotification = generateNotification()
        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]) // Keep last 20
        setUnreadCount(prev => prev + 1)
        
        // Show toast for important notifications
        if (newNotification.type === 'error' || newNotification.type === 'warning') {
          toast(newNotification.title, {
            description: newNotification.message,
            action: {
              label: 'View Details',
              onClick: () => setIsVisible(true)
            }
          })
        }
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Update unread count
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        className="h-10 px-3 border-slate-300 text-slate-700 hover:bg-slate-50 relative"
        onClick={() => setIsVisible(!isVisible)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      {isVisible && (
        <div className="absolute right-0 top-12 w-96 bg-white border border-slate-200 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-slate-600 hover:text-slate-700"
                >
                  Clear all
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    !notification.read ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium text-sm ${
                          !notification.read ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        {notification.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              notification.action?.onClick()
                              markAsRead(notification.id)
                            }}
                            className="text-xs"
                          >
                            {notification.action.label}
                          </Button>
                        )}
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-slate-500 hover:text-slate-700"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="text-xs text-slate-500 hover:text-slate-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function RealTimeMetrics({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData)
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData(prev => ({
        totalInvestment: prev.totalInvestment + (Math.random() - 0.5) * 0.1,
        companiesTracked: Math.max(1, prev.companiesTracked + Math.floor((Math.random() - 0.5) * 2)),
        newVulnerabilities: Math.max(0, prev.newVulnerabilities + Math.floor((Math.random() - 0.5) * 3))
      }))
      setLastUpdate(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [isLive])

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'investment':
        return `$${value.toFixed(1)}M`
      case 'companies':
        return value.toString()
      case 'vulnerabilities':
        return value.toString()
      default:
        return value.toString()
    }
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Real-Time Metrics
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
              <span className="text-xs text-slate-500">
                {isLive ? 'Live' : 'Paused'}
              </span>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="text-xs"
            >
              {isLive ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              {isLive ? 'Pause' : 'Resume'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setData(initialData)
                setLastUpdate(new Date())
              }}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {formatValue(data.totalInvestment, 'investment')}
            </div>
            <div className="text-sm text-blue-600">Total Investment</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-xs text-emerald-600">+2.4%</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-700 mb-1">
              {formatValue(data.companiesTracked, 'companies')}
            </div>
            <div className="text-sm text-emerald-600">Portfolio Companies</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-xs text-emerald-600">+16.7%</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-700 mb-1">
              {formatValue(data.newVulnerabilities, 'vulnerabilities')}
            </div>
            <div className="text-sm text-red-600">Active Threats</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-xs text-emerald-600">-15%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true)
  const [latency, setLatency] = useState(0)

  // Simulate connection monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const connected = Math.random() > 0.1 // 90% uptime
      setIsConnected(connected)
      setLatency(Math.floor(Math.random() * 100) + 20)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
        isConnected 
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
          : 'bg-red-100 text-red-700 border border-red-200'
      }`}>
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      {isConnected && (
        <div className="text-xs text-slate-500">
          {latency}ms
        </div>
      )}
    </div>
  )
}

export function ActivityFeed({ activities }: { activities: any[] }) {
  const [liveActivities, setLiveActivities] = useState(activities)

  // Simulate real-time activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 8 seconds
        const newActivity = {
          id: Date.now().toString(),
          type: ['investment', 'threat', 'conference', 'update'][Math.floor(Math.random() * 4)],
          title: 'New Activity',
          description: 'Real-time update detected',
          value: 'Live',
          timestamp: new Date()
        }
        setLiveActivities(prev => [newActivity, ...prev.slice(0, 9)])
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'investment':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />
      case 'threat':
        return <Zap className="h-4 w-4 text-red-600" />
      case 'conference':
        return <Activity className="h-4 w-4 text-blue-600" />
      default:
        return <Info className="h-4 w-4 text-slate-600" />
    }
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Live Activity Feed
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {liveActivities.map((activity, index) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-600">{activity.description}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`text-xs ${
                  activity.type === 'investment' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                  activity.type === 'threat' ? 'bg-red-100 text-red-700 border-red-200' :
                  activity.type === 'conference' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                  'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {activity.value}
                </Badge>
                <div className="text-xs text-slate-500 mt-1">
                  {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}