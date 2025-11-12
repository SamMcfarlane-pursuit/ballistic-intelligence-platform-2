'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Building2, DollarSign, Globe, Eye } from 'lucide-react'
import SectorDetailsDialog from './SectorDetailsDialog'

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
  dataSource?: 'brightdata' | 'crunchbase' | 'combined'
}

export default function SectorIntelligenceCard({ sector, displayMode, dataSource = 'combined' }: SectorIntelligenceCardProps) {
  const [showDetails, setShowDetails] = useState(false)

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
    <Card className="bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#1A3766] border-2 border-[#0066FF] hover:border-[#1A3766] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
      
      <CardContent className="p-6 relative z-10">
        {/* Rank Badge */}
        <div className="flex items-center justify-between mb-4">
          <Badge 
            className={`${
              sector.rank === 1 
                ? 'bg-yellow-400 text-yellow-900 border-yellow-500' 
                : sector.rank === 2 
                  ? 'bg-gray-300 text-gray-900 border-gray-400' 
                  : sector.rank === 3 
                    ? 'bg-amber-400 text-amber-900 border-amber-500' 
                    : 'bg-white/30 text-white border-white/50'
            } border-2 font-bold px-3 py-1 rounded-full backdrop-blur-sm`}
          >
            #{sector.rank}
          </Badge>
          
          {sector.marketGrowth && (
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm">
              +{sector.marketGrowth}% growth
            </Badge>
          )}
        </div>

        {/* View Details Button */}
        <Button
          onClick={() => setShowDetails(true)}
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>

        {/* Sector Name */}
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors">
          {sector.name}
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/15 backdrop-blur-sm p-3 rounded-lg border border-white/20">
            <div className="flex items-center text-white/70 mb-1">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Companies</span>
            </div>
            <p className="text-lg font-bold text-white">{sector.companies}</p>
          </div>
          
          <div className="bg-white/15 backdrop-blur-sm p-3 rounded-lg border border-white/20">
            <div className="flex items-center text-white/70 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Funding</span>
            </div>
            <p className="text-lg font-bold text-white">${formatCurrency(sector.totalFunding)}</p>
          </div>
          
          <div className="bg-white/15 backdrop-blur-sm p-3 rounded-lg border border-white/20">
            <div className="flex items-center text-white/70 mb-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Momentum</span>
            </div>
            <p className="text-lg font-bold text-white">{sector.momentumScore}</p>
          </div>
          
          <div className="bg-white/15 backdrop-blur-sm p-3 rounded-lg border border-white/20">
            <div className="flex items-center text-white/70 mb-1">
              <Globe className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Growth</span>
            </div>
            <p className="text-lg font-bold text-white">
              +{sector.momentumGrowth}%
            </p>
          </div>
        </div>

        {/* BrightData Intelligence Section */}
        {(sector.investmentTrends || sector.keyPlayers || sector.emergingTechnologies) && (
          <div className="border-t border-white/20 pt-4 mt-4">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center">
              <Globe className="h-4 w-4 text-white mr-2" />
              Sector Intelligence
            </h4>
            
            {sector.investmentTrends && sector.investmentTrends.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-white/70 mb-1 font-medium">Investment Trends</div>
                <div className="flex flex-wrap gap-1">
                  {sector.investmentTrends.slice(0, 2).map((trend, index) => (
                    <Badge key={index} variant="default" className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {trend}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {sector.keyPlayers && sector.keyPlayers.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-white/70 mb-1 font-medium">Key Players & Leadership</div>
                <div className="text-xs text-white bg-white/10 backdrop-blur-sm p-2 rounded border border-white/20 space-y-1">
                  {sector.keyPlayers.slice(0, 3).map((player, index) => {
                    // Extract just company name for card display
                    const companyName = player.match(/^(.+?)\s*\(/)?.[1] || player
                    return (
                      <div key={index} className="truncate">• {companyName}</div>
                    )
                  })}
                  {sector.keyPlayers.length > 3 && (
                    <div className="text-white/60 italic">+{sector.keyPlayers.length - 3} more companies</div>
                  )}
                </div>
              </div>
            )}
            
            {sector.emergingTechnologies && sector.emergingTechnologies.length > 0 && (
              <div>
                <div className="text-xs text-white/70 mb-1 font-medium">Emerging Tech</div>
                <div className="flex flex-wrap gap-1">
                  {sector.emergingTechnologies.slice(0, 2).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-white/10 text-white border-white/30 backdrop-blur-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Details Dialog */}
      <SectorDetailsDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        sector={sector}
        dataSource={dataSource}
      />
    </Card>
  )
}