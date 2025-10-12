'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Database, 
  Globe, 
  Key, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  ExternalLink,
  Download,
  Upload,
  Activity,
  TrendingUp,
  DollarSign,
  Building,
  Users,
  FileText,
  Shield
} from 'lucide-react'

interface DataSource {
  id: string
  name: string
  url: string
  type: 'API' | 'Dataset' | 'Scraping' | 'XML/API' | 'CSV'
  category: 'funding' | 'market' | 'security' | 'intelligence' | 'investors'
  description: string
  status: 'active' | 'inactive' | 'error' | 'pending'
  lastUpdate: string
  updateFrequency: string
  apiKey?: string
  config: {
    enabled: boolean
    autoUpdate: boolean
    rateLimitPerHour: number
    dataRetention: number // days
  }
  metrics: {
    totalRecords: number
    successRate: number
    avgResponseTime: number
    lastSuccessfulSync: string
  }
}

export default function DataSourcesManager() {
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize data sources with the provided intelligence sources
  const initializeDataSources = () => {
    const sources: DataSource[] = [
      {
        id: 'intellizence',
        name: 'Intellizence Startup Funding',
        url: 'https://intellizence.com/product/startup-funding-dataset/',
        type: 'API',
        category: 'funding',
        description: 'Real-time startup funding, VC/PE deals, investor profiles',
        status: 'active',
        lastUpdate: new Date().toISOString(),
        updateFrequency: 'Real-time',
        config: {
          enabled: true,
          autoUpdate: true,
          rateLimitPerHour: 1000,
          dataRetention: 90
        },
        metrics: {
          totalRecords: 15420,
          successRate: 98.7,
          avgResponseTime: 245,
          lastSuccessfulSync: new Date(Date.now() - 2 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'finro',
        name: 'Finro Cybersecurity Valuations',
        url: 'https://www.finrofca.com/news/cybersecurity-valuation-mid-2025',
        type: 'Dataset',
        category: 'market',
        description: 'Revenue multiples, niche valuations, M&A trends',
        status: 'active',
        lastUpdate: new Date().toISOString(),
        updateFrequency: 'Quarterly',
        config: {
          enabled: true,
          autoUpdate: false,
          rateLimitPerHour: 100,
          dataRetention: 365
        },
        metrics: {
          totalRecords: 2840,
          successRate: 95.2,
          avgResponseTime: 1200,
          lastSuccessfulSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'datarade',
        name: 'Datarade Startup APIs',
        url: 'https://datarade.ai/data-categories/startup-data',
        type: 'API',
        category: 'funding',
        description: 'Founding dates, funding rounds, team bios, market size',
        status: 'active',
        lastUpdate: new Date().toISOString(),
        updateFrequency: 'Daily',
        config: {
          enabled: true,
          autoUpdate: true,
          rateLimitPerHour: 500,
          dataRetention: 180
        },
        metrics: {
          totalRecords: 8920,
          successRate: 97.1,
          avgResponseTime: 320,
          lastSuccessfulSync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'crunchbase',
        name: 'Crunchbase Data',
        url: 'https://data.crunchbase.com/docs',
        type: 'API',
        category: 'funding',
        description: 'Startup profiles, funding history, investor networks',
        status: 'active',
        lastUpdate: new Date().toISOString(),
        updateFrequency: 'Real-time',
        config: {
          enabled: true,
          autoUpdate: true,
          rateLimitPerHour: 2000,
          dataRetention: 365
        },
        metrics: {
          totalRecords: 45680,
          successRate: 99.2,
          avgResponseTime: 180,
          lastSuccessfulSync: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'sec-edgar',
        name: 'SEC EDGAR Filings',
        url: 'https://www.sec.gov/edgar.shtml',
        type: 'XML/API',
        category: 'funding',
        description: 'Form D filings, stealth rounds, public disclosures',
        status: 'active',
        lastUpdate: new Date().toISOString(),
        updateFrequency: 'Daily',
        config: {
          enabled: true,
          autoUpdate: true,
          rateLimitPerHour: 200,
          dataRetention: 730
        },
        metrics: {
          totalRecords: 12340,
          successRate: 94.8,
          avgResponseTime: 850,
          lastSuccessfulSync: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'growthlist',
        name: 'GrowthList Cybersecurity',
        url: 'https://growthlist.co/cyber-security-startups/',
        type: 'Scraping',
        category: 'funding',
        description: 'Weekly updated list of funded cybersecurity startups',
        status: 'active',
        lastUpdate: new Date().toISOString(),
        updateFrequency: 'Weekly',
        config: {
          enabled: true,
          autoUpdate: true,
          rateLimitPerHour: 50,
          dataRetention: 90
        },
        metrics: {
          totalRecords: 1250,
          successRate: 92.5,
          avgResponseTime: 2100,
          lastSuccessfulSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'openvc',
        name: 'OpenVC Cybersecurity Investors',
        url: 'https://www.openvc.app/investor-lists/cybersecurity-investors',
        type: 'Scraping',
        category: 'investors',
        description: '150+ cybersecurity-focused VC firms with stage and geography filters',
        status: 'active',
        lastUpdate: new Date().toISOString(),
        updateFrequency: 'Monthly',
        config: {
          enabled: true,
          autoUpdate: false,
          rateLimitPerHour: 25,
          dataRetention: 180
        },
        metrics: {
          totalRecords: 156,
          successRate: 89.7,
          avgResponseTime: 3200,
          lastSuccessfulSync: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ]
    
    setDataSources(sources)
  }

  useEffect(() => {
    setMounted(true)
    initializeDataSources()
  }, [])

  const updateDataSourceConfig = (sourceId: string, updates: Partial<DataSource['config']>) => {
    setDataSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, config: { ...source.config, ...updates } }
        : source
    ))
  }

  const syncDataSource = async (sourceId: string) => {
    setLoading(true)
    try {
      // Simulate API call to sync data source
      const response = await fetch('/api/data-sources/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId })
      })
      
      if (response.ok) {
        // Update metrics
        setDataSources(prev => prev.map(source => 
          source.id === sourceId 
            ? { 
                ...source, 
                metrics: {
                  ...source.metrics,
                  lastSuccessfulSync: new Date().toISOString(),
                  totalRecords: source.metrics.totalRecords + Math.floor(Math.random() * 50)
                }
              }
            : source
        ))
      }
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'funding': return <DollarSign className="h-4 w-4" />
      case 'market': return <TrendingUp className="h-4 w-4" />
      case 'security': return <Shield className="h-4 w-4" />
      case 'intelligence': return <Activity className="h-4 w-4" />
      case 'investors': return <Users className="h-4 w-4" />
      default: return <Database className="h-4 w-4" />
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Sources Manager</h2>
          <p className="text-gray-600">Manage funding and market intelligence data sources</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {dataSources.filter(s => s.status === 'active').length} Active Sources
          </Badge>
          <Button onClick={() => dataSources.forEach(s => syncDataSource(s.id))} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">
                  {dataSources.reduce((sum, s) => sum + s.metrics.totalRecords, 0).toLocaleString()}
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {(dataSources.reduce((sum, s) => sum + s.metrics.successRate, 0) / dataSources.length).toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sources</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dataSources.filter(s => s.status === 'active').length}/{dataSources.length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(dataSources.reduce((sum, s) => sum + s.metrics.avgResponseTime, 0) / dataSources.length)}ms
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dataSources.map((source) => (
          <Card key={source.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {getCategoryIcon(source.category)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <p className="text-sm text-gray-600">{source.type} • {source.updateFrequency}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(source.status)}>
                  {source.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{source.description}</p>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Records:</span>
                  <span className="font-semibold ml-2">{source.metrics.totalRecords.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-semibold ml-2 text-green-600">{source.metrics.successRate}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-semibold ml-2">{source.metrics.avgResponseTime}ms</span>
                </div>
                <div>
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="font-semibold ml-2">
                    {mounted ? new Date(source.metrics.lastSuccessfulSync).toLocaleTimeString() : '--:--:--'}
                  </span>
                </div>
              </div>

              {/* Configuration */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={source.config.enabled}
                      onCheckedChange={(enabled) => updateDataSourceConfig(source.id, { enabled })}
                    />
                    <span className="text-sm">Enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={source.config.autoUpdate}
                      onCheckedChange={(autoUpdate) => updateDataSourceConfig(source.id, { autoUpdate })}
                    />
                    <span className="text-sm">Auto-sync</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(source.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => syncDataSource(source.id)}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedSource(selectedSource === source.id ? null : source.id)}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Expanded Configuration */}
              {selectedSource === source.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  <h4 className="font-semibold">Advanced Configuration</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`rate-limit-${source.id}`}>Rate Limit (per hour)</Label>
                      <Input
                        id={`rate-limit-${source.id}`}
                        type="number"
                        value={source.config.rateLimitPerHour}
                        onChange={(e) => updateDataSourceConfig(source.id, { 
                          rateLimitPerHour: parseInt(e.target.value) 
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`retention-${source.id}`}>Data Retention (days)</Label>
                      <Input
                        id={`retention-${source.id}`}
                        type="number"
                        value={source.config.dataRetention}
                        onChange={(e) => updateDataSourceConfig(source.id, { 
                          dataRetention: parseInt(e.target.value) 
                        })}
                      />
                    </div>
                  </div>

                  {source.type === 'API' && (
                    <div>
                      <Label htmlFor={`api-key-${source.id}`}>API Key</Label>
                      <Input
                        id={`api-key-${source.id}`}
                        type="password"
                        placeholder="Enter API key..."
                        value={source.apiKey || ''}
                        onChange={(e) => {
                          setDataSources(prev => prev.map(s => 
                            s.id === source.id ? { ...s, apiKey: e.target.value } : s
                          ))
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}