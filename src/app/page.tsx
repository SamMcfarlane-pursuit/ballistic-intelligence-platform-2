'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Target,
  ArrowRight
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Simplified Landing */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-8">
            <Shield className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CS Intelligence Platform
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Executive-focused cybersecurity intelligence dashboard
          </p>
          
          <div className="space-y-4">
            <Link href="/executive-dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto">
                <Target className="mr-2 h-5 w-5" />
                Access Executive Dashboard
              </Button>
            </Link>
            
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Badge variant="outline">Portfolio Intelligence</Badge>
              <Badge variant="outline">Security Monitoring</Badge>
              <Badge variant="outline">AI Analysis</Badge>
              <Badge variant="outline">Threat Intelligence</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}