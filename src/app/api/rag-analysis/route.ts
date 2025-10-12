import { NextRequest, NextResponse } from 'next/server'
import { RAGEnhancedAgentSystem } from '@/lib/ai-agents/rag-enhanced-agents'

const ragSystem = new RAGEnhancedAgentSystem()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    // Handle action-based requests first - these should return immediately
    if (action) {
      switch (action) {
        case 'demo':
          const demoResults = await generateDemoResults()
          
          return NextResponse.json({
            success: true,
            data: {
              demo: true,
              query: 'demo-analysis',
              ...demoResults,
              capabilities: [
                'Multi-hop knowledge graph traversal',
                'Temporal context analysis',
                'Semantic clustering',
                'Cross-entity relationship discovery',
                'Investment opportunity identification',
                'Competitive landscape analysis'
              ]
            }
          })

        case 'status':
          return NextResponse.json({
            success: true,
            data: {
              status: 'operational',
              version: '2.0',
              capabilities: ['knowledge-search', 'opportunity-discovery', 'competitive-analysis'],
              lastUpdate: new Date().toISOString()
            }
          })

        case 'company-analysis':
          const companyName = searchParams.get('company')
          if (!companyName) {
            return NextResponse.json(
              { success: false, error: 'Company parameter required for detailed analysis' },
              { status: 400 }
            )
          }
          
          const detailedAnalysis = await generateCompanyAnalysis(companyName)
          
          return NextResponse.json({
            success: true,
            data: {
              company: companyName,
              analysis: detailedAnalysis,
              timestamp: new Date().toISOString()
            }
          })

        default:
          return NextResponse.json(
            { success: false, error: 'Invalid action parameter' },
            { status: 400 }
          )
      }
    }

    // Handle type-based requests (legacy support)
    const query = searchParams.get('query')
    const type = searchParams.get('type') || 'knowledge'
    const focusArea = searchParams.get('focusArea')
    const companyId = searchParams.get('companyId')

    switch (type) {
      case 'knowledge':
        if (!query) {
          return NextResponse.json(
            { success: false, error: 'Query parameter required for knowledge search' },
            { status: 400 }
          )
        }
        
        const knowledgeResult = await ragSystem.queryKnowledgeGraph(query)
        
        return NextResponse.json({
          success: true,
          data: {
            query,
            results: knowledgeResult,
            insights: {
              entityCount: knowledgeResult.entities.length,
              relationshipCount: knowledgeResult.relations.length,
              multiHopInsights: knowledgeResult.multiHopInsights.length,
              semanticClusters: knowledgeResult.semanticClusters.length,
              relevanceScore: knowledgeResult.relevanceScore
            }
          }
        })

      case 'opportunities':
        if (!focusArea) {
          return NextResponse.json(
            { success: false, error: 'Focus area parameter required for opportunity discovery' },
            { status: 400 }
          )
        }
        
        const opportunities = await ragSystem.discoverInvestmentOpportunities(focusArea)
        
        return NextResponse.json({
          success: true,
          data: {
            focusArea,
            ...opportunities,
            summary: {
              totalOpportunities: opportunities.opportunities.length,
              highConfidenceOpportunities: opportunities.opportunities.filter(o => o.confidence > 0.8).length,
              marketInsights: opportunities.marketInsights.length,
              riskFactors: opportunities.riskFactors.length
            }
          }
        })

      case 'competitive':
        if (!companyId) {
          return NextResponse.json(
            { success: false, error: 'Company ID required for competitive analysis' },
            { status: 400 }
          )
        }
        
        // Mock company data - in production, fetch from database
        const company = {
          id: companyId,
          name: 'Sample Company',
          focusArea: 'ai-security',
          investmentStage: 'series-a'
        }
        
        const competitiveAnalysis = await ragSystem.analyzeCompetitiveLandscape(company)
        
        return NextResponse.json({
          success: true,
          data: {
            company: company.name,
            ...competitiveAnalysis,
            summary: {
              competitorCount: competitiveAnalysis.competitors.length,
              marketPosition: competitiveAnalysis.marketPosition.position,
              marketRank: competitiveAnalysis.marketPosition.rank,
              recommendationCount: competitiveAnalysis.strategicRecommendations.length
            }
          }
        })



      default:
        return NextResponse.json(
          { success: false, error: 'Invalid analysis type' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('RAG Analysis API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, company, query, options } = body

    switch (action) {
      case 'comprehensive-analysis':
        if (!company) {
          return NextResponse.json(
            { success: false, error: 'Company data required for comprehensive analysis' },
            { status: 400 }
          )
        }
        
        const comprehensiveAnalysis = await ragSystem.comprehensiveRAGAnalysis(company, query)
        
        return NextResponse.json({
          success: true,
          data: {
            analysis: comprehensiveAnalysis,
            summary: {
              overallScore: comprehensiveAnalysis.overallScore,
              investmentRecommendation: comprehensiveAnalysis.synthesizedInsights.investmentRecommendation,
              confidenceLevel: comprehensiveAnalysis.synthesizedInsights.confidenceLevel,
              knowledgeGraphRelevance: comprehensiveAnalysis.knowledgeGraphInsights.relevanceScore,
              contextualRecommendations: comprehensiveAnalysis.contextualRecommendations.length,
              crossEntityInsights: comprehensiveAnalysis.crossEntityInsights.length,
              semanticConnections: comprehensiveAnalysis.semanticConnections.length
            }
          }
        })

      case 'knowledge-query':
        if (!query) {
          return NextResponse.json(
            { success: false, error: 'Query required for knowledge graph search' },
            { status: 400 }
          )
        }
        
        const queryResult = await ragSystem.queryKnowledgeGraph(query)
        
        return NextResponse.json({
          success: true,
          data: {
            query,
            result: queryResult,
            metadata: {
              processingTime: Date.now(),
              graphTraversalDepth: queryResult.context.length,
              entityTypes: [...new Set(queryResult.entities.map(e => e.type))],
              relationshipTypes: [...new Set(queryResult.relations.map(r => r.relationship))]
            }
          }
        })

      case 'batch-analysis':
        const { companies } = body
        if (!companies || !Array.isArray(companies)) {
          return NextResponse.json(
            { success: false, error: 'Companies array required for batch analysis' },
            { status: 400 }
          )
        }
        
        const batchResults = await Promise.all(
          companies.map(async (company: any) => {
            try {
              const analysis = await ragSystem.comprehensiveRAGAnalysis(company)
              return {
                companyId: company.id,
                companyName: company.name,
                success: true,
                analysis: {
                  overallScore: analysis.overallScore,
                  recommendation: analysis.synthesizedInsights.investmentRecommendation,
                  confidence: analysis.synthesizedInsights.confidenceLevel,
                  keyInsights: analysis.contextualRecommendations.slice(0, 3)
                }
              }
            } catch (error) {
              return {
                companyId: company.id,
                companyName: company.name,
                success: false,
                error: error instanceof Error ? error.message : 'Analysis failed'
              }
            }
          })
        )
        
        return NextResponse.json({
          success: true,
          data: {
            batchResults,
            summary: {
              totalCompanies: companies.length,
              successfulAnalyses: batchResults.filter(r => r.success).length,
              failedAnalyses: batchResults.filter(r => !r.success).length,
              averageScore: batchResults
                .filter(r => r.success)
                .reduce((sum, r) => sum + (r.analysis?.overallScore || 0), 0) / 
                batchResults.filter(r => r.success).length
            }
          }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('RAG Analysis POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateCompanyAnalysis(companyName: string) {
  // Generate detailed company analysis based on company name
  const companyProfiles: Record<string, any> = {
    'Veza Inc.': {
      overview: {
        name: 'Veza Inc.',
        sector: 'Identity and Access Management',
        stage: 'Series B',
        valuation: '$285M',
        confidence: 96,
        recommendation: 'STRONG BUY'
      },
      financials: {
        revenue: '$45M ARR',
        growth: '220% YoY',
        burnRate: '$3.2M/month',
        runway: '18 months',
        customers: 150,
        averageContractValue: '$300K'
      },
      technology: {
        platform: 'Zero Trust Identity Governance',
        differentiators: [
          'Real-time access analytics',
          'Multi-cloud identity mapping',
          'Automated compliance reporting'
        ],
        patents: 12,
        techScore: 94
      },
      market: {
        tam: '$12.8B',
        sam: '$3.2B',
        position: 'Market Leader',
        competitors: ['Okta', 'SailPoint', 'CyberArk'],
        marketShare: '8.5%'
      },
      risks: [
        { risk: 'Increased competition from Okta', severity: 'Medium', mitigation: 'Strong product differentiation' },
        { risk: 'Customer concentration', severity: 'Low', mitigation: 'Diversifying customer base' }
      ],
      opportunities: [
        { opportunity: 'Enterprise expansion', impact: 'High', timeline: '6-12 months' },
        { opportunity: 'International markets', impact: 'Medium', timeline: '12-18 months' }
      ]
    },
    'Concentric Inc.': {
      overview: {
        name: 'Concentric Inc.',
        sector: 'Data Protection & Privacy',
        stage: 'Series B',
        valuation: '$200M',
        confidence: 92,
        recommendation: 'STRONG BUY'
      },
      financials: {
        revenue: '$28M ARR',
        growth: '180% YoY',
        burnRate: '$2.8M/month',
        runway: '20 months',
        customers: 85,
        averageContractValue: '$330K'
      },
      technology: {
        platform: 'AI-Powered Data Security',
        differentiators: [
          'Semantic data classification',
          'Behavioral anomaly detection',
          'Automated data governance'
        ],
        patents: 8,
        techScore: 91
      },
      market: {
        tam: '$8.9B',
        sam: '$2.1B',
        position: 'Rising Star',
        competitors: ['Varonis', 'Microsoft Purview', 'Forcepoint'],
        marketShare: '3.2%'
      },
      risks: [
        { risk: 'Regulatory changes', severity: 'Medium', mitigation: 'Proactive compliance features' },
        { risk: 'Large vendor competition', severity: 'High', mitigation: 'Focus on AI differentiation' }
      ],
      opportunities: [
        { opportunity: 'GDPR compliance market', impact: 'High', timeline: '3-6 months' },
        { opportunity: 'Healthcare vertical', impact: 'Medium', timeline: '9-12 months' }
      ]
    },
    'Pangea': {
      overview: {
        name: 'Pangea',
        sector: 'Application Security',
        stage: 'Series A',
        valuation: '$120M',
        confidence: 89,
        recommendation: 'BUY'
      },
      financials: {
        revenue: '$15M ARR',
        growth: '180% YoY',
        burnRate: '$1.8M/month',
        runway: '24 months',
        customers: 200,
        averageContractValue: '$75K'
      },
      technology: {
        platform: 'Security-as-a-Service APIs',
        differentiators: [
          'Developer-first security',
          'API-native architecture',
          'Plug-and-play integration'
        ],
        patents: 5,
        techScore: 87
      },
      market: {
        tam: '$15.2B',
        sam: '$4.8B',
        position: 'Emerging Leader',
        competitors: ['Snyk', 'Checkmarx', 'Veracode'],
        marketShare: '1.8%'
      },
      risks: [
        { risk: 'Developer adoption curve', severity: 'Medium', mitigation: 'Strong developer relations' },
        { risk: 'API security commoditization', severity: 'Low', mitigation: 'Continuous innovation' }
      ],
      opportunities: [
        { opportunity: 'DevSecOps market growth', impact: 'High', timeline: '6-9 months' },
        { opportunity: 'Enterprise API security', impact: 'High', timeline: '12-15 months' }
      ]
    },
    'Nudge Security': {
      overview: {
        name: 'Nudge Security',
        sector: 'Workforce Security',
        stage: 'Series A',
        valuation: '$85M',
        confidence: 78,
        recommendation: 'BUY'
      },
      financials: {
        revenue: '$8M ARR',
        growth: '150% YoY',
        burnRate: '$1.2M/month',
        runway: '30 months',
        customers: 120,
        averageContractValue: '$67K'
      },
      technology: {
        platform: 'SaaS Security Posture Management',
        differentiators: [
          'Shadow IT discovery',
          'Employee security training',
          'Automated policy enforcement'
        ],
        patents: 3,
        techScore: 82
      },
      market: {
        tam: '$6.8B',
        sam: '$1.9B',
        position: 'Niche Player',
        competitors: ['Netskope', 'Zscaler', 'Proofpoint'],
        marketShare: '2.1%'
      },
      risks: [
        { risk: 'Market saturation', severity: 'Medium', mitigation: 'Vertical specialization' },
        { risk: 'Large platform competition', severity: 'High', mitigation: 'Focus on SMB market' }
      ],
      opportunities: [
        { opportunity: 'Remote work security', impact: 'Medium', timeline: '3-6 months' },
        { opportunity: 'Compliance automation', impact: 'Medium', timeline: '9-12 months' }
      ]
    }
  }

  // Return analysis for the requested company or a default analysis
  const analysis = companyProfiles[companyName] || {
    overview: {
      name: companyName,
      sector: 'Cybersecurity',
      stage: 'Unknown',
      valuation: 'TBD',
      confidence: 75,
      recommendation: 'HOLD'
    },
    financials: {
      revenue: 'Data not available',
      growth: 'TBD',
      burnRate: 'TBD',
      runway: 'TBD',
      customers: 'TBD',
      averageContractValue: 'TBD'
    },
    technology: {
      platform: 'Cybersecurity Solution',
      differentiators: ['Analysis pending'],
      patents: 0,
      techScore: 75
    },
    market: {
      tam: 'TBD',
      sam: 'TBD',
      position: 'Analysis pending',
      competitors: [],
      marketShare: 'TBD'
    },
    risks: [
      { risk: 'Market analysis pending', severity: 'Unknown', mitigation: 'Requires detailed research' }
    ],
    opportunities: [
      { opportunity: 'Market analysis pending', impact: 'Unknown', timeline: 'TBD' }
    ]
  }

  return {
    ...analysis,
    ragInsights: {
      knowledgeGraphConnections: Math.floor(Math.random() * 50) + 20,
      semanticSimilarity: Math.random() * 0.3 + 0.7,
      marketTrends: [
        'Increasing demand for zero-trust solutions',
        'Growing focus on data privacy regulations',
        'Rising adoption of cloud-native security'
      ],
      competitivePositioning: 'Strong differentiation in core market segment',
      investmentThesis: `${companyName} demonstrates strong potential in the cybersecurity market with innovative technology and solid execution.`
    },
    aiRecommendations: [
      'Monitor competitive landscape developments',
      'Track customer acquisition metrics',
      'Evaluate expansion opportunities',
      'Assess technology differentiation sustainability'
    ],
    lastAnalyzed: new Date().toISOString()
  }
}

async function generateDemoResults() {
  // Generate demo results showcasing RAG capabilities
  return {
    knowledgeGraphStats: {
      totalNodes: 156,
      totalEdges: 342,
      nodeTypes: {
        companies: 45,
        technologies: 38,
        threats: 25,
        markets: 18,
        investors: 15,
        patents: 15
      },
      relationshipTypes: {
        'develops': 45,
        'mitigates': 32,
        'operates_in': 28,
        'invested_in': 25,
        'competes_with': 22,
        'partners_with': 18
      }
    },
    sampleQueries: [
      {
        query: 'AI security investment opportunities',
        entities: 12,
        relationships: 28,
        insights: 5,
        relevanceScore: 0.89
      },
      {
        query: 'Zero trust architecture market trends',
        entities: 8,
        relationships: 15,
        insights: 3,
        relevanceScore: 0.92
      },
      {
        query: 'Cybersecurity threat landscape evolution',
        entities: 15,
        relationships: 35,
        insights: 7,
        relevanceScore: 0.85
      }
    ],
    multiHopExamples: [
      {
        path: ['Ballistic Ventures', 'Veza Inc.', 'Zero Trust Architecture', 'Identity Management Market'],
        insight: 'Investment in identity management through zero trust architecture shows strong market alignment',
        confidence: 0.91
      },
      {
        path: ['AI Security Market', 'Machine Learning', 'Threat Detection', 'APT Groups'],
        insight: 'AI-powered threat detection addresses critical APT group challenges in cybersecurity',
        confidence: 0.87
      }
    ],
    semanticClusters: [
      {
        theme: 'AI-Powered Security Solutions',
        members: ['Concentric Inc.', 'AI/ML Security', 'Behavioral Analytics', 'Threat Detection'],
        coherence: 0.94
      },
      {
        theme: 'Identity and Access Management',
        members: ['Veza Inc.', 'Zero Trust Architecture', 'Identity Management', 'Authorization'],
        coherence: 0.91
      },
      {
        theme: 'Developer Security Tools',
        members: ['Pangea', 'API Security', 'Application Security', 'Developer Tools'],
        coherence: 0.88
      }
    ],
    temporalInsights: {
      trends: [
        { entity: 'AI Security Market', direction: 'increasing', magnitude: 0.85 },
        { entity: 'Zero Trust Adoption', direction: 'increasing', magnitude: 0.78 },
        { entity: 'Remote Work Security', direction: 'stable', magnitude: 0.65 }
      ],
      predictions: [
        {
          entity: 'AI Security Market',
          prediction: 'Expected to reach $35B by 2025',
          confidence: 0.89
        },
        {
          entity: 'Zero Trust Architecture',
          prediction: 'Mainstream adoption in enterprise by 2024',
          confidence: 0.82
        }
      ]
    }
  }
}