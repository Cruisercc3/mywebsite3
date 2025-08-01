"use client"

export function ColourfulText({
  text,
  className = "",
}: {
  text: string
  className?: string
}) {
  // Split text into words
  const words = text.split(/(\s+)/).filter((word) => word.trim().length > 0)

  return (
    <div className={`${className} word-by-word-animation`} style={{ fontSize: "11px", lineHeight: "1.5" }}>
      {words.map((word, index) => (
        <span key={index} className="colorful-word" style={{ fontSize: "11px", marginRight: "0.25em" }}>
          {word}
        </span>
      ))}
    </div>
  )
}
