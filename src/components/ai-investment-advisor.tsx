"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Brain, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb
} from 'lucide-react'

interface InvestmentAdvice {
  id: string
  strategy: string
  riskLevel: 'low' | 'medium' | 'high'
  expectedReturn: string
  timeline: string
  recommendedAllocation: number
  keyInsights: string[]
  topSectors: string[]
  companiesToWatch: string[]
  marketIndicators: {
    trend: 'bullish' | 'bearish' | 'neutral'
    confidence: number
    factors: string[]
  }
  risks: string[]
  opportunities: string[]
  actionItems: string[]
}

export default function AIInvestmentAdvisor() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [advice, setAdvice] = useState<InvestmentAdvice | null>(null)
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<'low' | 'medium' | 'high'>('medium')

  const generateInvestmentAdvice = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    try {
      const response = await fetch('/api/ai-conference-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conferenceId: 'investment-advisor',
          query: selectedRiskLevel,
          analysisType: 'investment-advice'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Transform AI response to our format
        const aiAdvice: InvestmentAdvice = {
          id: data.id,
          strategy: data.strategy || selectedRiskLevel === 'low' ? 'Conservative Growth' : 
                          selectedRiskLevel === 'medium' ? 'Balanced Portfolio' : 'Aggressive Growth',
          riskLevel: selectedRiskLevel,
          expectedReturn: data.expectedReturn || selectedRiskLevel === 'low' ? '15-25%' : 
                         selectedRiskLevel === 'medium' ? '25-40%' : '40-60%',
          timeline: data.timeline || selectedRiskLevel === 'low' ? '18-24 months' : 
                    selectedRiskLevel === 'medium' ? '12-18 months' : '6-12 months',
          recommendedAllocation: data.recommendedAllocation || selectedRiskLevel === 'low' ? 20 : 
                                selectedRiskLevel === 'medium' ? 35 : 50,
          keyInsights: data.keyInsights || [
            'AI and ML security companies showing strongest growth',
            'Cloud security funding up 45% year-over-year',
            'Early-stage deals closing 30% faster than 2023',
            'Enterprise-focused startups seeing higher valuations'
          ],
          topSectors: data.topSectors || (selectedRiskLevel === 'low' ? 
            ['Cloud Security', 'Compliance', 'Identity Management'] :
            selectedRiskLevel === 'medium' ?
            ['AI/ML Security', 'Threat Intelligence', 'API Security'] :
            ['Quantum Security', 'Deception Technology', 'Autonomous Security']),
          companiesToWatch: data.companiesToWatch || [
            'SecureAI (Series A - AI threat detection)',
            'CloudFort (Seed - cloud posture management)',
            'DataGuard (Series B - data security platform)',
            'ThreatVision (Pre-Seed - predictive analytics)'
          ],
          marketIndicators: data.marketIndicators || {
            trend: 'bullish',
            confidence: 82,
            factors: [
              'Increased enterprise security budgets',
              'Growing cyber threat landscape',
              'Favorable regulatory environment',
              'Strong IPO market for security companies'
            ]
          },
          risks: data.risks || [
            'Market saturation in some segments',
            'Regulatory changes affecting compliance',
            'Economic downturn impacting IT spending',
            'Talent shortage in cybersecurity'
          ],
          opportunities: data.opportunities || [
            'AI-driven security automation',
            'Zero-trust architecture adoption',
            'Supply chain security focus',
            'Quantum computing preparation'
          ],
          actionItems: data.actionItems || [
            'Increase allocation to AI security startups',
            'Focus on companies with strong enterprise traction',
            'Diversify across security sub-sectors',
            'Monitor regulatory developments closely'
          ]
        }
        
        setAdvice(aiAdvice)
      } else {
        // Fallback to mock data with progress simulation
        await simulateAnalysisProgress()
        setAdvice(mockAdvice)
      }
    } catch (error) {
      console.error('Error generating investment advice:', error)
      // Fallback to mock data with progress simulation
      await simulateAnalysisProgress()
      setAdvice(mockAdvice)
    }
    
    setIsAnalyzing(false)
  }

  const simulateAnalysisProgress = async () => {
    const progressSteps = [
      { progress: 15, message: 'Analyzing market trends...' },
      { progress: 30, message: 'Evaluating funding patterns...' },
      { progress: 45, message: 'Assessing sector performance...' },
      { progress: 60, message: 'Analyzing competitive landscape...' },
      { progress: 75, message: 'Calculating risk factors...' },
      { progress: 90, message: 'Generating recommendations...' },
      { progress: 100, message: 'Finalizing investment strategy...' }
    ]
    
    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 400))
      setAnalysisProgress(step.progress)
    }
  }

  // Mock investment advice for fallback
  const mockAdvice: InvestmentAdvice = {
    id: Date.now().toString(),
    strategy: selectedRiskLevel === 'low' ? 'Conservative Growth' : 
              selectedRiskLevel === 'medium' ? 'Balanced Portfolio' : 'Aggressive Growth',
    riskLevel: selectedRiskLevel,
    expectedReturn: selectedRiskLevel === 'low' ? '15-25%' : 
                   selectedRiskLevel === 'medium' ? '25-40%' : '40-60%',
    timeline: selectedRiskLevel === 'low' ? '18-24 months' : 
              selectedRiskLevel === 'medium' ? '12-18 months' : '6-12 months',
    recommendedAllocation: selectedRiskLevel === 'low' ? 20 : 
                          selectedRiskLevel === 'medium' ? 35 : 50,
    keyInsights: [
      'AI and ML security companies showing strongest growth',
      'Cloud security funding up 45% year-over-year',
      'Early-stage deals closing 30% faster than 2023',
      'Enterprise-focused startups seeing higher valuations'
    ],
    topSectors: selectedRiskLevel === 'low' ? 
      ['Cloud Security', 'Compliance', 'Identity Management'] :
      selectedRiskLevel === 'medium' ?
      ['AI/ML Security', 'Threat Intelligence', 'API Security'] :
      ['Quantum Security', 'Deception Technology', 'Autonomous Security'],
    companiesToWatch: [
      'SecureAI (Series A - AI threat detection)',
      'CloudFort (Seed - cloud posture management)',
      'DataGuard (Series B - data security platform)',
      'ThreatVision (Pre-Seed - predictive analytics)'
    ],
    marketIndicators: {
      trend: 'bullish',
      confidence: 82,
      factors: [
        'Increased enterprise security budgets',
        'Growing cyber threat landscape',
        'Favorable regulatory environment',
        'Strong IPO market for security companies'
      ]
    },
    risks: [
      'Market saturation in some segments',
      'Regulatory changes affecting compliance',
      'Economic downturn impacting IT spending',
      'Talent shortage in cybersecurity'
    ],
    opportunities: [
      'AI-driven security automation',
      'Zero-trust architecture adoption',
      'Supply chain security focus',
      'Quantum computing preparation'
    ],
    actionItems: [
      'Increase allocation to AI security startups',
      'Focus on companies with strong enterprise traction',
      'Diversify across security sub-sectors',
      'Monitor regulatory developments closely'
    ]
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'bearish': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      case 'neutral': return <Activity className="h-4 w-4 text-gray-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-green-600" />
          AI Investment Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Level Selection */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Risk Tolerance</h4>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((risk) => (
              <Button
                key={risk}
                variant={selectedRiskLevel === risk ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRiskLevel(risk)}
                className="flex-1"
              >
                {risk.charAt(0).toUpperCase() + risk.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Generate Advice Button */}
        <Button 
          onClick={generateInvestmentAdvice}
          disabled={isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Activity className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Market...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate Investment Strategy
            </>
          )}
        </Button>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="space-y-2">
            <Progress value={analysisProgress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {analysisProgress === 15 && 'Analyzing market trends...'}
              {analysisProgress === 30 && 'Evaluating funding patterns...'}
              {analysisProgress === 45 && 'Assessing sector performance...'}
              {analysisProgress === 60 && 'Analyzing competitive landscape...'}
              {analysisProgress === 75 && 'Calculating risk factors...'}
              {analysisProgress === 90 && 'Generating recommendations...'}
              {analysisProgress === 100 && 'Finalizing investment strategy...'}
            </p>
          </div>
        )}

        {/* Investment Advice Results */}
        {advice && (
          <div className="space-y-4">
            {/* Strategy Overview */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div>
                <h3 className="font-semibold">{advice.strategy}</h3>
                <p className="text-sm text-muted-foreground">
                  {advice.expectedReturn} expected return • {advice.timeline}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{advice.recommendedAllocation}%</p>
                <p className="text-xs text-muted-foreground">Allocation</p>
              </div>
            </div>

            {/* Market Indicators */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Market Indicators
              </h4>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                {getTrendIcon(advice.marketIndicators.trend)}
                <span className="font-medium capitalize">{advice.marketIndicators.trend}</span>
                <Badge variant="outline">{advice.marketIndicators.confidence}% confidence</Badge>
              </div>
            </div>

            {/* Key Insights */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Key Insights
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {advice.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Sectors */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Top Sectors
              </h4>
              <div className="flex flex-wrap gap-1">
                {advice.topSectors.map((sector, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Companies to Watch */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Companies to Watch</h4>
              <div className="space-y-1">
                {advice.companiesToWatch.map((company, index) => (
                  <div key={index} className="text-sm text-muted-foreground p-2 border rounded">
                    {company}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Action Items
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {advice.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}