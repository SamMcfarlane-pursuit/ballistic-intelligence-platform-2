// Simple in-memory storage for AI analysis results
// In production, this would be replaced with a database

interface AIAnalysisRecord {
  id: string
  type: 'conference' | 'company' | 'investment' | 'vulnerability'
  query: string
  result: any
  timestamp: string
  userId?: string
  sessionId: string
}

class AIAnalysisStorage {
  private storage: Map<string, AIAnalysisRecord[]> = new Map()

  // Store analysis result
  storeAnalysis(record: Omit<AIAnalysisRecord, 'id' | 'timestamp'>): string {
    const id = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const fullRecord: AIAnalysisRecord = {
      ...record,
      id,
      timestamp: new Date().toISOString()
    }

    const sessionKey = record.sessionId
    if (!this.storage.has(sessionKey)) {
      this.storage.set(sessionKey, [])
    }
    
    this.storage.get(sessionKey)!.push(fullRecord)
    
    // Keep only last 50 analyses per session
    const analyses = this.storage.get(sessionKey)!
    if (analyses.length > 50) {
      this.storage.set(sessionKey, analyses.slice(-50))
    }
    
    return id
  }

  // Retrieve analysis by ID
  getAnalysis(id: string, sessionId: string): AIAnalysisRecord | null {
    const analyses = this.storage.get(sessionId) || []
    return analyses.find(record => record.id === id) || null
  }

  // Get all analyses for a session
  getSessionAnalyses(sessionId: string, type?: string): AIAnalysisRecord[] {
    const analyses = this.storage.get(sessionId) || []
    if (type) {
      return analyses.filter(record => record.type === type)
    }
    return analyses
  }

  // Get recent analyses across all sessions
  getRecentAnalyses(limit: number = 10): AIAnalysisRecord[] {
    const allAnalyses: AIAnalysisRecord[] = []
    
    for (const analyses of this.storage.values()) {
      allAnalyses.push(...analyses)
    }
    
    return allAnalyses
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  // Delete analysis
  deleteAnalysis(id: string, sessionId: string): boolean {
    const analyses = this.storage.get(sessionId) || []
    const index = analyses.findIndex(record => record.id === id)
    
    if (index !== -1) {
      analyses.splice(index, 1)
      return true
    }
    
    return false
  }

  // Clear session data
  clearSession(sessionId: string): void {
    this.storage.delete(sessionId)
  }

  // Get storage statistics
  getStats() {
    let totalAnalyses = 0
    const typeCounts: Record<string, number> = {}
    
    for (const analyses of this.storage.values()) {
      totalAnalyses += analyses.length
      for (const analysis of analyses) {
        typeCounts[analysis.type] = (typeCounts[analysis.type] || 0) + 1
      }
    }
    
    return {
      totalSessions: this.storage.size,
      totalAnalyses,
      typeCounts,
      averageAnalysesPerSession: totalAnalyses / this.storage.size || 0
    }
  }
}

// Export singleton instance
export const aiAnalysisStorage = new AIAnalysisStorage()

// Session management utilities
export class SessionManager {
  private static instance: SessionManager
  private currentSession: string

  private constructor() {
    this.currentSession = this.generateSessionId()
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getCurrentSession(): string {
    return this.currentSession
  }

  renewSession(): string {
    this.currentSession = this.generateSessionId()
    return this.currentSession
  }
}

export const sessionManager = SessionManager.getInstance()