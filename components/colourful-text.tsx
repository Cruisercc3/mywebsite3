"use client"

export function ColourfulText({
  text,
  className = "",
}: {
  text: string
  className?: string
}) {
  // Split text into words
  const wordsAndSpaces = text.split(/(\s+)/)

  return (
    <div className={`${className} word-by-word-animation`} style={{ fontSize: "11px", lineHeight: "1.5" }}>
      {wordsAndSpaces.map((token, index) => (
        token.trim().length > 0 ? (
          <span key={index} className="colorful-word" style={{ fontSize: "11px" }}>
            {token}
          </span>
        ) : (
          token
        )
      ))}
    </div>
  )
}
