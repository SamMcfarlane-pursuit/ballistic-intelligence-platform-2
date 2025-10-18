/**
 * BrightData Monitoring Component
 * 
 * Displays real-time metrics, health status, and controls for BrightData integration
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Activity,
  Globe,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  BarChart3,
  RefreshCw,
  Shield,
  Loader2
} from 'lucide-react'

interface BrightDataMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  bytesTransferred: number
  costEstimate: number
  topEndpoints: Array<{
    url: string
    count: number
    avgTime: number
  }>
  errorBreakdown: Record<string, number>
}

interface HealthStatus {
  healthy: boolean
  message: string
  metrics: BrightDataMetrics
}

export default function BrightDataMonitor() {
  const [metrics, setMetrics] = useState<BrightDataMetrics | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const loadMetrics = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/brightdata?action=metrics')
      const data = await response.json()
      
      if (data.success) {
        setMetrics(data.data)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error('Failed to load BrightData metrics:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/brightdata?action=health')
      const data = await response.json()
      setHealth(data)
    } catch (error) {
      console.error('Failed to check BrightData health:', error)
      setHealth({
        healthy: false,
        message: 'Failed to connect to BrightData service',
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          averageResponseTime: 0,
          bytesTransferred: 0,
          costEstimate: 0,
          topEndpoints: [],
          errorBreakdown: {}
        }
      })
    }
  }, [])

  useEffect(() => {
    loadMetrics()
    checkHealth()
  }, [loadMetrics, checkHealth])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadMetrics()
        checkHealth()
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh, loadMetrics, checkHealth])

  const handleRefresh = () => {
    loadMetrics()
    checkHealth()
  }

  const successRate = metrics 
    ? ((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="h-7 w-7 text-blue-600" />
            BrightData Intelligence Network
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time web data collection and proxy monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Status Alert */}
      {health && (
        <Alert className={health.healthy ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <div className="flex items-center gap-2">
            {health.healthy ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <AlertDescription className={health.healthy ? 'text-green-800' : 'text-red-800'}>
              <span className="font-semibold">{health.message}</span>
              {lastRefresh && (
                <span className="ml-2 text-sm opacity-75">
                  • Last updated {lastRefresh.toISOString().slice(11, 19)}
                </span>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests */}
        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {metrics?.totalRequests.toLocaleString() || '0'}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {successRate}%
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Response Time */}
        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Response</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {metrics?.averageResponseTime.toFixed(0) || '0'}ms
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Estimate */}
        <Card className="border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Est. Cost</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  ${metrics?.costEstimate.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5 text-blue-600" />
              Top Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics && metrics.topEndpoints.length > 0 ? (
              <div className="space-y-3">
                {metrics.topEndpoints.slice(0, 5).map((endpoint, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {endpoint.url.replace('https://', '').replace('http://', '')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {endpoint.count} requests • {endpoint.avgTime.toFixed(0)}ms avg
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No endpoint data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-red-600" />
              Error Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics && Object.keys(metrics.errorBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(metrics.errorBreakdown)
                  .slice(0, 5)
                  .map(([error, count], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {error}
                        </p>
                      </div>
                      <Badge variant="destructive" className="ml-2">
                        {count}
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-30" />
                <p className="text-sm">No errors recorded</p>
                <p className="text-xs mt-1">System operating normally</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Request Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Request Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Successful</span>
                <span className="text-lg font-bold text-green-600">
                  {metrics?.successfulRequests.toLocaleString() || '0'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${metrics ? (metrics.successfulRequests / metrics.totalRequests) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Failed</span>
                <span className="text-lg font-bold text-red-600">
                  {metrics?.failedRequests.toLocaleString() || '0'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${metrics ? (metrics.failedRequests / metrics.totalRequests) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Data Transferred</span>
                <span className="text-lg font-bold text-blue-600">
                  {metrics ? (metrics.bytesTransferred / 1024 / 1024).toFixed(2) : '0'} MB
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>Real-time monitoring active</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
