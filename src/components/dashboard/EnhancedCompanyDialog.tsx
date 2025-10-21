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
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold text-gray-900 mb-1">
                {company?.name}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{company?.sector}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">{company?.location}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">Founded {company?.founded}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          {/* Company Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Company Overview</h3>
              <p className="text-gray-700 leading-relaxed">
                {company?.description}
              </p>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Total Funding</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${company?.totalFunding ? (company.totalFunding / 1000000).toFixed(1) : '0'}M
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Last Round</div>
                  <div className="text-lg font-semibold text-gray-900">{company?.lastRound}</div>
                  <div className="text-sm text-gray-600">
                    ${company?.lastRoundAmount ? (company.lastRoundAmount / 1000000).toFixed(1) : '0'}M
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Funding Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Funding Source</span>
                  <span className="font-medium text-gray-900">{company?.fundingFrom}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Latest Funding Date</span>
                  <span className="font-medium text-gray-900">{company?.latestDateOfFunding}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Website</span>
                  <span className="font-medium text-blue-600 truncate max-w-48">
                    {company?.website || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading enhanced intelligence...</span>
            </div>
          )}

          {/* Intelligence Insights */}
          {company?.brightData && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Globe className="h-6 w-6 text-blue-600 mr-3" />
                Intelligence Insights
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="text-sm text-blue-700 mb-2">Recent Mentions</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {company.brightData.recentMentions || 0}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="text-sm text-purple-700 mb-2">Patents Filed</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {company.brightData.patents || 0}
                  </div>
                </div>
                
                {company.brightData.newsSentiment === 'negative' && (
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                    <div className="text-sm text-red-700 mb-2">News Sentiment</div>
                    <div className="text-lg font-bold text-red-900 capitalize">
                      {company.brightData.newsSentiment}
                    </div>
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="text-sm text-green-700 mb-2">Market Position</div>
                  <div className="text-lg font-bold text-green-900">
                    {company.brightData.marketPosition || 'Emerging'}
                  </div>
                </div>
              </div>
              
              {/* Technology Stack */}
              {company.brightData.techStack && company.brightData.techStack.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Technology Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {company.brightData.techStack.map((tech: string, index: number) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Competitive Landscape */}
              {company.brightData.competitors && company.brightData.competitors.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Competitive Landscape</h4>
                  <div className="flex flex-wrap gap-2">
                    {company.brightData.competitors.map((competitor: string, index: number) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border"
                      >
                        {competitor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leadership Team */}
          {company?.team && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Leadership Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {company.team.ceo && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-sm text-gray-500 mb-1">Chief Executive Officer</div>
                    <div className="font-semibold text-gray-900">{company.team.ceo}</div>
                  </div>
                )}
                {company.team.cto && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-sm text-gray-500 mb-1">Chief Technology Officer</div>
                    <div className="font-semibold text-gray-900">{company.team.cto}</div>
                  </div>
                )}
                {company.team.head && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-sm text-gray-500 mb-1">Head of Product</div>
                    <div className="font-semibold text-gray-900">{company.team.head}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}