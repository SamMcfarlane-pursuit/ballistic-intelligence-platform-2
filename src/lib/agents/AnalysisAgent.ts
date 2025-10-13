/**
 * Phase 3: Analysis Agent
 * Final quality control step ensuring extracted data is accurate, verified, and reliable
 * Performs cross-verification and confidence scoring before database storage
 */

interface VerificationSource {
  url: string
  title: string
  content: string
  reliability: number // 0-1 score based on source credibility
}

interface DataDiscrepancy {
  field: string
  values: { value: any; sources: number; confidence: number }[]
  recommendation: string
}

interface ConfidenceScore {
  overall: number
  companyName: number
  amount: number
  fundingStage: number
  investors: number
  theme: number
}

interface AnalysisResult {
  verified: boolean
  confidence: ConfidenceScore
  discrepancies: DataDiscrepancy[]
  sources: VerificationSource[]
  finalData: any
  requiresManualReview: boolean
  reviewReason?: string
}

export class AnalysisAgent {
  private searchApiKey: string
  private geminiApiKey: string
  private minConfidenceThreshold = 0.75
  private minSourcesRequired = 2

  constructor(searchApiKey: string, geminiApiKey: string) {
    this.searchApiKey = searchApiKey
    this.geminiApiKey = geminiApiKey
  }

  /**
   * Main analysis function - performs quality control and verification
   */
  async analyzeProcessedData(processedData: any): Promise<AnalysisResult> {
    try {
      console.log(`Analyzing data for ${processedData.companyName}`)
      
      // Step 1: Find verification sources
      const sources = await this.findVerificationSources(processedData)
      
      // Step 2: Extract data from additional sources
      const additionalData = await this.extractFromSources(sources)
      
      // Step 3: Cross-verify data points
      const verification = await this.crossVerifyData(processedData, additionalData)
      
      // Step 4: Calculate confidence scores
      const confidence = this.calculateConfidenceScores(verification)
      
      // Step 5: Detect discrepancies
      const discrepancies = this.detectDiscrepancies(verification)
      
      // Step 6: Make final decision
      const finalResult = this.makeFinalDecision(
        processedData, 
        verification, 
        confidence, 
        discrepancies, 
        sources
      )
      
      return finalResult
    } catch (error) {
      console.error('Analysis Agent Error:', error)
      return this.createFailsafeResult(processedData, error.message)
    }
  }

  /**
   * Find additional sources to verify the funding announcement
   */
  private async findVerificationSources(data: any): Promise<VerificationSource[]> {
    const sources: VerificationSource[] = []
    
    try {
      // Search for funding announcements about this company
      const searchQueries = [
        `"${data.companyName}" funding ${data.amount} ${data.fundingStage}`,
        `"${data.companyName}" raises ${data.fundingStage}`,
        `"${data.leadInvestor}" invests "${data.companyName}"`,
        `${data.companyName} cybersecurity funding announcement`
      ]

      for (const query of searchQueries) {
        const searchResults = await this.performWebSearch(query)
        
        for (const result of searchResults.slice(0, 3)) { // Top 3 results per query
          if (this.isReliableSource(result.url)) {
            const content = await this.extractContentFromUrl(result.url)
            if (content && this.containsRelevantInfo(content, data)) {
              sources.push({
                url: result.url,
                title: result.title,
                content: content,
                reliability: this.calculateSourceReliability(result.url)
              })
            }
          }
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error('Error finding verification sources:', error)
    }
    
    return sources.slice(0, 10) // Limit to top 10 sources
  }

  /**
   * Perform web search using search API
   */
  private async performWebSearch(query: string): Promise<any[]> {
    try {
      // Using Google Custom Search API (you'll need to set this up)
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${this.searchApiKey}&cx=YOUR_SEARCH_ENGINE_ID&q=${encodeURIComponent(query)}&num=5`
      )
      
      if (!response.ok) {
        throw new Error(`Search API error: ${response.status}`)
      }
      
      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Web search failed:', error)
      return []
    }
  }

  /**
   * Check if source is reliable for funding information
   */
  private isReliableSource(url: string): boolean {
    const reliableDomains = [
      'techcrunch.com',
      'venturebeat.com',
      'crunchbase.com',
      'bloomberg.com',
      'reuters.com',
      'wsj.com',
      'forbes.com',
      'businesswire.com',
      'prnewswire.com',
      'securityweek.com',
      'darkreading.com',
      'cybersecuritydive.com'
    ]
    
    return reliableDomains.some(domain => url.includes(domain))
  }

  /**
   * Calculate source reliability score
   */
  private calculateSourceReliability(url: string): number {
    const reliabilityScores: Record<string, number> = {
      'techcrunch.com': 0.95,
      'crunchbase.com': 0.90,
      'bloomberg.com': 0.95,
      'reuters.com': 0.95,
      'wsj.com': 0.90,
      'forbes.com': 0.85,
      'venturebeat.com': 0.85,
      'businesswire.com': 0.80,
      'prnewswire.com': 0.80,
      'securityweek.com': 0.75,
      'darkreading.com': 0.75
    }
    
    for (const [domain, score] of Object.entries(reliabilityScores)) {
      if (url.includes(domain)) {
        return score
      }
    }
    
    return 0.60 // Default for other sources
  }

  /**
   * Extract content from URL (simplified - in production use proper scraping)
   */
  private async extractContentFromUrl(url: string): Promise<string | null> {
    try {
      // In production, you'd use a proper web scraping service
      // For now, return a placeholder that indicates we found the source
      return `Content from ${url} - funding announcement verified`
    } catch (error) {
      console.error(`Failed to extract content from ${url}:`, error)
      return null
    }
  }

  /**
   * Check if content contains relevant funding information
   */
  private containsRelevantInfo(content: string, data: any): boolean {
    const lowerContent = content.toLowerCase()
    const companyName = data.companyName.toLowerCase()
    
    return lowerContent.includes(companyName) && 
           (lowerContent.includes('funding') || 
            lowerContent.includes('investment') || 
            lowerContent.includes('raises') ||
            lowerContent.includes('series'))
  }

  /**
   * Extract data from verification sources using Gemini
   */
  private async extractFromSources(sources: VerificationSource[]): Promise<any[]> {
    const extractedData: any[] = []
    
    for (const source of sources) {
      try {
        const prompt = this.buildVerificationPrompt(source.content)
        const extracted = await this.callGeminiForExtraction(prompt)
        
        if (extracted) {
          extractedData.push({
            ...extracted,
            sourceUrl: source.url,
            sourceReliability: source.reliability
          })
        }
      } catch (error) {
        console.error(`Failed to extract from source ${source.url}:`, error)
      }
    }
    
    return extractedData
  }

  /**
   * Build prompt for verification data extraction
   */
  private buildVerificationPrompt(content: string): string {
    return `
Extract funding information from this text. Return JSON with these fields:
- companyName: string
- amount: number (convert to actual number)
- fundingStage: string
- leadInvestor: string
- allInvestors: string[]
- theme: string

Text:
"""
${content.slice(0, 2000)}
"""

Return only valid JSON, no additional text.
`
  }

  /**
   * Call Gemini for data extraction
   */
  private async callGeminiForExtraction(prompt: string): Promise<any | null> {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + this.geminiApiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
        })
      })

      if (!response.ok) return null

      const data = await response.json()
      const text = data.candidates[0]?.content?.parts[0]?.text
      
      if (!text) return null

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null
    } catch (error) {
      console.error('Gemini extraction failed:', error)
      return null
    }
  }

  /**
   * Cross-verify data across all sources
   */
  private crossVerifyData(originalData: any, additionalData: any[]): any {
    const allData = [originalData, ...additionalData]
    
    const verification = {
      companyName: this.verifyField(allData, 'companyName'),
      amount: this.verifyField(allData, 'amount'),
      fundingStage: this.verifyField(allData, 'fundingStage'),
      leadInvestor: this.verifyField(allData, 'leadInvestor'),
      theme: this.verifyField(allData, 'theme'),
      sourceCount: allData.length
    }
    
    return verification
  }

  /**
   * Verify a specific field across all sources
   */
  private verifyField(allData: any[], fieldName: string): any {
    const values: Record<string, { count: number; sources: any[]; reliability: number }> = {}
    
    allData.forEach((data, index) => {
      const value = data[fieldName]
      if (value) {
        const key = String(value).toLowerCase()
        if (!values[key]) {
          values[key] = { count: 0, sources: [], reliability: 0 }
        }
        values[key].count++
        values[key].sources.push(index)
        values[key].reliability += data.sourceReliability || 0.8
      }
    })
    
    return values
  }

  /**
   * Calculate confidence scores for each field
   */
  private calculateConfidenceScores(verification: any): ConfidenceScore {
    const calculateFieldConfidence = (fieldData: any): number => {
      if (!fieldData || Object.keys(fieldData).length === 0) return 0.1
      
      const values = Object.values(fieldData) as any[]
      const totalSources = verification.sourceCount
      const maxCount = Math.max(...values.map((v: any) => v.count))
      const maxReliability = Math.max(...values.map((v: any) => v.reliability))
      
      // Confidence based on consensus and source reliability
      const consensusScore = maxCount / totalSources
      const reliabilityScore = maxReliability / totalSources
      
      return Math.min(0.95, (consensusScore * 0.7) + (reliabilityScore * 0.3))
    }
    
    const scores = {
      companyName: calculateFieldConfidence(verification.companyName),
      amount: calculateFieldConfidence(verification.amount),
      fundingStage: calculateFieldConfidence(verification.fundingStage),
      leadInvestor: calculateFieldConfidence(verification.leadInvestor),
      theme: calculateFieldConfidence(verification.theme)
    }
    
    const overall = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length
    
    return { overall, ...scores }
  }

  /**
   * Detect discrepancies in the data
   */
  private detectDiscrepancies(verification: any): DataDiscrepancy[] {
    const discrepancies: DataDiscrepancy[] = []
    
    Object.entries(verification).forEach(([field, fieldData]: [string, any]) => {
      if (field === 'sourceCount') return
      
      const values = Object.entries(fieldData).map(([value, data]: [string, any]) => ({
        value,
        sources: data.count,
        confidence: data.count / verification.sourceCount
      }))
      
      if (values.length > 1) {
        // Multiple different values found
        const sortedValues = values.sort((a, b) => b.confidence - a.confidence)
        const topValue = sortedValues[0]
        
        if (topValue.confidence < 0.7) {
          discrepancies.push({
            field,
            values: sortedValues,
            recommendation: topValue.confidence > 0.5 ? 
              `Use most common value: ${topValue.value}` : 
              'Manual review required - no clear consensus'
          })
        }
      }
    })
    
    return discrepancies
  }

  /**
   * Make final decision on data verification
   */
  private makeFinalDecision(
    originalData: any,
    verification: any,
    confidence: ConfidenceScore,
    discrepancies: DataDiscrepancy[],
    sources: VerificationSource[]
  ): AnalysisResult {
    const requiresManualReview = 
      confidence.overall < this.minConfidenceThreshold ||
      sources.length < this.minSourcesRequired ||
      discrepancies.some(d => d.recommendation.includes('Manual review'))
    
    let reviewReason: string | undefined
    if (confidence.overall < this.minConfidenceThreshold) {
      reviewReason = `Low confidence score: ${confidence.overall.toFixed(2)}`
    } else if (sources.length < this.minSourcesRequired) {
      reviewReason = `Insufficient sources: ${sources.length} (minimum ${this.minSourcesRequired})`
    } else if (discrepancies.length > 0) {
      reviewReason = `Data discrepancies detected in ${discrepancies.length} fields`
    }
    
    // Create final data with most confident values
    const finalData = this.createFinalData(originalData, verification)
    
    return {
      verified: !requiresManualReview,
      confidence,
      discrepancies,
      sources,
      finalData,
      requiresManualReview,
      reviewReason
    }
  }

  /**
   * Create final data using most confident values
   */
  private createFinalData(originalData: any, verification: any): any {
    const finalData = { ...originalData }
    
    Object.entries(verification).forEach(([field, fieldData]: [string, any]) => {
      if (field === 'sourceCount') return
      
      const values = Object.entries(fieldData)
      if (values.length > 0) {
        // Use the value with highest confidence
        const bestValue = values.reduce((best, current) => {
          const [, currentData] = current as [string, any]
          const [, bestData] = best as [string, any]
          return currentData.count > bestData.count ? current : best
        })
        
        finalData[field] = bestValue[0]
      }
    })
    
    return finalData
  }

  /**
   * Create failsafe result when analysis fails
   */
  private createFailsafeResult(originalData: any, errorMessage: string): AnalysisResult {
    return {
      verified: false,
      confidence: {
        overall: 0.1,
        companyName: 0.1,
        amount: 0.1,
        fundingStage: 0.1,
        investors: 0.1,
        theme: 0.1
      },
      discrepancies: [],
      sources: [],
      finalData: originalData,
      requiresManualReview: true,
      reviewReason: `Analysis failed: ${errorMessage}`
    }
  }

  /**
   * Batch analyze multiple processed data items
   */
  async analyzeBatch(processedDataArray: any[]): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = []
    
    for (let i = 0; i < processedDataArray.length; i++) {
      try {
        console.log(`Analyzing ${i + 1}/${processedDataArray.length}`)
        const result = await this.analyzeProcessedData(processedDataArray[i])
        results.push(result)
        
        // Rate limiting between analyses
        if (i < processedDataArray.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      } catch (error) {
        console.error(`Failed to analyze item ${i + 1}:`, error)
        results.push(this.createFailsafeResult(processedDataArray[i], error.message))
      }
    }
    
    return results
  }
}

export default AnalysisAgent