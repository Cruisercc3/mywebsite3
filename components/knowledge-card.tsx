"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface KnowledgeCardData {
  id: string
  title: string
  description: string
  insights?: string[] // For enlarged view
}

interface KnowledgeCardProps {
  card: KnowledgeCardData
  onEnlarge: (card: KnowledgeCardData) => void
  className?: string
  index?: number
}

export function KnowledgeCard({ card, onEnlarge, className, index = 0 }: KnowledgeCardProps) {
  return (
    <motion.div
      key={card.id}
      className={cn(
        "bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 shadow-sm p-4 hover:shadow-md transition-all duration-300",
        className,
      )}
      whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-[16px] font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          {card.title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full hover:bg-primary/10"
          onClick={() => onEnlarge(card)}
          aria-label={`Enlarge ${card.title}`}
        >
          <Maximize2 className="h-3.5 w-3.5 text-primary/70" />
        </Button>
      </div>
      <p className="text-sm text-foreground/80 mb-3 line-clamp-3">{card.description}</p>
      <div className="flex justify-end items-center mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs rounded-lg hover:bg-primary/10 text-primary/80"
          onClick={() => onEnlarge(card)}
        >
          View Details
        </Button>
      </div>
    </motion.div>
  )
}
