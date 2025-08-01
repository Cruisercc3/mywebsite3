"use client"

import { motion } from "framer-motion"
import { HelpCircle, User, Bot, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
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
        <h3 className="text-sm font-medium text-foreground line-clamp-3">{question.question}</h3>
        <p className="text-xs text-muted-foreground">Asked: {question.timestamp}</p>
      </div>
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Agent Questions</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {agentQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} onClick={() => handleQuestionClick(question)} />
            ))}
          </div>
        </div>

        {/* Right Half - User Questions */}
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">User Questions</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {userQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} onClick={() => handleQuestionClick(question)} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Subtle Divider */}
      <div className="absolute left-1/2 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent transform -translate-x-1/2"></div>
    </div>
  )
}
