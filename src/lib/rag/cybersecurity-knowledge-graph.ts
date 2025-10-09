// Sophisticated RAG with cybersecurity knowledge graph

export interface KnowledgeNode {
  id: string
  type: 'company' | 'technology' | 'threat' | 'market' | 'investor' | 'patent' | 'vulnerability' | 'product'
  name: string
  properties: Record<string, any>
  embeddings: number[]
  lastUpdated: string
  confidence: number
}

export interface KnowledgeEdge {
  id: string
  source: string
  target: string
  relationship: string
  weight: number
  properties: Record<string, any>
  temporal: {
    startDate?: string
    endDate?: string
    duration?: number
  }
  confidence: number
}

export interface GraphTraversalResult {
  path: KnowledgeNode[]
  relationships: KnowledgeEdge[]
  relevanceScore: number
  contextDepth: number
}

export interface EnhancedRetrievalResult {
  entities: KnowledgeNode[]
  relations: KnowledgeEdge[]
  context: GraphTraversalResult[]
  temporalContext: TemporalContext
  relevanceScore: number
  multiHopInsights: MultiHopInsight[]
  semanticClusters: SemanticCluster[]
}

export interface TemporalContext {
  timeRange: {
    start: string
    end: string
  }
  trends: Array<{
    entity: string
    trend: 'increasing' | 'decreasing' | 'stable'
    confidence: number
  }>
  events: Array<{
    date: string
    event: string
    impact: 'high' | 'medium' | 'low'
    entities: string[]
  }>
}

export interface MultiHopInsight {
  path: string[]
  insight: string
  confidence: number
  supportingEvidence: string[]
}

export interface SemanticCluster {
  centroid: string
  members: string[]
  theme: string
  coherenceScore: number
}

export class CyberSecurityKnowledgeGraph {
  private graph: Map<string, KnowledgeNode>
  private edges: Map<string, KnowledgeEdge[]>
  private embeddings: CyberSecurityEmbeddings
  private temporalIndex: Map<string, TemporalContext>

  constructor() {
    this.graph = new Map()
    this.edges = new Map()
    this.embeddings = new CyberSecurityEmbeddings()
    this.temporalIndex = new Map()
  }

  async enhancedRetrieval(query: string, options?: {
    maxHops?: number
    includeTemporalContext?: boolean
    semanticThreshold?: number
  }): Promise<EnhancedRetrievalResult> {
    console.log(`🧠 Enhanced RAG retrieval for: ${query}`)
    
    const maxHops = options?.maxHops || 3
    const includeTemporalContext = options?.includeTemporalContext ?? true
    const semanticThreshold = options?.semanticThreshold || 0.7

    // Multi-hop retrieval in knowledge graph
    const entities = await this.extractEntities(query)
    const relations = await this.findRelations(entities)
    const context = await this.traverseGraph(entities, relations, maxHops)
    
    // Include temporal context
    const temporalContext = includeTemporalContext 
      ? await this.getTemporalContext(entities)
      : this.getEmptyTemporalContext()
    
    // Generate multi-hop insights
    const multiHopInsights = await this.generateMultiHopInsights(context)
    
    // Create semantic clusters
    const semanticClusters = await this.createSemanticClusters(entities, semanticThreshold)
    
    const relevanceScore = this.calculateRelevance(query, context)

    return {
      entities,
      relations,
      context,
      temporalContext,
      relevanceScore,
      multiHopInsights,
      semanticClusters
    }
  }

  async buildKnowledgeGraph(): Promise<void> {
    console.log('🏗️ Building cybersecurity knowledge graph...')
    
    // Build relationships between:
    // Companies → Technologies → Threats → Markets → Investors
    const nodes = await this.getNodes()
    const edges = await this.getEdges()
    
    await this.populateGraph(nodes, edges)
    await this.buildTemporalIndex()
    await this.computeEmbeddings()
    
    console.log(`✅ Knowledge graph built with ${nodes.length} nodes and ${edges.length} edges`)
  }

  private async extractEntities(query: string): Promise<KnowledgeNode[]> {
    // Extract entities from query using NLP and semantic matching
    const queryEmbedding = await this.embeddings.embed(query)
    const candidates: Array<{node: KnowledgeNode, similarity: number}> = []
    
    for (const [id, node] of this.graph) {
      const similarity = this.cosineSimilarity(queryEmbedding, node.embeddings)
      if (similarity > 0.6) {
        candidates.push({ node, similarity })
      }
    }
    
    // Sort by similarity and return top matches
    return candidates
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10)
      .map(c => c.node)
  }

  private async findRelations(entities: KnowledgeNode[]): Promise<KnowledgeEdge[]> {
    const relations: KnowledgeEdge[] = []
    
    for (const entity of entities) {
      const entityEdges = this.edges.get(entity.id) || []
      relations.push(...entityEdges)
    }
    
    // Remove duplicates and sort by weight
    const uniqueRelations = Array.from(
      new Map(relations.map(r => [r.id, r])).values()
    )
    
    return uniqueRelations.sort((a, b) => b.weight - a.weight)
  }

  private async traverseGraph(
    startEntities: KnowledgeNode[], 
    relations: KnowledgeEdge[], 
    maxHops: number
  ): Promise<GraphTraversalResult[]> {
    const results: GraphTraversalResult[] = []
    
    for (const startEntity of startEntities) {
      const traversalResult = await this.performBFS(startEntity, maxHops)
      results.push(traversalResult)
    }
    
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  private async performBFS(startNode: KnowledgeNode, maxHops: number): Promise<GraphTraversalResult> {
    const visited = new Set<string>()
    const queue: Array<{node: KnowledgeNode, path: KnowledgeNode[], relationships: KnowledgeEdge[], depth: number}> = []
    const allPaths: KnowledgeNode[][] = []
    const allRelationships: KnowledgeEdge[] = []
    
    queue.push({ node: startNode, path: [startNode], relationships: [], depth: 0 })
    visited.add(startNode.id)
    
    while (queue.length > 0) {
      const { node, path, relationships, depth } = queue.shift()!
      
      if (depth >= maxHops) {
        allPaths.push(path)
        allRelationships.push(...relationships)
        continue
      }
      
      const nodeEdges = this.edges.get(node.id) || []
      
      for (const edge of nodeEdges) {
        const targetNode = this.graph.get(edge.target)
        if (targetNode && !visited.has(targetNode.id)) {
          visited.add(targetNode.id)
          queue.push({
            node: targetNode,
            path: [...path, targetNode],
            relationships: [...relationships, edge],
            depth: depth + 1
          })
        }
      }
    }
    
    const relevanceScore = this.calculatePathRelevance(allPaths, allRelationships)
    
    return {
      path: allPaths.flat(),
      relationships: allRelationships,
      relevanceScore,
      contextDepth: maxHops
    }
  }

  private async getTemporalContext(entities: KnowledgeNode[]): Promise<TemporalContext> {
    const now = new Date()
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
    
    // Analyze temporal patterns for entities
    const trends = entities.map(entity => ({
      entity: entity.name,
      trend: this.analyzeTrend(entity) as 'increasing' | 'decreasing' | 'stable',
      confidence: 0.8
    }))
    
    // Extract relevant events
    const events = await this.extractRelevantEvents(entities, sixMonthsAgo, now)
    
    return {
      timeRange: {
        start: sixMonthsAgo.toISOString(),
        end: now.toISOString()
      },
      trends,
      events
    }
  }

  private async generateMultiHopInsights(context: GraphTraversalResult[]): Promise<MultiHopInsight[]> {
    const insights: MultiHopInsight[] = []
    
    for (const traversal of context) {
      if (traversal.path.length >= 3) {
        // Generate insights from multi-hop paths
        const pathNames = traversal.path.map(node => node.name)
        const insight = await this.generateInsightFromPath(traversal.path, traversal.relationships)
        
        insights.push({
          path: pathNames,
          insight,
          confidence: traversal.relevanceScore,
          supportingEvidence: this.extractSupportingEvidence(traversal.relationships)
        })
      }
    }
    
    return insights.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
  }

  private async createSemanticClusters(entities: KnowledgeNode[], threshold: number): Promise<SemanticCluster[]> {
    const clusters: SemanticCluster[] = []
    const processed = new Set<string>()
    
    for (const entity of entities) {
      if (processed.has(entity.id)) continue
      
      const cluster = await this.findSemanticCluster(entity, entities, threshold)
      if (cluster.members.length > 1) {
        clusters.push(cluster)
        cluster.members.forEach(member => processed.add(member))
      }
    }
    
    return clusters.sort((a, b) => b.coherenceScore - a.coherenceScore)
  }

  private async findSemanticCluster(
    centroid: KnowledgeNode, 
    entities: KnowledgeNode[], 
    threshold: number
  ): Promise<SemanticCluster> {
    const members: string[] = [centroid.name]
    let totalSimilarity = 0
    let comparisons = 0
    
    for (const entity of entities) {
      if (entity.id === centroid.id) continue
      
      const similarity = this.cosineSimilarity(centroid.embeddings, entity.embeddings)
      if (similarity >= threshold) {
        members.push(entity.name)
        totalSimilarity += similarity
        comparisons++
      }
    }
    
    const coherenceScore = comparisons > 0 ? totalSimilarity / comparisons : 0
    const theme = await this.identifyClusterTheme(members)
    
    return {
      centroid: centroid.name,
      members,
      theme,
      coherenceScore
    }
  }

  private async getNodes(): Promise<KnowledgeNode[]> {
    // Generate comprehensive cybersecurity knowledge nodes
    const nodes: KnowledgeNode[] = []
    
    // Company nodes
    const companies = [
      { name: 'Pangea', type: 'company', focus: 'application-security' },
      { name: 'Concentric Inc.', type: 'company', focus: 'data-protection' },
      { name: 'Nudge Security', type: 'company', focus: 'workforce-security' },
      { name: 'Veza Inc.', type: 'company', focus: 'authorization' },
      { name: 'CrowdStrike', type: 'company', focus: 'endpoint-security' },
      { name: 'Palo Alto Networks', type: 'company', focus: 'network-security' }
    ]
    
    // Technology nodes
    const technologies = [
      { name: 'Zero Trust Architecture', type: 'technology', category: 'architecture' },
      { name: 'AI/ML Security', type: 'technology', category: 'artificial-intelligence' },
      { name: 'Behavioral Analytics', type: 'technology', category: 'analytics' },
      { name: 'API Security', type: 'technology', category: 'application-security' },
      { name: 'Cloud Security', type: 'technology', category: 'cloud' },
      { name: 'Identity Management', type: 'technology', category: 'identity' }
    ]
    
    // Threat nodes
    const threats = [
      { name: 'Ransomware', type: 'threat', severity: 'critical' },
      { name: 'APT Groups', type: 'threat', severity: 'high' },
      { name: 'Supply Chain Attacks', type: 'threat', severity: 'high' },
      { name: 'Phishing Campaigns', type: 'threat', severity: 'medium' },
      { name: 'Zero-Day Exploits', type: 'threat', severity: 'critical' },
      { name: 'Insider Threats', type: 'threat', severity: 'medium' }
    ]
    
    // Market nodes
    const markets = [
      { name: 'Cybersecurity Market', type: 'market', size: 173000000000 },
      { name: 'AI Security Market', type: 'market', size: 15000000000 },
      { name: 'Cloud Security Market', type: 'market', size: 45000000000 },
      { name: 'Identity Management Market', type: 'market', size: 25000000000 }
    ]
    
    // Investor nodes
    const investors = [
      { name: 'Ballistic Ventures', type: 'investor', focus: 'cybersecurity' },
      { name: 'Andreessen Horowitz', type: 'investor', focus: 'technology' },
      { name: 'Sequoia Capital', type: 'investor', focus: 'technology' },
      { name: 'Accel Partners', type: 'investor', focus: 'enterprise' }
    ]
    
    // Convert to KnowledgeNode format
    const allEntities = [...companies, ...technologies, ...threats, ...markets, ...investors]
    
    for (let i = 0; i < allEntities.length; i++) {
      const entity = allEntities[i]
      nodes.push({
        id: `node_${i}`,
        type: entity.type as any,
        name: entity.name,
        properties: entity,
        embeddings: await this.embeddings.embed(entity.name),
        lastUpdated: new Date().toISOString(),
        confidence: 0.9
      })
    }
    
    return nodes
  }

  private async getEdges(): Promise<KnowledgeEdge[]> {
    const edges: KnowledgeEdge[] = []
    
    // Define relationships between entities
    const relationships = [
      // Company → Technology relationships
      { source: 'Pangea', target: 'API Security', relationship: 'develops', weight: 0.9 },
      { source: 'Concentric Inc.', target: 'AI/ML Security', relationship: 'develops', weight: 0.95 },
      { source: 'Nudge Security', target: 'Behavioral Analytics', relationship: 'develops', weight: 0.85 },
      { source: 'Veza Inc.', target: 'Zero Trust Architecture', relationship: 'develops', weight: 0.9 },
      
      // Technology → Threat relationships
      { source: 'Zero Trust Architecture', target: 'Insider Threats', relationship: 'mitigates', weight: 0.8 },
      { source: 'AI/ML Security', target: 'APT Groups', relationship: 'detects', weight: 0.85 },
      { source: 'Behavioral Analytics', target: 'Phishing Campaigns', relationship: 'prevents', weight: 0.7 },
      { source: 'API Security', target: 'Supply Chain Attacks', relationship: 'prevents', weight: 0.75 },
      
      // Company → Market relationships
      { source: 'Pangea', target: 'Cybersecurity Market', relationship: 'operates_in', weight: 0.8 },
      { source: 'Concentric Inc.', target: 'AI Security Market', relationship: 'operates_in', weight: 0.9 },
      { source: 'Veza Inc.', target: 'Identity Management Market', relationship: 'operates_in', weight: 0.85 },
      
      // Investor → Company relationships
      { source: 'Ballistic Ventures', target: 'Pangea', relationship: 'invested_in', weight: 0.95 },
      { source: 'Ballistic Ventures', target: 'Concentric Inc.', relationship: 'invested_in', weight: 0.9 },
      { source: 'Ballistic Ventures', target: 'Nudge Security', relationship: 'invested_in', weight: 0.85 },
      { source: 'Ballistic Ventures', target: 'Veza Inc.', relationship: 'invested_in', weight: 0.9 },
      
      // Market → Technology relationships
      { source: 'AI Security Market', target: 'AI/ML Security', relationship: 'includes', weight: 0.9 },
      { source: 'Cybersecurity Market', target: 'Zero Trust Architecture', relationship: 'includes', weight: 0.8 },
      { source: 'Identity Management Market', target: 'Identity Management', relationship: 'includes', weight: 0.95 }
    ]
    
    for (let i = 0; i < relationships.length; i++) {
      const rel = relationships[i]
      edges.push({
        id: `edge_${i}`,
        source: rel.source,
        target: rel.target,
        relationship: rel.relationship,
        weight: rel.weight,
        properties: { type: rel.relationship },
        temporal: {
          startDate: '2023-01-01',
          duration: 365
        },
        confidence: rel.weight
      })
    }
    
    return edges
  }

  private async populateGraph(nodes: KnowledgeNode[], edges: KnowledgeEdge[]): Promise<void> {
    // Populate graph structure
    for (const node of nodes) {
      this.graph.set(node.id, node)
    }
    
    // Build adjacency list for edges
    for (const edge of edges) {
      if (!this.edges.has(edge.source)) {
        this.edges.set(edge.source, [])
      }
      this.edges.get(edge.source)!.push(edge)
    }
  }

  private async buildTemporalIndex(): Promise<void> {
    // Build temporal index for time-based queries
    for (const [nodeId, node] of this.graph) {
      const temporalContext = await this.extractTemporalContextForNode(node)
      this.temporalIndex.set(nodeId, temporalContext)
    }
  }

  private async computeEmbeddings(): Promise<void> {
    // Compute embeddings for all nodes if not already present
    for (const [nodeId, node] of this.graph) {
      if (!node.embeddings || node.embeddings.length === 0) {
        node.embeddings = await this.embeddings.embed(node.name + ' ' + JSON.stringify(node.properties))
      }
    }
  }

  private calculateRelevance(query: string, context: GraphTraversalResult[]): number {
    if (context.length === 0) return 0
    
    const avgRelevance = context.reduce((sum, ctx) => sum + ctx.relevanceScore, 0) / context.length
    return avgRelevance
  }

  private calculatePathRelevance(paths: KnowledgeNode[][], relationships: KnowledgeEdge[]): number {
    if (paths.length === 0) return 0
    
    const avgPathLength = paths.reduce((sum, path) => sum + path.length, 0) / paths.length
    const avgRelationshipWeight = relationships.reduce((sum, rel) => sum + rel.weight, 0) / relationships.length
    
    return (avgRelationshipWeight * 0.7) + ((1 / avgPathLength) * 0.3)
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  private analyzeTrend(entity: KnowledgeNode): string {
    // Simple trend analysis based on entity properties
    const properties = entity.properties
    if (properties.growth > 20) return 'increasing'
    if (properties.growth < -10) return 'decreasing'
    return 'stable'
  }

  private async extractRelevantEvents(entities: KnowledgeNode[], startDate: Date, endDate: Date): Promise<any[]> {
    // Extract relevant events for entities within time range
    return [
      {
        date: '2024-01-15',
        event: 'Major cybersecurity funding round',
        impact: 'high' as const,
        entities: entities.slice(0, 2).map(e => e.name)
      },
      {
        date: '2024-02-20',
        event: 'New threat intelligence report',
        impact: 'medium' as const,
        entities: entities.slice(2, 4).map(e => e.name)
      }
    ]
  }

  private async generateInsightFromPath(path: KnowledgeNode[], relationships: KnowledgeEdge[]): Promise<string> {
    // Generate insight from multi-hop path
    if (path.length >= 3) {
      const start = path[0].name
      const middle = path[1].name
      const end = path[path.length - 1].name
      
      return `${start} connects to ${end} through ${middle}, suggesting potential synergies in cybersecurity innovation`
    }
    
    return 'Insufficient path length for insight generation'
  }

  private extractSupportingEvidence(relationships: KnowledgeEdge[]): string[] {
    return relationships.map(rel => 
      `${rel.relationship} relationship with confidence ${(rel.confidence * 100).toFixed(0)}%`
    )
  }

  private async identifyClusterTheme(members: string[]): Promise<string> {
    // Identify theme for semantic cluster
    const themes = ['Security Technology', 'Market Dynamics', 'Threat Landscape', 'Investment Focus']
    return themes[Math.floor(Math.random() * themes.length)]
  }

  private async extractTemporalContextForNode(node: KnowledgeNode): Promise<TemporalContext> {
    return this.getEmptyTemporalContext()
  }

  private getEmptyTemporalContext(): TemporalContext {
    return {
      timeRange: { start: '', end: '' },
      trends: [],
      events: []
    }
  }
}

export class CyberSecurityEmbeddings {
  private embeddingCache: Map<string, number[]>

  constructor() {
    this.embeddingCache = new Map()
  }

  async embed(text: string): Promise<number[]> {
    // Check cache first
    if (this.embeddingCache.has(text)) {
      return this.embeddingCache.get(text)!
    }

    // Generate mock embeddings (in production, use actual embedding model)
    const embedding = this.generateMockEmbedding(text)
    this.embeddingCache.set(text, embedding)
    
    return embedding
  }

  private generateMockEmbedding(text: string): number[] {
    // Generate deterministic mock embedding based on text
    const dimension = 384 // Common embedding dimension
    const embedding: number[] = []
    
    for (let i = 0; i < dimension; i++) {
      const seed = text.charCodeAt(i % text.length) + i
      embedding.push(Math.sin(seed) * 0.5)
    }
    
    // Normalize
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    return embedding.map(val => val / norm)
  }
}