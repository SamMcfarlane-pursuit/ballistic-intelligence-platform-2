import { ExecutiveLayout } from '@/components/layouts/ExecutiveLayout'
import AIAgentsDashboard from '@/components/dashboard/AIAgentsDashboard'

export default function AIAgentsPage() {
  return (
    <ExecutiveLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Agent System</h1>
          <p className="text-gray-600">
            Autonomous AI agents for comprehensive cybersecurity investment analysis
          </p>
        </div>
        
        <AIAgentsDashboard />
      </div>
    </ExecutiveLayout>
  )
}