'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Calendar, 
  Building2, 
  TrendingUp,
  Globe,
  AlertCircle,
  Target,
  Users,
  Database,
  Loader2,
  ExternalLink
} from 'lucide-react'

interface PatentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
    marketImpact?: number
    competitiveLandscape?: string[]
    technologyTrends?: string[]
  }
  dataSource: 'brightdata' | 'crunchbase' | 'combined'
}

export default function PatentDetailsDialog({ 
  open, 
  onOpenChange, 
  patent,
  dataSource 
}: PatentDetailsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [companyData, setCompanyData] = useState<any>(null)

  useEffect(() => {
    if (open && patent) {
      fetchCompanyData()
    }
  }, [open, patent, dataSource])

  const fetchCompanyData = async () => {
    setLoading(true)
    try {
      // Fetch company data from Crunchbase
      const response = await fetch(`/api/crunchbase?action=search&query=${encodeURIComponent(patent.company)}&limit=1`)
      const data = await response.json()
      
      if (data.success && data.data.organizations.length > 0) {
        setCompanyData(data.data.organizations[0])
      }
    } catch (error) {
      console.error('Error fetching company data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    }
    return `$${amount}`
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Granted':
        return 'bg-green-500 text-white'
      case 'Pending':
        return 'bg-yellow-500 text-white'
      case 'Filed':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getInnovationColor = (potential: string) => {
    if (potential.includes('High')) return 'text-green-600 bg-green-50 border-green-200'
    if (potential.includes('Medium')) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-[#0066FF] mb-2">
                {patent.title}
              </DialogTitle>
              {patent.patentNumber && (
                <p className="text-sm text-gray-600">Patent #{patent.patentNumber}</p>
              )}
            </div>
            {patent.status && (
              <Badge className={getStatusColor(patent.status)}>
                {patent.status}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <Database className="h-3 w-3 mr-1" />
              {dataSource === 'combined' ? 'BrightData + Crunchbase' : 
               dataSource === 'brightdata' ? 'BrightData' : 'Crunchbase'}
            </Badge>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="competitive">Competitive</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Patent Description */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#0066FF]" />
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">{patent.description}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#0066FF] to-[#1A3766] p-4 rounded-lg text-white">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    <span className="text-sm opacity-90">Novelty</span>
                  </div>
                  <p className="text-2xl font-bold">{patent.noveltyScore}/100</p>
                </div>

                {patent.marketImpact && (
                  <div className="bg-gradient-to-br from-[#0066FF] to-[#1A3766] p-4 rounded-lg text-white">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 mr-2" />
                      <span className="text-sm opacity-90">Market Impact</span>
                    </div>
                    <p className="text-2xl font-bold">{patent.marketImpact}/100</p>
                  </div>
                )}

                {patent.claims && (
                  <div className="bg-gradient-to-br from-[#0066FF] to-[#1A3766] p-4 rounded-lg text-white">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 mr-2" />
                      <span className="text-sm opacity-90">Claims</span>
                    </div>
                    <p className="text-2xl font-bold">{patent.claims}</p>
                  </div>
                )}

                {patent.citations && (
                  <div className="bg-gradient-to-br from-[#0066FF] to-[#1A3766] p-4 rounded-lg text-white">
                    <div className="flex items-center mb-2">
                      <Globe className="h-5 w-5 mr-2" />
                      <span className="text-sm opacity-90">Citations</span>
                    </div>
                    <p className="text-2xl font-bold">{patent.citations}</p>
                  </div>
                )}
              </div>

              {/* Patent Details */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Patent Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Filing Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-[#0066FF]" />
                      <p className="font-medium text-gray-900">{patent.filingDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Sector</p>
                    <Badge variant="secondary">{patent.sector}</Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-2">Innovation Potential</p>
                    <div className={`p-3 rounded-lg border-2 ${getInnovationColor(patent.innovationPotential)}`}>
                      <p className="font-bold text-center">{patent.innovationPotential}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technology Trends */}
              {patent.technologyTrends && patent.technologyTrends.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-[#0066FF]" />
                    Technology Trends
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patent.technologyTrends.map((trend, index) => (
                      <Badge key={index} className="bg-[#0066FF] text-white">
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="company" className="space-y-4">
              {companyData ? (
                <>
                  <div className="bg-gradient-to-br from-[#0066FF] to-[#1A3766] p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{companyData.name}</h3>
                        <p className="text-white/80">{companyData.short_description}</p>
                      </div>
                      {companyData.website && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => window.open(companyData.website, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Founded</p>
                      <p className="text-xl font-bold text-gray-900">{companyData.founded_on}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Total Funding</p>
                      <p className="text-xl font-bold text-[#0066FF]">
                        {formatCurrency(companyData.total_funding_usd)}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Employees</p>
                      <p className="text-xl font-bold text-gray-900">
                        {companyData.employee_count?.value?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Location</p>
                      <p className="text-xl font-bold text-gray-900">
                        {companyData.location_identifiers?.[0]?.name || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {companyData.description && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                      <p className="text-gray-700 leading-relaxed">{companyData.description}</p>
                    </div>
                  )}

                  {companyData.categories && companyData.categories.length > 0 && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {companyData.categories.map((cat: any, index: number) => (
                          <Badge key={index} variant="secondary">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-[#0066FF]" />
                        {patent.company}
                      </h3>
                      <p className="text-gray-600">Company information not available</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              {/* Novelty Analysis */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-[#0066FF]" />
                  Novelty Analysis
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Novelty Score</span>
                      <span className="font-bold text-gray-900">{patent.noveltyScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#0066FF] to-[#1A3766] h-3 rounded-full transition-all"
                        style={{ width: `${patent.noveltyScore}%` }}
                      />
                    </div>
                  </div>

                  {patent.marketImpact && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Market Impact</span>
                        <span className="font-bold text-gray-900">{patent.marketImpact}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full transition-all"
                          style={{ width: `${patent.marketImpact}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Innovation Assessment */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Innovation Assessment</h3>
                <div className={`p-4 rounded-lg border-2 ${getInnovationColor(patent.innovationPotential)}`}>
                  <p className="font-bold text-lg text-center mb-2">{patent.innovationPotential}</p>
                  <p className="text-sm text-center">
                    {patent.innovationPotential.includes('High') && 
                      'This patent demonstrates significant innovation with strong market potential and novel technical approaches.'}
                    {patent.innovationPotential.includes('Medium') && 
                      'This patent shows moderate innovation with good market potential and incremental technical improvements.'}
                    {patent.innovationPotential.includes('Low') && 
                      'This patent represents incremental innovation with limited market differentiation.'}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="competitive" className="space-y-4">
              {patent.competitiveLandscape && patent.competitiveLandscape.length > 0 ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-[#0066FF]" />
                    Competitive Landscape
                  </h3>
                  <div className="space-y-3">
                    {patent.competitiveLandscape.map((competitor, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#0066FF] rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900">{competitor}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Compare
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No competitive data available</p>
                </div>
              )}

              {/* Market Position */}
              <div className="bg-gradient-to-br from-[#0066FF] to-[#1A3766] p-6 rounded-lg text-white">
                <h3 className="text-lg font-bold mb-4">Market Position</h3>
                <p className="text-white/90 leading-relaxed">
                  This patent is positioned in the {patent.sector} sector with a novelty score of {patent.noveltyScore}/100.
                  {patent.competitiveLandscape && patent.competitiveLandscape.length > 0 && 
                    ` It competes with ${patent.competitiveLandscape.length} other players in the market.`}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
