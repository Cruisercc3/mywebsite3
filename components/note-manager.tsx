"use client"

import { useState, useEffect } from "react"
import { StickyNote } from "@/components/sticky-note"
import { HighlightCard } from "@/components/highlight-card"
import { QuestionPopup } from "@/components/question-popup"
import { ClarificationPopup } from "@/components/clarification-popup"
import { AnimatePresence } from "framer-motion"

interface HighlightItem {
  id: string
  text: string
}

interface StickyNoteItem {
  id: string
  text: string
  isEditable: boolean
}

export function NoteManager() {
  const [stickyNotes, setStickyNotes] = useState<StickyNoteItem[]>([])
  const [highlights, setHighlights] = useState<HighlightItem[]>([])
  const [showHighlightCard, setShowHighlightCard] = useState(false)
  const [questionPopups, setQuestionPopups] = useState<{ id: string }[]>([])
  const [clarificationPopups, setClarificationPopups] = useState<{ id: string }[]>([])

  // Listen for events to create sticky notes
  useEffect(() => {
    const handleCreateStickyNote = (event: CustomEvent) => {
      const { text, isEditable = false } = event.detail || {}
      const newNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: text || "New note...",
        isEditable: isEditable,
      }
      setStickyNotes((prev) => [...prev, newNote])
    }

    const handleCreateHighlight = (event: CustomEvent) => {
      const { highlight } = event.detail
      if (highlight) {
        setHighlights((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: highlight.text,
          },
        ])
        setShowHighlightCard(true)
      }
    }

    const handleCreateBranchedHighlight = (event: CustomEvent) => {
      const { highlight } = event.detail
      if (highlight) {
        setHighlights([
          {
            id: Date.now().toString(),
            text: highlight.text,
          },
        ])
        setShowHighlightCard(true)
      }
    }

    const handleHighlightReply = (event: CustomEvent) => {
      const { highlightId, highlightText, replyText } = event.detail
      if (highlightId && replyText) {
        console.log(`Reply to highlight ${highlightId}: ${replyText}`)
        console.log(`Highlight text: ${highlightText}`)
        console.log(`Reply: ${replyText}`)
      }
    }

    const handleCreateQuestionPopup = (event: CustomEvent) => {
      const newQuestionPopup = {
        id: `question-${Date.now()}`,
      }
      setQuestionPopups((prev) => [...prev, newQuestionPopup])
    }

    const handleCreateClarificationPopup = (event: CustomEvent) => {
      const newClarificationPopup = {
        id: `clarification-${Date.now()}`,
      }
      setClarificationPopups((prev) => [...prev, newClarificationPopup])
    }

    window.addEventListener("create-sticky-note", handleCreateStickyNote as EventListener)
    window.addEventListener("create-highlight", handleCreateHighlight as EventListener)
    window.addEventListener("create-branched-highlight", handleCreateBranchedHighlight as EventListener)
    window.addEventListener("highlight-reply", handleHighlightReply as EventListener)
    window.addEventListener("create-question-popup", handleCreateQuestionPopup as EventListener)
    window.addEventListener("create-clarification-popup", handleCreateClarificationPopup as EventListener)

    return () => {
      window.removeEventListener("create-sticky-note", handleCreateStickyNote as EventListener)
      window.removeEventListener("create-highlight", handleCreateHighlight as EventListener)
      window.removeEventListener("create-branched-highlight", handleCreateBranchedHighlight as EventListener)
      window.removeEventListener("highlight-reply", handleHighlightReply as EventListener)
      window.removeEventListener("create-question-popup", handleCreateQuestionPopup as EventListener)
      window.removeEventListener("create-clarification-popup", handleCreateClarificationPopup as EventListener)
    }
  }, [])

  const handleStickyNoteTextChange = (id: string, newText: string) => {
    setStickyNotes((prev) => prev.map((note) => (note.id === id ? { ...note, text: newText } : note)))
  }

  const handleQuestionSubmit = (question: string) => {
    console.log(`Question submitted: ${question}`)
  }

  const handleClarificationSubmit = (clarification: string) => {
    console.log(`Clarification submitted: ${clarification}`)
  }

  return (
    <>
      <AnimatePresence>
        {stickyNotes.map((note) => (
          <StickyNote
            key={note.id}
            id={note.id}
            text={note.text}
            isEditable={note.isEditable}
            onClose={() => setStickyNotes((prev) => prev.filter((n) => n.id !== note.id))}
            onTextChange={handleStickyNoteTextChange}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showHighlightCard && (
          <HighlightCard
            highlights={highlights}
            onRemove={() => {
              setHighlights([])
              setShowHighlightCard(false)
            }}
            onRemoveItem={(id) => {
              setHighlights((prev) => {
                const newHighlights = prev.filter((h) => h.id !== id)
                if (newHighlights.length === 0) {
                  setShowHighlightCard(false)
                }
                return newHighlights
              })
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {questionPopups.map((popup) => (
          <QuestionPopup
            key={popup.id}
            id={popup.id}
            onClose={() => setQuestionPopups((prev) => prev.filter((p) => p.id !== popup.id))}
            onSubmit={handleQuestionSubmit}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {clarificationPopups.map((popup) => (
          <ClarificationPopup
            key={popup.id}
            id={popup.id}
            onClose={() => setClarificationPopups((prev) => prev.filter((p) => p.id !== popup.id))}
            onSubmit={handleClarificationSubmit}
          />
        ))}
      </AnimatePresence>
    </>
  )
}
