// RAG-Enhanced AI Agents with Knowledge Graph Integration

import { CyberSecurityKnowledgeGraph, EnhancedRetrievalResult } from '../rag/cybersecurity-knowledge-graph'
import { CyberSecurityAgentSystem, ComprehensiveAnalysis } from './cybersecurity-agent-system'

export interface RAGEnhancedAnalysis extends ComprehensiveAnalysis {
  knowledgeGraphInsights: EnhancedRetrievalResult
  contextualRecommendations: ContextualRecommendation[]
  crossEntityInsights: CrossEntityInsight[]
  temporalAnalysis: TemporalAnalysis
  semanticConnections: SemanticConnection[]
}

export interface ContextualRecommendation {
  recommendation: string
  context: string[]
  confidence: number
  supportingEntities: string[]
  rationale: string
}

export interface CrossEntityInsight {
  entities: string[]
  relationship: string
  insight: string
  implications: string[]
  confidence: number
}

export interface TemporalAnalysis {
  timeframe: string
  trends: Array<{
    entity: string
    direction: 'up' | 'down' | 'stable'
    magnitude: number
    confidence: number
  }>
  predictions: Array<{
    entity: string
    prediction: string
    timeframe: string
    confidence: number
  }>
  seasonality: Array<{
    pattern: string
    entities: string[]
    strength: number
  }>
}

export interface SemanticConnection {
  sourceEntity: string
  targetEntity: string
  connectionType: string
  strength: number
  explanation: string
  businessImplications: string[]
}

export class RAGEnhancedAgentSystem {
  private agentSystem: CyberSecurityAgentSystem
  private knowledgeGraph: CyberSecurityKnowledgeGraph
  private initialized: boolean = false

  constructor() {
    this.agentSystem = new CyberSecurityAgentSystem()
    this.knowledgeGraph = new CyberSecurityKnowledgeGraph()
  }

  async initialize(): Promise<void> {
    if (this.initialized) return
    
    console.log('🚀 Initializing RAG-Enhanced Agent System...')
    
    // Build knowledge graph
    await this.knowledgeGraph.buildKnowledgeGraph()
    
    this.initialized = true
    console.log('✅ RAG-Enhanced Agent System initialized')
  }

  async comprehensiveRAGAnalysis(company: any, query?: string): Promise<RAGEnhancedAnalysis> {
    await this.initialize()
    
    console.log(`🧠 Starting RAG-enhanced analysis for ${company.name}`)
    
    // Generate analysis query if not provided
    const analysisQuery = query || this.generateAnalysisQuery(company)
    
    // Parallel execution of agent analysis and knowledge graph retrieval
    const [agentAnalysis, knowledgeGraphInsights] = await Promise.all([
      this.agentSystem.comprehensiveAnalysis(company),
      this.knowledgeGraph.enhancedRetrieval(analysisQuery, {
        maxHops: 3,
        includeTemporalContext: true,
        semanticThreshold: 0.7
      })
    ])
    
    // Generate enhanced insights by combining agent analysis with knowledge graph
    const contextualRecommendations = await this.generateContextualRecommendations(
      agentAnalysis, knowledgeGraphInsights
    )
    
    const crossEntityInsights = await this.generateCrossEntityInsights(
      agentAnalysis, knowledgeGraphInsights
    )
    
    const temporalAnalysis = await this.performTemporalAnalysis(
      company, knowledgeGraphInsights
    )
    
    const semanticConnections = await this.identifySemanticConnections(
      company, knowledgeGraphInsights
    )
    
    return {
      ...agentAnalysis,
      knowledgeGraphInsights,
      contextualRecommendations,
      crossEntityInsights,
      temporalAnalysis,
      semanticConnections
    }
  }

  async queryKnowledgeGraph(query: string): Promise<EnhancedRetrievalResult> {
    await this.initialize()
    
    return await this.knowledgeGraph.enhancedRetrieval(query, {
      maxHops: 4,
      includeTemporalContext: true,
      semanticThreshold: 0.6
    })
  }

  async discoverInvestmentOpportunities(focusArea: string): Promise<{
    opportunities: InvestmentOpportunity[]
    marketInsights: MarketInsight[]
    riskFactors: RiskFactor[]
  }> {
    await this.initialize()
    
    const query = `investment opportunities in ${focusArea} cybersecurity market trends competitive landscape`
    const knowledgeInsights = await this.knowledgeGraph.enhancedRetrieval(query)
    
    const opportunities = await this.extractInvestmentOpportunities(knowledgeInsights)
    const marketInsights = await this.extractMarketInsights(knowledgeInsights)
    const riskFactors = await this.extractRiskFactors(knowledgeInsights)
    
    return {
      opportunities,
      marketInsights,
      riskFactors
    }
  }

  async analyzeCompetitiveLandscape(company: any): Promise<{
    competitors: CompetitorAnalysis[]
    marketPosition: MarketPosition
    strategicRecommendations: string[]
  }> {
    await this.initialize()
    
    const query = `${company.name} competitors ${company.focusArea} market position competitive analysis`
    const knowledgeInsights = await this.knowledgeGraph.enhancedRetrieval(query)
    
    const competitors = await this.identifyCompetitors(company, knowledgeInsights)
    const marketPosition = await this.assessMarketPosition(company, knowledgeInsights)
    const strategicRecommendations = await this.generateStrategicRecommendations(
      company, competitors, marketPosition
    )
    
    return {
      competitors,
      marketPosition,
      strategicRecommendations
    }
  }

  private generateAnalysisQuery(company: any): string {
    const focusArea = company.focusArea || company.industry || 'cybersecurity'
    const stage = company.investmentStage || 'early-stage'
    
    return `${company.name} ${focusArea} ${stage} investment analysis market trends competitive landscape technology innovation`
  }

  private async generateContextualRecommendations(
    agentAnalysis: ComprehensiveAnalysis,
    knowledgeInsights: EnhancedRetrievalResult
  ): Promise<ContextualRecommendation[]> {
    const recommendations: ContextualRecommendation[] = []
    
    // Combine agent recommendations with knowledge graph context
    const agentRecs = agentAnalysis.synthesizedInsights.strategicRecommendations
    const contextEntities = knowledgeInsights.entities.map(e => e.name)
    
    for (const rec of agentRecs) {
      const contextualRec: ContextualRecommendation = {
        recommendation: rec,
        context: this.extractRelevantContext(rec, knowledgeInsights),
        confidence: this.calculateRecommendationConfidence(rec, knowledgeInsights),
        supportingEntities: contextEntities.slice(0, 3),
        rationale: await this.generateRationale(rec, knowledgeInsights)
      }
      
      recommendations.push(contextualRec)
    }
    
    // Generate additional recommendations from knowledge graph insights
    for (const insight of knowledgeInsights.multiHopInsights) {
      if (insight.confidence > 0.7) {
        recommendations.push({
          recommendation: `Leverage ${insight.path.join(' → ')} connection`,
          context: insight.supportingEvidence,
          confidence: insight.confidence,
          supportingEntities: insight.path,
          rationale: insight.insight
        })
      }
    }
    
    return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 8)
  }

  private async generateCrossEntityInsights(
    agentAnalysis: ComprehensiveAnalysis,
    knowledgeInsights: EnhancedRetrievalResult
  ): Promise<CrossEntityInsight[]> {
    const insights: CrossEntityInsight[] = []
    
    // Analyze relationships between entities in knowledge graph
    for (const relation of knowledgeInsights.relations) {
      if (relation.confidence > 0.8) {
        const sourceEntity = knowledgeInsights.entities.find(e => e.id === relation.source)
        const targetEntity = knowledgeInsights.entities.find(e => e.id === relation.target)
        
        if (sourceEntity && targetEntity) {
          insights.push({
            entities: [sourceEntity.name, targetEntity.name],
            relationship: relation.relationship,
            insight: await this.generateRelationshipInsight(sourceEntity, targetEntity, relation),
            implications: await this.generateBusinessImplications(sourceEntity, targetEntity, relation),
            confidence: relation.confidence
          })
        }
      }
    }
    
    return insights.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
  }

  private async performTemporalAnalysis(
    company: any,
    knowledgeInsights: EnhancedRetrievalResult
  ): Promise<TemporalAnalysis> {
    const temporalContext = knowledgeInsights.temporalContext
    
    // Analyze trends from temporal context
    const trends = temporalContext.trends.map(trend => ({
      entity: trend.entity,
      direction: trend.trend === 'increasing' ? 'up' as const : 
                trend.trend === 'decreasing' ? 'down' as const : 'stable' as const,
      magnitude: this.calculateTrendMagnitude(trend),
      confidence: trend.confidence
    }))
    
    // Generate predictions based on trends
    const predictions = await this.generatePredictions(company, trends)
    
    // Identify seasonal patterns
    const seasonality = await this.identifySeasonalPatterns(knowledgeInsights)
    
    return {
      timeframe: temporalContext.timeRange.start + ' to ' + temporalContext.timeRange.end,
      trends,
      predictions,
      seasonality
    }
  }

  private async identifySemanticConnections(
    company: any,
    knowledgeInsights: EnhancedRetrievalResult
  ): Promise<SemanticConnection[]> {
    const connections: SemanticConnection[] = []
    
    // Analyze semantic clusters for connections
    for (const cluster of knowledgeInsights.semanticClusters) {
      if (cluster.coherenceScore > 0.7) {
        for (let i = 0; i < cluster.members.length - 1; i++) {
          for (let j = i + 1; j < cluster.members.length; j++) {
            const source = cluster.members[i]
            const target = cluster.members[j]
            
            connections.push({
              sourceEntity: source,
              targetEntity: target,
              connectionType: 'semantic_similarity',
              strength: cluster.coherenceScore,
              explanation: `Both entities belong to ${cluster.theme} cluster`,
              businessImplications: await this.generateConnectionImplications(source, target, cluster.theme)
            })
          }
        }
      }
    }
    
    return connections.sort((a, b) => b.strength - a.strength).slice(0, 10)
  }

  private extractRelevantContext(recommendation: string, knowledgeInsights: EnhancedRetrievalResult): string[] {
    // Extract relevant context from knowledge graph for recommendation
    return knowledgeInsights.multiHopInsights
      .filter(insight => insight.confidence > 0.6)
      .map(insight => insight.insight)
      .slice(0, 3)
  }

  private calculateRecommendationConfidence(recommendation: string, knowledgeInsights: EnhancedRetrievalResult): number {
    // Calculate confidence based on knowledge graph support
    const baseConfidence = 0.7
    const supportingInsights = knowledgeInsights.multiHopInsights.filter(insight => 
      insight.confidence > 0.6
    ).length
    
    return Math.min(0.95, baseConfidence + (supportingInsights * 0.05))
  }

  private async generateRationale(recommendation: string, knowledgeInsights: EnhancedRetrievalResult): Promise<string> {
    // Generate rationale based on knowledge graph insights
    const supportingInsights = knowledgeInsights.multiHopInsights
      .filter(insight => insight.confidence > 0.6)
      .slice(0, 2)
    
    if (supportingInsights.length > 0) {
      return `Based on knowledge graph analysis: ${supportingInsights.map(i => i.insight).join('; ')}`
    }
    
    return 'Recommendation based on comprehensive multi-agent analysis'
  }

  private async generateRelationshipInsight(sourceEntity: any, targetEntity: any, relation: any): Promise<string> {
    return `${sourceEntity.name} ${relation.relationship} ${targetEntity.name} with ${(relation.confidence * 100).toFixed(0)}% confidence, indicating strong strategic alignment`
  }

  private async generateBusinessImplications(sourceEntity: any, targetEntity: any, relation: any): Promise<string[]> {
    return [
      'Potential for strategic partnerships',
      'Technology integration opportunities',
      'Market expansion possibilities',
      'Competitive advantage development'
    ]
  }

  private calculateTrendMagnitude(trend: any): number {
    // Calculate trend magnitude (mock implementation)
    return Math.random() * 0.5 + 0.25 // 0.25 to 0.75
  }

  private async generatePredictions(company: any, trends: any[]): Promise<any[]> {
    return trends
      .filter(trend => trend.confidence > 0.7)
      .map(trend => ({
        entity: trend.entity,
        prediction: `${trend.entity} expected to ${trend.direction === 'up' ? 'grow' : trend.direction === 'down' ? 'decline' : 'remain stable'} over next 12 months`,
        timeframe: '12 months',
        confidence: trend.confidence
      }))
  }

  private async identifySeasonalPatterns(knowledgeInsights: EnhancedRetrievalResult): Promise<any[]> {
    return [
      {
        pattern: 'Q4 cybersecurity investment surge',
        entities: knowledgeInsights.entities.slice(0, 3).map(e => e.name),
        strength: 0.8
      }
    ]
  }

  private async generateConnectionImplications(source: string, target: string, theme: string): Promise<string[]> {
    return [
      `Synergies in ${theme} domain`,
      'Cross-pollination opportunities',
      'Integrated solution potential'
    ]
  }

  private async extractInvestmentOpportunities(knowledgeInsights: EnhancedRetrievalResult): Promise<InvestmentOpportunity[]> {
    return knowledgeInsights.multiHopInsights
      .filter(insight => insight.confidence > 0.7)
      .map(insight => ({
        opportunity: insight.insight,
        entities: insight.path,
        confidence: insight.confidence,
        timeframe: '6-12 months',
        investmentSize: '$5M-15M',
        expectedReturn: '3-5x'
      }))
  }

  private async extractMarketInsights(knowledgeInsights: EnhancedRetrievalResult): Promise<MarketInsight[]> {
    return knowledgeInsights.semanticClusters.map(cluster => ({
      insight: `${cluster.theme} market showing strong coherence`,
      theme: cluster.theme,
      strength: cluster.coherenceScore,
      entities: cluster.members,
      implications: ['Market consolidation potential', 'Technology convergence']
    }))
  }

  private async extractRiskFactors(knowledgeInsights: EnhancedRetrievalResult): Promise<RiskFactor[]> {
    return [
      {
        risk: 'Market saturation in core segments',
        severity: 'medium',
        probability: 0.6,
        mitigation: 'Diversify into adjacent markets',
        entities: knowledgeInsights.entities.slice(0, 2).map(e => e.name)
      }
    ]
  }

  private async identifyCompetitors(company: any, knowledgeInsights: EnhancedRetrievalResult): Promise<CompetitorAnalysis[]> {
    return knowledgeInsights.entities
      .filter(entity => entity.type === 'company' && entity.name !== company.name)
      .map(competitor => ({
        name: competitor.name,
        similarity: 0.8,
        strengths: ['Market presence', 'Technology'],
        weaknesses: ['Limited innovation', 'High costs'],
        marketShare: 15,
        threat: 'medium' as const
      }))
  }

  private async assessMarketPosition(company: any, knowledgeInsights: EnhancedRetrievalResult): Promise<MarketPosition> {
    return {
      position: 'challenger',
      marketShare: 5.2,
      rank: 3,
      strengths: ['Innovation', 'Agility'],
      opportunities: ['Market expansion', 'Technology leadership'],
      threats: ['Competitive pressure', 'Market saturation']
    }
  }

  private async generateStrategicRecommendations(
    company: any, 
    competitors: CompetitorAnalysis[], 
    marketPosition: MarketPosition
  ): Promise<string[]> {
    return [
      'Focus on differentiation through innovation',
      'Expand into underserved market segments',
      'Develop strategic partnerships',
      'Invest in R&D for competitive advantage'
    ]
  }
}

// Supporting interfaces
interface InvestmentOpportunity {
  opportunity: string
  entities: string[]
  confidence: number
  timeframe: string
  investmentSize: string
  expectedReturn: string
}

interface MarketInsight {
  insight: string
  theme: string
  strength: number
  entities: string[]
  implications: string[]
}

interface RiskFactor {
  risk: string
  severity: 'low' | 'medium' | 'high'
  probability: number
  mitigation: string
  entities: string[]
}

interface CompetitorAnalysis {
  name: string
  similarity: number
  strengths: string[]
  weaknesses: string[]
  marketShare: number
  threat: 'low' | 'medium' | 'high'
}

interface MarketPosition {
  position: string
  marketShare: number
  rank: number
  strengths: string[]
  opportunities: string[]
  threats: string[]
}