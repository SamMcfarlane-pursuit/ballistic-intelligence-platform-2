import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const criteria = await db.investmentCriteria.findMany({
      orderBy: [
        { importance: 'desc' },
        { companies_meeting: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: criteria
    })
  } catch (error) {
    console.error('Error fetching investment criteria:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch investment criteria' },
      { status: 500 }
    )
  }
}