"use client"

import { CardStack } from "./ui/card-stack"
import { cn } from "@/lib/utils"

export function CardStackCompact() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <CardStack items={CARDS} offset={8} scaleFactor={0.04} />
    </div>
  )
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({ children, className }) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className,
      )}
    >
      {children}
    </span>
  )
}

const CARDS = [
  {
    id: 0,
    name: "AI Concepts",
    designation: "Machine Learning Fundamentals",
    content: (
      <p className="text-sm">
        <Highlight>Neural Networks</Highlight> form the backbone of modern AI, enabling machines to learn from data and
        make predictions.
      </p>
    ),
  },
  {
    id: 1,
    name: "NLP Techniques",
    designation: "Language Processing",
    content: (
      <p className="text-sm">
        <Highlight>Transformers</Highlight> revolutionized natural language processing by enabling models to understand
        context and relationships between words.
      </p>
    ),
  },
  {
    id: 2,
    name: "AI Ethics",
    designation: "Responsible AI Development",
    content: (
      <p className="text-sm">
        <Highlight>Fairness</Highlight> and <Highlight>transparency</Highlight> are crucial considerations when
        developing AI systems that impact people's lives.
      </p>
    ),
  },
]
