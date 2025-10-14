/**
 * Missed Opportunities API
 * Compares AI-discovered companies against manual tracking system
 * Identifies potential gaps in deal-sourcing efforts
 */

import { NextRequest, NextResponse } from 'next/server'
import { sanitizeText, checkRateLimit } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const rateLimit = checkRateLimit(clientIP, 20, 60000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sector = sanitizeText(searchParams.get('sector') || 'all')
    const risk = sanitizeText(searchParams.get('risk') || 'all')

    // Simulate analysis processing
    const analysisData = await analyzeMissedOpportunities(sector, risk)

    return NextResponse.json({
      success: true,
      data: analysisData,
      metadata: {
        lastAnalysis: new Date().toISOString(),
        coverageGap: '18.4%',
        totalDataSources: 12
      }
    })

  } catch (error) {
    console.error('Missed Opportunities API Error:', error)
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
    const rateLimit = checkRateLimit(clientIP, 5, 60000) // Lower limit for sync operations

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const action = sanitizeText(body.action || '')

    switch (action) {
      case 'sync-crm':
        return await handleCRMSync()
      
      case 'add-to-pipeline':
        return await handleAddToPipeline(body)
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Missed Opportunities POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * Analyze missed opportunities by comparing AI discoveries with manual tracking
 */
async function analyzeMissedOpportunities(sector: string, risk: string) {
  // Simulate analysis processing time
  await new Promise(resolve => setTimeout(resolve, 1500))

  const allOpportunities = generateMissedOpportunities()
  
  // Filter by sector and risk
  let filteredOpportunities = allOpportunities
  
  if (sector !== 'all') {
    filteredOpportunities = filteredOpportunities.filter(opp => 
      opp.sector.toLowerCase().includes(sector.toLowerCase())
    )
  }
  
  if (risk !== 'all') {
    filteredOpportunities = filteredOpportunities.filter(opp => 
      opp.riskLevel === risk
    )
  }

  return {
    opportunities: filteredOpportunities,
    metrics: calculateAnalysisMetrics(filteredOpportunities),
    comparison: getComparisonData()
  }
}

/**
 * Generate mock missed opportunities data
 */
function generateMissedOpportunities() {
  return [
    {
      id: 'mo-1',
      companyName: 'SecureFlow AI',
      sector: 'AI Security',
      location: 'San Francisco, CA',
      fundingAmount: 15000000,
      fundingRound: 'Series A',
      fundingDate: '2024-09-15',
      leadInvestor: 'Andreessen Horowitz',
      participants: ['GV', 'Bessemer Venture Partners', 'CRV'],
      foundedYear: 2023,
      employeeCount: '25-50',
      description: 'AI-powered security orchestration platform for enterprise environments',
      website: 'https://secureflow.ai',
      reasonMissed: 'Not in CRM database - discovered through TechCrunch article',
      discoverySource: 'TechCrunch',
      riskLevel: 'low',
      opportunityScore: 87,
      competitiveThreats: ['Phantom Cyber', 'Demisto', 'Splunk SOAR'],
      marketTiming: 'optimal',
      ballistic_fit: 92
    },
    {
      id: 'mo-2',
      companyName: 'CloudGuard Pro',
      sector: 'Cloud Security',
      location: 'Austin, TX',
      fundingAmount: 8500000,
      fundingRound: 'Seed',
      fundingDate: '2024-08-22',
      leadInvestor: 'Accel Partners',
      participants: ['Lightspeed Venture Partners', 'Index Ventures'],
      foundedYear: 2022,
      employeeCount: '15-25',
      description: 'Multi-cloud security posture management and compliance automation',
      website: 'https://cloudguard.pro',
      reasonMissed: 'Late discovery - 45 days after funding announcement',
      discoverySource: 'Crunchbase',
      riskLevel: 'medium',
      opportunityScore: 73,
      competitiveThreats: ['Prisma Cloud', 'Lacework', 'Orca Security'],
      marketTiming: 'late',
      ballistic_fit: 78
    },
    {
      id: 'mo-3',
      companyName: 'ZeroAccess Networks',
      sector: 'Zero Trust',
      location: 'New York, NY',
      fundingAmount: 12000000,
      fundingRound: 'Series A',
      fundingDate: '2024-07-30',
      leadInvestor: 'Sequoia Capital',
      participants: ['Kleiner Perkins', 'GV', 'Cyber Mentor Fund'],
      foundedYear: 2021,
      employeeCount: '30-50',
      description: 'Zero trust network access platform with behavioral analytics',
      website: 'https://zeroaccess.net',
      reasonMissed: 'Competitor funded - not tracked in pipeline',
      discoverySource: 'VentureBeat',
      riskLevel: 'high',
      opportunityScore: 65,
      competitiveThreats: ['Zscaler', 'Okta', 'CyberArk'],
      marketTiming: 'early',
      ballistic_fit: 71
    },
    {
      id: 'mo-4',
      companyName: 'AppShield Security',
      sector: 'Application Security',
      location: 'Boston, MA',
      fundingAmount: 6800000,
      fundingRound: 'Seed',
      fundingDate: '2024-06-18',
      leadInvestor: 'General Catalyst',
      participants: ['Bessemer Venture Partners', 'Cyber Angels'],
      foundedYear: 2023,
      employeeCount: '10-25',
      description: 'Runtime application security and protection platform',
      website: 'https://appshield.security',
      reasonMissed: 'Stealth mode - no public announcement tracked',
      discoverySource: 'LinkedIn',
      riskLevel: 'medium',
      opportunityScore: 81,
      competitiveThreats: ['Contrast Security', 'Veracode', 'Checkmarx'],
      marketTiming: 'optimal',
      ballistic_fit: 85
    },
    {
      id: 'mo-5',
      companyName: 'ThreatIntel Pro',
      sector: 'Threat Intelligence',
      location: 'Tel Aviv, Israel',
      fundingAmount: 9200000,
      fundingRound: 'Series A',
      fundingDate: '2024-05-12',
      leadInvestor: 'Team8',
      participants: ['Glilot Capital', 'Aleph VC', 'Cyber Security Fund'],
      foundedYear: 2022,
      employeeCount: '20-35',
      description: 'AI-driven threat intelligence platform with predictive analytics',
      website: 'https://threatintel.pro',
      reasonMissed: 'Geographic focus gap - Israeli market not fully covered',
      discoverySource: 'Calcalist',
      riskLevel: 'low',
      opportunityScore: 89,
      competitiveThreats: ['Recorded Future', 'ThreatConnect', 'Anomali'],
      marketTiming: 'optimal',
      ballistic_fit: 94
    }
  ]
}

/**
 * Calculate analysis metrics from opportunities data
 */
function calculateAnalysisMetrics(opportunities: any[]) {
  const totalFunding = opportunities.reduce((sum, opp) => sum + opp.fundingAmount, 0)
  const avgScore = opportunities.reduce((sum, opp) => sum + opp.opportunityScore, 0) / opportunities.length

  // Group by sector
  const sectorGroups = opportunities.reduce((acc, opp) => {
    if (!acc[opp.sector]) {
      acc[opp.sector] = { count: 0, funding: 0 }
    }
    acc[opp.sector].count++
    acc[opp.sector].funding += opp.fundingAmount
    return acc
  }, {} as Record<string, { count: number; funding: number }>)

  const topMissedSectors = Object.entries(sectorGroups)
    .map(([sector, data]) => ({ sector, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    totalMissedOpportunities: opportunities.length,
    totalMissedFunding: totalFunding,
    averageOpportunityScore: Math.round(avgScore),
    topMissedSectors,
    discoverySourceBreakdown: {
      'TechCrunch': 8,
      'Crunchbase': 6,
      'VentureBeat': 4,
      'LinkedIn': 3,
      'Calcalist': 2,
      'Other': 4
    },
    timeToDiscovery: {
      average: 28,
      median: 21,
      fastest: 3,
      slowest: 89
    },
    geographicDistribution: {
      'San Francisco': 8,
      'New York': 5,
      'Austin': 3,
      'Boston': 3,
      'Tel Aviv': 2,
      'Other': 6
    }
  }
}

/**
 * Get comparison data between AI discoveries and manual tracking
 */
function getComparisonData() {
  return {
    aiDiscovered: 1247,
    manualTracked: 892,
    overlap: 869,
    missedPercentage: 18.4,
    lastSyncDate: new Date().toISOString()
  }
}

/**
 * Handle CRM synchronization
 */
async function handleCRMSync() {
  // Simulate CRM sync process
  await new Promise(resolve => setTimeout(resolve, 3000))

  console.log('CRM sync initiated')

  return NextResponse.json({
    success: true,
    data: {
      message: 'CRM synchronization completed',
      syncId: `sync_${Date.now()}`,
      recordsProcessed: 1247,
      newOpportunities: 23,
      updatedRecords: 156,
      syncTime: new Date().toISOString()
    }
  })
}

/**
 * Handle adding opportunity to pipeline
 */
async function handleAddToPipeline(body: any) {
  const { opportunityId, notes } = body

  // Simulate pipeline addition
  await new Promise(resolve => setTimeout(resolve, 800))

  console.log(`Adding opportunity ${opportunityId} to pipeline`)

  return NextResponse.json({
    success: true,
    data: {
      message: 'Opportunity added to pipeline',
      pipelineId: `pipeline_${Date.now()}`,
      opportunityId,
      status: 'added',
      assignedTo: 'Investment Team',
      nextAction: 'Initial screening call'
    }
  })
}

export const runtime = 'nodejs'