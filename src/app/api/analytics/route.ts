import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || '2024-01-01'
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]

    // Get all funding rounds within date range
    const fundingRounds = await db.fundingRound.findMany({
      where: {
        announced_date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        company: true,
        investors: true
      }
    })

    // Calculate analytics
    const totalFunding = fundingRounds.reduce((sum, round) => sum + (round.amount_usd || 0), 0)
    const totalDeals = fundingRounds.length
    const averageDealSize = totalDeals > 0 ? totalFunding / totalDeals : 0

    // Funding by round type
    const fundingByRoundType = fundingRounds.reduce((acc, round) => {
      const roundType = round.round_type
      if (!acc[roundType]) {
        acc[roundType] = { count: 0, totalAmount: 0 }
      }
      acc[roundType].count++
      acc[roundType].totalAmount += round.amount_usd || 0
      return acc
    }, {} as Record<string, { count: number; totalAmount: number }>)

    // Funding by country
    const fundingByCountry = fundingRounds.reduce((acc, round) => {
      const country = round.company.country || 'Unknown'
      if (!acc[country]) {
        acc[country] = { count: 0, totalAmount: 0 }
      }
      acc[country].count++
      acc[country].totalAmount += round.amount_usd || 0
      return acc
    }, {} as Record<string, { count: number; totalAmount: number }>)

    // Most active investors
    const investorActivity = fundingRounds.reduce((acc, round) => {
      round.investors.forEach(investor => {
        if (!acc[investor.name]) {
          acc[investor.name] = { 
            count: 0, 
            totalAmount: 0, 
            type: investor.investor_type 
          }
        }
        acc[investor.name].count++
        acc[investor.name].totalAmount += round.amount_usd || 0
      })
      return acc
    }, {} as Record<string, { count: number; totalAmount: number; type: string }>)

    // Top lead investors
    const leadInvestorActivity = fundingRounds.reduce((acc, round) => {
      const leadInvestor = round.lead_investor || 'Unknown'
      if (!acc[leadInvestor]) {
        acc[leadInvestor] = { count: 0, totalAmount: 0 }
      }
      acc[leadInvestor].count++
      acc[leadInvestor].totalAmount += round.amount_usd || 0
      return acc
    }, {} as Record<string, { count: number; totalAmount: number }>)

    // Monthly funding trends
    const monthlyTrends = fundingRounds.reduce((acc, round) => {
      const month = new Date(round.announced_date).toISOString().substring(0, 7) // YYYY-MM
      if (!acc[month]) {
        acc[month] = { count: 0, totalAmount: 0 }
      }
      acc[month].count++
      acc[month].totalAmount += round.amount_usd || 0
      return acc
    }, {} as Record<string, { count: number; totalAmount: number }>)

    const analytics = {
      summary: {
        totalFunding,
        totalDeals,
        averageDealSize,
        dateRange: { startDate, endDate }
      },
      fundingByRoundType,
      fundingByCountry,
      investorActivity,
      leadInvestorActivity,
      monthlyTrends
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}