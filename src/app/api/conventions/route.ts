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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, location, start_date, end_date, description, website } = body

    if (!name || !location || !start_date || !end_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, location, start_date, end_date' },
        { status: 400 }
      )
    }

    const convention = await db.cybersecurityConvention.create({
      data: {
        name,
        location,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        description: description || null,
        website: website || null,
        is_active: true
      }
    })

    return NextResponse.json({
      success: true,
      data: convention,
      message: 'Convention created successfully'
    })
  } catch (error) {
    console.error('Error creating convention:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create convention' },
      { status: 500 }
    )
  }
}