import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { conferenceId, query, analysisType } = await request.json()
    
    if (!conferenceId && !query) {
      return NextResponse.json(
        { error: 'Conference ID or query is required' },
        { status: 400 }
      )
    }

    let zai
    try {
      zai = await ZAI.create()
    } catch (configError) {
      console.warn('AI configuration not found, using fallback analysis')
      // Return fallback response
      return NextResponse.json({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: analysisType || 'general',
        conferenceId,
        query,
        insight: 'AI configuration missing. Using fallback analysis: Cybersecurity conferences show strong investment interest with focus on cloud security, AI/ML threat detection, and zero-trust architectures.',
        confidence: 70,
        trends: ['Cloud Security Growth', 'AI-Powered Detection', 'Zero-Trust Architecture'],
        recommendations: ['Focus on cloud-native solutions', 'Invest in AI/ML capabilities', 'Consider zero-trust startups'],
        success: true,
        fallback: true
      })
    }

    // Build the prompt based on analysis type
    let prompt = ''
    
    if (analysisType === 'conference-trends') {
      prompt = `You are an expert cybersecurity conference analyst. Analyze the following conference data and provide insights on investment trends, emerging technologies, and notable companies:

Conference ID: ${conferenceId}
Query: ${query}

Please provide:
1. Key investment trends observed
2. Emerging technology patterns
3. Notable companies to watch
4. Market opportunities and risks
5. Actionable recommendations for investors

Format your response as a JSON object with the following structure:
{
  "trends": ["trend1", "trend2"],
  "technologies": ["tech1", "tech2"],
  "companies": ["company1", "company2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "risks": ["risk1", "risk2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "confidence": 85,
  "insight": "Detailed analysis summary..."
}`
    } else if (analysisType === 'company-research') {
      prompt = `You are an expert cybersecurity investment analyst. Research the following company and provide comprehensive investment analysis:

Company Name: ${query}
Conference Context: ${conferenceId}

Please provide detailed analysis covering:
1. Company overview and focus area
2. Funding history and valuation
3. Technology stack and innovation
4. Market position and competition
5. Strengths and weaknesses
6. Investment recommendation (strong_buy, buy, hold, avoid)
7. Risk factors and opportunities
8. Market size and growth potential

Format your response as a JSON object with detailed analysis.`
    } else if (analysisType === 'investment-advice') {
      prompt = `You are an expert cybersecurity investment advisor. Based on the following parameters, provide investment strategy recommendations:

Risk Tolerance: ${query}
Conference Context: ${conferenceId}

Please provide:
1. Recommended investment strategy
2. Risk level assessment
3. Expected returns and timeline
4. Recommended portfolio allocation
5. Top sectors to focus on
6. Companies to watch
7. Market indicators and trends
8. Action items for investors

Format your response as a JSON object with comprehensive investment advice.`
    } else {
      prompt = `You are an expert cybersecurity intelligence analyst. Analyze the following query:

Query: ${query}
Context: ${conferenceId}

Provide comprehensive analysis and actionable insights.`
    }

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert cybersecurity conference analyst and investment advisor. Provide detailed, data-driven insights and actionable recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Try to parse as JSON, fallback to text response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiResponse)
    } catch (e) {
      parsedResponse = {
        insight: aiResponse,
        confidence: 75,
        type: analysisType || 'general'
      }
    }

    // Add metadata
    const response = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: analysisType || 'general',
      conferenceId,
      query,
      ...parsedResponse,
      success: true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in AI conference analysis:', error)
    return NextResponse.json(
      { 
        error: 'Failed to perform AI analysis',
        details: error.message,
        success: false 
      },
      { status: 500 }
    )
  }
}