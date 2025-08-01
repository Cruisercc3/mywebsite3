"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { SectionHeader } from "@/components/section-header"

interface CalendarViewProps {
  className?: string
}

interface KnowledgeCardData {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  lastUpdated: string
}

// Simple KnowledgeCard component for the calendar view
function KnowledgeCard({ card, onClick }: { card: KnowledgeCardData; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 10px 30px rgba(var(--primary-rgb), 0.1)",
        borderColor: "rgba(var(--primary-rgb), 0.3)"
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary/90 transition-colors duration-300">{card.title}</h3>
          <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2">
            {card.category}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">{card.content}</p>
        <div className="flex flex-wrap gap-1">
          {card.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
              #{tag}
            </span>
          ))}
          {card.tags.length > 3 && <span className="text-xs text-muted-foreground">+{card.tags.length - 3} more</span>}
        </div>
        <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
          Updated: {card.lastUpdated}
        </p>
      </div>
      
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}

export function CalendarView({ className }: CalendarViewProps) {
  const [selectedCard, setSelectedCard] = useState<KnowledgeCardData | null>(null)

  // Sample knowledge cards data
  const knowledgeCards: KnowledgeCardData[] = [
    {
      id: "1",
      title: "Machine Learning Fundamentals",
      content:
        "Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn and make decisions from data without being explicitly programmed.",
      category: "AI/ML",
      tags: ["machine learning", "AI", "algorithms"],
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      title: "React Hooks Best Practices",
      content:
        "React Hooks provide a way to use state and lifecycle methods in functional components. Key hooks include useState, useEffect, useContext, and custom hooks.",
      category: "Development",
      tags: ["react", "hooks", "frontend"],
      lastUpdated: "2024-01-14",
    },
    {
      id: "3",
      title: "Database Optimization Techniques",
      content:
        "Database optimization involves indexing, query optimization, normalization, and proper schema design to improve performance and reduce resource usage.",
      category: "Database",
      tags: ["database", "optimization", "performance"],
      lastUpdated: "2024-01-13",
    },
    {
      id: "4",
      title: "Cybersecurity Principles",
      content:
        "Core cybersecurity principles include confidentiality, integrity, availability, authentication, authorization, and non-repudiation.",
      category: "Security",
      tags: ["security", "cybersecurity", "principles"],
      lastUpdated: "2024-01-12",
    },
  ]

  const handleCardClick = (card: KnowledgeCardData) => {
    setSelectedCard(card)
  }

  const handleCloseDetails = () => {
    setSelectedCard(null)
  }

  return (
    <div className={cn("w-full h-full relative", className)}>
      {/* Split Layout Container */}
      <div className="grid grid-cols-2 gap-8 h-full p-6">
        {/* Left Half - Agent Insights */}
        <div className="space-y-6">
          <SectionHeader 
            text="Agent Insights" 
            type="agent" 
            variant="insights"
          />
          
          <div className="grid grid-cols-1 gap-6">
            {knowledgeCards.slice(0, Math.ceil(knowledgeCards.length / 2)).map((card) => (
              <KnowledgeCard key={card.id} card={card} onClick={() => handleCardClick(card)} />
            ))}
          </div>
        </div>

        {/* Right Half - User Insights */}
        <div className="space-y-6">
          <SectionHeader 
            text="User Insights" 
            type="user" 
            variant="insights"
          />
          
          <div className="grid grid-cols-1 gap-6">
            {knowledgeCards.slice(Math.ceil(knowledgeCards.length / 2)).map((card) => (
              <KnowledgeCard key={card.id} card={card} onClick={() => handleCardClick(card)} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced Divider with Animation */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
        className="absolute left-1/2 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent transform -translate-x-1/2 origin-top"
      >
        {/* Animated orb in the middle */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary/40 rounded-full blur-sm"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"
        />
      </motion.div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.02, scale: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-primary rounded-full blur-3xl"
        />
      </div>

      {selectedCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseDetails}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-xl border border-primary/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-foreground">{selectedCard.title}</h3>
              <button
                onClick={handleCloseDetails}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                  {selectedCard.category}
                </span>
              </div>
              <p className="text-foreground leading-relaxed">{selectedCard.content}</p>
              <div className="flex flex-wrap gap-2">
                {selectedCard.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Last updated: {selectedCard.lastUpdated}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
