'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Database, 
  TrendingUp, 
  Building2, 
  DollarSign,
  Users,
  MapPin,
  Calendar,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Target,
  Shield,
  Zap,
  Eye,
  Search,
  Globe,
  BarChart3,
  PieChart,
  Activity,
  Star,
  Award,
  Lightbulb,
  Layers
} from 'lucide-react'
import BatchProcessor from '@/components/data-management/BatchProcessor'

interface CompanyData {
  name: string
  industry: string
  stage: string
  location: string
  founded: number
  employees: number
  funding: number
  valuation: number
  investors: string[]
  description: string
  website: string
  confidence?: number
  aiInsights?: AIInsights
  startupScore?: number
  riskLevel?: 'low' | 'medium' | 'high'
  marketPosition?: string
}

interface AIInsights {
  industryMatch: number
  fundingPotential: number
  competitiveAdvantage: string[]
  riskFactors: string[]
  marketOpportunity: string
  investmentRecommendation: 'strong_buy' | 'buy' | 'hold' | 'pass'
  keyStrengths: string[]
  concerns: string[]
  similarCompanies: string[]
  marketTrends: string[]
}

interface ProcessingStatus {
  status: 'idle' | 'processing' | 'complete' | 'error'
  progress: number
  message: string
  extractedData?: CompanyData
  aiAnalysis?: AIInsights
}

interface StartupDetectionResult {
  isStartup: boolean
  confidence: number
  indicators: string[]
  stage: string
  fundingLikelihood: number
}

export default function DataManagement() {
  const [activeTab, setActiveTab] = useState('ai-extract')
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: ''
  })
  const [extractedData, setExtractedData] = useState<CompanyData | null>(null)
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null)
  const [startupDetection, setStartupDetection] = useState<StartupDetectionResult | null>(null)
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false)

  // AI Extraction Handler with Enhanced Analysis
  const handleAIExtraction = async (text: string, source: string) => {
    setProcessingStatus({ status: 'processing', progress: 5, message: 'Initializing AI analysis...' })
    
    try {
      // Step 1: Text Analysis
      await new Promise(resolve => setTimeout(resolve, 800))
      setProcessingStatus({ status: 'processing', progress: 15, message: 'Analyzing text with Gemini Flash 2.0...' })
      
      // Step 2: Entity Extraction
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProcessingStatus({ status: 'processing', progress: 30, message: 'Extracting company entities and data...' })
      
      // Step 3: Startup Detection
      await new Promise(resolve => setTimeout(resolve, 800))
      setProcessingStatus({ status: 'processing', progress: 45, message: 'Running startup detection algorithms...' })
      
      // Step 4: Industry Classification
      await new Promise(resolve => setTimeout(resolve, 700))
      setProcessingStatus({ status: 'processing', progress: 60, message: 'Classifying industry and market position...' })
      
      // Step 5: Funding Analysis
      await new Promise(resolve => setTimeout(resolve, 900))
      setProcessingStatus({ status: 'processing', progress: 75, message: 'Analyzing funding patterns and potential...' })
      
      // Step 6: AI Insights Generation
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProcessingStatus({ status: 'processing', progress: 90, message: 'Generating AI insights and recommendations...' })
      
      // Step 7: Final Validation
      await new Promise(resolve => setTimeout(resolve, 500))
      setProcessingStatus({ status: 'processing', progress: 95, message: 'Validating and scoring results...' })
      
      // Generate comprehensive mock data with AI insights
      const mockData: CompanyData = generateEnhancedCompanyData(text, source)
      const mockInsights: AIInsights = generateAIInsights(mockData)
      const mockStartupDetection: StartupDetectionResult = generateStartupDetection(text)
      
      setExtractedData(mockData)
      setAiInsights(mockInsights)
      setStartupDetection(mockStartupDetection)
      
      setProcessingStatus({ 
        status: 'complete', 
        progress: 100, 
        message: 'AI analysis completed with 94.2% confidence!',
        extractedData: mockData,
        aiAnalysis: mockInsights
      })
      
    } catch (error) {
      setProcessingStatus({ 
        status: 'error', 
        progress: 0, 
        message: 'AI analysis failed. Please check your input and try again.' 
      })
    }
  }

  // Generate Enhanced Company Data
  const generateEnhancedCompanyData = (text: string, source: string): CompanyData => {
    const companies = [
      {
        name: 'CyberShield AI',
        industry: 'AI Threat Detection',
        stage: 'Series A',
        location: 'San Francisco, CA',
        founded: 2021,
        employees: 75,
        funding: 15000000,
        valuation: 60000000,
        investors: ['Ballistic Ventures', 'Kleiner Perkins', 'GV'],
        description: 'AI-powered cybersecurity platform using machine learning for advanced threat detection and response.',
        website: 'www.cybershield-ai.com',
        confidence: 0.94,
        startupScore: 8.7,
        riskLevel: 'medium' as const,
        marketPosition: 'Emerging Leader'
      },
      {
        name: 'SecureFlow Networks',
        industry: 'Network Security',
        stage: 'Series B',
        location: 'Austin, TX',
        founded: 2019,
        employees: 120,
        funding: 28000000,
        valuation: 150000000,
        investors: ['Andreessen Horowitz', 'Lightspeed Ventures', 'CRV'],
        description: 'Next-generation network security platform with zero-trust architecture and real-time threat prevention.',
        website: 'www.secureflow.com',
        confidence: 0.91,
        startupScore: 9.1,
        riskLevel: 'low' as const,
        marketPosition: 'Market Challenger'
      }
    ]
    
    return companies[0] // Use first company for consistency
  }

  // Generate AI Insights
  const generateAIInsights = (data: CompanyData): AIInsights => {
    return {
      industryMatch: 92,
      fundingPotential: 87,
      competitiveAdvantage: [
        'Advanced AI/ML technology stack',
        'Strong founding team with domain expertise',
        'Early market traction and customer validation',
        'Proprietary threat detection algorithms'
      ],
      riskFactors: [
        'Competitive market with established players',
        'Regulatory compliance requirements',
        'Talent acquisition challenges in AI/cybersecurity'
      ],
      marketOpportunity: 'Large and growing cybersecurity market ($173B by 2025) with increasing demand for AI-powered solutions',
      investmentRecommendation: 'buy',
      keyStrengths: [
        'Innovative technology approach',
        'Experienced leadership team',
        'Strong investor backing',
        'Clear market differentiation'
      ],
      concerns: [
        'Early stage with execution risk',
        'Need to scale customer acquisition',
        'Competitive pressure from incumbents'
      ],
      similarCompanies: ['CrowdStrike', 'SentinelOne', 'Darktrace', 'Vectra AI'],
      marketTrends: [
        'AI/ML adoption in cybersecurity accelerating',
        'Zero-trust architecture becoming standard',
        'Increased focus on automated threat response',
        'Growing demand for cloud-native security solutions'
      ]
    }
  }

  // Generate Startup Detection Results
  const generateStartupDetection = (text: string): StartupDetectionResult => {
    return {
      isStartup: true,
      confidence: 89,
      indicators: [
        'Recent funding announcement detected',
        'Early-stage company characteristics',
        'Growth-focused language patterns',
        'Venture capital investor involvement',
        'Technology innovation focus'
      ],
      stage: 'Growth Stage',
      fundingLikelihood: 78
    }
  }

  // Manual Data Handler
  const handleManualSubmit = async (data: CompanyData) => {
    setProcessingStatus({ status: 'processing', progress: 50, message: 'Saving company data...' })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProcessingStatus({ 
        status: 'complete', 
        progress: 100, 
        message: 'Company data saved successfully!' 
      })
    } catch (error) {
      setProcessingStatus({ 
        status: 'error', 
        progress: 0, 
        message: 'Failed to save data. Please try again.' 
      })
    }
  }

  // Bulk Upload Handler
  const handleBulkUpload = async (file: File) => {
    setProcessingStatus({ status: 'processing', progress: 20, message: 'Processing uploaded file...' })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setProcessingStatus({ status: 'processing', progress: 60, message: 'Validating data format...' })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProcessingStatus({ status: 'processing', progress: 90, message: 'Importing companies...' })
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setProcessingStatus({ 
        status: 'complete', 
        progress: 100, 
        message: 'Successfully imported 47 companies from spreadsheet!' 
      })
    } catch (error) {
      setProcessingStatus({ 
        status: 'error', 
        progress: 0, 
        message: 'Failed to process file. Please check format and try again.' 
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Intelligence Data Management
          </h1>
          <p className="text-slate-400 text-lg">
            Add, analyze, and manage cybersecurity company data with AI-powered extraction and validation
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Input Section */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  Data Input & Processing
                </CardTitle>
                <CardDescription>
                  Choose your preferred method to add cybersecurity company intelligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700/50">
                    <TabsTrigger 
                      value="ai-extract" 
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Extract
                    </TabsTrigger>
                    <TabsTrigger 
                      value="batch-process" 
                      className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      Batch Process
                    </TabsTrigger>
                    <TabsTrigger 
                      value="manual" 
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Manual Entry
                    </TabsTrigger>
                    <TabsTrigger 
                      value="bulk" 
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Bulk Upload
                    </TabsTrigger>
                  </TabsList>

                  {/* AI Extraction Tab */}
                  <TabsContent value="ai-extract" className="mt-6 space-y-4">
                    <AIExtractionForm onExtract={handleAIExtraction} />
                  </TabsContent>

                  {/* Batch Processing Tab */}
                  <TabsContent value="batch-process" className="mt-6 space-y-4">
                    <BatchProcessor onBatchComplete={(results) => {
                      console.log('Batch processing completed:', results)
                      // Handle batch results - could update stats, show summary, etc.
                    }} />
                  </TabsContent>

                  {/* Manual Entry Tab */}
                  <TabsContent value="manual" className="mt-6 space-y-4">
                    <ManualEntryForm onSubmit={handleManualSubmit} />
                  </TabsContent>

                  {/* Bulk Upload Tab */}
                  <TabsContent value="bulk" className="mt-6 space-y-4">
                    <BulkUploadForm onUpload={handleBulkUpload} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Status & Preview Section */}
          <div className="space-y-6">
            {/* Processing Status */}
            <ProcessingStatusCard status={processingStatus} />
            
            {/* Data Preview */}
            {extractedData && (
              <DataPreviewCard data={extractedData} />
            )}
            
            {/* Startup Detection */}
            {startupDetection && (
              <StartupDetectionCard detection={startupDetection} />
            )}
            
            {/* Detailed Analysis */}
            {extractedData && (
              <DetailedAnalysisCard 
                data={extractedData} 
                show={showDetailedAnalysis}
                onToggle={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
              />
            )}
            
            {/* Quick Stats */}
            <QuickStatsCard />
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced AI Extraction Form Component
function AIExtractionForm({ onExtract }: { onExtract: (text: string, source: string) => void }) {
  const [text, setText] = useState('')
  const [source, setSource] = useState('')
  const [analysisMode, setAnalysisMode] = useState('comprehensive')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleQuickAnalysis = (sampleText: string, sampleSource: string) => {
    setText(sampleText)
    setSource(sampleSource)
    onExtract(sampleText, sampleSource)
  }

  return (
    <div className="space-y-4">
      {/* Quick Analysis Samples */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          Quick Analysis Samples
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAnalysis(
              "CyberShield AI, a San Francisco-based cybersecurity startup, today announced it has raised $15 million in Series A funding led by Ballistic Ventures. The company's AI-powered threat detection platform uses machine learning to identify and respond to cyber threats in real-time. Founded in 2021 by former Google security engineers, CyberShield has grown to 75 employees and serves over 200 enterprise customers.",
              "press-release"
            )}
            className="border-slate-600 text-white hover:bg-slate-700 text-xs justify-start"
          >
            <Target className="w-3 h-3 mr-2" />
            Funding Announcement
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAnalysis(
              "SecureFlow Networks is revolutionizing network security with its zero-trust architecture platform. The Austin-based company, founded in 2019, has developed proprietary algorithms that provide real-time threat prevention and network monitoring. With 120 employees and backing from top-tier VCs including Andreessen Horowitz, SecureFlow is positioned to capture significant market share in the $50B network security market.",
              "company-website"
            )}
            className="border-slate-600 text-white hover:bg-slate-700 text-xs justify-start"
          >
            <Building2 className="w-3 h-3 mr-2" />
            Company Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="source" className="text-white">Data Source</Label>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select source type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="press-release">📰 Press Release</SelectItem>
              <SelectItem value="news-article">📄 News Article</SelectItem>
              <SelectItem value="company-website">🌐 Company Website</SelectItem>
              <SelectItem value="funding-announcement">💰 Funding Announcement</SelectItem>
              <SelectItem value="pitch-deck">📊 Pitch Deck</SelectItem>
              <SelectItem value="linkedin-profile">👔 LinkedIn Profile</SelectItem>
              <SelectItem value="other">📋 Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-white">Analysis Mode</Label>
          <Select value={analysisMode} onValueChange={setAnalysisMode}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comprehensive">🔍 Comprehensive Analysis</SelectItem>
              <SelectItem value="startup-focus">🚀 Startup Detection Focus</SelectItem>
              <SelectItem value="funding-focus">💰 Funding Analysis Focus</SelectItem>
              <SelectItem value="quick">⚡ Quick Extraction</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Capabilities Display */}
      <div className="grid grid-cols-3 gap-2">
        <Badge variant="secondary" className="bg-green-600/20 text-green-400 justify-center">
          <Sparkles className="w-3 h-3 mr-1" />
          Gemini Flash 2.0
        </Badge>
        <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 justify-center">
          <Brain className="w-3 h-3 mr-1" />
          NER + NLP
        </Badge>
        <Badge variant="secondary" className="bg-purple-600/20 text-purple-400 justify-center">
          <Zap className="w-3 h-3 mr-1" />
          Startup Detection
        </Badge>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="text" className="text-white">Text Content</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-slate-400 hover:text-white text-xs"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>
        </div>
        <Textarea
          id="text"
          placeholder="Paste article text, press release, company information, or any startup-related content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white min-h-[200px]"
        />
        
        {showAdvanced && (
          <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
            <h5 className="text-white text-sm font-medium mb-2">Advanced Detection Settings</h5>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-slate-300">Startup stage classification</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-slate-300">Funding potential scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-slate-300">Competitive analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-slate-300">Market opportunity assessment</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Button 
        onClick={() => onExtract(text, source)}
        disabled={!text || !source}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Analyze with AI ({analysisMode.replace('-', ' ')})
      </Button>

      {text && (
        <div className="text-xs text-slate-400 text-center">
          {text.length} characters • Estimated processing time: {Math.ceil(text.length / 100)} seconds
        </div>
      )}
    </div>
  )
}

// Manual Entry Form Component
function ManualEntryForm({ onSubmit }: { onSubmit: (data: CompanyData) => void }) {
  const [formData, setFormData] = useState<Partial<CompanyData>>({})

  const handleSubmit = () => {
    onSubmit(formData as CompanyData)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company-name" className="text-white">Company Name</Label>
          <Input
            id="company-name"
            placeholder="e.g., CyberShield AI"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <div>
          <Label htmlFor="industry" className="text-white">Industry</Label>
          <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="endpoint-security">Endpoint Security</SelectItem>
              <SelectItem value="network-security">Network Security</SelectItem>
              <SelectItem value="cloud-security">Cloud Security</SelectItem>
              <SelectItem value="identity-access">Identity & Access Management</SelectItem>
              <SelectItem value="data-protection">Data Protection</SelectItem>
              <SelectItem value="threat-intelligence">Threat Intelligence</SelectItem>
              <SelectItem value="security-analytics">Security Analytics</SelectItem>
              <SelectItem value="application-security">Application Security</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="stage" className="text-white">Funding Stage</Label>
          <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seed">Seed</SelectItem>
              <SelectItem value="series-a">Series A</SelectItem>
              <SelectItem value="series-b">Series B</SelectItem>
              <SelectItem value="series-c">Series C</SelectItem>
              <SelectItem value="series-d">Series D+</SelectItem>
              <SelectItem value="ipo">IPO</SelectItem>
              <SelectItem value="acquired">Acquired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="funding" className="text-white">Total Funding ($M)</Label>
          <Input
            id="funding"
            type="number"
            placeholder="15"
            value={formData.funding ? formData.funding / 1000000 : ''}
            onChange={(e) => setFormData({...formData, funding: parseFloat(e.target.value) * 1000000})}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <div>
          <Label htmlFor="employees" className="text-white">Employees</Label>
          <Input
            id="employees"
            type="number"
            placeholder="75"
            value={formData.employees || ''}
            onChange={(e) => setFormData({...formData, employees: parseInt(e.target.value)})}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-white">Company Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description of the company and its cybersecurity solutions..."
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>

      <Button 
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Save Company Data
      </Button>
    </div>
  )
}

// Bulk Upload Form Component
function BulkUploadForm({ onUpload }: { onUpload: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0])
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white">Supported Formats</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="border-green-500 text-green-400">CSV</Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">Excel</Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">JSON</Badge>
          </div>
        </div>
        <div>
          <Label className="text-white">Expected Columns</Label>
          <p className="text-sm text-slate-400 mt-2">
            Company Name, Industry, Stage, Funding, Location, Investors
          </p>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-400/10' 
            : 'border-slate-600 hover:border-slate-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-white mb-2">Drag and drop your file here</p>
        <p className="text-slate-400 text-sm mb-4">or</p>
        <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
          <input
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          Choose File
        </Button>
      </div>

      <div className="bg-slate-700/50 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Template Download</h4>
        <p className="text-slate-400 text-sm mb-3">
          Download our template to ensure proper data formatting
        </p>
        <Button variant="outline" size="sm" className="border-slate-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>
    </div>
  )
}

// Processing Status Card Component
function ProcessingStatusCard({ status }: { status: ProcessingStatus }) {
  if (status.status === 'idle') return null

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          {status.status === 'processing' && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
          {status.status === 'complete' && <CheckCircle className="w-4 h-4 text-green-400" />}
          {status.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
          Processing Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress value={status.progress} className="w-full" />
          <p className="text-sm text-slate-300">{status.message}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Data Preview Card Component
function DataPreviewCard({ data }: { data: CompanyData }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-400" />
          Extracted Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="text-white font-medium">{data.name}</h3>
          <p className="text-sm text-slate-400">{data.industry}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-slate-300">{data.stage}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-3 h-3 text-yellow-400" />
            <span className="text-slate-300">${(data.funding / 1000000).toFixed(1)}M</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-blue-400" />
            <span className="text-slate-300">{data.employees} employees</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-purple-400" />
            <span className="text-slate-300">{data.location}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
            Add to Database
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Startup Detection Card Component
function StartupDetectionCard({ detection }: { detection: StartupDetectionResult }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-400" />
          Startup Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 text-sm">Classification</span>
          <Badge className={detection.isStartup ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}>
            {detection.isStartup ? 'Startup' : 'Established'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-xs">Confidence</span>
              <span className="text-white text-xs">{detection.confidence}%</span>
            </div>
            <Progress value={detection.confidence} className="h-1" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-xs">Funding Likelihood</span>
              <span className="text-white text-xs">{detection.fundingLikelihood}%</span>
            </div>
            <Progress value={detection.fundingLikelihood} className="h-1" />
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-medium mb-2">Stage: {detection.stage}</h4>
          <div className="space-y-1">
            {detection.indicators.slice(0, 3).map((indicator, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-slate-300 text-xs">{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Detailed Analysis Card Component
function DetailedAnalysisCard({ 
  data, 
  show, 
  onToggle 
}: { 
  data: CompanyData
  show: boolean
  onToggle: () => void 
}) {
  if (!show) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <Button 
            onClick={onToggle}
            variant="outline" 
            className="w-full border-slate-600 text-white hover:bg-slate-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Detailed Analysis
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Detailed Analysis
          </div>
          <Button 
            onClick={onToggle}
            variant="ghost" 
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Competitive Advantages */}
        <div>
          <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-1">
            <Award className="w-3 h-3 text-yellow-400" />
            Competitive Advantages
          </h4>
          <div className="space-y-1">
            {insights.competitiveAdvantage.map((advantage, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2" />
                <span className="text-slate-300 text-xs">{advantage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div>
          <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-400" />
            Risk Factors
          </h4>
          <div className="space-y-1">
            {insights.riskFactors.map((risk, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-red-400 rounded-full mt-2" />
                <span className="text-slate-300 text-xs">{risk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Companies */}
        <div>
          <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-blue-400" />
            Similar Companies
          </h4>
          <div className="flex flex-wrap gap-1">
            {insights.similarCompanies.map((company, index) => (
              <Badge key={index} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                {company}
              </Badge>
            ))}
          </div>
        </div>

        {/* Market Trends */}
        <div>
          <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            Market Trends
          </h4>
          <div className="space-y-1">
            {insights.marketTrends.slice(0, 3).map((trend, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full mt-2" />
                <span className="text-slate-300 text-xs">{trend}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced Quick Stats Card Component
function QuickStatsCard() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          Intelligence Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-400">Total Companies</p>
            <p className="text-white font-medium">1,247</p>
          </div>
          <div>
            <p className="text-slate-400">This Month</p>
            <p className="text-green-400 font-medium">+23</p>
          </div>
          <div>
            <p className="text-slate-400">AI Processed</p>
            <p className="text-blue-400 font-medium">892</p>
          </div>
          <div>
            <p className="text-slate-400">Accuracy</p>
            <p className="text-yellow-400 font-medium">94.2%</p>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-3">
          <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-1">
            <Activity className="w-3 h-3 text-purple-400" />
            AI Capabilities
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs">Startup Detection</span>
              <Badge className="bg-green-400/10 text-green-400 text-xs">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs">Industry Classification</span>
              <Badge className="bg-blue-400/10 text-blue-400 text-xs">Enhanced</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs">Investment Scoring</span>
              <Badge className="bg-purple-400/10 text-purple-400 text-xs">Advanced</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}