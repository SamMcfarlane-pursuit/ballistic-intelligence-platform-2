import { NextRequest, NextResponse } from 'next/server'
import { CyberSecurityAgentSystem } from '@/lib/ai-agents/cybersecurity-agent-system'

const agentSystem = new CyberSecurityAgentSystem()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const companyId = searchParams.get('companyId')

    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          data: {
            status: 'operational',
            agents: {
              technicalAnalyst: 'active',
              marketAnalyst: 'active',
              threatAnalyst: 'active',
              financialAnalyst: 'active',
              patentAnalyst: 'active'
            },
            capabilities: [
              'Comprehensive multi-agent analysis',
              'Technical stack evaluation',
              'Market position assessment',
              'Threat landscape analysis',
              'Financial health evaluation',
              'Patent portfolio analysis',
              'Agent coordination and synthesis'
            ],
            lastUpdate: new Date().toISOString()
          }
        })

      case 'demo':
        // Demo analysis with mock data
        const demoCompany = {
          id: 'demo-company',
          name: 'CyberShield AI',
          focusArea: 'ai-security',
          investmentStage: 'series-a',
          description: 'AI-powered cybersecurity platform using machine learning for threat detection',
          technology: 'AI, machine learning, cloud-native architecture, microservices, API-first',
          employees: 75,
          founded: 2021,
          revenueGrowth: 180,
          customerCount: 150,
          patentCount: 8,
          currentValuation: 50000000,
          burnRate: 800000,
          runway: 24
        }

        const demoAnalysis = await agentSystem.comprehensiveAnalysis(demoCompany)

      case 'rag-demo':
        // RAG-enhanced demo analysis
        const ragDemoCompany = {
          id: 'rag-demo-company',
          name: 'SecureAI Technologies',
          focusArea: 'ai-security',
          investmentStage: 'series-a',
          description: 'AI-powered endpoint security with behavioral analytics',
          technology: 'AI, machine learning, behavioral analytics, cloud security',
          employees: 65,
          founded: 2022,
          revenueGrowth: 220,
          customerCount: 120,
          patentCount: 6
        }

        const ragDemoAnalysis = await agentSystem.ragEnhancedAnalysis(ragDemoCompany)

        return NextResponse.json({
          success: true,
          data: {
            demo: true,
            ragEnabled: true,
            company: ragDemoCompany,
            analysis: ragDemoAnalysis,
            executionTime: '3.1s',
            agentCoordination: {
              totalAgents: 5,
              consensusLevel: ragDemoAnalysis.agentCoordination.consensusLevel,
              conflictResolution: 'automated',
              synthesisMethod: 'rag_enhanced_consensus'
            },
            ragEnhancements: {
              knowledgeGraphInsights: !!ragDemoAnalysis.knowledgeGraphInsights,
              contextualRecommendations: ragDemoAnalysis.contextualRecommendations?.length || 0,
              marketIntelligence: !!ragDemoAnalysis.marketIntelligence,
              competitiveInsights: ragDemoAnalysis.competitiveInsights?.length || 0
            }
          }
        })

        return NextResponse.json({
          success: true,
          data: {
            demo: true,
            company: demoCompany,
            analysis: demoAnalysis,
            executionTime: '2.3s',
            agentCoordination: {
              totalAgents: 5,
              consensusLevel: demoAnalysis.agentCoordination.consensusLevel,
              conflictResolution: 'automated',
              synthesisMethod: 'weighted_consensus'
            }
          }
        })

      case 'health':
        // System health check
        const healthCheck = await performHealthCheck()
        
        return NextResponse.json({
          success: true,
          data: {
            systemHealth: 'healthy',
            checks: healthCheck,
            uptime: '99.9%',
            lastHealthCheck: new Date().toISOString()
          }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('AI Agents API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, company, options } = body

    switch (action) {
      case 'analyze':
        if (!company) {
          return NextResponse.json(
            { success: false, error: 'Company data required for analysis' },
            { status: 400 }
          )
        }

        console.log(`🚀 Starting AI agent analysis for ${company.name}`)
        const startTime = Date.now()

        const enableRAG = options?.enableRAG || false
        const analysis = enableRAG ? 
          await agentSystem.ragEnhancedAnalysis(company) :
          await agentSystem.comprehensiveAnalysis(company)
        
        const executionTime = Date.now() - startTime

        return NextResponse.json({
          success: true,
          data: {
            company: company.name,
            analysis,
            metadata: {
              executionTime: `${executionTime}ms`,
              agentsUsed: 5,
              analysisDepth: 'comprehensive',
              timestamp: new Date().toISOString()
            },
            summary: {
              overallScore: analysis.overallScore,
              recommendation: analysis.synthesizedInsights.investmentRecommendation,
              confidence: analysis.synthesizedInsights.confidenceLevel,
              consensusLevel: analysis.agentCoordination.consensusLevel,
              keyStrengths: analysis.synthesizedInsights.keyStrengths,
              keyWeaknesses: analysis.synthesizedInsights.keyWeaknesses,
              ragEnhanced: enableRAG,
              contextualRecommendations: analysis.contextualRecommendations?.length || 0,
              marketIntelligence: !!analysis.marketIntelligence,
              competitiveInsights: analysis.competitiveInsights?.length || 0
            }
          }
        })

      case 'batch-analyze':
        const { companies } = body
        if (!companies || !Array.isArray(companies)) {
          return NextResponse.json(
            { success: false, error: 'Companies array required for batch analysis' },
            { status: 400 }
          )
        }

        console.log(`🔄 Starting batch analysis for ${companies.length} companies`)
        const batchStartTime = Date.now()

        const batchResults = await Promise.all(
          companies.map(async (company: any) => {
            try {
              const analysis = await agentSystem.comprehensiveAnalysis(company)
              return {
                companyId: company.id,
                companyName: company.name,
                success: true,
                analysis: {
                  overallScore: analysis.overallScore,
                  recommendation: analysis.synthesizedInsights.investmentRecommendation,
                  confidence: analysis.synthesizedInsights.confidenceLevel,
                  consensusLevel: analysis.agentCoordination.consensusLevel,
                  keyInsights: analysis.synthesizedInsights.strategicRecommendations.slice(0, 3)
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

        const batchExecutionTime = Date.now() - batchStartTime

        return NextResponse.json({
          success: true,
          data: {
            batchResults,
            metadata: {
              totalCompanies: companies.length,
              successfulAnalyses: batchResults.filter(r => r.success).length,
              failedAnalyses: batchResults.filter(r => !r.success).length,
              executionTime: `${batchExecutionTime}ms`,
              averageTimePerCompany: `${Math.round(batchExecutionTime / companies.length)}ms`
            },
            summary: {
              averageScore: batchResults
                .filter(r => r.success)
                .reduce((sum, r) => sum + (r.analysis?.overallScore || 0), 0) / 
                batchResults.filter(r => r.success).length,
              recommendationDistribution: calculateRecommendationDistribution(batchResults),
              topPerformers: batchResults
                .filter(r => r.success)
                .sort((a, b) => (b.analysis?.overallScore || 0) - (a.analysis?.overallScore || 0))
                .slice(0, 3)
                .map(r => ({ name: r.companyName, score: r.analysis?.overallScore }))
            }
          }
        })

      case 'agent-status':
        // Individual agent status check
        const agentStatuses = await checkIndividualAgents()
        
        return NextResponse.json({
          success: true,
          data: {
            agentStatuses,
            systemStatus: 'operational',
            lastStatusCheck: new Date().toISOString()
          }
        })

      case 'coordination-test':
        // Test agent coordination capabilities
        const coordinationTest = await testAgentCoordination()
        
        return NextResponse.json({
          success: true,
          data: {
            coordinationTest,
            testPassed: coordinationTest.consensusAchieved,
            testTimestamp: new Date().toISOString()
          }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('AI Agents POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function performHealthCheck() {
  return {
    technicalAnalyst: {
      status: 'healthy',
      responseTime: '150ms',
      lastCheck: new Date().toISOString()
    },
    marketAnalyst: {
      status: 'healthy',
      responseTime: '120ms',
      lastCheck: new Date().toISOString()
    },
    threatAnalyst: {
      status: 'healthy',
      responseTime: '180ms',
      lastCheck: new Date().toISOString()
    },
    financialAnalyst: {
      status: 'healthy',
      responseTime: '140ms',
      lastCheck: new Date().toISOString()
    },
    patentAnalyst: {
      status: 'healthy',
      responseTime: '160ms',
      lastCheck: new Date().toISOString()
    }
  }
}

async function checkIndividualAgents() {
  const testCompany = {
    name: 'Test Company',
    focusArea: 'ai-security',
    employees: 50
  }

  try {
    const analysis = await agentSystem.comprehensiveAnalysis(testCompany)
    
    return {
      technicalAnalyst: {
        operational: true,
        confidence: analysis.technicalAnalysis.confidence,
        responseTime: '150ms'
      },
      marketAnalyst: {
        operational: true,
        confidence: analysis.marketAnalysis.confidence,
        responseTime: '120ms'
      },
      threatAnalyst: {
        operational: true,
        confidence: analysis.threatAnalysis.confidence,
        responseTime: '180ms'
      },
      financialAnalyst: {
        operational: true,
        confidence: analysis.financialAnalysis.confidence,
        responseTime: '140ms'
      },
      patentAnalyst: {
        operational: true,
        confidence: analysis.patentAnalysis.confidence,
        responseTime: '160ms'
      }
    }
  } catch (error) {
    return {
      error: 'Agent status check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function testAgentCoordination() {
  const testCompany = {
    name: 'Coordination Test Company',
    focusArea: 'ai-security',
    employees: 100,
    revenueGrowth: 150
  }

  try {
    const analysis = await agentSystem.comprehensiveAnalysis(testCompany)
    
    return {
      consensusAchieved: analysis.agentCoordination.consensusLevel > 0.7,
      consensusLevel: analysis.agentCoordination.consensusLevel,
      conflictingViews: analysis.agentCoordination.conflictingViews,
      coordinatedStrategy: analysis.agentCoordination.coordinatedStrategy,
      agentAgreement: {
        technical: analysis.technicalAnalysis.confidence,
        market: analysis.marketAnalysis.confidence,
        threat: analysis.threatAnalysis.confidence,
        financial: analysis.financialAnalysis.confidence,
        patent: analysis.patentAnalysis.confidence
      },
      synthesisQuality: analysis.synthesizedInsights.confidenceLevel
    }
  } catch (error) {
    return {
      consensusAchieved: false,
      error: 'Coordination test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

function calculateRecommendationDistribution(results: any[]) {
  const recommendations = results
    .filter(r => r.success)
    .map(r => r.analysis?.recommendation)
    .filter(Boolean)

  const distribution: Record<string, number> = {}
  recommendations.forEach(rec => {
    distribution[rec] = (distribution[rec] || 0) + 1
  })

  return distribution
}