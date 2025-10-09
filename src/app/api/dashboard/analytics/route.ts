import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric') || 'overview'
    const timeframe = searchParams.get('timeframe') || '30d'

    switch (metric) {
      case 'funding-trends':
        return await getFundingTrends(timeframe)
      case 'market-analysis':
        return await getMarketAnalysis()
      case 'performance-metrics':
        return await getPerformanceMetrics()
      case 'investment-pipeline':
        return await getInvestmentPipeline()
      default:
        return await getAnalyticsOverview()
    }
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load analytics' },
      { status: 500 }
    )
  }
}

async function getFundingTrends(timeframe: string) {
  const companies = await db.cybersecurityStartup.findMany({
    select: {
      name: true,
      total_funding: true,
      current_stage: true,
      primary_category: true,
      founded_year: true
    }
  })

  // Group by funding stage
  const stageData = companies.reduce((acc, company) => {
    const stage = company.current_stage || 'unknown'
    if (!acc[stage]) {
      acc[stage] = { count: 0, totalFunding: 0, companies: [] }
    }
    acc[stage].count++
    acc[stage].totalFunding += company.total_funding || 0
    acc[stage].companies.push(company.name)
    return acc
  }, {} as Record<string, any>)

  // Funding by year (estimated based on stage)
  const yearlyData = companies.reduce((acc, company) => {
    const estimatedYear = company.founded_year + (getStageYearOffset(company.current_stage))
    const year = Math.min(estimatedYear, new Date().getFullYear())
    
    if (!acc[year]) {
      acc[year] = { funding: 0, deals: 0 }
    }
    acc[year].funding += company.total_funding || 0
    acc[year].deals++
    return acc
  }, {} as Record<number, any>)

  return NextResponse.json({
    success: true,
    data: {
      stageBreakdown: Object.entries(stageData).map(([stage, data]) => ({
        stage,
        count: data.count,
        totalFunding: data.totalFunding,
        averageFunding: data.totalFunding / data.count,
        companies: data.companies.slice(0, 3)
      })),
      yearlyTrends: Object.entries(yearlyData)
        .map(([year, data]) => ({
          year: parseInt(year),
          funding: data.funding,
          deals: data.deals,
          averageDeal: data.funding / data.deals
        }))
        .sort((a, b) => a.year - b.year)
        .slice(-5) // Last 5 years
    },
    metadata: {
      dataSources: 'Crunchbase API, GrowthList, OpenVC, SEC EDGAR',
      dataFreshness: 'Updated daily',
      analysisType: 'funding-trends',
      totalSources: 7
    }
  })
}

async function getMarketAnalysis() {
  const [companies, categoryData] = await Promise.all([
    db.cybersecurityStartup.findMany({
      select: {
        primary_category: true,
        total_funding: true,
        employee_count: true,
        current_stage: true
      }
    }),
    db.cybersecurityStartup.groupBy({
      by: ['primary_category'],
      _count: { primary_category: true },
      _sum: { total_funding: true },
      _avg: { total_funding: true }
    })
  ])

  const marketMap = categoryData.map(category => ({
    category: category.primary_category,
    companies: category._count.primary_category,
    totalFunding: category._sum.total_funding || 0,
    averageFunding: category._avg.total_funding || 0,
    marketShare: ((category._sum.total_funding || 0) / companies.reduce((sum, c) => sum + (c.total_funding || 0), 0)) * 100
  })).sort((a, b) => b.totalFunding - a.totalFunding)

  // Competition analysis
  const competitionMetrics = {
    totalMarketSize: companies.reduce((sum, c) => sum + (c.total_funding || 0), 0),
    averageCompanySize: companies.reduce((sum, c) => sum + (c.employee_count || 0), 0) / companies.length,
    maturityDistribution: companies.reduce((acc, c) => {
      const stage = c.current_stage || 'unknown'
      acc[stage] = (acc[stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  return NextResponse.json({
    success: true,
    data: {
      marketMap,
      competitionMetrics,
      insights: generateMarketInsights(marketMap, competitionMetrics)
    }
  })
}

async function getPerformanceMetrics() {
  const [companies, portfolio] = await Promise.all([
    db.cybersecurityStartup.findMany({
      select: {
        total_funding: true,
        employee_count: true,
        current_stage: true,
        primary_category: true
      }
    }),
    db.ballisticPortfolioCompany.findMany({
      select: {
        funding_amount: true,
        market_traction: true,
        active_users: true,
        paying_customers: true,
        mssp_integration: true
      }
    })
  ])

  const performanceMetrics = {
    // Company performance
    fundingEfficiency: companies.filter(c => c.total_funding > 0).length / companies.length * 100,
    scaleMetrics: {
      averageEmployees: companies.reduce((sum, c) => sum + (c.employee_count || 0), 0) / companies.length,
      fundingPerEmployee: companies.reduce((sum, c) => sum + ((c.total_funding || 0) / Math.max(c.employee_count || 1, 1)), 0) / companies.length
    },
    
    // Portfolio performance
    portfolioHealth: {
      activeUsers: portfolio.filter(p => p.active_users).length / Math.max(portfolio.length, 1) * 100,
      payingCustomers: portfolio.filter(p => p.paying_customers).length / Math.max(portfolio.length, 1) * 100,
      mssp: portfolio.filter(p => p.mssp_integration).length / Math.max(portfolio.length, 1) * 100,
      averageTraction: portfolio.reduce((sum, p) => sum + (p.market_traction || 0), 0) / Math.max(portfolio.length, 1)
    },
    
    // Investment metrics
    investmentMetrics: {
      totalDeployed: portfolio.reduce((sum, p) => sum + (p.funding_amount || 0), 0),
      averageInvestment: portfolio.reduce((sum, p) => sum + (p.funding_amount || 0), 0) / Math.max(portfolio.length, 1),
      portfolioCount: portfolio.length
    }
  }

  return NextResponse.json({
    success: true,
    data: performanceMetrics
  })
}

async function getInvestmentPipeline() {
  const [companies, portfolio, conventions] = await Promise.all([
    db.cybersecurityStartup.findMany({
      where: {
        current_stage: {
          in: ['seed', 'series-a', 'series-b']
        }
      },
      select: {
        id: true,
        name: true,
        primary_category: true,
        total_funding: true,
        current_stage: true,
        employee_count: true
      },
      orderBy: { total_funding: 'desc' },
      take: 20
    }),
    db.ballisticPortfolioCompany.findMany({
      select: {
        name: true,
        funding_stage: true,
        market_traction: true,
        active_users: true,
        paying_customers: true
      }
    }),
    db.cybersecurityConvention.findMany({
      where: { is_active: true },
      include: {
        conventionCompanies: {
          where: {
            overall_fit_score: { gt: 70 }
          },
          select: {
            company_name: true,
            overall_fit_score: true,
            cybersecurity_category: true
          }
        }
      }
    })
  ])

  // Investment opportunities
  const opportunities = companies.map(company => ({
    id: company.id,
    name: company.name,
    category: company.primary_category,
    stage: company.current_stage,
    funding: company.total_funding,
    employees: company.employee_count,
    score: calculateInvestmentScore(company),
    recommendation: getInvestmentRecommendation(company)
  })).sort((a, b) => b.score - a.score)

  // Pipeline metrics
  const pipelineMetrics = {
    totalOpportunities: opportunities.length,
    highPotential: opportunities.filter(o => o.score > 80).length,
    mediumPotential: opportunities.filter(o => o.score > 60 && o.score <= 80).length,
    averageScore: opportunities.reduce((sum, o) => sum + o.score, 0) / opportunities.length,
    stageDistribution: opportunities.reduce((acc, o) => {
      acc[o.stage] = (acc[o.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  // Convention prospects
  const conventionProspects = conventions.flatMap(conv => 
    conv.conventionCompanies.map(company => ({
      conventionName: conv.name,
      companyName: company.company_name,
      category: company.cybersecurity_category,
      score: company.overall_fit_score
    }))
  ).sort((a, b) => b.score - a.score).slice(0, 10)

  return NextResponse.json({
    success: true,
    data: {
      opportunities: opportunities.slice(0, 10),
      pipelineMetrics,
      conventionProspects,
      portfolioStatus: {
        totalPortfolio: portfolio.length,
        activePortfolio: portfolio.filter(p => p.active_users).length,
        payingPortfolio: portfolio.filter(p => p.paying_customers).length
      }
    }
  })
}

async function getAnalyticsOverview() {
  const [totalCompanies, totalFunding, avgFunding] = await Promise.all([
    db.cybersecurityStartup.count(),
    db.cybersecurityStartup.aggregate({
      _sum: { total_funding: true }
    }),
    db.cybersecurityStartup.aggregate({
      _avg: { total_funding: true }
    })
  ])

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        totalCompanies,
        totalFunding: totalFunding._sum.total_funding || 0,
        averageFunding: avgFunding._avg.total_funding || 0
      },
      quickStats: {
        marketSize: totalFunding._sum.total_funding || 0,
        companiesTracked: totalCompanies,
        averageValuation: avgFunding._avg.total_funding || 0
      }
    }
  })
}

// Helper functions
function getStageYearOffset(stage: string | null): number {
  const offsets: Record<string, number> = {
    'seed': 1,
    'series-a': 2,
    'series-b': 4,
    'series-c': 6,
    'series-d': 8,
    'ipo': 10
  }
  return offsets[stage || 'seed'] || 1
}

function calculateInvestmentScore(company: any): number {
  let score = 50
  
  // Funding traction
  if (company.total_funding > 50000000) score += 25
  else if (company.total_funding > 10000000) score += 20
  else if (company.total_funding > 1000000) score += 15
  else if (company.total_funding > 0) score += 10
  
  // Team size
  if (company.employee_count > 100) score += 15
  else if (company.employee_count > 50) score += 12
  else if (company.employee_count > 20) score += 10
  else if (company.employee_count > 10) score += 8
  
  // Stage maturity
  const stageScores: Record<string, number> = {
    'series-b': 10,
    'series-a': 8,
    'seed': 5
  }
  score += stageScores[company.current_stage] || 0
  
  return Math.min(100, score)
}

function getInvestmentRecommendation(company: any): string {
  const score = calculateInvestmentScore(company)
  if (score >= 85) return 'strong_buy'
  if (score >= 70) return 'buy'
  if (score >= 55) return 'hold'
  return 'research'
}

function generateMarketInsights(marketMap: any[], metrics: any): string[] {
  const insights = []
  
  const topCategory = marketMap[0]
  if (topCategory) {
    insights.push(`${topCategory.category} leads with ${topCategory.companies} companies and $${(topCategory.totalFunding / 1000000).toFixed(0)}M funding`)
  }
  
  const totalMarket = marketMap.reduce((sum, m) => sum + m.totalFunding, 0)
  insights.push(`Total market size: $${(totalMarket / 1000000000).toFixed(1)}B across ${marketMap.length} categories`)
  
  const avgCompanies = marketMap.reduce((sum, m) => sum + m.companies, 0) / marketMap.length
  insights.push(`Average ${avgCompanies.toFixed(0)} companies per category`)
  
  return insights
}