/**
 * Trending Factor Calculation Engine
 * Analyzes company data to calculate trending scores based on multiple factors
 */

interface TrendingFactors {
  fundingMomentum: number      // Recent funding activity
  growthRate: number           // Revenue/valuation growth
  marketInterest: number       // Sector popularity
  investorActivity: number     // Number of active investors
  timeRelevance: number        // Recency of activity
  overallTrending: number      // Composite trending score
}

interface CompanyTrending {
  id: string
  name: string
  category: string
  trendingScore: number
  trendingFactors: TrendingFactors
  trendDirection: 'up' | 'down' | 'stable'
  percentageChange: number
  rank: number
  lastUpdated: Date
}

/**
 * Calculate funding momentum based on recent activity
 */
function calculateFundingMomentum(
  totalFunding: number,
  lastFundingDate: Date | null,
  fundingRoundsCount: number
): number {
  if (!lastFundingDate || totalFunding === 0) return 0

  const daysSinceLastFunding = Math.floor(
    (Date.now() - new Date(lastFundingDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Higher score for recent funding
  const recencyScore = Math.max(0, 100 - daysSinceLastFunding / 3)
  
  // Funding size score (normalized to 0-100)
  const fundingScore = Math.min(100, (totalFunding / 100000000) * 50)
  
  // Funding frequency score
  const frequencyScore = Math.min(100, fundingRoundsCount * 25)

  return (recencyScore * 0.5 + fundingScore * 0.3 + frequencyScore * 0.2)
}

/**
 * Calculate market interest based on category popularity
 */
function calculateMarketInterest(
  category: string,
  allCompanies: Array<{ primary_category: string; total_funding: number }>
): number {
  // Count companies in same category
  const categoryCompanies = allCompanies.filter(
    c => c.primary_category === category
  )

  // Calculate total funding in category
  const categoryFunding = categoryCompanies.reduce(
    (sum, c) => sum + (c.total_funding || 0),
    0
  )

  // Popularity score based on number of companies
  const popularityScore = Math.min(100, (categoryCompanies.length / allCompanies.length) * 200)
  
  // Investment interest score
  const investmentScore = Math.min(100, (categoryFunding / 1000000000) * 50)

  return (popularityScore * 0.6 + investmentScore * 0.4)
}

/**
 * Calculate investor activity score
 */
function calculateInvestorActivity(
  investors: any[],
  leadInvestor: string | null
): number {
  if (!investors || investors.length === 0) return 0

  // More investors = higher score
  const diversityScore = Math.min(100, investors.length * 20)
  
  // Premium investors boost score
  const premiumInvestors = ['Sequoia', 'a16z', 'Accel', 'Benchmark', 'Founders Fund']
  const hasPremium = investors.some(inv => 
    premiumInvestors.some(premium => 
      typeof inv === 'string' && inv.toLowerCase().includes(premium.toLowerCase())
    )
  )
  
  const premiumBoost = hasPremium ? 30 : 0

  return Math.min(100, diversityScore + premiumBoost)
}

/**
 * Calculate time relevance (recency bias)
 */
function calculateTimeRelevance(
  foundedYear: number,
  lastFundingDate: Date | null
): number {
  const currentYear = new Date().getFullYear()
  const age = currentYear - foundedYear

  // Newer companies get higher scores
  const ageScore = Math.max(0, 100 - (age * 10))

  // Recent activity boosts score
  let activityBoost = 0
  if (lastFundingDate) {
    const monthsSinceActivity = Math.floor(
      (Date.now() - new Date(lastFundingDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
    activityBoost = Math.max(0, 50 - monthsSinceActivity * 5)
  }

  return Math.min(100, ageScore * 0.6 + activityBoost * 0.4)
}

/**
 * Calculate trending direction
 */
function calculateTrendDirection(
  currentScore: number,
  previousScore: number = 0
): { direction: 'up' | 'down' | 'stable'; percentageChange: number } {
  const change = currentScore - previousScore
  const percentageChange = previousScore > 0 ? (change / previousScore) * 100 : 0

  let direction: 'up' | 'down' | 'stable'
  if (Math.abs(percentageChange) < 5) {
    direction = 'stable'
  } else if (change > 0) {
    direction = 'up'
  } else {
    direction = 'down'
  }

  return { direction, percentageChange: Math.abs(percentageChange) }
}

/**
 * Main trending factor calculation
 */
export function calculateTrendingFactors(
  company: {
    id: string
    name: string
    primary_category: string
    total_funding: number
    last_funding_date: Date | null
    funding_rounds_count: number
    founded_year: number
    growth_rate?: number
    current_stage?: string
  },
  allCompanies: Array<{
    primary_category: string
    total_funding: number
  }>,
  fundingData?: {
    investors: any[]
    lead_investor: string | null
  }
): CompanyTrending {
  // Calculate individual factors
  const fundingMomentum = calculateFundingMomentum(
    company.total_funding || 0,
    company.last_funding_date,
    company.funding_rounds_count || 0
  )

  const growthRate = Math.min(100, (company.growth_rate || 0) / 2)

  const marketInterest = calculateMarketInterest(
    company.primary_category,
    allCompanies
  )

  const investorActivity = fundingData
    ? calculateInvestorActivity(fundingData.investors, fundingData.lead_investor)
    : 0

  const timeRelevance = calculateTimeRelevance(
    company.founded_year,
    company.last_funding_date
  )

  // Calculate composite trending score (weighted average)
  const overallTrending = Math.round(
    fundingMomentum * 0.25 +
    growthRate * 0.20 +
    marketInterest * 0.20 +
    investorActivity * 0.20 +
    timeRelevance * 0.15
  )

  // Calculate trend direction (simulated - in production, compare with historical data)
  const previousScore = overallTrending * 0.85 // Simulated previous score
  const { direction, percentageChange } = calculateTrendDirection(
    overallTrending,
    previousScore
  )

  return {
    id: company.id,
    name: company.name,
    category: company.primary_category,
    trendingScore: overallTrending,
    trendingFactors: {
      fundingMomentum: Math.round(fundingMomentum),
      growthRate: Math.round(growthRate),
      marketInterest: Math.round(marketInterest),
      investorActivity: Math.round(investorActivity),
      timeRelevance: Math.round(timeRelevance),
      overallTrending
    },
    trendDirection: direction,
    percentageChange: Math.round(percentageChange),
    rank: 0, // Will be set after sorting
    lastUpdated: new Date()
  }
}

/**
 * Rank companies by trending score
 */
export function rankTrendingCompanies(
  trendingData: CompanyTrending[]
): CompanyTrending[] {
  return trendingData
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .map((company, index) => ({
      ...company,
      rank: index + 1
    }))
}

/**
 * Get trending companies by category
 */
export function getTrendingByCategory(
  trendingData: CompanyTrending[],
  category: string,
  limit: number = 10
): CompanyTrending[] {
  return trendingData
    .filter(c => c.category.toLowerCase().includes(category.toLowerCase()))
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)
}

/**
 * Get top trending companies
 */
export function getTopTrending(
  trendingData: CompanyTrending[],
  limit: number = 10
): CompanyTrending[] {
  return trendingData
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)
}

/**
 * Get trending sectors
 */
export function getTrendingSectors(
  trendingData: CompanyTrending[]
): Array<{
  sector: string
  averageTrendingScore: number
  companyCount: number
  topCompany: string
}> {
  const sectorMap = new Map<string, {
    scores: number[]
    companies: string[]
    topScore: number
    topCompany: string
  }>()

  trendingData.forEach(company => {
    const existing = sectorMap.get(company.category) || {
      scores: [],
      companies: [],
      topScore: 0,
      topCompany: ''
    }

    existing.scores.push(company.trendingScore)
    existing.companies.push(company.name)

    if (company.trendingScore > existing.topScore) {
      existing.topScore = company.trendingScore
      existing.topCompany = company.name
    }

    sectorMap.set(company.category, existing)
  })

  const sectors = Array.from(sectorMap.entries()).map(([sector, data]) => ({
    sector,
    averageTrendingScore: Math.round(
      data.scores.reduce((a, b) => a + b, 0) / data.scores.length
    ),
    companyCount: data.companies.length,
    topCompany: data.topCompany
  }))

  return sectors.sort((a, b) => b.averageTrendingScore - a.averageTrendingScore)
}
