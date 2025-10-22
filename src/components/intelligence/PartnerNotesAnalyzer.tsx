'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Search, 
  TrendingUp, 
  Users, 
  Brain,
  Upload,
  Download
} from 'lucide-react'

interface PartnerNote {
  id: string
  title: string
  content: string
  author: string
  date: string
  companies: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  tags: string[]
}

export default function PartnerNotesAnalyzer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Mock partner notes data
  const mockNotes: PartnerNote[] = [
    {
      id: '1',
      title: 'SecureFlow AI - Series B Due Diligence',
      content: 'Impressive AI-powered threat detection capabilities. Strong technical team with proven track record. Market timing is excellent with increasing cybersecurity concerns.',
      author: 'Sarah Chen',
      date: '2024-10-15',
      companies: ['SecureFlow AI', 'CrowdStrike'],
      sentiment: 'positive',
      tags: ['due-diligence', 'ai', 'cybersecurity', 'series-b']
    },
    {
      id: '2',
      title: 'Cloud Security Market Analysis',
      content: 'The cloud security market is experiencing rapid growth. Key players are consolidating, creating opportunities for innovative startups with differentiated technology.',
      author: 'Michael Rodriguez',
      date: '2024-10-12',
      companies: ['CloudGuard Pro', 'Zscaler', 'Palo Alto Networks'],
      sentiment: 'positive',
      tags: ['market-analysis', 'cloud-security', 'trends']
    },
    {
      id: '3',
      title: 'Identity Management Sector Review',
      content: 'Zero-trust adoption is accelerating. Companies with passwordless authentication solutions are seeing strong traction. Regulatory compliance driving demand.',
      author: 'Emily Watson',
      date: '2024-10-10',
      companies: ['ZeroTrust Systems', 'Okta', 'Auth0'],
      sentiment: 'positive',
      tags: ['identity-management', 'zero-trust', 'compliance']
    }
  ]

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.companies.some(company => company.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter = selectedFilter === 'all' || 
      note.sentiment === selectedFilter ||
      note.tags.includes(selectedFilter)

    return matchesSearch && matchesFilter
  })

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'negative': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Intelligence</h1>
          <p className="text-gray-600">AI-powered analysis of partner notes and market insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Notes
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold text-gray-900">{mockNotes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Companies Mentioned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(mockNotes.flatMap(note => note.companies)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Positive Sentiment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockNotes.filter(note => note.sentiment === 'positive').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Insights</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search notes, companies, or insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                All
              </Button>
              <Button
                variant={selectedFilter === 'positive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('positive')}
              >
                Positive
              </Button>
              <Button
                variant={selectedFilter === 'due-diligence' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('due-diligence')}
              >
                Due Diligence
              </Button>
              <Button
                variant={selectedFilter === 'market-analysis' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('market-analysis')}
              >
                Market Analysis
              </Button>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                      <p className="text-sm text-gray-600">by {note.author} • {note.date}</p>
                    </div>
                    <Badge className={getSentimentColor(note.sentiment)}>
                      {note.sentiment}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{note.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {note.companies.map((company, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No notes match your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">AI-Generated Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Market Trends</h3>
              <p className="text-sm text-blue-800">
                Cloud security and AI-powered threat detection are the most frequently mentioned themes, 
                indicating strong market momentum in these areas.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Investment Opportunities</h3>
              <p className="text-sm text-green-800">
                Companies with zero-trust and passwordless authentication solutions show consistently 
                positive sentiment across partner notes.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Risk Factors</h3>
              <p className="text-sm text-purple-800">
                Market consolidation in established segments may create challenges for new entrants 
                without significant differentiation.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">Recommendations</h3>
              <p className="text-sm text-orange-800">
                Focus on companies with strong technical teams and proven traction in emerging 
                cybersecurity verticals like IoT and edge security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}