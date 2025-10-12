import { NextRequest, NextResponse } from 'next/server'

// Mock implementations for the new agent architecture
const mockFundingAgent = {
  getAgentStatus: () => ({
    name: 'Funding Announcement Agent',
    status: 'operational',
    executionSchedule: 'Every 4 hours (6x daily)',
    phase: '3-Phase: Gather → Process (NER) → Analyze',
    dataSources: 4,
    enabledSources: 4,
    lastRun: new Date().toISOString(),
    capabilities: [
      'RSS feed monitoring (TechCrunch, PR Newswire, Business Wire)',
      'News API integration (NewsAPI.org)',
      'Gemini Flash 2.0 NLP processing',
      'Named Entity Recognition (NER)',
      'Automated deduplication',
      'Company normalization'
    ]
  })
}

const mockProfilingAgent = {
  getAgentStatus: () => ({
    name: 'Company Profiling Agent',
    status: 'operational',
    executionSchedule: 'Triggered by Funding Agent',
    phase: '3-Tier: Structured DB → Web Search → Manual Fallback',
    pendingTasks: 3,
    capabilities: [
      'Crunchbase data extraction',
      'AngelList profile search',
      'Website content parsing',
      'Team member identification',
      'Manual verification task creation'
    ]
  }),
  getVerificationTasks: () => [
    {
      taskType: 'missing_founders',
      companyName: 'CyberSecure',
      description: 'Please verify founders on LinkedIn',
      priority: 'high'
    },
    {
      taskType: 'verify_employee_count',
      companyName: 'ThreatGuard',
      description: 'Please verify employee count from LinkedIn',
      priority: 'medium'
    }
  ]
}

const mockSignalsAgent = {
  getAgentStatus: () => ({
    name: 'News & Signals Agent',
    status: 'operational',
    executionSchedule: 'Daily at 2:00 AM',
    phase: '3-Phase: Gather → Process (Event Extraction) → Analyze',
    companiesMonitored: 150,
    signalsDetected: 47,
    lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    capabilities: [
      'Company website monitoring',
      'NewsAPI targeted searches',
      'AI-powered event extraction',
      'Sentiment analysis',
      'Signal validation and categorization'
    ]
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const agentId = searchParams.get('agent')

    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          data: {
            systemStatus: 'operational',
            totalAgents: 3,
            activeAgents: 3,
            agents: {
              fundingAgent: mockFundingAgent.getAgentStatus(),
              profilingAgent: mockProfilingAgent.getAgentStatus(),
              signalsAgent: mockSignalsAgent.getAgentStatus()
            },
            systemCapabilities: [
              'Automated funding intelligence',
              'Company profiling and enrichment',
              'Business signals monitoring',
              'Multi-tier data collection',
              'AI-powered analysis',
              'Human-in-the-loop verification'
            ],
            lastSystemUpdate: new Date().toISOString()
          }
        })

      case 'funding-intelligence':
        return NextResponse.json({
          success: true,
          data: {
            recentAnnouncements: [
              {
                companyName: 'CyberSecure',
                amount: 10000000,
                fundingStage: 'Series A',
                leadInvestor: 'Ballistic Ventures',
                announcementDate: new Date().toISOString(),
                confidence: 0.95
              },
              {
                companyName: 'ThreatGuard',
                amount: 25000000,
                fundingStage: 'Series B',
                leadInvestor: 'Andreessen Horowitz',
                announcementDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                confidence: 0.92
              }
            ],
            processingStats: {
              articlesProcessed: 127,
              validAnnouncements: 8,
              successRate: 6.3,
              avgConfidence: 0.89
            }
          }
        })

      case 'verification-tasks':
        return NextResponse.json({
          success: true,
          data: {
            pendingTasks: mockProfilingAgent.getVerificationTasks(),
            totalTasks: 3,
            highPriority: 1,
            mediumPriority: 2,
            taskTypes: {
              missing_founders: 1,
              verify_employee_count: 1,
              verify_location: 1
            }
          }
        })

      case 'signals-summary':
        return NextResponse.json({
          success: true,
          data: {
            signalsByType: {
              partnership: 15,
              product_launch: 12,
              executive_hire: 8,
              customer_win: 7,
              award: 5
            },
            signalsBySentiment: {
              positive: 35,
              neutral: 10,
              negative: 2
            },
            recentSignals: [
              {
                companyId: 'Exabeam',
                eventType: 'partnership',
                summary: 'Exabeam announced strategic partnership with Microsoft for enhanced cloud security.',
                sentiment: 'positive',
                eventDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
              },
              {
                companyId: 'Securonix',
                eventType: 'product_launch',
                summary: 'Securonix launched new AI-powered threat detection platform.',
                sentiment: 'positive',
                eventDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
              }
            ]
          }
        })

      case 'agent-performance':
        return NextResponse.json({
          success: true,
          data: {
            fundingAgent: {
              uptime: '99.8%',
              avgResponseTime: '2.3s',
              successRate: '94.2%',
              lastExecution: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
            },
            profilingAgent: {
              uptime: '99.5%',
              avgResponseTime: '15.7s',
              successRate: '87.3%',
              lastExecution: new Date(Date.now() - 45 * 60 * 1000).toISOString()
            },
            signalsAgent: {
              uptime: '99.9%',
              avgResponseTime: '8.4s',
              successRate: '91.6%',
              lastExecution: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
            }
          }
        })

      default:
        return NextResponse.json({
          success: true,
          data: {
            service: 'Intelligence Agents System',
            description: 'Advanced AI agent architecture for cybersecurity investment intelligence',
            agents: [
              {
                id: 'funding-agent',
                name: 'Funding Announcement Agent',
                mission: 'Automated cybersecurity funding intelligence with 24/7 monitoring',
                workflow: '3-Phase: Gather → Process (NER) → Analyze'
              },
              {
                id: 'profiling-agent',
                name: 'Company Profiling Agent',
                mission: 'Build comprehensive company profiles with firmographic and team data',
                workflow: '3-Tier: Structured DB → Web Search → Manual Fallback'
              },
              {
                id: 'signals-agent',
                name: 'News & Signals Agent',
                mission: 'Monitor and categorize business signals indicating company momentum',
                workflow: '3-Phase: Gather → Process (Event Extraction) → Analyze'
              }
            ],
            availableActions: [
              'status - Get system and agent status',
              'funding-intelligence - Get recent funding announcements',
              'verification-tasks - Get pending manual verification tasks',
              'signals-summary - Get business signals summary',
              'agent-performance - Get performance metrics'
            ],
            status: 'operational'
          }
        })
    }

  } catch (error) {
    console.error('Intelligence Agents API error:', error)
    return NextResponse.json(
      { success: false, error: 'Intelligence agents request failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, agentId, config } = await request.json()

    switch (action) {
      case 'trigger-funding-scan':
        return NextResponse.json({
          success: true,
          message: 'Funding scan triggered successfully',
          data: {
            scanId: 'scan-' + Date.now(),
            estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
            expectedSources: 4
          }
        })

      case 'profile-company':
        const { companyName } = config || {}
        if (!companyName) {
          return NextResponse.json(
            { success: false, error: 'Company name required' },
            { status: 400 }
          )
        }

        return NextResponse.json({
          success: true,
          message: `Company profiling initiated for ${companyName}`,
          data: {
            profileId: 'profile-' + Date.now(),
            companyName,
            estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            tiers: ['Structured DB', 'Web Search', 'Manual Fallback']
          }
        })

      case 'run-signals-scan':
        return NextResponse.json({
          success: true,
          message: 'Signals monitoring scan initiated',
          data: {
            scanId: 'signals-' + Date.now(),
            companiesQueued: 150,
            estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000).toISOString()
          }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Intelligence Agents POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Intelligence agents operation failed' },
      { status: 500 }
    )
  }
}