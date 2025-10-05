"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Search, 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Target,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  RefreshCw,
  X,
  Sparkles
} from 'lucide-react'

interface AnalysisResult {
  companyName: string
  found: boolean
  overview: string
  fundingAnalysis: string
  marketPosition: string
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid'
  confidence: number
  keyStrengths: string[]
  keyRisks: string[]
  marketOpportunity: string
  investmentThesis: string
}

export default function ConciseAIAnalyst() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [companyName, setCompanyName] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analysisType, setAnalysisType] = useState<'comprehensive' | 'quick'>('comprehensive')
  const [error, setError] = useState<string | null>(null)

  const conductAnalysis = async () => {
    if (!companyName.trim()) {
      setError('Please enter a company name')
      return
    }
    
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setError(null)
    setAnalysis(null)
    
    try {
      const response = await fetch('/api/ai-company-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          analysisType
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setAnalysis(data)
      } else {
        // Fallback to basic analysis
        await simulateAnalysisProgress()
        setAnalysis({
          companyName,
          found: false,
          overview: 'Company not found in database. General market analysis provided.',
          fundingAnalysis: 'No specific funding data available.',
          marketPosition: 'Unable to determine market position without company data.',
          recommendation: 'hold',
          confidence: 60,
          keyStrengths: ['Market research needed', 'Further due diligence required'],
          keyRisks: ['Limited information available', 'Unknown competitive positioning'],
          marketOpportunity: 'Cybersecurity market continues to show strong growth potential.',
          investmentThesis: 'Recommend gathering more company-specific information before making investment decision.'
        })
      }
    } catch (error) {
      console.error('Error analyzing company:', error)
      await simulateAnalysisProgress()
      setError('Analysis service temporarily unavailable. Please try again later.')
      setAnalysis({
        companyName,
        found: false,
        overview: 'Analysis service temporarily unavailable.',
        fundingAnalysis: 'Unable to access funding data.',
        marketPosition: 'Market analysis unavailable.',
        recommendation: 'hold',
        confidence: 50,
        keyStrengths: ['Service disruption'],
        keyRisks: ['Technical issues preventing analysis'],
        marketOpportunity: 'Please try again later.',
        investmentThesis: 'System maintenance in progress.'
      })
    }
    
    setIsAnalyzing(false)
  }

  const simulateAnalysisProgress = async () => {
    const steps = [
      { progress: 20, message: 'Searching database...' },
      { progress: 40, message: 'Analyzing market data...' },
      { progress: 60, message: 'Evaluating competition...' },
      { progress: 80, message: 'Generating insights...' },
      { progress: 100, message: 'Finalizing analysis...' }
    ]
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 400))
      setAnalysisProgress(step.progress)
    }
  }

  const clearAnalysis = () => {
    setAnalysis(null)
    setCompanyName('')
    setError(null)
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'strong_buy': return 'text-green-700 bg-green-50 border-green-200'
      case 'buy': return 'text-green-600 bg-green-50 border-green-200'
      case 'hold': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'avoid': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'strong_buy': return '🚀'
      case 'buy': return '📈'
      case 'hold': return '⏸️'
      case 'avoid': return '📉'
      default: return '❓'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Investment Analyst
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter company name (e.g., Mondoo, Descope, Wiz)..."
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value)
                  setError(null)
                }}
                onKeyPress={(e) => e.key === 'Enter' && conductAnalysis()}
                disabled={isAnalyzing}
                className="flex-1"
              />
              <Button 
                onClick={conductAnalysis}
                disabled={!companyName.trim() || isAnalyzing}
                size="sm"
              >
                {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
              {analysis && (
                <Button 
                  onClick={clearAnalysis}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Analysis Type Toggle */}
            <div className="flex gap-2">
              <Button
                variant={analysisType === 'quick' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAnalysisType('quick')}
                disabled={isAnalyzing}
                className="flex-1"
              >
                Quick Analysis
              </Button>
              <Button
                variant={analysisType === 'comprehensive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAnalysisType('comprehensive')}
                disabled={isAnalyzing}
                className="flex-1"
              >
                Comprehensive
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="space-y-3">
              <Progress value={analysisProgress} className="w-full h-2" />
              <p className="text-sm text-muted-foreground text-center">
                {analysisProgress === 20 && 'Searching database...'}
                {analysisProgress === 40 && 'Analyzing market data...'}
                {analysisProgress === 60 && 'Evaluating competition...'}
                {analysisProgress === 80 && 'Generating insights...'}
                {analysisProgress === 100 && 'Finalizing analysis...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card className="shadow-sm border-0">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold">{analysis.companyName}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant="outline" 
                    className={`text-sm font-medium ${getRecommendationColor(analysis.recommendation)}`}
                  >
                    {getRecommendationIcon(analysis.recommendation)} {analysis.recommendation.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className={`text-sm font-medium ${getConfidenceColor(analysis.confidence)}`}>
                    {analysis.confidence}% confidence
                  </span>
                  {analysis.found && (
                    <Badge variant="secondary" className="text-sm">
                      Found in database
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Key Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Overview</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{analysis.overview}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Funding Analysis</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{analysis.fundingAnalysis}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Market Position</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{analysis.marketPosition}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Key Strengths</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {analysis.keyStrengths.slice(0, 3).map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1 text-xs">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Key Risks</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {analysis.keyRisks.slice(0, 3).map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1 text-xs">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Investment Thesis</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{analysis.investmentThesis}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Opportunity */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-sm text-blue-900 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Market Opportunity
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">{analysis.marketOpportunity}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}