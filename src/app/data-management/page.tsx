'use client'

import React, { useState } from 'react'
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
  Loader2
} from 'lucide-react'

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
}

interface ProcessingStatus {
  status: 'idle' | 'processing' | 'complete' | 'error'
  progress: number
  message: string
  extractedData?: CompanyData
}

export default function DataManagement() {
  const [activeTab, setActiveTab] = useState('ai-extract')
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: ''
  })
  const [extractedData, setExtractedData] = useState<CompanyData | null>(null)

  // AI Extraction Handler
  const handleAIExtraction = async (text: string, source: string) => {
    setProcessingStatus({ status: 'processing', progress: 10, message: 'Analyzing text with AI...' })
    
    try {
      // Simulate AI processing steps
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProcessingStatus({ status: 'processing', progress: 30, message: 'Extracting company information...' })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProcessingStatus({ status: 'processing', progress: 60, message: 'Identifying funding details...' })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProcessingStatus({ status: 'processing', progress: 90, message: 'Validating extracted data...' })
      
      // Mock extracted data
      const mockData: CompanyData = {
        name: 'CyberShield AI',
        industry: 'Cybersecurity - AI Threat Detection',
        stage: 'Series A',
        location: 'San Francisco, CA',
        founded: 2021,
        employees: 75,
        funding: 15000000,
        valuation: 60000000,
        investors: ['Ballistic Ventures', 'Kleiner Perkins', 'GV'],
        description: 'AI-powered cybersecurity platform using machine learning for advanced threat detection and response.',
        website: 'www.cybershield-ai.com'
      }
      
      setExtractedData(mockData)
      setProcessingStatus({ 
        status: 'complete', 
        progress: 100, 
        message: 'Data extraction completed successfully!',
        extractedData: mockData
      })
      
    } catch (error) {
      setProcessingStatus({ 
        status: 'error', 
        progress: 0, 
        message: 'Failed to extract data. Please try again.' 
      })
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
                  <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
                    <TabsTrigger 
                      value="ai-extract" 
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Extract
                    </TabsTrigger>
                    <TabsTrigger 
                      value="manual" 
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Manual Entry
                    </TabsTrigger>
                    <TabsTrigger 
                      value="bulk" 
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Bulk Upload
                    </TabsTrigger>
                  </TabsList>

                  {/* AI Extraction Tab */}
                  <TabsContent value="ai-extract" className="mt-6 space-y-4">
                    <AIExtractionForm onExtract={handleAIExtraction} />
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
            
            {/* Quick Stats */}
            <QuickStatsCard />
          </div>
        </div>
      </div>
    </div>
  )
}

// AI Extraction Form Component
function AIExtractionForm({ onExtract }: { onExtract: (text: string, source: string) => void }) {
  const [text, setText] = useState('')
  const [source, setSource] = useState('')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="source" className="text-white">Data Source</Label>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select source type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="press-release">Press Release</SelectItem>
              <SelectItem value="news-article">News Article</SelectItem>
              <SelectItem value="company-website">Company Website</SelectItem>
              <SelectItem value="funding-announcement">Funding Announcement</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-white">AI Processing</Label>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-600/20 text-green-400">
              <Sparkles className="w-3 h-3 mr-1" />
              Gemini Flash 2.0
            </Badge>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
              NER Enabled
            </Badge>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="text" className="text-white">Text Content</Label>
        <Textarea
          id="text"
          placeholder="Paste article text, press release, or company information here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white min-h-[200px]"
        />
      </div>
      
      <Button 
        onClick={() => onExtract(text, source)}
        disabled={!text || !source}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Extract with AI
      </Button>
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

// Quick Stats Card Component
function QuickStatsCard() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          Database Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
      </CardContent>
    </Card>
  )
}