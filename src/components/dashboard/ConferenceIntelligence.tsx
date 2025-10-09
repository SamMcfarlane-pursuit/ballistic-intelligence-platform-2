'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Calendar, MapPin, Users, DollarSign, ExternalLink, Trophy } from 'lucide-react'

interface ConferenceEvent {
  id: string
  name: string
  dates: string
  location: string
  type: string
  startups: number
  funding: string
  vcMeetings: number
  attendees: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

interface StartupShowcase {
  name: string
  category: string
  conference: string
  fundingStage: string
  vcInterest: 'High' | 'Medium' | 'Low'
  rating: number
}

interface ConferenceIntelligenceData {
  events: ConferenceEvent[]
  showcases: StartupShowcase[]
  summary: {
    totalEvents: number
    upcomingEvents: number
    totalStartups: number
    totalFunding: string
    totalVCMeetings: number
    totalAttendees: number
  }
  lastUpdated: string
}

export function ConferenceIntelligence() {
  const [data, setData] = useState<ConferenceIntelligenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchConferenceData = async () => {
    try {
      // Mock data - in production, this would fetch from multiple conference intelligence sources
      const mockData: ConferenceIntelligenceData = {
        events: [
          {
            id: 'sans-orlando-2025',
            name: 'SANS Orlando 2025',
            dates: 'Apr 13-18, 2025',
            location: 'Orlando, FL',
            type: 'Training & Demos',
            startups: 234,
            funding: '$45M',
            vcMeetings: 156,
            attendees: 2800,
            status: 'upcoming'
          },
          {
            id: 'cyberuk-2025',
            name: 'CYBERUK',
            dates: 'May 6-8, 2025',
            location: 'Manchester, UK',
            type: 'Government Funding',
            startups: 89,
            funding: '£40M',
            vcMeetings: 67,
            attendees: 1200,
            status: 'upcoming'
          },
          {
            id: 'cybersec-europe-2025',
            name: 'Cybersec Europe',
            dates: 'May 21-22, 2025',
            location: 'Brussels, Belgium',
            type: 'EU Innovation',
            startups: 45,
            funding: '€50M',
            vcMeetings: 89,
            attendees: 800,
            status: 'upcoming'
          },
          {
            id: 'gartner-summit-2025',
            name: 'Gartner Security Summit',
            dates: 'Jun 9-11, 2025',
            location: 'National Harbor, MD',
            type: 'Analyst Insights',
            startups: 156,
            funding: '$77M',
            vcMeetings: 234,
            attendees: 1500,
            status: 'upcoming'
          },
          {
            id: 'iccs-2025',
            name: 'ICCS Conference',
            dates: 'Jul 14-16, 2025',
            location: 'New York, NY',
            type: 'Academic Crossover',
            startups: 78,
            funding: '$20.5M',
            vcMeetings: 123,
            attendees: 950,
            status: 'upcoming'
          },
          {
            id: 'def-con-33',
            name: 'DEF CON 33',
            dates: 'Aug 7-10, 2025',
            location: 'Las Vegas, NV',
            type: 'Hacker Community',
            startups: 85,
            funding: '$12M',
            vcMeetings: 45,
            attendees: 25000,
            status: 'upcoming'
          }
        ],
        showcases: [
          {
            name: 'QuantumSecure Ltd',
            category: 'Quantum Security',
            conference: 'CYBERUK',
            fundingStage: 'Series A',
            vcInterest: 'High',
            rating: 4.8
          },
          {
            name: 'EuroSecure',
            category: 'Privacy Tech',
            conference: 'Cybersec Europe',
            fundingStage: 'Series A',
            vcInterest: 'High',
            rating: 4.6
          },
          {
            name: 'SOCAutomation',
            category: 'Security Orchestration',
            conference: 'Blue Team Con',
            fundingStage: 'Seed',
            vcInterest: 'Medium',
            rating: 4.7
          },
          {
            name: 'CyberResearch Labs',
            category: 'Quantum Cryptography',
            conference: 'ICCS',
            fundingStage: 'Series B',
            vcInterest: 'High',
            rating: 4.9
          }
        ],
        summary: {
          totalEvents: 8,
          upcomingEvents: 6,
          totalStartups: 786,
          totalFunding: '$321.5M',
          totalVCMeetings: 714,
          totalAttendees: 32250
        },
        lastUpdated: new Date().toISOString()
      }

      setData(mockData)
    } catch (error) {
      console.error('Failed to fetch conference intelligence data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchConferenceData()
  }

  useEffect(() => {
    fetchConferenceData()
    
    // Auto-refresh every 15 minutes
    const interval = setInterval(fetchConferenceData, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getEventStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getVCInterestColor = (interest: string) => {
    const colors: Record<string, string> = {
      High: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-red-100 text-red-800'
    }
    return colors[interest] || 'bg-gray-100 text-gray-800'
  }

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Training & Demos': 'bg-purple-100 text-purple-800',
      'Government Funding': 'bg-blue-100 text-blue-800',
      'EU Innovation': 'bg-yellow-100 text-yellow-800',
      'Analyst Insights': 'bg-green-100 text-green-800',
      'Academic Crossover': 'bg-indigo-100 text-indigo-800',
      'Hacker Community': 'bg-red-100 text-red-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Conference Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Conference Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load conference intelligence data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Conference Intelligence
            </CardTitle>
            <CardDescription>
              Startup showcases and investor activities
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.summary.upcomingEvents}</div>
            <div className="text-sm text-muted-foreground">Upcoming Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.summary.totalStartups}</div>
            <div className="text-sm text-muted-foreground">Startups</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{data.summary.totalVCMeetings}</div>
            <div className="text-sm text-muted-foreground">VC Meetings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{data.summary.totalFunding}</div>
            <div className="text-sm text-muted-foreground">Total Funding</div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Events
          </h4>
          <div className="space-y-3">
            {data.events.filter(event => event.status === 'upcoming').slice(0, 4).map((event) => (
              <div key={event.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-sm truncate">{event.name}</h5>
                      <Badge variant="secondary" className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      <Badge variant="outline" className={getEventStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {event.dates}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {event.startups} startups
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {event.funding}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.vcMeetings} VC meetings
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Startup Showcases */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Featured Startup Showcases
          </h4>
          <div className="grid gap-3">
            {data.showcases.map((showcase, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-sm">{showcase.name}</h5>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {showcase.category}
                      </Badge>
                      <Badge variant="outline" className={getVCInterestColor(showcase.vcInterest)}>
                        {showcase.vcInterest} Interest
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {showcase.conference} • {showcase.fundingStage} • Rating: {showcase.rating}/5.0
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Sources: DEF CON, RSA, Black Hat, Gartner, SANS</span>
              <span>Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Live
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}