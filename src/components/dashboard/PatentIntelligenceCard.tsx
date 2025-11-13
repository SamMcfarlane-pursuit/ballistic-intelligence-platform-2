'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Calendar, 
  Building2, 
  TrendingUp,
  Globe,
  AlertCircle,
  Eye
} from 'lucide-react'
import PatentDetailsDialog from './PatentDetailsDialog'

interface PatentIntelligenceCardProps {
  patent: {
    id: string
    title: string
    description: string
    company: string
    companyId: string
    filingDate: string
    sector: string
    noveltyScore: number
    innovationPotential: 'High Innovation Potential' | 'Medium Innovation Potential' | 'Low Innovation Potential'
    patentNumber?: string
    status?: 'Filed' | 'Granted' | 'Pending'
    claims?: number
    citations?: number
    // BrightData enhanced fields
    marketImpact?: number
    competitiveLandscape?: string[]
    technologyTrends?: string[]
  }
  dataSource?: 'brightdata' | 'crunchbase' | 'combined'
}

export default function PatentIntelligenceCard({ patent, dataSource = 'combined' }: PatentIntelligenceCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
    <div className="relative">
    <Card className="bg-gradient-to-br from-orange-600 via-orange-700 to-red-700 border-2 border-orange-600 hover:border-red-700 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
      
      <CardContent className="p-6 relative z-10">
        {/* Patent Header */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-white/30">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
              {patent.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/90 mb-4 line-clamp-2">
          {patent.description}
        </p>

        {/* Patent Details */}
        <div className="space-y-2 mb-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Company:</span>
            <div className="flex items-center text-white font-medium">
              <Building2 className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[150px]">{patent.company}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Filing Date:</span>
            <div className="flex items-center text-white font-medium">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{patent.filingDate}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Sector:</span>
            <span className="font-semibold text-white">{patent.sector}</span>
          </div>
        </div>

        {/* Novelty Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70 font-medium">Novelty Score:</span>
            <div className="flex items-center">
              <span className="text-sm font-bold text-white mr-1">{patent.noveltyScore}/100</span>
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5 backdrop-blur-sm">
            <div
              className="bg-white h-2.5 rounded-full transition-all shadow-lg"
              style={{ width: `${patent.noveltyScore}%` }}
            />
          </div>
        </div>

        {/* Innovation Potential Badge */}
        <div className="w-full mb-4">
          <div className={`px-4 py-2.5 rounded-lg text-center text-sm font-bold backdrop-blur-sm border-2 ${
            patent.innovationPotential === 'High Innovation Potential'
              ? 'bg-green-500/90 text-white border-green-400'
              : patent.innovationPotential === 'Medium Innovation Potential'
              ? 'bg-yellow-500/90 text-white border-yellow-400'
              : 'bg-white/20 text-white border-white/30'
          }`}>
            {patent.innovationPotential}
          </div>
        </div>

        {/* BrightData Intelligence Section */}
        {(patent.marketImpact || patent.competitiveLandscape || patent.technologyTrends) && (
          <div className="border-t border-white/20 pt-4 mt-4">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center">
              <Globe className="h-4 w-4 text-white mr-2" />
              Intelligence Insights
            </h4>
            
            {patent.marketImpact && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/70 font-medium">Market Impact</span>
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {patent.marketImpact}/100
                  </Badge>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                  <div
                    className="bg-green-400 h-2 rounded-full shadow-lg"
                    style={{ width: `${patent.marketImpact}%` }}
                  />
                </div>
              </div>
            )}
            
            {patent.competitiveLandscape && patent.competitiveLandscape.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-white/70 mb-1 font-medium">Competitive Landscape</div>
                <div className="flex flex-wrap gap-1">
                  {patent.competitiveLandscape.slice(0, 3).map((competitor, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-white/10 text-white border-white/30 backdrop-blur-sm">
                      {competitor}
                    </Badge>
                  ))}
                  {patent.competitiveLandscape.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/30 backdrop-blur-sm">
                      +{patent.competitiveLandscape.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {patent.technologyTrends && patent.technologyTrends.length > 0 && (
              <div>
                <div className="text-xs text-white/70 mb-1 font-medium">Technology Trends</div>
                <div className="flex flex-wrap gap-1">
                  {patent.technologyTrends.slice(0, 2).map((trend, index) => (
                    <Badge key={index} variant="default" className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {trend}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Details Button */}
        <Button
          onClick={() => setShowDetails(true)}
          variant="secondary"
          size="sm"
          className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Full Details
        </Button>
      </CardContent>
    </Card>
    </div>

    {/* Details Dialog */}
    <PatentDetailsDialog
      open={showDetails}
      onOpenChange={setShowDetails}
      patent={patent}
      dataSource={dataSource}
    />
    </>
  )
}