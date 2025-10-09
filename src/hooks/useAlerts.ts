'use client'

import { useState, useEffect } from 'react'

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

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/dashboard/stats?type=alerts')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data.alerts) {
          setAlerts(data.data.alerts.map((alert: Alert) => ({
            ...alert,
            read: false
          })))
        }
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ))
  }

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  useEffect(() => {
    fetchAlerts()
    
    // Refresh alerts every 2 minutes
    const interval = setInterval(fetchAlerts, 2 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const unreadCount = alerts.filter(alert => !alert.read).length

  return {
    alerts,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissAlert,
    refetch: fetchAlerts
  }
}