"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedHeaderProps {
  text: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function AnimatedHeader({ text, className, size = "lg" }: AnimatedHeaderProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl", 
    lg: "text-2xl",
    xl: "text-3xl"
  }

  const words = text.split(" ")

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("relative", className)}
    >
      <h1 className={cn(
        "font-bold text-foreground relative z-10",
        sizeClasses[size]
      )}>
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            className="colorful-word inline-block mr-2 last:mr-0"
            style={{
              display: "inline-block",
              marginRight: index === words.length - 1 ? 0 : "0.25em"
            }}
          >
            {word}
          </motion.span>
        ))}
      </h1>
      
      {/* Subtle glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg blur-xl -z-10"
      />
      
      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent origin-center"
      />
    </motion.div>
  )
}