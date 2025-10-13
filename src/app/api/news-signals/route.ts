/**
 * News & Signals API
 * Handles company monitoring, signal processing, and momentum analysis
 * Provides endpoints for timeline management and monitoring configuration
 */

import { NextRequest, NextResponse } from 'next/server'
import NewsSignalsAgent from '@/lib/agents/NewsSignalsAgent'
import { sanitizeText, checkRateLimit } from '@/lib/security'

// Initialize news signals agent
const newsSignalsAgent = new NewsSignalsAgent(
  process.env.GEMINI_API_KEY || '',
  process.env.NEWS_API_KEY || ''
)

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
    const companyName = sanitizeText(searchParams.get('company') || '')

    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          data: newsSignalsAgent.getAgentStatus()
        })

      case 'monitored-companies':
        return NextResponse.json({
          success: true,
          data: newsSignalsAgent.getMonitoredCompanies()
        })

      case 'company-timeline':
        if (!companyName) {
          return NextResponse.json({
            success: false,
            error: 'Company name is required'
          }, { status: 400 })
        }

        const timeline = newsSignalsAgent.getCompanyTimeline(companyName)
        return NextResponse.json({
          success: true,
          data: timeline
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('News Signals API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for POST requests
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const rateLimit = checkRateLimit(clientIP, 15, 60000) // 15 requests per minute

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }

    const action = sanitizeText(body.action || '')

    switch (action) {
      case 'add-company':
        return await handleAddCompany(body)

      case 'monitor-company':
        return await handleMonitorCompany(body)

      case 'gather-signals':
        return await handleGatherSignals(body)

      case 'process-signals':
        return await handleProcessSignals(body)

      case 'analyze-signals':
        return await handleAnalyzeSignals(body)

      case 'full-monitoring-cycle':
        return await handleFullMonitoringCycle(body)

      case 'test-monitoring':
        return await handleTestMonitoring(body)

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('News Signals POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * Add company to monitoring list
 */
async function handleAddCompany(body: any) {
  try {
    const { company } = body

    if (!company || !company.name || !company.website) {
      return NextResponse.json({
        success: false,
        error: 'Company name and website are required'
      }, { status: 400 })
    }

    // Sanitize company data
    const sanitizedCompany = {
      name: sanitizeText(company.name),
      website: sanitizeText(company.website),
      socialMedia: company.socialMedia ? {
        linkedin: sanitizeText(company.socialMedia.linkedin || ''),
        twitter: sanitizeText(company.socialMedia.twitter || ''),
        blog: sanitizeText(company.socialMedia.blog || '')
      } : {},
      executives: Array.isArray(company.executives) ? 
        company.executives.map((exec: string) => sanitizeText(exec)) : []
    }

    newsSignalsAgent.addCompanyToMonitoring(sanitizedCompany)

    return NextResponse.json({
      success: true,
      data: {
        message: `Added ${sanitizedCompany.name} to monitoring list`,
        company: sanitizedCompany
      }
    })

  } catch (error) {
    console.error('Add company error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to add company to monitoring'
    }, { status: 500 })
  }
}

/**
 * Execute monitoring for a specific company
 */
async function handleMonitorCompany(body: any) {
  try {
    const { companyName } = body

    if (!companyName) {
      return NextResponse.json({
        success: false,
        error: 'Company name is required'
      }, { status: 400 })
    }

    const sanitizedCompanyName = sanitizeText(companyName)
    
    console.log(`🔄 Starting monitoring for ${sanitizedCompanyName}`)
    
    const timeline = await newsSignalsAgent.executeMonitoringCycle(sanitizedCompanyName)

    return NextResponse.json({
      success: true,
      data: {
        timeline: timeline,
        message: `Monitoring completed for ${sanitizedCompanyName}`
      }
    })

  } catch (error) {
    console.error('Monitor company error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to monitor company'
    }, { status: 500 })
  }
}

/**
 * Gather signals for a company (Phase 1)
 */
async function handleGatherSignals(body: any) {
  try {
    const { companyName } = body

    if (!companyName) {
      return NextResponse.json({
        success: false,
        error: 'Company name is required'
      }, { status: 400 })
    }

    const sanitizedCompanyName = sanitizeText(companyName)
    const signals = await newsSignalsAgent.gatherSignals(sanitizedCompanyName)

    return NextResponse.json({
      success: true,
      data: {
        signals: signals,
        count: signals.length,
        message: `Gathered ${signals.length} signals for ${sanitizedCompanyName}`
      }
    })

  } catch (error) {
    console.error('Gather signals error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to gather signals'
    }, { status: 500 })
  }
}

/**
 * Process signals for a company (Phase 2)
 */
async function handleProcessSignals(body: any) {
  try {
    const { companyName, rawSignals } = body

    if (!companyName || !Array.isArray(rawSignals)) {
      return NextResponse.json({
        success: false,
        error: 'Company name and raw signals array are required'
      }, { status: 400 })
    }

    const sanitizedCompanyName = sanitizeText(companyName)
    const processedSignals = await newsSignalsAgent.processSignals(rawSignals, sanitizedCompanyName)

    return NextResponse.json({
      success: true,
      data: {
        processedSignals: processedSignals,
        count: processedSignals.length,
        message: `Processed ${processedSignals.length} signals for ${sanitizedCompanyName}`
      }
    })

  } catch (error) {
    console.error('Process signals error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process signals'
    }, { status: 500 })
  }
}

/**
 * Analyze signals for a company (Phase 3)
 */
async function handleAnalyzeSignals(body: any) {
  try {
    const { companyName, processedSignals } = body

    if (!companyName || !Array.isArray(processedSignals)) {
      return NextResponse.json({
        success: false,
        error: 'Company name and processed signals array are required'
      }, { status: 400 })
    }

    const sanitizedCompanyName = sanitizeText(companyName)
    const timeline = await newsSignalsAgent.analyzeSignals(processedSignals, sanitizedCompanyName)

    return NextResponse.json({
      success: true,
      data: {
        timeline: timeline,
        message: `Analysis completed for ${sanitizedCompanyName}`
      }
    })

  } catch (error) {
    console.error('Analyze signals error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze signals'
    }, { status: 500 })
  }
}

/**
 * Execute full monitoring cycle (all 3 phases)
 */
async function handleFullMonitoringCycle(body: any) {
  try {
    const { companyName } = body

    if (!companyName) {
      return NextResponse.json({
        success: false,
        error: 'Company name is required'
      }, { status: 400 })
    }

    const sanitizedCompanyName = sanitizeText(companyName)
    
    console.log(`🔄 Executing full monitoring cycle for ${sanitizedCompanyName}`)
    
    const timeline = await newsSignalsAgent.executeMonitoringCycle(sanitizedCompanyName)

    return NextResponse.json({
      success: true,
      data: {
        timeline: timeline,
        momentum: timeline.momentum,
        signalCount: timeline.signals.length,
        message: `Full monitoring cycle completed for ${sanitizedCompanyName}`
      }
    })

  } catch (error) {
    console.error('Full monitoring cycle error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to execute monitoring cycle'
    }, { status: 500 })
  }
}

/**
 * Test monitoring with sample company
 */
async function handleTestMonitoring(body: any) {
  try {
    console.log(`🧪 Running monitoring test`)

    // Add sample company for testing
    const sampleCompany = {
      name: 'CyberSecure',
      website: 'https://cybersecure.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/company/cybersecure',
        twitter: 'https://twitter.com/cybersecure'
      },
      executives: ['Sarah Chen', 'Michael Rodriguez']
    }

    newsSignalsAgent.addCompanyToMonitoring(sampleCompany)

    // Execute monitoring cycle
    const timeline = await newsSignalsAgent.executeMonitoringCycle(sampleCompany.name)

    return NextResponse.json({
      success: true,
      data: {
        testCompany: sampleCompany,
        timeline: timeline,
        momentum: timeline.momentum,
        signalCount: timeline.signals.length,
        message: 'Monitoring test completed successfully'
      }
    })

  } catch (error) {
    console.error('Test monitoring error:', error)
    return NextResponse.json({
      success: false,
      error: 'Monitoring test failed'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'