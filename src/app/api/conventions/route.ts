import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    let whereClause = {}
    
    if (active === 'true') {
      whereClause = {
        is_active: true
      }
    }

    const conventions = await db.cybersecurityConvention.findMany({
      where: whereClause,
      orderBy: [
        { start_date: 'asc' }
      ],
      include: {
        conventionCompanies: {
          orderBy: [
            { overall_fit_score: 'desc' }
          ]
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: conventions
    })
  } catch (error) {
    console.error('Error fetching conventions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conventions' },
      { status: 500 }
    )
  }
}