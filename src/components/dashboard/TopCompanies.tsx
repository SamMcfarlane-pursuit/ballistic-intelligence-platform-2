'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Company {
  id: string
  name: string
  category: string
  funding: number
  stage: string
  employees?: number
  founded?: number
  score: number
}

interface TopCompaniesProps {
  companies?: Company[]
}

export function TopCompanies({ companies }: TopCompaniesProps) {
  if (!companies) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-blue-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Strong'
    if (score >= 70) return 'Good'
    return 'Fair'
  }

  const formatFunding = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Companies</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/companies">
            View All
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {companies.slice(0, 5).map((company, index) => (
            <div 
              key={company.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-600">
                    {index + 1}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {company.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {company.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {formatFunding(company.funding)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {company.stage?.replace('-', ' ').toUpperCase()}
                    </span>
                    {company.employees && (
                      <span className="text-xs text-gray-500">
                        {company.employees.toLocaleString()} employees
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {company.score}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {getScoreLabel(company.score)}
                  </span>
                </div>
                
                <div className="w-2 h-8 rounded-full bg-gray-200">
                  <div 
                    className={`w-full rounded-full ${getScoreColor(company.score)}`}
                    style={{ height: `${company.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {companies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No companies data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}