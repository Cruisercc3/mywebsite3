"use client"
import { useEffect } from "react"
import { motion, stagger, useAnimate } from "framer-motion"
import { cn } from "@/lib/utils"

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string
  className?: string
  filter?: boolean
  duration?: number
}) => {
  const [scope, animate] = useAnimate()
  const tokens = words.split(/(\s+)/)
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      },
    )
  }, [scope.current])

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {tokens.map((token, idx) => (
          token.trim().length > 0 ? (
            <motion.span
              key={token + idx}
              className="dark:text-white text-black opacity-0 colorful-word"
              style={{
                filter: filter ? "blur(10px)" : "none",
                fontSize: "11px",
                background: "transparent",
              }}
            >
              {token}
            </motion.span>
          ) : (
            token
          )
        ))}
      </motion.div>
    )
  }

  return (
    <div className={cn("font-light", className)} style={{ background: "transparent" }}>
      <div className="mt-1" style={{ background: "transparent" }}>
        <div
          className="dark:text-white text-black text-[11px] leading-relaxed tracking-normal word-by-word-animation"
          style={{ background: "transparent" }}
        >
          {renderWords()}
        </div>
      </div>
    </div>
  )
}
