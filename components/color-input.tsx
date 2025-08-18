"use client"

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { ColorfulTextGenerate } from "@/components/colorful-text-generate"
import { HighlightCard } from "@/components/highlight-card"

type ColorInputProps = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  autoFocus?: boolean
  disabled?: boolean
}

export function ColorInput({
  value,
  onChange,
  placeholder,
  className,
  style,
  onKeyDown,
  autoFocus,
  disabled,
}: ColorInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [highlights, setHighlights] = useState<Array<{ id: string; text: string }>>([])
  const [showHighlightCard, setShowHighlightCard] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Keep font metrics tight and identical across mirror and textarea
  const tightTextStyles = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: "var(--font-inter)",
      fontSize: "18px",
      lineHeight: 1.5,
      letterSpacing: "-0.02em",
      wordSpacing: "normal",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      overflowWrap: "break-word",
    }),
    [],
  )

  // Show overlay when not focused; hide overlay when focused
  useEffect(() => {
    setShowOverlay(!isFocused)
  }, [isFocused])

  // When clicking overlay, focus textarea
  const handleOverlayMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    textareaRef.current?.focus()
  }, [])

  // Selection handling from textarea (when focused)
  const handleSelectionFromTextarea = useCallback(() => {
    if (!textareaRef.current) return
    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    if (start !== null && end !== null && end - start >= 3) {
      const selected = value.substring(start, end).trim()
      if (selected.length >= 3) {
        setHighlights([{ id: Date.now().toString(), text: selected }])
        setShowHighlightCard(true)
        // Clear native selection to avoid confusion
        try {
          window.getSelection()?.removeAllRanges()
        } catch {}
      }
    }
  }, [value])

  // Selection handling from overlay (when not focused)
  const handleMouseUpOverlay = useCallback(() => {
    const sel = window.getSelection()
    const text = sel?.toString()?.trim() || ""
    if (text.length >= 3) {
      setHighlights([{ id: Date.now().toString(), text }])
      setShowHighlightCard(true)
      try {
        window.getSelection()?.removeAllRanges()
      } catch {}
    }
  }, [])

  const handleRemoveAllHighlights = useCallback(() => {
    setHighlights([])
    setShowHighlightCard(false)
  }, [])

  const handleRemoveHighlightItem = useCallback((id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id))
    setShowHighlightCard((prev) => prev && highlights.length - 1 > 0)
  }, [highlights.length])

  return (
    <div ref={wrapperRef} className={cn("relative w-full chat-surface", className)} style={{ ...style }}>
      {/* Mirror overlay with color effect; visible when not focused */}
      {showOverlay && (
        <div
          className="absolute inset-0 pointer-events-auto"
          onMouseDown={handleOverlayMouseDown}
          onMouseUp={handleMouseUpOverlay}
          style={{ ...tightTextStyles, padding: 12, overflow: "hidden" }}
        >
          <ColorfulTextGenerate text={value || (placeholder || "")} className="font-user" duration={0} />
        </div>
      )}

      {/* Textarea, always on top; when overlay shown, make text transparent but keep caret */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={onKeyDown}
        onMouseUp={handleSelectionFromTextarea}
        disabled={disabled}
        className={cn(
          "w-full bg-background border border-primary/10 rounded-lg focus:ring-1 focus:ring-primary/30 focus:outline-none resize-none transition-all duration-300",
        )}
        style={{
          ...tightTextStyles,
          padding: 12,
          backgroundColor: "transparent",
          color: showOverlay ? "transparent" : "inherit",
          caretColor: "hsl(var(--foreground))",
          position: "relative",
        }}
        autoFocus={autoFocus}
      />

      {showHighlightCard && highlights.length > 0 && (
        <div style={{ position: "fixed", zIndex: 9999, pointerEvents: "none" }}>
          <div style={{ pointerEvents: "auto" }}>
            <HighlightCard
              highlights={highlights.map((h) => ({ id: h.id, text: h.text }))}
              onRemove={handleRemoveAllHighlights}
              onRemoveItem={handleRemoveHighlightItem}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorInput

