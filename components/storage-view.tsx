"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, ZoomIn, ZoomOut, StickyNote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StorageViewProps {
  className?: string
}

interface StoredNote {
  id: string
  text: string
  timestamp: Date
  source?: string
  type: "sticky-note" | "highlight" | "manual"
}

export function StorageView({ className }: StorageViewProps) {
  const [storedNotes, setStoredNotes] = useState<StoredNote[]>([
    {
      id: "1",
      text: "Remember to implement the new user authentication flow with OAuth2. This should include proper error handling and user session management.",
      timestamp: new Date(2024, 0, 15),
      source: "Design Meeting",
      type: "manual"
    },
    {
      id: "2", 
      text: "Bug in the payment processing module - users are experiencing timeout errors during checkout. Need to investigate the API response times.",
      timestamp: new Date(2024, 0, 14),
      source: "Bug Report",
      type: "highlight"
    },
    {
      id: "3",
      text: "Ideas for the new dashboard: Add dark mode toggle, implement real-time notifications, improve mobile responsiveness, and add user analytics section.",
      timestamp: new Date(2024, 0, 13), 
      source: "Brainstorming Session",
      type: "sticky-note"
    },
    {
      id: "4",
      text: "Database optimization needed - queries taking too long on the user analytics table. Consider adding indexes on frequently searched columns.",
      timestamp: new Date(2024, 0, 12),
      source: "Performance Review",
      type: "manual"
    },
    {
      id: "5",
      text: "Feature request: Users want the ability to export their data in CSV format. This should include all their profile information and activity history.",
      timestamp: new Date(2024, 0, 11),
      source: "User Feedback",
      type: "highlight"
    },
    {
      id: "6",
      text: "Meeting notes: Discussed the Q2 roadmap, prioritized mobile app development, and agreed on new hiring goals for the engineering team.",
      timestamp: new Date(2024, 0, 10),
      source: "Team Meeting",
      type: "sticky-note"
    }
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    // Handle traditional text storage (highlights, etc.)
    const handleStoreText = (event: CustomEvent) => {
      const { text, source } = event.detail
      if (text) {
        const newNote: StoredNote = {
          id: Date.now().toString(),
          text: text.trim(),
          timestamp: new Date(),
          source: source || "Unknown",
          type: "highlight",
        }
        setStoredNotes((prev) => [newNote, ...prev])
      }
    }

    // Handle sticky notes sent to storage
    const handleStickyNoteToStorage = (event: CustomEvent) => {
      const { id, text } = event.detail
      if (text && text.trim()) {
        const newNote: StoredNote = {
          id: `sticky-${id}-${Date.now()}`,
          text: text.trim(),
          timestamp: new Date(),
          source: "Sticky Note",
          type: "sticky-note",
        }
        setStoredNotes((prev) => [newNote, ...prev])
      }
    }

    window.addEventListener("store-text", handleStoreText as EventListener)
    window.addEventListener("sticky-note-to-storage", handleStickyNoteToStorage as EventListener)
    
    return () => {
      window.removeEventListener("store-text", handleStoreText as EventListener)
      window.removeEventListener("sticky-note-to-storage", handleStickyNoteToStorage as EventListener)
    }
  }, [])

  const filteredNotes = storedNotes.filter((note) => note.text.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Notes</h2>
        <p className="text-muted-foreground">Your saved notes from sticky notes and highlighted content</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex gap-4 max-w-2xl w-full">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            No notes yet. Send sticky notes here or highlight text to save notes.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
        >
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 p-4 hover:shadow-md transition-all duration-300 hover:border-primary/20"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {note.timestamp.toLocaleDateString()} • {note.source}
                  </div>
                  {note.type === "sticky-note" && (
                    <StickyNote className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="text-foreground leading-relaxed text-sm">
                  {note.text.length > 200 ? `${note.text.substring(0, 200)}...` : note.text}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
