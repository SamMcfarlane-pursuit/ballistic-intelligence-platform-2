/**
 * Integrated Workflow Agent
 * Orchestrates the complete 3-phase pipeline: Gather → Process → Analyze
 * Manages the end-to-end transformation from raw articles to verified database records
 */

import ProcessingAgent from './ProcessingAgent'
import AnalysisAgent from './AnalysisAgent'
import { CompanyProfilingAgent } from './CompanyProfilingAgent'

interface WorkflowConfig {
  geminiApiKey: string
  searchApiKey: string
  confidenceThreshold: number
  maxBatchSize: number
}

interface WorkflowResult {
  success: boolean
  processedCount: number
  verifiedCount: number
  manualReviewCount: number
  results: any[]
  errors: string[]
  executionTime: number
}

interface VerificationQueueItem {
  id: string
  type: 'data_verification' | 'company_profiling'
  companyName: string
  data: any
  reason: string
  priority: 'high' | 'medium' | 'low'
  linkedinUrl?: string
  createdAt: Date
}

export class IntegratedWorkflowAgent {
  private processingAgent: ProcessingAgent
  private analysisAgent: AnalysisAgent
  private companyProfilingAgent: CompanyProfilingAgent
  private verificationQueue: VerificationQueueItem[] = []
  private config: WorkflowConfig

  constructor(config: WorkflowConfig) {
    this.config = config
    this.processingAgent = new ProcessingAgent(config.geminiApiKey)
    this.analysisAgent = new AnalysisAgent(config.searchApiKey, config.geminiApiKey)
    this.companyProfilingAgent = new CompanyProfilingAgent()
  }

  /**
   * Execute complete workflow: Raw Articles → Verified Database Records
   */
  async executeCompleteWorkflow(rawArticles: string[]): Promise<WorkflowResult> {
    const startTime = Date.now()
    console.log(`🚀 Starting integrated workflow for ${rawArticles.length} articles`)
    
    const result: WorkflowResult = {
      success: false,
      processedCount: 0,
      verifiedCount: 0,
      manualReviewCount: 0,
      results: [],
      errors: [],
      executionTime: 0
    }

    try {
      // Limit batch size to prevent overwhelming the system
      const limitedArticles = rawArticles.slice(0, this.config.maxBatchSize)
      
      // Phase 1: Already completed (articles gathered)
      console.log(`📰 Phase 1 Complete: ${limitedArticles.length} articles ready for processing`)

      // Phase 2: Process articles into structured data
      console.log(`🔄 Phase 2: Processing articles with NLP/NER`)
      const processedData = await this.processingAgent.processBatch(limitedArticles)
      result.processedCount = processedData.length
      
      console.log(`✅ Phase 2 Complete: ${processedData.length} articles processed`)

      // Phase 3: Analyze and verify processed data
      console.log(`🔍 Phase 3: Analyzing and verifying processed data`)
      const analysisResults = await this.analysisAgent.analyzeBatch(processedData)
      
      // Separate verified data from items requiring manual review
      const verifiedData: any[] = []
      const manualReviewItems: any[] = []
      
      for (let i = 0; i < analysisResults.length; i++) {
        const analysis = analysisResults[i]
        const originalData = processedData[i]
        
        if (analysis.verified && analysis.confidence.overall >= this.config.confidenceThreshold) {
          // High confidence - auto-approve for database
          verifiedData.push({
            ...analysis.finalData,
            confidence: analysis.confidence,
            sources: analysis.sources.length,
            status: 'verified'
          })
        } else {
          // Low confidence or discrepancies - queue for manual review
          manualReviewItems.push({
            ...originalData,
            analysis: analysis,
            status: 'manual_review_required'
          })
          
          this.addToVerificationQueue({
            type: 'data_verification',
            companyName: originalData.companyName,
            data: originalData,
            reason: analysis.reviewReason || 'Low confidence score',
            priority: analysis.confidence.overall < 0.3 ? 'high' : 'medium'
          })
        }
      }

      result.verifiedCount = verifiedData.length
      result.manualReviewCount = manualReviewItems.length
      
      console.log(`✅ Phase 3 Complete: ${verifiedData.length} verified, ${manualReviewItems.length} need review`)

      // Phase 4: Company Profiling for verified companies
      console.log(`🏢 Phase 4: Building company profiles for verified companies`)
      const profiledCompanies = await this.profileVerifiedCompanies(verifiedData)
      
      // Combine all results
      result.results = [
        ...profiledCompanies.map(company => ({ ...company, status: 'complete' })),
        ...manualReviewItems
      ]
      
      result.success = true
      result.executionTime = Date.now() - startTime
      
      console.log(`🎉 Workflow Complete: ${result.verifiedCount} verified, ${result.manualReviewCount} queued for review`)
      
    } catch (error) {
      console.error('❌ Workflow execution failed:', error)
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
      result.executionTime = Date.now() - startTime
    }

    return result
  }

  /**
   * Profile companies for verified funding data
   */
  private async profileVerifiedCompanies(verifiedData: any[]): Promise<any[]> {
    const profiledCompanies: any[] = []
    
    for (let i = 0; i < verifiedData.length; i++) {
      const fundingData = verifiedData[i]
      
      try {
        console.log(`🏢 Profiling company ${i + 1}/${verifiedData.length}: ${fundingData.companyName}`)
        
        const companyProfile = await this.companyProfilingAgent.profileCompany(fundingData.companyName)
        
        if (companyProfile) {
          profiledCompanies.push({
            ...fundingData,
            companyProfile: companyProfile,
            profileComplete: this.isProfileComplete(companyProfile)
          })
        } else {
          // Profiling failed - add to verification queue
          profiledCompanies.push({
            ...fundingData,
            companyProfile: null,
            profileComplete: false
          })
          
          this.addToVerificationQueue({
            type: 'company_profiling',
            companyName: fundingData.companyName,
            data: fundingData,
            reason: 'Company profiling failed - manual research required',
            priority: 'medium'
          })
        }
        
        // Rate limiting between company profiles
        if (i < verifiedData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500))
        }
        
      } catch (error) {
        console.error(`❌ Failed to profile ${fundingData.companyName}:`, error)
        profiledCompanies.push({
          ...fundingData,
          companyProfile: null,
          profileComplete: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return profiledCompanies
  }

  /**
   * Add item to verification queue for manual review
   */
  private addToVerificationQueue(item: Omit<VerificationQueueItem, 'id' | 'createdAt'>): void {
    const queueItem: VerificationQueueItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    }
    
    // Add LinkedIn URL for company profiling tasks
    if (item.type === 'company_profiling') {
      queueItem.linkedinUrl = `https://linkedin.com/company/${item.companyName.toLowerCase().replace(/\s+/g, '-')}`
    }
    
    this.verificationQueue.push(queueItem)
    console.log(`📝 Added to verification queue: ${item.type} for ${item.companyName}`)
  }

  /**
   * Get verification queue for dashboard display
   */
  getVerificationQueue(): VerificationQueueItem[] {
    return this.verificationQueue.sort((a, b) => {
      // Sort by priority (high first) then by creation date (newest first)
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  }

  /**
   * Mark verification queue item as completed
   */
  completeVerificationTask(taskId: string, updatedData?: any): boolean {
    const taskIndex = this.verificationQueue.findIndex(item => item.id === taskId)
    
    if (taskIndex !== -1) {
      const task = this.verificationQueue[taskIndex]
      console.log(`✅ Completed verification task: ${task.type} for ${task.companyName}`)
      
      // Remove from queue
      this.verificationQueue.splice(taskIndex, 1)
      
      // If updated data provided, you could save it to database here
      if (updatedData) {
        console.log(`💾 Updated data received for ${task.companyName}`)
      }
      
      return true
    }
    
    return false
  }

  /**
   * Get workflow statistics
   */
  getWorkflowStats(): any {
    const queueStats = this.verificationQueue.reduce((stats, item) => {
      stats[item.type] = (stats[item.type] || 0) + 1
      stats[item.priority] = (stats[item.priority] || 0) + 1
      return stats
    }, {} as Record<string, number>)
    
    return {
      queueLength: this.verificationQueue.length,
      queueStats,
      companyProfilingTasks: this.companyProfilingAgent.getVerificationTasks().length,
      agentStatus: {
        processing: 'operational',
        analysis: 'operational',
        companyProfiling: 'operational'
      }
    }
  }

  /**
   * Process a single article through the complete workflow
   */
  async processSingleArticle(articleText: string): Promise<any> {
    try {
      console.log(`🔄 Processing single article through complete workflow`)
      
      // Phase 2: Process
      const processedData = await this.processingAgent.processArticle(articleText)
      
      // Phase 3: Analyze
      const analysisResult = await this.analysisAgent.analyzeProcessedData(processedData)
      
      // Phase 4: Company Profiling (if verified)
      let companyProfile: any = null
      if (analysisResult.verified && analysisResult.confidence.overall >= this.config.confidenceThreshold) {
        companyProfile = await this.companyProfilingAgent.profileCompany(processedData.companyName)
      }
      
      return {
        processedData,
        analysisResult,
        companyProfile,
        status: analysisResult.verified ? 'complete' : 'manual_review_required'
      }
      
    } catch (error) {
      console.error('❌ Single article processing failed:', error)
      throw error
    }
  }

  /**
   * Check if company profile is complete
   */
  private isProfileComplete(profile: any): boolean {
    return !!(
      profile &&
      profile.website &&
      profile.foundedYear &&
      profile.employeeRange &&
      profile.location &&
      profile.description &&
      profile.teamMembers &&
      profile.teamMembers.length > 0
    )
  }

  /**
   * Get agent status for monitoring
   */
  getAgentStatus(): any {
    return {
      workflow: {
        name: 'Integrated Workflow Agent',
        status: 'operational',
        phases: {
          'Phase 1': 'Gather - External (RSS/Web scraping)',
          'Phase 2': 'Process - NLP/NER with Gemini Flash 2.5',
          'Phase 3': 'Analyze - Cross-verification & confidence scoring',
          'Phase 4': 'Profile - Company intelligence gathering'
        }
      },
      verificationQueue: {
        totalItems: this.verificationQueue.length,
        highPriority: this.verificationQueue.filter(item => item.priority === 'high').length,
        dataVerification: this.verificationQueue.filter(item => item.type === 'data_verification').length,
        companyProfiling: this.verificationQueue.filter(item => item.type === 'company_profiling').length
      },
      config: {
        confidenceThreshold: this.config.confidenceThreshold,
        maxBatchSize: this.config.maxBatchSize
      }
    }
  }
}

export default IntegratedWorkflowAgent