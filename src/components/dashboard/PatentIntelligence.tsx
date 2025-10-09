'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, FileText, Users, TrendingUp, Database, ExternalLink } from 'lucide-react'

interface PatentData {
  id: string
  title: string
  inventors: string[]
  assignee: string
  filingDate: string
  publicationDate: string
  category: string
  citations: number
  claims: number
  relevanceScore?: number
}

interface DatasetInfo {
  name: string
  type: string
  samples: number
  lastUpdated: string
  format: string
  size: string
}

interface PatentIntelligenceData {
  patents: PatentData[]
  datasets: DatasetInfo[]
  summary: {
    totalPatents: number
    cybersecurityPatents: number
    recentFilings: number
    totalDatasets: number
    malwareDatasets: number
    networkDatasets: number
  }
  lastUpdated: string
}

export function PatentIntelligence() {
  const [data, setData] = useState<PatentIntelligenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPatentData = async () => {
    try {
      // Mock data - in production, this would fetch from multiple patent intelligence sources
      const mockData: PatentIntelligenceData = {
        patents: [
          {
            id: 'US11234567B2',
            title: 'Advanced Threat Detection Using Machine Learning',
            inventors: ['John Smith', 'Jane Doe'],
            assignee: 'CyberDefense Corp',
            filingDate: '2023-01-15',
            publicationDate: '2024-03-20',
            category: 'cybersecurity',
            citations: 15,
            claims: 20,
            relevanceScore: 0.95
          },
          {
            id: 'US20240123456A1',
            title: 'Zero Trust Network Architecture Implementation',
            inventors: ['Alice Johnson', 'Bob Wilson'],
            assignee: 'SecureNet Technologies',
            filingDate: '2023-08-10',
            publicationDate: '2024-05-15',
            category: 'network_security',
            citations: 8,
            claims: 18,
            relevanceScore: 0.89
          },
          {
            id: 'US11987654B1',
            title: 'Quantum-Resistant Cryptographic Methods',
            inventors: ['Dr. Sarah Chen', 'Michael Rodriguez'],
            assignee: 'QuantumSafe Inc',
            filingDate: '2023-03-22',
            publicationDate: '2024-01-08',
            category: 'cryptography',
            citations: 23,
            claims: 25,
            relevanceScore: 0.92
          }
        ],
        datasets: [
          {
            name: 'Malware Analysis Dataset 2024',
            type: 'malware',
            samples: 5000,
            lastUpdated: '2024-01-15',
            format: 'csv',
            size: '2.3GB'
          },
          {
            name: 'Botnet Traffic Patterns',
            type: 'network',
            samples: 15000,
            lastUpdated: '2024-02-01',
            format: 'pcap',
            size: '8.7GB'
          }
        ],
        summary: {
          totalPatents: 125000,
          cybersecurityPatents: 8500,
          recentFilings: 234,
          totalDatasets: 450,
          malwareDatasets: 125,
          networkDatasets: 89
        },
        lastUpdated: new Date().toISOString()
      }

      setData(mockData)
    } catch (error) {
      console.error('Failed to fetch patent intelligence data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchPatentData()
  }

  useEffect(() => {
    fetchPatentData()
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchPatentData, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cybersecurity: 'bg-red-100 text-red-800',
      network_security: 'bg-blue-100 text-blue-800',
      cryptography: 'bg-purple-100 text-purple-800',
      ai_ml: 'bg-green-100 text-green-800',
      blockchain: 'bg-yellow-100 text-yellow-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getDatasetTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      malware: 'bg-red-100 text-red-800',
      network: 'bg-blue-100 text-blue-800',
      ics: 'bg-orange-100 text-orange-800',
      cloud: 'bg-green-100 text-green-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Patent Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Patent Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load patent intelligence data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Patent Intelligence
            </CardTitle>
            <CardDescription>
              Innovation trends and research datasets
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.summary.totalPatents.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Patents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.summary.cybersecurityPatents.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Cybersecurity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{data.summary.recentFilings}</div>
            <div className="text-sm text-muted-foreground">Recent Filings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{data.summary.totalDatasets}</div>
            <div className="text-sm text-muted-foreground">Research Datasets</div>
          </div>
        </div>

        {/* Recent Patents */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recent Patent Filings
          </h4>
          <div className="space-y-3">
            {data.patents.map((patent) => (
              <div key={patent.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-sm truncate">{patent.title}</h5>
                      <Badge variant="secondary" className={getCategoryColor(patent.category)}>
                        {patent.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {patent.inventors.join(', ')}
                        </span>
                        <span>{patent.assignee}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>Patent: {patent.id}</span>
                        <span>Citations: {patent.citations}</span>
                        <span>Claims: {patent.claims}</span>
                        {patent.relevanceScore && (
                          <span>Relevance: {Math.round(patent.relevanceScore * 100)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Datasets */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Research Datasets
          </h4>
          <div className="grid gap-3">
            {data.datasets.map((dataset, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-sm">{dataset.name}</h5>
                      <Badge variant="outline" className={getDatasetTypeColor(dataset.type)}>
                        {dataset.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {dataset.samples.toLocaleString()} samples • {dataset.format.toUpperCase()} • {dataset.size} • Updated {new Date(dataset.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Sources: USPTO, Google Patents, GitHub</span>
              <span>Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Live
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}