"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, StickyNote } from "lucide-react"
import NotesFilterDropdown from "./notes-filter-dropdown"
import { NotesCalendarView } from "./notes-calendar-view"
import { Input } from "@/components/ui/input"
import React from "react"

interface StorageViewProps {
  className?: string
}

interface StoredNote {
  id: string
  title: string // Added title field for iPhone-style notes
  text: string
  timestamp: Date
  source?: string
  type: "sticky-note" | "highlight" | "manual"
}

export default function NotesPage({ className }: StorageViewProps) {
  const [storedNotes, setStoredNotes] = useState<StoredNote[]>([
    {
      id: "1",
      title: "OAuth2 Implementation", // Added titles to all sample notes
      text: "Remember to implement the new user authentication flow with OAuth2. This should include proper error handling and user session management.",
      timestamp: new Date(2024, 0, 15),
      source: "Design Meeting",
      type: "manual",
    },
    {
      id: "2",
      title: "Payment Bug Fix",
      text: "Bug in the payment processing module - users are experiencing timeout errors during checkout. Need to investigate the API response times.",
      timestamp: new Date(2024, 0, 14),
      source: "Bug Report",
      type: "highlight",
    },
    {
      id: "3",
      title: "Dashboard Ideas",
      text: "Ideas for the new dashboard: Add dark mode toggle, implement real-time notifications, improve mobile responsiveness, and add user analytics section.",
      timestamp: new Date(2024, 0, 13),
      source: "Brainstorming Session",
      type: "sticky-note",
    },
    {
      id: "4",
      title: "Database Optimization",
      text: "Database optimization needed - queries taking too long on the user analytics table. Consider adding indexes on frequently searched columns.",
      timestamp: new Date(2024, 0, 12),
      source: "Performance Review",
      type: "manual",
    },
    {
      id: "5",
      title: "CSV Export Feature",
      text: "Feature request: Users want the ability to export their data in CSV format. This should include all their profile information and activity history.",
      timestamp: new Date(2024, 0, 11),
      source: "User Feedback",
      type: "highlight",
    },
    {
      id: "6",
      title: "Q2 Roadmap Meeting",
      text: "Meeting notes: Discussed the Q2 roadmap, prioritized mobile app development, and agreed on new hiring goals for the engineering team.",
      timestamp: new Date(2024, 0, 10),
      source: "Team Meeting",
      type: "sticky-note",
    },
    {
      id: "7",
      title: "Security Audit",
      text: "Security audit findings: Need to update SSL certificates, implement two-factor authentication, and review user access permissions across all systems.",
      timestamp: new Date(2024, 0, 9),
      source: "Security Audit",
      type: "manual",
    },
    {
      id: "8",
      title: "Search Feedback",
      text: "Customer feedback: Users love the new search functionality but want more filtering options and the ability to save search queries for future use.",
      timestamp: new Date(2024, 0, 8),
      source: "Customer Survey",
      type: "highlight",
    },
    {
      id: "9",
      title: "Code Review Notes",
      text: "Code review notes: Refactor the user service layer, implement proper error boundaries in React components, and add unit tests for critical functions.",
      timestamp: new Date(2024, 0, 7),
      source: "Code Review",
      type: "sticky-note",
    },
    {
      id: "10",
      title: "Infrastructure Planning",
      text: "Infrastructure planning: Migrate to cloud-native architecture, implement auto-scaling for peak traffic, and set up monitoring and alerting systems.",
      timestamp: new Date(2024, 0, 6),
      source: "Architecture Meeting",
      type: "manual",
    },
    {
      id: "11",
      title: "UX Research Insights",
      text: "UX research insights: Users struggle with the current navigation menu. Consider implementing breadcrumbs and improving the information architecture.",
      timestamp: new Date(2024, 0, 5),
      source: "UX Research",
      type: "highlight",
    },
    {
      id: "12",
      title: "API Documentation",
      text: "API documentation needs updating: Add examples for all endpoints, include error response codes, and create interactive documentation with Swagger.",
      timestamp: new Date(2024, 0, 4),
      source: "Documentation Review",
      type: "sticky-note",
    },
    {
      id: "13",
      title: "Performance Metrics",
      text: "Performance metrics: Page load times have increased by 15% this month. Investigate image optimization, CDN configuration, and database query performance.",
      timestamp: new Date(2024, 0, 3),
      source: "Analytics Report",
      type: "manual",
    },
    {
      id: "14",
      title: "Marketing Campaign",
      text: "Marketing campaign ideas: Launch referral program, create video tutorials for new features, and partner with industry influencers for product promotion.",
      timestamp: new Date(2024, 0, 2),
      source: "Marketing Brainstorm",
      type: "highlight",
    },
    {
      id: "15",
      title: "Technical Debt",
      text: "Technical debt assessment: Legacy code in the user management system needs refactoring. Plan migration to modern frameworks and improve test coverage.",
      timestamp: new Date(2024, 0, 1),
      source: "Tech Debt Review",
      type: "sticky-note",
    },
    {
      id: "16",
      title: "Accessibility Improvements",
      text: "Accessibility improvements needed: Add ARIA labels, improve keyboard navigation, ensure color contrast compliance, and test with screen readers.",
      timestamp: new Date(2023, 11, 31),
      source: "Accessibility Audit",
      type: "manual",
    },
    {
      id: "17",
      title: "Mobile App Feedback",
      text: "Mobile app feedback: Users want offline functionality, push notifications for important updates, and better integration with the web platform.",
      timestamp: new Date(2023, 11, 30),
      source: "Mobile User Survey",
      type: "highlight",
    },
    {
      id: "18",
      title: "Data Backup Strategy",
      text: "Data backup strategy: Implement automated daily backups, test disaster recovery procedures, and ensure compliance with data retention policies.",
      timestamp: new Date(2023, 11, 29),
      source: "IT Security Meeting",
      type: "sticky-note",
    },
    {
      id: "19",
      title: "Integration Requirements",
      text: "Integration requirements: Connect with third-party CRM system, implement webhook notifications, and create data synchronization workflows.",
      timestamp: new Date(2023, 11, 28),
      source: "Integration Planning",
      type: "manual",
    },
    {
      id: "20",
      title: "User Onboarding",
      text: "User onboarding improvements: Create interactive tutorials, simplify the signup process, and add progress indicators for multi-step workflows.",
      timestamp: new Date(2023, 11, 27),
      source: "Onboarding Analysis",
      type: "highlight",
    },
    {
      id: "21",
      title: "Localization Project",
      text: "Localization project: Translate interface to Spanish and French, implement right-to-left language support, and adapt date/time formats for different regions.",
      timestamp: new Date(2023, 11, 26),
      source: "Internationalization Meeting",
      type: "sticky-note",
    },
    {
      id: "22",
      title: "Email System",
      text: "Email system optimization: Reduce bounce rates, implement email templates, add personalization features, and improve delivery tracking.",
      timestamp: new Date(2023, 11, 25),
      source: "Email Marketing Review",
      type: "manual",
    },
    {
      id: "23",
      title: "Social Media Integration",
      text: "Social media integration: Add social login options, implement sharing functionality, and create social media posting automation for content updates.",
      timestamp: new Date(2023, 11, 24),
      source: "Social Media Strategy",
      type: "highlight",
    },
    {
      id: "24",
      title: "Analytics Enhancement",
      text: "Analytics enhancement: Implement custom event tracking, create user behavior funnels, and set up automated reporting for key business metrics.",
      timestamp: new Date(2023, 11, 23),
      source: "Analytics Planning",
      type: "sticky-note",
    },
    {
      id: "25",
      title: "Content Management",
      text: "Content management system: Develop rich text editor, implement content versioning, add collaborative editing features, and create content approval workflows.",
      timestamp: new Date(2023, 11, 22),
      source: "CMS Requirements",
      type: "manual",
    },
    {
      id: "26",
      title: "Search Upgrade",
      text: "Search functionality upgrade: Implement fuzzy search, add auto-complete suggestions, create advanced filtering options, and improve search result ranking.",
      timestamp: new Date(2023, 11, 21),
      source: "Search Improvement",
      type: "highlight",
    },
    {
      id: "27",
      title: "Payment Enhancements",
      text: "Payment system enhancements: Add support for multiple currencies, implement subscription billing, create invoice generation, and improve payment security.",
      timestamp: new Date(2023, 11, 20),
      source: "Payment Integration",
      type: "sticky-note",
    },
    {
      id: "28",
      title: "Notification System",
      text: "Notification system redesign: Create notification preferences, implement real-time updates, add email digest options, and improve notification categorization.",
      timestamp: new Date(2023, 11, 19),
      source: "Notification Planning",
      type: "manual",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [notesFilter, setNotesFilter] = React.useState<"global" | "local" | "calendar">("global")

  useEffect(() => {
    // Handle traditional text storage (highlights, etc.)
    const handleStoreText = (event: CustomEvent) => {
      const { text, source } = event.detail
      if (text) {
        const newNote: StoredNote = {
          id: Date.now().toString(),
          title: text.substring(0, 30) + (text.length > 30 ? "..." : ""), // Auto-generate title from first 30 chars
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
      const { id, text, title } = event.detail // Added title to event handling
      if (text && text.trim()) {
        const newNote: StoredNote = {
          id: `sticky-${id}-${Date.now()}`,
          title: title || text.substring(0, 30) + (text.length > 30 ? "..." : ""), // Use provided title or auto-generate
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

  const filteredNotes = storedNotes.filter(
    (note) =>
      note.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()), // Added title to search functionality
  )

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-4 border-b border-primary/10">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Quick Notes</h2>
          <p className="text-muted-foreground">Your saved sticky notes and highlighted content</p>
        </div>

        <div className="flex items-center justify-center gap-4 relative">
          <div className="max-w-2xl w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <NotesFilterDropdown currentFilter={notesFilter} onFilterChange={setNotesFilter} />
        </div>
      </div>

      {notesFilter === "calendar" ? (
        <div className="flex-1 overflow-auto">
          <div className="mx-2 py-6">
            <NotesCalendarView />
          </div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            No sticky notes yet. Create sticky notes or highlight text to save notes here.
          </p>
        </div>
      ) : (
        <div className="mx-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-yellow-50/95 dark:bg-yellow-900/30 backdrop-blur-sm rounded-xl border border-yellow-400/50 p-4 hover:shadow-md transition-all duration-300 hover:border-yellow-400/70" // Changed to yellow styling like sticky notes
              >
                <div className="space-y-3">
                  <div className="text-lg font-bold text-yellow-800 dark:text-yellow-200 leading-tight">
                    {note.title}
                  </div>
                  <div className="text-yellow-700 dark:text-yellow-300 leading-relaxed text-sm">
                    {note.text.length > 150 ? `${note.text.substring(0, 150)}...` : note.text}
                  </div>
                  {note.type === "sticky-note" && (
                    <div className="flex justify-end">
                      <StickyNote className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { NotesPage as StorageView }
