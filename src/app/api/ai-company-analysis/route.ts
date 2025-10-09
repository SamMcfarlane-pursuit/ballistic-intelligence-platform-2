import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import ZAI from 'z-ai-web-dev-sdk'

const prisma = new PrismaClient()

// Cache for market data to reduce database queries
let marketDataCache: any = null
let lastCacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getMarketData() {
  const now = Date.now()
  if (marketDataCache && (now - lastCacheTime) < CACHE_DURATION) {
    return marketDataCache
  }

  try {
    // Get market context from top funded companies
    const topCompanies = await prisma.cybersecurityStartup.findMany({
      take: 10,
      orderBy: {
        total_funding: 'desc'
      },
      select: {
        name: true,
        primary_category: true,
        total_funding: true,
        current_stage: true,
        core_technology: true
      }
    })

    // Get funding trends
    const fundingTrends = await prisma.cybersecurityStartupFunding.groupBy({
      by: ['round_type'],
      _sum: {
        amount_usd: true
      },
      _count: {
        round_type: true
      },
      orderBy: {
        _sum: {
          amount_usd: 'desc'
        }
      }
    })

    const marketAnalysis = {
      totalCompanies: await prisma.cybersecurityStartup.count(),
      totalFunding: (await prisma.cybersecurityStartup.aggregate({
        _sum: {
          total_funding: true
        }
      }))._sum.total_funding || 0,
      averageFunding: (await prisma.cybersecurityStartup.aggregate({
        _avg: {
          total_funding: true
        }
      }))._avg.total_funding || 0
    }

    marketDataCache = {
      topCompanies,
      fundingTrends,
      marketAnalysis
    }
    lastCacheTime = now

    return marketDataCache
  } catch (error) {
    console.error('Error fetching market data:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { companyName, analysisType = 'comprehensive' } = await request.json()
    
    if (!companyName || !companyName.trim()) {
      return NextResponse.json(
        { 
          error: 'Company name is required',
          success: false,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    // Validate analysis type
    if (!['comprehensive', 'quick'].includes(analysisType)) {
      return NextResponse.json(
        { 
          error: 'Invalid analysis type. Must be "comprehensive" or "quick"',
          success: false,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    // First, try to find the company in our database with optimized query
    const company = await prisma.cybersecurityStartup.findFirst({
      where: {
        name: {
          contains: companyName.trim(),
          // mode: 'insensitive' - Removed for compatibility
        }
      },
      include: {
        fundingRounds: {
          orderBy: {
            announced_date: 'desc'
          },
          take: 5 // Limit to latest 5 rounds for performance
        }
      }
    })

    // If not found, search for similar companies with optimized query
    let similarCompanies = []
    if (!company) {
      similarCompanies = await prisma.cybersecurityStartup.findMany({
        where: {
          OR: [
            {
              name: {
                contains: companyName.split(' ')[0],
                // mode: 'insensitive' - Removed for compatibility
              }
            },
            {
              primary_category: {
                contains: companyName,
                // mode: 'insensitive' - Removed for compatibility
              }
            },
            {
              core_technology: {
                contains: companyName,
                // mode: 'insensitive' - Removed for compatibility
              }
            }
          ]
        },
        take: 3, // Reduced for performance
        orderBy: {
          total_funding: 'desc'
        },
        select: {
          name: true,
          primary_category: true,
          total_funding: true,
          current_stage: true,
          core_technology: true
        }
      })
    }

    // Get market data (with caching)
    const marketData = await getMarketData()

    if (!marketData) {
      return NextResponse.json(
        { 
          error: 'Unable to fetch market data',
          success: false,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    const { topCompanies, fundingTrends, marketAnalysis } = marketData

    try {
      // Check if AI configuration exists
      let zai
      try {
        zai = await ZAI.create()
      } catch (configError) {
        console.warn('AI configuration not found, using fallback analysis')
        throw new Error('AI_CONFIG_MISSING')
      }

      // Build context-rich prompt
      const contextData = {
        company,
        similarCompanies,
        topCompanies,
        fundingTrends,
        marketAnalysis
      }

      let prompt = ''

      if (analysisType === 'comprehensive') {
        prompt = `You are a cybersecurity investment analyst with access to comprehensive market data. Analyze the following company and provide investment insights:

COMPANY DATA:
${company ? `
Company: ${company.name}
Description: ${company.description}
Category: ${company.primary_category}
Total Funding: $${company.total_funding.toLocaleString()}
Funding Rounds: ${company.funding_rounds_count}
Current Stage: ${company.current_stage}
Employees: ${company.employee_count || 'Unknown'}
Technology: ${company.core_technology}
Founded: ${company.founded_year}
Headquarters: ${company.headquarters}

Funding History:
${company.fundingRounds.map(round => 
  `- ${round.round_type}: $${round.amount_usd.toLocaleString()} on ${round.announced_date.toLocaleDateString()}`
).join('\n')}
` : `Company "${companyName}" not found in database.`}

${similarCompanies.length > 0 ? `
SIMILAR COMPANIES:
${similarCompanies.map(comp => 
  `- ${comp.name}: ${comp.primary_category}, $${comp.total_funding.toLocaleString()}`
).join('\n')}
` : ''}

MARKET CONTEXT:
Top Funded Companies:
${topCompanies.map(comp => 
  `- ${comp.name}: ${comp.primary_category}, $${comp.total_funding.toLocaleString()} (${comp.current_stage})`
).join('\n')}

Funding Trends by Round Type:
${fundingTrends.map(trend => 
  `- ${trend.round_type}: ${trend._count.round_type} rounds, $${trend._sum.amount_usd?.toLocaleString() || 0}`
).join('\n')}

Market Overview:
- Total Companies Tracked: ${marketAnalysis.totalCompanies}
- Total Market Funding: $${marketAnalysis.totalFunding.toLocaleString()}
- Average Funding per Company: $${Math.round(marketAnalysis.averageFunding).toLocaleString()}

Provide a concise analysis covering:
1. Company overview and positioning
2. Funding analysis and valuation insights
3. Market comparison and competitive landscape
4. Investment recommendation (strong_buy, buy, hold, avoid)
5. Key risks and opportunities
6. Market timing assessment

Format your response as a concise JSON object:
{
  "companyName": "${companyName}",
  "found": ${company ? 'true' : 'false'},
  "overview": "Brief company overview",
  "fundingAnalysis": "Funding and valuation insights",
  "marketPosition": "Market positioning and competition",
  "recommendation": "strong_buy|buy|hold|avoid",
  "confidence": 85,
  "keyStrengths": ["strength1", "strength2"],
  "keyRisks": ["risk1", "risk2"],
  "marketOpportunity": "Market opportunity assessment",
  "investmentThesis": "Clear investment thesis"
}`
      } else if (analysisType === 'quick') {
        prompt = `Provide a quick investment analysis for ${companyName} based on cybersecurity market trends. 
        
        Market Context: ${marketAnalysis.totalCompanies} companies with $${marketAnalysis.totalFunding.toLocaleString()} total funding.
        
        ${company ? `Company Data: ${company.name}, ${company.primary_category}, $${company.total_funding.toLocaleString()} funding, ${company.current_stage} stage.` : 'Company not found in database.'}
        
        Give a brief recommendation (buy/hold/avoid) with 2-3 key reasons. Respond in JSON format:
        {
          "companyName": "${companyName}",
          "found": ${company ? 'true' : 'false'},
          "overview": "Brief assessment",
          "recommendation": "buy|hold|avoid",
          "confidence": 75,
          "keyStrengths": ["reason1", "reason2"],
          "keyRisks": ["risk1"],
          "marketOpportunity": "Quick market assessment",
          "investmentThesis": "Brief investment thesis"
        }`
      }

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a concise cybersecurity investment analyst. Provide data-driven, actionable insights. Be brief but comprehensive. Always respond in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: analysisType === 'quick' ? 500 : 1000
      })

      const aiResponse = completion.choices[0]?.message?.content

      if (!aiResponse) {
        throw new Error('No response from AI')
      }

      // Try to parse as JSON
      let parsedResponse
      try {
        parsedResponse = JSON.parse(aiResponse)
      } catch (e) {
        console.error('Failed to parse AI response as JSON:', aiResponse)
        // Create a structured response from the text
        parsedResponse = {
          companyName,
          found: !!company,
          overview: aiResponse.substring(0, 200) + '...',
          recommendation: 'hold',
          confidence: 60,
          keyStrengths: ['Analysis completed'],
          keyRisks: ['Response parsing issue'],
          marketOpportunity: 'Cybersecurity market growth continues',
          investmentThesis: 'Further analysis recommended'
        }
      }

      // Ensure required fields exist
      const requiredFields = ['companyName', 'found', 'overview', 'recommendation', 'confidence']
      for (const field of requiredFields) {
        if (!(field in parsedResponse)) {
          parsedResponse[field] = field === 'found' ? false : field === 'confidence' ? 50 : ''
        }
      }

      const responseTime = Date.now() - startTime

      const response = {
        success: true,
        timestamp: new Date().toISOString(),
        query: companyName.trim(),
        analysisType,
        responseTime: `${responseTime}ms`,
        contextData: {
          hasCompanyData: !!company,
          similarCompaniesCount: similarCompanies.length,
          marketCompaniesCount: marketAnalysis.totalCompanies,
          cacheUsed: marketDataCache !== null
        },
        ...parsedResponse
      }

      return NextResponse.json(response)
    } catch (aiError) {
      console.error('AI service error:', aiError)
      
      // Enhanced fallback response when AI service fails
      const isConfigMissing = aiError.message === 'AI_CONFIG_MISSING'
      const fallbackResponse = {
        success: true,
        timestamp: new Date().toISOString(),
        query: companyName.trim(),
        analysisType,
        error: isConfigMissing ? 'AI configuration missing, using database analysis' : 'AI service unavailable, using fallback analysis',
        companyName: companyName.trim(),
        found: !!company,
        overview: company ? `${company.name} is a ${company.primary_category} company based in ${company.headquarters}.` : 'Company not found in database.',
        fundingAnalysis: company ? `Total funding: $${company.total_funding.toLocaleString()} across ${company.funding_rounds_count} rounds.` : 'No funding data available.',
        marketPosition: company ? `Currently at ${company.current_stage} stage in the cybersecurity market.` : 'Unable to determine market position.',
        recommendation: 'hold',
        confidence: 65,
        keyStrengths: company ? [company.primary_category || 'Cybersecurity focus', company.core_technology || 'Technical innovation'] : ['Market research needed'],
        keyRisks: company ? ['Competitive market', 'Execution risks'] : ['Limited information available'],
        marketOpportunity: 'Cybersecurity market continues to show strong growth potential with increasing demand for innovative solutions.',
        investmentThesis: company ? 'Monitor for additional funding rounds and market traction before making investment decision.' : 'Gather more company-specific information before making investment decision.'
      }

      return NextResponse.json(fallbackResponse)
    }
  } catch (error) {
    console.error('Error in AI company analysis:', error)
    return NextResponse.json(
      { 
        error: 'Failed to perform AI analysis',
        details: error.message,
        success: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}