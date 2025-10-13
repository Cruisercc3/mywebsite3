"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PageTransitionGlowProps {
  currentView: string
  className?: string
}

export function PageTransitionGlow({ currentView, className = "" }: PageTransitionGlowProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [previousView, setPreviousView] = useState<string | null>(null)

  useEffect(() => {
    if (previousView !== null && currentView !== previousView) {
      setIsAnimating(true)

      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 1200)

      return () => clearTimeout(timer)
    }

    setPreviousView(currentView)
  }, [currentView, previousView])

  useEffect(() => {
    if (previousView !== null) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [currentView])

  const getGlowColor = () => {
    return "rgba(239,68,68,0.9)" // Red theme color with higher opacity
  }

  const shouldShowGlow =
    currentView === "home" || currentView === "calendar" || currentView === "storage" || currentView === "settings"

  if (!shouldShowGlow) return null

  return (
    <div className={`absolute top-8 left-0 pointer-events-none ${className}`}>
      <AnimatePresence>
        {isAnimating && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0.9, 0],
                scale: [0, 2, 4, 0],
                x: [0, 30, 80, 120],
                y: [0, -5, 0, 5],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                times: [0, 0.25, 0.75, 1],
              }}
              className="absolute w-16 h-6 rounded-full"
              style={{
                background: `radial-gradient(ellipse, ${getGlowColor()} 0%, ${getGlowColor().replace("0.9", "0.5")} 40%, transparent 70%)`,
                filter: "blur(10px)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0.4, 0],
                scale: [0, 3, 6, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.05,
              }}
              className="absolute w-20 h-8 rounded-full -translate-x-2 -translate-y-1"
              style={{
                background: `radial-gradient(ellipse, transparent 30%, ${getGlowColor().replace("0.9", "0.3")} 50%, transparent 70%)`,
                filter: "blur(15px)",
              }}
            />

            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 0.8, 0],
                  x: [0, 20 + i * 12, 50 + i * 15],
                  y: [0, -3 - i * 1.5, 2 - i * 0.5],
                }}
                transition={{
                  duration: 1,
                  ease: [0.4, 0, 0.2, 1],
                  delay: i * 0.08,
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: getGlowColor(),
                  filter: "blur(2px)",
                  boxShadow: `0 0 8px ${getGlowColor()}`,
                }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.6, 0],
                scale: [0, 1.5, 3, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 1.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute w-12 h-4 rounded-full -translate-x-2 -translate-y-1"
              style={{
                background: "transparent",
                border: `3px solid ${getGlowColor()}`,
                filter: "blur(1px)",
                boxShadow: `0 0 30px ${getGlowColor()}, inset 0 0 15px ${getGlowColor().replace("0.9", "0.4")}, 0 0 60px ${getGlowColor().replace("0.9", "0.2")}`,
              }}
            />

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: [0, 1, 0.8, 0],
                scaleX: [0, 1, 2, 0],
              }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.1,
              }}
              className="absolute w-32 h-0.5 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${getGlowColor()} 50%, transparent 100%)`,
                filter: "blur(0.5px)",
                boxShadow: `0 0 20px ${getGlowColor()}`,
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
