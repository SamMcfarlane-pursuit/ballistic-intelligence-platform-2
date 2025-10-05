import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const investorType = searchParams.get('type') || ''

    let whereClause: any = {}

    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    if (investorType) {
      whereClause.investor_type = investorType
    }

    const investors = await db.investor.findMany({
      where: whereClause,
      include: {
        funding_rounds: {
          include: {
            company: true
          },
          orderBy: {
            announced_date: 'desc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Calculate investment statistics for each investor
    const investorsWithStats = investors.map(investor => {
      const totalInvested = investor.funding_rounds.reduce(
        (sum, round) => sum + (round.amount_usd || 0), 0
      )
      const dealsCount = investor.funding_rounds.length
      const uniqueCompanies = new Set(investor.funding_rounds.map(round => round.company_id)).size

      return {
        ...investor,
        stats: {
          totalInvested,
          dealsCount,
          uniqueCompanies,
          averageDealSize: dealsCount > 0 ? totalInvested / dealsCount : 0
        }
      }
    })

    return NextResponse.json(investorsWithStats)
  } catch (error) {
    console.error('Error fetching investors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investors' },
      { status: 500 }
    )
  }
}