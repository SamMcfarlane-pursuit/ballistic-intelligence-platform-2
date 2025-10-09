'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Company {
  id: string
  name: string
  category: string
  funding: number
  stage: string
  score: number
}

interface TopPerformingStartupsProps {
  companies?: Company[]
}

export function TopPerformingStartups({ companies }: TopPerformingStartupsProps) {
  // Mock data to match Figma design
  const mockCompanies = [
    { id: '1', name: 'CyberShield', category: 'Cloud Security', funding: 125000000, stage: 'Series B', score: 95 },
    { id: '2', name: 'SecureFlow', category: 'Network Security', funding: 89000000, stage: 'Series A', score: 92 },
    { id: '3', name: 'DataGuard Pro', category: 'Data Protection', funding: 156000000, stage: 'Series C', score: 88 },
    { id: '4', name: 'ThreatHunter', category: 'Threat Detection', funding: 67000000, stage: 'Series A', score: 85 },
    { id: '5', name: 'ZeroTrust Inc', category: 'Identity Security', funding: 203000000, stage: 'Series D', score: 83 }
  ]

  const displayCompanies = companies || mockCompanies

  const formatFunding = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-blue-100 text-blue-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Top Performing Startups
          </CardTitle>
          <Link 
            href="/companies" 
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayCompanies.slice(0, 5).map((company, index) => (
            <div 
              key={company.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white text-sm font-medium">
                  {index + 1}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">
                    {company.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {company.category}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {company.stage?.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {formatFunding(company.funding)}
                  </span>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                </div>
                <Badge 
                  className={`text-xs ${getScoreColor(company.score)}`}
                  variant="secondary"
                >
                  Score: {company.score}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}