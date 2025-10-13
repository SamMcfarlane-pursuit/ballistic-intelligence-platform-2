/**
 * Integrated Workflow API
 * Handles the complete 3-phase pipeline: Gather → Process → Analyze
 * Provides endpoints for batch processing and verification queue management
 */

import { NextRequest, NextResponse } from 'next/server'
import IntegratedWorkflowAgent from '@/lib/agents/IntegratedWorkflowAgent'
import { validateCompanyData, sanitizeText, checkRateLimit } from '@/lib/security'

// Initialize workflow agent with configuration
const workflowAgent = new IntegratedWorkflowAgent({
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  searchApiKey: process.env.GOOGLE_SEARCH_API_KEY || '',
  confidenceThreshold: 0.75,
  maxBatchSize: 10
})

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const rateLimit = checkRateLimit(clientIP, 30, 60000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = sanitizeText(searchParams.get('action') || '')

    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          data: workflowAgent.getAgentStatus()
        })

      case 'verification-queue':
        return NextResponse.json({
          success: true,
          data: {
            queue: workflowAgent.getVerificationQueue(),
            stats: workflowAgent.getWorkflowStats()
          }
        })

      case 'workflow-stats':
        return NextResponse.json({
          success: true,
          data: workflowAgent.getWorkflowStats()
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Integrated Workflow API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for POST requests (more restrictive)
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const rateLimit = checkRateLimit(clientIP, 10, 60000) // 10 requests per minute

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate request structure
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }

    const action = sanitizeText(body.action || '')

    switch (action) {
      case 'process-batch':
        return await handleBatchProcessing(body)

      case 'process-single':
        return await handleSingleProcessing(body)

      case 'complete-verification':
        return await handleVerificationCompletion(body)

      case 'test-workflow':
        return await handleWorkflowTest(body)

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Integrated Workflow POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * Handle batch processing of articles
 */
async function handleBatchProcessing(body: any) {
  try {
    const { articles } = body

    if (!articles || !Array.isArray(articles)) {
      return NextResponse.json({
        success: false,
        error: 'Articles array is required'
      }, { status: 400 })
    }

    if (articles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'At least one article is required'
      }, { status: 400 })
    }

    // Sanitize and validate articles
    const sanitizedArticles = articles
      .map(article => sanitizeText(article))
      .filter(article => article.length > 50) // Minimum article length
      .slice(0, 10) // Maximum 10 articles per batch

    if (sanitizedArticles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid articles found after sanitization'
      }, { status: 400 })
    }

    console.log(`🚀 Starting batch workflow for ${sanitizedArticles.length} articles`)

    // Execute complete workflow
    const result = await workflowAgent.executeCompleteWorkflow(sanitizedArticles)

    return NextResponse.json({
      success: result.success,
      data: {
        processedCount: result.processedCount,
        verifiedCount: result.verifiedCount,
        manualReviewCount: result.manualReviewCount,
        executionTime: result.executionTime,
        results: result.results,
        errors: result.errors,
        verificationQueue: workflowAgent.getVerificationQueue()
      }
    })

  } catch (error) {
    console.error('Batch processing error:', error)
    return NextResponse.json({
      success: false,
      error: 'Batch processing failed'
    }, { status: 500 })
  }
}

/**
 * Handle single article processing
 */
async function handleSingleProcessing(body: any) {
  try {
    const { article } = body

    if (!article || typeof article !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Article text is required'
      }, { status: 400 })
    }

    const sanitizedArticle = sanitizeText(article)

    if (sanitizedArticle.length < 50) {
      return NextResponse.json({
        success: false,
        error: 'Article too short (minimum 50 characters)'
      }, { status: 400 })
    }

    console.log(`🔄 Processing single article through workflow`)

    // Process single article
    const result = await workflowAgent.processSingleArticle(sanitizedArticle)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Single processing error:', error)
    return NextResponse.json({
      success: false,
      error: 'Single article processing failed'
    }, { status: 500 })
  }
}

/**
 * Handle verification task completion
 */
async function handleVerificationCompletion(body: any) {
  try {
    const { taskId, updatedData } = body

    if (!taskId || typeof taskId !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Task ID is required'
      }, { status: 400 })
    }

    // Sanitize task ID
    const sanitizedTaskId = sanitizeText(taskId)

    // Validate and sanitize updated data if provided
    let sanitizedUpdatedData = null
    if (updatedData) {
      const validation = validateCompanyData(updatedData)
      if (!validation.isValid) {
        return NextResponse.json({
          success: false,
          error: 'Invalid updated data',
          details: validation.errors
        }, { status: 400 })
      }
      sanitizedUpdatedData = validation.sanitizedData
    }

    // Complete verification task
    const completed = workflowAgent.completeVerificationTask(sanitizedTaskId, sanitizedUpdatedData)

    if (!completed) {
      return NextResponse.json({
        success: false,
        error: 'Task not found or already completed'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Verification task completed successfully',
        remainingTasks: workflowAgent.getVerificationQueue().length
      }
    })

  } catch (error) {
    console.error('Verification completion error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to complete verification task'
    }, { status: 500 })
  }
}

/**
 * Handle workflow testing with sample data
 */
async function handleWorkflowTest(body: any) {
  try {
    console.log(`🧪 Running workflow test`)

    // Sample cybersecurity funding articles for testing
    const sampleArticles = [
      `CyberGuard, a cloud security startup, announced today that it has raised $15 million in Series A funding led by Ballistic Ventures. The San Francisco-based company, founded in 2019 by CEO Sarah Chen and CTO Michael Rodriguez, provides advanced threat detection for enterprise cloud environments. The funding will be used to expand their engineering team and accelerate product development.`,
      
      `SecureFlow Technologies closed a $8.5 million seed round led by CyberTech Capital with participation from Security Ventures. The Boston-based startup, founded by former NSA engineers Alex Thompson and Jordan Lee, focuses on zero-trust network security solutions. The company plans to use the funding to scale their go-to-market strategy.`,
      
      `AI security company ThreatShield raised $22 million in Series B funding from Enterprise Security Fund and existing investors. Founded in 2018 by Rachel Martinez (CEO) and Kevin Park (CTO), the New York-based company uses machine learning to detect advanced persistent threats. The funding round brings their total raised to $35 million.`
    ]

    // Execute workflow test
    const result = await workflowAgent.executeCompleteWorkflow(sampleArticles)

    return NextResponse.json({
      success: true,
      data: {
        testResult: result,
        sampleArticlesProcessed: sampleArticles.length,
        verificationQueue: workflowAgent.getVerificationQueue(),
        workflowStats: workflowAgent.getWorkflowStats()
      }
    })

  } catch (error) {
    console.error('Workflow test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Workflow test failed'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'