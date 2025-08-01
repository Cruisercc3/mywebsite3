"use client"

import { motion } from "framer-motion"
import { HelpCircle, User, Bot, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionHeader } from "@/components/section-header"

interface AgentsViewProps {
  className?: string
}

interface QuestionCardData {
  id: string
  question: string
  category: string
  type: "agent" | "user"
  timestamp: string
}

function QuestionCard({ question, onClick }: { question: QuestionCardData; onClick: () => void }) {
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
          <div className="flex items-center gap-2">
            {question.type === "agent" ? (
              <Bot className="h-4 w-4 text-primary/70" />
            ) : (
              <User className="h-4 w-4 text-primary/70" />
            )}
            <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
              {question.category}
            </span>
          </div>
          <MessageSquare className="h-4 w-4 text-primary/50" />
        </div>
        <h3 className="text-sm font-medium text-foreground line-clamp-3 group-hover:text-primary/90 transition-colors duration-300">
          {question.question}
        </h3>
        <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
          Asked: {question.timestamp}
        </p>
      </div>
      
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}

export function AgentsView({ className }: AgentsViewProps) {
  const agentQuestions: QuestionCardData[] = [
    {
      id: "aq1",
      question: "Can you help me analyze the performance metrics from our latest marketing campaign?",
      category: "Analysis",
      type: "agent",
      timestamp: "2024-01-15",
    },
    {
      id: "aq2",
      question: "What are the best practices for implementing machine learning in a small business?",
      category: "Strategy",
      type: "agent",
      timestamp: "2024-01-14",
    },
    {
      id: "aq3",
      question: "How can I optimize my database queries for better performance?",
      category: "Technical",
      type: "agent",
      timestamp: "2024-01-13",
    },
    {
      id: "aq4",
      question: "What creative writing techniques work best for engaging content?",
      category: "Creative",
      type: "agent",
      timestamp: "2024-01-12",
    },
  ]

  const userQuestions: QuestionCardData[] = [
    {
      id: "uq1",
      question: "How do I set up automated testing for my web application?",
      category: "Development",
      type: "user",
      timestamp: "2024-01-15",
    },
    {
      id: "uq2",
      question: "What's the difference between supervised and unsupervised learning?",
      category: "Learning",
      type: "user",
      timestamp: "2024-01-14",
    },
    {
      id: "uq3",
      question: "Can you explain RESTful API design principles?",
      category: "Technical",
      type: "user",
      timestamp: "2024-01-13",
    },
    {
      id: "uq4",
      question: "How should I structure my project management workflow?",
      category: "Management",
      type: "user",
      timestamp: "2024-01-12",
    },
  ]

  const handleQuestionClick = (question: QuestionCardData) => {
    // Handle question click - could open a detailed view or start a conversation
    console.log("Question clicked:", question)
  }

  return (
    <div className={cn("w-full h-full relative", className)}>
      {/* Split Layout Container */}
      <div className="grid grid-cols-2 gap-8 h-full p-6">
        {/* Left Half - Agent Questions */}
        <div className="space-y-6">
          <SectionHeader 
            text="Agent Questions" 
            type="agent" 
            variant="questions"
          />
          
          <div className="grid grid-cols-1 gap-6">
            {agentQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} onClick={() => handleQuestionClick(question)} />
            ))}
          </div>
        </div>

        {/* Right Half - User Questions */}
        <div className="space-y-6">
          <SectionHeader 
            text="User Questions" 
            type="user" 
            variant="questions"
          />
          
          <div className="grid grid-cols-1 gap-6">
            {userQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} onClick={() => handleQuestionClick(question)} />
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
    </div>
  )
}
