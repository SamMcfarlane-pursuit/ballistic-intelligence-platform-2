import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const stage = searchParams.get('stage')
    const search = searchParams.get('search')

    // Build where clause
    let whereClause: any = {}
    
    if (category && category !== 'all') {
      whereClause.cybersecurity_category = category
    }
    
    if (stage && stage !== 'all') {
      whereClause.funding_stage = stage
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Fetch portfolio companies with relations
    const portfolioCompanies = await db.ballisticPortfolioCompany.findMany({
      where: whereClause,
      include: {
        fundingRounds: true,
        teamMembers: true,
        exitData: true
      },
      orderBy: [
        { funding_amount: 'desc' },
        { funding_date: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: portfolioCompanies,
      metadata: {
        total: portfolioCompanies.length,
        filters: { category, stage, search }
      }
    })
  } catch (error) {
    console.error('Error fetching ballistic portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const portfolioCompany = await db.ballisticPortfolioCompany.create({
      data: {
        name: body.name,
        description: body.description,
        founded_year: body.founded_year,
        location: body.location,
        cybersecurity_category: body.cybersecurity_category,
        funding_stage: body.funding_stage,
        funding_amount: body.funding_amount,
        funding_date: new Date(body.funding_date),
        lead_investor: body.lead_investor,
        employee_range: body.employee_range,
        website: body.website,
        users: body.users,
        revenue: body.revenue,
        growth: body.growth,
        active_users: body.active_users || false,
        paying_customers: body.paying_customers || false,
        mssp_integration: body.mssp_integration || false,
        market_traction: body.market_traction || 0
      },
      include: {
        fundingRounds: true,
        teamMembers: true,
        exitData: true
      }
    })

    return NextResponse.json({
      success: true,
      data: portfolioCompany
    })
  } catch (error) {
    console.error('Error creating portfolio company:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}