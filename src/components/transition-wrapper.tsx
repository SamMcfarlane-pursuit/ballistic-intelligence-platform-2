"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface TransitionWrapperProps {
  children: React.ReactNode
  isLoading?: boolean
  error?: string | null
  skeleton?: React.ReactNode
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export function TransitionWrapper({ 
  children, 
  isLoading = false, 
  error = null, 
  skeleton,
  className = "" 
}: TransitionWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && skeleton && (
        <motion.div
          key="loading"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className={className}
        >
          {skeleton}
        </motion.div>
      )}
      
      {error && (
        <motion.div
          key="error"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className={className}
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-red-600 mb-2">⚠️ Error</div>
                <div className="text-red-800 font-medium">{error}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {!isLoading && !error && (
        <motion.div
          key="content"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function StaggeredContainer({ children, className = "" }: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export function StaggeredItem({ children, delay = 0 }: { 
  children: React.ReactNode
  delay?: number 
}) {
  return (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}

export function SlideInPanel({ 
  children, 
  isOpen, 
  direction = "right" 
}: { 
  children: React.ReactNode
  isOpen: boolean
  direction?: "left" | "right" | "top" | "bottom"
}) {
  const getInitialPosition = () => {
    switch (direction) {
      case "left": return { x: -300, y: 0 }
      case "right": return { x: 300, y: 0 }
      case "top": return { x: 0, y: -300 }
      case "bottom": return { x: 0, y: 300 }
      default: return { x: 300, y: 0 }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={getInitialPosition()}
          animate={{ x: 0, y: 0 }}
          exit={getInitialPosition()}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-0 z-50"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function PulseAnimation({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

export function LoadingDots() {
  return (
    <motion.div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-blue-600 rounded-full"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  )
}

export function CounterAnimation({ 
  value, 
  duration = 1,
  prefix = "",
  suffix = ""
}: { 
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * value))
      
      if (progress < 1) {
        requestAnimationFrame(animateCount)
      }
    }
    
    requestAnimationFrame(animateCount)
  }, [value, duration])

  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}