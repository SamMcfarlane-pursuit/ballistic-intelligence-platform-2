'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Building2, DollarSign, Globe } from 'lucide-react'

interface SectorIntelligenceCardProps {
  sector: {
    id: string
    name: string
    rank: number
    companies: number
    totalFunding: number
    momentumScore: number
    momentumGrowth: number
    // BrightData enhanced fields
    marketGrowth?: number
    investmentTrends?: string[]
    keyPlayers?: string[]
    emergingTechnologies?: string[]
  }
  displayMode: 'grid' | 'list'
}

export default function SectorIntelligenceCard({ sector, displayMode }: SectorIntelligenceCardProps) {
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

  if (displayMode === 'list') {
    return (
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-800 font-bold">{sector.rank}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{sector.name}</h3>
            <p className="text-sm text-gray-500">{sector.companies} companies</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm text-gray-500">Funding</p>
            <p className="font-bold text-gray-900">{formatCurrency(sector.totalFunding)}</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Momentum</p>
            <p className="font-bold text-gray-900 flex items-center">
              {sector.momentumScore}
              <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
            </p>
          </div>
          
          {sector.marketGrowth && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Growth</p>
              <p className="font-bold text-gray-900">{sector.marketGrowth}%</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group">
      <CardContent className="p-6">
        {/* Rank Badge */}
        <div className="flex items-center justify-between mb-4">
          <Badge 
            className={`${
              sector.rank === 1 
                ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                : sector.rank === 2 
                  ? 'bg-gray-100 text-gray-800 border-gray-300' 
                  : sector.rank === 3 
                    ? 'bg-amber-100 text-amber-800 border-amber-300' 
                    : 'bg-blue-100 text-blue-800 border-blue-300'
            } border font-bold px-3 py-1 rounded-full`}
          >
            #{sector.rank}
          </Badge>
          
          {sector.marketGrowth && (
            <Badge variant="secondary" className="text-xs">
              +{sector.marketGrowth}% growth
            </Badge>
          )}
        </div>

        {/* Sector Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {sector.name}
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="text-xs">Companies</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{sector.companies}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-xs">Funding</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(sector.totalFunding)}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs">Momentum</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{sector.momentumScore}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <Globe className="h-4 w-4 mr-1" />
              <span className="text-xs">Growth</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {sector.momentumGrowth}%
            </p>
          </div>
        </div>

        {/* BrightData Intelligence Section */}
        {(sector.investmentTrends || sector.keyPlayers || sector.emergingTechnologies) && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Globe className="h-4 w-4 text-blue-600 mr-2" />
              Sector Intelligence
            </h4>
            
            {sector.investmentTrends && sector.investmentTrends.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Investment Trends</div>
                <div className="flex flex-wrap gap-1">
                  {sector.investmentTrends.slice(0, 2).map((trend, index) => (
                    <Badge key={index} variant="default" className="text-xs bg-blue-100 text-blue-800">
                      {trend}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {sector.keyPlayers && sector.keyPlayers.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Key Players</div>
                <div className="text-xs text-gray-700">
                  {sector.keyPlayers.slice(0, 3).join(', ')}
                  {sector.keyPlayers.length > 3 && ` +${sector.keyPlayers.length - 3} more`}
                </div>
              </div>
            )}
            
            {sector.emergingTechnologies && sector.emergingTechnologies.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Emerging Tech</div>
                <div className="flex flex-wrap gap-1">
                  {sector.emergingTechnologies.slice(0, 2).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}