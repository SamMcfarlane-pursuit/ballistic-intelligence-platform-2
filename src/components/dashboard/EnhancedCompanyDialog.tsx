'use client'

import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Building2, Globe, TrendingUp, X, Loader2 } from 'lucide-react'

interface EnhancedCompanyDialogProps {
  company: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EnhancedCompanyDialog({ company, open, onOpenChange }: EnhancedCompanyDialogProps) {
  const [intelligence, setIntelligence] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && company) {
      loadEnhancedIntelligence()
    } else {
      setIntelligence(null)
    }
  }, [open, company])

  const loadEnhancedIntelligence = async () => {
    if (!company) return
    
    setLoading(true)
    try {
      // Simulate API call to BrightData enhanced intelligence
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock data for demonstration
      setIntelligence({
        webIntelligence: {
          webPresence: {
            onlineMentions: {
              total: Math.floor(Math.random() * 2000) + 500,
              positive: Math.floor(Math.random() * 1500) + 300
            }
          },
          technologyStack: {
            frontend: ['React', 'TypeScript', 'Tailwind CSS'],
            backend: ['Node.js', 'Python', 'Go']
          }
        },
        marketIntelligence: {
          competitiveLandscape: [
            { name: 'Competitor A' },
            { name: 'Competitor B' },
            { name: 'Competitor C' }
          ],
          industryTrends: [
            { trend: 'AI Security' },
            { trend: 'Cloud Native' }
          ]
        }
      })
    } catch (error) {
      console.error('Error loading enhanced intelligence:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {company?.name}
              </DialogTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            View detailed information about {company?.name}
          </p>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading enhanced intelligence...</span>
            </div>
          )}
          
          {!loading && intelligence && (
            <>
              {/* Web Intelligence Section */}
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <Globe className="h-5 w-5 text-blue-600 mr-2" />
                  Web Intelligence
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Online Mentions</div>
                    <div className="font-bold text-lg text-gray-900">
                      {intelligence.webIntelligence?.webPresence?.onlineMentions?.total || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {intelligence.webIntelligence?.webPresence?.onlineMentions?.positive || 0} positive
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Technology Stack</div>
                    <div className="text-sm text-gray-900 truncate">
                      {intelligence.webIntelligence?.technologyStack?.frontend?.slice(0, 2).join(', ') || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Market Intelligence Section */}
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  Market Intelligence
                </h3>
                
                {intelligence.marketIntelligence?.competitiveLandscape && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-1">Competitive Landscape</div>
                    <div className="flex flex-wrap gap-2">
                      {intelligence.marketIntelligence.competitiveLandscape.slice(0, 3).map((competitor: any, index: number) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {competitor.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {intelligence.marketIntelligence?.industryTrends && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Industry Trends</div>
                    <div className="flex flex-wrap gap-2">
                      {intelligence.marketIntelligence.industryTrends.slice(0, 2).map((trend: any, index: number) => (
                        <Badge key={index} variant="default" className="text-xs bg-green-100 text-green-800">
                          {trend.trend}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* About the Company */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">About the Company</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {company?.description}
            </p>
          </div>

          {/* BrightData Intelligence */}
          {company?.brightData && (
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <Globe className="h-5 w-5 text-blue-600 mr-2" />
                BrightData Intelligence
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Recent Mentions</div>
                  <div className="font-bold text-lg text-gray-900">
                    {company.brightData.recentMentions}
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Patents</div>
                  <div className="font-bold text-lg text-gray-900">
                    {company.brightData.patents}
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">News Sentiment</div>
                  <div className={`font-bold text-sm ${
                    company.brightData.newsSentiment === 'positive' 
                      ? 'text-green-600' 
                      : company.brightData.newsSentiment === 'negative' 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                  }`}>
                    {company.brightData.newsSentiment}
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Tech Stack</div>
                  <div className="text-sm text-gray-900 truncate">
                    {company.brightData.techStack?.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>
              
              {company.brightData.competitors && company.brightData.competitors.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">Competitors</div>
                  <div className="flex flex-wrap gap-2">
                    {company.brightData.competitors.map((competitor: string, index: number) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {competitor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Team & Contact */}
          {company?.team && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Team & Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Leadership Team</span>
                  <div className="text-right space-y-1">
                    <p className="text-gray-900">{company.team.ceo}</p>
                    <p className="text-gray-900">{company.team.cto}</p>
                    <p className="text-gray-900">{company.team.head}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}