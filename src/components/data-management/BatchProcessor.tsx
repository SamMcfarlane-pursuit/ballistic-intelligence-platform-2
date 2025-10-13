'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Zap,
  BarChart3,
  Clock,
  Target
} from 'lucide-react'
import { SecureButton, SecureActionButton } from '@/components/ui/secure-button'

interface BatchItem {
  id: string
  title: string
  text: string
  source: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  result?: any
  confidence?: number
}

interface BatchProcessorProps {
  onBatchComplete: (results: any[]) => void
}

export default function BatchProcessor({ onBatchComplete }: BatchProcessorProps) {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentItem, setCurrentItem] = useState(0)
  const [batchInput, setBatchInput] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Enhanced batch processing samples
  const batchSamples = [
    {
      title: "AI Threat Detection Funding",
      text: "CyberShield AI raises $15M Series A led by Ballistic Ventures for AI-powered threat detection platform",
      source: "TechCrunch"
    },
    {
      title: "Cloud Security Acquisition", 
      text: "CloudGuard Security acquired by Microsoft for $2.1B, expanding Azure security capabilities",
      source: "Press Release"
    },
    {
      title: "Identity Management IPO",
      text: "SecureID announces IPO filing, targeting $500M raise for identity and access management platform",
      source: "SEC Filing"
    }
  ]

  const parseBatchInput = (input: string): BatchItem[] => {
    const items: BatchItem[] = []
    
    // Split by double newlines or "---" separators
    const sections = input.split(/\n\s*\n|---/).filter(section => section.trim())
    
    sections.forEach((section, index) => {
      const lines = section.trim().split('\n')
      const title = lines[0]?.replace(/^(Title:|Headline:)/i, '').trim() || `Article ${index + 1}`
      const text = lines.slice(1).join('\n').trim()
      
      if (text.length > 50) { // Only add if substantial content
        items.push({
          id: `batch-${index}-${text.slice(0, 10).replace(/\W/g, '')}`,
          title,
          text,
          source: 'Batch Input',
          status: 'pending'
        })
      }
    })
    
    return items
  }

  const loadSampleBatch = () => {
    const samples = batchSamples.map((sample, index) => ({
      id: `sample-${index}`,
      title: sample.title,
      text: sample.text,
      source: sample.source,
      status: 'pending' as const
    }))
    setBatchItems(samples)
    setBatchInput(samples.map(s => `${s.title}\n${s.text}`).join('\n\n---\n\n'))
  }

  const processBatch = async () => {
    // Input validation
    if (!batchInput.trim() && batchItems.length === 0) {
      return
    }

    // Sanitize and validate input
    const sanitizedInput = batchInput.trim().slice(0, 50000)
    if (sanitizedInput.length < 10) {
      return
    }

    if (batchItems.length === 0) {
      const items = parseBatchInput(sanitizedInput)
      if (items.length === 0) return
      
      // Limit number of items to prevent abuse
      const limitedItems = items.slice(0, 20) // Max 20 items per batch
      setBatchItems(limitedItems)
    }

    setIsProcessing(true)
    setCurrentItem(0)
    const results: any[] = []

    for (let i = 0; i < batchItems.length; i++) {
      setCurrentItem(i)
      
      // Update item status to processing
      setBatchItems(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: 'processing' } : item
      ))

      try {
        // Enhanced AI processing with better prompts
        const response = await fetch('/api/data-management', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'ai-extract-enhanced',
            data: {
              text: batchItems[i].text,
              source: batchItems[i].source,
              title: batchItems[i].title,
              batchMode: true
            }
          })
        })

        const result = await response.json()
        
        if (result.success) {
          setBatchItems(prev => prev.map((item, idx) => 
            idx === i ? { 
              ...item, 
              status: 'completed', 
              result: result.data,
              confidence: result.data.confidence 
            } : item
          ))
          results.push(result.data)
        } else {
          setBatchItems(prev => prev.map((item, idx) => 
            idx === i ? { ...item, status: 'error' } : item
          ))
        }
      } catch (error) {
        setBatchItems(prev => prev.map((item, idx) => 
          idx === i ? { ...item, status: 'error' } : item
        ))
      }

      // Small delay between items to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setIsProcessing(false)
    onBatchComplete(results)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const completedItems = batchItems.filter(item => item.status === 'completed').length
  const totalItems = batchItems.length
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Batch Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Batch Article Processing
          </CardTitle>
          <CardDescription>
            Process multiple articles at once. Separate articles with "---" or double line breaks.
            Perfect for processing 5-15 articles in one go.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <SecureActionButton 
              onClick={loadSampleBatch}
              className="flex items-center gap-2"
              debounceMs={500}
              maxClicksPerMinute={10}
            >
              <FileText className="h-4 w-4" />
              Load Sample Batch
            </SecureActionButton>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Saves 8-12 min vs individual processing
            </Badge>
          </div>

          <Textarea
            placeholder={`Paste multiple articles here, separated by "---" or double line breaks:

AI Threat Detection Funding
CyberShield AI raises $15M Series A led by Ballistic Ventures...

---

Cloud Security Acquisition
CloudGuard Security acquired by Microsoft for $2.1B...

---

Identity Management IPO
SecureID announces IPO filing, targeting $500M raise...`}
            value={batchInput}
            onChange={(e) => {
              const sanitizedValue = e.target.value.slice(0, 50000) // Limit input length
              setBatchInput(sanitizedValue)
            }}
            className="min-h-[200px] font-mono text-sm"
            maxLength={50000}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {parseBatchInput(batchInput).length} articles detected
            </div>
            <SecureButton 
              onClick={processBatch}
              loading={isProcessing}
              loadingText={isProcessing ? `Processing ${currentItem + 1}/${totalItems}` : 'Processing...'}
              disabled={!batchInput.trim() && batchItems.length === 0}
              className="flex items-center gap-2"
              debounceMs={1000}
              maxClicksPerMinute={5}
            >
              <Brain className="h-4 w-4" />
              Process Batch
            </SecureButton>
          </div>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing Progress</span>
                <span>{completedItems}/{totalItems} completed</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Current: {batchItems[currentItem]?.title || 'Processing...'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch Results */}
      {batchItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Batch Results
            </CardTitle>
            <CardDescription>
              {completedItems} of {totalItems} articles processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {batchItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.source} • {item.text.length} chars
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.confidence && (
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(item.confidence * 100)}% confidence
                      </Badge>
                    )}
                    {item.result && (
                      <Badge variant="outline" className="text-xs">
                        {item.result.name || 'Extracted'}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch Statistics */}
      {completedItems > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Batch Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedItems}</div>
                <div className="text-xs text-muted-foreground">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(batchItems.filter(i => i.confidence).reduce((acc, i) => acc + (i.confidence || 0), 0) / completedItems * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Avg Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((completedItems * 2.5))}min
                </div>
                <div className="text-xs text-muted-foreground">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {batchItems.filter(i => i.result?.investmentRecommendation === 'buy' || i.result?.investmentRecommendation === 'strong_buy').length}
                </div>
                <div className="text-xs text-muted-foreground">Investment Opps</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}