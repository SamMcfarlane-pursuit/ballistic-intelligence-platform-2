/**
 * Company Intelligence Export API
 * Exports data for decks, charts, and metrics for investors
 * Supports PDF, Excel, and PowerPoint formats
 */

import { NextRequest, NextResponse } from 'next/server'
import { sanitizeText, checkRateLimit } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(clientIP, 5, 60000) // Lower limit for exports

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { companyId, format, includeCharts, includeMetrics } = body

    if (!companyId || !format) {
      return NextResponse.json({
        success: false,
        error: 'Company ID and format are required'
      }, { status: 400 })
    }

    // Simulate export generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate export data based on format
    const exportData = await generateExport(companyId, format, includeCharts, includeMetrics)

    // In a real implementation, this would return the actual file
    // For now, we'll return a success response
    return NextResponse.json({
      success: true,
      data: {
        exportId: `export_${Date.now()}`,
        format: format,
        companyId: companyId,
        downloadUrl: `/api/downloads/export_${Date.now()}.${format}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        fileSize: '2.4 MB',
        pages: format === 'pdf' ? 15 : undefined,
        sheets: format === 'excel' ? 8 : undefined,
        slides: format === 'presentation' ? 12 : undefined
      }
    })

  } catch (error) {
    console.error('Export API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Export generation failed'
    }, { status: 500 })
  }
}

/**
 * Generate export data based on format
 */
async function generateExport(companyId: string, format: string, includeCharts: boolean, includeMetrics: boolean) {
  console.log(`Generating ${format} export for company ${companyId}`)
  
  const exportContent = {
    companyProfile: true,
    fundingHistory: true,
    teamAnalysis: true,
    marketPresence: true,
    ballisticHistory: true,
    connectionGaps: true,
    charts: includeCharts,
    metrics: includeMetrics
  }

  switch (format) {
    case 'pdf':
      return generatePDFExport(companyId, exportContent)
    case 'excel':
      return generateExcelExport(companyId, exportContent)
    case 'presentation':
      return generatePresentationExport(companyId, exportContent)
    default:
      throw new Error('Unsupported export format')
  }
}

/**
 * Generate PDF export for detailed analysis
 */
async function generatePDFExport(companyId: string, content: any) {
  return {
    format: 'pdf',
    sections: [
      'Executive Summary',
      'Company Overview',
      'Funding Analysis',
      'Team Assessment',
      'Market Presence',
      'Competitive Position',
      'Investment Thesis',
      'Risk Analysis',
      'Ballistic History',
      'Connection Gaps',
      'Recommendations',
      'Appendix - Charts',
      'Appendix - Metrics',
      'Appendix - Sources',
      'Appendix - Contacts'
    ],
    charts: content.charts ? [
      'Funding Timeline',
      'Revenue Growth',
      'Market Size',
      'Competitive Landscape',
      'Team Growth'
    ] : [],
    metrics: content.metrics ? [
      'Financial KPIs',
      'Growth Metrics',
      'Market Metrics',
      'Team Metrics'
    ] : []
  }
}

/**
 * Generate Excel export for data analysis
 */
async function generateExcelExport(companyId: string, content: any) {
  return {
    format: 'excel',
    sheets: [
      'Company Overview',
      'Funding Data',
      'Team Analysis',
      'Financial Metrics',
      'Market Data',
      'Conference Tracking',
      'Connection Mapping',
      'Export Summary'
    ],
    dataPoints: 247,
    formulas: 18,
    charts: content.charts ? 12 : 0
  }
}

/**
 * Generate PowerPoint presentation for investor meetings
 */
async function generatePresentationExport(companyId: string, content: any) {
  return {
    format: 'presentation',
    slides: [
      'Title Slide',
      'Executive Summary',
      'Company Snapshot',
      'Funding Overview',
      'Team Highlights',
      'Market Opportunity',
      'Competitive Analysis',
      'Financial Performance',
      'Growth Trajectory',
      'Investment Thesis',
      'Next Steps',
      'Appendix'
    ],
    charts: content.charts ? [
      'Funding timeline chart',
      'Revenue growth chart',
      'Market size chart',
      'Team growth chart'
    ] : [],
    speakerNotes: true,
    animations: true
  }
}

export const runtime = 'nodejs'