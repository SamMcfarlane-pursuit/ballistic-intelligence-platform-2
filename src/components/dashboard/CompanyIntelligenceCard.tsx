'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Globe,
  Linkedin,
  ExternalLink
} from 'lucide-react'

interface CompanyIntelligenceCardProps {
  company: {
    id: string
    name: string
    description: string
    sector: string
    location: string
    founded: number
    fundingFrom: string
    totalFunding: number
    lastRound: string
    lastRoundAmount: number
    latestDateOfFunding: string
    website?: string
    linkedin?: string
    team?: {
      ceo?: string
      cto?: string
      head?: string
    }
    brightData?: {
      newsSentiment?: 'positive' | 'neutral' | 'negative'
      recentMentions?: number
      patents?: number
      competitors?: string[]
      marketPosition?: string
      growthIndicators?: {
        hiring?: number
        funding?: number
        news?: number
      }
    }
  }
  onShowDetails: (company: any) => void
}

export default function CompanyIntelligenceCard({ company, onShowDetails }: CompanyIntelligenceCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`
    }
    return `${amount}`
  }

  return (
    <Card 
      className="bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => onShowDetails(company)}
    >
      <CardContent className="p-0">
        {/* Blue Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-4">
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white leading-tight">
                {company.name}
              </h3>
              <p className="text-xs text-white/90 mt-0.5">{company.sector}</p>
            </div>
            {company.brightData?.newsSentiment === 'positive' && (
              <Badge className="text-xs bg-green-500 text-white border-0 px-2 py-0.5 font-semibold shrink-0">
                Positive
              </Badge>
            )}
          </div>
          <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
            {company.description}
          </p>
        </div>

        {/* White Body */}
        <div className="p-4">
          {/* Company Details */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Location:</span>
              <span className="text-gray-900 font-medium text-right">{company.location}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Founded:</span>
              <span className="text-gray-900 font-medium">{company.founded}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Funding From:</span>
              <span className="text-blue-600 font-medium text-right truncate max-w-[60%]">{company.fundingFrom}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Total Funding:</span>
              <span className="text-gray-900 font-bold">${formatCurrency(company.totalFunding)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Last Round:</span>
              <span className="text-gray-900 font-semibold">{company.lastRound} - ${formatCurrency(company.lastRoundAmount)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Latest Funding:</span>
              <span className="text-gray-900 font-medium">{company.latestDateOfFunding}</span>
            </div>
          </div>

          {/* Company Links */}
          {(company.website || company.linkedin) && (
            <div className="border-t border-gray-200 pt-3 mb-3">
              <h4 className="text-xs font-semibold text-blue-900 mb-2 flex items-center">
                <Globe className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                Company Links
              </h4>
              <div className="space-y-1.5">
                {company.website && (
                  <a
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-between text-xs bg-blue-50 border border-blue-200 px-2.5 py-2 rounded hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-gray-700 font-medium flex items-center gap-1.5">
                      <ExternalLink className="h-3 w-3 text-blue-600" />
                      Website:
                    </span>
                    <span className="text-blue-600 font-semibold hover:underline truncate max-w-[55%]">
                      {company.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                    </span>
                  </a>
                )}
                {company.linkedin && (
                  <a
                    href={company.linkedin.startsWith('http') ? company.linkedin : `https://${company.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-between text-xs bg-blue-50 border border-blue-200 px-2.5 py-2 rounded hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-gray-700 font-medium flex items-center gap-1.5">
                      <Linkedin className="h-3 w-3 text-blue-600" />
                      LinkedIn:
                    </span>
                    <span className="text-blue-600 font-semibold hover:underline truncate max-w-[55%]">
                      {company.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace('linkedin.com/company/', '')}
                    </span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Leadership Team */}
          {company.team && (company.team.ceo || company.team.cto || company.team.head) && (
            <div className="border-t border-gray-200 pt-3">
              <h4 className="text-xs font-semibold text-blue-900 mb-2 flex items-center">
                <Building2 className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                Leadership Team
              </h4>
              <div className="space-y-1.5">
                {company.team.ceo && (
                  <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 px-2.5 py-2 rounded">
                    <span className="text-gray-700 font-medium">CEO:</span>
                    <span className="text-gray-900 font-semibold text-right truncate max-w-[65%]">{company.team.ceo}</span>
                  </div>
                )}
                {company.team.cto && (
                  <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 px-2.5 py-2 rounded">
                    <span className="text-gray-700 font-medium">CTO:</span>
                    <span className="text-gray-900 font-semibold text-right truncate max-w-[65%]">{company.team.cto}</span>
                  </div>
                )}
                {company.team.head && (
                  <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 px-2.5 py-2 rounded">
                    <span className="text-gray-700 font-medium">Head:</span>
                    <span className="text-gray-900 font-semibold text-right truncate max-w-[65%]">{company.team.head}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
