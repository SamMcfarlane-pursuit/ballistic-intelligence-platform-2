'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Code,
  Database,
  Server,
  Globe,
  Cpu,
  Smartphone,
  BarChart3,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react'

interface TechnologyTrend {
  id: string
  name: string
  category: string
  adoptionCount: number
  growthRate: number
  avgFunding: number
  trendDirection: 'up' | 'down' | 'stable'
  maturityLevel: 'emerging' | 'growing' | 'stable' | 'mature' | 'declining'
  popularityScore: number
  successRate: number
  topCompanies: string[]
  relatedTechnologies: string[]
}

interface TechnologyTrendsCardProps {
  trend: TechnologyTrend
  rank: number
  onViewDetails?: (trend: TechnologyTrend) => void
}

export default function TechnologyTrendsCard({ trend, rank, onViewDetails }: TechnologyTrendsCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
      case 'web':
        return <Globe className="h-5 w-5" />
      case 'backend':
      case 'server':
        return <Server className="h-5 w-5" />
      case 'database':
        return <Database className="h-5 w-5" />
      case 'ai/ml':
      case 'artificial intelligence':
        return <Cpu className="h-5 w-5" />
      case 'mobile':
        return <Smartphone className="h-5 w-5" />
      default:
        return <Code className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
      case 'web':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'backend':
      case 'server':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'database':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'ai/ml':
      case 'artificial intelligence':
        return 'bg-pink-50 text-pink-700 border-pink-200'
      case 'mobile':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'devops':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getMaturityColor = (level: string) => {
    switch (level) {
      case 'emerging':
        return 'bg-yellow-100 text-yellow-800'
      case 'growing':
        return 'bg-green-100 text-green-800'
      case 'stable':
        return 'bg-blue-100 text-blue-800'
      case 'mature':
        return 'bg-gray-100 text-gray-800'
      case 'declining':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = () => {
    if (trend.trendDirection === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend.trendDirection === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`
    return `$${amount}`
  }

  return (
    <Card className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group">
      <CardContent className="p-6">
        {/* Header with Rank */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              #{rank}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {trend.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={`text-xs ${getCategoryColor(trend.category)}`}>
                  {getCategoryIcon(trend.category)}
                  <span className="ml-1">{trend.category}</span>
                </Badge>
                <Badge variant="secondary" className={`text-xs ${getMaturityColor(trend.maturityLevel)}`}>
                  {trend.maturityLevel}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-semibold ${
              trend.trendDirection === 'up' ? 'text-green-600' : 
              trend.trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend.growthRate > 0 ? '+' : ''}{trend.growthRate}%
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-gray-600 mr-1" />
            </div>
            <div className="text-xs text-gray-500">Adoption</div>
            <div className="font-bold text-sm text-gray-900">{trend.adoptionCount}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-gray-600 mr-1" />
            </div>
            <div className="text-xs text-gray-500">Avg Funding</div>
            <div className="font-bold text-sm text-gray-900">{formatCurrency(trend.avgFunding)}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center mb-1">
              <BarChart3 className="h-4 w-4 text-gray-600 mr-1" />
            </div>
            <div className="text-xs text-gray-500">Success Rate</div>
            <div className="font-bold text-sm text-gray-900">{trend.successRate}%</div>
          </div>
        </div>

        {/* Popularity Score Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Popularity Score</span>
            <span className="text-xs font-bold text-gray-900">{trend.popularityScore}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${trend.popularityScore}%` }}
            />
          </div>
        </div>

        {/* Top Companies */}
        {trend.topCompanies && trend.topCompanies.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">Top Companies Using</div>
            <div className="flex flex-wrap gap-1">
              {trend.topCompanies.slice(0, 3).map((company, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {company}
                </Badge>
              ))}
              {trend.topCompanies.length > 3 && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  +{trend.topCompanies.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Related Technologies */}
        {trend.relatedTechnologies && trend.relatedTechnologies.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">Related Technologies</div>
            <div className="text-xs text-gray-600">
              {trend.relatedTechnologies.slice(0, 3).join(', ')}
              {trend.relatedTechnologies.length > 3 && ` +${trend.relatedTechnologies.length - 3} more`}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <Button
          onClick={() => onViewDetails?.(trend)}
          className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 rounded-lg transition-all group-hover:border-blue-600 group-hover:text-blue-600"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          View Trend Analysis
        </Button>
      </CardContent>
    </Card>
  )
}