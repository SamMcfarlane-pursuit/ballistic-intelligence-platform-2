import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { sanitizeText, checkRateLimit } from '@/lib/security'

// This endpoint will serve as a webhook for n8n workflows
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const rateLimit = checkRateLimit(clientIP, 30, 60000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Validate input
    if (!action || typeof action !== 'string') {
      console.log('Invalid input - missing action')
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    // Sanitize action
    const sanitizedAction = sanitizeText(action)
    if (!sanitizedAction) {
      console.log('Invalid input - action failed sanitization')
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Validate and sanitize data based on action
    let sanitizedData = data
    switch (sanitizedAction) {
      case 'process-funding-news':
        if (!data?.url) {
          console.log('Invalid input - missing URL for funding news processing')
          return NextResponse.json({ error: 'URL is required for processing funding news' }, { status: 400 })
        }
        const sanitizedUrl = sanitizeText(data.url)
        if (!sanitizedUrl) {
          console.log('Invalid input - URL failed sanitization')
          return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 })
        }
        sanitizedData = { ...data, url: sanitizedUrl }
        break
        
      case 'enrich-company-data':
        if (!data?.company_name) {
          console.log('Invalid input - missing company name')
          return NextResponse.json({ error: 'Company name is required' }, { status: 400 })
        }
        const sanitizedName = sanitizeText(data.company_name)
        if (!sanitizedName) {
          console.log('Invalid input - company name failed sanitization')
          return NextResponse.json({ error: 'Invalid company name' }, { status: 400 })
        }
        sanitizedData = { ...data, company_name: sanitizedName }
        break
        
      case 'scrape-convention-data':
        if (!data?.url) {
          console.log('Invalid input - missing URL for convention scraping')
          return NextResponse.json({ error: 'URL is required for scraping convention data' }, { status: 400 })
        }
        const sanitizedConventionUrl = sanitizeText(data.url)
        if (!sanitizedConventionUrl) {
          console.log('Invalid input - convention URL failed sanitization')
          return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 })
        }
        sanitizedData = { ...data, url: sanitizedConventionUrl }
        break
    }

    // Log the action attempt
    console.log('Automation action attempted:', sanitizedAction)

    switch (sanitizedAction) {
      case 'process-funding-news':
        return await processFundingNews(sanitizedData)
      case 'enrich-company-data':
        return await enrichCompanyData(sanitizedData)
      case 'scrape-convention-data':
        return await scrapeConventionData(sanitizedData)
      case 'analyze-investment-opportunity':
        return await analyzeInvestmentOpportunity(sanitizedData)
      case 'generate-insights':
        return await generateInsights(sanitizedData)
      case 'predict-trends':
        return await predictTrends(sanitizedData)
      default:
        console.log('Unknown automation action:', sanitizedAction)
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in automation endpoint:', error)
    return NextResponse.json(
      { error: 'Automation processing failed' },
      { status: 500 }
    )
  }
}

async function processFundingNews(data: any) {
  try {
    const zai = await ZAI.create()
    
    // Use AI to analyze news articles and extract funding information
    const prompt = `
    Analyze the following news article and extract cybersecurity funding information:
    
    Title: ${data.title}
    Content: ${data.content}
    URL: ${data.url}
    
    Please extract and return a JSON object with:
    - company_name
    - funding_amount (in USD)
    - funding_round (Seed, Series A, Series B, etc.)
    - lead_investor
    - announced_date
    - cybersecurity_focus (what type of security they specialize in)
    
    If no funding information is found, return null.
    `
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing news articles to extract cybersecurity startup funding information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1
    })

    const result = completion.choices[0]?.message?.content
    
    if (!result || result === 'null') {
      return NextResponse.json({ success: false, message: 'No funding information found' })
    }

    // Parse the JSON response
    const fundingData = JSON.parse(result)
    
    // Here you would save the extracted data to your database
    // For now, we'll just return the extracted information
    return NextResponse.json({ 
      success: true, 
      data: fundingData,
      message: 'Funding information extracted successfully'
    })

  } catch (error) {
    console.error('Error processing funding news:', error)
    return NextResponse.json(
      { error: 'Failed to process funding news' },
      { status: 500 }
    )
  }
}

async function enrichCompanyData(data: any) {
  try {
    const zai = await ZAI.create()
    
    const prompt = `
    Analyze the following company information and enrich it with AI-generated insights:
    
    Company Name: ${data.company_name}
    Website: ${data.website || 'N/A'}
    Description: ${data.description || 'N/A'}
    
    Please provide:
    1. Cybersecurity sub-category (e.g., Network Security, Cloud Security, IoT Security, etc.)
    2. Technology focus (e.g., AI/ML, Blockchain, Quantum Computing, etc.)
    3. Market segment (e.g., Enterprise, SMB, Consumer, Government)
    4. Competitive landscape analysis
    5. Growth potential score (1-10)
    
    Return as a JSON object.
    `
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert cybersecurity market analyst.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    })

    const result = completion.choices[0]?.message?.content
    const enrichedData = JSON.parse(result)
    
    return NextResponse.json({ 
      success: true, 
      data: enrichedData,
      message: 'Company data enrichment completed'
    })

  } catch (error) {
    console.error('Error enriching company data:', error)
    return NextResponse.json(
      { error: 'Failed to enrich company data' },
      { status: 500 }
    )
  }
}

async function scrapeConventionData(data: any) {
  try {
    const zai = await ZAI.create()
    
    // First, use web search to get information about the convention
    const searchResult = await zai.functions.invoke("web_search", {
      query: `cybersecurity convention companies exhibitors ${data.url}`,
      num: 10
    })
    
    const prompt = `
    Analyze the following convention website information and extract cybersecurity company data:
    
    Convention URL: ${data.url}
    Search Results: ${JSON.stringify(searchResult, null, 2)}
    
    Please extract and return a JSON object with:
    - convention_name
    - companies_count (total number of companies/exhibitors found)
    - companies (array of company objects with):
      - company_name
      - description (brief description of what they do)
      - cybersecurity_category (e.g., Cloud Security, Threat Intelligence, Identity Security, etc.)
      - funding_stage (pre-seed, seed, series-a, or unknown if not clear)
      - website (if available)
      - contact_info (if available)
    - high_potential_count (number of companies that appear to be high-potential targets for Ballistic Ventures based on their stage and focus)
    
    Focus on companies that appear to be Pre-Seed to Series A stage cybersecurity companies.
    `
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing cybersecurity convention websites to extract company and investment information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2
    })

    const result = completion.choices[0]?.message?.content
    const conventionData = JSON.parse(result)
    
    return NextResponse.json({ 
      success: true, 
      data: conventionData,
      message: 'Convention data scraped successfully'
    })

  } catch (error) {
    console.error('Error scraping convention data:', error)
    return NextResponse.json(
      { error: 'Failed to scrape convention data' },
      { status: 500 }
    )
  }
}

async function analyzeInvestmentOpportunity(data: any) {
  try {
    const zai = await ZAI.create()
    
    const prompt = `
    Analyze the following cybersecurity company for Ballistic Ventures investment consideration:
    
    Company Name: ${data.company_name}
    Description: ${data.description}
    Cybersecurity Category: ${data.cybersecurity_category}
    Funding Stage: ${data.funding_stage}
    
    Current Assessment Scores:
    - Active Users: ${data.current_scores.active_users_score}/100
    - Paying Customers: ${data.current_scores.paying_customers_score}/100
    - MSSP Integration: ${data.current_scores.mssp_integration_score}/100
    - Technical Innovation: ${data.current_scores.technical_innovation}/100
    - Founder Experience: ${data.current_scores.founder_experience}/100
    - Market Timing: ${data.current_scores.market_timing_score}/100
    - Overall Fit Score: ${data.current_scores.active_users_score + data.current_scores.paying_customers_score + data.current_scores.mssp_integration_score + data.current_scores.technical_innovation + data.current_scores.founder_experience + data.current_scores.market_timing_score / 6}/100
    
    Provide a comprehensive investment analysis including:
    
    1. Estimated valuation range (e.g., "$10M-$25M")
    2. Current funding needs (e.g., "Seed round seeking $3M-$5M")
    3. Total addressable market size (e.g., "$2.1B by 2028")
    4. Competitive landscape analysis (2-3 sentences)
    
    5. SWOT Analysis:
       - Strengths (3-4 bullet points)
       - Weaknesses (2-3 bullet points)
       - Opportunities (3-4 bullet points)
       - Threats (2-3 bullet points)
    
    6. Investment recommendations (3-4 specific actionable recommendations)
    
    Return as a JSON object with these exact fields:
    {
      "estimatedValuation": "string",
      "fundingNeeds": "string", 
      "marketSize": "string",
      "competitiveLandscape": "string",
      "strengths": ["string1", "string2", ...],
      "weaknesses": ["string1", "string2", ...],
      "opportunities": ["string1", "string2", ...],
      "threats": ["string1", "string2", ...],
      "recommendations": ["string1", "string2", ...]
    }
    `
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert venture capital analyst specializing in cybersecurity investments. Provide detailed, actionable investment analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    })

    const result = completion.choices[0]?.message?.content
    const analysis = JSON.parse(result)
    
    return NextResponse.json({ 
      success: true, 
      data: analysis,
      message: 'Investment analysis completed successfully'
    })

  } catch (error) {
    console.error('Error analyzing investment opportunity:', error)
    return NextResponse.json(
      { error: 'Failed to analyze investment opportunity' },
      { status: 500 }
    )
  }
}

async function generateInsights(data: any) {
  try {
    const zai = await ZAI.create()
    
    const prompt = `
    Based on the following cybersecurity funding data, generate actionable insights for investors:
    
    Recent Funding Rounds: ${JSON.stringify(data.fundingRounds, null, 2)}
    Market Trends: ${JSON.stringify(data.trends, null, 2)}
    
    Please provide:
    1. Key investment trends in cybersecurity
    2. Emerging sub-sectors with high growth potential
    3. Notable investor activity patterns
    4. Potential missed opportunities
    5. Recommendations for investment strategy
    
    Return as a JSON object with these insights.
    `
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a venture capital analyst specializing in cybersecurity investments.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4
    })

    const result = completion.choices[0]?.message?.content
    const insights = JSON.parse(result)
    
    return NextResponse.json({ 
      success: true, 
      data: insights,
      message: 'Insights generated successfully'
    })

  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

async function predictTrends(data: any) {
  try {
    const zai = await ZAI.create()
    
    const prompt = `
    Analyze the historical cybersecurity funding data and predict future trends:
    
    Historical Data: ${JSON.stringify(data.historicalData, null, 2)}
    Current Market Conditions: ${JSON.stringify(data.currentConditions, null, 2)}
    
    Please predict:
    1. Expected funding activity for the next 6 months
    2. Likely hot sub-sectors for investment
    3. Expected changes in average deal sizes
    4. Emerging geographic markets
    5. Potential market disruptions or opportunities
    
    Return as a JSON object with predictions and confidence levels.
    `
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a predictive analytics expert for venture capital markets.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    })

    const result = completion.choices[0]?.message?.content
    const predictions = JSON.parse(result)
    
    return NextResponse.json({ 
      success: true, 
      data: predictions,
      message: 'Trends predicted successfully'
    })

  } catch (error) {
    console.error('Error predicting trends:', error)
    return NextResponse.json(
      { error: 'Failed to predict trends' },
      { status: 500 }
    )
  }
}