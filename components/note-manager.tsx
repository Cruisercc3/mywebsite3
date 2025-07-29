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

interface BranchedHighlight {
  id: string
  items: HighlightItem[]
}

interface StickyNoteItem {
  id: string
  text: string
  isEditable: boolean
}

export function NoteManager() {
  const [stickyNotes, setStickyNotes] = useState<StickyNoteItem[]>([])
  const [branchedHighlights, setBranchedHighlights] = useState<BranchedHighlight[]>([])
  const [questionPopups, setQuestionPopups] = useState<{ id: string }[]>([])
  const [clarificationPopups, setClarificationPopups] = useState<{ id: string }[]>([])

  // Listen for events to create sticky notes
  useEffect(() => {
    const handleCreateStickyNote = (event: CustomEvent) => {
      const { text, isEditable = false } = event.detail || {}
      const newNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More unique ID
        text: text || "New note...",
        isEditable: isEditable,
      }
      setStickyNotes((prev) => [...prev, newNote])
    }

    // Listen for events to create branched highlights
    const handleCreateBranchedHighlight = (event: CustomEvent) => {
      const { highlight } = event.detail
      if (highlight) {
        const newBranchedHighlight = {
          id: `branched-${Date.now()}`,
          items: [highlight],
        }
        setBranchedHighlights((prev) => [...prev, newBranchedHighlight])
      }
    }

    // Listen for highlight replies
    const handleHighlightReply = (event: CustomEvent) => {
      const { highlightId, highlightText, replyText } = event.detail
      if (highlightId && replyText) {
        // Here you would typically handle the reply in your chat system
        console.log(`Reply to highlight ${highlightId}: ${replyText}`)

        // For now, we'll just log it
        console.log(`Highlight text: ${highlightText}`)
        console.log(`Reply: ${replyText}`)
      }
    }

    // Listen for question popup creation
    const handleCreateQuestionPopup = (event: CustomEvent) => {
      const newQuestionPopup = {
        id: `question-${Date.now()}`,
      }
      setQuestionPopups((prev) => [...prev, newQuestionPopup])
    }

    // Listen for clarification popup creation
    const handleCreateClarificationPopup = (event: CustomEvent) => {
      const newClarificationPopup = {
        id: `clarification-${Date.now()}`,
      }
      setClarificationPopups((prev) => [...prev, newClarificationPopup])
    }

    window.addEventListener("create-sticky-note", handleCreateStickyNote as EventListener)
    window.addEventListener("create-branched-highlight", handleCreateBranchedHighlight as EventListener)
    window.addEventListener("highlight-reply", handleHighlightReply as EventListener)
    window.addEventListener("create-question-popup", handleCreateQuestionPopup as EventListener)
    window.addEventListener("create-clarification-popup", handleCreateClarificationPopup as EventListener)

    return () => {
      window.removeEventListener("create-sticky-note", handleCreateStickyNote as EventListener)
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
    // Here you would typically handle the question submission
    console.log(`Question submitted: ${question}`)
  }

  const handleClarificationSubmit = (clarification: string) => {
    // Here you would typically handle the clarification submission
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
        {branchedHighlights.map((branched) => (
          <HighlightCard
            key={branched.id}
            highlights={branched.items}
            onRemove={() => setBranchedHighlights((prev) => prev.filter((b) => b.id !== branched.id))}
            onRemoveItem={(id) => {
              setBranchedHighlights((prev) =>
                prev
                  .map((b) => {
                    if (b.id === branched.id) {
                      return {
                        ...b,
                        items: b.items.filter((item) => item.id !== id),
                      }
                    }
                    return b
                  })
                  .filter((b) => b.items.length > 0),
              )
            }}
          />
        ))}
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
