"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Map, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Target,
  Filter,
  Search,
  Calendar,
  Globe,
  Users,
  Star
} from 'lucide-react'

interface Company {
  id: string
  company_name: string
  website: string
  country: string
  city: string
  founded_year: number
  employee_range: string
  funding_rounds: FundingRound[]
}

interface FundingRound {
  id: string
  announced_date: string
  round_type: string
  amount_usd: number
  lead_investor: string
  lumpsum_investors: string
  company: CybersecurityCompany
  investors: Investor[]
}

interface CybersecurityCompany {
  id: string
  company_name: string
  website: string
  country: string
  city: string
  founded_year: number
  employee_range: string
}

interface Investor {
  id: string
  name: string
  investor_type: string
}

interface DealMapProps {
  className?: string
}

interface DealNode {
  id: string
  name: string
  type: 'company' | 'investor'
  x: number
  y: number
  size: number
  color: string
  data: Company | Investor
  connections: string[]
}

export default function DealMap({ className }: DealMapProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<DealNode | null>(null)
  const [filters, setFilters] = useState({
    country: 'all',
    roundType: 'all',
    minAmount: 0
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch companies and funding data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch companies with their funding rounds
        const companiesResponse = await fetch('/api/companies')
        const companiesData = await companiesResponse.json()
        
        // Fetch funding rounds
        const fundingResponse = await fetch('/api/funding-rounds?limit=100')
        const fundingData = await fundingResponse.json()
        
        setCompanies(companiesData || [])
        setFundingRounds(fundingData.data || [])
      } catch (error) {
        console.error('Error fetching deal map data:', error)
        // Set empty arrays on error to prevent undefined issues
        setCompanies([])
        setFundingRounds([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Generate deal nodes for visualization
  const generateDealNodes = (): DealNode[] => {
    const nodes: DealNode[] = []
    const companyMap = new Map<string, Company>()
    const investorMap = new Map<string, Investor>()

    // Process companies
    companies.forEach(company => {
      companyMap.set(company.id, company)
      
      const totalFunding = company.funding_rounds.reduce((sum, round) => sum + round.amount_usd, 0)
      const nodeSize = Math.max(20, Math.min(60, 20 + Math.log(totalFunding / 1000000) * 10))
      
      nodes.push({
        id: `company-${company.id}`,
        name: company.company_name,
        type: 'company',
        x: Math.random() * 600 + 100,
        y: Math.random() * 300 + 100,
        size: nodeSize,
        color: '#3b82f6',
        data: company,
        connections: []
      })
    })

    // Process investors from funding rounds
    const allInvestors = new Set<string>()
    fundingRounds.forEach(round => {
      if (round.lead_investor) allInvestors.add(round.lead_investor)
      if (round.lumpsum_investors) {
        round.lumpsum_investors.split(',').forEach(investor => {
          allInvestors.add(investor.trim())
        })
      }
      round.investors.forEach(investor => {
        allInvestors.add(investor.name)
      })
    })

    allInvestors.forEach(investorName => {
      const investor: Investor = {
        id: `investor-${investorName.replace(/\s+/g, '-')}`,
        name: investorName,
        investor_type: 'VC' // Default type
      }
      
      investorMap.set(investor.id, investor)
      
      nodes.push({
        id: investor.id,
        name: investorName,
        type: 'investor',
        x: Math.random() * 600 + 100,
        y: Math.random() * 300 + 100,
        size: 30,
        color: '#10b981',
        data: investor,
        connections: []
      })
    })

    // Create connections based on funding rounds
    fundingRounds.forEach(round => {
      const companyNode = nodes.find(n => n.type === 'company' && n.data.company_name === round.company?.company_name)
      
      if (companyNode) {
        // Connect to lead investor
        if (round.lead_investor) {
          const investorNode = nodes.find(n => n.type === 'investor' && n.name === round.lead_investor)
          if (investorNode && !companyNode.connections.includes(investorNode.id)) {
            companyNode.connections.push(investorNode.id)
          }
        }
        
        // Connect to other investors
        if (round.lumpsum_investors) {
          round.lumpsum_investors.split(',').forEach(investorName => {
            const investorNode = nodes.find(n => n.type === 'investor' && n.name === investorName.trim())
            if (investorNode && !companyNode.connections.includes(investorNode.id)) {
              companyNode.connections.push(investorNode.id)
            }
          })
        }
        
        round.investors.forEach(investor => {
          const investorNode = nodes.find(n => n.type === 'investor' && n.name === investor.name)
          if (investorNode && !companyNode.connections.includes(investorNode.id)) {
            companyNode.connections.push(investorNode.id)
          }
        })
      }
    })

    return nodes
  }

  const dealNodes = generateDealNodes()
  
  // Filter nodes based on search and filters
  const filteredNodes = dealNodes.filter(node => {
    if (searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    
    if (node.type === 'company') {
      const company = node.data as Company
      if (filters.country !== 'all' && company.country !== filters.country) {
        return false
      }
    }
    
    return true
  })

  // Get unique countries for filter
  const countries = Array.from(new Set(companies.map(c => c.country).filter(Boolean)))

  // Get unique round types for filter
  const roundTypes = Array.from(new Set(fundingRounds.map(fr => fr.round_type).filter(Boolean)))

  // Calculate statistics
  const stats = {
    totalCompanies: companies.length,
    totalFunding: fundingRounds.reduce((sum, round) => sum + (round.amount_usd || 0), 0),
    activeInvestors: new Set(
      fundingRounds.flatMap(round => [
        round.lead_investor,
        ...(round.lumpsum_investors?.split(',') || []),
        ...round.investors.map(i => i.name)
      ].filter(Boolean))
    ).size,
    avgFunding: fundingRounds.length > 0 ? 
      fundingRounds.reduce((sum, round) => sum + (round.amount_usd || 0), 0) / fundingRounds.length : 0
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-blue-600" />
            Investment Deal Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading deal map...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalCompanies}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Funding</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalFunding)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Investors</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeInvestors}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Funding</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.avgFunding)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Deal Map */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Map className="h-5 w-5 text-blue-600" />
              Investment Deal Flow
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search companies or investors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visualization Area */}
            <div className="lg:col-span-2">
              <div className="relative h-96 bg-muted/20 rounded-xl border-2 border-border/40 overflow-hidden">
                <svg className="w-full h-full">
                  {/* Render connections */}
                  {filteredNodes.map(node => {
                    return node.connections.map(connectionId => {
                      const targetNode = filteredNodes.find(n => n.id === connectionId)
                      if (!targetNode) return null
                      
                      return (
                        <line
                          key={`${node.id}-${connectionId}`}
                          x1={node.x}
                          y1={node.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke="#e2e8f0"
                          strokeWidth="2"
                          className="transition-all duration-200"
                        />
                      )
                    })
                  })}
                  
                  {/* Render nodes */}
                  {filteredNodes.map(node => (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size}
                        fill={node.color}
                        className="cursor-pointer hover:opacity-80 transition-all duration-200"
                        onClick={() => setSelectedNode(node)}
                      />
                      <text
                        x={node.x}
                        y={node.y + node.size + 15}
                        textAnchor="middle"
                        className="text-xs fill-muted-foreground pointer-events-none"
                      >
                        {node.name.length > 12 ? node.name.substring(0, 12) + '...' : node.name}
                      </text>
                    </g>
                  ))}
                </svg>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg border border-border/60">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Companies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Investors</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Details Panel */}
            <div className="space-y-4">
              {selectedNode ? (
                <Card className="border border-border/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      {selectedNode.type === 'company' ? (
                        <Building2 className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Users className="h-4 w-4 text-green-600" />
                      )}
                      {selectedNode.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedNode.type === 'company' && (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Location:</span>
                            <span>{(selectedNode.data as Company).city}, {(selectedNode.data as Company).country}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Founded:</span>
                            <span>{(selectedNode.data as Company).founded_year}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Size:</span>
                            <span>{(selectedNode.data as Company).employee_range}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Funding Rounds</p>
                          <div className="space-y-2">
                            {(selectedNode.data as Company).funding_rounds.slice(0, 3).map((round: FundingRound) => (
                              <div key={round.id} className="p-2 bg-muted/30 rounded text-xs">
                                <div className="flex justify-between items-center">
                                  <Badge variant="outline" className="text-xs">{round.round_type}</Badge>
                                  <span className="font-medium">{formatCurrency(round.amount_usd || 0)}</span>
                                </div>
                                <p className="text-muted-foreground mt-1">{round.lead_investor || 'N/A'}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {selectedNode.type === 'investor' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Type:</span>
                          <span>{(selectedNode.data as Investor).investor_type}</span>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Recent Investments</p>
                          <div className="space-y-2">
                            {fundingRounds
                              .filter(round => round.lead_investor === selectedNode.name || 
                                round.lumpsum_investors?.includes(selectedNode.name) ||
                                round.investors.some(inv => inv.name === selectedNode.name))
                              .slice(0, 3)
                              .map(round => (
                                <div key={round.id} className="p-2 bg-muted/30 rounded text-xs">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">{round.company?.company_name || 'N/A'}</span>
                                    <span>{formatCurrency(round.amount_usd || 0)}</span>
                                  </div>
                                  <p className="text-muted-foreground mt-1">{round.round_type}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedNode(null)}
                    >
                      Close Details
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-border/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Deal Map Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">Interactive Deal Map</p>
                      <p className="text-xs text-muted-foreground">
                        Click on any company or investor node to view detailed information and connections
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Quick Stats</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Connections:</span>
                          <span>{filteredNodes.reduce((sum, node) => sum + node.connections.length, 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Active Nodes:</span>
                          <span>{filteredNodes.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Network Density:</span>
                          <span>{((filteredNodes.reduce((sum, node) => sum + node.connections.length, 0) / (filteredNodes.length * (filteredNodes.length - 1))) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}