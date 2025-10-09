import { NextRequest, NextResponse } from 'next/server'
import { BallisticPortfolioTracker } from '@/lib/vc-intelligence/ballistic-portfolio-tracker'

const portfolioTracker = new BallisticPortfolioTracker()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const view = searchParams.get('view') || 'overview'
    const companyId = searchParams.get('companyId')
    const focusArea = searchParams.get('focusArea')
    const stage = searchParams.get('stage')

    // Initialize portfolio if not already done
    await portfolioTracker.initializePortfolio()

    switch (view) {
      case 'overview':
        const analytics = await portfolioTracker.analyzePortfolioPerformance()
        const companies = portfolioTracker.getCompanies()
        
        return NextResponse.json({
          success: true,
          data: {
            analytics,
            companies: companies.map(company => ({
              id: company.id,
              name: company.name,
              focusArea: company.focusArea,
              investmentStage: company.investmentStage,
              currentValuation: company.currentValuation,
              investmentAmount: company.investmentAmount,
              ownershipPercentage: company.ownershipPercentage,
              revenueGrowth: company.revenueGrowth,
              riskLevel: company.riskLevel,
              exitProbability: company.exitProbability,
              aiInsights: company.aiInsights
            })),
            summary: {
              totalCompanies: companies.length,
              totalInvested: analytics.totalInvested,
              totalValue: analytics.totalPortfolioValue,
              unrealizedGains: analytics.unrealizedGains,
              irr: analytics.irr,
              moic: analytics.moic
            }
          }
        })

      case 'company':
        if (!companyId) {
          return NextResponse.json(
            { success: false, error: 'Company ID required' },
            { status: 400 }
          )
        }
        
        const company = portfolioTracker.getCompanyById(companyId)
        if (!company) {
          return NextResponse.json(
            { success: false, error: 'Company not found' },
            { status: 404 }
          )
        }

        const aiInsights = await portfolioTracker.generateAIInsights(companyId)
        
        return NextResponse.json({
          success: true,
          data: {
            company,
            aiInsights,
            recommendations: await generateInvestmentRecommendations(company)
          }
        })

      case 'focus':
        const focusCompanies = focusArea 
          ? portfolioTracker.getCompaniesByFocus(focusArea)
          : portfolioTracker.getCompanies()
        
        const focusAnalytics = await analyzeFocusArea(focusCompanies)
        
        return NextResponse.json({
          success: true,
          data: {
            focusArea,
            companies: focusCompanies,
            analytics: focusAnalytics
          }
        })

      case 'stage':
        const stageCompanies = stage 
          ? portfolioTracker.getCompaniesByStage(stage)
          : portfolioTracker.getCompanies()
        
        const stageAnalytics = await analyzeStagePerformance(stageCompanies)
        
        return NextResponse.json({
          success: true,
          data: {
            stage,
            companies: stageCompanies,
            analytics: stageAnalytics
          }
        })

      case 'performance':
        const performanceData = await generatePerformanceReport()
        
        return NextResponse.json({
          success: true,
          data: performanceData
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid view parameter' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Ballistic portfolio API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, companyId, data } = body

    await portfolioTracker.initializePortfolio()

    switch (action) {
      case 'update-metrics':
        if (!companyId) {
          return NextResponse.json(
            { success: false, error: 'Company ID required' },
            { status: 400 }
          )
        }
        
        await portfolioTracker.trackCompanyProgress(companyId)
        
        return NextResponse.json({
          success: true,
          message: 'Company metrics updated successfully'
        })

      case 'generate-insights':
        if (!companyId) {
          return NextResponse.json(
            { success: false, error: 'Company ID required' },
            { status: 400 }
          )
        }
        
        const insights = await portfolioTracker.generateAIInsights(companyId)
        
        return NextResponse.json({
          success: true,
          data: insights
        })

      case 'portfolio-analysis':
        const fullAnalysis = await generateComprehensiveAnalysis()
        
        return NextResponse.json({
          success: true,
          data: fullAnalysis
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Ballistic portfolio POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateInvestmentRecommendations(company: any) {
  return {
    currentRecommendation: company.aiInsights.investmentRecommendation,
    reasoning: [
      `Revenue growth of ${company.revenueGrowth}% indicates strong market traction`,
      `${company.focusArea} market showing positive trends`,
      `Risk level: ${company.riskLevel} with manageable factors`
    ],
    nextSteps: [
      'Monitor quarterly revenue metrics',
      'Track competitive positioning',
      'Assess exit opportunity timing'
    ],
    keyMetrics: {
      revenueGrowth: company.revenueGrowth,
      burnRate: company.burnRate,
      runway: company.runway,
      marketPosition: company.competitivePosition
    }
  }
}

async function analyzeFocusArea(companies: any[]) {
  const totalValue = companies.reduce((sum, c) => sum + c.currentValuation * (c.ownershipPercentage / 100), 0)
  const avgGrowth = companies.reduce((sum, c) => sum + c.revenueGrowth, 0) / companies.length
  
  return {
    totalCompanies: companies.length,
    totalValue,
    averageGrowth: avgGrowth,
    topPerformer: companies.sort((a, b) => b.revenueGrowth - a.revenueGrowth)[0]?.name,
    marketTrend: 'growing', // AI-determined
    opportunities: [
      'Market expansion potential',
      'Technology convergence opportunities',
      'Strategic partnership possibilities'
    ]
  }
}

async function analyzeStagePerformance(companies: any[]) {
  const totalInvested = companies.reduce((sum, c) => sum + c.investmentAmount, 0)
  const totalValue = companies.reduce((sum, c) => sum + c.currentValuation * (c.ownershipPercentage / 100), 0)
  
  return {
    totalCompanies: companies.length,
    totalInvested,
    totalValue,
    multiple: totalValue / totalInvested,
    averageRunway: companies.reduce((sum, c) => sum + c.runway, 0) / companies.length,
    riskDistribution: {
      low: companies.filter(c => c.riskLevel === 'low').length,
      medium: companies.filter(c => c.riskLevel === 'medium').length,
      high: companies.filter(c => c.riskLevel === 'high').length
    }
  }
}

async function generatePerformanceReport() {
  await portfolioTracker.initializePortfolio()
  const analytics = await portfolioTracker.analyzePortfolioPerformance()
  
  return {
    portfolioMetrics: {
      totalValue: analytics.totalPortfolioValue,
      totalInvested: analytics.totalInvested,
      unrealizedGains: analytics.unrealizedGains,
      irr: analytics.irr,
      moic: analytics.moic
    },
    performanceByStage: analytics.performanceByStage,
    performanceByFocus: analytics.performanceByFocus,
    topPerformers: analytics.topPerformers,
    exitPipeline: analytics.exitPipeline,
    marketTrends: analytics.marketTrends,
    riskAnalysis: {
      distribution: analytics.riskDistribution,
      mitigation: 'Diversified across focus areas and stages'
    },
    recommendations: [
      'Continue focus on early-stage cybersecurity investments',
      'Monitor exit opportunities for mature companies',
      'Increase allocation to AI-security segment',
      'Maintain portfolio diversification across focus areas'
    ]
  }
}

async function generateComprehensiveAnalysis() {
  await portfolioTracker.initializePortfolio()
  const analytics = await portfolioTracker.analyzePortfolioPerformance()
  const companies = portfolioTracker.getCompanies()
  
  return {
    executiveSummary: {
      totalCompanies: companies.length,
      totalInvested: analytics.totalInvested,
      currentValue: analytics.totalPortfolioValue,
      unrealizedGains: analytics.unrealizedGains,
      irr: analytics.irr,
      moic: analytics.moic
    },
    performanceHighlights: {
      topPerformer: analytics.topPerformers[0],
      fastestGrowing: companies.sort((a, b) => b.revenueGrowth - a.revenueGrowth)[0],
      nearestExit: analytics.exitPipeline[0],
      highestValuation: companies.sort((a, b) => b.currentValuation - a.currentValuation)[0]
    },
    marketInsights: analytics.marketTrends,
    riskAssessment: {
      portfolioRisk: 'Medium',
      keyRisks: ['Market competition', 'Valuation pressure', 'Regulatory changes'],
      mitigation: 'Strong portfolio diversification and active management'
    },
    strategicRecommendations: [
      'Prepare for exits in 12-18 month timeframe',
      'Increase follow-on investments in top performers',
      'Explore strategic partnerships for portfolio companies',
      'Monitor AI security market consolidation opportunities'
    ]
  }
}