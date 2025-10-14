/**
 * Partner Intelligence API
 * Analyzes partner notes, correlations, and trends
 * Supports automated data pulling and manual tracking integration
 */

import { NextRequest, NextResponse } from 'next/server'
import { sanitizeText, checkRateLimit } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(clientIP, 30, 60000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = sanitizeText(searchParams.get('action') || '')
    const partnerId = sanitizeText(searchParams.get('partnerId') || 'all')

    switch (action) {
      case 'notes':
        return NextResponse.json({
          success: true,
          data: await getPartnerNotesAnalysis(partnerId)
        })

      case 'correlations':
        return NextResponse.json({
          success: true,
          data: await getCompanyCorrelations(partnerId)
        })

      case 'trends':
        return NextResponse.json({
          success: true,
          data: await getTrendInsights(partnerId)
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Partner Intelligence API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

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
    const action = sanitizeText(body.action || '')

    switch (action) {
      case 'analyze-notes':
        return await analyzePartnerNotes(body)

      case 'add-note':
        return await addPartnerNote(body)

      case 'update-correlation':
        return await updateCorrelation(body)

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Partner Intelligence POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * Get partner notes analysis with correlations and trends
 */
async function getPartnerNotesAnalysis(partnerId: string) {
  // Simulate AI analysis processing
  await new Promise(resolve => setTimeout(resolve, 1200))

  return {
    notes: [
      {
        id: '1',
        companyName: 'CyberFlow AI',
        partnerName: 'Sarah Chen',
        date: '2024-09-15',
        stage: 'Series A',
        decision: 'pass',
        keyPoints: ['Strong technical team', 'Competitive market', 'High burn rate'],
        concerns: ['Market timing too early', 'Strong competition from incumbents', 'Customer acquisition challenges'],
        strengths: ['Exceptional technical team', 'Novel AI approach', 'Strong IP portfolio'],
        marketTiming: 'Too early - market not ready for this solution',
        teamAssessment: 'Excellent - ex-Google AI researchers',
        techAssessment: 'Strong - proprietary algorithms',
        tags: ['AI', 'Early Stage', 'Technical Risk']
      },
      {
        id: '2',
        companyName: 'SecureVault Pro',
        partnerName: 'Michael Rodriguez',
        date: '2024-08-22',
        stage: 'Seed',
        decision: 'follow',
        keyPoints: ['Good traction', 'Need more revenue', 'Strong partnerships'],
        concerns: ['Revenue growth slower than expected', 'Competitive pressure increasing'],
        strengths: ['Strong customer retention', 'Good partnership with AWS', 'Experienced team'],
        marketTiming: 'Good timing - market demand increasing',
        teamAssessment: 'Good - need stronger sales leadership',
        techAssessment: 'Solid - proven technology',
        followUpDate: '2024-12-01',
        tags: ['Cloud Security', 'Follow Up', 'Revenue Growth']
      },
      {
        id: '3',
        companyName: 'ZeroAccess Networks',
        partnerName: 'Jennifer Kim',
        date: '2024-07-10',
        stage: 'Series A',
        decision: 'pass',
        keyPoints: ['Strong technology', 'Experienced team', 'Competitive market'],
        concerns: ['Market saturation', 'Pricing pressure', 'Long sales cycles'],
        strengths: ['Proven technology', 'Government contracts', 'Strong team'],
        marketTiming: 'Market becoming saturated',
        teamAssessment: 'Strong - good track record',
        techAssessment: 'Excellent - differentiated approach',
        tags: ['Zero Trust', 'Government', 'Competitive']
      }
    ],
    correlations: [
      {
        companyName: 'QuantumShield Security',
        correlationScore: 87,
        similarityReasons: [
          'Similar AI-powered threat detection approach to CyberFlow AI',
          'Ex-Google team members like previous pass',
          'Same market segment (enterprise security)',
          'Similar technical risk profile'
        ],
        currentStatus: 'Series A funded',
        fundingStage: 'Series A',
        lastFunding: '2024-10-01',
        recommendedAction: 'review',
        keyDifferences: [
          'Now has 3 major enterprise customers vs 0 before',
          'Market timing improved - AI security demand increased 300%',
          'Reduced burn rate by 40% with better unit economics',
          'Strategic partnership with Microsoft provides validation',
          'Quantum angle provides unique differentiation'
        ],
        marketEvolution: 'AI security market has matured significantly since our CyberFlow AI review. Enterprise adoption has accelerated due to high-profile AI incidents, and the competitive landscape has consolidated, creating opportunities for differentiated players like QuantumShield.'
      },
      {
        companyName: 'CloudDefender Pro',
        correlationScore: 73,
        similarityReasons: [
          'Similar cloud security focus to SecureVault Pro',
          'AWS partnership like previous company',
          'Similar revenue challenges initially'
        ],
        currentStatus: 'Series B funded',
        fundingStage: 'Series B',
        lastFunding: '2024-09-20',
        recommendedAction: 'monitor',
        keyDifferences: [
          'Achieved $10M ARR vs $2M when we last looked',
          'Expanded beyond AWS to multi-cloud',
          'Strong enterprise sales team now in place'
        ],
        marketEvolution: 'Cloud security market has expanded beyond single-cloud solutions. Multi-cloud management is now a key requirement for enterprises.'
      }
    ],
    trends: [
      {
        id: '1',
        trend: 'AI Security Market Acceleration',
        confidence: 94,
        supportingEvidence: [
          '67% increase in AI security funding in 2024',
          'Major enterprises now have dedicated AI security budgets',
          'Regulatory pressure driving adoption (EU AI Act)',
          'High-profile AI security incidents increasing awareness',
          '3 of our last 5 passes were AI security companies'
        ],
        relatedCompanies: ['QuantumShield', 'CyberFlow AI', 'SecureAI Labs'],
        marketImplications: 'Companies we previously passed on for being "too early" in AI security may now be well-positioned as the market has matured and enterprise budgets have been allocated.',
        actionableInsights: [
          'Revisit AI security companies from 2022-2023 deal flow',
          'Focus on companies with enterprise traction and proven ROI',
          'Look for regulatory compliance features (SOC2, FedRAMP)',
          'Prioritize teams with AI/ML security expertise and enterprise sales experience'
        ],
        timeframe: '12-18 months',
        partnerRelevance: ['Sarah Chen - AI Security Focus', 'Michael Rodriguez - Enterprise Sales']
      },
      {
        id: '2',
        trend: 'Team Quality Over Technology',
        confidence: 89,
        supportingEvidence: [
          'All successful investments had "excellent" team ratings',
          '80% of passes cited team concerns',
          'Market timing issues resolved but team issues persist',
          'Strong teams adapt and pivot successfully'
        ],
        relatedCompanies: ['All portfolio companies'],
        marketImplications: 'Team quality is the strongest predictor of success. Technology can be built, but team chemistry and execution capability are harder to change.',
        actionableInsights: [
          'Weight team assessment more heavily in decision matrix',
          'Develop deeper team evaluation frameworks',
          'Consider team coaching/support as part of investment',
          'Track team changes post-investment more closely'
        ],
        timeframe: 'Ongoing',
        partnerRelevance: ['All Partners - Core Investment Criteria']
      }
    ]
  }
}

/**
 * Get company correlations based on partner notes
 */
async function getCompanyCorrelations(partnerId: string) {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // This would analyze partner notes and find similar companies
  return []
}

/**
 * Get trend insights from partner notes
 */
async function getTrendInsights(partnerId: string) {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  // This would analyze patterns in partner notes
  return []
}

/**
 * Analyze partner notes using AI
 */
async function analyzePartnerNotes(body: any) {
  const { partnerId, includeCorrelations, includeTrends } = body

  // Simulate AI analysis
  await new Promise(resolve => setTimeout(resolve, 3000))

  console.log(`Analyzing notes for partner: ${partnerId}`)

  return NextResponse.json({
    success: true,
    data: {
      correlations: includeCorrelations ? await getCompanyCorrelations(partnerId) : [],
      trends: includeTrends ? await getTrendInsights(partnerId) : [],
      analysisId: `analysis_${Date.now()}`,
      processingTime: '2.3 seconds',
      notesAnalyzed: 47,
      correlationsFound: 12,
      trendsIdentified: 8
    }
  })
}

/**
 * Add new partner note
 */
async function addPartnerNote(body: any) {
  const { companyName, partnerName, decision, notes } = body

  await new Promise(resolve => setTimeout(resolve, 500))

  console.log(`Adding note for ${companyName} by ${partnerName}`)

  return NextResponse.json({
    success: true,
    data: {
      noteId: `note_${Date.now()}`,
      message: 'Partner note added successfully',
      autoCorrelations: 3, // Number of automatic correlations found
      suggestedTags: ['AI Security', 'Enterprise', 'Technical Risk']
    }
  })
}

/**
 * Update correlation status
 */
async function updateCorrelation(body: any) {
  const { correlationId, action, notes } = body

  await new Promise(resolve => setTimeout(resolve, 300))

  return NextResponse.json({
    success: true,
    data: {
      correlationId,
      action,
      updated: new Date().toISOString()
    }
  })
}

export const runtime = 'nodejs'