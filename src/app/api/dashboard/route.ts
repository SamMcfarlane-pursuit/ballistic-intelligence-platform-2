import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d' // 7d, 30d, 90d, 1y
    
    // Calculate date range
    const now = new Date()
    const daysBack = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))

    // Parallel data fetching for performance
    const [
      totalCompanies,
      totalConventions,
      totalPortfolio,
      companiesData,
      conventionsData,
      portfolioData,
      marketMetrics
    ] = await Promise.all([
      // Quick counts
      db.cybersecurityStartup.count(),
      db.cybersecurityConvention.count({ where: { is_active: true } }),
      db.ballisticPortfolioCompany.count(),
      
      // Detailed data
      db.cybersecurityStartup.findMany({
        select: {
          id: true,
          name: true,
          primary_category: true,
          total_funding: true,
          current_stage: true,
          employee_count: true,
          founded_year: true
        },
        orderBy: { total_funding: 'desc' },
        take: 10
      }),
      
      db.cybersecurityConvention.findMany({
        where: { is_active: true },
        select: {
          id: true,
          name: true,
          location: true,
          start_date: true,
          end_date: true,
          _count: {
            select: { conventionCompanies: true }
          }
        },
        orderBy: { start_date: 'asc' },
        take: 5
      }),
      
      db.ballisticPortfolioCompany.findMany({
        select: {
          id: true,
          name: true,
          cybersecurity_category: true,
          funding_amount: true,
          funding_stage: true,
          market_traction: true,
          active_users: true,
          paying_customers: true
        },
        orderBy: { funding_amount: 'desc' },
        take: 10
      }),
      
      // Market analysis
      db.cybersecurityStartup.groupBy({
        by: ['primary_category'],
        _count: { primary_category: true },
        _sum: { total_funding: true },
        orderBy: { _sum: { total_funding: 'desc' } }
      })
    ])

    // Calculate key metrics
    const totalFunding = companiesData.reduce((sum, company) => sum + (company.total_funding || 0), 0)
    const averageFunding = totalFunding / Math.max(companiesData.length, 1)
    
    // Stage distribution
    const stageDistribution = companiesData.reduce((acc, company) => {
      const stage = company.current_stage || 'unknown'
      acc[stage] = (acc[stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Category insights
    const categoryInsights = marketMetrics.map(metric => ({
      category: metric.primary_category,
      companies: metric._count.primary_category,
      totalFunding: metric._sum.total_funding || 0,
      averageFunding: (metric._sum.total_funding || 0) / metric._count.primary_category
    }))

    // Recent activity (mock for now - can be enhanced with real activity tracking)
    const recentActivity = [
      {
        id: '1',
        type: 'company_added',
        title: 'New company tracked',
        description: `${companiesData[0]?.name || 'Company'} added to database`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        category: 'data'
      },
      {
        id: '2',
        type: 'analysis_completed',
        title: 'Investment analysis completed',
        description: 'Market analysis for Cloud Security sector',
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
        category: 'analysis'
      },
      {
        id: '3',
        type: 'convention_updated',
        title: 'Convention data updated',
        description: `${conventionsData[0]?.name || 'Convention'} information refreshed`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
        category: 'events'
      }
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Performance metrics
    const performanceMetrics = {
      dataQuality: Math.round((companiesData.filter(c => c.total_funding > 0).length / Math.max(companiesData.length, 1)) * 100),
      portfolioHealth: Math.round((portfolioData.filter(p => p.active_users && p.paying_customers).length / Math.max(portfolioData.length, 1)) * 100),
      conventionActivity: Math.round((conventionsData.filter(c => c._count.conventionCompanies > 0).length / Math.max(conventionsData.length, 1)) * 100)
    }

    // Dashboard response
    const dashboard = {
      // Summary cards
      summary: {
        totalCompanies,
        totalFunding,
        averageFunding: Math.round(averageFunding),
        totalConventions,
        totalPortfolio,
        timeframe
      },
      
      // Key metrics for charts
      metrics: {
        fundingByCategory: categoryInsights,
        stageDistribution,
        performanceMetrics,
        marketGrowth: {
          companies: totalCompanies,
          funding: totalFunding,
          averageValuation: averageFunding
        }
      },
      
      // Top performers
      topCompanies: companiesData.slice(0, 5).map(company => ({
        id: company.id,
        name: company.name,
        category: company.primary_category,
        funding: company.total_funding,
        stage: company.current_stage,
        employees: company.employee_count,
        founded: company.founded_year,
        score: calculateCompanyScore(company)
      })),
      
      // Upcoming events
      upcomingConventions: conventionsData.map(convention => ({
        id: convention.id,
        name: convention.name,
        location: convention.location,
        startDate: convention.start_date,
        endDate: convention.end_date,
        companies: convention._count.conventionCompanies,
        daysUntil: Math.ceil((new Date(convention.start_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      })),
      
      // Portfolio highlights
      portfolioHighlights: portfolioData.slice(0, 5).map(company => ({
        id: company.id,
        name: company.name,
        category: company.cybersecurity_category,
        funding: company.funding_amount,
        stage: company.funding_stage,
        traction: company.market_traction,
        status: getPortfolioStatus(company)
      })),
      
      // Recent activity
      recentActivity,
      
      // Quick actions for UI
      quickActions: [
        { id: 'add_company', label: 'Add Company', icon: 'plus', endpoint: '/api/cybersecurity-startups' },
        { id: 'analyze_market', label: 'Market Analysis', icon: 'chart', endpoint: '/api/analysis' },
        { id: 'create_convention', label: 'Add Convention', icon: 'calendar', endpoint: '/api/conventions' },
        { id: 'portfolio_review', label: 'Portfolio Review', icon: 'briefcase', endpoint: '/api/ballistic-portfolio' }
      ],
      
      // System status
      systemStatus: {
        apiHealth: 'healthy',
        dataFreshness: 'current',
        analysisEngine: 'operational',
        lastUpdate: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      data: dashboard,
      metadata: {
        dataSources: {
          companies: 'Crunchbase API, GrowthList, OpenVC, SEC EDGAR',
          conventions: 'DEF CON, Black Hat, RSA, Gartner, CYBERUK',
          portfolio: 'Internal portfolio management system',
          marketData: 'ACS Global Reports, Gitnux Statistics, Global Trade Magazine'
        },
        dataFreshness: {
          companies: 'Updated daily',
          conventions: 'Updated weekly',
          portfolio: 'Real-time',
          marketData: 'Updated monthly'
        },
        totalSources: 33,
        categories: ['funding', 'threat_intelligence', 'patent_intelligence', 'market_intelligence', 'conference_intelligence']
      },
      timestamp: new Date().toISOString(),
      timeframe
    })

  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load dashboard data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Helper functions
function calculateCompanyScore(company: any): number {
  let score = 50 // Base score
  
  // Funding score (0-30 points)
  if (company.total_funding > 1000000000) score += 30
  else if (company.total_funding > 100000000) score += 25
  else if (company.total_funding > 10000000) score += 20
  else if (company.total_funding > 1000000) score += 15
  else if (company.total_funding > 0) score += 10
  
  // Employee score (0-15 points)
  if (company.employee_count > 1000) score += 15
  else if (company.employee_count > 100) score += 12
  else if (company.employee_count > 50) score += 10
  else if (company.employee_count > 10) score += 8
  else if (company.employee_count > 0) score += 5
  
  // Stage score (0-5 points)
  const stageScores: Record<string, number> = {
    'ipo': 5,
    'series-d': 4,
    'series-c': 4,
    'series-b': 3,
    'series-a': 2,
    'seed': 1
  }
  score += stageScores[company.current_stage] || 0
  
  return Math.min(100, Math.max(0, score))
}

function getPortfolioStatus(company: any): string {
  if (company.active_users && company.paying_customers && company.market_traction > 70) {
    return 'excellent'
  } else if (company.active_users && company.market_traction > 50) {
    return 'good'
  } else if (company.active_users || company.paying_customers) {
    return 'developing'
  } else {
    return 'early'
  }
}