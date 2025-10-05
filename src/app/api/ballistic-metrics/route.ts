import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get portfolio companies metrics
    const portfolioCompanies = await db.ballisticPortfolioCompany.findMany({
      include: {
        fundingRounds: true,
        exitData: true
      }
    })

    // Get cybersecurity startups metrics
    const cybersecurityStartups = await db.cybersecurityStartup.findMany({
      include: {
        fundingRounds: true,
        acquisitions: true
      }
    })

    // Calculate metrics
    const totalPortfolioCompanies = portfolioCompanies.length
    const totalInvested = portfolioCompanies.reduce((sum, company) => sum + company.funding_amount, 0)
    const averageInvestment = totalPortfolioCompanies > 0 ? totalInvested / totalPortfolioCompanies : 0
    const successfulExits = portfolioCompanies.filter(company => company.exit_type && company.exit_type !== 'none').length
    
    const totalStartupsTracked = cybersecurityStartups.length
    const totalFundingTracked = cybersecurityStartups.reduce((sum, startup) => sum + startup.total_funding, 0)

    // Calculate top categories
    const categoryMap = new Map()
    portfolioCompanies.forEach(company => {
      const category = company.cybersecurity_category
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, funding: 0 })
      }
      categoryMap.get(category).count++
      categoryMap.get(category).funding += company.funding_amount
    })

    cybersecurityStartups.forEach(startup => {
      const category = startup.primary_category
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, funding: 0 })
      }
      categoryMap.get(category).count++
      categoryMap.get(category).funding += startup.total_funding
    })

    const topCategories = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        count: data.count,
        funding: data.funding
      }))
      .sort((a, b) => b.funding - a.funding)
      .slice(0, 5)

    // Get recent activity
    const recentActivity = []
    
    // Recent funding rounds
    const recentFunding = await db.ballisticFundingRound.findMany({
      include: {
        company: true
      },
      orderBy: {
        announced_date: 'desc'
      },
      take: 5
    })

    recentFunding.forEach(round => {
      recentActivity.push({
        type: 'Funding',
        company: round.company.name,
        amount: round.amount_usd,
        date: round.announced_date.toISOString().split('T')[0]
      })
    })

    // Recent exits
    const recentExits = await db.ballisticExitData.findMany({
      include: {
        company: true
      },
      orderBy: {
        exit_date: 'desc'
      },
      take: 3
    })

    recentExits.forEach(exit => {
      recentActivity.push({
        type: 'Exit',
        company: exit.company.name,
        amount: exit.exit_value,
        date: exit.exit_date.toISOString().split('T')[0]
      })
    })

    // Sort recent activity by date
    recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const metrics = {
      totalPortfolioCompanies,
      totalInvested,
      averageInvestment,
      successfulExits,
      totalStartupsTracked,
      totalFundingTracked,
      topCategories,
      recentActivity: recentActivity.slice(0, 10)
    }

    return NextResponse.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    console.error('Error fetching ballistic metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}