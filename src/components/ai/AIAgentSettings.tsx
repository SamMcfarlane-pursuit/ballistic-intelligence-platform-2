'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Settings, 
  Brain, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  FileText,
  Play,
  Pause,
  RotateCcw,
  Save,
  AlertCircle,
  CheckCircle,
  Activity,
  Zap,
  Target,
  BarChart3
} from 'lucide-react'

interface AgentConfig {
  id: string
  name: string
  active: boolean
  confidence: number
  analysisDepth: number
  updateFrequency: number
  focusAreas: string[]
  riskTolerance: 'low' | 'medium' | 'high'
  dataSource: string[]
  customPrompt: string
  lastRun: string
  performance: {
    accuracy: number
    speed: number
    insights: number
  }
}

interface AIAgentSettingsProps {
  agentId: string
  onConfigChange: (config: AgentConfig) => void
}

export default function AIAgentSettings({ agentId, onConfigChange }: AIAgentSettingsProps) {
  const [config, setConfig] = useState<AgentConfig | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Default configurations for each agent type
  const defaultConfigs: Record<string, Partial<AgentConfig>> = {
    technicalAnalyst: {
      name: 'Technical Analyst',
      focusAreas: ['Technology Stack', 'Patents', 'Innovation Metrics', 'R&D Investment'],
      riskTolerance: 'medium',
      dataSource: ['Patent Database', 'Tech Reports', 'Company Filings', 'Crunchbase Data', 'SEC EDGAR Filings'],
      customPrompt: 'Analyze the technical capabilities, innovation potential, and technology differentiation of the target company.'
    },
    marketAnalyst: {
      name: 'Market Analyst',
      focusAreas: ['Market Position', 'Competition', 'Growth Potential', 'Market Size'],
      riskTolerance: 'low',
      dataSource: ['Market Research', 'Competitor Analysis', 'Industry Reports', 'Finro Valuations', 'Datarade APIs'],
      customPrompt: 'Evaluate market position, competitive landscape, and growth opportunities in the target market.'
    },
    threatAnalyst: {
      name: 'Threat Analyst',
      focusAreas: ['Security Posture', 'Threat Landscape', 'Vulnerabilities', 'Compliance'],
      riskTolerance: 'high',
      dataSource: ['Threat Intelligence', 'Security Reports', 'Vulnerability Databases', 'GrowthList Security', 'SEC Filings'],
      customPrompt: 'Assess cybersecurity risks, threat landscape, and security posture of the target company.'
    },
    financialAnalyst: {
      name: 'Financial Analyst',
      focusAreas: ['Financial Health', 'Revenue Growth', 'Funding Status', 'Profitability'],
      riskTolerance: 'low',
      dataSource: ['Financial Reports', 'Funding Data', 'Revenue Analytics', 'Intellizence Funding', 'Crunchbase Financials'],
      customPrompt: 'Analyze financial performance, funding history, and revenue potential of the target company.'
    },
    patentAnalyst: {
      name: 'Patent Analyst',
      focusAreas: ['IP Portfolio', 'Patent Strategy', 'Innovation Pipeline', 'Competitive IP'],
      riskTolerance: 'medium',
      dataSource: ['Patent Databases', 'IP Filings', 'Innovation Reports', 'SEC EDGAR Patents', 'OpenVC Investor Data'],
      customPrompt: 'Evaluate intellectual property portfolio, patent strategy, and innovation capabilities.'
    }
  }

  useEffect(() => {
    setMounted(true)
    loadAgentConfig()
  }, [agentId])

  const loadAgentConfig = async () => {
    try {
      // Load existing config or create default
      const defaultConfig = defaultConfigs[agentId]
      const newConfig: AgentConfig = {
        id: agentId,
        name: defaultConfig?.name || 'AI Agent',
        active: true,
        confidence: 85,
        analysisDepth: 7,
        updateFrequency: 5,
        focusAreas: defaultConfig?.focusAreas || [],
        riskTolerance: defaultConfig?.riskTolerance || 'medium',
        dataSource: defaultConfig?.dataSource || [],
        customPrompt: defaultConfig?.customPrompt || '',
        lastRun: new Date().toISOString(),
        performance: {
          accuracy: 92,
          speed: 1.3,
          insights: 15
        }
      }
      setConfig(newConfig)
    } catch (error) {
      console.error('Failed to load agent config:', error)
    }
  }

  const updateConfig = (updates: Partial<AgentConfig>) => {
    if (!config) return
    
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const runAgent = async () => {
    if (!config) return
    
    setIsRunning(true)
    setLoading(true)
    
    try {
      // Simulate agent execution
      const response = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run-agent',
          agentId: config.id,
          config: config
        })
      })
      
      const result = await response.json()
      setLastResult(result)
      
      // Update performance metrics
      updateConfig({
        lastRun: new Date().toISOString(),
        performance: {
          accuracy: Math.min(100, config.performance.accuracy + Math.random() * 2),
          speed: Math.max(0.5, config.performance.speed - Math.random() * 0.1),
          insights: config.performance.insights + Math.floor(Math.random() * 3)
        }
      })
      
    } catch (error) {
      console.error('Agent execution failed:', error)
    } finally {
      setIsRunning(false)
      setLoading(false)
    }
  }

  const resetConfig = () => {
    loadAgentConfig()
  }

  const saveConfig = async () => {
    if (!config) return
    
    try {
      // Save configuration to backend
      await fetch('/api/ai-agents/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      // Show success feedback
      console.log('Configuration saved successfully')
    } catch (error) {
      console.error('Failed to save configuration:', error)
    }
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Agent Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{config.name}</h3>
            <p className="text-sm text-gray-600">
              Last run: {mounted ? new Date(config.lastRun).toLocaleString() : 'Loading...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={config.active ? 'default' : 'secondary'}>
            {config.active ? 'Active' : 'Inactive'}
          </Badge>
          <Switch
            checked={config.active}
            onCheckedChange={(active) => updateConfig({ active })}
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-xl font-bold">{config.performance.accuracy.toFixed(1)}%</p>
              </div>
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Speed</p>
                <p className="text-xl font-bold">{config.performance.speed.toFixed(1)}s</p>
              </div>
              <Zap className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Insights</p>
                <p className="text-xl font-bold">{config.performance.insights}</p>
              </div>
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Basic Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="confidence">Confidence Threshold: {config.confidence}%</Label>
              <Slider
                id="confidence"
                min={50}
                max={100}
                step={5}
                value={[config.confidence]}
                onValueChange={([value]) => updateConfig({ confidence: value })}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="depth">Analysis Depth: {config.analysisDepth}/10</Label>
              <Slider
                id="depth"
                min={1}
                max={10}
                step={1}
                value={[config.analysisDepth]}
                onValueChange={([value]) => updateConfig({ analysisDepth: value })}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="frequency">Update Frequency: {config.updateFrequency} min</Label>
              <Slider
                id="frequency"
                min={1}
                max={60}
                step={1}
                value={[config.updateFrequency]}
                onValueChange={([value]) => updateConfig({ updateFrequency: value })}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="risk">Risk Tolerance</Label>
              <Select value={config.riskTolerance} onValueChange={(value: any) => updateConfig({ riskTolerance: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="focus">Focus Areas</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {config.focusAreas.map((area, index) => (
                  <Badge key={index} variant="outline">{area}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="sources">Data Sources</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {config.dataSource.map((source, index) => (
                  <Badge key={index} variant="secondary">{source}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="prompt">Custom Analysis Prompt</Label>
              <Textarea
                id="prompt"
                value={config.customPrompt}
                onChange={(e) => updateConfig({ customPrompt: e.target.value })}
                rows={3}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Actions */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={runAgent} 
          disabled={!config.active || isRunning}
          className="flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Agent
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={saveConfig}>
          <Save className="h-4 w-4 mr-2" />
          Save Config
        </Button>
        
        <Button variant="outline" onClick={resetConfig}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Last Result */}
      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Latest Analysis Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={lastResult.success ? 'default' : 'destructive'}>
                  {lastResult.success ? 'Success' : 'Failed'}
                </Badge>
              </div>
              {lastResult.data && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Insights Generated:</span>
                    <span className="font-semibold">{lastResult.data.insights || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Processing Time:</span>
                    <span className="font-semibold">{lastResult.data.processingTime || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Confidence Score:</span>
                    <span className="font-semibold">{lastResult.data.confidence || 'N/A'}%</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}