import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const stage = searchParams.get('stage')
    const search = searchParams.get('search')
    const ballisticOnly = searchParams.get('ballisticOnly') === 'true'

    // Build where clause
    let whereClause: any = {}
    
    if (category && category !== 'all') {
      whereClause.primary_category = category
    }
    
    if (stage && stage !== 'all') {
      whereClause.current_stage = stage
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }
    
    if (ballisticOnly) {
      whereClause.is_ballistic_portfolio = true
    }

    // Fetch cybersecurity startups with relations
    const cybersecurityStartups = await db.cybersecurityStartup.findMany({
      where: whereClause,
      include: {
        fundingRounds: true,
        teamMembers: true,
        acquisitions: true
      },
      orderBy: [
        { total_funding: 'desc' },
        { last_funding_date: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: cybersecurityStartups,
      metadata: {
        total: cybersecurityStartups.length,
        filters: { category, stage, search, ballisticOnly },
        dataSources: {
          primary: 'Crunchbase API, GrowthList Cybersecurity Startups',
          secondary: 'OpenVC Investors, SEC EDGAR Database',
          supplementary: 'Datarade APIs, Finro Benchmarks',
          intelligence: 'Intellizence Startup Funding API'
        },
        dataFreshness: {
          crunchbase: 'Updated daily',
          growthlist: 'Updated weekly',
          openvc: 'Updated monthly',
          sec_edgar: 'Updated daily'
        },
        totalSources: 7,
        lastSync: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching cybersecurity startups:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const cybersecurityStartup = await db.cybersecurityStartup.create({
      data: {
        name: body.name,
        description: body.description,
        founded_year: body.founded_year,
        headquarters: body.headquarters,
        website: body.website,
        primary_category: body.primary_category,
        secondary_categories: body.secondary_categories,
        target_market: body.target_market,
        total_funding: body.total_funding || 0,
        funding_rounds_count: body.funding_rounds_count || 0,
        last_funding_date: body.last_funding_date ? new Date(body.last_funding_date) : null,
        current_stage: body.current_stage,
        employee_count: body.employee_count,
        estimated_revenue: body.estimated_revenue,
        growth_rate: body.growth_rate,
        core_technology: body.core_technology,
        patents_count: body.patents_count || 0,
        market_cap: body.market_cap,
        competitors: body.competitors,
        is_ballistic_portfolio: body.is_ballistic_portfolio || false,
        ballistic_notes: body.ballistic_notes
      },
      include: {
        fundingRounds: true,
        teamMembers: true,
        acquisitions: true
      }
    })

    return NextResponse.json({
      success: true,
      data: cybersecurityStartup
    })
  } catch (error) {
    console.error('Error creating cybersecurity startup:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}