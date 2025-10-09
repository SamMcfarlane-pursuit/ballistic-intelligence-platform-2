'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Brain,
  Search,
  Network,
  Zap,
  TrendingUp,
  Target,
  Users,
  Building2,
  RefreshCw,
  Eye,
  ArrowRight,
  Lightbulb,
  GitBranch,
  Clock,
  Shield,
  DollarSign
} from 'lucide-react'

export default function RAGIntelligencePage() {
  const [knowledgeQuery, setKnowledgeQuery] = useState('')
  const [queryResults, setQueryResults] = useState<any>(null)
  const [demoResults, setDemoResults] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('knowledge')

  useEffect(() => {
    loadDemoResults()
  }, [])

  const loadDemoResults = async () => {
    try {
      const response = await fetch('/api/rag-analysis?type=demo')
      const data = await response.json()
      if (data.success) {
        setDemoResults(data.data)
      }
    } catch (error) {
      console.error('Failed to load demo results:', error)
    }
  }

  const executeKnowledgeQuery = async () => {
    if (!knowledgeQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/rag-analysis?type=knowledge&query=${encodeURIComponent(knowledgeQuery)}`)
      const data = await response.json()
      if (data.success) {
        setQueryResults(data.data)
      }
    } catch (error) {
      console.error('Knowledge query failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const discoverOpportunities = async (focusArea: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/rag-analysis?type=opportunities&focusArea=${focusArea}`)
      const data = await response.json()
      if (data.success) {
        setOpportunities(data.data)
      }
    } catch (error) {
      console.error('Opportunity discovery failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const runComprehensiveAnalysis = async () => {
    setLoading(true)
    try {
      const testCompany = {
        id: 'rag-test-001',
        name: 'CyberGuard AI',
        focusArea: 'ai-security',
        investmentStage: 'series-a',
        description: 'AI-powered cybersecurity platform with advanced threat detection',
        employees: 85,
        founded: 2021,
        revenueGrowth: 200
      }

      const response = await fetch('/api/rag-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comprehensive-analysis',
          company: testCompany,
          query: 'AI security investment analysis market trends competitive landscape'
        })
      })

      const data = await response.json()
      if (data.success) {
        setQueryResults(data.data)
        setActiveTab('analysis')
      }
    } catch (error) {
      console.error('Comprehensive analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">RAG Intelligence Platform</h1>
        <p className="text-gray-600">
          Knowledge Graph-Enhanced AI Analysis for Cybersecurity Investment Intelligence
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        {[
          { id: 'knowledge', label: 'Knowledge Graph', icon: Network },
          { id: 'opportunities', label: 'Opportunities', icon: Target },
          { id: 'analysis', label: 'RAG Analysis', icon: Brain }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Knowledge Graph Tab */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          {/* Query Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Knowledge Graph Query
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your query (e.g., 'AI security investment opportunities')"
                  value={knowledgeQuery}
                  onChange={(e) => setKnowledgeQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && executeKnowledgeQuery()}
                  className="flex-1"
                />
                <Button onClick={executeKnowledgeQuery} disabled={loading}>
                  <Search className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Query
                </Button>
              </div>

              {/* Sample Queries */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Sample queries:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'AI security investment opportunities',
                    'Zero trust architecture market trends',
                    'Cybersecurity threat landscape evolution',
                    'Identity management competitive analysis'
                  ].map(query => (
                    <Button
                      key={query}
                      variant="outline"
                      size="sm"
                      onClick={() => setKnowledgeQuery(query)}
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Query Results */}
          {queryResults && (
            <Card>
              <CardHeader>
                <CardTitle>Query Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{queryResults.insights?.entityCount || 0}</div>
                    <div className="text-sm text-gray-600">Entities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{queryResults.insights?.relationshipCount || 0}</div>
                    <div className="text-sm text-gray-600">Relationships</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{queryResults.insights?.multiHopInsights || 0}</div>
                    <div className="text-sm text-gray-600">Multi-hop Insights</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {queryResults.insights?.relevanceScore ? (queryResults.insights.relevanceScore * 100).toFixed(0) + '%' : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Relevance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demo Knowledge Graph Stats */}
          {demoResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Knowledge Graph Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Nodes:</span>
                      <span className="font-medium">{demoResults.knowledgeGraphStats.totalNodes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Edges:</span>
                      <span className="font-medium">{demoResults.knowledgeGraphStats.totalEdges}</span>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Node Types</h4>
                      <div className="space-y-2">
                        {Object.entries(demoResults.knowledgeGraphStats.nodeTypes).map(([type, count]) => (
                          <div key={type} className="flex justify-between text-sm">
                            <span className="capitalize">{type}:</span>
                            <span>{count as number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Multi-hop Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoResults.multiHopExamples.map((example: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {(example.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {example.path.join(' → ')}
                        </div>
                        <div className="text-sm">{example.insight}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Investment Opportunity Discovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'ai-security',
                  'data-protection',
                  'application-security',
                  'workforce-security'
                ].map(area => (
                  <Button
                    key={area}
                    variant="outline"
                    onClick={() => discoverOpportunities(area)}
                    disabled={loading}
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <Shield className="h-6 w-6 mb-2" />
                    <span className="text-xs capitalize">{area.replace('-', ' ')}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {opportunities && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold">{opportunities.summary?.totalOpportunities || 0}</div>
                    <div className="text-sm text-gray-600">Total Opportunities</div>
                  </div>
                  <div className="space-y-2">
                    {opportunities.opportunities?.slice(0, 3).map((opp: any, index: number) => (
                      <div key={index} className="border rounded p-2">
                        <div className="text-sm font-medium">{opp.opportunity}</div>
                        <div className="text-xs text-gray-600">
                          Confidence: {(opp.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {opportunities.marketInsights?.map((insight: any, index: number) => (
                      <div key={index} className="border rounded p-2">
                        <div className="text-sm font-medium">{insight.insight}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Theme: {insight.theme}
                        </div>
                        <div className="text-xs text-gray-600">
                          Strength: {(insight.strength * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {opportunities.riskFactors?.map((risk: any, index: number) => (
                      <div key={index} className="border rounded p-2">
                        <div className="text-sm font-medium">{risk.risk}</div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>Severity: {risk.severity}</span>
                          <span>Probability: {(risk.probability * 100).toFixed(0)}%</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Mitigation: {risk.mitigation}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* RAG Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                RAG-Enhanced Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Button onClick={runComprehensiveAnalysis} disabled={loading} size="lg">
                  <Brain className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Run Comprehensive RAG Analysis
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Combines AI agents with knowledge graph intelligence
                </p>
              </div>
            </CardContent>
          </Card>

          {queryResults?.analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Overall Score:</span>
                      <span className="font-medium">
                        {(queryResults.summary.overallScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recommendation:</span>
                      <Badge>{queryResults.summary.investmentRecommendation}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span className="font-medium">
                        {(queryResults.summary.confidenceLevel * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Knowledge Graph Relevance:</span>
                      <span className="font-medium">
                        {(queryResults.summary.knowledgeGraphRelevance * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Contextual Recommendations:</span>
                      <span className="font-medium">{queryResults.summary.contextualRecommendations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cross-Entity Insights:</span>
                      <span className="font-medium">{queryResults.summary.crossEntityInsights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Semantic Connections:</span>
                      <span className="font-medium">{queryResults.summary.semanticConnections}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Semantic Clusters */}
      {demoResults?.semanticClusters && activeTab === 'knowledge' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Semantic Clusters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoResults.semanticClusters.map((cluster: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{cluster.theme}</h4>
                    <Badge variant="outline">
                      {(cluster.coherence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {cluster.members.map((member: string, idx: number) => (
                      <div key={idx} className="text-xs text-gray-600">
                        • {member}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}