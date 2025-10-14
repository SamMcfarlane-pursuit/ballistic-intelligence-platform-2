import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { taskId, status, notes } = await request.json()

    if (!taskId || !status) {
      return NextResponse.json(
        { success: false, error: 'Task ID and status are required' },
        { status: 400 }
      )
    }

    // Mock update - in production, this would update your database
    console.log(`Updating task ${taskId} to status: ${status}`, { notes })

    // Simulate database update
    const updatedTask = {
      id: taskId,
      status,
      updatedAt: new Date().toISOString(),
      notes: notes || null
    }

    return NextResponse.json({
      success: true,
      task: updatedTask,
      message: `Task ${taskId} updated to ${status}`
    })

  } catch (error) {
    console.error('Task update API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    )
  }
}