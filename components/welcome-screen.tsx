"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ForceGraph } from "@/components/force-graph"

interface WelcomeScreenProps {
  input: string
  setInput: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export function WelcomeScreen({ input, setInput, handleSubmit, isLoading }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Welcome message on the left with input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:w-1/2 p-4 welcome-container bg-secondary/30 rounded-xl"
        >
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
            <div className="max-w-md space-y-2.5">
              <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Welcome to AI Chat
              </h2>
              <p className="text-xs">
                Ask me anything and I'll do my best to help you. I can assist with information, answer questions, or
                just chat about topics you're interested in.
              </p>
              <div className="pt-2">
                <p className="text-[10px] text-primary/70">Try asking about:</p>
                <ul className="text-[10px] text-primary/60 space-y-1 pt-1">
                  <li>• Machine learning concepts</li>
                  <li>• Natural language processing</li>
                  <li>• AI development and applications</li>
                  <li>• Or anything else you're curious about!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Input attached to welcome section */}
          <div className="mt-4 border-t pt-3 pb-1 bg-gradient-to-r from-primary/5 to-secondary rounded-lg">
            <form onSubmit={handleSubmit} className="flex space-x-1.5">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full font-extralight text-[11px] border-primary/20 focus-visible:ring-primary/30 shadow-sm h-7 font-user"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-full bg-primary hover:bg-primary/90 shadow-md transition-all duration-300 hover:scale-105 h-7 w-7 p-0"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-3 w-3" />
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Force graph on the right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center md:w-1/2 p-2"
        >
          <ForceGraph />
        </motion.div>
      </div>
    </div>
  )
}
