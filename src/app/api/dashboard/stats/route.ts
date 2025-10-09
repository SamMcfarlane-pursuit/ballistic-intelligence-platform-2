import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'summary'

    switch (type) {
      case 'summary':
        return await getSummaryStats()
      case 'realtime':
        return await getRealtimeStats()
      case 'kpis':
        return await getKPIStats()
      case 'alerts':
        return await getAlertStats()
      default:
        return await getSummaryStats()
    }
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load stats' },
      { status: 500 }
    )
  }
}

async function getSummaryStats() {
  const [
    companiesCount,
    conventionsCount,
    portfolioCount,
    totalFunding,
    activeConventions
  ] = await Promise.all([
    db.cybersecurityStartup.count(),
    db.cybersecurityConvention.count(),
    db.ballisticPortfolioCompany.count(),
    db.cybersecurityStartup.aggregate({
      _sum: { total_funding: true }
    }),
    db.cybersecurityConvention.count({
      where: { is_active: true }
    })
  ])

  const stats = {
    companies: {
      total: companiesCount,
      label: 'Companies Tracked',
      icon: 'building',
      trend: '+12%', // Mock trend - can be calculated from historical data
      color: 'blue'
    },
    funding: {
      total: totalFunding._sum.total_funding || 0,
      label: 'Total Funding',
      icon: 'dollar-sign',
      trend: '+8%',
      color: 'green',
      formatted: `$${((totalFunding._sum.total_funding || 0) / 1000000000).toFixed(1)}B`
    },
    conventions: {
      total: activeConventions,
      label: 'Active Conventions',
      icon: 'calendar',
      trend: '+3',
      color: 'purple'
    },
    portfolio: {
      total: portfolioCount,
      label: 'Portfolio Companies',
      icon: 'briefcase',
      trend: '+5',
      color: 'orange'
    }
  }

  return NextResponse.json({
    success: true,
    data: stats,
    timestamp: new Date().toISOString()
  })
}

async function getRealtimeStats() {
  // Simulate real-time metrics (in production, these would come from actual monitoring)
  const now = new Date()
  const stats = {
    apiRequests: {
      current: Math.floor(Math.random() * 100) + 50,
      label: 'API Requests/min',
      status: 'healthy'
    },
    responseTime: {
      current: Math.floor(Math.random() * 50) + 20,
      label: 'Avg Response Time (ms)',
      status: 'good'
    },
    activeUsers: {
      current: Math.floor(Math.random() * 20) + 5,
      label: 'Active Users',
      status: 'normal'
    },
    systemLoad: {
      current: Math.floor(Math.random() * 30) + 10,
      label: 'System Load (%)',
      status: 'low'
    }
  }

  return NextResponse.json({
    success: true,
    data: stats,
    timestamp: now.toISOString(),
    nextUpdate: new Date(now.getTime() + 30000).toISOString() // Next update in 30 seconds
  })
}

async function getKPIStats() {
  const [
    companies,
    portfolio,
    conventions
  ] = await Promise.all([
    db.cybersecurityStartup.findMany({
      select: {
        total_funding: true,
        current_stage: true,
        primary_category: true,
        employee_count: true
      }
    }),
    db.ballisticPortfolioCompany.findMany({
      select: {
        funding_amount: true,
        market_traction: true,
        active_users: true,
        paying_customers: true
      }
    }),
    db.cybersecurityConvention.findMany({
      where: { is_active: true },
      include: {
        _count: {
          select: { conventionCompanies: true }
        }
      }
    })
  ])

  // Calculate KPIs
  const totalFunding = companies.reduce((sum, c) => sum + (c.total_funding || 0), 0)
  const averageFunding = totalFunding / Math.max(companies.length, 1)
  
  const portfolioMetrics = {
    totalInvested: portfolio.reduce((sum, p) => sum + (p.funding_amount || 0), 0),
    averageTraction: portfolio.reduce((sum, p) => sum + (p.market_traction || 0), 0) / Math.max(portfolio.length, 1),
    successRate: portfolio.filter(p => p.active_users && p.paying_customers).length / Math.max(portfolio.length, 1) * 100
  }

  const conventionMetrics = {
    totalCompanies: conventions.reduce((sum, c) => sum + c._count.conventionCompanies, 0),
    averageCompaniesPerConvention: conventions.reduce((sum, c) => sum + c._count.conventionCompanies, 0) / Math.max(conventions.length, 1)
  }

  const kpis = {
    financial: {
      totalMarketValue: totalFunding,
      averageCompanyValue: averageFunding,
      portfolioValue: portfolioMetrics.totalInvested,
      roi: portfolioMetrics.successRate // Simplified ROI metric
    },
    operational: {
      companiesTracked: companies.length,
      portfolioSize: portfolio.length,
      activeConventions: conventions.length,
      conventionReach: conventionMetrics.totalCompanies
    },
    performance: {
      dataQuality: companies.filter(c => c.total_funding > 0).length / Math.max(companies.length, 1) * 100,
      portfolioHealth: portfolioMetrics.successRate,
      marketCoverage: Object.keys(companies.reduce((acc, c) => {
        acc[c.primary_category || 'unknown'] = true
        return acc
      }, {} as Record<string, boolean>)).length
    }
  }

  return NextResponse.json({
    success: true,
    data: kpis,
    timestamp: new Date().toISOString()
  })
}

async function getAlertStats() {
  // Generate alerts based on data analysis
  const [companies, portfolio] = await Promise.all([
    db.cybersecurityStartup.findMany({
      select: {
        name: true,
        total_funding: true,
        current_stage: true,
        primary_category: true
      }
    }),
    db.ballisticPortfolioCompany.findMany({
      select: {
        name: true,
        market_traction: true,
        active_users: true,
        paying_customers: true
      }
    })
  ])

  const alerts = []

  // High-value opportunities
  const highValueCompanies = companies.filter(c => c.total_funding > 100000000 && c.current_stage === 'series-b')
  if (highValueCompanies.length > 0) {
    alerts.push({
      id: 'high-value-opportunities',
      type: 'opportunity',
      severity: 'info',
      title: 'High-Value Investment Opportunities',
      message: `${highValueCompanies.length} Series B companies with $100M+ funding available`,
      action: 'Review opportunities',
      timestamp: new Date().toISOString()
    })
  }

  // Portfolio performance alerts
  const underperformingPortfolio = portfolio.filter(p => p.market_traction < 30 && !p.active_users)
  if (underperformingPortfolio.length > 0) {
    alerts.push({
      id: 'portfolio-performance',
      type: 'warning',
      severity: 'medium',
      title: 'Portfolio Performance Alert',
      message: `${underperformingPortfolio.length} portfolio companies need attention`,
      action: 'Review portfolio',
      timestamp: new Date().toISOString()
    })
  }

  // Market concentration alert
  const categoryDistribution = companies.reduce((acc, c) => {
    const cat = c.primary_category || 'unknown'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryDistribution).sort(([,a], [,b]) => b - a)[0]
  if (topCategory && topCategory[1] > companies.length * 0.4) {
    alerts.push({
      id: 'market-concentration',
      type: 'info',
      severity: 'low',
      title: 'Market Concentration Notice',
      message: `${topCategory[0]} represents ${Math.round(topCategory[1] / companies.length * 100)}% of tracked companies`,
      action: 'Diversify tracking',
      timestamp: new Date().toISOString()
    })
  }

  // System health (mock)
  alerts.push({
    id: 'system-health',
    type: 'success',
    severity: 'low',
    title: 'System Operating Normally',
    message: 'All systems operational, data up to date',
    action: null,
    timestamp: new Date().toISOString()
  })

  return NextResponse.json({
    success: true,
    data: {
      alerts: alerts.slice(0, 5), // Limit to 5 most recent alerts
      summary: {
        total: alerts.length,
        critical: alerts.filter(a => a.severity === 'high').length,
        warnings: alerts.filter(a => a.severity === 'medium').length,
        info: alerts.filter(a => a.severity === 'low').length
      }
    },
    timestamp: new Date().toISOString()
  })
}