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

    // Get recent funding rounds for VC activity analysis
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
            total_funding: true,
            current_stage: true
          }
        }
      },
      orderBy: {
        announced_date: 'desc'
      }
    })

    // Analyze VC activity and competition
    const vcActivity = new Map<string, {
      investments: number;
      totalAmount: number;
      companies: string[];
      sectors: Set<string>;
      stages: Set<string>;
      averageCheckSize: number;
      lastInvestment: Date;
    }>()

    // Process each funding round to track VC activity
    recentFundingRounds.forEach(round => {
      const processInvestor = (investorName: string, isLead: boolean = false) => {
        if (!vcActivity.has(investorName)) {
          vcActivity.set(investorName, {
            investments: 0,
            totalAmount: 0,
            companies: [],
            sectors: new Set(),
            stages: new Set(),
            averageCheckSize: 0,
            lastInvestment: round.announced_date
          })
        }
        
        const activity = vcActivity.get(investorName)!
        activity.investments++
        activity.totalAmount += round.amount_usd || 0
        if (!activity.companies.includes(round.startup.name)) {
          activity.companies.push(round.startup.name)
        }
        activity.sectors.add(round.startup.primary_category)
        activity.stages.add(round.round_type)
        activity.averageCheckSize = activity.totalAmount / activity.investments
        
        if (round.announced_date > activity.lastInvestment) {
          activity.lastInvestment = round.announced_date
        }
      }

      // Process lead investor
      if (round.lead_investor) {
        processInvestor(round.lead_investor, true)
      }

      // Process other investors
      if (round.investors) {
        try {
          const investors = JSON.parse(round.investors)
          if (Array.isArray(investors)) {
            investors.forEach(investor => processInvestor(investor))
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    })

    // Convert to array and get top active VCs
    const topVCs = Array.from(vcActivity.entries())
      .map(([name, activity]) => ({
        name,
        investments: activity.investments,
        totalAmount: activity.totalAmount,
        companies: activity.companies,
        sectors: Array.from(activity.sectors),
        stages: Array.from(activity.stages),
        averageCheckSize: activity.averageCheckSize,
        lastInvestment: activity.lastInvestment,
        portfolioDiversity: activity.sectors.size,
        stageFocus: activity.stages.size > 1 ? 'Multi-stage' : activity.stages[0] || 'Unknown'
      }))
      .sort((a, b) => b.investments - a.investments || b.totalAmount - a.totalAmount)
      .slice(0, 10)

    // Get recent funding rounds with detailed VC information
    const detailedRounds = recentFundingRounds.slice(0, 20).map(round => ({
      companyName: round.startup.name,
      category: round.startup.primary_category,
      technology: round.startup.core_technology,
      roundType: round.round_type,
      amount: round.amount_usd,
      date: round.announced_date,
      leadInvestor: round.lead_investor,
      totalCompanyFunding: round.startup.total_funding,
      currentStage: round.startup.current_stage,
      allInvestors: round.investors ? JSON.parse(round.investors) : []
    }))

    // Analyze trending sub-sectors based on VC investment patterns
    const sectorInvestment = new Map<string, {
      fundingCount: number;
      totalAmount: number;
      uniqueVCs: Set<string>;
      averageRoundSize: number;
    }>()

    recentFundingRounds.forEach(round => {
      const sector = round.startup.primary_category
      if (!sectorInvestment.has(sector)) {
        sectorInvestment.set(sector, {
          fundingCount: 0,
          totalAmount: 0,
          uniqueVCs: new Set(),
          averageRoundSize: 0
        })
      }
      
      const sectorData = sectorInvestment.get(sector)!
      sectorData.fundingCount++
      sectorData.totalAmount += round.amount_usd || 0
      
      if (round.lead_investor) {
        sectorData.uniqueVCs.add(round.lead_investor)
      }
      
      sectorData.averageRoundSize = sectorData.totalAmount / sectorData.fundingCount
    })

    const trendingSubSectors = Array.from(sectorInvestment.entries())
      .map(([sector, data]) => ({
        sector,
        fundingCount: data.fundingCount,
        totalAmount: data.totalAmount,
        uniqueVCs: data.uniqueVCs.size,
        averageRoundSize: data.averageRoundSize
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount || b.fundingCount - a.fundingCount)
      .slice(0, 8)

    // Analyze funded companies and their characteristics
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
        core_technology: true,
        total_funding: true,
        funding_rounds_count: true,
        current_stage: true,
        employee_count: true,
        founded_year: true,
        headquarters: true,
        growth_rate: true
      },
      orderBy: {
        total_funding: 'desc'
      },
      take: 15
    })

    // Analyze funding sources and capital flow
    const fundingAnalysis = {
      byStage: new Map<string, number>(),
      bySector: new Map<string, number>(),
      byInvestorType: new Map<string, number>(),
      totalCapital: 0,
      averageRoundSize: 0
    }

    recentFundingRounds.forEach(round => {
      const amount = round.amount_usd || 0
      fundingAnalysis.totalCapital += amount

      // By stage
      const stage = round.round_type
      fundingAnalysis.byStage.set(stage, (fundingAnalysis.byStage.get(stage) || 0) + amount)

      // By sector
      const sector = round.startup.primary_category
      fundingAnalysis.bySector.set(sector, (fundingAnalysis.bySector.get(sector) || 0) + amount)

      // By investor type (simplified classification)
      let investorType = 'Other'
      if (round.lead_investor) {
        if (round.lead_investor.includes('Ventures') || round.lead_investor.includes('Capital')) {
          investorType = 'Venture Capital'
        } else if (round.lead_investor.includes('Corporate') || round.lead_investor.includes('Strategic')) {
          investorType = 'Corporate VC'
        } else if (round.lead_investor.includes('Angel') || round.lead_investor.includes('Seed')) {
          investorType = 'Angel/Seed'
        }
      }
      fundingAnalysis.byInvestorType.set(investorType, (fundingAnalysis.byInvestorType.get(investorType) || 0) + amount)
    })

    fundingAnalysis.averageRoundSize = fundingAnalysis.totalCapital / recentFundingRounds.length

    // Generate AI-powered competitive insights
    const zai = await ZAI.create()
    
    const competitorPrompt = `Based on the following cybersecurity VC competitive intelligence data for the ${timeframe} period, provide VC competitor research insights:

TOP 5 ACTIVE VCs:
${topVCs.slice(0, 5).map(vc => 
  `- ${vc.name}: ${vc.investments} deals, $${vc.totalAmount.toLocaleString()}, avg $${Math.round(vc.averageCheckSize).toLocaleString()}, focus: ${vc.sectors.join(', ')}`
).join('\n')}

RECENT FUNDING ROUNDS:
${detailedRounds.slice(0, 10).map(round => 
  `- ${round.companyName}: ${round.roundType} $${round.amount.toLocaleString()} led by ${round.leadInvestor || 'Unknown'}`
).join('\n')}

TRENDING SUB-SECTORS:
${trendingSubSectors.map(sector => 
  `- ${sector.sector}: ${sector.fundingCount} deals, $${sector.totalAmount.toLocaleString()}, ${sector.uniqueVCs} unique VCs`
).join('\n')}

TOP FUNDED COMPANIES:
${fundedCompanies.slice(0, 10).map(company => 
  `- ${company.name}: $${company.total_funding.toLocaleString()} (${company.primary_category}, ${company.current_stage})`
).join('\n')}

FUNDING ANALYSIS:
- Total Capital: $${fundingAnalysis.totalCapital.toLocaleString()}
- Average Round Size: $${Math.round(fundingAnalysis.averageRoundSize).toLocaleString()}
- Top Stage: ${Array.from(fundingAnalysis.byStage.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
- Top Sector: ${Array.from(fundingAnalysis.bySector.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}

Provide comprehensive VC competitive analysis covering:
1. Top 5 most active VCs and their competitive positioning
2. Recent funding round trends and competitive dynamics
3. Trending sub-sectors and where VCs are focusing
4. Companies receiving funding and VC investment patterns
5. Funding source analysis and capital flow trends
6. Competitive intelligence and market positioning insights

Format as JSON with detailed VC competitive insights.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert VC competitive intelligence analyst specializing in cybersecurity venture capital and investment patterns.'
        },
        {
          role: 'user',
          content: competitorPrompt
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
        topVCsAnalysis: [],
        fundingTrends: {},
        sectorFocus: [],
        investmentPatterns: [],
        competitiveLandscape: {},
        capitalFlowAnalysis: {}
      }
    }

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      timeframe,
      data: {
        topActiveVCs: topVCs.slice(0, 5),
        recentFundingRounds: detailedRounds,
        trendingSubSectors,
        fundedCompanies,
        fundingAnalysis: {
          byStage: Object.fromEntries(fundingAnalysis.byStage),
          bySector: Object.fromEntries(fundingAnalysis.bySector),
          byInvestorType: Object.fromEntries(fundingAnalysis.byInvestorType),
          totalCapital: fundingAnalysis.totalCapital,
          averageRoundSize: fundingAnalysis.averageRoundSize
        },
        marketOverview: {
          totalVCs: vcActivity.size,
          totalRounds: recentFundingRounds.length,
          uniqueCompanies: new Set(recentFundingRounds.map(r => r.startup.name)).size,
          totalSectors: sectorInvestment.size
        },
        aiInsights: parsedInsights
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in VC competitor research:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch VC competitor research',
        details: error.message,
        success: false 
      },
      { status: 500 }
    )
  }
}