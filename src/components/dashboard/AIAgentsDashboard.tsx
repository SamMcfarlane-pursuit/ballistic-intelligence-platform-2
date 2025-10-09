'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp, 
  DollarSign,
  FileText,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Network
} from 'lucide-react'

interface AgentStatus {
  operational: boolean
  confidence: number
  responseTime: string
}

interface SystemStatus {
  status: string
  agents: Record<string, string>
  capabilities: string[]
  lastUpdate: string
}

export default function AIAgentsDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus> | null>(null)
  const [demoAnalysis, setDemoAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('/api/ai-agents?action=status')
      if (!response.ok) {
        console.warn(`API response not OK: ${response.status}`)
        return
      }
      
      const text = await response.text()
      if (!text.trim() || !text.trim().startsWith('{')) {
        console.warn('Invalid JSON response')
        return
      }
      
      const data = JSON.parse(text)
      if (data.success) {
        setSystemStatus(data.data)
      }
    } catch (error) {
      console.error('Failed to load system status:', error)
    }
  }

  useEffect(() => {
    setMounted(true)
    loadSystemStatus()
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const loadAgentStatuses = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'agent-status' })
      })
      
      if (!response.ok) {
        console.warn(`API response not OK: ${response.status}`)
        return
      }
      
      const text = await response.text()
      if (!text.trim() || !text.trim().startsWith('{')) {
        console.warn('Invalid JSON response')
        return
      }
      
      const data = JSON.parse(text)
      if (data.success) {
        setAgentStatuses(data.data.agentStatuses)
      }
    } catch (error) {
      console.error('Failed to load agent statuses:', error)
    } finally {
      setLoading(false)
    }
  }

  const runDemoAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai-agents?action=demo')
      const data = await response.json()
      if (data.success) {
        setDemoAnalysis(data.data)
      }
    } catch (error) {
      console.error('Failed to run demo analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const runRAGDemoAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai-agents?action=rag-demo')
      const data = await response.json()
      if (data.success) {
        setDemoAnalysis(data.data)
      }
    } catch (error) {
      console.error('Failed to run RAG demo analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const agents = [
    {
      id: 'technicalAnalyst',
      name: 'Technical Analyst',
      icon: Brain,
      description: 'Analyzes technology stack, patents, and innovation metrics',
      color: 'bg-blue-500'
    },
    {
      id: 'marketAnalyst', 
      name: 'Market Analyst',
      icon: TrendingUp,
      description: 'Evaluates market position, competition, and growth potential',
      color: 'bg-green-500'
    },
    {
      id: 'threatAnalyst',
      name: 'Threat Analyst', 
      icon: Shield,
      description: 'Assesses security posture and threat landscape',
      color: 'bg-red-500'
    },
    {
      id: 'financialAnalyst',
      name: 'Financial Analyst',
      icon: DollarSign,
      description: 'Reviews financial health, metrics, and funding status',
      color: 'bg-yellow-500'
    },
    {
      id: 'patentAnalyst',
      name: 'Patent Analyst',
      icon: FileText,
      description: 'Analyzes IP portfolio and innovation strategy',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Status</p>
                <p className="text-lg font-bold text-green-600">Operational</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Agents</p>
                <p className="text-lg font-bold text-blue-600">{systemStatus ? Object.keys(systemStatus.agents).length : 0}/5</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Confidence</p>
                <p className="text-lg font-bold text-purple-600">87%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Analyses</p>
                <p className="text-lg font-bold text-orange-600">247</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon
          const status = agentStatuses?.[agent.id]
          const isActive = systemStatus?.agents[agent.id] === 'active'
          
          return (
            <Card key={agent.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${agent.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm">{agent.name}</CardTitle>
                  </div>
                  <Badge variant={isActive ? 'default' : 'secondary'}>
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                {status && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence:</span>
                      <span className="font-medium">{(status.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Response Time:</span>
                      <span className="font-medium">{status.responseTime}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={loadAgentStatuses} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Check Agent Status
        </Button>
        <Button onClick={runDemoAnalysis} disabled={loading} variant="outline">
          <Brain className="h-4 w-4 mr-2" />
          Run Demo Analysis
        </Button>
        <Button onClick={runRAGDemoAnalysis} disabled={loading} variant="secondary">
          <Network className="h-4 w-4 mr-2" />
          Run RAG-Enhanced Demo
        </Button>
      </div>

      {/* Demo Analysis Results */}
      {demoAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Demo Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Company: {demoAnalysis.company.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Focus Area:</span>
                    <Badge>{demoAnalysis.company.focusArea}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Stage:</span>
                    <span>{demoAnalysis.company.investmentStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employees:</span>
                    <span>{demoAnalysis.company.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Growth:</span>
                    <span>{demoAnalysis.company.revenueGrowth}%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Analysis Results</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Overall Score:</span>
                    <span className="font-medium">{(demoAnalysis.analysis.overallScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recommendation:</span>
                    <Badge variant={
                      demoAnalysis.analysis.synthesizedInsights.investmentRecommendation === 'strong_buy' ? 'default' :
                      demoAnalysis.analysis.synthesizedInsights.investmentRecommendation === 'buy' ? 'default' :
                      demoAnalysis.analysis.synthesizedInsights.investmentRecommendation === 'hold' ? 'secondary' : 'destructive'
                    }>
                      {demoAnalysis.analysis.synthesizedInsights.investmentRecommendation}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span className="font-medium">{(demoAnalysis.analysis.synthesizedInsights.confidenceLevel * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consensus:</span>
                    <span className="font-medium">{(demoAnalysis.analysis.agentCoordination.consensusLevel * 100).toFixed(0)}%</span>
                  </div>
                  {demoAnalysis.ragEnabled && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex items-center gap-2 mb-1">
                        <Network className="h-3 w-3" />
                        <span className="font-medium text-xs">RAG Enhanced</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Contextual Recs:</span>
                        <span>{demoAnalysis.ragEnhancements?.contextualRecommendations || 0}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Competitive Insights:</span>
                        <span>{demoAnalysis.ragEnhancements?.competitiveInsights || 0}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Key Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {demoAnalysis.analysis.synthesizedInsights.keyStrengths.map((strength: string, index: number) => (
                  <Badge key={index} variant="outline">{strength}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Capabilities */}
      {systemStatus?.capabilities && (
        <Card>
          <CardHeader>
            <CardTitle>System Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {systemStatus.capabilities.map((capability, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{capability}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}