import { NextRequest, NextResponse } from 'next/server'
import { RAGEnhancedAgentSystem } from '@/lib/ai-agents/rag-enhanced-agents'

const ragSystem = new RAGEnhancedAgentSystem()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
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

      case 'demo':
        // Demo endpoint showing RAG capabilities
        const demoResults = await generateDemoResults()
        
        return NextResponse.json({
          success: true,
          data: {
            demo: true,
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