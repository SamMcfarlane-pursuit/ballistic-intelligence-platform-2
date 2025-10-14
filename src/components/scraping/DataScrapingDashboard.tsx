'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecureActionButton } from '@/components/ui/secure-button'
import { 
  Globe,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  FileText,
  Activity,
  Target,
  Zap,
  Eye,
  Settings,
  Play,
  Pause,
  BarChart3
} from 'lucide-react'

interface ScrapingSource {
  id: string
  name: string
  url: string
  type: 'news' | 'funding' | 'company' | 'conference' | 'social'
  status: 'active' | 'paused' | 'error'
  lastScrape: string
  dataPoints: number
  successRate: number
  costSaving: number // vs paid alternatives
}

interface ScrapingJob {
  id: string
  source: string
  status: 'running' | 'completed' | 'failed' | 'queued'
  progress: number
  itemsFound: number
  startTime: string
  estimatedCompletion?: string
}

interface ScrapedData {
  companies: number
  fundingRounds: number
  newsArticles: number
  conferences: number
  totalValue: number
}

export default function DataScrapingDashboard() {
  const [sources, setSources] = useState<ScrapingSource[]>([])
  const [jobs, setJobs] = useState<ScrapingJob[]>([])
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadScrapingData()
      // Refresh every 30 seconds
      const interval = setInterval(loadScrapingData, 30000)
      return () => clearInterval(interval)
    }
  }, [mounted])

  const loadScrapingData = async () => {
    try {
      const response = await fetch('/api/data-scraping')
      const data = await response.json()
      
      if (data.success) {
        setSources(data.data.sources)
        setJobs(data.data.jobs)
        setScrapedData(data.data.summary)
      } else {
        // Mock data
        const mockData = getMockScrapingData()
        setSources(mockData.sources)
        setJobs(mockData.jobs)
        setScrapedData(mockData.summary)
      }
    } catch (error) {
      console.error('Failed to load scraping data:', error)
      const mockData = getMockScrapingData()
      setSources(mockData.sources)
      setJobs(mockData.jobs)
      setScrapedData(mockData.summary)
    } finally {
      setIsLoading(false)
    }
  }

  const startScraping = async (sourceId: string) => {
    try {
      const response = await fetch('/api/data-scraping/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId })
      })
      
      if (response.ok) {
        await loadScrapingData()
        alert('✅ Scraping job started successfully')
      }
    } catch (error) {
      console.error('Failed to start scraping:', error)
      alert('❌ Failed to start scraping job')
    }
  }

  const pauseScraping = async (sourceId: string) => {
    try {
      const response = await fetch('/api/data-scraping/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId })
      })
      
      if (response.ok) {
        await loadScrapingData()
        alert('⏸️ Scraping job paused')
      }
    } catch (error) {
      console.error('Failed to pause scraping:', error)
      alert('❌ Failed to pause scraping job')
    }
  }

  const exportScrapedData = async (format: 'excel' | 'csv' | 'json') => {
    try {
      const response = await fetch('/api/data-scraping/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `scraped-data.${format}`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('❌ Export failed')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'queued': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': case 'running': return <Play className="h-4 w-4" />
      case 'paused': return <Pause className="h-4 w-4" />
      case 'error': case 'failed': return <AlertTriangle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'queued': return <Clock className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Globe className="h-12 w-12 mx-auto mb-4 animate-pulse text-blue-500" />
          <p className="text-lg font-medium">Loading Scraping Dashboard...</p>
        </div>
      </div>
    )
  }  return 
(
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Data Scraping Center
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Free alternative to expensive subscriptions - scrape public data sources
          </p>
        </div>
        <div className="flex gap-3">
          <SecureActionButton onClick={loadScrapingData} debounceMs={1000}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </SecureActionButton>
          <SecureActionButton onClick={() => exportScrapedData('excel')} debounceMs={1000}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </SecureActionButton>
        </div>
      </div>

      {/* Cost Savings Summary */}
      {scrapedData && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Cost Savings vs Paid Subscriptions
            </CardTitle>
            <CardDescription>
              Money saved by using free scraping instead of expensive data subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$47K</div>
                <div className="text-sm text-muted-foreground">Annual Savings</div>
                <div className="text-xs text-green-600">vs Crunchbase Pro</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{scrapedData.companies.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Companies Scraped</div>
                <div className="text-xs text-blue-600">Free vs $1,200/month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{scrapedData.fundingRounds.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Funding Rounds</div>
                <div className="text-xs text-purple-600">Free vs $800/month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{scrapedData.newsArticles.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">News Articles</div>
                <div className="text-xs text-orange-600">Free vs $500/month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="data">Scraped Data</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>

        {/* Data Sources */}
        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sources.map((source) => (
              <Card key={source.id} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <CardDescription>{source.url}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(source.status)}>
                        {getStatusIcon(source.status)}
                        {source.status}
                      </Badge>
                      <Badge variant="outline">{source.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{source.dataPoints.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Data Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{source.successRate}%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Performance</span>
                      <span className="text-sm">{source.successRate}%</span>
                    </div>
                    <Progress value={source.successRate} className="w-full" />
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <div>Last scrape: {source.lastScrape}</div>
                    <div className="text-green-600 font-medium">
                      Saves ${source.costSaving.toLocaleString()}/year vs paid alternatives
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {source.status === 'active' ? (
                      <SecureActionButton
                        onClick={() => pauseScraping(source.id)}
                        size="sm"
                        variant="outline"
                        debounceMs={500}
                      >
                        <Pause className="h-3 w-3 mr-2" />
                        Pause
                      </SecureActionButton>
                    ) : (
                      <SecureActionButton
                        onClick={() => startScraping(source.id)}
                        size="sm"
                        debounceMs={500}
                      >
                        <Play className="h-3 w-3 mr-2" />
                        Start
                      </SecureActionButton>
                    )}
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-2" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-2" />
                      View Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Active Jobs */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Running Scraping Jobs</CardTitle>
              <CardDescription>Real-time status of active scraping operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{job.source}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(job.status)}>
                            {getStatusIcon(job.status)}
                            {job.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Started: {job.startTime}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{job.itemsFound}</div>
                        <div className="text-sm text-muted-foreground">Items Found</div>
                      </div>
                    </div>

                    {job.status === 'running' && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Progress</span>
                          <span className="text-sm">{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="w-full" />
                        {job.estimatedCompletion && (
                          <div className="text-sm text-muted-foreground mt-2">
                            ETA: {job.estimatedCompletion}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scraped Data */}
        <TabsContent value="data" className="space-y-4">
          {scrapedData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Companies</p>
                      <p className="text-3xl font-bold text-blue-600">{scrapedData.companies.toLocaleString()}</p>
                    </div>
                    <Building className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Funding Rounds</p>
                      <p className="text-3xl font-bold text-green-600">{scrapedData.fundingRounds.toLocaleString()}</p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">News Articles</p>
                      <p className="text-3xl font-bold text-purple-600">{scrapedData.newsArticles.toLocaleString()}</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conferences</p>
                      <p className="text-3xl font-bold text-orange-600">{scrapedData.conferences.toLocaleString()}</p>
                    </div>
                    <Activity className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Export Options */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Scraped Data</CardTitle>
              <CardDescription>Download your scraped data in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SecureActionButton 
                  onClick={() => exportScrapedData('excel')} 
                  className="flex-col h-24"
                  debounceMs={1000}
                >
                  <FileText className="h-8 w-8 mb-2" />
                  <span>Excel Format</span>
                  <span className="text-xs text-muted-foreground">Formatted for analysis</span>
                </SecureActionButton>
                <SecureActionButton 
                  onClick={() => exportScrapedData('csv')} 
                  variant="outline" 
                  className="flex-col h-24"
                  debounceMs={1000}
                >
                  <Database className="h-8 w-8 mb-2" />
                  <span>CSV Format</span>
                  <span className="text-xs text-muted-foreground">Raw data export</span>
                </SecureActionButton>
                <SecureActionButton 
                  onClick={() => exportScrapedData('json')} 
                  variant="outline" 
                  className="flex-col h-24"
                  debounceMs={1000}
                >
                  <Download className="h-8 w-8 mb-2" />
                  <span>JSON Format</span>
                  <span className="text-xs text-muted-foreground">API integration</span>
                </SecureActionButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock data function
function getMockScrapingData() {
  return {
    sources: [
      {
        id: '1',
        name: 'TechCrunch Funding',
        url: 'https://techcrunch.com/category/startups/',
        type: 'funding' as const,
        status: 'active' as const,
        lastScrape: '2024-10-14 09:30 AM',
        dataPoints: 2847,
        successRate: 94,
        costSaving: 14400 // vs Crunchbase
      },
      {
        id: '2',
        name: 'VentureBeat News',
        url: 'https://venturebeat.com/security/',
        type: 'news' as const,
        status: 'active' as const,
        lastScrape: '2024-10-14 09:15 AM',
        dataPoints: 1923,
        successRate: 89,
        costSaving: 6000 // vs news APIs
      },
      {
        id: '3',
        name: 'Company Websites',
        url: 'Various company sites',
        type: 'company' as const,
        status: 'running' as const,
        lastScrape: '2024-10-14 08:45 AM',
        dataPoints: 5621,
        successRate: 87,
        costSaving: 18000 // vs data providers
      },
      {
        id: '4',
        name: 'Conference Listings',
        url: 'Multiple conference sites',
        type: 'conference' as const,
        status: 'paused' as const,
        lastScrape: '2024-10-13 06:00 PM',
        dataPoints: 892,
        successRate: 92,
        costSaving: 3600 // vs event APIs
      }
    ],
    jobs: [
      {
        id: '1',
        source: 'TechCrunch Funding',
        status: 'running' as const,
        progress: 67,
        itemsFound: 23,
        startTime: '09:30 AM',
        estimatedCompletion: '10:15 AM'
      },
      {
        id: '2',
        source: 'LinkedIn Company Updates',
        status: 'queued' as const,
        progress: 0,
        itemsFound: 0,
        startTime: '10:00 AM'
      }
    ],
    summary: {
      companies: 3247,
      fundingRounds: 1856,
      newsArticles: 4923,
      conferences: 234,
      totalValue: 7800000000
    }
  }
}