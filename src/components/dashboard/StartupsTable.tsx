'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'

interface Company {
  id: string
  name: string
  category: string
  funding: number
  stage: string
  score: number
  founded?: number
  employees?: number
}

interface StartupsTableProps {
  companies?: Company[]
}

export function StartupsTable({ companies }: StartupsTableProps) {
  // Extended mock data to match Figma table design
  const mockCompanies = [
    { id: '1', name: 'CyberShield', category: 'Cloud Security', funding: 125000000, stage: 'Series B', score: 95, founded: 2019, employees: 250 },
    { id: '2', name: 'SecureFlow', category: 'Network Security', funding: 89000000, stage: 'Series A', score: 92, founded: 2020, employees: 180 },
    { id: '3', name: 'DataGuard Pro', category: 'Data Protection', funding: 156000000, stage: 'Series C', score: 88, founded: 2018, employees: 320 },
    { id: '4', name: 'ThreatHunter', category: 'Threat Detection', funding: 67000000, stage: 'Series A', score: 85, founded: 2021, employees: 145 },
    { id: '5', name: 'ZeroTrust Inc', category: 'Identity Security', funding: 203000000, stage: 'Series D', score: 83, founded: 2017, employees: 450 },
    { id: '6', name: 'SecureNet AI', category: 'AI Security', funding: 45000000, stage: 'Seed', score: 81, founded: 2022, employees: 85 },
    { id: '7', name: 'CloudDefender', category: 'Cloud Security', funding: 78000000, stage: 'Series A', score: 79, founded: 2020, employees: 165 },
    { id: '8', name: 'CryptoGuard', category: 'Encryption', funding: 34000000, stage: 'Seed', score: 76, founded: 2021, employees: 95 }
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

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'seed':
        return 'bg-green-100 text-green-800'
      case 'series a':
        return 'bg-blue-100 text-blue-800'
      case 'series b':
        return 'bg-purple-100 text-purple-800'
      case 'series c':
        return 'bg-orange-100 text-orange-800'
      case 'series d':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              All Startups
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Complete overview of tracked cybersecurity startups
            </p>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Company</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Stage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Funding</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Employees</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Trend</th>
              </tr>
            </thead>
            <tbody>
              {displayCompanies.map((company, index) => (
                <tr 
                  key={company.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {company.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Founded {company.founded}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {company.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge 
                      className={`text-xs ${getStageColor(company.stage)}`}
                      variant="secondary"
                    >
                      {company.stage?.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900 text-sm">
                      {formatFunding(company.funding)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {company.employees?.toLocaleString() || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge 
                      className={`text-xs ${getScoreColor(company.score)}`}
                      variant="secondary"
                    >
                      {company.score}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {Math.random() > 0.3 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}