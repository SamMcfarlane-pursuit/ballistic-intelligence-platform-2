'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Calendar, 
  Building2, 
  TrendingUp,
  Globe,
  AlertCircle
} from 'lucide-react'

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
}

export default function PatentIntelligenceCard({ patent }: PatentIntelligenceCardProps) {
  return (
    <Card className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
      <CardContent className="p-6">
        {/* Patent Header */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {patent.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          {patent.description}
        </p>

        {/* Patent Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Company:</span>
            <div className="flex items-center text-blue-600">
              <Building2 className="h-3 w-3 mr-1" />
              <span className="font-semibold">{patent.company}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Filing Date:</span>
            <div className="flex items-center text-gray-900">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{patent.filingDate}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Sector:</span>
            <span className="font-semibold text-gray-900">{patent.sector}</span>
          </div>
        </div>

        {/* Novelty Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Novelty Score:</span>
            <div className="flex items-center">
              <span className="text-sm font-bold text-gray-900 mr-1">{patent.noveltyScore}/100</span>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${patent.noveltyScore}%` }}
            />
          </div>
        </div>

        {/* Innovation Potential Badge */}
        <div className="w-full mb-4">
          <div className={`px-4 py-2 rounded-lg text-center text-sm font-semibold ${
            patent.innovationPotential === 'High Innovation Potential'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : patent.innovationPotential === 'Medium Innovation Potential'
              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              : 'bg-gray-50 text-gray-700 border border-gray-200'
          }`}>
            {patent.innovationPotential}
          </div>
        </div>

        {/* BrightData Intelligence Section */}
        {(patent.marketImpact || patent.competitiveLandscape || patent.technologyTrends) && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Globe className="h-4 w-4 text-blue-600 mr-2" />
              BrightData Intelligence
            </h4>
            
            {patent.marketImpact && (
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Market Impact</span>
                  <Badge variant="secondary" className="text-xs">
                    {patent.marketImpact}/100
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${patent.marketImpact}%` }}
                  />
                </div>
              </div>
            )}
            
            {patent.competitiveLandscape && patent.competitiveLandscape.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Competitive Landscape</div>
                <div className="flex flex-wrap gap-1">
                  {patent.competitiveLandscape.slice(0, 3).map((competitor, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {competitor}
                    </Badge>
                  ))}
                  {patent.competitiveLandscape.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{patent.competitiveLandscape.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {patent.technologyTrends && patent.technologyTrends.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Technology Trends</div>
                <div className="flex flex-wrap gap-1">
                  {patent.technologyTrends.slice(0, 2).map((trend, index) => (
                    <Badge key={index} variant="default" className="text-xs bg-blue-100 text-blue-800">
                      {trend}
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