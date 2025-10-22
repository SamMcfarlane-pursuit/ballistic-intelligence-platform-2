'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import TechStack from '@/components/ui/tech-stack'
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  TrendingUp, 
  Globe,
  BarChart3,
  AlertCircle
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
    // BrightData enhanced fields
    brightData?: {
      newsSentiment?: 'positive' | 'neutral' | 'negative'
      recentMentions?: number
      techStack?: string[]
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
  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    }
    return `$${amount}`
  }

  return (
    <Card className="bg-white border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all group">
      <CardContent className="p-6">
        {/* Company Header */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
              {company.name}
            </h3>
            <p className="text-sm text-gray-500">{company.sector}</p>
          </div>
          
          {company.brightData?.newsSentiment === 'negative' && (
            <Badge 
              variant="secondary" 
              className="text-xs bg-red-100 text-red-800"
            >
              {company.brightData.newsSentiment}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {company.description}
        </p>

        {/* Company Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Location:</span>
            <div className="flex items-center text-gray-900">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{company.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Founded:</span>
            <div className="flex items-center text-gray-900">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{company.founded}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Funding From:</span>
            <div className="flex items-center text-orange-600">
              <Users className="h-3 w-3 mr-1" />
              <span>{company.fundingFrom}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Total Funding:</span>
            <span className="font-bold text-gray-900">{formatCurrency(company.totalFunding)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Last Round:</span>
            <span className="font-semibold text-gray-900">
              {company.lastRound} - {formatCurrency(company.lastRoundAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Latest Date of Funding:</span>
            <span className="text-gray-900">{company.latestDateOfFunding}</span>
          </div>
        </div>

        {/* BrightData Intelligence Section */}
        {company.brightData && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Globe className="h-4 w-4 text-orange-600 mr-2" />
              Intelligence Insights
            </h4>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {company.brightData.recentMentions !== undefined && (
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="text-xs text-gray-500">Mentions</div>
                  <div className="font-bold text-sm text-gray-900">{company.brightData.recentMentions}</div>
                </div>
              )}
              
              {company.brightData.patents !== undefined && (
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="text-xs text-gray-500">Patents</div>
                  <div className="font-bold text-sm text-gray-900">{company.brightData.patents}</div>
                </div>
              )}
              
              {company.brightData.growthIndicators?.funding !== undefined && (
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="text-xs text-gray-500">Funding</div>
                  <div className="font-bold text-sm text-gray-900">
                    +{company.brightData.growthIndicators.funding}%
                  </div>
                </div>
              )}
            </div>
            
            <TechStack 
              technologies={company.brightData.techStack || []} 
              variant="compact" 
              maxVisible={3}
              showIcons={true}
              className="mb-3"
            />
            
            {company.brightData.competitors && company.brightData.competitors.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Competitors</div>
                <div className="text-xs text-gray-700 truncate">
                  {company.brightData.competitors.slice(0, 2).join(', ')}
                  {company.brightData.competitors.length > 2 && ` +${company.brightData.competitors.length - 2} more`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Details Button */}
        <Button
          onClick={() => onShowDetails(company)}
          className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 rounded-lg transition-all group-hover:border-blue-600 group-hover:text-orange-600"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}