"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuestionSet {
  id: string
  inputNumber: number
  originalInput: string
  questions: string[]
  timestamp: Date
}

interface QuestionDetailViewProps {
  className?: string
  questionSet: QuestionSet
  onBack: () => void
}

export function QuestionDetailView({ className, questionSet, onBack }: QuestionDetailViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questionSet.questions.length)
  }

  const prevQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev - 1 + questionSet.questions.length) % questionSet.questions.length)
  }

  return (
    <div className={cn("p-6 max-w-4xl mx-auto", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground">Input #{questionSet.inputNumber} Questions</h2>
          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1}/{questionSet.questions.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0 rounded-full hover:bg-primary/10">
          <X className="h-4 w-4 text-primary" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Original Input</h3>
          <p className="text-foreground/80 leading-relaxed">{questionSet.originalInput}</p>
          <p className="text-xs text-muted-foreground mt-3">
            Generated on {questionSet.timestamp.toLocaleDateString()} at {questionSet.timestamp.toLocaleTimeString()}
          </p>
        </div>

        <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Generated Questions
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevQuestion}
                disabled={questionSet.questions.length <= 1}
                className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                {currentQuestionIndex + 1} / {questionSet.questions.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextQuestion}
                disabled={questionSet.questions.length <= 1}
                className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[120px] flex items-center"
          >
            <p className="text-foreground leading-relaxed text-lg">{questionSet.questions[currentQuestionIndex]}</p>
          </motion.div>

          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              className="hover:bg-primary/10 bg-transparent"
              onClick={() => {
                // This would trigger asking the question in the main chat
                window.dispatchEvent(
                  new CustomEvent("ask-question", {
                    detail: { question: questionSet.questions[currentQuestionIndex] },
                  }),
                )
                onBack() // Go back to questions view
              }}
            >
              Ask This Question
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
