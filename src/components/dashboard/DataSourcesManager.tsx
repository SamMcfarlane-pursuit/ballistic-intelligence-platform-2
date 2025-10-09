'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  ExternalLink,
  Settings,
  Play,
  Clock
} from 'lucide-react'

interface DataSource {
  id: string
  name: string
  type: string
  description: string
  status: 'available' | 'syncing' | 'error'
  lastSync: string
  recordCount: number
  updateFrequency: string
  healthStatus: 'healthy' | 'warning' | 'error'
}

interface DataSourcesManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function DataSourcesManager({ isOpen, onClose }: DataSourcesManagerProps) {
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchDataSources()
    }
  }, [isOpen])

  const fetchDataSources = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/data-sources')
      const data = await response.json()
      
      if (data.success) {
        setDataSources(data.data.sources)
      }
    } catch (error) {
      console.error('Failed to fetch data sources:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncDataSource = async (sourceId: string) => {
    try {
      setSyncing(sourceId)
      const response = await fetch('/api/data-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: sourceId, action: 'sync' })
      })
      
      const data = await response.json()
      if (data.success) {
        // Refresh data sources list
        await fetchDataSources()
      }
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setSyncing(null)
    }
  }

  const testConnection = async (sourceId: string) => {
    try {
      const response = await fetch('/api/data-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: sourceId, action: 'test' })
      })
      
      const data = await response.json()
      console.log('Connection test result:', data)
      // You could show a toast notification here
    } catch (error) {
      console.error('Connection test failed:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Database className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatLastSync = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <CardTitle>Data Sources Management</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading data sources...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4">
                {dataSources.map((source) => (
                  <div 
                    key={source.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(source.healthStatus)}
                          <h3 className="font-semibold text-gray-900">{source.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(source.healthStatus)}`}
                          >
                            {source.healthStatus}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {source.type}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          {source.description}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Last Sync:</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="font-medium">
                                {formatLastSync(source.lastSync)}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Records:</span>
                            <div className="font-medium">
                              {source.recordCount.toLocaleString()}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Frequency:</span>
                            <div className="font-medium">
                              {source.updateFrequency}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testConnection(source.id)}
                          disabled={syncing === source.id}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => syncDataSource(source.id)}
                          disabled={syncing === source.id}
                        >
                          {syncing === source.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {dataSources.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No data sources configured
                </div>
              )}
            </div>
          )}
        </CardContent>

        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {dataSources.length} data sources configured
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={fetchDataSources}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}