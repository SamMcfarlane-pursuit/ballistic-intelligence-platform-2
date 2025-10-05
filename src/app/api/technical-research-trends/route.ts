import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import ZAI from 'z-ai-web-dev-sdk'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    
    // Get technologies being used from our database
    const technologies = await prisma.cybersecurityStartup.groupBy({
      by: ['core_technology'],
      _count: {
        core_technology: true
      },
      _sum: {
        total_funding: true
      },
      orderBy: {
        _count: {
          core_technology: 'desc'
        }
      }
    })

    // Get companies by category with their patent counts
    const companiesByCategory = await prisma.cybersecurityStartup.groupBy({
      by: ['primary_category'],
      _count: {
        primary_category: true
      },
      _sum: {
        total_funding: true,
        patents_count: true
      },
      _avg: {
        growth_rate: true
      },
      orderBy: {
        _sum: {
          total_funding: 'desc'
        }
      }
    })

    // Get top companies seeking patents (high patent counts)
    const topPatentCompanies = await prisma.cybersecurityStartup.findMany({
      where: {
        patents_count: {
          gt: 0
        }
      },
      select: {
        name: true,
        primary_category: true,
        patents_count: true,
        total_funding: true,
        core_technology: true,
        founded_year: true
      },
      orderBy: {
        patents_count: 'desc'
      },
      take: 10
    })

    // Get recent funding rounds for year-end summary context
    const recentFunding = await prisma.cybersecurityStartupFunding.findMany({
      include: {
        startup: {
          select: {
            name: true,
            primary_category: true,
            core_technology: true
          }
        }
      },
      orderBy: {
        announced_date: 'desc'
      },
      take: 20
    })

    // Generate AI-powered insights
    const zai = await ZAI.create()
    
    const techPrompt = `Based on the following cybersecurity startup data, provide insights on technical research trends:

TECHNOLOGIES IN USE:
${technologies.map(tech => 
  `- ${tech.core_technology}: ${tech._count.core_technology} companies, $${(tech._sum.total_funding || 0).toLocaleString()} total funding`
).join('\n')}

COMPANIES BY CATEGORY:
${companiesByCategory.map(cat => 
  `- ${cat.primary_category}: ${cat._count.primary_category} companies, $${(cat._sum.total_funding || 0).toLocaleString()} funding, ${cat._sum.patents_count || 0} patents, ${Math.round(cat._avg.growth_rate || 0)}% avg growth`
).join('\n')}

TOP PATENT-SEEKING COMPANIES:
${topPatentCompanies.map(company => 
  `- ${company.name}: ${company.patents_count} patents, ${company.core_technology}, $${company.total_funding.toLocaleString()} funding`
).join('\n')}

RECENT FUNDING ACTIVITY:
${recentFunding.slice(0, 10).map(round => 
  `- ${round.startup.name}: ${round.round_type} - $${round.amount_usd.toLocaleString()} (${round.startup.primary_category})`
).join('\n')}

Provide a comprehensive analysis covering:
1. Dominant technology trends and their adoption rates
2. Patent activity patterns and innovation focus areas
3. Companies leading in R&D and patent development
4. Emerging technologies gaining traction
5. Year-end technical summary and future outlook

Format as JSON with detailed insights.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert cybersecurity technology analyst specializing in research trends, patent analysis, and technical innovation patterns.'
        },
        {
          role: 'user',
          content: techPrompt
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
        technologyTrends: [],
        patentAnalysis: {},
        innovationLeaders: [],
        emergingTechnologies: [],
        yearEndSummary: aiInsights || 'Analysis unavailable'
      }
    }

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        technologies: technologies.map(tech => ({
          technology: tech.core_technology,
          companyCount: tech._count.core_technology,
          totalFunding: tech._sum.total_funding || 0,
          averageFunding: (tech._sum.total_funding || 0) / tech._count.core_technology
        })),
        companiesByCategory: companiesByCategory.map(cat => ({
          category: cat.primary_category,
          companyCount: cat._count.primary_category,
          totalFunding: cat._sum.total_funding || 0,
          totalPatents: cat._sum.patents_count || 0,
          averageGrowthRate: cat._avg.growth_rate || 0
        })),
        topPatentCompanies,
        recentFunding: recentFunding.map(round => ({
          companyName: round.startup.name,
          category: round.startup.primary_category,
          technology: round.startup.core_technology,
          roundType: round.round_type,
          amount: round.amount_usd,
          date: round.announced_date
        })),
        aiInsights: parsedInsights
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in technical research trends:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch technical research trends',
        details: error.message,
        success: false 
      },
      { status: 500 }
    )
  }
}