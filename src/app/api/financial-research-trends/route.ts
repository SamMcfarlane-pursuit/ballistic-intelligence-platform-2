import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import ZAI from 'z-ai-web-dev-sdk'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || 'month'
    
    // Calculate date range based on timeframe
    const now = new Date()
    let startDate = new Date()
    
    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1)
    }

    // Get recent funding rounds
    const recentFundingRounds = await prisma.cybersecurityStartupFunding.findMany({
      where: {
        announced_date: {
          gte: startDate
        }
      },
      include: {
        startup: {
          select: {
            name: true,
            primary_category: true,
            core_technology: true,
            employee_count: true
          }
        }
      },
      orderBy: {
        announced_date: 'desc'
      }
    })

    // Extract unique investors from recent rounds
    const allInvestors = new Set<string>()
    recentFundingRounds.forEach(round => {
      if (round.lead_investor) {
        allInvestors.add(round.lead_investor)
      }
      if (round.investors) {
        try {
          const investors = JSON.parse(round.investors)
          if (Array.isArray(investors)) {
            investors.forEach(investor => allInvestors.add(investor))
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    })

    // Get top active VCs by investment count and amount
    const investorActivity = new Map<string, { count: number; totalAmount: number; companies: string[] }>()
    
    recentFundingRounds.forEach(round => {
      const processInvestor = (investor: string) => {
        if (!investorActivity.has(investor)) {
          investorActivity.set(investor, { count: 0, totalAmount: 0, companies: [] })
        }
        const activity = investorActivity.get(investor)!
        activity.count++
        activity.totalAmount += round.amount_usd || 0
        if (!activity.companies.includes(round.startup.name)) {
          activity.companies.push(round.startup.name)
        }
      }

      if (round.lead_investor) {
        processInvestor(round.lead_investor)
      }
      
      if (round.investors) {
        try {
          const investors = JSON.parse(round.investors)
          if (Array.isArray(investors)) {
            investors.forEach(processInvestor)
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    })

    // Convert to array and sort by activity
    const topVCs = Array.from(investorActivity.entries())
      .map(([name, activity]) => ({
        name,
        investmentCount: activity.count,
        totalAmount: activity.totalAmount,
        companies: activity.companies,
        averageInvestment: activity.totalAmount / activity.count
      }))
      .sort((a, b) => b.investmentCount - a.investmentCount || b.totalAmount - a.totalAmount)
      .slice(0, 10)

    // Get trending sub-sectors by funding activity
    const subSectorActivity = await prisma.cybersecurityStartup.groupBy({
      by: ['primary_category'],
      where: {
        fundingRounds: {
          some: {
            announced_date: {
              gte: startDate
            }
          }
        }
      },
      _count: {
        primary_category: true
      },
      _sum: {
        total_funding: true
      },
      orderBy: {
        _sum: {
          total_funding: 'desc'
        }
      }
    })

    // Get companies that got funded in the period
    const fundedCompanies = await prisma.cybersecurityStartup.findMany({
      where: {
        fundingRounds: {
          some: {
            announced_date: {
              gte: startDate
            }
          }
        }
      },
      select: {
        name: true,
        primary_category: true,
        total_funding: true,
        funding_rounds_count: true,
        current_stage: true,
        core_technology: true,
        founded_year: true,
        headquarters: true
      },
      orderBy: {
        total_funding: 'desc'
      },
      take: 15
    })

    // Analyze funding sources
    const fundingSources = {
      ventureCapital: 0,
      corporateVC: 0,
      angelInvestors: 0,
      privateEquity: 0,
      other: 0
    }

    recentFundingRounds.forEach(round => {
      // Simple classification based on round type and investor names
      if (round.round_type.includes('Series') || round.round_type.includes('Seed')) {
        fundingSources.ventureCapital += round.amount_usd || 0
      } else if (round.lead_investor?.includes('Capital') || round.lead_investor?.includes('Ventures')) {
        fundingSources.ventureCapital += round.amount_usd || 0
      } else if (round.lead_investor?.includes('Corporate') || round.lead_investor?.includes('Strategic')) {
        fundingSources.corporateVC += round.amount_usd || 0
      } else {
        fundingSources.other += round.amount_usd || 0
      }
    })

    // Generate AI-powered insights
    const zai = await ZAI.create()
    
    const financialPrompt = `Based on the following cybersecurity funding data for the ${timeframe} period, provide financial research insights:

TOP ACTIVE VCs:
${topVCs.slice(0, 5).map(vc => 
  `- ${vc.name}: ${vc.investmentCount} investments, $${vc.totalAmount.toLocaleString()} total, avg $${Math.round(vc.averageInvestment).toLocaleString()}`
).join('\n')}

RECENT FUNDING ROUNDS:
${recentFundingRounds.slice(0, 10).map(round => 
  `- ${round.startup.name}: ${round.round_type} - $${(round.amount_usd || 0).toLocaleString()} (${round.startup.primary_category})`
).join('\n')}

TRENDING SUB-SECTORS:
${subSectorActivity.map(sector => 
  `- ${sector.primary_category}: ${sector._count.primary_category} companies, $${(sector._sum.total_funding || 0).toLocaleString()}`
).join('\n')}

TOP FUNDED COMPANIES:
${fundedCompanies.slice(0, 10).map(company => 
  `- ${company.name}: $${company.total_funding.toLocaleString()} (${company.primary_category}, ${company.current_stage})`
).join('\n')}

FUNDING SOURCES BREAKDOWN:
- Venture Capital: $${fundingSources.ventureCapital.toLocaleString()}
- Corporate VC: $${fundingSources.corporateVC.toLocaleString()}
- Other: $${fundingSources.other.toLocaleString()}

Provide comprehensive analysis covering:
1. Top 5 most active VCs and their investment patterns
2. Recent funding round trends and sizes
3. Trending sub-sectors and growth areas
4. Companies receiving funding and their characteristics
5. Primary funding sources and capital flow patterns

Format as JSON with detailed financial insights.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert financial analyst specializing in cybersecurity venture capital and funding trends.'
        },
        {
          role: 'user',
          content: financialPrompt
        }
      ],
      temperature: 0.4,
      max_tokens: 2000
    })

    const aiInsights = completion.choices[0]?.message?.content

    // Parse AI response
    let parsedInsights
    try {
      parsedInsights = JSON.parse(aiInsights || '{}')
    } catch (e) {
      parsedInsights = {
        topVCs: [],
        fundingTrends: {},
        trendingSectors: [],
        fundedCompaniesAnalysis: [],
        fundingSources: {}
      }
    }

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      timeframe,
      data: {
        topActiveVCs: topVCs.slice(0, 5),
        recentFundingRounds: recentFundingRounds.slice(0, 15).map(round => ({
          companyName: round.startup.name,
          category: round.startup.primary_category,
          technology: round.startup.core_technology,
          roundType: round.round_type,
          amount: round.amount_usd,
          date: round.announced_date,
          leadInvestor: round.lead_investor
        })),
        trendingSubSectors: subSectorActivity.map(sector => ({
          sector: sector.primary_category,
          companyCount: sector._count.primary_category,
          totalFunding: sector._sum.total_funding || 0
        })),
        fundedCompanies: fundedCompanies,
        fundingSources,
        totalInvestors: allInvestors.size,
        totalRounds: recentFundingRounds.length,
        totalAmount: recentFundingRounds.reduce((sum, round) => sum + (round.amount_usd || 0), 0),
        aiInsights: parsedInsights
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in financial research trends:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch financial research trends',
        details: error.message,
        success: false 
      },
      { status: 500 }
    )
  }
}