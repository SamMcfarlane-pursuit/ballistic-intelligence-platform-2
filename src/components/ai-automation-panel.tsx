"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Bot, 
  Zap, 
  TrendingUp, 
  Brain, 
  Network, 
  Target, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react'

interface AIInsight {
  id: string
  type: 'trend' | 'opportunity' | 'risk' | 'recommendation'
  title: string
  description: string
  confidence: number
  timestamp: string
}

interface AutomationWorkflow {
  id: string
  name: string
  status: 'active' | 'inactive' | 'error'
  lastRun: string
  description: string
  icon: React.ReactNode
}

export default function AIAutomationPanel() {
  const [newsUrl, setNewsUrl] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [conventionUrl, setConventionUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([
    {
      id: '1',
      name: 'News Monitoring',
      status: 'active',
      lastRun: '2 minutes ago',
      description: 'Monitors 50+ news sources for cybersecurity funding announcements',
      icon: <Network className="h-5 w-5" />
    },
    {
      id: '2',
      name: 'Data Enrichment',
      status: 'active',
      lastRun: '5 minutes ago',
      description: 'Enriches company profiles with AI-generated insights',
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: '3',
      name: 'Trend Analysis',
      status: 'active',
      lastRun: '1 hour ago',
      description: 'Analyzes funding patterns and predicts market trends',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: '4',
      name: 'Convention Scraping',
      status: 'active',
      lastRun: '30 minutes ago',
      description: 'Scrapes cybersecurity conventions for Pre-Seed to Series A companies',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      id: '5',
      name: 'Investor Matching',
      status: 'inactive',
      lastRun: '2 days ago',
      description: 'Matches companies with potential investors based on profile',
      icon: <Target className="h-5 w-5" />
    }
  ])

  const handleProcessNews = async () => {
    if (!newsUrl) return
    
    setIsProcessing(true)
    try {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process-funding-news',
          data: { url: newsUrl }
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // Add to insights
        setAiInsights(prev => [{
          id: Date.now().toString(),
          type: 'opportunity',
          title: 'New Funding Detected',
          description: `Found funding round for ${result.data.company_name}: $${(result.data.funding_amount / 1000000).toFixed(1)}M ${result.data.funding_round}`,
          confidence: 0.85,
          timestamp: new Date().toISOString()
        }, ...prev])
      }
    } catch (error) {
      console.error('Error processing news:', error)
    } finally {
      setIsProcessing(false)
      setNewsUrl('')
    }
  }

  const handleEnrichCompany = async () => {
    if (!companyName) return
    
    setIsProcessing(true)
    try {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enrich-company-data',
          data: { company_name: companyName }
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setAiInsights(prev => [{
          id: Date.now().toString(),
          type: 'recommendation',
          title: `Company Enriched: ${companyName}`,
          description: `AI analysis complete. Sub-category: ${result.data.cybersecurity_sub_category}, Growth potential: ${result.data.growth_potential_score}/10`,
          confidence: 0.78,
          timestamp: new Date().toISOString()
        }, ...prev])
      }
    } catch (error) {
      console.error('Error enriching company:', error)
    } finally {
      setIsProcessing(false)
      setCompanyName('')
    }
  }

  const handleScrapeConvention = async () => {
    if (!conventionUrl) return
    
    setIsProcessing(true)
    try {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scrape-convention-data',
          data: { url: conventionUrl }
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setAiInsights(prev => [{
          id: Date.now().toString(),
          type: 'opportunity',
          title: 'Convention Data Scraped',
          description: `Found ${result.data.companies_count} companies at ${result.data.convention_name}. ${result.data.high_potential_count} high-potential matches for Ballistic Ventures.`,
          confidence: 0.82,
          timestamp: new Date().toISOString()
        }, ...prev])
      }
    } catch (error) {
      console.error('Error scraping convention:', error)
    } finally {
      setIsProcessing(false)
      setConventionUrl('')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-4 w-4" />
      case 'opportunity':
        return <Target className="h-4 w-4" />
      case 'risk':
        return <AlertCircle className="h-4 w-4" />
      case 'recommendation':
        return <Brain className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Bot className="h-6 w-6" />
          AI & Automation Features
        </h2>
        <p className="text-muted-foreground">
          Powered by AI and n8n workflows for intelligent data processing
        </p>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
          <TabsTrigger value="tools">AI Tools</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {workflow.icon}
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(workflow.status)}
                      <span className="text-sm text-muted-foreground">
                        {workflow.lastRun}
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Process News Article
                </CardTitle>
                <CardDescription>
                  Extract funding information from news articles using AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter news article URL..."
                  value={newsUrl}
                  onChange={(e) => setNewsUrl(e.target.value)}
                />
                <Button 
                  onClick={handleProcessNews} 
                  disabled={!newsUrl || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Process Article
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Enrich Company Data
                </CardTitle>
                <CardDescription>
                  Generate AI-powered insights for any cybersecurity company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter company name..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <Button 
                  onClick={handleEnrichCompany} 
                  disabled={!companyName || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Enrich Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Scrape Convention Data
                </CardTitle>
                <CardDescription>
                  Extract company information from cybersecurity convention websites
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter convention website URL..."
                  value={conventionUrl}
                  onChange={(e) => setConventionUrl(e.target.value)}
                />
                <Button 
                  onClick={handleScrapeConvention} 
                  disabled={!conventionUrl || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Scrape Convention
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent AI-Generated Insights</CardTitle>
              <CardDescription>
                Real-time insights powered by AI analysis of funding data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No insights yet. Use the AI tools to generate insights.</p>
                  </div>
                ) : (
                  aiInsights.map((insight) => (
                    <div key={insight.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{insight.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {Math.round(insight.confidence * 100)}% confidence
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(insight.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}