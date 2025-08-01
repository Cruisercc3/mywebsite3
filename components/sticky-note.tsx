"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, GripVertical, Edit, Check, Maximize2, Minimize2, Send } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StickyNoteProps {
  id: string
  text: string
  isEditable?: boolean
  onClose: () => void
  onTextChange?: (id: string, newText: string) => void
  onSendToNotes?: (id: string, text: string) => void
  initialPosition?: { x: number; y: number }
}

export function StickyNote({ id, text, isEditable = false, onClose, onTextChange, onSendToNotes, initialPosition }: StickyNoteProps) {
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isEditing, setIsEditing] = useState(isEditable && !text)
  const [noteText, setNoteText] = useState(text)
  const [dimensions, setDimensions] = useState({ width: 288, height: 300 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const noteRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const initialResizePos = useRef({ x: 0, y: 0 })
  const initialDimensions = useRef({ width: 288, height: 300 })

  // Set initial position in the center of the screen if not provided
  useEffect(() => {
    if (noteRef.current && position.x === 0 && position.y === 0) {
      const rect = noteRef.current.getBoundingClientRect()
      setPosition({
        x: window.innerWidth / 2 - rect.width / 2,
        y: window.innerHeight / 2 - rect.height / 2,
      })
    }
  }, [position.x, position.y])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteText(e.target.value)
  }

  const saveChanges = () => {
    setIsEditing(false)
    if (onTextChange) {
      onTextChange(id, noteText)
    }
  }

  const handleSendToNotes = () => {
    if (noteText.trim()) {
      // Dispatch event to the notes storage
      window.dispatchEvent(
        new CustomEvent("sticky-note-to-storage", {
          detail: { id, text: noteText }
        })
      )
      
      // Call the callback if provided
      if (onSendToNotes) {
        onSendToNotes(id, noteText)
      }
      
      // Optional: close the sticky note after sending
      // onClose()
    }
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
      newWidth = Math.max(200, initialDimensions.current.width + deltaX)
    }
    if (resizeDirection?.includes("left")) {
      newWidth = Math.max(200, initialDimensions.current.width - deltaX)
      // Update position when resizing from left
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

  const handleMaximize = () => {
    if (isExpanded) {
      setDimensions({ width: 288, height: 300 })
      const centerX = window.innerWidth / 2 - 144
      const centerY = window.innerHeight / 2 - 150
      setPosition({ x: centerX, y: centerY })
    } else {
      const maxWidth = Math.min(800, window.innerWidth * 0.8)
      const maxHeight = Math.min(600, window.innerHeight * 0.8)
      setDimensions({ width: maxWidth, height: maxHeight })
      setPosition({
        x: (window.innerWidth - maxWidth) / 2,
        y: (window.innerHeight - maxHeight) / 2,
      })
    }
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  return (
    <motion.div
      ref={noteRef}
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
        "fixed top-0 left-0 z-50 rounded-lg border border-yellow-400/50 bg-yellow-50/95 dark:bg-yellow-900/30 backdrop-blur-sm shadow-lg",
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
      <div className="flex items-center justify-between p-2 border-b border-yellow-400/20 bg-yellow-100/50 dark:bg-yellow-800/20 rounded-t-lg">
        <div className="flex items-center gap-1">
          <GripVertical className="h-3.5 w-3.5 text-yellow-700/70 dark:text-yellow-300/70 cursor-grab" />
          <span className="text-xs font-medium text-yellow-700/80 dark:text-yellow-300/80">Sticky Note</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleSendToNotes}
            className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-yellow-200/50 dark:hover:bg-yellow-700/30 text-yellow-700/70 dark:text-yellow-300/70 mr-1"
            title="Send to Notes"
            disabled={!noteText.trim()}
          >
            <Send className="h-3 w-3" />
          </button>
          {isEditable && (
            <button
              onClick={() => (isEditing ? saveChanges() : setIsEditing(true))}
              className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-yellow-200/50 dark:hover:bg-yellow-700/30 text-yellow-700/70 dark:text-yellow-300/70 mr-1"
            >
              {isEditing ? <Check className="h-3 w-3" /> : <Edit className="h-3 w-3" />}
            </button>
          )}
          <button
            onClick={handleMaximize}
            className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-yellow-200/50 dark:hover:bg-yellow-700/30 text-yellow-700/70 dark:text-yellow-300/70 mr-1"
          >
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </button>
          <button
            onClick={onClose}
            className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-yellow-200/50 dark:hover:bg-yellow-700/30 text-yellow-700/70 dark:text-yellow-300/70"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-[calc(100%-40px)]">
        <div className="p-3 h-full overflow-y-auto">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={noteText}
              onChange={handleTextChange}
              className="w-full h-full bg-transparent border-none focus:ring-0 focus:outline-none text-base font-medium text-yellow-800 dark:text-yellow-200 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  saveChanges()
                }
                if (e.key === "Enter" && e.ctrlKey) {
                  saveChanges()
                }
              }}
              autoFocus
            />
          ) : (
            <div
              className="text-base font-medium text-yellow-800 dark:text-yellow-200 whitespace-pre-wrap break-words cursor-text"
              onClick={() => isEditable && setIsEditing(true)}
            >
              {noteText || "Click to add a note..."}
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
