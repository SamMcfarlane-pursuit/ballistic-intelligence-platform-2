/**
 * Executive Dashboard API
 * Provides comprehensive executive-level analytics and actionable intelligence
 * Handles portfolio management, investment opportunities, and strategic actions
 */

import { NextRequest, NextResponse } from 'next/server'
import { sanitizeText, checkRateLimit } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const rateLimit = checkRateLimit(clientIP, 60, 60000) // Higher limit for executives

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = sanitizeText(searchParams.get('action') || '')
    const timeframe = sanitizeText(searchParams.get('timeframe') || '30d')
    const sector = sanitizeText(searchParams.get('sector') || 'all')

    switch (action) {
      case 'metrics':
        return NextResponse.json({
          success: true,
          data: await getExecutiveMetrics(timeframe, sector)
        })

      case 'opportunities':
        return NextResponse.json({
          success: true,
          data: await getInvestmentOpportunities(sector)
        })

      case 'portfolio':
        return NextResponse.json({
          success: true,
          data: await getPortfolioPerformance(timeframe)
        })

      case 'market-intelligence':
        return NextResponse.json({
          success: true,
          data: await getMarketIntelligence()
        })

      case 'analytics':
        return NextResponse.json({
          success: true,
          data: await getAdvancedAnalytics(timeframe)
        })

      case 'actions':
        return NextResponse.json({
          success: true,
          data: await getPendingActions()
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Executive API Error:', error)
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
    const rateLimit = checkRateLimit(clientIP, 30, 60000) // 30 requests per minute

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
      case 'execute-action':
        return await handleExecuteAction(body)

      case 'generate-report':
        return await handleGenerateReport(body)

      case 'schedule-meeting':
        return await handleScheduleMeeting(body)

      case 'update-investment':
        return await handleUpdateInvestment(body)

      case 'risk-assessment':
        return await handleRiskAssessment(body)

      case 'market-analysis':
        return await handleMarketAnalysis(body)

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Executive POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * Get executive-level metrics and KPIs
 */
async function getExecutiveMetrics(timeframe: string, sector: string) {
  // Simulate comprehensive metrics calculation
  await new Promise(resolve => setTimeout(resolve, 800))

  const baseMetrics = {
    totalFunding: 2400000000,
    totalCompanies: 156,
    avgFundingSize: 15400000,
    portfolioValue: 1200000000,
    activeDeals: 8,
    pipelineValue: 450000000
  }

  // Adjust metrics based on timeframe and sector
  const timeframeMultiplier = timeframe === '7d' ? 0.2 : timeframe === '90d' ? 2.5 : timeframe === '1y' ? 4.0 : 1.0
  const sectorMultiplier = sector === 'all' ? 1.0 : 0.3

  return {
    ...baseMetrics,
    totalFunding: Math.round(baseMetrics.totalFunding * timeframeMultiplier * sectorMultiplier),
    totalCompanies: Math.round(baseMetrics.totalCompanies * sectorMultiplier),
    portfolioValue: Math.round(baseMetrics.portfolioValue * sectorMultiplier),
    topSectors: [
      { name: 'Cloud Security', count: 45, funding: 680000000, growth: 32 },
      { name: 'Identity & Access', count: 32, funding: 520000000, growth: 28 },
      { name: 'AI Security', count: 26, funding: 450000000, growth: 45 },
      { name: 'Zero Trust', count: 25, funding: 380000000, growth: 25 },
      { name: 'Threat Intelligence', count: 28, funding: 370000000, growth: 22 }
    ],
    fundingTrend: [
      { month: 'Jan', amount: 180000000, deals: 12, growth: 15 },
      { month: 'Feb', amount: 220000000, deals: 15, growth: 22 },
      { month: 'Mar', amount: 195000000, deals: 13, growth: -11 },
      { month: 'Apr', amount: 240000000, deals: 16, growth: 23 },
      { month: 'May', amount: 280000000, deals: 18, growth: 17 },
      { month: 'Jun', amount: 320000000, deals: 21, growth: 14 }
    ],
    performanceMetrics: {
      avgROI: 247,
      successRate: 78,
      timeToExit: 4.2,
      portfolioIRR: 32
    }
  }
}

/**
 * Get investment opportunities with detailed analysis
 */
async function getInvestmentOpportunities(sector: string) {
  await new Promise(resolve => setTimeout(resolve, 600))

  const allOpportunities = [
    {
      id: '1',
      companyName: 'CyberGuard Pro',
      sector: 'Cloud Security',
      fundingStage: 'Series A',
      fundingAmount: 15000000,
      momentum: 92,
      riskScore: 25,
      recommendation: 'strong_buy',
      keyMetrics: {
        teamScore: 95,
        marketSize: 88,
        traction: 85,
        technology: 92,
        competitive: 78
      },
      recentSignals: [
        { type: 'Partnership', description: 'Strategic partnership with AWS', date: '2024-10-10', impact: 'positive' },
        { type: 'Customer Win', description: 'Fortune 500 enterprise client', date: '2024-10-08', impact: 'positive' },
        { type: 'Product Launch', description: 'AI-powered threat detection', date: '2024-10-05', impact: 'positive' }
      ],
      nextActions: [
        'Schedule due diligence call',
        'Review technical architecture',
        'Validate customer references',
        'Negotiate term sheet'
      ],
      financials: {
        revenue: 2400000,
        growth: 180,
        burnRate: 350000,
        runway: 18
      }
    },
    {
      id: '2',
      companyName: 'SecureFlow AI',
      sector: 'AI Security',
      fundingStage: 'Seed',
      fundingAmount: 8500000,
      momentum: 78,
      riskScore: 45,
      recommendation: 'buy',
      keyMetrics: {
        teamScore: 82,
        marketSize: 95,
        traction: 65,
        technology: 88,
        competitive: 72
      },
      recentSignals: [
        { type: 'Executive Hire', description: 'Former Google VP joins as CTO', date: '2024-10-12', impact: 'positive' },
        { type: 'Funding', description: 'Oversubscribed seed round', date: '2024-10-01', impact: 'positive' }
      ],
      nextActions: [
        'Technical deep dive session',
        'Market analysis review',
        'Competitive positioning assessment'
      ],
      financials: {
        revenue: 850000,
        growth: 220,
        burnRate: 180000,
        runway: 24
      }
    },
    {
      id: '3',
      companyName: 'ZeroTrust Networks',
      sector: 'Zero Trust',
      fundingStage: 'Series B',
      fundingAmount: 22000000,
      momentum: 85,
      riskScore: 35,
      recommendation: 'buy',
      keyMetrics: {
        teamScore: 88,
        marketSize: 85,
        traction: 82,
        technology: 85,
        competitive: 80
      },
      recentSignals: [
        { type: 'Customer Win', description: 'Government contract secured', date: '2024-10-11', impact: 'positive' },
        { type: 'Partnership', description: 'Microsoft integration announced', date: '2024-10-07', impact: 'positive' }
      ],
      nextActions: [
        'Government contract analysis',
        'Scalability assessment',
        'Partnership impact evaluation'
      ],
      financials: {
        revenue: 5200000,
        growth: 145,
        burnRate: 580000,
        runway: 20
      }
    }
  ]

  // Filter by sector if specified
  if (sector !== 'all') {
    return allOpportunities.filter(opp => 
      opp.sector.toLowerCase().includes(sector.toLowerCase())
    )
  }

  return allOpportunities
}

/**
 * Get portfolio performance data with detailed trend analysis
 */
async function getPortfolioPerformance(timeframe: string) {
  await new Promise(resolve => setTimeout(resolve, 700))

  return [
    {
      name: 'CyberSecure',
      sector: 'Cloud Security',
      investmentAmount: 12000000,
      currentValuation: 85000000,
      momentum: 88,
      lastUpdate: '2024-10-12',
      status: 'thriving',
      keyEvents: [
        { type: 'Partnership', description: 'Major cloud provider integration', date: '2024-10-10' },
        { type: 'Revenue', description: '150% YoY growth achieved', date: '2024-10-05' },
        { type: 'Expansion', description: 'European market entry', date: '2024-09-28' }
      ],
      metrics: {
        revenue: 8500000,
        growth: 150,
        customers: 245,
        nps: 72
      },
      monthlyTrend: [
        { month: 'Jan', valuation: 12000000, revenue: 1200000, growth: 15 },
        { month: 'Feb', valuation: 15000000, revenue: 1500000, growth: 25 },
        { month: 'Mar', valuation: 18000000, revenue: 1800000, growth: 20 },
        { month: 'Apr', valuation: 22000000, revenue: 2200000, growth: 22 },
        { month: 'May', valuation: 28000000, revenue: 2800000, growth: 27 },
        { month: 'Jun', valuation: 35000000, revenue: 3500000, growth: 25 }
      ],
      aiInsights: {
        prediction: "Strong momentum driven by AWS partnership and enterprise client acquisition. Projected to reach $50M valuation by Q4 2024.",
        confidence: 94,
        riskFactors: ["Market saturation", "Competitive pressure"],
        opportunities: ["Government contracts", "International expansion"],
        recommendation: "Increase investment allocation"
      }
    },
    {
      name: 'ZeroTrust Pro',
      sector: 'Zero Trust',
      investmentAmount: 8000000,
      currentValuation: 45000000,
      momentum: 72,
      lastUpdate: '2024-10-11',
      status: 'growing',
      keyEvents: [
        { type: 'Product Launch', description: 'Next-gen identity platform', date: '2024-10-08' },
        { type: 'Team', description: 'VP Engineering hired', date: '2024-10-03' },
        { type: 'Funding', description: 'Series A extension completed', date: '2024-09-25' }
      ],
      metrics: {
        revenue: 3200000,
        growth: 125,
        customers: 128,
        nps: 68
      },
      monthlyTrend: [
        { month: 'Jan', valuation: 8000000, revenue: 800000, growth: 12 },
        { month: 'Feb', valuation: 9000000, revenue: 900000, growth: 12.5 },
        { month: 'Mar', valuation: 11000000, revenue: 1100000, growth: 22 },
        { month: 'Apr', valuation: 14000000, revenue: 1400000, growth: 27 },
        { month: 'May', valuation: 18000000, revenue: 1800000, growth: 29 },
        { month: 'Jun', valuation: 22000000, revenue: 2200000, growth: 22 }
      ],
      aiInsights: {
        prediction: "Steady growth with government contract providing stability. Zero-trust market expansion creating new opportunities.",
        confidence: 87,
        riskFactors: ["Slow enterprise adoption", "Technical complexity"],
        opportunities: ["Federal contracts", "SMB market entry"],
        recommendation: "Maintain current position"
      }
    },
    {
      name: 'ThreatIntel Corp',
      sector: 'Threat Intelligence',
      investmentAmount: 15000000,
      currentValuation: 35000000,
      momentum: 45,
      lastUpdate: '2024-10-10',
      status: 'concerning',
      keyEvents: [
        { type: 'Challenge', description: 'Customer acquisition slowdown', date: '2024-10-07' },
        { type: 'Pivot', description: 'Product strategy adjustment', date: '2024-10-02' },
        { type: 'Leadership', description: 'New CMO appointed', date: '2024-09-20' }
      ],
      metrics: {
        revenue: 2100000,
        growth: 45,
        customers: 89,
        nps: 52
      },
      monthlyTrend: [
        { month: 'Jan', valuation: 15000000, revenue: 1500000, growth: 18 },
        { month: 'Feb', valuation: 16000000, revenue: 1600000, growth: 7 },
        { month: 'Mar', valuation: 14000000, revenue: 1400000, growth: -12 },
        { month: 'Apr', valuation: 12000000, revenue: 1200000, growth: -14 },
        { month: 'May', valuation: 10000000, revenue: 1000000, growth: -17 },
        { month: 'Jun', valuation: 8000000, revenue: 800000, growth: -20 }
      ],
      aiInsights: {
        prediction: "Declining trend due to customer churn. Recommend immediate intervention and product pivot strategy review.",
        confidence: 91,
        riskFactors: ["Customer churn", "Product-market fit", "Competitive pressure"],
        opportunities: ["Product pivot", "New market segments", "Strategic partnership"],
        recommendation: "Urgent intervention required"
      }
    }
  ]
}

/**
 * Get market intelligence data
 */
async function getMarketIntelligence() {
  await new Promise(resolve => setTimeout(resolve, 900))

  return {
    sectorTrends: [
      { sector: 'AI Security', growth: 45, fundingVolume: 890000000, dealCount: 34, avgValuation: 26200000 },
      { sector: 'Cloud Security', growth: 32, fundingVolume: 1200000000, dealCount: 48, avgValuation: 25000000 },
      { sector: 'Zero Trust', growth: 28, fundingVolume: 650000000, dealCount: 26, avgValuation: 25000000 },
      { sector: 'Identity & Access', growth: 25, fundingVolume: 580000000, dealCount: 29, avgValuation: 20000000 },
      { sector: 'Threat Intelligence', growth: 22, fundingVolume: 450000000, dealCount: 22, avgValuation: 20500000 }
    ],
    competitiveThreats: [
      { 
        company: 'CrowdStrike', 
        threat: 'Market consolidation', 
        severity: 'high', 
        description: 'Aggressive acquisition strategy targeting our portfolio sectors',
        impact: 'May increase acquisition prices and reduce available targets'
      },
      { 
        company: 'Palo Alto Networks', 
        threat: 'Platform expansion', 
        severity: 'medium', 
        description: 'Expanding into adjacent security markets',
        impact: 'Could compete with portfolio companies in new verticals'
      },
      { 
        company: 'Microsoft', 
        threat: 'Integrated solutions', 
        severity: 'high', 
        description: 'Bundling security with core products',
        impact: 'May commoditize certain security categories'
      }
    ],
    emergingTechnologies: [
      { 
        technology: 'Quantum-Safe Cryptography', 
        adoptionRate: 15, 
        marketPotential: 95, 
        companies: ['QuantumSecure', 'CryptoShield'],
        timeline: '2-3 years to mainstream adoption'
      },
      { 
        technology: 'AI-Powered SOC', 
        adoptionRate: 35, 
        marketPotential: 88, 
        companies: ['AutoSOC', 'IntelliSecure'],
        timeline: '1-2 years to mainstream adoption'
      },
      { 
        technology: 'Behavioral Biometrics', 
        adoptionRate: 25, 
        marketPotential: 82, 
        companies: ['BioSecure', 'IdentityAI'],
        timeline: '2-4 years to mainstream adoption'
      }
    ],
    marketForces: {
      regulatoryChanges: [
        { regulation: 'EU Cyber Resilience Act', impact: 'high', timeline: '2025' },
        { regulation: 'US Federal Zero Trust Strategy', impact: 'medium', timeline: '2024-2025' }
      ],
      economicFactors: {
        cybersecuritySpending: { growth: 12.5, total: 173000000000 },
        ventureInvestment: { growth: -15.2, total: 7800000000 },
        publicMarketMultiples: { average: 8.5, trend: 'declining' }
      }
    }
  }
}

/**
 * Get advanced analytics data
 */
async function getAdvancedAnalytics(timeframe: string) {
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    performanceMetrics: {
      avgROI: 247,
      successRate: 78,
      timeToExit: 4.2,
      portfolioIRR: 32,
      benchmarkComparison: {
        industryAvgROI: 185,
        industrySuccessRate: 65,
        industryIRR: 24
      }
    },
    riskAnalysis: {
      portfolioRisk: 'medium',
      riskFactors: [
        { factor: 'Market Risk', level: 'medium', score: 65 },
        { factor: 'Technology Risk', level: 'high', score: 78 },
        { factor: 'Competitive Risk', level: 'low', score: 35 },
        { factor: 'Regulatory Risk', level: 'medium', score: 55 }
      ],
      diversification: {
        sectorDiversification: 85,
        stageDiversification: 72,
        geographicDiversification: 45
      }
    },
    predictiveAnalytics: {
      expectedReturns: {
        nextQuarter: 15.2,
        nextYear: 28.5,
        threeYear: 185.0
      },
      marketTrends: {
        aiSecurityGrowth: 45,
        cloudSecurityMaturity: 78,
        zeroTrustAdoption: 62
      }
    }
  }
}

/**
 * Get pending actions and tasks
 */
async function getPendingActions() {
  await new Promise(resolve => setTimeout(resolve, 400))

  return {
    immediateActions: [
      {
        id: '1',
        action: 'Schedule due diligence call',
        company: 'CyberGuard Pro',
        priority: 'high',
        deadline: '2024-10-15',
        type: 'investment'
      },
      {
        id: '2',
        action: 'Review Q3 performance',
        company: 'ThreatIntel Corp',
        priority: 'high',
        deadline: '2024-10-14',
        type: 'portfolio'
      },
      {
        id: '3',
        action: 'Negotiate term sheet',
        company: 'SecureFlow AI',
        priority: 'medium',
        deadline: '2024-10-18',
        type: 'investment'
      }
    ],
    scheduledActions: [
      {
        id: '4',
        action: 'Board Meeting - CyberSecure',
        datetime: '2024-10-14T14:00:00Z',
        type: 'meeting',
        attendees: ['CEO', 'CTO', 'Board Members']
      },
      {
        id: '5',
        action: 'Due Diligence Call - SecureFlow AI',
        datetime: '2024-10-18T10:00:00Z',
        type: 'meeting',
        attendees: ['Founding Team', 'Technical Lead']
      },
      {
        id: '6',
        action: 'Portfolio Review - Q4 2024',
        datetime: '2024-10-21T09:00:00Z',
        type: 'review',
        attendees: ['Investment Team', 'Partners']
      }
    ],
    upcomingDeadlines: [
      { task: 'Q3 Portfolio Report', deadline: '2024-10-15', status: 'in_progress' },
      { task: 'Market Analysis Update', deadline: '2024-10-20', status: 'pending' },
      { task: 'Risk Assessment Review', deadline: '2024-10-25', status: 'pending' }
    ]
  }
}

/**
 * Handle action execution
 */
async function handleExecuteAction(body: any) {
  const { actionType, companyName, details } = body

  // Simulate action execution
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log(`Executing action: ${actionType} for ${companyName}`)

  return NextResponse.json({
    success: true,
    data: {
      message: `Action "${actionType}" initiated for ${companyName}`,
      actionId: `action_${Date.now()}`,
      status: 'initiated',
      estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  })
}

/**
 * Handle report generation
 */
async function handleGenerateReport(body: any) {
  const { reportType, parameters } = body

  // Simulate report generation
  await new Promise(resolve => setTimeout(resolve, 1500))

  console.log(`Generating report: ${reportType}`)

  return NextResponse.json({
    success: true,
    data: {
      message: `${reportType} report generation started`,
      reportId: `report_${Date.now()}`,
      status: 'generating',
      estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      deliveryMethod: 'email'
    }
  })
}

/**
 * Handle meeting scheduling
 */
async function handleScheduleMeeting(body: any) {
  const { meetingType, companyName, datetime, attendees } = body

  // Simulate meeting scheduling
  await new Promise(resolve => setTimeout(resolve, 800))

  return NextResponse.json({
    success: true,
    data: {
      message: `${meetingType} scheduled with ${companyName}`,
      meetingId: `meeting_${Date.now()}`,
      datetime: datetime,
      attendees: attendees,
      calendarLink: 'https://calendar.example.com/meeting-link'
    }
  })
}

/**
 * Handle investment updates
 */
async function handleUpdateInvestment(body: any) {
  const { companyName, updateType, data } = body

  // Simulate investment update
  await new Promise(resolve => setTimeout(resolve, 600))

  return NextResponse.json({
    success: true,
    data: {
      message: `Investment ${updateType} updated for ${companyName}`,
      updateId: `update_${Date.now()}`,
      timestamp: new Date().toISOString()
    }
  })
}

/**
 * Handle risk assessment
 */
async function handleRiskAssessment(body: any) {
  const { scope, parameters } = body

  // Simulate risk assessment
  await new Promise(resolve => setTimeout(resolve, 2000))

  return NextResponse.json({
    success: true,
    data: {
      message: `Risk assessment initiated for ${scope}`,
      assessmentId: `risk_${Date.now()}`,
      status: 'analyzing',
      estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    }
  })
}

/**
 * Handle market analysis
 */
async function handleMarketAnalysis(body: any) {
  const { sector, analysisType } = body

  // Simulate market analysis
  await new Promise(resolve => setTimeout(resolve, 1800))

  return NextResponse.json({
    success: true,
    data: {
      message: `Market analysis started for ${sector}`,
      analysisId: `market_${Date.now()}`,
      status: 'processing',
      estimatedCompletion: new Date(Date.now() + 45 * 60 * 1000).toISOString()
    }
  })
}

export const runtime = 'nodejs'