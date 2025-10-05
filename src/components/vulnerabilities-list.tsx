"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Building2 } from 'lucide-react'

interface Vulnerability {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  affectedCompanies: number
  discoveredDate: string
  description: string
}

interface VulnerabilitiesListProps {
  vulnerabilities: Vulnerability[]
}

const severityColors = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500'
}

export default function VulnerabilitiesList({ vulnerabilities }: VulnerabilitiesListProps) {
  return (
    <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Recent Vulnerabilities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vulnerabilities.map((vulnerability) => (
            <div 
              key={vulnerability.id} 
              className="flex items-start space-x-4 p-4 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className={`w-3 h-3 rounded-full mt-1.5 ${severityColors[vulnerability.severity]} shadow-sm`} />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm leading-tight">{vulnerability.title}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={vulnerability.severity === 'critical' ? 'destructive' : vulnerability.severity === 'high' ? 'default' : 'secondary'}
                      className="text-xs px-2 py-1"
                    >
                      {vulnerability.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(vulnerability.discoveredDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {vulnerability.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {vulnerability.affectedCompanies} affected companies
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2 hover:bg-muted">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}