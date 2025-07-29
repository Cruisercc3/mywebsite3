"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, X, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface QuestionSet {
  id: string
  inputNumber: number
  originalInput: string
  questions: string[]
  timestamp: Date
}

interface AgentQuestionsViewProps {
  className?: string
  questionSets: QuestionSet[]
  onBack: () => void
  onQuestionSetSelect: (questionSet: QuestionSet) => void
}

export function AgentQuestionsView({ className, questionSets, onBack, onQuestionSetSelect }: AgentQuestionsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredQuestionSets = questionSets.filter(
    (set) =>
      set.originalInput.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.questions.some((q) => q.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Agent Questions</h2>
        <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0 rounded-full hover:bg-primary/10">
          <X className="h-4 w-4 text-primary" />
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search questions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestionSets.map((questionSet) => (
          <motion.div
            key={questionSet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => onQuestionSetSelect(questionSet)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">Input #{questionSet.inputNumber}</span>
                <span className="text-xs text-muted-foreground">{questionSet.questions.length} questions</span>
              </div>
              <p className="text-sm text-foreground line-clamp-2">{questionSet.originalInput}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{questionSet.timestamp.toLocaleDateString()}</span>
                <HelpCircle className="h-4 w-4 text-primary/70" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredQuestionSets.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? "No questions found matching your search." : "No questions generated yet."}
          </p>
        </div>
      )}
    </div>
  )
}
