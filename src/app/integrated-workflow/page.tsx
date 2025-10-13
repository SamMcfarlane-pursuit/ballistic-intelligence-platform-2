/**
 * Integrated Workflow Page
 * Complete 3-Phase Pipeline: Gather → Process → Analyze
 * Manages the end-to-end transformation from raw articles to verified database records
 */

import IntegratedWorkflowDashboard from '@/components/workflow/IntegratedWorkflowDashboard'

export default function IntegratedWorkflowPage() {
  return (
    <div className="container mx-auto py-8">
      <IntegratedWorkflowDashboard />
    </div>
  )
}

export const metadata = {
  title: 'Integrated Workflow - CS Intelligence Platform',
  description: 'Complete 3-phase pipeline for processing cybersecurity funding intelligence'
}