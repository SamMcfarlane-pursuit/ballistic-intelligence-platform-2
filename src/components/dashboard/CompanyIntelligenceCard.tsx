'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  Globe,
  BarChart3
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
    <Card className="bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#1A3766] border-2 border-[#0066FF] hover:border-[#1A3766] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
      
      <CardContent className="p-6 relative z-10">
        {/* Company Header */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-white/30">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white group-hover:text-white/90 transition-colors line-clamp-2">
              {company.name}
            </h3>
            <p className="text-sm text-white/80">{company.sector}</p>
          </div>
          
          {company.brightData?.newsSentiment === 'negative' && (
            <Badge 
              variant="secondary" 
              className="text-xs bg-red-500/90 text-white border-white/30"
            >
              {company.brightData.newsSentiment}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-white/90 mb-4 line-clamp-2">
          {company.description}
        </p>

        {/* Company Details */}
        <div className="space-y-2 mb-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Location:</span>
            <div className="flex items-center text-white font-medium">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{company.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Founded:</span>
            <div className="flex items-center text-white font-medium">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{company.founded}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Funding From:</span>
            <div className="flex items-center text-white font-medium">
              <Users className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[150px]">{company.fundingFrom}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Total Funding:</span>
            <span className="font-bold text-white">${formatCurrency(company.totalFunding)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Last Round:</span>
            <span className="font-semibold text-white">
              {company.lastRound} - ${formatCurrency(company.lastRoundAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Latest Funding:</span>
            <span className="text-white font-medium">{company.latestDateOfFunding}</span>
          </div>
        </div>

        {/* BrightData Intelligence Section */}
        {company.brightData && (
          <div className="border-t border-white/20 pt-4 mt-4">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center">
              <Globe className="h-4 w-4 text-white mr-2" />
              Intelligence Insights
            </h4>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {company.brightData.recentMentions !== undefined && (
                <div className="bg-white/15 backdrop-blur-sm p-2 rounded text-center border border-white/20">
                  <div className="text-xs text-white/70">Mentions</div>
                  <div className="font-bold text-sm text-white">{company.brightData.recentMentions}</div>
                </div>
              )}
              
              {company.brightData.patents !== undefined && (
                <div className="bg-white/15 backdrop-blur-sm p-2 rounded text-center border border-white/20">
                  <div className="text-xs text-white/70">Patents</div>
                  <div className="font-bold text-sm text-white">{company.brightData.patents}</div>
                </div>
              )}
              
              {company.brightData.growthIndicators?.funding !== undefined && (
                <div className="bg-white/15 backdrop-blur-sm p-2 rounded text-center border border-white/20">
                  <div className="text-xs text-white/70">Growth</div>
                  <div className="font-bold text-sm text-white">
                    +{company.brightData.growthIndicators.funding}%
                  </div>
                </div>
              )}
            </div>
            
            {company.brightData.competitors && company.brightData.competitors.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded border border-white/20">
                <div className="text-xs text-white/70 mb-1">Competitors</div>
                <div className="text-xs text-white truncate">
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
          className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 font-semibold py-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          View Full Details
        </Button>
      </CardContent>
    </Card>
  )
}