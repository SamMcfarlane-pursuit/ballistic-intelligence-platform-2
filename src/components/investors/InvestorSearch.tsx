'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Plus,
  X,
  ChevronDown,
  Heart,
  Settings,
  Download,
  ExternalLink
} from 'lucide-react'

interface Investor {
  id: string
  name: string
  type: 'Corporate VC' | 'VC firm' | 'Family office' | 'Angel' | 'PE firm'
  geography: {
    primary: string
    flag: string
    additional?: string[]
  }
  checkSize: {
    min: string
    max: string
    typical: string
  }
  stages: string[]
  investmentThesis: {
    sectors: string[]
    description: string
    focus: string[]
  }
  openRate: number
  logo?: string
  verified: boolean
  premium: boolean
}

interface FilterState {
  solicitation: string[]
  outreach: string[]
  investorType: string[]
  investorHQ: string[]
  verifiedStatus: string[]
  checkSize: string[]
  lead: string[]
}

export function InvestorSearch() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [filteredInvestors, setFilteredInvestors] = useState<Investor[]>([])
  const [searchQuery, setSearchQuery] = useState('cybersecurity')
  const [loading, setLoading] = useState(true)
  const [selectedInvestors, setSelectedInvestors] = useState<Set<string>>(new Set())
  
  const [filters, setFilters] = useState<FilterState>({
    solicitation: [],
    outreach: [],
    investorType: [],
    investorHQ: [],
    verifiedStatus: [],
    checkSize: [],
    lead: []
  })

  useEffect(() => {
    fetchInvestors()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [investors, searchQuery, filters])

  const fetchInvestors = async () => {
    try {
      // Mock investor data matching the Figma design
      const mockInvestors: Investor[] = [
        {
          id: '1',
          name: 'Bitdefender Voyager Ventures',
          type: 'Corporate VC',
          geography: {
            primary: 'Austria',
            flag: '🇦🇹',
            additional: ['Belgium']
          },
          checkSize: {
            min: '$200k',
            max: '$1M',
            typical: '$500k'
          },
          stages: ['Prototype', 'Early Revenue'],
          investmentThesis: {
            sectors: ['Cybersecurity', 'Data Analytics', 'Automation', 'Digital Infrastructure', 'Quantum Tech'],
            description: 'We invest in cybersecurity, data analytics, automation, digital infrastructure, and quantum tech startups.',
            focus: ['Pre-Seed', 'Seed', 'Series A']
          },
          openRate: 100,
          verified: true,
          premium: true
        },
        {
          id: '2',
          name: 'Primo Ventures',
          type: 'VC firm',
          geography: {
            primary: 'USA',
            flag: '🇺🇸',
            additional: ['France']
          },
          checkSize: {
            min: '$500k',
            max: '$2M',
            typical: '$1M'
          },
          stages: ['Prototype', 'Early Revenue'],
          investmentThesis: {
            sectors: ['B2B/Enterprise SaaS', 'Cybersecurity', 'Fintech', 'Digital Retail'],
            description: 'We invest in B2B/Enterprise SaaS, cybersecurity, fintech and digital retail startups.',
            focus: ['Primo Digital Fund']
          },
          openRate: 70,
          verified: true,
          premium: false
        },
        {
          id: '3',
          name: 'G121 Capital',
          type: 'Family office',
          geography: {
            primary: 'Czech Republic',
            flag: '🇨🇿',
            additional: ['USA']
          },
          checkSize: {
            min: '$100k',
            max: '$2M',
            typical: '$500k'
          },
          stages: ['Early Revenue', 'Scaling'],
          investmentThesis: {
            sectors: ['AI', 'SaaS', 'Infrastructure', 'Deep tech', 'Web3', 'Cloud computing', 'B2B software', 'DevOps', 'Data platforms'],
            description: 'We invest in startups building critical space and defence technology.',
            focus: ['AI', 'SaaS', 'Infrastructure']
          },
          openRate: 60,
          verified: false,
          premium: false
        },
        {
          id: '4',
          name: 'Final Frontier (Space & Defence)',
          type: 'VC firm',
          geography: {
            primary: 'Albania',
            flag: '🇦🇱'
          },
          checkSize: {
            min: '$100k',
            max: '$1M',
            typical: '$300k'
          },
          stages: ['Idea or Patent', 'Prototype'],
          investmentThesis: {
            sectors: ['Space Technology', 'Defence', 'Critical Infrastructure'],
            description: 'We invest in startups building critical space and defence technology.',
            focus: ['Space', 'Defence', 'Critical Infrastructure']
          },
          openRate: 50,
          verified: false,
          premium: false
        }
      ]

      setInvestors(mockInvestors)
    } catch (error) {
      console.error('Failed to fetch investors:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = investors

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(investor =>
        investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investor.investmentThesis.sectors.some(sector => 
          sector.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        investor.investmentThesis.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply filters
    if (filters.investorType.length > 0) {
      filtered = filtered.filter(investor => filters.investorType.includes(investor.type))
    }

    if (filters.verifiedStatus.length > 0) {
      const includeVerified = filters.verifiedStatus.includes('verified')
      const includeUnverified = filters.verifiedStatus.includes('unverified')
      filtered = filtered.filter(investor => 
        (includeVerified && investor.verified) || (includeUnverified && !investor.verified)
      )
    }

    setFilteredInvestors(filtered)
  }

  const getOpenRateColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-500'
    if (rate >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Investors...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Search Investors</h1>
            <p className="text-sm text-gray-500">Find the perfect investors for your cybersecurity startup</p>
          </div>
          <Badge className="bg-pink-100 text-pink-800 border-pink-200">
            <Heart className="w-3 h-3 mr-1" />
            PREMIUM FILTERS
          </Badge>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="cybersecurity"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Top Level Filters */}
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Geography</option>
              <option>USA</option>
              <option>Europe</option>
              <option>Asia</option>
            </select>
            
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Stage</option>
              <option>Pre-seed</option>
              <option>Seed</option>
              <option>Series A</option>
              <option>Series B+</option>
            </select>
            
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Round size</option>
              <option>$100k-$500k</option>
              <option>$500k-$2M</option>
              <option>$2M-$10M</option>
              <option>$10M+</option>
            </select>
            
            <Button variant="outline" className="px-3 py-2">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6">
            Search
          </Button>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Solicitation</label>
            <select 
              className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                const value = e.target.value;
                setFilters(prev => ({
                  ...prev,
                  solicitation: value === 'All' ? [] : [value]
                }));
              }}
            >
              <option>All</option>
              <option>Cold outreach</option>
              <option>Warm intro</option>
              <option>Referral</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Outreach</label>
            <select 
              className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                const value = e.target.value;
                setFilters(prev => ({
                  ...prev,
                  outreach: value === 'All' ? [] : [value]
                }));
              }}
            >
              <option>All</option>
              <option>Email</option>
              <option>LinkedIn</option>
              <option>Twitter</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Investor type</label>
            <select 
              className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                const value = e.target.value;
                setFilters(prev => ({
                  ...prev,
                  investorType: value === 'All' ? [] : [value]
                }));
              }}
            >
              <option>All</option>
              <option>VC firm</option>
              <option>Corporate VC</option>
              <option>Family office</option>
              <option>Angel</option>
              <option>PE firm</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Investor HQ</label>
            <select 
              className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                const value = e.target.value;
                setFilters(prev => ({
                  ...prev,
                  investorHQ: value === 'All' ? [] : [value]
                }));
              }}
            >
              <option>All</option>
              <option>USA</option>
              <option>Europe</option>
              <option>Asia</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Verified status</label>
            <select 
              className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                const value = e.target.value;
                setFilters(prev => ({
                  ...prev,
                  verifiedStatus: value === 'All' ? [] : [value]
                }));
              }}
            >
              <option>All</option>
              <option>Verified</option>
              <option>Unverified</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Check size</label>
            <select 
              className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                const value = e.target.value;
                setFilters(prev => ({
                  ...prev,
                  checkSize: value === 'All' ? [] : [value]
                }));
              }}
            >
              <option>All</option>
              <option>$100k-$500k</option>
              <option>$500k-$2M</option>
              <option>$2M+</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Lead</label>
            <select 
              className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                const value = e.target.value;
                setFilters(prev => ({
                  ...prev,
                  lead: value === 'All' ? [] : [value]
                }));
              }}
            >
              <option>All</option>
              <option>Can lead</option>
              <option>Follow only</option>
            </select>
          </div>
        </div>

        {/* Results Count and Column Headers */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">
              <strong>{filteredInvestors.length}</strong> investors
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
              </Button>
            </div>
          </div>
          
          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-4 px-6 py-2 bg-gray-50 rounded-t-lg border-b border-gray-200 text-xs font-medium text-gray-700">
            <div className="col-span-3"></div>
            <div className="col-span-2">Geography</div>
            <div className="col-span-1">Checks</div>
            <div className="col-span-2">Stages</div>
            <div className="col-span-3">Investment thesis</div>
            <div className="col-span-1 text-center">Open rate</div>
          </div>
        </div>
      </div>

      {/* Investor Results Table */}
      <div className="bg-white rounded-b-lg border border-t-0 border-gray-200">
        {filteredInvestors.map((investor, index) => (
          <div 
            key={investor.id} 
            className={`grid grid-cols-12 gap-4 items-center p-6 hover:bg-gray-50 transition-colors ${
              index !== filteredInvestors.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            {/* Investor Info */}
            <div className="col-span-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {investor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{investor.name}</h3>
                    {investor.verified && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{investor.type}</p>
                </div>
              </div>
            </div>

            {/* Geography */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{investor.geography.flag}</span>
                <span className="text-sm font-medium text-gray-900">{investor.geography.primary}</span>
              </div>
              {investor.geography.additional && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">
                    🇫🇷 France +{investor.geography.additional.length}
                  </span>
                </div>
              )}
            </div>

            {/* Check Size */}
            <div className="col-span-1">
              <div className="text-sm font-medium text-gray-900">{investor.checkSize.min} to</div>
              <div className="text-sm font-medium text-gray-900">{investor.checkSize.max}</div>
            </div>

            {/* Stages */}
            <div className="col-span-2">
              <div className="space-y-1">
                {investor.stages.map((stage, stageIndex) => (
                  <div key={stageIndex} className="flex items-center gap-1">
                    <span className="text-sm text-gray-700">{stageIndex + 2}.</span>
                    <span className="text-sm text-gray-900">{stage}</span>
                    {stageIndex < investor.stages.length - 1 && (
                      <span className="text-xs text-gray-400">+{stageIndex + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Thesis */}
            <div className="col-span-3">
              <div className="space-y-2">
                <div className="text-xs text-gray-600">We invest in:</div>
                <div className="text-sm text-gray-900 font-medium">
                  {investor.investmentThesis.sectors.slice(0, 3).join(', ')}
                  {investor.investmentThesis.sectors.length > 3 && '...'}
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {investor.investmentThesis.description}
                </p>
              </div>
            </div>

            {/* Open Rate & Actions */}
            <div className="col-span-1">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center">
                  <div className={`w-4 h-4 rounded-full ${getOpenRateColor(investor.openRate)} mr-2`}></div>
                  <span className="text-sm font-bold text-gray-900">{investor.openRate}%</span>
                </div>
                
                <div className="flex flex-col gap-2 w-full">
                  <Button 
                    size="sm" 
                    className="bg-pink-600 hover:bg-pink-700 text-white text-xs h-8 w-full"
                  >
                    Submit deck
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="text-xs h-6 px-2 flex-1">
                      <Plus className="h-3 w-3 mr-1" />
                      Add to CRM
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-6 px-2 flex-1">
                      <X className="h-3 w-3 mr-1" />
                      Skip
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedInvestors.size > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedInvestors.size} investors selected
            </span>
            <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
              Bulk Submit
            </Button>
            <Button size="sm" variant="outline">
              Add to CRM
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setSelectedInvestors(new Set())}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}