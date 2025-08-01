"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Bot, User, Sparkles, Brain } from "lucide-react"

interface SectionHeaderProps {
  text: string
  type: "agent" | "user"
  variant: "questions" | "insights"
  className?: string
}

export function SectionHeader({ text, type, variant, className }: SectionHeaderProps) {
  const Icon = type === "agent" ? Bot : User
  const AccentIcon = variant === "questions" ? Sparkles : Brain
  
  const words = text.split(" ")

  return (
    <motion.div
      initial={{ opacity: 0, x: type === "agent" ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("relative mb-6", className)}
    >
      <div className="flex items-center gap-3 mb-2">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className={cn(
            "p-2 rounded-full border-2 border-primary/20 bg-background/80 backdrop-blur-sm",
            type === "agent" ? "text-primary" : "text-primary/80"
          )}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
          className="text-primary/60"
        >
          <AccentIcon className="h-4 w-4" />
        </motion.div>
      </div>

      <h2 className="text-2xl font-bold text-foreground relative">
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.3 + (index * 0.1),
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
      </h2>
      
      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
        className={cn(
          "mt-2 h-px bg-gradient-to-r origin-left",
          type === "agent" 
            ? "from-primary/40 via-primary/20 to-transparent" 
            : "from-transparent via-primary/20 to-primary/40"
        )}
      />
    </motion.div>
  )
}