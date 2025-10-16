/**
 * Vector Store for RAG (Retrieval-Augmented Generation)
 * Provides semantic search capabilities over company data
 */

interface CompanyVector {
  id: string
  name: string
  description: string
  category: string
  funding: number
  stage: string
  location: string
  embedding?: number[]
}

interface SearchResult {
  company: CompanyVector
  score: number
  relevance: string
}

/**
 * Simple cosine similarity calculation
 */
function cosineSimilarity(a: number[], b: number[]): number {
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

/**
 * Simple text embedding using character frequency
 * In production, use OpenAI embeddings or similar
 */
function createSimpleEmbedding(text: string): number[] {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, '')
  const words = normalized.split(/\s+/)
  
  // Create a simple 100-dimensional embedding based on word characteristics
  const embedding = new Array(100).fill(0)
  
  words.forEach((word, idx) => {
    const hash = word.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0)
    }, 0)
    
    const position = Math.abs(hash) % 100
    embedding[position] += 1 / (idx + 1) // Weight by position
  })
  
  // Normalize
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map(val => val / (norm || 1))
}

/**
 * Vector Store Class
 */
export class VectorStore {
  private vectors: Map<string, CompanyVector> = new Map()

  /**
   * Add company to vector store
   */
  async addCompany(company: {
    id: string
    name: string
    description: string
    category: string
    funding: number
    stage: string
    location: string
  }): Promise<void> {
    const searchText = `${company.name} ${company.description} ${company.category} ${company.location}`
    const embedding = createSimpleEmbedding(searchText)
    
    this.vectors.set(company.id, {
      ...company,
      embedding
    })
  }

  /**
   * Semantic search across all companies
   */
  async search(query: string, limit: number = 5): Promise<SearchResult[]> {
    const queryEmbedding = createSimpleEmbedding(query)
    const results: SearchResult[] = []

    for (const [id, companyVector] of this.vectors) {
      if (!companyVector.embedding) continue
      
      const score = cosineSimilarity(queryEmbedding, companyVector.embedding)
      
      // Determine relevance
      let relevance: string
      if (score > 0.8) relevance = 'high'
      else if (score > 0.5) relevance = 'medium'
      else relevance = 'low'

      results.push({
        company: companyVector,
        score,
        relevance
      })
    }

    // Sort by score descending and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * Filter by category
   */
  async searchByCategory(category: string, limit: number = 10): Promise<CompanyVector[]> {
    const results: CompanyVector[] = []
    
    for (const [id, company] of this.vectors) {
      if (company.category.toLowerCase().includes(category.toLowerCase())) {
        results.push(company)
      }
    }
    
    return results.slice(0, limit)
  }

  /**
   * Filter by funding range
   */
  async searchByFunding(minFunding: number, maxFunding: number): Promise<CompanyVector[]> {
    const results: CompanyVector[] = []
    
    for (const [id, company] of this.vectors) {
      if (company.funding >= minFunding && company.funding <= maxFunding) {
        results.push(company)
      }
    }
    
    return results.sort((a, b) => b.funding - a.funding)
  }

  /**
   * Get total count
   */
  getCount(): number {
    return this.vectors.size
  }

  /**
   * Clear all vectors
   */
  clear(): void {
    this.vectors.clear()
  }
}

// Singleton instance
let vectorStoreInstance: VectorStore | null = null

export function getVectorStore(): VectorStore {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new VectorStore()
  }
  return vectorStoreInstance
}
