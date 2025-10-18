import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  calculateTrendingFactors,
  rankTrendingCompanies,
  getTopTrending,
  getTrendingByCategory,
  getTrendingSectors
} from '@/lib/trending-factors'

/**
 * Fetches and calculates trending data for all companies.
 * This is the core data retrieval and processing function.
 */
async function getAndProcessTrendingData() {
  // Fetch all companies with funding data
  const companies = await db.cybersecurityStartup.findMany({
    include: {
      fundingRounds: {
        orderBy: { announced_date: 'desc' },
        take: 1
      }
    }
  })

  if (companies.length === 0) {
    return null;
  }

  // Calculate trending factors for each company
  const trendingData = companies.map(company => {
    const latestFunding = company.fundingRounds[0]
    
    let investors: any[] = []
    let leadInvestor: string | null = null

    if (latestFunding) {
      try {
        investors = latestFunding.investors 
          ? JSON.parse(latestFunding.investors as string)
          : []
      } catch (e) {
        investors = []
      }
      leadInvestor = latestFunding.lead_investor
    }

    return calculateTrendingFactors(
      {
        id: company.id,
        name: company.name,
        primary_category: company.primary_category || 'General Security',
        total_funding: company.total_funding || 0,
        last_funding_date: company.last_funding_date,
        funding_rounds_count: company.funding_rounds_count || 0,
        founded_year: company.founded_year,
        growth_rate: company.growth_rate || 0,
        current_stage: company.current_stage || undefined
      },
      companies.map(c => ({
        primary_category: c.primary_category || 'General Security',
        total_funding: c.total_funding || 0
      })),
      { investors, lead_investor: leadInvestor }
    )
  })

  // Rank companies
  const rankedTrending = rankTrendingCompanies(trendingData)

  return {
    trending: rankedTrending,
    totalCompanies: companies.length,
    timestamp: new Date().toISOString()
  }
}


/**
 * Trending Factors API Endpoint
 * Provides trending analysis and metrics for companies
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'top'
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || ''

    switch (action) {
      case 'calculate':
        return await calculateAllTrending()
      
      case 'top':
        return await getTopTrendingCompanies(limit)
      
      case 'category':
        return await getTrendingByCategoryData(category, limit)
      
      case 'sectors':
        return await getTrendingSectorsData()
      
      case 'company':
        const companyId = searchParams.get('id') || ''
        return await getCompanyTrending(companyId)
      
      case 'stats':
        return await getTrendingStats()
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Trending Factors error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Trending factors analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Calculate trending factors for all companies
 */
async function calculateAllTrending() {
  try {
    const data = await getAndProcessTrendingData();

    if (!data) {
      return NextResponse.json({
        success: false,
        message: 'No companies found in database',
        data: { trending: [] }
      })
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get top trending companies
 */
async function getTopTrendingCompanies(limit: number) {
  try {
    const data = await getAndProcessTrendingData();
    
    if (!data || !data.trending) {
      return NextResponse.json({
        success: false,
        message: 'No trending data available'
      })
    }

    const topTrending = getTopTrending(data.trending, limit)

    // Enrich with full company data
    const enriched = await Promise.all(
      topTrending.map(async (trending) => {
        const company = await db.cybersecurityStartup.findUnique({
          where: { id: trending.id },
          include: {
            fundingRounds: {
              orderBy: { announced_date: 'desc' },
              take: 1
            }
          }
        })

        return {
          ...trending,
          companyDetails: company
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        topTrending: enriched,
        count: enriched.length,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get trending companies by category
 */
async function getTrendingByCategoryData(category: string, limit: number) {
  try {
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category parameter required'
      }, { status: 400 })
    }

    const data = await getAndProcessTrendingData();
    
    if (!data || !data.trending) {
      return NextResponse.json({
        success: false,
        message: 'No trending data available'
      })
    }

    const categoryTrending = getTrendingByCategory(data.trending, category, limit)

    return NextResponse.json({
      success: true,
      data: {
        category,
        trending: categoryTrending,
        count: categoryTrending.length,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get trending sectors
 */
async function getTrendingSectorsData() {
  try {
    const data = await getAndProcessTrendingData();
    
    if (!data || !data.trending) {
      return NextResponse.json({
        success: false,
        message: 'No trending data available'
      })
    }

    const sectors = getTrendingSectors(data.trending)

    return NextResponse.json({
      success: true,
      data: {
        sectors,
        totalSectors: sectors.length,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get trending data for specific company
 */
async function getCompanyTrending(companyId: string) {
  try {
    if (!companyId) {
      return NextResponse.json({
        success: false,
        error: 'Company ID required'
      }, { status: 400 })
    }

    const data = await getAndProcessTrendingData();
    
    if (!data || !data.trending) {
      return NextResponse.json({
        success: false,
        message: 'No trending data available'
      })
    }

    const companyTrending = data.trending.find((t: any) => t.id === companyId)

    if (!companyTrending) {
      return NextResponse.json({
        success: false,
        error: 'Company not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        trending: companyTrending,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get trending statistics
 */
async function getTrendingStats() {
  try {
    const data = await getAndProcessTrendingData();
    
    if (!data || !data.trending) {
      return NextResponse.json({
        success: false,
        message: 'No trending data available'
      })
    }

    const trending = data.trending

    // Calculate statistics
    const avgTrendingScore = Math.round(
      trending.reduce((sum: number, t: any) => sum + t.trendingScore, 0) / trending.length
    )

    const upTrending = trending.filter((t: any) => t.trendDirection === 'up').length
    const downTrending = trending.filter((t: any) => t.trendDirection === 'down').length
    const stableTrending = trending.filter((t: any) => t.trendDirection === 'stable').length

    const topScore = trending[0]?.trendingScore || 0
    const topCompany = trending[0]?.name || 'N/A'

    return NextResponse.json({
      success: true,
      data: {
        statistics: {
          totalCompanies: trending.length,
          averageTrendingScore: avgTrendingScore,
          trendingUp: upTrending,
          trendingDown: downTrending,
          stable: stableTrending,
          topScore,
          topCompany
        },
        distribution: {
          up: Math.round((upTrending / trending.length) * 100),
          down: Math.round((downTrending / trending.length) * 100),
          stable: Math.round((stableTrending / trending.length) * 100)
        },
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'recalculate') {
      return await calculateAllTrending()
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })
  } catch (error) {
    console.error('Trending Factors POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Request failed'
      },
      { status: 500 }
    )
  }
}