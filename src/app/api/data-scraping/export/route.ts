/**
 * Data Scraping Export API
 * Exports scraped data in various formats
 */

import { NextRequest, NextResponse } from 'next/server'
import { sanitizeText, checkRateLimit } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(clientIP, 5, 60000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { format } = body

    if (!format) {
      return NextResponse.json({
        success: false,
        error: 'Format is required'
      }, { status: 400 })
    }

    // Simulate export generation
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      data: {
        exportId: `scraped_data_${Date.now()}`,
        format: format,
        downloadUrl: `/api/downloads/scraped_data_${Date.now()}.${format}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        fileSize: getScrapedDataFileSize(format),
        recordCount: getRecordCount(format),
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Scraping Export API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Export generation failed'
    }, { status: 500 })
  }
}

function getScrapedDataFileSize(format: string): string {
  switch (format) {
    case 'excel': return '5.7 MB'
    case 'csv': return '2.1 MB'
    case 'json': return '3.4 MB'
    default: return '1.0 MB'
  }
}

function getRecordCount(format: string): number {
  return 15847 // Total scraped records
}

export const runtime = 'nodejs'