"use client"
import { motion } from "framer-motion"

export function ColourfulText({
  text,
  className = "",
}: {
  text: string
  className?: string
}) {
  const colors = [
    "rgb(131, 179, 32)",
    "rgb(47, 195, 106)",
    "rgb(42, 169, 210)",
    "rgb(4, 112, 202)",
    "rgb(107, 10, 255)",
    "rgb(183, 0, 218)",
    "rgb(218, 0, 171)",
    "rgb(230, 64, 92)",
    "rgb(232, 98, 63)",
    "rgb(249, 129, 47)",
  ]

  // Split text into words
  const wordsAndSpaces = text.split(/(\s+)/)

  // Simple fade-in animation for text appearance
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${className} word-by-word-animation`}
      style={{ fontSize: "11px", lineHeight: "1.5", background: "transparent" }}
    >
      {wordsAndSpaces.map((token, index) => (
        token.trim().length > 0 ? (
          <span
            key={index}
            className="colorful-word"
            style={{ fontSize: "11px", background: "transparent" }}
          >
            {token}
          </span>
        ) : (
          token
        )
      ))}
    </motion.div>
  )
}
