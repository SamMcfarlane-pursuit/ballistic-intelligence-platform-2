/**
 * Company Profile API
 * Provides comprehensive company intelligence data
 * Aggregates data from multiple sources for deep dive analysis
 */

import { NextRequest, NextResponse } from 'next/server'
import { sanitizeText, checkRateLimit } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const rateLimit = checkRateLimit(clientIP, 30, 60000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const companyId = sanitizeText(searchParams.get('id') || '')

    if (!companyId) {
      return NextResponse.json({
        success: false,
        error: 'Company ID is required'
      }, { status: 400 })
    }

    // Simulate data aggregation from multiple sources
    const companyIntelligence = await aggregateCompanyIntelligence(companyId)

    return NextResponse.json({
      success: true,
      data: companyIntelligence,
      metadata: {
        lastUpdated: new Date().toISOString(),
        dataSourcesCount: 6,
        confidenceScore: 94
      }
    })

  } catch (error) {
    console.error('Company Profile API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * Aggregate company intelligence from multiple sources
 */
async function aggregateCompanyIntelligence(companyId: string) {
  // Simulate data aggregation delay
  await new Promise(resolve => setTimeout(resolve, 1200))

  // Mock comprehensive company data
  return {
    snapshot: {
      id: companyId,
      name: getCompanyName(companyId),
      website: `https://${companyId.toLowerCase()}.com`,
      location: getRandomLocation(),
      foundedYear: 2020 + Math.floor(Math.random() * 4),
      employeeRange: getRandomEmployeeRange(),
      category: getRandomCategory(),
      description: getCompanyDescription(companyId),
      status: 'active',
      lastUpdated: new Date().toISOString()
    },
    fundingHistory: generateFundingHistory(),
    team: generateTeamMembers(),
    customers: generateCustomers(),
    recentNews: generateRecentNews(),
    competitivePosition: {
      marketPosition: 'Emerging leader with strong technical differentiation and strategic partnerships',
      keyCompetitors: ['CrowdStrike', 'SentinelOne', 'Darktrace', 'Vectra AI'],
      differentiators: [
        'AI-powered threat detection',
        'Real-time response automation',
        'Cloud-native architecture',
        'Zero false positive guarantee'
      ]
    },
    investmentMetrics: {
      totalFunding: 26500000,
      lastRoundDate: '2024-09-15',
      investorCount: 8,
      momentum: 85 + Math.floor(Math.random() * 15),
      riskScore: 15 + Math.floor(Math.random() * 25)
    },
    dataSourceBreakdown: {
      crunchbase: 15,
      linkedin: 8,
      newsArticles: 23,
      companyWebsite: 12,
      patents: 3,
      other: 7
    }
  }
}

function getCompanyName(id: string): string {
  const names = [
    'QuantumShield Security',
    'CyberFlow AI',
    'SecureVault Pro',
    'ThreatGuard Systems',
    'ZeroTrust Networks',
    'CloudDefender',
    'AI Security Labs',
    'CyberSentinel'
  ]
  return names[Math.abs(id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % names.length]
}

function getRandomLocation(): string {
  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'Tel Aviv, Israel',
    'Austin, TX',
    'Boston, MA',
    'Seattle, WA',
    'London, UK',
    'Toronto, Canada'
  ]
  return locations[Math.floor(Math.random() * locations.length)]
}

function getRandomEmployeeRange(): string {
  const ranges = ['1-10', '11-25', '26-50', '51-100', '101-250', '251-500']
  return ranges[Math.floor(Math.random() * ranges.length)]
}

function getRandomCategory(): string {
  const categories = [
    'AI Security',
    'Cloud Security',
    'Zero Trust',
    'Application Security',
    'Identity & Access Management',
    'Threat Intelligence',
    'IoT Security'
  ]
  return categories[Math.floor(Math.random() * categories.length)]
}

function getCompanyDescription(id: string): string {
  return `Advanced cybersecurity platform leveraging artificial intelligence and machine learning to provide comprehensive threat detection and response capabilities for enterprise environments. The company's proprietary technology stack enables real-time analysis of security events and automated incident response.`
}

function generateFundingHistory() {
  return [
    {
      id: '1',
      roundType: 'Seed',
      amount: 4500000,
      date: '2023-03-15',
      leadInvestor: 'Bessemer Venture Partners',
      participants: ['Cyber Mentor Fund', 'Individual Angels', 'Strategic Investors'],
      source: 'Crunchbase'
    },
    {
      id: '2',
      roundType: 'Series A',
      amount: 22000000,
      date: '2024-09-15',
      leadInvestor: 'Andreessen Horowitz',
      participants: ['GV', 'Bessemer Venture Partners', 'CRV', 'Strategic Partners'],
      valuation: 85000000,
      source: 'TechCrunch'
    }
  ]
}

function generateTeamMembers() {
  return [
    {
      name: 'Dr. Sarah Chen',
      role: 'CEO & Co-Founder',
      linkedinUrl: 'https://linkedin.com/in/sarahchen',
      previousCompanies: ['Google', 'Palantir'],
      background: 'Former Google security engineer with PhD in Computer Science from Stanford'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-Founder',
      linkedinUrl: 'https://linkedin.com/in/mrodriguez',
      previousCompanies: ['Microsoft', 'FireEye'],
      background: 'Former Microsoft principal engineer specializing in threat detection systems'
    },
    {
      name: 'Jennifer Kim',
      role: 'VP of Engineering',
      previousCompanies: ['Uber', 'Airbnb'],
      background: 'Engineering leader with 10+ years in security and infrastructure'
    }
  ]
}

function generateCustomers() {
  return [
    {
      name: 'Microsoft Azure',
      type: 'enterprise' as const,
      relationship: 'partner' as const,
      source: 'Press Release'
    },
    {
      name: 'Goldman Sachs',
      type: 'enterprise' as const,
      relationship: 'customer' as const,
      source: 'Case Study'
    },
    {
      name: 'Department of Defense',
      type: 'government' as const,
      relationship: 'customer' as const,
      source: 'Public Contract'
    }
  ]
}

function generateRecentNews() {
  return [
    {
      id: '1',
      title: 'Series A Funding Announcement',
      description: 'Raised $22M to accelerate AI-powered security platform development',
      date: '2024-09-15',
      type: 'funding' as const,
      sentiment: 'positive' as const,
      source: 'TechCrunch',
      sourceUrl: 'https://techcrunch.com/funding-announcement'
    },
    {
      id: '2',
      title: 'Strategic Partnership with Microsoft',
      description: 'Integration with Azure Security Center for enhanced threat detection',
      date: '2024-08-22',
      type: 'partnership' as const,
      sentiment: 'positive' as const,
      source: 'Microsoft Blog',
      sourceUrl: 'https://microsoft.com/blog/partnership'
    },
    {
      id: '3',
      title: 'New AI Security Platform Launch',
      description: 'Next-generation threat detection with zero false positives',
      date: '2024-07-10',
      type: 'product' as const,
      sentiment: 'positive' as const,
      source: 'Company Blog',
      sourceUrl: 'https://company.com/blog/product-launch'
    }
  ]
}

export const runtime = 'nodejs'