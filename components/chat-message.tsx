"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"
import type React from "react"
import { ChevronRight } from "lucide-react"
import { ColorfulTextGenerate } from "@/components/colorful-text-generate"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
  isInGroup?: boolean
  isFirstInGroup?: boolean
  isLastInGroup?: boolean
  isLatest?: boolean
}

interface Highlight {
  id: string
  text: string
  isAdded?: boolean
}

function ChatMessage({
  message,
  isInGroup = false,
  isFirstInGroup = false,
  isLastInGroup = false,
  isLatest = false,
}: ChatMessageProps) {
  const isUser = message.role === "user"
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [showHighlightCard, setShowHighlightCard] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [animationCompleted, setAnimationCompleted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Add a ref to track if component is mounted to prevent animation re-triggering
  const [isMounted, setIsMounted] = useState(false)
  const [animationHasPlayed, setAnimationHasPlayed] = useState(false)

  // Memoize the text content to prevent unnecessary re-renders
  const textContent = useMemo(() => message.content, [message.content])

  // Improve the selection handling to be more robust:
  const handleTextSelection = useCallback(() => {
    if (isSelecting || isUser) return

    const selection = window.getSelection()
    if (!selection || selection.toString().trim() === "" || selection.toString().length < 3) {
      return
    }

    const text = selection.toString().trim()

    // Check if this text is already highlighted
    const existingHighlight = highlights.find((h) => h.text === text)
    if (existingHighlight) {
      window.getSelection()?.removeAllRanges()
      return
    }

    setIsSelecting(true)
    setHasInteracted(true)

    // Create new highlight and dispatch event to note manager
    const newHighlight: Highlight = {
      id: Date.now().toString(),
      text,
      isAdded: false,
    }

    // Dispatch event to create highlighted card through note manager
    window.dispatchEvent(
      new CustomEvent("create-highlight", {
        detail: { highlight: newHighlight },
      }),
    )

    // Clear selection
    window.getSelection()?.removeAllRanges()

    setTimeout(() => {
      setIsSelecting(false)
    }, 300)
  }, [highlights, isSelecting, isUser])

  // Improve the mouse up handler to prevent double-click issues:
  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (isUser || isSelecting) return

      // Ignore if this is part of a double-click
      if (e.detail > 1) {
        e.preventDefault()
        return
      }

      // Clear any existing timeout
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current)
      }

      // Debounce with longer delay
      selectionTimeoutRef.current = setTimeout(() => {
        const selection = window.getSelection()
        if (selection && selection.toString().trim() !== "" && selection.toString().length >= 3) {
          handleTextSelection()
        }
      }, 150) // Increased delay
    },
    [isUser, handleTextSelection, isSelecting],
  )

  // Add double-click prevention:
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Clear any selection that might have been made
    window.getSelection()?.removeAllRanges()
  }, [])

  // Remove a highlight item
  const removeHighlightItem = useCallback((id: string) => {
    setHighlights((prev) => {
      const newHighlights = prev.filter((h) => h.id !== id)
      if (newHighlights.length === 0) {
        setShowHighlightCard(false)
      }
      return newHighlights
    })
  }, [])

  // Remove all highlights and hide card
  const removeAllHighlights = useCallback(() => {
    setHighlights([])
    setShowHighlightCard(false)
  }, [])

  // Add a function to toggle expansion
  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current)
      }
    }
  }, [])

  // Helper function to split text into words while preserving spaces
  const splitIntoWords = useCallback((text: string) => {
    return text.split(/(\s+)/).filter((part) => part.length > 0)
  }, [])

  // Improve the shouldShowAnimation logic:
  const hasHighlights = highlights.length > 0
  const shouldShowAnimation = !isUser && isLatest && !animationHasPlayed && !hasInteracted && isMounted

  // Memoize the text content - always render as plain text without any visual highlights
  const renderedText = useMemo(() => {
    // Always use ColorfulTextGenerate to preserve hover effects
    return (
      <ColorfulTextGenerate
        text={textContent}
        className="text-[18px] font-user prose-like"
        style={{
          fontSize: "18px",
          fontFamily: "var(--font-user)",
          fontWeight: "normal",
          lineHeight: "1.6",
          letterSpacing: "-0.015em",
          wordSpacing: "normal",
          textAlign: "left" as const,
          whiteSpace: "pre-wrap" as const,
          wordBreak: "break-word" as const,
          overflowWrap: "break-word" as const,
        }}
        disableAnimation={hasInteracted || !shouldShowAnimation}
      />
    )
  }, [textContent, hasInteracted, shouldShowAnimation])

  // Update the animation logic to prevent re-triggering:
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle animation completion properly:
  const handleAnimationComplete = useCallback(() => {
    setAnimationCompleted(true)
    setAnimationHasPlayed(true)
  }, [])

  // Common text styling to ensure consistency - using tighter letter spacing
  const textStyles = {
    fontSize: "18px",
    fontFamily: "var(--font-user)",
    fontWeight: "normal",
    lineHeight: "1.6",
    letterSpacing: "-0.015em", // Tighter letter spacing for more attractive look
    wordSpacing: "normal",
    textAlign: "left" as const,
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    overflowWrap: "break-word" as const,
  }

  return (
    <>
      {/* Update the message styling to remove bubble backgrounds */}
      <div
        ref={messageRef}
        className={cn(
          "flex items-start gap-2.5 p-3 transition-all duration-300 mb-2.5 w-full", // Increased gap and margins
          // Removed background styling and border radius
        )}
      >
        <div className="flex-1 space-y-0.5">
          {(isFirstInGroup || !isInGroup) && (
            <div className={cn("flex items-center gap-1 px-1.5 py-0.5", !isUser && "flex-col")}>
              {isUser ? (
                <span className="text-[8px] text-foreground/60">{message.timestamp.toLocaleTimeString()}</span>
              ) : (
                <>
                  <span className="text-[19px] text-primary font-user font-bold text-center w-full mb-1">
                    AI Response
                  </span>
                  <span className="text-[8px] text-foreground/60">{message.timestamp.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          )}
          {/* Update the AI Response text to ensure it's properly displayed in agent interpretation */}
          <div
            ref={contentRef}
            className={cn(
              "pl-17 message-content",
              isUser
                ? "text-[18px] font-user font-normal tracking-tight leading-relaxed"
                : "text-[18px] font-user font-normal tracking-tight leading-relaxed interactive-text",
            )}
            style={{
              display: "block",
              width: "100%",
              paddingLeft: "17px",
              paddingRight: "17px",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              maxWidth: "100%",
              overflow: "hidden",
              ...textStyles,
              userSelect: isUser ? "text" : "text", // Allow text selection but handle it carefully
            }}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            onSelectStartCapture={(e) => {
              // Prevent selection during animation or if already selecting
              if (shouldShowAnimation || isSelecting) {
                e.preventDefault()
              }
            }}
          >
            {isUser ? (
              <div className="flex">
                {isExpanded || message.content.split("\n").length === 1 ? (
                  <span style={textStyles}>{message.content}</span>
                ) : (
                  <span style={textStyles}>{message.content.split("\n")[0]}...</span>
                )}
                {message.content.split("\n").length > 1 && (
                  <button onClick={toggleExpand} className="ml-1 text-primary hover:text-primary/80 transition-colors">
                    <ChevronRight
                      className={`h-4 w-4 transform transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                )}
              </div>
            ) : message.role === "assistant" ? (
              // Always use consistent rendering approach with identical styling
              <div style={textStyles}>{renderedText}</div>
            ) : (
              <div style={textStyles}>
                {message.content.split("\n\n").map((paragraph, pIdx) => (
                  <div key={`p-${pIdx}`} className="mb-4 last:mb-0">
                    {paragraph}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatMessage

// Also add a named export for compatibility
export { ChatMessage }
