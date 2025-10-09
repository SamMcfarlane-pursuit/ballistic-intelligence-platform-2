import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface AnalysisRequest {
  type: 'company' | 'market' | 'vulnerability' | 'conference'
  data: any
  options?: {
    includeComparisons?: boolean
    includeMarketData?: boolean
    depth?: 'quick' | 'detailed'
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        availableAnalysisTypes: [
          'company',
          'market',
          'vulnerability',
          'conference'
        ],
        description: 'Analysis endpoints for comprehensive intelligence',
        usage: 'Use POST method with type and data parameters'
      }
    })
  } catch (error) {
    console.error('Analysis info error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get analysis info' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data, options = {} } = await request.json() as AnalysisRequest
    
    const startTime = Date.now()
    
    switch (type) {
      case 'company':
        return await analyzeCompany(data, options)
      case 'market':
        return await analyzeMarket(data, options)
      case 'vulnerability':
        return await analyzeVulnerability(data, options)
      case 'conference':
        return await analyzeConference(data, options)
      default:
        return NextResponse.json(
          { error: 'Invalid analysis type', success: false },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed', details: error.message, success: false },
      { status: 500 }
    )
  }
}

async function analyzeCompany(companyData: any, options: any) {
  const { companyName, companyId } = companyData
  
  // Find company in database
  let company = null
  if (companyId) {
    company = await db.cybersecurityStartup.findUnique({
      where: { id: companyId },
      include: {
        fundingRounds: { orderBy: { announced_date: 'desc' } },
        teamMembers: true
      }
    })
  } else if (companyName) {
    company = await db.cybersecurityStartup.findFirst({
      where: {
        name: { contains: companyName }
      },
      include: {
        fundingRounds: { orderBy: { announced_date: 'desc' } },
        teamMembers: true
      }
    })
  }

  // Get market comparisons if requested
  let marketComparisons = []
  if (options.includeComparisons && company) {
    marketComparisons = await db.cybersecurityStartup.findMany({
      where: {
        primary_category: company.primary_category,
        id: { not: company.id }
      },
      orderBy: { total_funding: 'desc' },
      take: 5,
      select: {
        name: true,
        total_funding: true,
        current_stage: true,
        employee_count: true
      }
    })
  }

  // Calculate analysis metrics
  const analysis = company ? {
    fundingVelocity: calculateFundingVelocity(company.fundingRounds),
    marketPosition: calculateMarketPosition(company, marketComparisons),
    growthIndicators: calculateGrowthIndicators(company),
    riskFactors: identifyRiskFactors(company),
    investmentScore: calculateInvestmentScore(company)
  } : null

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    type: 'company',
    found: !!company,
    company: company ? {
      id: company.id,
      name: company.name,
      category: company.primary_category,
      stage: company.current_stage,
      totalFunding: company.total_funding,
      employeeCount: company.employee_count,
      foundedYear: company.founded_year
    } : null,
    analysis,
    marketComparisons: options.includeComparisons ? marketComparisons : [],
    recommendation: generateRecommendation(company, analysis),
    confidence: company ? 85 : 30
  })
}

async function analyzeMarket(marketData: any, options: any) {
  const { category, timeframe = '12months' } = marketData
  
  // Get market overview
  const totalCompanies = await db.cybersecurityStartup.count({
    where: category ? { primary_category: category } : undefined
  })
  
  const fundingStats = await db.cybersecurityStartup.aggregate({
    where: category ? { primary_category: category } : undefined,
    _sum: { total_funding: true },
    _avg: { total_funding: true },
    _max: { total_funding: true }
  })

  // Get funding trends by stage
  const stageDistribution = await db.cybersecurityStartup.groupBy({
    by: ['current_stage'],
    where: category ? { primary_category: category } : undefined,
    _count: { current_stage: true },
    _sum: { total_funding: true }
  })

  // Get top companies
  const topCompanies = await db.cybersecurityStartup.findMany({
    where: category ? { primary_category: category } : undefined,
    orderBy: { total_funding: 'desc' },
    take: 10,
    select: {
      name: true,
      total_funding: true,
      current_stage: true,
      primary_category: true,
      employee_count: true
    }
  })

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    type: 'market',
    category: category || 'all',
    metrics: {
      totalCompanies,
      totalFunding: fundingStats._sum.total_funding || 0,
      averageFunding: fundingStats._avg.total_funding || 0,
      maxFunding: fundingStats._max.total_funding || 0
    },
    stageDistribution,
    topCompanies,
    insights: generateMarketInsights(totalCompanies, fundingStats, stageDistribution),
    confidence: 90
  })
}

async function analyzeVulnerability(vulnData: any, options: any) {
  const { severity, affectedSectors, description } = vulnData
  
  // Simple vulnerability impact analysis based on data
  const impactScore = calculateVulnerabilityImpact(severity, affectedSectors)
  const businessRisk = assessBusinessRisk(severity, affectedSectors)
  const marketOpportunity = assessSecurityMarketOpportunity(severity, affectedSectors)
  
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    type: 'vulnerability',
    severity,
    impactScore,
    businessRisk,
    marketOpportunity,
    recommendations: generateVulnerabilityRecommendations(severity, affectedSectors),
    confidence: 75
  })
}

async function analyzeConference(conferenceData: any, options: any) {
  const { conferenceId, companies } = conferenceData
  
  // Get conference data
  const conference = await db.cybersecurityConvention.findUnique({
    where: { id: conferenceId },
    include: {
      conventionCompanies: {
        orderBy: { overall_fit_score: 'desc' }
      }
    }
  })

  if (!conference) {
    return NextResponse.json({
      success: false,
      error: 'Conference not found'
    }, { status: 404 })
  }

  // Analyze conference companies
  const companyAnalysis = analyzeConferenceCompanies(conference.conventionCompanies)
  
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    type: 'conference',
    conference: {
      id: conference.id,
      name: conference.name,
      location: conference.location,
      companiesCount: conference.conventionCompanies.length
    },
    analysis: companyAnalysis,
    recommendations: generateConferenceRecommendations(companyAnalysis),
    confidence: 80
  })
}

// Helper functions
function calculateFundingVelocity(fundingRounds: any[]) {
  if (fundingRounds.length < 2) return 'insufficient_data'
  
  const sortedRounds = fundingRounds.sort((a, b) => 
    new Date(a.announced_date).getTime() - new Date(b.announced_date).getTime()
  )
  
  const timeSpan = new Date(sortedRounds[sortedRounds.length - 1].announced_date).getTime() - 
                   new Date(sortedRounds[0].announced_date).getTime()
  const monthsSpan = timeSpan / (1000 * 60 * 60 * 24 * 30)
  
  return monthsSpan > 0 ? fundingRounds.length / monthsSpan : 0
}

function calculateMarketPosition(company: any, comparisons: any[]) {
  if (comparisons.length === 0) return 'unknown'
  
  const avgFunding = comparisons.reduce((sum, comp) => sum + comp.total_funding, 0) / comparisons.length
  
  if (company.total_funding > avgFunding * 1.5) return 'leader'
  if (company.total_funding > avgFunding * 0.8) return 'competitive'
  return 'emerging'
}

function calculateGrowthIndicators(company: any) {
  const indicators = []
  
  if (company.employee_count > 100) indicators.push('scaling_team')
  if (company.total_funding > 10000000) indicators.push('well_funded')
  if (company.funding_rounds_count > 3) indicators.push('multiple_rounds')
  
  return indicators
}

function identifyRiskFactors(company: any) {
  const risks = []
  
  if (company.employee_count < 10) risks.push('small_team')
  if (company.total_funding < 1000000) risks.push('limited_funding')
  if (!company.website) risks.push('limited_online_presence')
  
  return risks
}

function calculateInvestmentScore(company: any) {
  let score = 50 // Base score
  
  // Funding factors
  if (company.total_funding > 50000000) score += 20
  else if (company.total_funding > 10000000) score += 15
  else if (company.total_funding > 1000000) score += 10
  
  // Team size factors
  if (company.employee_count > 200) score += 15
  else if (company.employee_count > 50) score += 10
  else if (company.employee_count > 10) score += 5
  
  // Stage factors
  if (company.current_stage === 'series-c') score += 15
  else if (company.current_stage === 'series-b') score += 10
  else if (company.current_stage === 'series-a') score += 5
  
  return Math.min(100, Math.max(0, score))
}

function generateRecommendation(company: any, analysis: any) {
  if (!company) return 'research_needed'
  
  const score = analysis?.investmentScore || 0
  
  if (score >= 80) return 'strong_buy'
  if (score >= 65) return 'buy'
  if (score >= 45) return 'hold'
  return 'avoid'
}

function generateMarketInsights(totalCompanies: number, fundingStats: any, stageDistribution: any[]) {
  const insights = []
  
  if (totalCompanies > 100) {
    insights.push('Large and active market segment')
  }
  
  const avgFunding = fundingStats._avg.total_funding || 0
  if (avgFunding > 10000000) {
    insights.push('High average funding indicates mature market')
  }
  
  const seriesACount = stageDistribution.find(s => s.current_stage === 'series-a')?._count.current_stage || 0
  if (seriesACount > totalCompanies * 0.3) {
    insights.push('Strong Series A activity suggests healthy growth stage')
  }
  
  return insights
}

function calculateVulnerabilityImpact(severity: string, affectedSectors: string[]) {
  let score = 0
  
  switch (severity?.toLowerCase()) {
    case 'critical': score += 40; break
    case 'high': score += 30; break
    case 'medium': score += 20; break
    case 'low': score += 10; break
  }
  
  if (affectedSectors?.length > 5) score += 30
  else if (affectedSectors?.length > 2) score += 20
  else score += 10
  
  return Math.min(100, score)
}

function assessBusinessRisk(severity: string, affectedSectors: string[]) {
  const criticalSectors = ['finance', 'healthcare', 'government', 'energy']
  const hasCriticalSectors = affectedSectors?.some(sector => 
    criticalSectors.includes(sector.toLowerCase())
  )
  
  if (severity === 'critical' && hasCriticalSectors) return 'very_high'
  if (severity === 'critical' || hasCriticalSectors) return 'high'
  if (severity === 'high') return 'medium'
  return 'low'
}

function assessSecurityMarketOpportunity(severity: string, affectedSectors: string[]) {
  if (severity === 'critical' && affectedSectors?.length > 3) {
    return 'high_opportunity'
  }
  if (severity === 'high' || affectedSectors?.length > 2) {
    return 'medium_opportunity'
  }
  return 'low_opportunity'
}

function generateVulnerabilityRecommendations(severity: string, affectedSectors: string[]) {
  const recommendations = []
  
  if (severity === 'critical') {
    recommendations.push('Immediate patching required')
    recommendations.push('Consider security solution investments')
  }
  
  if (affectedSectors?.length > 3) {
    recommendations.push('Monitor security vendors for opportunities')
  }
  
  recommendations.push('Track remediation timeline for market impact')
  
  return recommendations
}

function analyzeConferenceCompanies(companies: any[]) {
  const totalCompanies = companies.length
  const highScoreCompanies = companies.filter(c => c.overall_fit_score > 70).length
  const avgScore = companies.reduce((sum, c) => sum + c.overall_fit_score, 0) / totalCompanies
  
  const categoryDistribution = companies.reduce((acc, company) => {
    const category = company.cybersecurity_category || 'unknown'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})
  
  return {
    totalCompanies,
    highScoreCompanies,
    averageScore: Math.round(avgScore),
    categoryDistribution,
    topCompanies: companies.slice(0, 5).map(c => ({
      name: c.company_name,
      score: c.overall_fit_score,
      category: c.cybersecurity_category
    }))
  }
}

function generateConferenceRecommendations(analysis: any) {
  const recommendations = []
  
  if (analysis.highScoreCompanies > 5) {
    recommendations.push('High-quality conference with multiple investment opportunities')
  }
  
  if (analysis.averageScore > 60) {
    recommendations.push('Above-average company quality, worth detailed review')
  }
  
  recommendations.push(`Focus on top ${Math.min(5, analysis.highScoreCompanies)} companies for follow-up`)
  
  return recommendations
}