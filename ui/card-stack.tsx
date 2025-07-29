"\"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { cn } from "@/lib/utils"

export const CardStack = ({ items, offset = 10, scaleFactor = 0.06 }) => {
  const [cards, setCards] = useState(items)

  useEffect(() => {
    setCards(items)
  }, [items])

  const moveToEnd = (from) => {
    setCards((prevCards) => {
      const newArray = [...prevCards]
      const item = newArray.splice(from, 1)[0]
      newArray.push(item)
      return newArray
    })
  }

  return (
    <MotionConfig transition={{ duration: 0.5, type: "spring" }}>
      <div className="relative h-60 w-full max-w-sm">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {
            const canDrag = index === 0

            return (
              <motion.div
                key={card.id}
                className={cn(
                  "absolute h-60 w-full select-none rounded-2xl border border-primary/10 bg-background/80 backdrop-blur-sm p-6 shadow-xl",
                  index === 0 ? "cursor-grab active:cursor-grabbing" : "cursor-default",
                )}
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                  transformOrigin: "top center",
                }}
                animate={{
                  top: index * offset,
                  scale: 1 - index * scaleFactor,
                  zIndex: cards.length - index,
                }}
                drag={canDrag ? "y" : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 100) {
                    moveToEnd(0)
                  }
                }}
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="mb-4">{card.content}</div>
                  <div>
                    <p className="text-base font-medium text-primary">{card.name}</p>
                    <p className="text-sm text-primary/70">{card.designation}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
