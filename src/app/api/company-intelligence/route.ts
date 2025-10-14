/**
 * Company Intelligence API
 * Comprehensive company analysis including funding, team, presence, and Ballistic history
 * Optimized for Apple devices (desktop, tablet, mobile)
 */

import { NextRequest, NextResponse } from 'next/server'
import { sanitizeText, checkRateLimit } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(clientIP, 20, 60000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const companyId = sanitizeText(searchParams.get('id') || '')

    if (!companyId) {
      return NextResponse.json({
        success: false,
        error: 'Company ID is required'
      }, { status: 400 })
    }

    // Comprehensive company intelligence gathering
    const intelligence = await gatherCompanyIntelligence(companyId)

    return NextResponse.json({
      success: true,
      data: intelligence,
      metadata: {
        lastUpdated: new Date().toISOString(),
        dataSources: 15,
        automatedPull: 85, // 85% of data pulled automatically
        manualEntry: 15    // 15% requires manual entry
      }
    })

  } catch (error) {
    console.error('Company Intelligence API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * Gather comprehensive company intelligence
 */
async function gatherCompanyIntelligence(companyId: string) {
  // Simulate comprehensive data gathering
  await new Promise(resolve => setTimeout(resolve, 1500))

  return {
    id: companyId,
    name: 'QuantumShield Security',
    website: 'https://quantumshield.com',
    description: 'AI-powered quantum-resistant security platform for enterprise environments',
    
    // Funding Intelligence - Who's getting money and from who
    fundingHistory: [
      {
        round: 'Seed',
        amount: 4500000,
        date: '2023-03-15',
        leadInvestor: 'Aleph VC',
        participants: ['Bessemer Venture Partners', 'Cyber Mentor Fund', 'Individual Angels'],
        reasoning: 'Strong technical team with Unit 8200 background, early quantum threat awareness'
      },
      {
        round: 'Series A',
        amount: 22000000,
        date: '2024-10-01',
        leadInvestor: 'Andreessen Horowitz',
        participants: ['GV', 'Bessemer Venture Partners', 'CRV', 'Aleph VC'],
        valuation: 85000000,
        reasoning: 'Quantum computing poses existential threat to current cryptography. QuantumShield building the defense with proven enterprise traction.'
      }
    ],
    
    totalFunding: 26500000,
    lastFundingDate: '2024-10-01',
    leadInvestors: ['Andreessen Horowitz', 'Aleph VC'],
    
    // Why investors invested - pulled from press releases, interviews, blog posts
    whyInvestorsInvested: [
      {
        investor: 'Andreessen Horowitz',
        publicReasoning: 'Quantum computing poses an existential threat to current cryptography. QuantumShield is building the defense systems enterprises will need.',
        keyFactors: [
          'Ex-Unit 8200 team with deep cryptography expertise',
          'Proprietary quantum-resistant algorithms',
          'Early enterprise traction with Fortune 500 companies',
          'Strategic partnerships with cloud providers'
        ],
        source: 'a16z blog post - "The Quantum Security Imperative"'
      },
      {
        investor: 'GV (Google Ventures)',
        publicReasoning: 'As quantum computing advances, current encryption methods will become vulnerable. QuantumShield\'s proactive approach aligns with our thesis.',
        keyFactors: [
          'Technical validation from Google\'s quantum team',
          'Scalable cloud-native architecture',
          'Strong IP portfolio in quantum cryptography'
        ],
        source: 'GV partner interview - TechCrunch'
      }
    ],
    
    // Team & People Intelligence - Team and tech are most important
    keyPeople: [
      {
        name: 'Dr. Sarah Chen',
        role: 'CEO & Co-Founder',
        background: 'Former Unit 8200 intelligence officer with PhD in Quantum Computing from Technion. Led cryptography research at Check Point for 5 years.',
        previousCompanies: ['Unit 8200', 'Check Point', 'IBM Research'],
        education: 'PhD Quantum Computing, Technion; MS Computer Science, Stanford',
        linkedinUrl: 'https://linkedin.com/in/sarahchen-quantum',
        keyConnections: [
          'Shlomo Kramer (Check Point founder)',
          'Gil Shwed (Check Point CEO)',
          'Yoav Tzruya (JVP Partner)',
          'Prof. Dorit Aharonov (Hebrew University - Quantum Computing)'
        ]
      },
      {
        name: 'Dr. Michael Rodriguez',
        role: 'CTO & Co-Founder',
        background: 'Former Google AI researcher specializing in adversarial machine learning. Led security research at DeepMind.',
        previousCompanies: ['Google', 'DeepMind', 'Microsoft Research'],
        education: 'PhD Machine Learning, MIT; BS Computer Science, Caltech',
        linkedinUrl: 'https://linkedin.com/in/mrodriguez-ai',
        keyConnections: [
          'Jeff Dean (Google Senior Fellow)',
          'Demis Hassabis (DeepMind CEO)',
          'Dawn Song (UC Berkeley)',
          'Ian Goodfellow (Apple)'
        ]
      },
      {
        name: 'Jennifer Kim',
        role: 'VP of Sales',
        background: 'Former enterprise sales leader at CrowdStrike and Palo Alto Networks. Built sales teams from 0 to $50M ARR.',
        previousCompanies: ['CrowdStrike', 'Palo Alto Networks', 'FireEye'],
        education: 'MBA Wharton; BS Engineering, UC Berkeley',
        keyConnections: [
          'George Kurtz (CrowdStrike CEO)',
          'Nikesh Arora (Palo Alto Networks CEO)',
          'Enterprise CISO network'
        ]
      }
    ],
    
    advisors: [
      {
        name: 'Shlomo Kramer',
        role: 'Strategic Advisor',
        background: 'Co-founder of Check Point and Imperva',
        value: 'Cybersecurity industry connections and enterprise go-to-market expertise'
      }
    ],
    
    boardMembers: [
      {
        name: 'Marc Andreessen',
        role: 'Board Member',
        firm: 'Andreessen Horowitz',
        background: 'Co-founder of a16z, Netscape co-founder'
      }
    ],
    
    // Press releases and recent news - have they had any news lately?
    pressReleases: [
      {
        title: 'QuantumShield Announces $22M Series A Funding',
        date: '2024-10-01',
        summary: 'Led by Andreessen Horowitz to accelerate quantum-resistant security platform development',
        url: 'https://quantumshield.com/press/series-a-funding'
      },
      {
        title: 'QuantumShield Partners with Microsoft Azure',
        date: '2024-09-15',
        summary: 'Strategic integration with Azure Security Center for quantum threat detection',
        url: 'https://quantumshield.com/press/microsoft-partnership'
      }
    ],
    
    recentNews: [
      {
        title: 'QuantumShield Raises $22M Series A',
        summary: 'Led by Andreessen Horowitz to accelerate quantum-resistant security platform development',
        date: '2024-10-01',
        source: 'TechCrunch',
        url: 'https://techcrunch.com/quantumshield-series-a',
        sentiment: 'positive'
      },
      {
        title: 'The Quantum Security Threat is Real',
        summary: 'QuantumShield CEO discusses the urgency of quantum-safe cryptography',
        date: '2024-09-20',
        source: 'Forbes',
        url: 'https://forbes.com/quantum-security-threat',
        sentiment: 'neutral'
      }
    ],
    
    // Where they showcase - conferences, events
    conferences: [
      {
        conference: 'RSA Conference 2024',
        date: '2024-05-06',
        type: 'speaker',
        topic: 'Quantum-Safe Cryptography for Enterprise',
        stage: 'Main Stage'
      },
      {
        conference: 'Black Hat USA 2024',
        date: '2024-08-07',
        type: 'exhibitor',
        topic: 'Quantum Threat Demonstration',
        stage: 'Expo Hall'
      },
      {
        conference: 'Cybertech Global 2024',
        date: '2024-01-30',
        type: 'speaker',
        topic: 'Israeli Innovation in Quantum Security',
        stage: 'Innovation Stage'
      }
    ],
    
    // What programs they came out of
    programs: [
      {
        name: 'Team8 Foundry',
        type: 'incubator',
        year: '2022',
        outcome: 'Graduated with seed funding and strategic partnerships',
        connections: [
          'Liran Tancman (Team8 Partner)',
          'Nadav Zafrir (Team8 Co-founder)',
          'Israel Grimberg (Team8 CISO-in-Residence)'
        ]
      },
      {
        name: 'Technion Entrepreneurship Center',
        type: 'accelerator',
        year: '2021',
        outcome: 'Early prototype development and initial team formation',
        connections: [
          'Prof. Eli Biham (Cryptography)',
          'Technion alumni network'
        ]
      }
    ],
    
    // Ballistic interaction history
    ballisticHistory: [
      {
        date: '2023-06-15',
        type: 'pitch',
        outcome: 'Passed - too early stage',
        notes: 'Strong team but market timing concerns. Product not ready for enterprise deployment. Technology impressive but needs more customer validation.',
        followUp: 'Follow up in 12 months when they have enterprise customers'
      },
      {
        date: '2023-03-20',
        type: 'meeting',
        outcome: 'Initial introduction',
        notes: 'Met Sarah Chen at Cybertech. Impressive background but very early stage. No product yet.',
        followUp: 'Stay in touch as they develop'
      }
    ],
    
    // Why they never came to Ballistic
    whyNotBallistic: [
      'No direct connection to Ballistic partners at the time',
      'Came through Team8 network which provided sufficient early-stage capital',
      'Previous pass in 2023 may have created hesitation to re-approach',
      'Strong Israeli investor network (Aleph VC) reduced need for US early-stage capital',
      'Focused on strategic investors (a16z) for Series A rather than sector specialists'
    ],
    
    // Connection gaps analysis - what we missed
    connectionGaps: [
      {
        type: 'person',
        name: 'Shlomo Kramer',
        importance: 'high',
        reason: 'Key Check Point connection who became their advisor. Could have provided warm intro to Ballistic.',
        suggestedAction: 'Build relationship with Shlomo Kramer for future deal flow from Check Point alumni network'
      },
      {
        type: 'program',
        name: 'Team8 Foundry',
        importance: 'high',
        reason: 'Major Israeli cybersecurity incubator. Not in our deal flow network.',
        suggestedAction: 'Establish formal relationship with Team8 for early-stage deal flow'
      },
      {
        type: 'conference',
        name: 'Cybertech Global',
        importance: 'medium',
        reason: 'Major Israeli cybersecurity conference where we could have met them earlier',
        suggestedAction: 'Increase presence at Israeli cybersecurity events'
      },
      {
        type: 'investor',
        name: 'Aleph VC',
        importance: 'medium',
        reason: 'Leading Israeli VC with strong cybersecurity portfolio. No co-investment relationship.',
        suggestedAction: 'Explore co-investment opportunities with Aleph VC'
      }
    ],
    
    // Export metrics for investor decks
    exportableMetrics: [
      {
        category: 'Financial Performance',
        metrics: [
          { name: 'Total Funding', value: '$26.5M', trend: 'up' },
          { name: 'Last Valuation', value: '$85M', trend: 'up' },
          { name: 'Revenue Growth', value: '240% YoY', trend: 'up' },
          { name: 'ARR', value: '$4.2M', trend: 'up' },
          { name: 'Gross Margin', value: '85%', trend: 'stable' }
        ]
      },
      {
        category: 'Market Traction',
        metrics: [
          { name: 'Enterprise Customers', value: 12, trend: 'up' },
          { name: 'Fortune 500 Customers', value: 3, trend: 'up' },
          { name: 'Customer Retention', value: '98%', trend: 'stable' },
          { name: 'NPS Score', value: 72, trend: 'up' }
        ]
      },
      {
        category: 'Team & Technology',
        metrics: [
          { name: 'Team Size', value: 45, trend: 'up' },
          { name: 'Engineering %', value: '67%', trend: 'stable' },
          { name: 'Patents Filed', value: 8, trend: 'up' },
          { name: 'Technical Publications', value: 12, trend: 'up' }
        ]
      }
    ],
    
    // Chart data for presentations
    chartData: [
      {
        type: 'funding_timeline',
        data: [
          { date: '2023-03', amount: 4.5, round: 'Seed' },
          { date: '2024-10', amount: 22, round: 'Series A' }
        ]
      },
      {
        type: 'revenue_growth',
        data: [
          { quarter: 'Q1 2024', revenue: 800000 },
          { quarter: 'Q2 2024', revenue: 1200000 },
          { quarter: 'Q3 2024', revenue: 1800000 },
          { quarter: 'Q4 2024', revenue: 2400000 }
        ]
      }
    ],
    
    // Data source breakdown - what can be pulled vs manual
    dataSourceBreakdown: {
      automated: {
        percentage: 85,
        sources: [
          'Crunchbase (funding data)',
          'LinkedIn (team information)',
          'Company website (press releases)',
          'News APIs (recent coverage)',
          'Conference APIs (speaking engagements)',
          'Patent databases',
          'SEC filings',
          'Social media monitoring'
        ]
      },
      manual: {
        percentage: 15,
        sources: [
          'Partner meeting notes',
          'Private investor reasoning',
          'Internal assessment notes',
          'Relationship mapping',
          'Competitive intelligence',
          'Private customer references'
        ]
      }
    }
  }
}

export const runtime = 'nodejs'