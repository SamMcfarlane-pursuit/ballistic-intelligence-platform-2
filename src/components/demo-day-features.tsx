"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Mail, 
  Phone, 
  Linkedin, 
  Github,
  ExternalLink,
  Star,
  Award,
  Target,
  Lightbulb,
  Rocket,
  CheckCircle,
  Calendar,
  MapPin,
  DollarSign,
  Eye,
  Brain
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  company: string
  role: string
  email: string
  linkedin?: string
  interest: 'high' | 'medium' | 'low'
  notes: string
  followUpDate: string
}

interface Opportunity {
  id: string
  company: string
  type: 'employment' | 'partnership' | 'investment' | 'consulting'
  title: string
  description: string
  status: 'lead' | 'contacted' | 'meeting' | 'proposal' | 'closed'
  value: string
  timeline: string
}

interface DemoHighlight {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  impact: string
  tech: string[]
}

export default function DemoDayFeatures() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'Ballistic Ventures',
      role: 'Partner',
      email: 's.chen@ballistic.vc',
      linkedin: 'https://linkedin.com/in/sarahchen',
      interest: 'high',
      notes: 'Interested in AI-powered market intelligence for cybersecurity investments',
      followUpDate: '2024-01-20'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      company: 'Sequoia Capital',
      role: 'CTO',
      email: 'm.rodriguez@sequoiacap.com',
      interest: 'medium',
      notes: 'Exploring data analytics partnerships for portfolio companies',
      followUpDate: '2024-01-22'
    }
  ])

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: '1',
      company: 'Ballistic Ventures',
      type: 'partnership',
      title: 'Market Intelligence Platform',
      description: 'License the funding tracker for internal use across their investment team',
      status: 'meeting',
      value: '$50k/year',
      timeline: 'Q1 2024'
    },
    {
      id: '2',
      company: 'CyberShield AI',
      type: 'consulting',
      title: 'Competitive Analysis Dashboard',
      description: 'Build custom dashboard for tracking competitor funding activity',
      status: 'proposal',
      value: '$25k project',
      timeline: 'February 2024'
    }
  ])

  const [newContact, setNewContact] = useState({
    name: '',
    company: '',
    role: '',
    email: '',
    linkedin: '',
    notes: ''
  })

  const [demoStats, setDemoStats] = useState({
    views: 0,
    contacts: 0,
    opportunities: 0,
    partnerships: 0
  })

  const demoHighlights: DemoHighlight[] = [
    {
      id: '1',
      title: 'AI-Powered Data Processing',
      description: 'Automated extraction of funding data from news articles using advanced NLP',
      icon: <Brain className="h-6 w-6" />,
      impact: 'Reduces manual research time by 80%',
      tech: ['AI/ML', 'NLP', 'Automation']
    },
    {
      id: '2',
      title: 'Real-time Market Intelligence',
      description: 'Live dashboard with predictive analytics for investment trends',
      icon: <TrendingUp className="h-6 w-6" />,
      impact: 'Enables data-driven investment decisions',
      tech: ['Real-time Analytics', 'Predictive Modeling', 'Data Visualization']
    },
    {
      id: '3',
      title: 'Enterprise-Ready Architecture',
      description: 'Scalable microservices architecture with comprehensive API',
      icon: <Rocket className="h-6 w-6" />,
      impact: 'Ready for production deployment at scale',
      tech: ['Next.js', 'TypeScript', 'Prisma', 'REST APIs']
    }
  ]

  const handleAddContact = () => {
    if (newContact.name && newContact.email) {
      const contact: Contact = {
        id: Date.now().toString(),
        ...newContact,
        interest: 'medium' as const,
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
      setContacts([...contacts, contact])
      setNewContact({
        name: '',
        company: '',
        role: '',
        email: '',
        linkedin: '',
        notes: ''
      })
      setDemoStats(prev => ({ ...prev, contacts: prev.contacts + 1 }))
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      lead: { label: 'Lead', variant: 'secondary' as const },
      contacted: { label: 'Contacted', variant: 'outline' as const },
      meeting: { label: 'Meeting', variant: 'default' as const },
      proposal: { label: 'Proposal', variant: 'default' as const },
      closed: { label: 'Closed', variant: 'default' as const }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.lead
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getInterestBadge = (interest: string) => {
    const interestConfig = {
      high: { label: 'High', className: 'bg-green-100 text-green-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Low', className: 'bg-red-100 text-red-800' }
    }
    const config = interestConfig[interest as keyof typeof interestConfig] || interestConfig.medium
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getOpportunityIcon = (type: string) => {
    const icons = {
      employment: <Users className="h-4 w-4" />,
      partnership: <Building2 className="h-4 w-4" />,
      investment: <DollarSign className="h-4 w-4" />,
      consulting: <Target className="h-4 w-4" />
    }
    return icons[type as keyof typeof icons] || icons.consulting
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Rocket className="h-8 w-8" />
          Demo Day Success Center
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Track connections, opportunities, and partnerships generated from your Demo Day presentation
        </p>
      </div>

      {/* Demo Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demo Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStats.views}</div>
            <p className="text-xs text-muted-foreground">Live demo interactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts Made</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">Potential employers & partners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
            <p className="text-xs text-muted-foreground">Business leads generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partnerships</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStats.partnerships}</div>
            <p className="text-xs text-muted-foreground">Active collaborations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="highlights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="highlights">Demo Highlights</TabsTrigger>
          <TabsTrigger value="contacts">Contact Management</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="pitch">Pitch Deck</TabsTrigger>
        </TabsList>

        <TabsContent value="highlights" className="space-y-6">
          <div className="grid gap-6">
            {demoHighlights.map((highlight) => (
              <Card key={highlight.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {highlight.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{highlight.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {highlight.description}
                      </CardDescription>
                      <div className="mt-4">
                        <Badge variant="outline" className="mb-2">
                          Impact: {highlight.impact}
                        </Badge>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {highlight.tech.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Contact</CardTitle>
              <CardDescription>
                Capture information from Demo Day networking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                />
                <Input
                  placeholder="Company"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                />
                <Input
                  placeholder="Role"
                  value={newContact.role}
                  onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                />
                <Input
                  placeholder="LinkedIn (optional)"
                  value={newContact.linkedin}
                  onChange={(e) => setNewContact({ ...newContact, linkedin: e.target.value })}
                />
              </div>
              <Textarea
                placeholder="Notes and conversation details..."
                value={newContact.notes}
                onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
              />
              <Button onClick={handleAddContact} className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {contacts.map((contact) => (
              <Card key={contact.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      <CardDescription>
                        {contact.role} at {contact.company}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getInterestBadge(contact.interest)}
                      <Badge variant="outline">
                        Follow-up: {new Date(contact.followUpDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                      {contact.linkedin && (
                        <a
                          href={contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {contact.notes}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid gap-4">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getOpportunityIcon(opportunity.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                        <CardDescription>
                          {opportunity.company} • {opportunity.type}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(opportunity.status)}
                      <Badge variant="outline">{opportunity.value}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">{opportunity.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{opportunity.timeline}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pitch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Elevator Pitch</CardTitle>
              <CardDescription>
                30-second pitch for Demo Day networking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm leading-relaxed">
                  "I've built an AI-powered cybersecurity funding tracker that automatically monitors 
                  50+ news sources to extract funding data in real-time. It uses advanced NLP to 
                  identify companies, investors, and funding amounts, then provides predictive analytics 
                  to help VCs make data-driven investment decisions. We're already tracking $306M in 
                  funding across 8 companies and have integrated with n8n for automated workflows. 
                  The platform reduces research time by 80% and provides actionable market intelligence 
                  that's typically only available in expensive tools like PitchBook."
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Talking Points</CardTitle>
              <CardDescription>
                Highlight these features when networking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Real-time Data Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Automated collection from news sources, press releases, and SEC filings
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">AI-Powered Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      NLP and machine learning for trend prediction and opportunity identification
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Enterprise-Ready</h4>
                    <p className="text-sm text-muted-foreground">
                      Scalable architecture with comprehensive API for integration
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Cost-Effective Alternative</h4>
                    <p className="text-sm text-muted-foreground">
                      90% cheaper than PitchBook with similar cybersecurity focus
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call to Action</CardTitle>
              <CardDescription>
                What to ask potential employers and partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    "Would your team benefit from real-time cybersecurity funding intelligence?"
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-900">
                    "Could we explore a pilot program to test this with your investment team?"
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">
                    "I'd love to learn more about your data needs - could we schedule a follow-up?"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}