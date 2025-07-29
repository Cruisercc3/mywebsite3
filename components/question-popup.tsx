"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, GripVertical, ArrowRight, Maximize2, Minimize2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface QuestionPopupProps {
  id: string
  onClose: () => void
  onSubmit: (question: string) => void
}

export function QuestionPopup({ id, onClose, onSubmit }: QuestionPopupProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const initialResizePos = useRef({ x: 0, y: 0 })
  const initialDimensions = useRef({ width: 400, height: 300 })

  // Set initial position in the center of the screen
  useEffect(() => {
    if (popupRef.current && position.x === 0 && position.y === 0) {
      const rect = popupRef.current.getBoundingClientRect()
      setPosition({
        x: window.innerWidth / 2 - rect.width / 2,
        y: window.innerHeight / 2 - rect.height / 2,
      })
    }
  }, [position.x, position.y])

  const handleSubmit = () => {
    if (!inputText.trim()) return

    // Simulate AI response
    const response = `Answer to your question: "${inputText}": This is a simulated response that would provide an answer to your query. In a real implementation, this would connect to an AI model to generate a helpful response.`
    setOutputText(response)

    onSubmit(inputText)
  }

  const handleResizeStart = (direction: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setResizeDirection(direction)
    initialResizePos.current = { x: e.clientX, y: e.clientY }
    initialDimensions.current = { ...dimensions } as { width: number; height: number }

    // Add event listeners for resize
    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - initialResizePos.current.x
    const deltaY = e.clientY - initialResizePos.current.y

    let newWidth = initialDimensions.current.width
    let newHeight = initialDimensions.current.height

    if (resizeDirection?.includes("right")) {
      newWidth = Math.max(300, initialDimensions.current.width + deltaX)
    }
    if (resizeDirection?.includes("left")) {
      newWidth = Math.max(300, initialDimensions.current.width - deltaX)
      // Update position when resizing from left
      setPosition((prev) => ({
        x: prev.x + initialDimensions.current.width - newWidth,
        y: prev.y,
      }))
    }
    if (resizeDirection?.includes("bottom")) {
      newHeight = Math.max(200, initialDimensions.current.height + deltaY)
    }
    if (resizeDirection?.includes("top")) {
      newHeight = Math.max(200, initialDimensions.current.height - deltaY)
      // Update position when resizing from top
      setPosition((prev) => ({
        x: prev.x,
        y: prev.y + initialDimensions.current.height - newHeight,
      }))
    }

    setDimensions({ width: newWidth, height: newHeight })
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
    setResizeDirection(null)
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
  }

  return (
    <motion.div
      ref={popupRef}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        x: position.x,
        y: position.y,
      }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      drag={!isResizing}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false)
        setPosition((prev) => ({
          x: prev.x + info.offset.x,
          y: prev.y + info.offset.y,
        }))
      }}
      className={cn(
        "fixed top-0 left-0 z-50 rounded-lg border border-purple-400/50 bg-purple-50/95 dark:bg-purple-900/30 backdrop-blur-sm shadow-lg",
        isDragging && "shadow-xl cursor-grabbing",
        isResizing && "pointer-events-none",
      )}
      style={{
        touchAction: "none",
        width: isExpanded ? `${Math.min(800, window.innerWidth * 0.8)}px` : `${dimensions.width}px`,
        height: isExpanded ? `${Math.min(600, window.innerHeight * 0.8)}px` : `${dimensions.height}px`,
      }}
    >
      {/* Header with drag handle */}
      <div className="flex items-center justify-between p-2 border-b border-purple-400/20 bg-purple-100/50 dark:bg-purple-800/20 rounded-t-lg">
        <div className="flex items-center gap-1">
          <GripVertical className="h-3.5 w-3.5 text-purple-700/70 dark:text-purple-300/70 cursor-grab" />
          <span className="text-xs font-medium text-purple-700/80 dark:text-purple-300/80">Question</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-purple-200/50 dark:hover:bg-purple-700/30 text-purple-700/70 dark:text-purple-300/70 mr-1"
          >
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </button>
          <button
            onClick={onClose}
            className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-purple-200/50 dark:hover:bg-purple-700/30 text-purple-700/70 dark:text-purple-300/70"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-[calc(100%-40px)]">
        {/* Input area - 50% height */}
        <div className="p-3 h-1/2 border-b border-purple-400/20">
          <div className="relative h-full">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question here..."
              className="w-full h-full bg-transparent border-none focus:ring-0 focus:outline-none text-base font-medium text-purple-800 dark:text-purple-200 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              autoFocus
            />
            <Button
              onClick={handleSubmit}
              className="absolute bottom-2 right-2 rounded-full bg-purple-600 hover:bg-purple-700 shadow-sm h-8 w-8 p-0 flex items-center justify-center transition-all duration-300 hover:shadow-md"
              disabled={!inputText.trim()}
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>

        {/* Output area - 50% height */}
        <div className="p-3 h-1/2 overflow-y-auto">
          {outputText ? (
            <div className="text-base font-medium text-purple-800 dark:text-purple-200 whitespace-pre-wrap break-words">
              {outputText}
            </div>
          ) : (
            <div className="text-sm text-purple-600/70 dark:text-purple-400/70 italic">
              Answer will appear here after you submit your question.
            </div>
          )}
        </div>
      </div>

      {/* Resize handles */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => handleResizeStart("bottom-right", e)}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
        onMouseDown={(e) => handleResizeStart("bottom-left", e)}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
        onMouseDown={(e) => handleResizeStart("top-right", e)}
      />
      <div
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
        onMouseDown={(e) => handleResizeStart("top-left", e)}
      />
      <div
        className="absolute top-1/2 right-0 w-2 h-8 -translate-y-1/2 cursor-e-resize"
        onMouseDown={(e) => handleResizeStart("right", e)}
      />
      <div
        className="absolute top-1/2 left-0 w-2 h-8 -translate-y-1/2 cursor-w-resize"
        onMouseDown={(e) => handleResizeStart("left", e)}
      />
      <div
        className="absolute bottom-0 left-1/2 h-2 w-8 -translate-x-1/2 cursor-s-resize"
        onMouseDown={(e) => handleResizeStart("bottom", e)}
      />
      <div
        className="absolute top-0 left-1/2 h-2 w-8 -translate-x-1/2 cursor-n-resize"
        onMouseDown={(e) => handleResizeStart("top", e)}
      />
    </motion.div>
  )
}
