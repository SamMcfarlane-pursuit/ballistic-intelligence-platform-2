'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecureButton, SecureActionButton } from '@/components/ui/secure-button'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity, 
  Calendar, 
  ExternalLink,
  Plus,
  Play,
  RotateCcw,
  Users,
  Building,
  Newspaper,
  Target,
  Zap,
  Award,
  Briefcase,
  DollarSign,
  ShoppingCart
} from 'lucide-react'

interface CompanySignal {
  id: string
  companyName: string
  eventType: 'partnership' | 'product_launch' | 'executive_hire' | 'customer_win' | 'funding' | 'acquisition' | 'other'
  title: string
  description: string
  sentiment: 'positive' | 'neutral' | 'negative'
  confidence: number
  source: string
  sourceUrl: string
  publishedDate: string
  extractedEntities: any
}

interface CompanyTimeline {
  companyName: string
  signals: CompanySignal[]
  momentum: {
    score: number
    trend: 'increasing' | 'stable' | 'decreasing'
    recentActivity: number
    positiveSignals: number
    negativeSignals: number
  }
  lastUpdated: string
}

interface MonitoringTarget {
  companyName: string
  website: string
  socialMediaAccounts: any
  keyExecutives: string[]
  monitoringActive: boolean
  lastChecked: string
}

export default function NewsSignalsDashboard() {
  const [monitoredCompanies, setMonitoredCompanies] = useState<MonitoringTarget[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [companyTimeline, setCompanyTimeline] = useState<CompanyTimeline | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState('')
  const [newCompanyWebsite, setNewCompanyWebsite] = useState('')
  const [agentStatus, setAgentStatus] = useState<any>(null)

  // Load initial data
  useEffect(() => {
    loadAgentStatus()
    loadMonitoredCompanies()
  }, [])

  const loadAgentStatus = async () => {
    try {
      const response = await fetch('/api/news-signals?action=status')
      const data = await response.json()
      if (data.success) {
        setAgentStatus(data.data)
      }
    } catch (error) {
      console.error('Failed to load agent status:', error)
    }
  }

  const loadMonitoredCompanies = async () => {
    try {
      const response = await fetch('/api/news-signals?action=monitored-companies')
      const data = await response.json()
      if (data.success) {
        setMonitoredCompanies(data.data)
        if (data.data.length > 0 && !selectedCompany) {
          setSelectedCompany(data.data[0].companyName)
        }
      }
    } catch (error) {
      console.error('Failed to load monitored companies:', error)
    }
  }

  const loadCompanyTimeline = async (companyName: string) => {
    try {
      const response = await fetch(`/api/news-signals?action=company-timeline&company=${encodeURIComponent(companyName)}`)
      const data = await response.json()
      if (data.success) {
        setCompanyTimeline(data.data)
      }
    } catch (error) {
      console.error('Failed to load company timeline:', error)
    }
  }

  const addCompany = async () => {
    if (!newCompanyName.trim() || !newCompanyWebsite.trim()) return

    try {
      const response = await fetch('/api/news-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-company',
          company: {
            name: newCompanyName.trim(),
            website: newCompanyWebsite.trim(),
            socialMedia: {},
            executives: []
          }
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setNewCompanyName('')
        setNewCompanyWebsite('')
        await loadMonitoredCompanies()
        setSelectedCompany(newCompanyName.trim())
      } else {
        alert(`Failed to add company: ${data.error}`)
      }

    } catch (error) {
      console.error('Failed to add company:', error)
      alert('Failed to add company')
    }
  }

  const runMonitoring = async (companyName: string) => {
    setIsMonitoring(true)

    try {
      const response = await fetch('/api/news-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full-monitoring-cycle',
          companyName: companyName
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setCompanyTimeline(data.data.timeline)
        await loadAgentStatus()
      } else {
        throw new Error(data.error || 'Monitoring failed')
      }

    } catch (error) {
      console.error('Monitoring failed:', error)
      alert(`Monitoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsMonitoring(false)
    }
  }

  const runTestMonitoring = async () => {
    setIsMonitoring(true)

    try {
      const response = await fetch('/api/news-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-monitoring' })
      })

      const data = await response.json()
      
      if (data.success) {
        setCompanyTimeline(data.data.timeline)
        setSelectedCompany(data.data.testCompany.name)
        await loadMonitoredCompanies()
        await loadAgentStatus()
      } else {
        throw new Error(data.error || 'Test failed')
      }

    } catch (error) {
      console.error('Test monitoring failed:', error)
      alert(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsMonitoring(false)
    }
  }

  // Load timeline when selected company changes
  useEffect(() => {
    if (selectedCompany) {
      loadCompanyTimeline(selectedCompany)
    }
  }, [selectedCompany])

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'partnership': return <Users className="h-4 w-4" />
      case 'product_launch': return <Zap className="h-4 w-4" />
      case 'executive_hire': return <Briefcase className="h-4 w-4" />
      case 'customer_win': return <Award className="h-4 w-4" />
      case 'funding': return <DollarSign className="h-4 w-4" />
      case 'acquisition': return <ShoppingCart className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'partnership': return 'bg-blue-500'
      case 'product_launch': return 'bg-green-500'
      case 'executive_hire': return 'bg-purple-500'
      case 'customer_win': return 'bg-orange-500'
      case 'funding': return 'bg-yellow-500'
      case 'acquisition': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getMomentumTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News & Signals Dashboard</h1>
          <p className="text-muted-foreground">
            Proactive monitoring and momentum analysis of company business milestones
          </p>
        </div>
        <div className="flex gap-2">
          <SecureActionButton 
            onClick={loadAgentStatus}
            debounceMs={500}
            maxClicksPerMinute={20}
          >
            <RotateCcw className="h-4 w-4" />
            Refresh
          </SecureActionButton>
          <SecureActionButton 
            onClick={runTestMonitoring}
            debounceMs={1000}
            maxClicksPerMinute={5}
            disabled={isMonitoring}
          >
            <Play className="h-4 w-4" />
            Test Monitoring
          </SecureActionButton>
        </div>
      </div>

      {/* Agent Status */}
      {agentStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Agent Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{agentStatus.monitoredCompanies}</div>
                <div className="text-sm text-muted-foreground">Monitored Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{agentStatus.activeTimelines}</div>
                <div className="text-sm text-muted-foreground">Active Timelines</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-sm text-muted-foreground">Processing Phases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">7</div>
                <div className="text-sm text-muted-foreground">Event Types</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Company Monitoring
                </CardTitle>
                <CardDescription>
                  Select a company to monitor or run monitoring cycle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {monitoredCompanies.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Company:</label>
                      <select 
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        {monitoredCompanies.map((company) => (
                          <option key={company.companyName} value={company.companyName}>
                            {company.companyName}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <SecureButton 
                      onClick={() => runMonitoring(selectedCompany)}
                      loading={isMonitoring}
                      loadingText="Monitoring..."
                      debounceMs={1000}
                      maxClicksPerMinute={5}
                      disabled={!selectedCompany}
                      className="w-full"
                    >
                      <Activity className="h-4 w-4" />
                      Run Monitoring Cycle
                    </SecureButton>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Building className="h-12 w-12 mx-auto mb-2" />
                    <p>No companies being monitored</p>
                    <p className="text-sm">Add a company to start monitoring</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Company */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Company
                </CardTitle>
                <CardDescription>
                  Add a new company to the monitoring list
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name:</label>
                  <Input
                    placeholder="e.g., CyberSecure"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website:</label>
                  <Input
                    placeholder="e.g., https://cybersecure.com"
                    value={newCompanyWebsite}
                    onChange={(e) => setNewCompanyWebsite(e.target.value)}
                  />
                </div>
                
                <SecureActionButton 
                  onClick={addCompany}
                  debounceMs={500}
                  maxClicksPerMinute={10}
                  disabled={!newCompanyName.trim() || !newCompanyWebsite.trim()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4" />
                  Add Company
                </SecureActionButton>
              </CardContent>
            </Card>
          </div>

          {/* Processing Status */}
          {isMonitoring && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 animate-pulse text-blue-500" />
                    <span className="font-medium">Running monitoring cycle...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Phase 1: Gathering signals from multiple sources</div>
                    <div className="text-sm text-muted-foreground">Phase 2: Processing and categorizing events</div>
                    <div className="text-sm text-muted-foreground">Phase 3: Analyzing momentum and trends</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          {companyTimeline ? (
            <>
              {/* Momentum Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Company Momentum: {companyTimeline.companyName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{companyTimeline.momentum.score}</div>
                      <div className="text-sm text-muted-foreground">Momentum Score</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getMomentumTrendIcon(companyTimeline.momentum.trend)}
                        <span className="font-medium capitalize">{companyTimeline.momentum.trend}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Trend</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{companyTimeline.momentum.recentActivity}</div>
                      <div className="text-sm text-muted-foreground">Recent Activity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{companyTimeline.momentum.positiveSignals}</div>
                      <div className="text-sm text-muted-foreground">Positive Signals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{companyTimeline.momentum.negativeSignals}</div>
                      <div className="text-sm text-muted-foreground">Negative Signals</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Progress value={companyTimeline.momentum.score} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Company Timeline
                    <Badge variant="secondary">{companyTimeline.signals.length} signals</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {companyTimeline.signals.length > 0 ? (
                    <div className="space-y-4">
                      {companyTimeline.signals.map((signal) => (
                        <div key={signal.id} className="flex gap-4 p-4 border rounded-lg">
                          <div className={`w-8 h-8 rounded-full ${getEventColor(signal.eventType)} flex items-center justify-center text-white`}>
                            {getEventIcon(signal.eventType)}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{signal.title}</h4>
                                <p className="text-sm text-muted-foreground">{signal.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">{formatDate(signal.publishedDate)}</div>
                                <Badge variant="outline" className="mt-1">
                                  {signal.eventType.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${getSentimentColor(signal.sentiment)}`}>
                                  {signal.sentiment}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {Math.round(signal.confidence * 100)}% confidence
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{signal.source}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(signal.sourceUrl, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Newspaper className="h-12 w-12 mx-auto mb-4" />
                      <p>No signals found</p>
                      <p className="text-sm">Run monitoring to gather company signals</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>No timeline data available</p>
                  <p className="text-sm">Select a company and run monitoring to see timeline</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Monitored Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monitoredCompanies.length > 0 ? (
                <div className="space-y-4">
                  {monitoredCompanies.map((company) => (
                    <div key={company.companyName} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{company.companyName}</h4>
                        <p className="text-sm text-muted-foreground">{company.website}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={company.monitoringActive ? 'default' : 'secondary'}>
                            {company.monitoringActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Last checked: {formatDate(company.lastChecked)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <SecureActionButton
                          onClick={() => setSelectedCompany(company.companyName)}
                          debounceMs={300}
                          maxClicksPerMinute={20}
                          size="sm"
                        >
                          View Timeline
                        </SecureActionButton>
                        <SecureActionButton
                          onClick={() => runMonitoring(company.companyName)}
                          debounceMs={1000}
                          maxClicksPerMinute={5}
                          disabled={isMonitoring}
                          size="sm"
                        >
                          <Activity className="h-4 w-4" />
                          Monitor
                        </SecureActionButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="h-12 w-12 mx-auto mb-4" />
                  <p>No companies being monitored</p>
                  <p className="text-sm">Add companies to start monitoring their business signals</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['partnership', 'product_launch', 'executive_hire', 'customer_win', 'funding', 'acquisition'].map((type) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEventIcon(type)}
                        <span className="capitalize">{type.replace('_', ' ')}</span>
                      </div>
                      <Badge variant="outline">
                        {companyTimeline?.signals.filter(s => s.eventType === type).length || 0}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monitoring Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                {agentStatus?.capabilities ? (
                  <div className="space-y-2">
                    {agentStatus.capabilities.map((capability: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Loading capabilities...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}