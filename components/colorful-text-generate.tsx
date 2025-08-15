"use client"

import { useEffect, useMemo } from "react"
import { motion, stagger, useAnimate } from "framer-motion"

// At the top, add a consistent font configuration with tighter letter spacing
const CONSISTENT_FONT_STYLES = {
  fontFamily: "var(--font-user)",
  fontSize: "18px",
  fontWeight: "normal",
  lineHeight: "1.6",
  letterSpacing: "-0.015em", // Tighter letter spacing for more attractive look
  wordSpacing: "normal",
} as const

export function ColorfulTextGenerate({
  text,
  className = "",
  duration = 0.5,
}: {
  text: string
  className?: string
  duration?: number
}) {
  const [scope, animate] = useAnimate()

  // Optimize for large text by chunking the text into smaller segments
  // This prevents performance issues with very large text blocks
  const chunks = useMemo(() => {
    // For very large text, disable animations completely and process in larger chunks
    if (text.length > 3000) {
      // Reduced from 5000 to 3000
      return [text]
    }

    // For medium-sized text, create smaller chunks for better performance
    if (text.length > 800) {
      // Reduced from 1000 to 800
      const words = text.split(" ")
      const result = []
      let currentChunk = ""

      for (let i = 0; i < words.length; i++) {
        currentChunk += words[i] + " "

        if (i % 15 === 14 || i === words.length - 1) {
          // Reduced chunk size from 20 to 15
          result.push(currentChunk.trim())
          currentChunk = ""
        }
      }

      return result
    }

    // For smaller text, use the original word-by-word animation
    return text.split(" ")
  }, [text])

  // Optimize animation for large text
  useEffect(() => {
    // Skip animation for very large text
    if (text.length > 3000) {
      return
    }

    // Use simpler animation for medium text - EVEN FASTER
    if (text.length > 800) {
      animate("span", { opacity: 1 }, { duration: 0.05, delay: stagger(0.005, { from: "first", ease: "linear" }) })
      return
    }

    // Full animation for smaller text - FASTER
    animate(
      "span",
      { opacity: 1 },
      {
        duration: 0.1, // Further reduced
        delay: stagger(0.01), // Further reduced
      },
    )
  }, [scope.current, animate, duration, text.length])

  // Helper function to format text with paragraphs
  const formatTextWithParagraphs = (content: string) => {
    const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0)

    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, idx) => (
          <p key={idx} className="paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    )
  }

  // Render differently based on text size
  const renderContent = () => {
    // For very large text, render without animation but preserve colorful word effect
    if (text.length > 3000) {
      return (
        <div
          className="text-foreground prose-like"
          style={{ ...CONSISTENT_FONT_STYLES, textAlign: "left", whiteSpace: "pre-wrap" }}
        >
          {text.split("\n\n").map((paragraph, pIdx) => (
            <div key={`p-${pIdx}`} className="mb-4 last:mb-0">
              {paragraph.split(" ").map((word, idx) => (
                <span key={idx} className="colorful-word" style={{ ...CONSISTENT_FONT_STYLES }}>
                  {word + " "}
                </span>
              ))}
            </div>
          ))}
        </div>
      )
    }

    // For medium text, render chunks with minimal animation
    if (text.length > 800) {
      const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0)

      return (
        <motion.div ref={scope} style={{ textAlign: "left", ...CONSISTENT_FONT_STYLES }}>
          {paragraphs.map((paragraph, pIdx) => (
            <div key={`para-${pIdx}`} className="mb-4 last:mb-0">
              {paragraph.split(" ").map((word, wordIdx) => (
                <motion.span
                  key={`${pIdx}-${wordIdx}`}
                  initial={{ opacity: 0 }}
                  className="colorful-word"
                  style={{ ...CONSISTENT_FONT_STYLES }}
                >
                  {word + " "}
                </motion.span>
              ))}
            </div>
          ))}
        </motion.div>
      )
    }

    // For smaller text, use the original word-by-word animation with consistent font
    const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0)

    return (
      <motion.div ref={scope} className="space-y-4" style={{ textAlign: "left", ...CONSISTENT_FONT_STYLES }}>
        {paragraphs.map((paragraph, pIdx) => {
          const isListItem =
            paragraph.trim().startsWith("• ") || paragraph.trim().startsWith("- ") || paragraph.trim().match(/^\d+\.\s/)
          const isIndented = paragraph.startsWith("    ") || paragraph.startsWith("\t")

          return (
            <div key={`p-${pIdx}`} className={`paragraph ${isListItem ? "pl-4" : ""} ${isIndented ? "pl-6" : ""}`}>
              {paragraph.split(" ").map((word, idx) => (
                <motion.span
                  key={`${word}-${idx}-${pIdx}`}
                  className="dark:text-white text-black opacity-0 colorful-word font-user font-normal"
                  style={{
                    display: "inline",
                    transition: "color 0.3s ease",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "100%",
                    letterSpacing: "-0.015em",
                    wordSpacing: "normal",
                    ...CONSISTENT_FONT_STYLES,
                  }}
                >
                  {word + " "}
                </motion.span>
              ))}
            </div>
          )
        })}
      </motion.div>
    )
  }

  return (
    <div
      className={`${className} font-light`}
      style={{
        background: "transparent",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        maxWidth: "100%",
        overflow: "visible",
        ...CONSISTENT_FONT_STYLES,
      }}
    >
      <div
        className="mt-1"
        style={{
          background: "transparent",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          overflow: "visible",
          ...CONSISTENT_FONT_STYLES,
        }}
      >
        <div
          className="dark:text-white text-black text-[18px] leading-relaxed tracking-normal word-by-word-animation font-user font-normal"
          style={{
            background: "transparent",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            ...CONSISTENT_FONT_STYLES,
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
