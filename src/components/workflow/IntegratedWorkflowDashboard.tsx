'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecureButton, SecureActionButton } from '@/components/ui/secure-button'
import { 
  Brain, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  Building, 
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Database,
  TrendingUp
} from 'lucide-react'

interface WorkflowStats {
  queueLength: number
  queueStats: Record<string, number>
  companyProfilingTasks: number
  agentStatus: Record<string, string>
}

interface VerificationQueueItem {
  id: string
  type: 'data_verification' | 'company_profiling'
  companyName: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  linkedinUrl?: string
  createdAt: string
}

interface WorkflowResult {
  processedCount: number
  verifiedCount: number
  manualReviewCount: number
  executionTime: number
  results: any[]
  errors: string[]
}

export default function IntegratedWorkflowDashboard() {
  const [workflowStats, setWorkflowStats] = useState<WorkflowStats | null>(null)
  const [verificationQueue, setVerificationQueue] = useState<VerificationQueueItem[]>([])
  const [batchInput, setBatchInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastResult, setLastResult] = useState<WorkflowResult | null>(null)
  const [currentPhase, setCurrentPhase] = useState('')
  const [progress, setProgress] = useState(0)

  // Load initial data
  useEffect(() => {
    loadWorkflowStats()
    loadVerificationQueue()
  }, [])

  const loadWorkflowStats = async () => {
    try {
      const response = await fetch('/api/integrated-workflow?action=workflow-stats')
      const data = await response.json()
      if (data.success) {
        setWorkflowStats(data.data)
      }
    } catch (error) {
      console.error('Failed to load workflow stats:', error)
    }
  }

  const loadVerificationQueue = async () => {
    try {
      const response = await fetch('/api/integrated-workflow?action=verification-queue')
      const data = await response.json()
      if (data.success) {
        setVerificationQueue(data.data.queue || [])
      }
    } catch (error) {
      console.error('Failed to load verification queue:', error)
    }
  }

  const processBatch = async () => {
    if (!batchInput.trim()) return

    setIsProcessing(true)
    setProgress(0)
    setCurrentPhase('Preparing articles...')

    try {
      // Split articles by double newlines or other separators
      const articles = batchInput
        .split(/\n\s*\n/)
        .map(article => article.trim())
        .filter(article => article.length > 50)

      if (articles.length === 0) {
        alert('No valid articles found. Please ensure each article is at least 50 characters.')
        return
      }

      setCurrentPhase(`Processing ${articles.length} articles...`)
      setProgress(25)

      const response = await fetch('/api/integrated-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process-batch',
          articles: articles
        })
      })

      setProgress(75)
      setCurrentPhase('Finalizing results...')

      const data = await response.json()
      
      if (data.success) {
        setLastResult(data.data)
        setProgress(100)
        setCurrentPhase('Complete!')
        
        // Refresh stats and queue
        await loadWorkflowStats()
        await loadVerificationQueue()
        
        // Clear input after successful processing
        setBatchInput('')
      } else {
        throw new Error(data.error || 'Processing failed')
      }

    } catch (error) {
      console.error('Batch processing failed:', error)
      alert(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setCurrentPhase('Failed')
    } finally {
      setIsProcessing(false)
      setTimeout(() => {
        setProgress(0)
        setCurrentPhase('')
      }, 3000)
    }
  }

  const runWorkflowTest = async () => {
    setIsProcessing(true)
    setCurrentPhase('Running workflow test...')
    setProgress(50)

    try {
      const response = await fetch('/api/integrated-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-workflow' })
      })

      const data = await response.json()
      
      if (data.success) {
        setLastResult(data.data.testResult)
        setProgress(100)
        setCurrentPhase('Test complete!')
        
        await loadWorkflowStats()
        await loadVerificationQueue()
      } else {
        throw new Error(data.error || 'Test failed')
      }

    } catch (error) {
      console.error('Workflow test failed:', error)
      alert(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
      setTimeout(() => {
        setProgress(0)
        setCurrentPhase('')
      }, 3000)
    }
  }

  const completeVerificationTask = async (taskId: string) => {
    try {
      const response = await fetch('/api/integrated-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete-verification',
          taskId: taskId
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Remove task from local state
        setVerificationQueue(prev => prev.filter(task => task.id !== taskId))
        await loadWorkflowStats()
      } else {
        throw new Error(data.error || 'Failed to complete task')
      }

    } catch (error) {
      console.error('Failed to complete verification task:', error)
      alert(`Failed to complete task: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const loadSampleBatch = () => {
    const sampleArticles = `CyberGuard, a cloud security startup, announced today that it has raised $15 million in Series A funding led by Ballistic Ventures. The San Francisco-based company, founded in 2019 by CEO Sarah Chen and CTO Michael Rodriguez, provides advanced threat detection for enterprise cloud environments.

SecureFlow Technologies closed a $8.5 million seed round led by CyberTech Capital with participation from Security Ventures. The Boston-based startup, founded by former NSA engineers Alex Thompson and Jordan Lee, focuses on zero-trust network security solutions.

AI security company ThreatShield raised $22 million in Series B funding from Enterprise Security Fund and existing investors. Founded in 2018 by Rachel Martinez (CEO) and Kevin Park (CTO), the New York-based company uses machine learning to detect advanced persistent threats.`

    setBatchInput(sampleArticles)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'data_verification': return <Database className="h-4 w-4" />
      case 'company_profiling': return <Building className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrated Workflow Dashboard</h1>
          <p className="text-muted-foreground">
            Complete 3-Phase Pipeline: Gather → Process → Analyze
          </p>
        </div>
        <div className="flex gap-2">
          <SecureActionButton 
            onClick={loadWorkflowStats}
            debounceMs={500}
            maxClicksPerMinute={20}
          >
            <RotateCcw className="h-4 w-4" />
            Refresh
          </SecureActionButton>
          <SecureActionButton 
            onClick={runWorkflowTest}
            debounceMs={1000}
            maxClicksPerMinute={5}
            disabled={isProcessing}
          >
            <Play className="h-4 w-4" />
            Test Workflow
          </SecureActionButton>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 animate-pulse text-blue-500" />
                <span className="font-medium">{currentPhase}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="workflow" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="queue">Verification Queue</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Batch Article Processing
              </CardTitle>
              <CardDescription>
                Process multiple funding articles through the complete 3-phase pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <SecureActionButton 
                  onClick={loadSampleBatch}
                  debounceMs={500}
                  maxClicksPerMinute={10}
                >
                  <FileText className="h-4 w-4" />
                  Load Sample Articles
                </SecureActionButton>
              </div>
              
              <Textarea
                placeholder="Paste funding articles here (separate multiple articles with blank lines)..."
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value.slice(0, 50000))}
                className="min-h-[200px]"
                maxLength={50000}
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {batchInput.length}/50,000 characters
                </span>
                <SecureButton 
                  onClick={processBatch}
                  loading={isProcessing}
                  loadingText="Processing..."
                  debounceMs={1000}
                  maxClicksPerMinute={5}
                  disabled={!batchInput.trim() || batchInput.length < 50}
                >
                  <Brain className="h-4 w-4" />
                  Process Articles
                </SecureButton>
              </div>
            </CardContent>
          </Card>

          {/* Phase Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Phase 2: Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">NLP/NER with Gemini Flash 2.5</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Extract structured data from raw articles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Phase 3: Analyze</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Cross-verification & scoring</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Verify data accuracy across sources
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Company Profiling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Tier 1 & 2 Intelligence</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Build comprehensive company profiles
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Verification Queue Tab */}
        <TabsContent value="queue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Verification Queue
                {verificationQueue.length > 0 && (
                  <Badge variant="secondary">{verificationQueue.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Items requiring manual review and verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {verificationQueue.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No items in verification queue</p>
                  <p className="text-sm">All processed data has been automatically verified</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {verificationQueue.map((item) => (
                    <Card key={item.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(item.type)}
                              <span className="font-medium">{item.companyName}</span>
                              <Badge variant={getPriorityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.reason}</p>
                            <p className="text-xs text-muted-foreground">
                              Created: {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {item.linkedinUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(item.linkedinUrl, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                                LinkedIn
                              </Button>
                            )}
                            <SecureActionButton
                              onClick={() => completeVerificationTask(item.id)}
                              debounceMs={500}
                              maxClicksPerMinute={10}
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Complete
                            </SecureActionButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Latest Workflow Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lastResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{lastResult.processedCount}</div>
                      <div className="text-sm text-muted-foreground">Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{lastResult.verifiedCount}</div>
                      <div className="text-sm text-muted-foreground">Verified</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{lastResult.manualReviewCount}</div>
                      <div className="text-sm text-muted-foreground">Manual Review</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{Math.round(lastResult.executionTime / 1000)}s</div>
                      <div className="text-sm text-muted-foreground">Execution Time</div>
                    </div>
                  </div>

                  {lastResult.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-red-600 mb-2">Errors:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {lastResult.errors.map((error, index) => (
                          <li key={index} className="text-sm text-red-600">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>No workflow results yet</p>
                  <p className="text-sm">Process some articles to see results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {workflowStats ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Queue Length:</span>
                      <Badge variant="secondary">{workflowStats.queueLength}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Company Profiling Tasks:</span>
                      <Badge variant="secondary">{workflowStats.companyProfilingTasks}</Badge>
                    </div>
                    <div className="space-y-2">
                      <span className="font-medium">Agent Status:</span>
                      {Object.entries(workflowStats.agentStatus).map(([agent, status]) => (
                        <div key={agent} className="flex justify-between">
                          <span className="capitalize">{agent}:</span>
                          <Badge variant={status === 'operational' ? 'default' : 'destructive'}>
                            {status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Loading statistics...</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Queue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {workflowStats?.queueStats ? (
                  <div className="space-y-2">
                    {Object.entries(workflowStats.queueStats).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span className="capitalize">{type.replace('_', ' ')}:</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No queue data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}