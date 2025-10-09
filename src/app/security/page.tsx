import { ExecutiveLayout } from '@/components/layouts/ExecutiveLayout'
import SecurityDashboard from '@/components/security/SecurityDashboard'

export default function SecurityPage() {
  return (
    <ExecutiveLayout>
      <div className="container mx-auto px-4 py-8">
        <SecurityDashboard />
      </div>
    </ExecutiveLayout>
  )
}