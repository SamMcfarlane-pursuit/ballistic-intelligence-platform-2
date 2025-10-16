'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Building2,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  MapPin,
  Globe,
  Search,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  Bell,
  BarChart3,
  FileText
} from 'lucide-react'

interface CrunchbaseOrganization {
  uuid: string
  name: string
  website?: string
  description?: string
  short_description?: string
  location_identifiers: Array<{
    uuid: string
    location_type: string
    name: string
    short_name?: string
  }>
  categories: Array<{
    uuid: string
    name: string
  }>
  founded_on?: string
  employee_count?: {
    value: number
  }
  total_funding_usd?: number
  last_updated_at: string
}

interface FundingRound {
  uuid: string
  announced_on: string
  money_raised_usd?: number
  type: string
  series: string
  lead_investors: Array<{
    name: string
  }>
}

interface FundingAlert {
  uuid: string
  organization_uuid: string
  announced_on: string
  money_raised_usd?: number
  type: string
  series: string
  lead_investors: Array<{
    name: string
  }>
}

export function CrunchbaseIntegration() {
  const [searchQuery, setSearchQuery] = useState('')
  const [organizations, setOrganizations] = useState<CrunchbaseOrganization[]>([])
  const [fundingAlerts, setFundingAlerts] = useState<FundingAlert[]>([])
  const [selectedOrg, setSelectedOrg] = useState<CrunchbaseOrganization | null>(null)
  const [orgFundingRounds, setOrgFundingRounds] = useState<FundingRound[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOrgDialog, setShowOrgDialog] = useState(false)
  const [activeView, setActiveView] = useState<'search' | 'alerts' | 'analysis'>('search')

  useEffect(() => {
    loadFundingAlerts()
  }, [])

  const loadFundingAlerts = async () => {
    try {
      const response = await fetch('/api/crunchbase?action=real-time-alerts')
      const data = await response.json()
      
      if (data.success) {
        setFundingAlerts(data.data.alerts || [])
      }
    } catch (err) {
      console.error('Error loading funding alerts:', err)
    }
  }

  const searchOrganizations = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `/api/crunchbase?action=search&query=${encodeURIComponent(searchQuery)}&limit=20`
      )
      const data = await response.json()
      
      if (data.success) {
        setOrganizations(data.data.organizations || [])
      } else {
        setError(data.error || 'Failed to search organizations')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const loadOrganizationDetails = async (uuid: string) => {
    setLoading(true)
    
    try {
      const [orgResponse, fundingResponse] = await Promise.all([
        fetch(`/api/crunchbase?action=organization&uuid=${uuid}`),
        fetch(`/api/crunchbase?action=funding-rounds&uuid=${uuid}`)
      ])
      
      const [orgData, fundingData] = await Promise.all([
        orgResponse.json(),
        fundingResponse.json()
      ])
      
      if (orgData.success && fundingData.success) {
        setSelectedOrg(orgData.data)
        setOrgFundingRounds(fundingData.data.rounds || [])
        setShowOrgDialog(true)
      }
    } catch (err) {
      console.error('Error loading organization details:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header with View Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setActiveView('search')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeView === 'search'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <Search className="h-4 w-4 mr-2" />
            Company Search
          </Button>
          <Button
            onClick={() => setActiveView('alerts')}
            className={`px-4 py-2 rounded-lg font-medium transition-all relative ${
              activeView === 'alerts'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <Bell className="h-4 w-4 mr-2" />
            Funding Alerts
            {fundingAlerts.length > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 py-0.5 text-xs">
                {fundingAlerts.length}
              </Badge>
            )}
          </Button>
          <Button
            onClick={() => setActiveView('analysis')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeView === 'analysis'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Market Analysis
          </Button>
        </div>

        <Button
          onClick={loadFundingAlerts}
          className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Company Search View */}
      {activeView === 'search' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search cybersecurity companies (e.g., 'AI security', 'cloud security')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchOrganizations()}
                    className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  onClick={searchOrganizations}
                  disabled={loading || !searchQuery}
                  className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg disabled:bg-gray-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {organizations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card
                  key={org.uuid}
                  className="bg-white border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => loadOrganizationDetails(org.uuid)}
                >
                  <CardContent className="p-6">
                    {/* Organization Header */}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{org.name}</h3>
                        {org.categories && org.categories[0] && (
                          <Badge className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 text-xs">
                            {org.categories[0].name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {org.short_description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {org.short_description}
                      </p>
                    )}

                    {/* Details */}
                    <div className="space-y-2">
                      {org.location_identifiers && org.location_identifiers[0] && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{org.location_identifiers[0].name}</span>
                        </div>
                      )}
                      {org.founded_on && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Founded: {formatDate(org.founded_on)}</span>
                        </div>
                      )}
                      {org.employee_count && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{org.employee_count.value} employees</span>
                        </div>
                      )}
                      {org.total_funding_usd && org.total_funding_usd > 0 && (
                        <div className="flex items-center text-sm font-semibold text-green-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>{formatCurrency(org.total_funding_usd)} raised</span>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <Button className="w-full mt-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && organizations.length === 0 && searchQuery && (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No companies found for "{searchQuery}"</p>
                <p className="text-sm text-gray-500 mt-2">
                  Try searching with different keywords like "AI security" or "cloud protection"
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Funding Alerts View */}
      {activeView === 'alerts' && (
        <div className="space-y-4">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Real-Time Funding Alerts (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fundingAlerts.length > 0 ? (
                <div className="space-y-3">
                  {fundingAlerts.map((alert) => (
                    <div
                      key={alert.uuid}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-green-600 text-white hover:bg-green-700">
                              {alert.series} - {alert.type}
                            </Badge>
                            <span className="text-sm text-gray-600">{formatDate(alert.announced_on)}</span>
                          </div>
                          {alert.money_raised_usd && (
                            <p className="text-2xl font-bold text-green-600 mb-2">
                              {formatCurrency(alert.money_raised_usd)}
                            </p>
                          )}
                          {alert.lead_investors && alert.lead_investors.length > 0 && (
                            <p className="text-sm text-gray-600">
                              Led by: {alert.lead_investors.map(inv => inv.name).join(', ')}
                            </p>
                          )}
                        </div>
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent funding alerts</p>
                  <p className="text-sm text-gray-500 mt-2">
                    New funding rounds will appear here automatically
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Market Analysis View */}
      {activeView === 'analysis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Top Funded Sectors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Cloud Security</span>
                  <span className="text-green-600 font-bold">$3.2B</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold">AI Security</span>
                  <span className="text-green-600 font-bold">$2.8B</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Zero Trust</span>
                  <span className="text-green-600 font-bold">$1.8B</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Top Investors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Andreessen Horowitz</span>
                  <span className="text-blue-600 font-bold">45 deals</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Sequoia Capital</span>
                  <span className="text-blue-600 font-bold">38 deals</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Accel</span>
                  <span className="text-blue-600 font-bold">32 deals</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Organization Details Dialog */}
      {showOrgDialog && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedOrg.name}</CardTitle>
                    {selectedOrg.categories && selectedOrg.categories[0] && (
                      <Badge className="mt-1 bg-blue-100 text-blue-700">
                        {selectedOrg.categories[0].name}
                      </Badge>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowOrgDialog(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              {selectedOrg.description && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600">{selectedOrg.description}</p>
                </div>
              )}

              {/* Company Details */}
              <div className="grid grid-cols-2 gap-4">
                {selectedOrg.location_identifiers && selectedOrg.location_identifiers[0] && (
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{selectedOrg.location_identifiers[0].name}</p>
                  </div>
                )}
                {selectedOrg.founded_on && (
                  <div>
                    <p className="text-sm text-gray-500">Founded</p>
                    <p className="font-semibold">{formatDate(selectedOrg.founded_on)}</p>
                  </div>
                )}
                {selectedOrg.employee_count && (
                  <div>
                    <p className="text-sm text-gray-500">Employees</p>
                    <p className="font-semibold">{selectedOrg.employee_count.value}</p>
                  </div>
                )}
                {selectedOrg.total_funding_usd && (
                  <div>
                    <p className="text-sm text-gray-500">Total Funding</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(selectedOrg.total_funding_usd)}
                    </p>
                  </div>
                )}
              </div>

              {/* Funding Rounds */}
              {orgFundingRounds.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Funding History</h3>
                  <div className="space-y-3">
                    {orgFundingRounds.map((round) => (
                      <div
                        key={round.uuid}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-blue-600 text-white">
                            {round.series} - {round.type}
                          </Badge>
                          <span className="text-sm text-gray-600">{formatDate(round.announced_on)}</span>
                        </div>
                        {round.money_raised_usd && (
                          <p className="text-xl font-bold text-green-600 mb-2">
                            {formatCurrency(round.money_raised_usd)}
                          </p>
                        )}
                        {round.lead_investors && round.lead_investors.length > 0 && (
                          <p className="text-sm text-gray-600">
                            Led by: {round.lead_investors.map(inv => inv.name).join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Website Link */}
              {selectedOrg.website && (
                <div>
                  <a
                    href={selectedOrg.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
