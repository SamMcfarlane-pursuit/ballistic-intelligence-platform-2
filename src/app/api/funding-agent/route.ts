import { NextRequest, NextResponse } from 'next/server'

// Mock funding agent for demo purposes
const mockFundingAgent = {
  getAgentStatus: () => ({
    name: 'Funding Announcement Agent',
    status: 'operational',
    dataSources: 4,
    enabledSources: 4,
    lastRun: new Date().toISOString(),
    capabilities: [
      'RSS feed monitoring',
      'News API integration', 
      'Gemini Flash 2.0 NLP processing',
      'Automated entity extraction',
      'Funding trend analysis',
      'Investment insights generation'
    ],
    workflow: [
      'Phase 1: Gather - Monitor RSS feeds and news APIs',
      'Phase 2: Process - Extract entities with Gemini Flash 2.0',
      'Phase 3: Analyze - Generate trends and recommendations'
    ]
  }),
  executeFundingIntelligence: async () => ({
    success: true,
    data: {
      announcements: [
        {
          companyName: 'CyberSecure',
          theme: 'Cloud Security',
          amount: 10000000,
          fundingStage: 'Series A',
          leadInvestor: 'Ballistic Ventures',
          allInvestors: ['Ballistic Ventures', 'Kleiner Perkins'],
          announcementDate: new Date().toISOString(),
          sourceUrl: 'https://techcrunch.com/demo',
          confidence: 0.95,
          extractedText: 'CyberSecure, a cloud security firm, today announced a $10M Series A led by Ballistic Ventures...'
        }
      ],
      analysis: {
        summary: {
          totalAnnouncements: 1,
          totalFunding: 10000000,
          averageFunding: 10000000
        }
      }
    }
  }),
  configureDataSources: () => {}
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          data: mockFundingAgent.getAgentStatus()
        })

      case 'run':
        console.log('🚀 Executing Funding Announcement Agent...')
        const result = await mockFundingAgent.executeFundingIntelligence()
        return NextResponse.json(result)

      case 'demo':
        // Return demo data for testing
        return NextResponse.json({
          success: true,
          data: {
            announcements: [
              {
                companyName: 'CyberSecure',
                theme: 'Cloud Security',
                amount: 10000000,
                fundingStage: 'Series A',
                leadInvestor: 'Ballistic Ventures',
                allInvestors: ['Ballistic Ventures', 'Kleiner Perkins'],
                announcementDate: new Date().toISOString(),
                sourceUrl: 'https://techcrunch.com/demo',
                confidence: 0.95,
                extractedText: 'CyberSecure, a cloud security firm, today announced a $10M Series A led by Ballistic Ventures...'
              },
              {
                companyName: 'ThreatGuard',
                theme: 'AI Threat Detection',
                amount: 25000000,
                fundingStage: 'Series B',
                leadInvestor: 'Andreessen Horowitz',
                allInvestors: ['Andreessen Horowitz', 'GV', 'Lightspeed'],
                announcementDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                sourceUrl: 'https://techcrunch.com/demo2',
                confidence: 0.92,
                extractedText: 'ThreatGuard raises $25M Series B from Andreessen Horowitz for AI-powered threat detection...'
              },
              {
                companyName: 'ZeroTrust Identity',
                theme: 'Identity Management',
                amount: 8000000,
                fundingStage: 'Seed Round',
                leadInvestor: 'First Round Capital',
                allInvestors: ['First Round Capital', 'Founders Fund'],
                announcementDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                sourceUrl: 'https://techcrunch.com/demo3',
                confidence: 0.88,
                extractedText: 'Identity startup ZeroTrust secures $8M seed round from First Round Capital...'
              }
            ],
            analysis: {
              summary: {
                totalAnnouncements: 3,
                totalFunding: 43000000,
                averageFunding: 14333333,
                dateRange: {
                  from: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                  to: new Date().toISOString()
                }
              },
              trends: {
                hotSectors: [
                  { sector: 'Cloud Security', amount: 10000000, percentage: 23.3 },
                  { sector: 'AI Threat Detection', amount: 25000000, percentage: 58.1 },
                  { sector: 'Identity Management', amount: 8000000, percentage: 18.6 }
                ],
                stageDistribution: [
                  { stage: 'Series A', count: 1, percentage: 33.3 },
                  { stage: 'Series B', count: 1, percentage: 33.3 },
                  { stage: 'Seed Round', count: 1, percentage: 33.3 }
                ],
                topInvestors: [
                  { investor: 'Ballistic Ventures', deals: 1 },
                  { investor: 'Andreessen Horowitz', deals: 1 },
                  { investor: 'First Round Capital', deals: 1 },
                  { investor: 'Kleiner Perkins', deals: 1 }
                ]
              },
              insights: [
                '3 new cybersecurity funding announcements detected',
                'Total funding: $43.0M across all deals',
                'Average deal size: $14.3M',
                'Most active sector: AI Threat Detection',
                'Most active investor: Multiple investors with 1 deal each'
              ],
              recommendations: [
                'Monitor AI threat detection sector for continued growth',
                'Track Andreessen Horowitz for potential partnership opportunities',
                'Analyze Series B stage trends for market timing insights',
                'Investigate ThreatGuard for above-average funding amount'
              ],
              timestamp: new Date().toISOString()
            },
            sources: [
              { name: 'TechCrunch Funding', enabled: true, lastCheck: new Date().toISOString() },
              { name: 'PR Newswire Tech', enabled: true, lastCheck: new Date().toISOString() },
              { name: 'Business Wire Security', enabled: true, lastCheck: new Date().toISOString() },
              { name: 'NewsAPI Cybersecurity', enabled: true, lastCheck: new Date().toISOString() }
            ],
            performance: {
              articlesProcessed: 7,
              validAnnouncements: 3,
              successRate: 42.9,
              totalFunding: 43000000,
              avgConfidence: 0.92
            }
          }
        })

      default:
        return NextResponse.json({
          success: true,
          data: {
            agent: 'Funding Announcement Agent',
            description: 'AI-powered intelligence platform for automated cybersecurity funding tracking',
            workflow: [
              'Phase 1: Gather - Monitor RSS feeds and news APIs',
              'Phase 2: Process - Extract entities with Gemini Flash 2.0', 
              'Phase 3: Analyze - Generate trends and recommendations'
            ],
            capabilities: [
              'RSS feed monitoring (TechCrunch, PR Newswire, Business Wire)',
              'News API integration (NewsAPI.org free tier)',
              'Gemini Flash 2.0 NLP processing',
              'Named Entity Recognition (NER)',
              'Automated funding trend analysis',
              'Investment insights generation'
            ],
            dataSources: [
              'TechCrunch Funding RSS',
              'PR Newswire Technology',
              'Business Wire Security',
              'NewsAPI Cybersecurity Search'
            ],
            budget: '$0 (free tier sources only)',
            status: 'operational'
          }
        })
    }

  } catch (error) {
    console.error('Funding Agent API error:', error)
    return NextResponse.json(
      { success: false, error: 'Funding agent request failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, config } = await request.json()

    switch (action) {
      case 'configure':
        if (config && config.dataSources) {
          mockFundingAgent.configureDataSources(config.dataSources)
          return NextResponse.json({
            success: true,
            message: 'Data sources configured successfully',
            data: mockFundingAgent.getAgentStatus()
          })
        }
        break

      case 'run-analysis':
        console.log('🔄 Running funding analysis...')
        const analysisResult = await mockFundingAgent.executeFundingIntelligence()
        return NextResponse.json(analysisResult)

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Funding Agent POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Funding agent operation failed' },
      { status: 500 }
    )
  }
}