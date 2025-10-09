import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const roundType = searchParams.get('roundType') || 'all'
    const country = searchParams.get('country') || 'all'
    const offset = (page - 1) * limit

    let whereClause: any = {}

    if (search) {
      whereClause.OR = [
        {
          company: {
            company_name: {
              contains: search
            }
          }
        },
        {
          lead_investor: {
            contains: search
          }
        }
      ]
    }

    if (roundType !== 'all') {
      whereClause.round_type = roundType
    }

    if (country !== 'all') {
      whereClause.company = {
        ...whereClause.company,
        country: country
      }
    }

    const [fundingRounds, totalCount] = await Promise.all([
      db.fundingRound.findMany({
        where: whereClause,
        include: {
          company: true,
          investors: true
        },
        orderBy: {
          announced_date: 'desc'
        },
        skip: offset,
        take: limit
      }),
      db.fundingRound.count({ where: whereClause })
    ])

    return NextResponse.json({
      data: fundingRounds,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching funding rounds:', error)
    return NextResponse.json(
      { error: 'Failed to fetch funding rounds' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      company_name,
      website,
      country,
      city,
      founded_year,
      employee_range,
      announced_date,
      round_type,
      amount_usd,
      lead_investor,
      lumpsum_investors,
      investors
    } = body

    // Create or get company
    const company = await db.cybersecurityCompany.upsert({
      where: {
        company_name
      },
      update: {
        website,
        country,
        city,
        founded_year,
        employee_range
      },
      create: {
        company_name,
        website,
        country,
        city,
        founded_year,
        employee_range
      }
    })

    // Create funding round
    const fundingRound = await db.fundingRound.create({
      data: {
        company_id: company.id,
        announced_date: new Date(announced_date),
        round_type,
        amount_usd,
        lead_investor,
        lumpsum_investors,
        investors: {
          connectOrCreate: investors.map((investor: any) => ({
            where: { name: investor.name },
            create: {
              name: investor.name,
              investor_type: investor.investor_type
            }
          }))
        }
      },
      include: {
        company: true,
        investors: true
      }
    })

    return NextResponse.json(fundingRound, { status: 201 })
  } catch (error) {
    console.error('Error creating funding round:', error)
    return NextResponse.json(
      { error: 'Failed to create funding round' },
      { status: 500 }
    )
  }
}