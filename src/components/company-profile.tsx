"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Building2, 
  Users, 
  Target, 
  TrendingUp, 
  Star,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  Brain,
  Shield,
  Zap,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  Lightbulb,
  FileText,
  MessageSquare
} from 'lucide-react'

interface CompanyProfileProps {
  company: {
    id: string
    company_name: string
    description?: string
    website?: string
    cybersecurity_category?: string
    funding_stage?: string
    contact_email?: string
    contact_name?: string
    booth_number?: string
    product_demo: boolean
    seeking_investment: boolean
    notes?: string
    
    // Ballistic Ventures criteria scores
    active_users_score: number
    paying_customers_score: number
    mssp_integration_score: number
    technical_innovation: number
    founder_experience: number
    market_timing_score: number
    overall_fit_score: number
    
    // Status tracking
    status: string
    last_contact_date?: string
    next_follow_up?: string
    
    convention?: {
      name: string
      location: string
      start_date: string
      end_date: string
    }
  }
  onUpdate?: (updates: any) => void
}

interface InvestmentAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  recommendations: string[]
  estimatedValuation: string
  fundingNeeds: string
  marketSize: string
  competitiveLandscape: string
}

export default function CompanyProfile({ company, onUpdate }: CompanyProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editNotes, setEditNotes] = useState(company.notes || '')
  const [editStatus, setEditStatus] = useState(company.status)
  const [editNextFollowUp, setEditNextFollowUp] = useState(company.next_follow_up || '')
  const [analysis, setAnalysis] = useState<InvestmentAnalysis | null>(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)

  const criteriaData = [
    { name: 'Active Users', score: company.active_users_score, icon: <Users className="h-4 w-4" />, description: 'User engagement and adoption' },
    { name: 'Paying Customers', score: company.paying_customers_score, icon: <DollarSign className="h-4 w-4" />, description: 'Revenue generation capability' },
    { name: 'MSSP Integration', score: company.mssp_integration_score, icon: <Shield className="h-4 w-4" />, description: 'MSSP partnership potential' },
    { name: 'Technical Innovation', score: company.technical_innovation, icon: <Brain className="h-4 w-4" />, description: 'Technology uniqueness' },
    { name: 'Founder Experience', score: company.founder_experience, icon: <Star className="h-4 w-4" />, description: 'Team expertise and background' },
    { name: 'Market Timing', score: company.market_timing_score, icon: <TrendingUp className="h-4 w-4" />, description: 'Market readiness and timing' }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      prospect: { label: 'Prospect', variant: 'secondary' as const, icon: <Target className="h-3 w-3" /> },
      contacted: { label: 'Contacted', variant: 'outline' as const, icon: <Mail className="h-3 w-3" /> },
      meeting: { label: 'Meeting', variant: 'default' as const, icon: <Users className="h-3 w-3" /> },
      due_diligence: { label: 'Due Diligence', variant: 'default' as const, icon: <Brain className="h-3 w-3" /> },
      invested: { label: 'Invested', variant: 'default' as const, icon: <Award className="h-3 w-3" /> },
      passed: { label: 'Passed', variant: 'secondary' as const, icon: <AlertCircle className="h-3 w-3" /> }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.prospect
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getStageBadge = (stage: string) => {
    const stageConfig = {
      'pre-seed': { label: 'Pre-Seed', className: 'bg-purple-100 text-purple-800' },
      'seed': { label: 'Seed', className: 'bg-blue-100 text-blue-800' },
      'series-a': { label: 'Series A', className: 'bg-green-100 text-green-800' }
    }
    const config = stageConfig[stage as keyof typeof stageConfig] || stageConfig['pre-seed']
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const generateInvestmentAnalysis = async () => {
    setLoadingAnalysis(true)
    try {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze-investment-opportunity',
          data: {
            company_name: company.company_name,
            description: company.description,
            cybersecurity_category: company.cybersecurity_category,
            funding_stage: company.funding_stage,
            current_scores: {
              active_users_score: company.active_users_score,
              paying_customers_score: company.paying_customers_score,
              mssp_integration_score: company.mssp_integration_score,
              technical_innovation: company.technical_innovation,
              founder_experience: company.founder_experience,
              market_timing_score: company.market_timing_score
            }
          }
        })
      })

      const result = await response.json()
      if (result.success) {
        setAnalysis(result.data)
      }
    } catch (error) {
      console.error('Error generating analysis:', error)
    } finally {
      setLoadingAnalysis(false)
    }
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        notes: editNotes,
        status: editStatus,
        next_follow_up: editNextFollowUp
      })
    }
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{company.company_name}</CardTitle>
                {getStageBadge(company.funding_stage || '')}
                {getStatusBadge(company.status)}
              </div>
              <CardDescription className="text-base">
                {company.description}
              </CardDescription>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {company.convention && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {company.convention.name}
                  </div>
                )}
                {company.booth_number && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    Booth {company.booth_number}
                  </div>
                )}
                {company.contact_name && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {company.contact_name}
                  </div>
                )}
                {company.contact_email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {company.contact_email}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(company.overall_fit_score)}`}>
                {company.overall_fit_score}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Fit Score</div>
              <div className="mt-2">
                {company.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(company.website, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Website
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Investment Analysis</TabsTrigger>
          <TabsTrigger value="criteria">Ballistic Criteria</TabsTrigger>
          <TabsTrigger value="tracking">Deal Tracking</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Investment Analysis
              </CardTitle>
              <CardDescription>
                Comprehensive analysis for Ballistic Ventures investment consideration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!analysis ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Generate AI-powered investment analysis for this company
                  </p>
                  <Button onClick={generateInvestmentAnalysis} disabled={loadingAnalysis}>
                    {loadingAnalysis ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate Analysis
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Est. Valuation</span>
                        </div>
                        <div className="text-lg font-bold">{analysis.estimatedValuation}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Funding Needs</span>
                        </div>
                        <div className="text-lg font-bold">{analysis.fundingNeeds}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Market Size</span>
                        </div>
                        <div className="text-lg font-bold">{analysis.marketSize}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* SWOT Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          Weaknesses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-600" />
                          Opportunities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.opportunities.map((opportunity, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{opportunity}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Shield className="h-5 w-5 text-orange-600" />
                          Threats
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.threats.map((threat, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Shield className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{threat}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        Investment Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Ballistic Ventures Investment Criteria
              </CardTitle>
              <CardDescription>
                Detailed breakdown of how this company matches Ballistic Ventures' investment criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                {criteriaData.map((criterion) => (
                  <div key={criterion.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {criterion.icon}
                        <span className="font-medium">{criterion.name}</span>
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(criterion.score)}`}>
                        {criterion.score}%
                      </div>
                    </div>
                    <Progress value={criterion.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">{criterion.description}</p>
                  </div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Overall Fit Score</span>
                      <div className={`text-2xl font-bold ${getScoreColor(company.overall_fit_score)}`}>
                        {company.overall_fit_score}%
                      </div>
                    </div>
                    <Progress value={company.overall_fit_score} className="h-3" />
                    <div className="text-sm text-muted-foreground">
                      {company.overall_fit_score >= 80 && 'Excellent fit for Ballistic Ventures portfolio'}
                      {company.overall_fit_score >= 60 && company.overall_fit_score < 80 && 'Good potential with some areas for improvement'}
                      {company.overall_fit_score < 60 && 'May not meet current investment criteria'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Deal Tracking & Notes
              </CardTitle>
              <CardDescription>
                Track progress and maintain notes for this investment opportunity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <Select value={editStatus} onValueChange={setEditStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prospect">Prospect</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="due_diligence">Due Diligence</SelectItem>
                          <SelectItem value="invested">Invested</SelectItem>
                          <SelectItem value="passed">Passed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Next Follow-up</label>
                      <Input
                        type="datetime-local"
                        value={editNextFollowUp}
                        onChange={(e) => setEditNextFollowUp(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes</label>
                    <Textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add notes about this company, meetings, or due diligence findings..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Status</label>
                      <div>{getStatusBadge(company.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Next Follow-up</label>
                      <div className="text-sm">
                        {company.next_follow_up ? (
                          new Date(company.next_follow_up).toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground">Not scheduled</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Notes</label>
                    <div className="text-sm bg-muted p-3 rounded-md min-h-[100px]">
                      {company.notes || (
                        <span className="text-muted-foreground">No notes added yet</span>
                      )}
                    </div>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Edit Tracking
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Advanced AI analysis and market intelligence for this investment opportunity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  AI insights will be available after generating the investment analysis
                </p>
                <Button onClick={generateInvestmentAnalysis} disabled={loadingAnalysis}>
                  {loadingAnalysis ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Insights
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}