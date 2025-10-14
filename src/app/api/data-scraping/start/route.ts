/**
 * Start Scraping Job API
 * Initiates scraping jobs for specific data sources
 */

import { NextRequest, NextResponse } from 'next/server'
import { sanitizeText, checkRateLimit } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(clientIP, 10, 60000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { sourceId } = body

    if (!sourceId) {
      return NextResponse.json({
        success: false,
        error: 'Source ID is required'
      }, { status: 400 })
    }

    // Simulate starting scraping job
    await new Promise(resolve => setTimeout(resolve, 1000))

    const jobId = `job_${Date.now()}`
    console.log(`Starting scraping job ${jobId} for source ${sourceId}`)

    return NextResponse.json({
      success: true,
      data: {
        jobId,
        sourceId,
        status: 'started',
        estimatedDuration: '15-30 minutes',
        expectedDataPoints: getExpectedDataPoints(sourceId),
        startedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Start Scraping API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to start scraping job'
    }, { status: 500 })
  }
}

function getExpectedDataPoints(sourceId: string): number {
  const expectations = {
    '1': 50, // TechCrunch
    '2': 30, // VentureBeat
    '3': 100, // Company websites
    '4': 20, // Conferences
    '5': 80, // LinkedIn
    '6': 15  // Patents
  }
  return expectations[sourceId as keyof typeof expectations] || 25
}

export const runtime = 'nodejs'