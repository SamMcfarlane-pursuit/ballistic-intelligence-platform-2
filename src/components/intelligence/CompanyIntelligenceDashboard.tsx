'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Download,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface CompanyIntelligenceDashboardProps {
  companyId: string
}

interface CompanyData {
  id: string
  name: string
  description: string
  sector: string
  location: string
  founded: number
  totalFunding: number
  lastRound: string
  website?: string
  brightData?: {
    newsSentiment?: 'positive' | 'neutral' | 'negative'
    recentMentions?: number
    patents?: number
    competitors?: string[]
    marketPosition?: string
  }
}

export default function CompanyIntelligenceDashboard({ companyId }: CompanyIntelligenceDashboardProps) {
  const [company, setCompany] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for the company
    const mockCompany: CompanyData = {
      id: companyId,
      name: 'SecureFlow AI',
      description: 'AI-powered network security platform for real-time threat detection and response',
      sector: 'Network Security',
      location: 'San Francisco, CA, USA',
      founded: 2022,
      totalFunding: 45000000,
      lastRound: 'Series B',
      website: 'https://www.secureflow.ai',
      brightData: {
        newsSentiment: 'positive',
        recentMentions: 32,
        patents: 8,
        competitors: ['CrowdStrike', 'Palo Alto Networks', 'Darktrace'],
        marketPosition: 'Growing'
      }
    }

    setTimeout(() => {
      setCompany(mockCompany)
      setLoading(false)
    }, 1000)
  }, [companyId])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`
    return `$${amount}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company intelligence...</p>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Company not found</p>
        <Link href="/executive-dashboard">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/executive-dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600">{company.sector} • {company.location}</p>
          </div>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Funding</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(company.totalFunding)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Founded</p>
                <p className="text-2xl font-bold text-gray-900">{company.founded}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Round</p>
                <p className="text-2xl font-bold text-gray-900">{company.lastRound}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Patents</p>
                <p className="text-2xl font-bold text-gray-900">{company.brightData?.patents || 0}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Overview */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Company Overview</h2>
          <p className="text-gray-700 mb-6">{company.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Competitors</h3>
              <div className="space-y-2">
                {company.brightData?.competitors?.map((competitor, index) => (
                  <div key={index} className="text-gray-700">
                    • {competitor}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Intelligence */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Market Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">News Sentiment</p>
              <Badge 
                variant={company.brightData?.newsSentiment === 'positive' ? 'default' : 'secondary'}
                className="mt-2"
              >
                {company.brightData?.newsSentiment || 'Neutral'}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Recent Mentions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {company.brightData?.recentMentions || 0}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Market Position</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {company.brightData?.marketPosition || 'Unknown'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}