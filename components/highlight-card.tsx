"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  X,
  GripVertical,
  MessageSquare,
  Lightbulb,
  Plus,
  GitBranch,
  ArrowRight,
  Maximize2,
  Minimize2,
  Archive,
  StickyNote,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface HighlightItem {
  id: string
  text: string
  isAdded?: boolean
}

interface HighlightCardProps {
  highlights: HighlightItem[]
  onRemove: () => void
  onRemoveItem: (id: string) => void
}

export function HighlightCard({ highlights, onRemove, onRemoveItem }: HighlightCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dimensions, setDimensions] = useState<{ width: number; height: number | string }>({
    width: 256,
    height: "auto",
  })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [preMaximizeDimensions, setPreMaximizeDimensions] = useState({ width: 256, height: 300 })

  const cardRef = useRef<HTMLDivElement>(null)
  const initialResizePos = useRef({ x: 0, y: 0 })
  const initialDimensions = useRef({ width: 256, height: 300 })

  const [showQuestionInput, setShowQuestionInput] = useState(false)
  const [questionText, setQuestionText] = useState("")
  const [isQuestionInputExpanded, setIsQuestionInputExpanded] = useState(false)
  const questionInputRef = useRef<HTMLTextAreaElement>(null)
  const [questionResponses, setQuestionResponses] = useState<{ id: string; text: string }[]>([])
  const [showAddInput, setShowAddInput] = useState(false)
  const [addText, setAddText] = useState("")
  const [highlightStates, setHighlightStates] = useState<Record<string, boolean>>({})

  // Set initial position near the selection
  useEffect(() => {
    if (cardRef.current && position.x === 0 && position.y === 0) {
      const rect = cardRef.current.getBoundingClientRect()
      setPosition({
        x: window.innerWidth / 2 - rect.width / 2,
        y: window.innerHeight / 2 - rect.height / 2,
      })
    }
  }, [position.x, position.y])

  // Initialize highlight states
  useEffect(() => {
    const initialStates: Record<string, boolean> = {}
    highlights.forEach((highlight) => {
      initialStates[highlight.id] = highlight.isAdded || false
    })
    setHighlightStates(initialStates)
  }, [highlights])

  const handleResizeStart = (direction: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setResizeDirection(direction)
    initialResizePos.current = { x: e.clientX, y: e.clientY }
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      initialDimensions.current = { width: rect.width, height: rect.height }
      setDimensions({ width: rect.width, height: rect.height })
    }

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
      newWidth = Math.max(200, initialDimensions.current.width + deltaX)
    }
    if (resizeDirection?.includes("left")) {
      newWidth = Math.max(200, initialDimensions.current.width - deltaX)
      setPosition((prev) => ({
        x: prev.x + initialDimensions.current.width - newWidth,
        y: prev.y,
      }))
    }
    if (resizeDirection?.includes("bottom")) {
      newHeight = Math.max(150, initialDimensions.current.height + deltaY)
    }
    if (resizeDirection?.includes("top")) {
      newHeight = Math.max(150, initialDimensions.current.height - deltaY)
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

  const handleMaximize = () => {
    if (isExpanded) {
      setDimensions(preMaximizeDimensions)
    } else {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        setPreMaximizeDimensions({ width: rect.width, height: rect.height })
      }
      const maxWidth = Math.min(900, window.innerWidth * 0.8)
      const maxHeight = Math.min(700, window.innerHeight * 0.8)
      setDimensions({ width: maxWidth, height: maxHeight })
      setPosition({
        x: (window.innerWidth - maxWidth) / 2,
        y: (window.innerHeight - maxHeight) / 2,
      })
    }
    setIsExpanded(!isExpanded)
  }

  const handleQuestionSubmit = () => {
    if (!questionText.trim()) return
    const newQuestion = { id: Date.now().toString(), text: questionText }
    setQuestionResponses((prev) => [...prev, newQuestion])
    window.dispatchEvent(
      new CustomEvent("highlight-reply", {
        detail: {
          highlightId: highlights[0]?.id,
          highlightText: highlights.map((h) => h.text).join("\n\n"),
          replyText: questionText,
          inCard: true,
        },
      }),
    )
    setQuestionText("")
    setIsQuestionInputExpanded(false)
  }

  const handleAddSubmit = () => {
    if (!addText.trim()) return
    window.dispatchEvent(
      new CustomEvent("add-to-context", {
        detail: {
          highlightId: highlights[0]?.id,
          highlightText: highlights.map((h) => h.text).join("\n\n"),
          addText,
        },
      }),
    )
    setAddText("")
    setShowAddInput(false)
  }

  const convertToStickyNote = (highlightItem: HighlightItem) => {
    window.dispatchEvent(
      new CustomEvent("create-sticky-note", {
        detail: { text: highlightItem.text, isEditable: true },
      }),
    )
    onRemoveItem(highlightItem.id)
  }

  const convertAllToStickyNote = () => {
    const allText = highlights.map((h) => h.text).join("\n\n• ")
    window.dispatchEvent(
      new CustomEvent("create-sticky-note", {
        detail: { text: allText.startsWith("• ") ? allText : `• ${allText}`, isEditable: true },
      }),
    )
    onRemove()
  }

  const handleStoreHighlight = () => {
    const allText = highlights.map((h) => h.text).join("\n\n")
    window.dispatchEvent(
      new CustomEvent("store-highlight", {
        detail: { highlightId: highlights[0]?.id, highlightText: allText },
      }),
    )
    onRemove()
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y,
        width: dimensions.width,
        height: dimensions.height,
      }}
      transition={{ duration: 0.2, ease: "circOut" }}
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
        "fixed top-0 left-0 z-50 flex flex-col rounded-lg border border-primary/20 bg-background/95 backdrop-blur-sm shadow-md",
        isDragging && "shadow-lg cursor-grabbing",
        isResizing && "pointer-events-none",
      )}
      style={{ touchAction: "none" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-primary/10 bg-primary/5 rounded-t-lg flex-shrink-0">
        <div className="flex items-center gap-1">
          <GripVertical className="h-3.5 w-3.5 text-primary/70 cursor-grab" />
          <span className="text-xs font-medium text-primary/80">Highlighted Text</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={convertAllToStickyNote}
                  className="ml-1 flex items-center justify-center h-5 w-5 rounded-full hover:bg-primary/10 text-primary/70"
                  title="Convert all to sticky note"
                >
                  <StickyNote className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[9px] p-2 max-w-[150px]">
                <p>Convert all to sticky note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleMaximize}
            className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-primary/10 text-primary/70 mr-1"
          >
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </button>
          <button
            onClick={onRemove}
            className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-primary/10 text-primary/70"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={cn("flex-grow flex flex-col overflow-hidden", isExpanded ? "p-4" : "p-3")}>
        <div
          className={cn(
            "bg-primary/5 p-2 rounded-md mb-1 overflow-y-auto",
            isExpanded ? "text-sm" : "text-xs max-h-40",
          )}
        >
          {highlights.map((highlight, index) => (
            <div key={highlight.id} className="highlight-item mb-2 last:mb-0">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <button
                    onClick={() => {
                      const newHighlight = { ...highlight }
                      onRemoveItem(highlight.id)
                      window.dispatchEvent(
                        new CustomEvent("create-branched-highlight", {
                          detail: { highlight: newHighlight },
                        }),
                      )
                    }}
                    className="mr-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-primary/10 text-primary/70 flex-shrink-0 mt-1"
                  >
                    <GitBranch className={cn("h-3 w-3", isExpanded && "h-3.5 w-3.5")} />
                  </button>
                  <button
                    onClick={() => convertToStickyNote(highlight)}
                    className="mr-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-primary/10 text-primary/70 flex-shrink-0 mt-1"
                    title="Convert to sticky note"
                  >
                    <StickyNote className={cn("h-3 w-3", isExpanded && "h-3.5 w-3.5")} />
                  </button>
                  <div className={cn("colorful-text", highlightStates[highlight.id] ? "text-primary font-medium" : "")}>
                    {highlight.text}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(highlight.id)}
                  className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-primary/10 text-primary/50 flex-shrink-0"
                >
                  <X className="h-2 w-2" />
                </button>
              </div>
              {index < highlights.length - 1 && <div className="border-t border-primary/10 my-2"></div>}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-1 flex-shrink-0">
          <div className="flex items-center gap-1">
            {[
              {
                label: "Add",
                icon: Plus,
                tooltip: "Add to context",
                onClick: () => {
                  setShowAddInput(true)
                  const newStates = { ...highlightStates }
                  highlights.forEach((h) => (newStates[h.id] = true))
                  setHighlightStates(newStates)
                  highlights.forEach((h) =>
                    window.dispatchEvent(
                      new CustomEvent("highlight-added-to-context", {
                        detail: { highlightId: h.id, text: h.text },
                      }),
                    ),
                  )
                },
              },
              {
                label: "Question",
                icon: MessageSquare,
                tooltip: "Ask a question about this text",
                onClick: () => setShowQuestionInput(!showQuestionInput),
              },
              {
                label: "New",
                icon: Lightbulb,
                tooltip: "Create new chat with this text",
                onClick: () => {},
              },
              {
                label: "Storage",
                icon: Archive,
                tooltip: "Store this text",
                onClick: handleStoreHighlight,
              },
            ].map(({ label, icon: Icon, tooltip, onClick }) => (
              <TooltipProvider key={label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onClick}
                      className={cn(
                        "flex items-center gap-1 px-1.5 py-1 rounded-md hover:bg-primary/10 text-primary/80",
                        isExpanded ? "text-xs" : "text-[10px]",
                      )}
                    >
                      <Icon className={cn("flex-shrink-0", isExpanded ? "h-3.5 w-3.5" : "h-3 w-3")} />
                      <span>{label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-[9px] p-2 max-w-[150px]">
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Input areas */}
        <div className="overflow-y-auto mt-2 flex-shrink-0">
          {showAddInput && (
            <div className="mt-3 pt-2 border-t border-primary/10">
              <div className="relative">
                <textarea
                  value={addText}
                  onChange={(e) => setAddText(e.target.value)}
                  placeholder="Add additional context..."
                  className={cn(
                    "w-full p-2 bg-background border border-primary/10 rounded-lg focus:ring-1 focus:ring-primary/30 focus:outline-none font-user resize-none transition-all duration-300 min-h-[40px]",
                    isExpanded ? "text-sm" : "text-[11px]",
                  )}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleAddSubmit())}
                  autoFocus
                />
                <Button
                  onClick={handleAddSubmit}
                  className="absolute bottom-1 right-1 rounded-full bg-primary hover:bg-primary/90 shadow-sm h-5 w-5 p-0 flex items-center justify-center"
                  disabled={!addText.trim()}
                >
                  <ArrowRight className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          )}

          {showQuestionInput && (
            <div className="mt-3 pt-2 border-t border-primary/10">
              <div className="relative">
                <textarea
                  ref={questionInputRef}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Ask a question about this text..."
                  className={cn(
                    "w-full p-2 bg-background border border-primary/10 rounded-lg focus:ring-1 focus:ring-primary/30 focus:outline-none font-user resize-none transition-all duration-300",
                    isExpanded ? "min-h-[80px] text-sm" : "min-h-[40px] text-[11px]",
                  )}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleQuestionSubmit())}
                  autoFocus
                />
                <Button
                  onClick={handleQuestionSubmit}
                  className="absolute bottom-1 right-1 rounded-full bg-primary hover:bg-primary/90 shadow-sm h-5 w-5 p-0 flex items-center justify-center"
                  disabled={!questionText.trim()}
                >
                  <ArrowRight className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          )}

          {questionResponses.length > 0 && (
            <div className="mt-3 pt-2 border-t border-primary/10">
              <div className={cn("font-medium text-primary/80 mb-2", isExpanded ? "text-sm" : "text-xs")}>
                Questions:
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {questionResponses.map((response) => (
                  <div
                    key={response.id}
                    className={cn("p-2 bg-primary/5 rounded-md", isExpanded ? "text-sm" : "text-xs")}
                  >
                    {response.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resize handles */}
      {!isExpanded && (
        <>
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
        </>
      )}
    </motion.div>
  )
}
