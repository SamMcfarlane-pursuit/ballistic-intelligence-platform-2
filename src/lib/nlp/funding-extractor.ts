import { ScrapedFundingData } from '../scrapers/techcrunch-scraper'

export interface ExtractedFundingData {
  companyName: string
  fundingAmount: number
  currency: string
  roundType: string
  leadInvestors: string[]
  participatingInvestors: string[]
  announcedDate: string
  valuation?: number
  confidence: number
  source: string
  url: string
  title: string
}

export class FundingDataExtractor {
  private companyPatterns = [
    /([A-Z][a-zA-Z0-9\s&.-]+?)(?:\s+(?:raises?|raised|secured?|closes?|closed|announced?|gets?|received?))/gi,
    /(?:startup|company)\s+([A-Z][a-zA-Z0-9\s&.-]+?)(?:\s+(?:raises?|raised))/gi,
    /([A-Z][a-zA-Z0-9\s&.-]+?)(?:\s+(?:has\s+)?(?:raises?|raised|secured?|closes?))/gi
  ]

  private amountPatterns = [
    /\$(\d+(?:\.\d+)?)\s*(million|billion|M|B)/gi,
    /(\d+(?:\.\d+)?)\s*million\s*dollars?/gi,
    /(\d+(?:\.\d+)?)\s*billion\s*dollars?/gi,
    /\$(\d+(?:,\d{3})*(?:\.\d+)?)/g
  ]

  private roundTypePatterns = [
    /series\s+([A-Z])\s+(?:round|funding)/gi,
    /(seed|pre-seed)\s+(?:round|funding)/gi,
    /(bridge|convertible)\s+(?:round|funding)/gi,
    /(ipo|acquisition|exit)/gi
  ]

  private investorPatterns = [
    /led\s+by\s+([^,.]+)/gi,
    /(?:lead\s+)?investors?\s+(?:include|are)\s+([^.]+)/gi,
    /participated\s+by\s+([^.]+)/gi,
    /(?:with\s+participation\s+from|joined\s+by)\s+([^.]+)/gi
  ]

  private valuationPatterns = [
    /valued?\s+at\s+\$(\d+(?:\.\d+)?)\s*(million|billion|M|B)/gi,
    /valuation\s+of\s+\$(\d+(?:\.\d+)?)\s*(million|billion|M|B)/gi
  ]

  async extractFundingData(scrapedData: ScrapedFundingData[]): Promise<ExtractedFundingData[]> {
    const extractedData: ExtractedFundingData[] = []

    for (const article of scrapedData) {
      try {
        const extracted = await this.processArticle(article)
        if (extracted && extracted.confidence > 0.6) {
          extractedData.push(extracted)
        }
      } catch (error) {
        console.error('Error processing article:', error)
      }
    }

    return extractedData
  }

  private async processArticle(article: ScrapedFundingData): Promise<ExtractedFundingData | null> {
    const text = article.rawText
    let confidence = 0

    // Extract company name
    const companyName = this.extractCompanyName(text)
    if (!companyName) return null
    confidence += 0.3

    // Extract funding amount
    const fundingInfo = this.extractFundingAmount(text)
    if (!fundingInfo.amount) return null
    confidence += 0.3

    // Extract round type
    const roundType = this.extractRoundType(text)
    if (roundType) confidence += 0.2

    // Extract investors
    const investors = this.extractInvestors(text)
    if (investors.lead.length > 0 || investors.participating.length > 0) {
      confidence += 0.2
    }

    // Extract valuation
    const valuation = this.extractValuation(text)

    // Parse date
    const announcedDate = this.parseDate(article.publishedDate)

    return {
      companyName: this.cleanCompanyName(companyName),
      fundingAmount: fundingInfo.amount,
      currency: fundingInfo.currency,
      roundType: roundType || 'Unknown',
      leadInvestors: investors.lead,
      participatingInvestors: investors.participating,
      announcedDate,
      valuation,
      confidence,
      source: article.source,
      url: article.url,
      title: article.title
    }
  }

  private extractCompanyName(text: string): string | null {
    for (const pattern of this.companyPatterns) {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        const companyName = matches[0][1]?.trim()
        if (companyName && companyName.length > 2 && companyName.length < 50) {
          return companyName
        }
      }
    }
    return null
  }

  private extractFundingAmount(text: string): { amount: number; currency: string } {
    for (const pattern of this.amountPatterns) {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        const match = matches[0]
        let amount = parseFloat(match[1])
        const unit = match[2]?.toLowerCase()

        if (unit === 'billion' || unit === 'b') {
          amount *= 1000000000
        } else if (unit === 'million' || unit === 'm') {
          amount *= 1000000
        }

        return { amount, currency: 'USD' }
      }
    }
    return { amount: 0, currency: 'USD' }
  }

  private extractRoundType(text: string): string | null {
    for (const pattern of this.roundTypePatterns) {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        const roundType = matches[0][1] || matches[0][0]
        return this.normalizeRoundType(roundType.trim())
      }
    }
    return null
  }

  private extractInvestors(text: string): { lead: string[]; participating: string[] } {
    const lead: string[] = []
    const participating: string[] = []

    for (const pattern of this.investorPatterns) {
      const matches = [...text.matchAll(pattern)]
      for (const match of matches) {
        const investorText = match[1]?.trim()
        if (investorText) {
          const investors = this.parseInvestorList(investorText)
          
          if (match[0].toLowerCase().includes('led by')) {
            lead.push(...investors)
          } else {
            participating.push(...investors)
          }
        }
      }
    }

    return {
      lead: [...new Set(lead)], // Remove duplicates
      participating: [...new Set(participating)]
    }
  }

  private extractValuation(text: string): number | undefined {
    for (const pattern of this.valuationPatterns) {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        let amount = parseFloat(matches[0][1])
        const unit = matches[0][2]?.toLowerCase()

        if (unit === 'billion' || unit === 'b') {
          amount *= 1000000000
        } else if (unit === 'million' || unit === 'm') {
          amount *= 1000000
        }

        return amount
      }
    }
    return undefined
  }

  private parseInvestorList(investorText: string): string[] {
    return investorText
      .split(/,|\sand\s/)
      .map(investor => investor.trim())
      .filter(investor => investor.length > 2 && investor.length < 50)
      .map(investor => this.cleanInvestorName(investor))
  }

  private cleanCompanyName(name: string): string {
    return name
      .replace(/\b(Inc|LLC|Corp|Ltd|Co)\b\.?/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private cleanInvestorName(name: string): string {
    return name
      .replace(/^(and|&)\s+/i, '')
      .replace(/\s+(and|&)\s*$/i, '')
      .trim()
  }

  private normalizeRoundType(roundType: string): string {
    const normalized = roundType.toLowerCase()
    
    if (normalized.includes('series a') || normalized === 'a') return 'Series A'
    if (normalized.includes('series b') || normalized === 'b') return 'Series B'
    if (normalized.includes('series c') || normalized === 'c') return 'Series C'
    if (normalized.includes('series d') || normalized === 'd') return 'Series D'
    if (normalized.includes('seed')) return 'Seed'
    if (normalized.includes('pre-seed')) return 'Pre-Seed'
    if (normalized.includes('bridge')) return 'Bridge'
    if (normalized.includes('convertible')) return 'Convertible'
    if (normalized.includes('ipo')) return 'IPO'
    if (normalized.includes('acquisition')) return 'Acquisition'
    
    return roundType
  }

  private parseDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return new Date().toISOString()
      }
      return date.toISOString()
    } catch {
      return new Date().toISOString()
    }
  }
}