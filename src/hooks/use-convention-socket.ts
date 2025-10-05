'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ConventionUpdate, CompanyUpdate } from '@/lib/socket'

interface UseConventionSocketOptions {
  conventionId?: string
  enableUpdates?: boolean
}

interface ConventionSocketState {
  isConnected: boolean
  lastUpdate: ConventionUpdate | null
  scrapingProgress: {
    conventionId: string
    progress: number
    companiesFound: number
    message: string
  } | null
  error: string | null
}

export function useConventionSocket(options: UseConventionSocketOptions = {}) {
  const { conventionId, enableUpdates = true } = options
  const socketRef = useRef<Socket | null>(null)
  const [state, setState] = useState<ConventionSocketState>({
    isConnected: false,
    lastUpdate: null,
    scrapingProgress: null,
    error: null
  })

  useEffect(() => {
    if (!enableUpdates) return

    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling']
    })

    const socket = socketRef.current

    // Connection events
    socket.on('connect', () => {
      setState(prev => ({ ...prev, isConnected: true, error: null }))
      console.log('Connected to convention socket')

      // Join convention room if specified
      if (conventionId) {
        socket.emit('join-convention', conventionId)
      }

      // Join general updates
      socket.emit('join-convention-updates')
    })

    socket.on('disconnect', () => {
      setState(prev => ({ ...prev, isConnected: false }))
      console.log('Disconnected from convention socket')
    })

    socket.on('connect_error', (error) => {
      setState(prev => ({ ...prev, error: error.message }))
      console.error('Socket connection error:', error)
    })

    // Convention updates
    socket.on('convention-update', (update: ConventionUpdate) => {
      setState(prev => ({ ...prev, lastUpdate: update }))
      console.log('Received convention update:', update)
    })

    // Scraping progress
    socket.on('scraping-progress', (progress) => {
      setState(prev => ({ ...prev, scrapingProgress: progress }))
      console.log('Scraping progress:', progress)
    })

    // Error handling
    socket.on('error', (error) => {
      setState(prev => ({ ...prev, error: error.message }))
      console.error('Socket error:', error)
    })

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        if (conventionId) {
          socket.emit('leave-convention', conventionId)
        }
        socket.disconnect()
        socketRef.current = null
      }
    }
  }, [conventionId, enableUpdates])

  // Update company status
  const updateCompany = (update: CompanyUpdate) => {
    if (socketRef.current && state.isConnected) {
      socketRef.current.emit('update-company', update)
    }
  }

  // Report new company discovered
  const reportNewCompany = (companyData: any) => {
    if (socketRef.current && state.isConnected) {
      socketRef.current.emit('new-company-discovered', companyData)
    }
  }

  // Report scraping progress
  const reportScrapingProgress = (progress: {
    conventionId: string
    progress: number
    companiesFound: number
    message: string
  }) => {
    if (socketRef.current && state.isConnected) {
      socketRef.current.emit('scraping-progress', progress)
    }
  }

  // Report AI analysis completion
  const reportAIAnalysisComplete = (result: {
    companyId: string
    analysis: any
    confidence: number
  }) => {
    if (socketRef.current && state.isConnected) {
      socketRef.current.emit('ai-analysis-complete', result)
    }
  }

  return {
    ...state,
    updateCompany,
    reportNewCompany,
    reportScrapingProgress,
    reportAIAnalysisComplete
  }
}