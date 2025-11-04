"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  StickyNote,
  Circle,
  CheckCircle2,
  Layers,
  X,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react"
import NotesFilterDropdown from "./notes-filter-dropdown"
import { NotesCalendarView } from "./notes-calendar-view"
import { Input } from "@/components/ui/input"
import React from "react"
import { cn } from "@/lib/utils"

interface StorageViewProps {
  className?: string
}

interface StoredNote {
  id: string
  title: string
  text: string
  timestamp: Date
  source?: string
  type: "sticky-note" | "highlight" | "manual" | "merged"
  mergedNoteIds?: string[]
  mergedCount?: number
  mergedNotes?: StoredNote[]
  size?: 1 | 2 | 3
  color?: string
  alignment?: "left" | "center" | "right"
}

const COLOR_PALETTE = [
  {
    name: "Yellow",
    bg: "bg-yellow-50/90 dark:bg-yellow-900/80",
    border: "border-yellow-400 dark:border-yellow-600",
    text: "text-yellow-900 dark:text-yellow-100",
  },
  {
    name: "Blue",
    bg: "bg-blue-50/90 dark:bg-blue-900/80",
    border: "border-blue-400 dark:border-blue-600",
    text: "text-blue-900 dark:text-blue-100",
  },
  {
    name: "Green",
    bg: "bg-green-50/90 dark:bg-green-900/80",
    border: "border-green-400 dark:border-green-600",
    text: "text-green-900 dark:text-green-100",
  },
  {
    name: "Purple",
    bg: "bg-purple-50/90 dark:bg-purple-900/80",
    border: "border-purple-400 dark:border-purple-600",
    text: "text-purple-900 dark:text-purple-100",
  },
  {
    name: "Pink",
    bg: "bg-pink-50/90 dark:bg-pink-900/80",
    border: "border-pink-400 dark:border-pink-600",
    text: "text-pink-900 dark:text-pink-100",
  },
  {
    name: "Orange",
    bg: "bg-orange-50/90 dark:bg-orange-900/80",
    border: "border-orange-400 dark:border-orange-600",
    text: "text-orange-900 dark:text-orange-100",
  },
  {
    name: "Red",
    bg: "bg-red-50/90 dark:bg-red-900/80",
    border: "border-red-400 dark:border-red-600",
    text: "text-red-900 dark:text-red-100",
  },
  {
    name: "Teal",
    bg: "bg-teal-50/90 dark:bg-teal-900/80",
    border: "border-teal-400 dark:border-teal-600",
    text: "text-teal-900 dark:text-teal-100",
  },
]

export default function NotesPage({ className }: StorageViewProps) {
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [showMergeButton, setShowMergeButton] = useState(false)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    noteId: string
    type: "note" | "folder"
  } | null>(null)
  const [showCustomizeMenu, setShowCustomizeMenu] = useState<string | null>(null)
  const [showResizeMenu, setShowResizeMenu] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNote, setDraggedNote] = useState<StoredNote | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragOverNoteId, setDragOverNoteId] = useState<string | null>(null)
  const [lastDragOverTime, setLastDragOverTime] = useState(0)
  const [openFolderId, setOpenFolderId] = useState<string | null>(null)

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<"title" | "text" | null>(null)
  const [editValue, setEditValue] = useState("")

  const [fullscreenNote, setFullscreenNote] = useState<StoredNote | null>(null)
  const [isPopupFullscreen, setIsPopupFullscreen] = useState(false)
  const [popupEditingField, setPopupEditingField] = useState<"title" | "text" | null>(null)
  const [popupEditValue, setPopupEditValue] = useState("")

  // Add folder rename state
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null)
  const [folderRenameValue, setFolderRenameValue] = useState("")
  const [folderTitles, setFolderTitles] = useState<Record<string, string>>({})

  const [mergeBtnPosition, setMergeBtnPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [isMergeBtnDragging, setIsMergeBtnDragging] = useState(false)
  const [mergeBtnOffset, setMergeBtnOffset] = useState({ x: 0, y: 0 })
  const [mergeBtnInitialized, setMergeBtnInitialized] = useState(false)

  const [popupContextMenu, setPopupContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [showFormatMenu, setShowFormatMenu] = useState(false)
  const [showFontMenu, setShowFontMenu] = useState(false)
  const [showAlignMenu, setShowAlignMenu] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [textAlignment, setTextAlignment] = useState<"left" | "center" | "right">("left")

  const [mergeBtnWasDragged, setMergeBtnWasDragged] = useState(false)

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showTextToolbar, setShowTextToolbar] = useState(false)
  const [textToolbarPosition, setTextToolbarPosition] = useState({ x: 0, y: 0 })
  const [currentFontSize, setCurrentFontSize] = useState<string | null>(null)
  const [currentFontColor, setCurrentFontColor] = useState<string | null>(null)
  const [currentTextStyles, setCurrentTextStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
  })
  // ADD CHANGE: Add state for main page text selection
  const [mainPageTextToolbar, setMainPageTextToolbar] = useState(false)
  const [mainPageToolbarPosition, setMainPageToolbarPosition] = useState({ x: 0, y: 0 })
  const [mainPageSelectedNoteId, setMainPageSelectedNoteId] = useState<string | null>(null)

  const [storedNotes, setStoredNotes] = useState<StoredNote[]>([
    {
      id: "1",
      title: "OAuth2 Implementation",
      text: "Remember to implement the new user authentication flow with OAuth2. This should include proper error handling and user session management.",
      timestamp: new Date(2024, 0, 15),
      source: "Design Meeting",
      type: "manual",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "2",
      title: "Payment Bug Fix",
      text: "Bug in the payment processing module - users are experiencing timeout errors during checkout. Need to investigate the API response times.",
      timestamp: new Date(2024, 0, 14),
      source: "Bug Report",
      type: "highlight",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "3",
      title: "Dashboard Ideas",
      text: "Ideas for the new dashboard: Add dark mode toggle, implement real-time notifications, improve mobile responsiveness, and add user analytics section.",
      timestamp: new Date(2024, 0, 13),
      source: "Brainstorming Session",
      type: "sticky-note",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "4",
      title: "Database Optimization",
      text: "Database optimization needed - queries taking too long on the user analytics table. Consider adding indexes on frequently searched columns.",
      timestamp: new Date(2024, 0, 12),
      source: "Performance Review",
      type: "manual",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "5",
      title: "CSV Export Feature",
      text: "Feature request: Users want the ability to export their data in CSV format. This should include all their profile information and activity history.",
      timestamp: new Date(2024, 0, 11),
      source: "User Feedback",
      type: "highlight",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "6",
      title: "Q2 Roadmap Meeting",
      text: "Meeting notes: Discussed the Q2 roadmap, prioritized mobile app development, and agreed on new hiring goals for the engineering team.",
      timestamp: new Date(2024, 0, 10),
      source: "Team Meeting",
      type: "sticky-note",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "7",
      title: "Security Audit",
      text: "Security audit findings: Need to update SSL certificates, implement two-factor authentication, and review user access permissions across all systems.",
      timestamp: new Date(2024, 0, 9),
      source: "Security Audit",
      type: "manual",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "8",
      title: "Search Feedback",
      text: "Customer feedback: Users love the new search functionality but want more filtering options and the ability to save search queries for future use.",
      timestamp: new Date(2024, 0, 8),
      source: "Customer Survey",
      type: "highlight",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "9",
      title: "Code Review Notes",
      text: "Code review notes: Refactor the user service layer, implement proper error boundaries in React components, and add unit tests for critical functions.",
      timestamp: new Date(2024, 0, 7),
      source: "Code Review",
      type: "sticky-note",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "10",
      title: "Infrastructure Planning",
      text: "Infrastructure planning: Migrate to cloud-native architecture, implement auto-scaling for peak traffic, and set up monitoring and alerting systems.",
      timestamp: new Date(2024, 0, 6),
      source: "Architecture Meeting",
      type: "manual",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "11",
      title: "UX Research Insights",
      text: "UX research insights: Users struggle with the current navigation menu. Consider implementing breadcrumbs and improving the information architecture.",
      timestamp: new Date(2024, 0, 5),
      source: "UX Research",
      type: "highlight",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "12",
      title: "API Documentation",
      text: "API documentation needs updating: Add examples for all endpoints, include error response codes, and create interactive documentation with Swagger.",
      timestamp: new Date(2024, 0, 4),
      source: "Documentation Review",
      type: "sticky-note",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "13",
      title: "Performance Metrics",
      text: "Performance metrics: Page load times have increased by 15% this month. Investigate image optimization, CDN configuration, and database query performance.",
      timestamp: new Date(2024, 0, 3),
      source: "Analytics Report",
      type: "manual",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "14",
      title: "Marketing Campaign",
      text: "Marketing campaign ideas: Launch referral program, create video tutorials for new features, and partner with industry influencers for product promotion.",
      timestamp: new Date(2024, 0, 2),
      source: "Marketing Brainstorm",
      type: "highlight",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "15",
      title: "Technical Debt",
      text: "Technical debt assessment: Legacy code in the user management system needs refactoring. Plan migration to modern frameworks and improve test coverage.",
      timestamp: new Date(2024, 0, 1),
      source: "Tech Debt Review",
      type: "sticky-note",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "16",
      title: "Accessibility Improvements",
      text: "Accessibility improvements needed: Add ARIA labels, improve keyboard navigation, ensure color contrast compliance, and test with screen readers.",
      timestamp: new Date(2023, 11, 31),
      source: "Accessibility Audit",
      type: "manual",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "17",
      title: "Mobile App Feedback",
      text: "Mobile app feedback: Users want offline functionality, push notifications for important updates, and better integration with the web platform.",
      timestamp: new Date(2023, 11, 30),
      source: "Mobile User Survey",
      type: "highlight",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "18",
      title: "Data Backup Strategy",
      text: "Data backup strategy: Implement automated daily backups, test disaster recovery procedures, and ensure compliance with data retention policies.",
      timestamp: new Date(2023, 11, 29),
      source: "IT Security Meeting",
      type: "sticky-note",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "19",
      title: "Integration Requirements",
      text: "Integration requirements: Connect with third-party CRM system, implement webhook notifications, and create data synchronization workflows.",
      timestamp: new Date(2023, 11, 28),
      source: "Integration Planning",
      type: "manual",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "20",
      title: "User Onboarding",
      text: "User onboarding improvements: Create interactive tutorials, simplify the signup process, and add progress indicators for multi-step workflows.",
      timestamp: new Date(2023, 11, 27),
      source: "Onboarding Analysis",
      type: "highlight",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "21",
      title: "Localization Project",
      text: "Localization project: Translate interface to Spanish and French, implement right-to-left language support, and adapt date/time formats for different regions.",
      timestamp: new Date(2023, 11, 26),
      source: "Internationalization Meeting",
      type: "sticky-note",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "22",
      title: "Email System",
      text: "Email system optimization: Reduce bounce rates, implement email templates, add personalization features, and improve delivery tracking.",
      timestamp: new Date(2023, 11, 25),
      source: "Email Marketing Review",
      type: "manual",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "23",
      title: "Social Media Integration",
      text: "Social media integration: Add social login options, implement sharing functionality, and create social media posting automation for content updates.",
      timestamp: new Date(2023, 11, 24),
      source: "Social Media Strategy",
      type: "highlight",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "24",
      title: "Analytics Enhancement",
      text: "Analytics enhancement: Implement custom event tracking, create user behavior funnels, and set up automated reporting for key business metrics.",
      timestamp: new Date(2023, 11, 23),
      source: "Analytics Planning",
      type: "sticky-note",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "25",
      title: "Content Management",
      text: "Content management system: Develop rich text editor, implement content versioning, add collaborative editing features, and create content approval workflows.",
      timestamp: new Date(2023, 11, 22),
      source: "CMS Requirements",
      type: "manual",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "26",
      title: "Search Upgrade",
      text: "Search functionality upgrade: Implement fuzzy search, add auto-complete suggestions, create advanced filtering options, and improve search result ranking.",
      timestamp: new Date(2023, 11, 21),
      source: "Search Improvement",
      type: "highlight",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "27",
      title: "Payment Enhancements",
      text: "Payment system enhancements: Add support for multiple currencies, implement subscription billing, create invoice generation, and improve payment security.",
      timestamp: new Date(2023, 11, 20),
      source: "Payment Integration",
      type: "sticky-note",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
    {
      id: "28",
      title: "Notification System",
      text: "Notification system redesign: Create notification preferences, implement real-time updates, add email digest options, and improve notification categorization.",
      timestamp: new Date(2023, 11, 19),
      source: "Notification Planning",
      type: "manual",
      size: 1,
      color: "Yellow",
      alignment: "left",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [notesFilter, setNotesFilter] = React.useState<"global" | "local" | "calendar">("global")

  useEffect(() => {
    setShowMergeButton(selectedNotes.length >= 2)
  }, [selectedNotes])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (selectedNotes.length > 0) {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [selectedNotes])

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null)
      setShowCustomizeMenu(null)
      setShowResizeMenu(null)
      setPopupContextMenu(null) // Close popup context menu
      setShowFormatMenu(false) // Close format menu
      setShowFontMenu(false) // Close font menu
      setShowAlignMenu(false) // Close alignment menu
    }
    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  const handleToggleFormatMenu = () => {
    setShowFormatMenu(!showFormatMenu)
    setShowFontMenu(false)
    setShowAlignMenu(false)
  }

  const handleToggleFontMenu = () => {
    setShowFontMenu(!showFontMenu)
    setShowFormatMenu(false)
    setShowAlignMenu(false)
  }

  const handleToggleAlignMenu = () => {
    setShowAlignMenu(!showAlignMenu)
    setShowFormatMenu(false)
    setShowFontMenu(false)
  }

  // ADD CHANGE: State for current text formatting
  const [currentTextFormat, setCurrentTextFormat] = useState<string | null>(null)

  useEffect(() => {
    const handleStoreText = (event: CustomEvent) => {
      const { text, source } = event.detail
      if (text) {
        const newNote: StoredNote = {
          id: Date.now().toString(),
          title: text.substring(0, 30) + (text.length > 30 ? "..." : ""),
          text: text.trim(),
          timestamp: new Date(),
          source: source || "Unknown",
          type: "highlight",
          size: 1,
          color: "Yellow",
          alignment: "left",
        }
        setStoredNotes((prev) => [newNote, ...prev])
      }
    }

    const handleStickyNoteToStorage = (event: CustomEvent) => {
      const { id, text, title } = event.detail
      if (text && text.trim()) {
        const newNote: StoredNote = {
          id: `sticky-${id}-${Date.now()}`,
          title: title || text.substring(0, 30) + (text.length > 30 ? "..." : ""),
          text: text.trim(),
          timestamp: new Date(),
          source: "Sticky Note",
          type: "sticky-note",
          size: 1,
          color: "Yellow",
          alignment: "left",
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

  // CHANGE: Modified to only show toolbar on mouseup, not during selection
  useEffect(() => {
    const handleMouseUp = () => {
      if (!fullscreenNote) return

      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        setShowTextToolbar(false)
        return
      }

      const selectedText = selection.toString()
      if (selectedText.length > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setTextToolbarPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 60,
        })
        setShowTextToolbar(true)
      } else {
        setShowTextToolbar(false)
      }
    }

    document.addEventListener("mouseup", handleMouseUp)
    return () => document.removeEventListener("mouseup", handleMouseUp)
  }, [fullscreenNote])

  // CHANGE: Add text selection handling for main page notes
  useEffect(() => {
    const handleMainPageMouseUp = () => {
      if (fullscreenNote) return // Only for main page, not fullscreen

      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        setMainPageTextToolbar(false)
        return
      }

      const selectedText = selection.toString()
      if (selectedText.length > 0) {
        // Check if selection is within a note card
        const range = selection.getRangeAt(0)
        const container = range.commonAncestorContainer
        const noteElement =
          (container as HTMLElement).closest?.("[data-note-id]") ||
          (container.parentElement as HTMLElement)?.closest?.("[data-note-id]")

        if (noteElement) {
          const noteId = noteElement.getAttribute("data-note-id")
          setMainPageSelectedNoteId(noteId)

          const rect = range.getBoundingClientRect()
          setMainPageToolbarPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 60,
          })
          setMainPageTextToolbar(true)
        }
      } else {
        setMainPageTextToolbar(false)
      }
    }

    document.addEventListener("mouseup", handleMainPageMouseUp)
    return () => document.removeEventListener("mouseup", handleMainPageMouseUp)
  }, [fullscreenNote])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedNote) return

      requestAnimationFrame(() => {
        setDragPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      })

      const now = Date.now()
      if (now - lastDragOverTime > 100) {
        const element = document.elementFromPoint(e.clientX, e.clientY)
        const noteElement = element?.closest("[data-note-id]")
        if (noteElement) {
          const noteId = noteElement.getAttribute("data-note-id")
          if (noteId && noteId !== draggedNote.id && noteId !== dragOverNoteId) {
            setDragOverNoteId(noteId)
            setLastDragOverTime(now)
          }
        } else if (dragOverNoteId) {
          setDragOverNoteId(null)
        }
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!draggedNote || !isDragging) {
        setDraggedNote(null)
        setIsDragging(false)
        return
      }

      const element = document.elementFromPoint(e.clientX, e.clientY)
      const noteElement = element?.closest("[data-note-id]")

      if (noteElement) {
        const targetNoteId = noteElement.getAttribute("data-note-id")
        if (targetNoteId && targetNoteId !== draggedNote.id) {
          const targetNote = storedNotes.find((note) => note.id === targetNoteId)

          if (targetNote?.type === "merged") {
            const notesToAdd = storedNotes.filter((note) => selectedNotes.includes(note.id))
            const updatedMergedNotes = [...(targetNote.mergedNotes || []), ...notesToAdd]
            const updatedMergedText = updatedMergedNotes.map((note) => note.text).join("\n\n")

            setStoredNotes((prev) =>
              prev
                .filter((note) => !selectedNotes.includes(note.id))
                .map((note) =>
                  note.id === targetNoteId
                    ? {
                        ...note,
                        mergedNotes: updatedMergedNotes,
                        mergedCount: updatedMergedNotes.length,
                        text: updatedMergedText,
                      }
                    : note,
                ),
            )
            setSelectedNotes([])
          } else {
            setStoredNotes((prev) => {
              const newNotes = [...prev]
              const draggedIndex = newNotes.findIndex((note) => note.id === draggedNote.id)
              const targetIndex = newNotes.findIndex((note) => note.id === targetNoteId)

              if (draggedIndex !== -1 && targetIndex !== -1) {
                ;[newNotes[draggedIndex], newNotes[targetIndex]] = [newNotes[targetIndex], newNotes[draggedIndex]]
              }

              return newNotes
            })
            setSelectedNotes([])
          }
        }
      }

      setDraggedNote(null)
      setIsDragging(false)
      setDragOverNoteId(null)
    }

    if (draggedNote) {
      document.body.style.userSelect = "none"
      document.body.style.webkitUserSelect = "none"

      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.body.style.userSelect = ""
        document.body.style.webkitUserSelect = ""
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [draggedNote, isDragging, dragOffset, lastDragOverTime, selectedNotes, storedNotes])

  const filteredNotes = storedNotes.filter(
    (note) =>
      note.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const displayNotes = openFolderId
    ? storedNotes.find((note) => note.id === openFolderId)?.mergedNotes || []
    : filteredNotes

  const toggleNoteSelection = (noteId: string) => {
    if (editingNoteId === noteId) {
      handleCancelEdit()
    }
    setSelectedNotes((prev) => {
      if (prev.includes(noteId)) {
        return prev.filter((id) => id !== noteId)
      } else {
        return [...prev, noteId]
      }
    })
  }

  const handleMerge = () => {
    if (selectedNotes.length === 0) return

    // Use displayNotes if in folder, otherwise use storedNotes
    const notesSource = openFolderId ? displayNotes : storedNotes
    const notesToMerge = notesSource.filter((note) => selectedNotes.includes(note.id))

    if (notesToMerge.length === 0) return

    const mergedText = notesToMerge.map((note) => note.text).join("\n\n")
    const mergedTitle = `Merged: ${notesToMerge[0]?.title || "Untitled"}${notesToMerge.length > 1 ? ` +${notesToMerge.length - 1} more` : ""}`

    const mergedNote: StoredNote = {
      id: `merged-${Date.now()}`,
      title: mergedTitle,
      text: mergedText,
      timestamp: new Date(),
      source: "Merged Notes",
      type: "merged",
      mergedNoteIds: selectedNotes,
      mergedCount: selectedNotes.length,
      mergedNotes: notesToMerge,
      size: 2,
      color: "Purple",
      alignment: "left",
    }

    // If in folder, update the folder's merged notes
    if (openFolderId) {
      setStoredNotes((prev) =>
        prev.map((note) => {
          if (note.id === openFolderId && note.mergedNotes) {
            return {
              ...note,
              mergedNotes: [mergedNote, ...note.mergedNotes.filter((n) => !selectedNotes.includes(n.id))],
              mergedCount: (note.mergedCount || 0) - selectedNotes.length + 1,
            }
          }
          return note
        }),
      )
    } else {
      setStoredNotes((prev) => [mergedNote, ...prev.filter((note) => !selectedNotes.includes(note.id))])
    }
    setSelectedNotes([])
  }

  const handleFolderRename = (folderId: string) => {
    const currentTitle = folderTitles[folderId] || ""
    setFolderRenameValue(currentTitle)
    setRenamingFolderId(folderId)
    setContextMenu(null)
  }

  const handleFolderRenameSubmit = (folderId: string, newTitle: string) => {
    setFolderTitles((prev) => ({
      ...prev,
      [folderId]: newTitle.trim(),
    }))
    setRenamingFolderId(null)
    setFolderRenameValue("")
  }

  const handleFolderRenameCancel = () => {
    setRenamingFolderId(null)
    setFolderRenameValue("")
  }

  const handleContextMenu = (e: React.MouseEvent, noteId: string, type: "note" | "folder") => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      noteId,
      type,
    })
  }

  const handleResize = (noteId: string, size: 1 | 2 | 3) => {
    if (openFolderId) {
      setStoredNotes((prev) =>
        prev.map((note) => {
          if (note.id === openFolderId && note.mergedNotes) {
            return {
              ...note,
              mergedNotes: note.mergedNotes.map((mergedNote) =>
                mergedNote.id === noteId ? { ...mergedNote, size } : mergedNote,
              ),
            }
          }
          return note
        }),
      )
    } else {
      setStoredNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, size } : note)))
    }
    setShowResizeMenu(null)
    setContextMenu(null)
  }

  const handleColorChange = (noteId: string, color: string) => {
    if (openFolderId) {
      setStoredNotes((prev) =>
        prev.map((note) => {
          if (note.id === openFolderId && note.mergedNotes) {
            return {
              ...note,
              mergedNotes: note.mergedNotes.map((mergedNote) =>
                mergedNote.id === noteId ? { ...mergedNote, color } : mergedNote,
              ),
            }
          }
          return note
        }),
      )
    } else {
      setStoredNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, color } : note)))
    }
    setShowCustomizeMenu(null)
    setContextMenu(null)
  }

  const handleMouseDown = (e: React.MouseEvent, note: StoredNote) => {
    if (!selectedNotes.includes(note.id)) return

    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    setDragOffset({ x: offsetX, y: offsetY })
    setDraggedNote(note)
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedNote) return

    requestAnimationFrame(() => {
      setDragPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    })

    const now = Date.now()
    if (now - lastDragOverTime > 100) {
      const element = document.elementFromPoint(e.clientX, e.clientY)
      const noteElement = element?.closest("[data-note-id]")
      if (noteElement) {
        const noteId = noteElement.getAttribute("data-note-id")
        if (noteId && noteId !== draggedNote.id && noteId !== dragOverNoteId) {
          setDragOverNoteId(noteId)
          setLastDragOverTime(now)
        }
      } else if (dragOverNoteId) {
        setDragOverNoteId(null)
      }
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!draggedNote || !isDragging) {
      setDraggedNote(null)
      setIsDragging(false)
      return
    }

    // Check if dropped on a note
    const element = document.elementFromPoint(e.clientX, e.clientY)
    const noteElement = element?.closest("[data-note-id]")

    if (noteElement) {
      const targetNoteId = noteElement.getAttribute("data-note-id")
      if (targetNoteId && targetNoteId !== draggedNote.id) {
        const targetNote = storedNotes.find((note) => note.id === targetNoteId)

        if (targetNote?.type === "merged") {
          const notesToAdd = storedNotes.filter((note) => selectedNotes.includes(note.id))
          const updatedMergedNotes = [...(targetNote.mergedNotes || []), ...notesToAdd]
          const updatedMergedText = updatedMergedNotes.map((note) => note.text).join("\n\n")

          setStoredNotes((prev) =>
            prev
              .filter((note) => !selectedNotes.includes(note.id))
              .map((note) =>
                note.id === targetNoteId
                  ? {
                      ...note,
                      mergedNotes: updatedMergedNotes,
                      mergedCount: updatedMergedNotes.length,
                      text: updatedMergedText,
                    }
                  : note,
              ),
          )
          setSelectedNotes([])
        } else {
          setStoredNotes((prev) => {
            const newNotes = [...prev]
            const draggedIndex = newNotes.findIndex((note) => note.id === draggedNote.id)
            const targetIndex = newNotes.findIndex((note) => note.id === targetNoteId)

            if (draggedIndex !== -1 && targetIndex !== -1) {
              // Swap the notes
              ;[newNotes[draggedIndex], newNotes[targetIndex]] = [newNotes[targetIndex], newNotes[draggedIndex]]
            }

            return newNotes
          })
          setSelectedNotes([])
        }
      }
    }

    setDraggedNote(null)
    setIsDragging(false)
    setDragOverNoteId(null)
  }

  const handleDelete = (noteId: string) => {
    if (openFolderId) {
      setStoredNotes((prev) =>
        prev.map((note) => {
          if (note.id === openFolderId && note.mergedNotes) {
            const updatedMergedNotes = note.mergedNotes.filter((mergedNote) => mergedNote.id !== noteId)
            return {
              ...note,
              mergedNotes: updatedMergedNotes,
              mergedCount: updatedMergedNotes.length,
              text: updatedMergedNotes.map((n) => n.text).join("\n\n"),
            }
          }
          return note
        }),
      )
    } else {
      setStoredNotes((prev) => prev.filter((note) => note.id !== noteId))
    }
    setContextMenu(null)
  }

  const handleFolderClick = (folderId: string) => {
    setOpenFolderId(folderId)
  }

  const handleBackToMain = () => {
    setOpenFolderId(null)
  }

  const getColorClasses = (colorName?: string) => {
    const color = COLOR_PALETTE.find((c) => c.name === colorName) || COLOR_PALETTE[0]
    return color
  }

  const getGridSpanClasses = (size?: number, isMerged?: boolean) => {
    if (isMerged) return "col-span-1 md:col-span-2 lg:col-span-2 row-span-2 max-w-full"
    switch (size) {
      case 2:
        return "col-span-1 md:col-span-2 lg:col-span-2 row-span-2 max-w-full"
      case 3:
        return "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3 row-span-3 max-w-full"
      default:
        return "col-span-1 row-span-1 max-w-full"
    }
  }

  const handleStartEdit = (noteId: string, field: "title" | "text", currentValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedNotes.includes(noteId)) {
      return
    }
    setEditingNoteId(noteId)
    setEditingField(field)
    setEditValue(currentValue)
  }

  const handleSaveEdit = () => {
    if (!editingNoteId || !editingField) return

    if (openFolderId) {
      setStoredNotes((prev) =>
        prev.map((note) => {
          if (note.id === openFolderId && note.mergedNotes) {
            return {
              ...note,
              mergedNotes: note.mergedNotes.map((mergedNote) =>
                mergedNote.id === editingNoteId ? { ...mergedNote, [editingField]: editValue } : mergedNote,
              ),
            }
          }
          return note
        }),
      )
    } else {
      setStoredNotes((prev) =>
        prev.map((note) => (note.id === editingNoteId ? { ...note, [editingField]: editValue } : note)),
      )
    }

    setEditingNoteId(null)
    setEditingField(null)
    setEditValue("")
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
    setEditingField(null)
    setEditValue("")
  }

  const handleNoteClick = (note: StoredNote, e: React.MouseEvent) => {
    const target = e.target as HTMLElement

    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea") ||
      selectedNotes.includes(note.id)
    ) {
      return
    }

    if (note.type === "merged") {
      handleFolderClick(note.id)
    } else {
      setFullscreenNote(note)
    }
  }

  const handleCloseFullscreen = () => {
    setFullscreenNote(null)
    setIsPopupFullscreen(false)
    setPopupEditingField(null)
    setPopupEditValue("")
    setPopupContextMenu(null) // Close popup context menu
    setShowFormatMenu(false) // Close format menu
    setShowFontMenu(false) // Close font menu
    setShowAlignMenu(false) // Close alignment menu
    setShowTextToolbar(false) // Close text toolbar
  }

  const handlePopupStartEdit = (field: "title" | "text", currentValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPopupEditingField(field)
    setPopupEditValue(currentValue)
  }

  const handlePopupSaveEdit = () => {
    if (!fullscreenNote || !popupEditingField) return

    setStoredNotes((prev) =>
      prev.map((note) => (note.id === fullscreenNote.id ? { ...note, [popupEditingField]: popupEditValue } : note)),
    )

    setFullscreenNote((prev) => (prev ? { ...prev, [popupEditingField]: popupEditValue } : null))
    setPopupEditingField(null)
    setPopupEditValue("")
  }

  const handlePopupCancelEdit = () => {
    setPopupEditingField(null)
    setPopupEditValue("")
  }

  const handlePopupContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPopupContextMenu({ x: e.clientX, y: e.clientY })
  }

  const applyFormatting = (command: string, isMainPage?: boolean) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = selection.toString()

    if (selectedText) {
      document.execCommand(command, false, undefined)
      setTimeout(() => {
        const newSelection = window.getSelection()
        if (newSelection && range) {
          try {
            newSelection.removeAllRanges()
            newSelection.addRange(range)
          } catch (e) {
            console.error("Error restoring selection:", e)
          }
        }
      }, 0)
    } else {
      document.execCommand(command, false, undefined)
    }

    if (fullscreenNote && popupEditingField === "text") {
      const contentDiv = document.querySelector('[contenteditable="true"]')
      if (contentDiv) {
        const newText = contentDiv.innerHTML // Use innerHTML to preserve formatting
        setFullscreenNote({ ...fullscreenNote, text: newText })
        setStoredNotes((prev) =>
          prev.map((note) => (note.id === fullscreenNote.id ? { ...note, text: newText } : note)),
        )
      }
    } else if (isMainPage && mainPageSelectedNoteId) {
      // Update main page note content if needed (less direct than fullscreen)
      // For simplicity, this part might need a more robust DOM update strategy if complex formatting is applied to main page notes directly.
    }
  }

  const applyFontSize = (size: string, isMainPage?: boolean) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = selection.toString()

    if (selectedText) {
      const span = document.createElement("span")
      span.style.fontSize = size
      span.style.removeProperty("font-weight")
      span.style.removeProperty("font-style")
      span.style.removeProperty("text-decoration")

      try {
        range.surroundContents(span)

        setTimeout(() => {
          const newSelection = window.getSelection()
          if (newSelection) {
            newSelection.removeAllRanges()
            const newRange = document.createRange()
            newRange.selectNodeContents(span)
            newSelection.addRange(newRange)
          }
        }, 0)
      } catch (e) {
        console.error("Error applying font size:", e)
      }
    }

    if (fullscreenNote && popupEditingField === "text") {
      const contentDiv = document.querySelector('[contenteditable="true"]')
      if (contentDiv) {
        const newText = contentDiv.innerHTML
        setFullscreenNote({ ...fullscreenNote, text: newText })
        setStoredNotes((prev) =>
          prev.map((note) => (note.id === fullscreenNote.id ? { ...note, text: newText } : note)),
        )
      }
    } else if (isMainPage && mainPageSelectedNoteId) {
      // Update main page note content
    }

    setCurrentFontSize(size)
    setShowFontMenu(false)
  }

  const applyFontColor = (color: string, isMainPage?: boolean) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = selection.toString()

    if (selectedText) {
      const span = document.createElement("span")
      span.style.color = color
      span.style.removeProperty("font-weight")
      span.style.removeProperty("font-style")
      span.style.removeProperty("text-decoration")

      try {
        range.surroundContents(span)

        setTimeout(() => {
          const newSelection = window.getSelection()
          if (newSelection) {
            newSelection.removeAllRanges()
            const newRange = document.createRange()
            newRange.selectNodeContents(span)
            newSelection.addRange(newRange)
          }
        }, 0)
      } catch (e) {
        console.error("Error applying font color:", e)
      }
    }

    if (fullscreenNote && popupEditingField === "text") {
      const contentDiv = document.querySelector('[contenteditable="true"]')
      if (contentDiv) {
        const newText = contentDiv.innerHTML
        setFullscreenNote({ ...fullscreenNote, text: newText })
        setStoredNotes((prev) =>
          prev.map((note) => (note.id === fullscreenNote.id ? { ...note, text: newText } : note)),
        )
      }
    } else if (isMainPage && mainPageSelectedNoteId) {
      // Update main page note content
    }

    setCurrentFontColor(color)
    setShowFontMenu(false)
  }

  const applyAlignment = (align: "left" | "center" | "right") => {
    if (!fullscreenNote) return

    setStoredNotes((prev) => prev.map((note) => (note.id === fullscreenNote.id ? { ...note, alignment: align } : note)))
    setFullscreenNote((prev) => (prev ? { ...prev, alignment: align } : null))
    setShowAlignMenu(false)
  }

  const handleMergeBtnMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMergeBtnDragging(true)
    setMergeBtnWasDragged(false)
    setMergeBtnInitialized(true) // Mark as initialized when first dragged
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    setMergeBtnOffset({ x: offsetX, y: offsetY })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMergeBtnDragging) return
      setMergeBtnWasDragged(true)
      setMergeBtnPosition({
        x: e.clientX - mergeBtnOffset.x,
        y: e.clientY - mergeBtnOffset.y,
      })
    }

    const handleMouseUp = () => {
      setIsMergeBtnDragging(false)
    }

    if (isMergeBtnDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isMergeBtnDragging, mergeBtnOffset])

  const handleMergeClick = () => {
    if (mergeBtnWasDragged) {
      setMergeBtnWasDragged(false)
      return
    }
    handleMerge()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-4 border-b border-primary/10">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Quick Notes</h2>
          <p className="text-muted-foreground">Your saved sticky notes and highlighted content</p>
        </div>

        <div className="flex items-center justify-center gap-4 relative">
          {openFolderId && (
            <button
              onClick={handleBackToMain}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Back to all notes"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="max-w-2xl w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            {/* Use Input component */}
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 focus:ring-1 focus:ring-primary/10 focus:border-primary/20"
            />
          </div>
          <NotesFilterDropdown currentFilter={notesFilter} onFilterChange={setNotesFilter} />
        </div>
      </div>

      <AnimatePresence>
        {showMergeButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 cursor-move"
            style={{
              left: mergeBtnInitialized ? mergeBtnPosition.x : "50%",
              top: mergeBtnInitialized ? mergeBtnPosition.y : "50%",
              transform: mergeBtnInitialized ? "none" : "translate(-50%, -50%)",
            }}
            onMouseDown={handleMergeBtnMouseDown}
          >
            <button
              onClick={handleMergeClick}
              className="bg-background/95 px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform duration-200 shadow-2xl border-2 border-primary/30"
            >
              <Layers className="h-6 w-6 text-primary" />
              <div className="text-left">
                <div className="font-bold text-lg text-foreground mb-2">Merge Notes</div>
                <div className="text-sm text-muted-foreground">{selectedNotes.length} notes selected</div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[100] bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl py-2 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowCustomizeMenu(contextMenu.noteId)
                setContextMenu(null)
              }}
              className="w-full px-4 py-2 text-left hover:bg-accent transition-colors text-sm"
            >
              Customize
            </button>
            {contextMenu.type === "folder" && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleFolderRename(contextMenu.noteId)
                }}
                className="w-full px-4 py-2 text-left hover:bg-accent transition-colors text-sm"
              >
                Rename
              </button>
            )}
            {contextMenu.type === "note" && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowResizeMenu(contextMenu.noteId)
                  setContextMenu(null)
                }}
                className="w-full px-4 py-2 text-left hover:bg-accent transition-colors text-sm"
              >
                Resize
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(contextMenu.noteId)
              }}
              className="w-full px-4 py-2 text-left hover:bg-accent transition-colors text-sm text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCustomizeMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed ${fullscreenNote ? "z-[250]" : "z-[100]"} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Choose Color</h3>
              <button
                onClick={() => setShowCustomizeMenu(null)}
                className="p-1 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(showCustomizeMenu, color.name)}
                  className={`w-12 h-12 rounded-full ${color.bg} ${color.border} border-2 hover:scale-110 transition-transform duration-200`}
                  title={color.name}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResizeMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[100] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Choose Size</h3>
              <button
                onClick={() => setShowResizeMenu(null)}
                className="p-1 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleResize(showResizeMenu, 1)}
                className="flex flex-col items-center gap-2 p-4 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="w-12 h-12 border-2 border-primary rounded-lg" />
                <span className="text-sm">1x1</span>
              </button>
              <button
                onClick={() => handleResize(showResizeMenu, 2)}
                className="flex flex-col items-center gap-2 p-4 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="w-16 h-16 border-2 border-primary rounded-lg" />
                <span className="text-sm">2x2</span>
              </button>
              <button
                onClick={() => handleResize(showResizeMenu, 3)}
                className="flex flex-col items-center gap-2 p-4 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="w-20 h-20 border-2 border-primary rounded-lg" />
                <span className="text-sm">3x3</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen modal for note details */}
      <AnimatePresence>
        {fullscreenNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
            onClick={handleCloseFullscreen}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${(() => {
                if (!fullscreenNote) return ""
                const colorClasses = getColorClasses(fullscreenNote.color)
                return `${colorClasses.bg} border-2 ${colorClasses.border}`
              })()} rounded-xl p-8 ${isPopupFullscreen ? "w-[70vw] h-[70vh]" : "max-w-3xl w-full max-h-[80vh]"} overflow-y-auto custom-scrollbar transition-all duration-300`}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={handlePopupContextMenu}
            >
              {fullscreenNote && (
                <>
                  <div className="flex justify-between items-start mb-6">
                    {popupEditingField === "title" ? (
                      <input
                        type="text"
                        value={popupEditValue}
                        onChange={(e) => setPopupEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handlePopupSaveEdit()
                          } else if (e.key === "Escape") {
                            handlePopupCancelEdit()
                          }
                        }}
                        onBlur={handlePopupSaveEdit}
                        className={`flex-1 text-2xl font-bold ${getColorClasses(fullscreenNote.color).text} bg-transparent border-b-2 ${getColorClasses(fullscreenNote.color).border} focus:outline-none px-1`}
                        autoFocus
                      />
                    ) : (
                      <h3
                        className={`text-2xl font-bold ${getColorClasses(fullscreenNote.color).text} cursor-text hover:opacity-80 transition-opacity flex-1`}
                        style={{ textAlign: fullscreenNote.alignment || "left" }}
                        onClick={(e) => handlePopupStartEdit("title", fullscreenNote.title, e)}
                      >
                        {fullscreenNote.title}
                      </h3>
                    )}
                    <div className="flex items-center gap-0.5">
                      <div className="relative">
                        <button
                          onClick={handleToggleFontMenu}
                          className={`${getColorClasses(fullscreenNote.color).text} hover:opacity-70 transition-opacity p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg ${showFontMenu ? "bg-black/10 dark:bg-white/10" : ""}`}
                          title="Font options"
                        >
                          <Type className="h-5 w-5" />
                        </button>
                        {showFontMenu && (
                          <div
                            className={`absolute top-full right-0 mt-2 ${getColorClasses(fullscreenNote.color).bg} border-2 ${getColorClasses(fullscreenNote.color).border} rounded-xl shadow-2xl p-4 min-w-[240px] z-10`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="mb-3 pb-3 border-b border-current/20">
                              <div
                                className={`text-xs font-semibold mb-2 ${getColorClasses(fullscreenNote.color).text}`}
                              >
                                Text Style
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => applyFormatting("bold")}
                                  className={`p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded ${getColorClasses(fullscreenNote.color).text} ${currentTextStyles.bold ? "bg-black/20 dark:bg-white/20 ring-2 ring-current/30" : ""}`}
                                  title="Bold"
                                >
                                  <Bold className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => applyFormatting("italic")}
                                  className={`p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded ${getColorClasses(fullscreenNote.color).text} ${currentTextStyles.italic ? "bg-black/20 dark:bg-white/20 ring-2 ring-current/30" : ""}`}
                                  title="Italic"
                                >
                                  <Italic className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => applyFormatting("underline")}
                                  className={`p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded ${getColorClasses(fullscreenNote.color).text} ${currentTextStyles.underline ? "bg-black/20 dark:bg-white/20 ring-2 ring-current/30" : ""}`}
                                  title="Underline"
                                >
                                  <Underline className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="mb-3 pb-3 border-b border-current/20">
                              <div
                                className={`text-xs font-semibold mb-2 ${getColorClasses(fullscreenNote.color).text}`}
                              >
                                Font Size
                              </div>
                              <div className="flex gap-1">
                                {["1", "3", "5", "7"].map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => applyFontSize(size)}
                                    className={`px-3 py-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded ${getColorClasses(fullscreenNote.color).text} text-sm font-medium ${currentFontSize === size ? "bg-black/20 dark:bg-white/20 ring-2 ring-current/30" : ""}`}
                                  >
                                    {size === "1" ? "S" : size === "3" ? "M" : size === "5" ? "L" : "XL"}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div
                                className={`text-xs font-semibold mb-2 ${getColorClasses(fullscreenNote.color).text}`}
                              >
                                Font Color
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {[
                                  "#000000",
                                  "#FF0000",
                                  "#00FF00",
                                  "#0000FF",
                                  "#FFFF00",
                                  "#FF00FF",
                                  "#00FFFF",
                                  "#FFA500",
                                ].map((color) => (
                                  <button
                                    key={color}
                                    onClick={() => applyFontColor(color)}
                                    className={`w-8 h-8 rounded-lg border-2 ${currentFontColor === color ? "border-current ring-2 ring-current/30" : "border-current/30"} hover:scale-110 transition-transform shadow-sm`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <button
                          onClick={handleToggleAlignMenu}
                          className={`${getColorClasses(fullscreenNote.color).text} hover:opacity-70 transition-opacity p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg ${showAlignMenu ? "bg-black/10 dark:bg-white/10" : ""}`}
                          title="Text alignment"
                        >
                          {(fullscreenNote.alignment || "left") === "left" ? (
                            <AlignLeft className="h-5 w-5" />
                          ) : fullscreenNote.alignment === "center" ? (
                            <AlignCenter className="h-5 w-5" />
                          ) : (
                            <AlignRight className="h-5 w-5" />
                          )}
                        </button>
                        {showAlignMenu && (
                          <div
                            className={`absolute top-full right-0 mt-2 ${getColorClasses(fullscreenNote.color).bg} border-2 ${getColorClasses(fullscreenNote.color).border} rounded-xl shadow-2xl py-2 min-w-[140px] z-10`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => applyAlignment("left")}
                              className={`w-full px-4 py-2 text-left hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2 ${getColorClasses(fullscreenNote.color).text} ${(fullscreenNote.alignment || "left") === "left" ? "bg-black/10 dark:bg-white/10" : ""}`}
                            >
                              <AlignLeft className="h-4 w-4" />
                              <span className="text-sm">Left</span>
                            </button>
                            <button
                              onClick={() => applyAlignment("center")}
                              className={`w-full px-4 py-2 text-left hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2 ${getColorClasses(fullscreenNote.color).text} ${fullscreenNote.alignment === "center" ? "bg-black/10 dark:bg-white/10" : ""}`}
                            >
                              <AlignCenter className="h-4 w-4" />
                              <span className="text-sm">Center</span>
                            </button>
                            <button
                              onClick={() => applyAlignment("right")}
                              className={`w-full px-4 py-2 text-left hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2 ${getColorClasses(fullscreenNote.color).text} ${fullscreenNote.alignment === "right" ? "bg-black/10 dark:bg-white/10" : ""}`}
                            >
                              <AlignRight className="h-4 w-4" />
                              <span className="text-sm">Right</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <button
                          onClick={handleToggleFormatMenu}
                          className={`${getColorClasses(fullscreenNote.color).text} hover:opacity-70 transition-opacity p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg ${showFormatMenu ? "bg-black/10 dark:bg-white/10" : ""}`}
                          title="Text formatting"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                          </svg>
                        </button>
                        {showFormatMenu && (
                          <div
                            className={`absolute top-full right-0 mt-2 ${getColorClasses(fullscreenNote.color).bg} border-2 ${getColorClasses(fullscreenNote.color).border} rounded-xl shadow-2xl py-2 min-w-[160px] z-10`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => applyFormatting("bullet")}
                              className={`w-full px-4 py-2 text-left hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm ${getColorClasses(fullscreenNote.color).text}`}
                            >
                              • Bullet Points
                            </button>
                            <button
                              onClick={() => applyFormatting("hyphen")}
                              className={`w-full px-4 py-2 text-left hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm ${getColorClasses(fullscreenNote.color).text}`}
                            >
                              - Hyphens
                            </button>
                            <button
                              onClick={() => applyFormatting("number")}
                              className={`w-full px-4 py-2 text-left hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm ${getColorClasses(fullscreenNote.color).text}`}
                            >
                              1. Numbers
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setIsPopupFullscreen(!isPopupFullscreen)}
                        className={`${getColorClasses(fullscreenNote.color).text} hover:opacity-70 transition-opacity p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg`}
                        title={isPopupFullscreen ? "Exit fullscreen" : "Fullscreen"}
                      >
                        {isPopupFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={handleCloseFullscreen}
                        className={`${getColorClasses(fullscreenNote.color).text} hover:opacity-70 transition-opacity p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg`}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {popupEditingField === "text" ? (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newText = e.currentTarget.innerHTML // Use innerHTML to preserve formatting
                        setPopupEditValue(newText)
                        handlePopupSaveEdit()
                      }}
                      onInput={(e) => {
                        setPopupEditValue(e.currentTarget.innerHTML)
                      }}
                      className={`text-base ${getColorClasses(fullscreenNote.color).text} whitespace-pre-wrap focus:outline-none min-h-[200px] p-2`}
                      style={{ textAlign: fullscreenNote.alignment || "left" }}
                      dangerouslySetInnerHTML={{ __html: popupEditValue }}
                    />
                  ) : (
                    <div
                      className={`text-base ${getColorClasses(fullscreenNote.color).text} whitespace-pre-wrap cursor-text hover:opacity-80 transition-opacity`}
                      style={{ textAlign: fullscreenNote.alignment || "left" }}
                      onClick={(e) => handlePopupStartEdit("text", fullscreenNote.text, e)}
                      dangerouslySetInnerHTML={{ __html: fullscreenNote.text }}
                    />
                  )}
                  <div
                    className={`flex items-center gap-4 text-sm ${getColorClasses(fullscreenNote.color).text} opacity-70 pt-4 border-t ${getColorClasses(fullscreenNote.color).border}`}
                  >
                    <span>Source: {fullscreenNote.source}</span>
                    <span>•</span>
                    <span>Updated: {fullscreenNote.timestamp.toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTextToolbar && fullscreenNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed z-[250] ${getColorClasses(fullscreenNote.color).bg} border-2 ${getColorClasses(fullscreenNote.color).border} rounded-xl shadow-2xl p-2 flex items-center gap-1`}
            style={{
              left: textToolbarPosition.x,
              top: textToolbarPosition.y,
              transform: "translateX(-50%)",
            }}
          >
            <button
              onClick={() => applyFormatting("bold")}
              className={`p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded ${getColorClasses(fullscreenNote.color).text} ${currentTextStyles.bold ? "bg-black/20 dark:bg-white/20" : ""}`}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              onClick={() => applyFormatting("italic")}
              className={`p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded ${getColorClasses(fullscreenNote.color).text} ${currentTextStyles.italic ? "bg-black/20 dark:bg-white/20" : ""}`}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              onClick={() => applyFormatting("underline")}
              className={`p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded ${getColorClasses(fullscreenNote.color).text} ${currentTextStyles.underline ? "bg-black/20 dark:bg-white/20" : ""}`}
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-current/20 mx-1" />
            {["1", "3", "5", "7"].map((size) => (
              <button
                key={size}
                onClick={() => applyFontSize(size)}
                className={`px-2 py-1 hover:bg-black/10 dark:hover:bg-white/10 rounded ${getColorClasses(fullscreenNote.color).text} text-xs ${currentFontSize === size ? "bg-black/20 dark:bg-white/20" : ""}`}
              >
                {size === "1" ? "S" : size === "3" ? "M" : size === "5" ? "L" : "XL"}
              </button>
            ))}
            <div className="w-px h-6 bg-current/20 mx-1" />
            {["#000000", "#FF0000", "#0000FF", "#FFA500"].map((color) => (
              <button
                key={color}
                onClick={() => applyFontColor(color)}
                className={`w-6 h-6 rounded border-2 ${currentFontColor === color ? "border-current" : "border-current/30"} hover:scale-110 transition-transform`}
                style={{ backgroundColor: color }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {popupContextMenu && fullscreenNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[200] bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl py-2 min-w-[160px]"
            style={{ left: popupContextMenu.x, top: popupContextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowCustomizeMenu(fullscreenNote.id)
                setPopupContextMenu(null)
              }}
              className="w-full px-4 py-2 text-left hover:bg-accent transition-colors text-sm"
            >
              Customize Color
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDragging && draggedNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.9, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-[200] pointer-events-none"
            style={{
              left: dragPosition.x,
              top: dragPosition.y,
              width: draggedNote.size === 3 ? "400px" : draggedNote.size === 2 ? "320px" : "280px",
            }}
          >
            <div
              className={`backdrop-blur-[2px] ${getColorClasses(draggedNote.color).bg} border-2 ${getColorClasses(draggedNote.color).border} rounded-xl p-4 shadow-2xl`}
            >
              <div className={`font-bold text-lg leading-tight ${getColorClasses(draggedNote.color).text} mb-2`}>
                {draggedNote?.title || "Untitled"}
              </div>
              <div className={`leading-relaxed text-sm ${getColorClasses(draggedNote.color).text}`}>
                {draggedNote.text && draggedNote.text.length > 100
                  ? `${draggedNote.text.substring(0, 100)}...`
                  : draggedNote.text || ""}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add text toolbar for main page text selection */}
      <AnimatePresence>
        {mainPageTextToolbar && mainPageSelectedNoteId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed z-[250] ${(() => {
              const note = storedNotes.find((n) => n.id === mainPageSelectedNoteId)
              const colorClasses = getColorClasses(note?.color)
              return `${colorClasses.bg} border-2 ${colorClasses.border}`
            })()} rounded-xl shadow-2xl p-2 flex items-center gap-1`}
            style={{
              left: mainPageToolbarPosition.x,
              top: mainPageToolbarPosition.y,
              transform: "translateX(-50%)",
            }}
          >
            <button
              onClick={() => applyFormatting("bold", true)}
              className={`p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded ${(() => {
                const note = storedNotes.find((n) => n.id === mainPageSelectedNoteId)
                return getColorClasses(note?.color).text
              })()} ${currentTextStyles.bold ? "bg-black/20 dark:bg-white/20" : ""}`}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              onClick={() => applyFormatting("italic", true)}
              className={`p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded ${(() => {
                const note = storedNotes.find((n) => n.id === mainPageSelectedNoteId)
                return getColorClasses(note?.color).text
              })()} ${currentTextStyles.italic ? "bg-black/20 dark:bg-white/20" : ""}`}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              onClick={() => applyFormatting("underline", true)}
              className={`p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded ${(() => {
                const note = storedNotes.find((n) => n.id === mainPageSelectedNoteId)
                return getColorClasses(note?.color).text
              })()} ${currentTextStyles.underline ? "bg-black/20 dark:bg-white/20" : ""}`}
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-current/20 mx-1" />
            {["1", "3", "5", "7"].map((size) => (
              <button
                key={size}
                onClick={() => applyFontSize(size, true)}
                className={`px-2 py-1 hover:bg-black/10 dark:hover:bg-white/10 rounded ${(() => {
                  const note = storedNotes.find((n) => n.id === mainPageSelectedNoteId)
                  return getColorClasses(note?.color).text
                })()} text-xs ${currentFontSize === size ? "bg-black/20 dark:bg-white/20" : ""}`}
              >
                {size === "1" ? "S" : size === "3" ? "M" : size === "5" ? "L" : "XL"}
              </button>
            ))}
            <div className="w-px h-6 bg-current/20 mx-1" />
            {["#000000", "#FF0000", "#0000FF", "#FFA500"].map((color) => (
              <button
                key={color}
                onClick={() => applyFontColor(color, true)}
                className={`w-6 h-6 rounded border-2 ${currentFontColor === color ? "border-current" : "border-current/30"} hover:scale-110 transition-transform`}
                style={{ backgroundColor: color }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {notesFilter === "calendar" ? (
        <div className="flex-1 overflow-auto">
          <div className="mx-2 py-6">
            <NotesCalendarView />
          </div>
        </div>
      ) : displayNotes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {searchQuery
                ? "No notes found matching your search."
                : openFolderId
                  ? "This folder is empty."
                  : "No sticky notes yet. Create sticky notes or highlight text to save notes here."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto my-0 mx-0 py-6 px-1">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full auto-rows-fr overflow-hidden p-2 select-none"
            style={{ gridAutoFlow: "dense" }}
          >
            {displayNotes.map((note, index) => {
              const isSelected = selectedNotes.includes(note.id)
              const isMerged = note.type === "merged"
              const isBeingDragged = draggedNote?.id === note.id
              const isDragOver = dragOverNoteId === note.id
              const colorClasses = getColorClasses(note.color)
              const gridSpanClasses = getGridSpanClasses(note.size, isMerged)
              const isEditingTitle = editingNoteId === note.id && editingField === "title"
              const isEditingText = editingNoteId === note.id && editingField === "text"

              const hoverOffset =
                isSelected && !isBeingDragged
                  ? {
                      x: (mousePosition.x - window.innerWidth / 2) * 0.02,
                      y: (mousePosition.y - window.innerHeight / 2) * 0.02,
                    }
                  : { x: 0, y: 0 }

              return (
                <motion.div
                  key={note.id}
                  data-note-id={note.id}
                  initial={false}
                  animate={{
                    opacity: isBeingDragged ? 0.3 : 1,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                  onContextMenu={(e) => handleContextMenu(e, note.id, isMerged ? "folder" : "note")}
                  onMouseDown={(e) => {
                    if (isSelected && !isEditingTitle && !isEditingText) {
                      handleMouseDown(e, note)
                    }
                  }}
                  onClick={(e) => {
                    if (!isSelected && !isEditingTitle && !isEditingText) {
                      handleNoteClick(note, e)
                    }
                  }}
                  className={`relative rounded-xl border p-4 transition-all duration-150 ${gridSpanClasses} ${
                    isMerged
                      ? `bg-transparent border-2 ${colorClasses.border} hover:${colorClasses.border}/70 cursor-pointer`
                      : isSelected
                        ? // Only color differentiation with ring, no size change, no hover effects
                          `backdrop-blur-[2px] ${colorClasses.bg} ${colorClasses.border} shadow-2xl cursor-move ring-4 ring-primary/30 border-4`
                        : `backdrop-blur-[2px] ${colorClasses.bg} ${colorClasses.border}/50 hover:${colorClasses.border}/70 cursor-pointer`
                  } ${draggedNote?.id === note.id ? "pointer-events-none" : ""}`}
                  style={{
                    userSelect: draggedNote ? "none" : "auto",
                    ...(isMerged || note.size === 2
                      ? { minHeight: "400px" }
                      : note.size === 3
                        ? { minHeight: "600px" }
                        : {}),
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      toggleNoteSelection(note.id)
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                    className={cn(
                      "absolute top-2 right-2 p-1.5 rounded-full transition-colors duration-200 z-10",
                      isSelected && "bg-primary/20",
                      !isSelected && "hover:bg-black/10 dark:hover:bg-white/10",
                    )}
                  >
                    {isSelected ? (
                      <CheckCircle2 className={`h-5 w-5 ${colorClasses.text} drop-shadow-lg`} />
                    ) : (
                      <Circle className={`h-5 w-5 ${colorClasses.text} opacity-50`} />
                    )}
                  </button>

                  {isMerged && note.mergedNotes ? (
                    <div className="space-y-4 h-full flex flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <div className={`flex items-center gap-2 ${colorClasses.bg} px-3 py-1.5 rounded-full`}>
                          <Layers className={`h-4 w-4 ${colorClasses.text}`} />
                          <span className={`text-sm font-semibold ${colorClasses.text}`}>{note.mergedCount}</span>
                        </div>
                        {renamingFolderId === note.id ? (
                          <Input
                            value={folderRenameValue}
                            onChange={(e) => setFolderRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleFolderRenameSubmit(note.id, folderRenameValue)
                              } else if (e.key === "Escape") {
                                handleFolderRenameCancel()
                              }
                            }}
                            onBlur={() => handleFolderRenameSubmit(note.id, folderRenameValue)}
                            className="h-7 text-sm px-2 flex-1"
                            placeholder="Folder title..."
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <div
                            className="flex-1 text-center cursor-text"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFolderRename(note.id)
                            }}
                          >
                            <span className={`text-sm font-medium ${colorClasses.text}`}>
                              {folderTitles[note.id] || "Untitled Folder"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        {note.mergedNotes.slice(0, 4).map((mergedNote) => {
                          const mergedColorClasses = getColorClasses(mergedNote.color)
                          return (
                            <div
                              key={mergedNote.id}
                              className={`backdrop-blur-[2px] ${mergedColorClasses.bg} border ${mergedColorClasses.border}/50 rounded-lg p-3 text-xs`}
                            >
                              <div className={`font-bold ${mergedColorClasses.text} mb-1 line-clamp-1`}>
                                {mergedNote?.title || "Untitled"}
                              </div>
                              <div className={`${mergedColorClasses.text} line-clamp-3`}>{mergedNote?.text || ""}</div>
                            </div>
                          )
                        })}
                        {note.mergedCount && note.mergedCount > 4 && (
                          <div
                            className={`backdrop-blur-[2px] ${colorClasses.bg} border ${colorClasses.border}/50 rounded-lg p-3 flex items-center justify-center`}
                          >
                            <span className={`text-sm font-semibold ${colorClasses.text}`}>
                              +{note.mergedCount - 4} more
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {isEditingTitle ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit()
                            } else if (e.key === "Escape") {
                              handleCancelEdit()
                            }
                          }}
                          onBlur={handleSaveEdit}
                          className={`w-full font-bold text-lg leading-tight ${colorClasses.text} bg-transparent border-b-2 ${colorClasses.border} focus:outline-none px-1`}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div
                          className={`font-bold text-lg leading-tight ${colorClasses.text} ${!isSelected ? "cursor-text hover:opacity-80" : ""} transition-opacity`}
                          onClick={(e) => {
                            if (!isSelected) {
                              handleStartEdit(note.id, "title", note?.title || "", e)
                            }
                          }}
                        >
                          {note?.title || "Untitled"}
                        </div>
                      )}

                      {isEditingText ? (
                        <div
                          className={`w-full leading-relaxed text-sm ${colorClasses.text} bg-transparent focus-within:outline-none`}
                          style={{ textAlign: note.alignment || "left" }}
                          contentEditable
                          suppressContentEditableWarning
                          onInput={(e) => setEditValue(e.currentTarget.innerHTML)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              handleCancelEdit()
                            }
                            // Allow Enter for new lines, use Ctrl+Enter to save
                            if (e.key === "Enter" && e.ctrlKey) {
                              handleSaveEdit()
                            }
                          }}
                          onBlur={handleSaveEdit}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          dangerouslySetInnerHTML={{ __html: editValue }}
                          ref={(el) => {
                            if (el && isEditingText) {
                              el.focus()
                              const range = document.createRange()
                              const sel = window.getSelection()
                              range.selectNodeContents(el)
                              range.collapse(false)
                              sel?.removeAllRanges()
                              sel?.addRange(range)
                            }
                          }}
                        />
                      ) : (
                        <div
                          className={`leading-relaxed text-sm ${colorClasses.text} ${!isSelected ? "cursor-text hover:opacity-80" : ""} transition-opacity`}
                          style={{ textAlign: note.alignment || "left" }}
                          onClick={(e) => {
                            if (!isSelected) {
                              handleStartEdit(note.id, "text", note.text, e)
                            }
                          }}
                          dangerouslySetInnerHTML={{ __html: note.text }}
                        />
                      )}

                      <div className="flex justify-between items-center">
                        {note.type === "sticky-note" && <StickyNote className={`h-4 w-4 ${colorClasses.text}`} />}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export { NotesPage as StorageView }
