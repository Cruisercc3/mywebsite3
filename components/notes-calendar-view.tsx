"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, X, Edit, Check } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CalendarNote {
  id: string
  title: string
  content: string
  day: number
  timeSlot: number
  color: string
  position: { x: number; y: number }
}

const noteColors = [
  "bg-yellow-200/90 border-yellow-400/50",
  "bg-blue-200/90 border-blue-400/50",
  "bg-green-200/90 border-green-400/50",
  "bg-pink-200/90 border-pink-400/50",
  "bg-purple-200/90 border-purple-400/50",
  "bg-orange-200/90 border-orange-400/50",
]

export function NotesCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())
  const [notes, setNotes] = useState<CalendarNote[]>([])
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [draggedNote, setDraggedNote] = useState<string | null>(null)

  // Generate days for mini calendar
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1
    return day > 0 && day <= daysInMonth ? day : null
  })

  // Get week days for current selected day
  const getWeekDays = () => {
    const date = new Date(year, month, selectedDay)
    const dayOfWeek = date.getDay()
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - dayOfWeek)

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      return day
    })
  }

  const weekDays = getWeekDays()
  const weekDayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const timeSlots = Array.from({ length: 24 }, (_, i) => i) // 0-23 hours

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handlePrevWeek = () => {
    const newDate = new Date(year, month, selectedDay - 7)
    setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1))
    setSelectedDay(newDate.getDate())
  }

  const handleNextWeek = () => {
    const newDate = new Date(year, month, selectedDay + 7)
    setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1))
    setSelectedDay(newDate.getDate())
  }

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
  }

  const handleTimeSlotClick = (dayIndex: number, timeSlot: number, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const newNote: CalendarNote = {
      id: `note-${Date.now()}`,
      title: "",
      content: "",
      day: dayIndex,
      timeSlot,
      color: noteColors[Math.floor(Math.random() * noteColors.length)],
      position: { x: rect.left, y: rect.top },
    }
    setNotes([...notes, newNote])
    setEditingNote(newNote.id)
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const handleNoteChange = (id: string, field: "title" | "content", value: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, [field]: value } : note)))
  }

  const formatTime = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 PM"
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`
  }

  return (
    <div className="flex gap-4 p-6 pl-0 pr-0 mx-0 items-start">
      {/* Left Sidebar - Mini Calendar (20% width) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-1/5 bg-background/40 backdrop-blur-lg rounded-xl border border-primary/10 p-4 shadow-lg overflow-auto max-h-[500px]"
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            {currentDate.toLocaleDateString("default", { month: "long", year: "numeric" })}
          </h3>
          <div className="flex gap-1">
            <button onClick={handlePrevMonth} className="p-1 rounded-md hover:bg-primary/10 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={handleNextMonth} className="p-1 rounded-md hover:bg-primary/10 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mini Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {weekDayNames.map((day) => (
            <div key={day} className="text-[10px] text-center text-muted-foreground font-medium py-1">
              {day[0]}
            </div>
          ))}
          {calendarDays.map((day, i) => (
            <button
              key={i}
              onClick={() => day && handleDayClick(day)}
              disabled={!day}
              className={cn(
                "aspect-square text-xs rounded-md flex items-center justify-center transition-all",
                day === selectedDay
                  ? "bg-primary text-primary-foreground font-bold shadow-md"
                  : day
                    ? "hover:bg-primary/10 text-foreground"
                    : "invisible",
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Calendar - Week View (80% width) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 bg-background/40 backdrop-blur-lg rounded-xl border border-primary/10 shadow-lg overflow-hidden flex flex-col min-h-[800px]"
      >
        {/* Week Navigation */}
        <div className="flex items-center justify-between p-4 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <button onClick={handlePrevWeek} className="p-2 rounded-md hover:bg-primary/10 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={handleNextWeek} className="p-2 rounded-md hover:bg-primary/10 transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <h2 className="text-lg font-semibold">
            {weekDays[0].toLocaleDateString("default", { month: "long", day: "numeric" })} -{" "}
            {weekDays[6].toLocaleDateString("default", { month: "long", day: "numeric", year: "numeric" })}
          </h2>
        </div>

        {/* Week Grid */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="grid grid-cols-8 min-w-[800px]">
            {/* Time Column */}
            <div className="border-r border-primary/10 bg-background/20">
              <div className="h-12 border-b border-primary/10" /> {/* Header spacer */}
              {timeSlots.map((hour) => (
                <div
                  key={hour}
                  className="h-20 border-b border-primary/10 pr-2 text-right text-xs text-muted-foreground flex items-start pt-1"
                >
                  {formatTime(hour)}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDays.map((date, dayIndex) => (
              <div key={dayIndex} className="border-r border-primary/10 relative">
                {/* Day Header */}
                <div className="h-12 border-b border-primary/10 flex flex-col items-center justify-center bg-background/20">
                  <div className="text-xs text-muted-foreground font-medium">{weekDayNames[date.getDay()]}</div>
                  <div
                    className={cn(
                      "text-lg font-semibold mt-0.5",
                      date.getDate() === new Date().getDate() &&
                        date.getMonth() === new Date().getMonth() &&
                        date.getFullYear() === new Date().getFullYear()
                        ? "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center"
                        : "",
                    )}
                  >
                    {date.getDate()}
                  </div>
                </div>

                {/* Time Slots */}
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    onClick={(e) => handleTimeSlotClick(dayIndex, hour, e)}
                    className="h-20 border-b border-primary/10 hover:bg-primary/5 cursor-pointer transition-colors group relative"
                  >
                    <Plus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}

                {/* Notes for this day */}
                {notes
                  .filter((note) => note.day === dayIndex)
                  .map((note) => (
                    <motion.div
                      key={note.id}
                      drag
                      dragMomentum={false}
                      onDragStart={() => setDraggedNote(note.id)}
                      onDragEnd={(e, info) => {
                        setDraggedNote(null)
                        const newNotes = notes.map((n) =>
                          n.id === note.id
                            ? {
                                ...n,
                                position: {
                                  x: n.position.x + info.offset.x,
                                  y: n.position.y + info.offset.y,
                                },
                              }
                            : n,
                        )
                        setNotes(newNotes)
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "absolute left-1 right-1 rounded-md border p-2 shadow-md cursor-move z-10",
                        note.color,
                        draggedNote === note.id && "shadow-xl z-20",
                      )}
                      style={{
                        top: `${48 + note.timeSlot * 64 + 4}px`,
                        minHeight: "56px",
                      }}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <button
                          onClick={() => setEditingNote(editingNote === note.id ? null : note.id)}
                          className="p-0.5 rounded hover:bg-black/10 transition-colors"
                        >
                          {editingNote === note.id ? <Check className="h-3 w-3" /> : <Edit className="h-3 w-3" />}
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-0.5 rounded hover:bg-black/10 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      {editingNote === note.id ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={note.title}
                            onChange={(e) => handleNoteChange(note.id, "title", e.target.value)}
                            placeholder="Title"
                            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-xs font-bold placeholder-black/40"
                          />
                          <textarea
                            value={note.content}
                            onChange={(e) => handleNoteChange(note.id, "content", e.target.value)}
                            placeholder="Content"
                            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-xs resize-none placeholder-black/40"
                            rows={2}
                          />
                        </div>
                      ) : (
                        <div>
                          {note.title && <div className="text-xs font-bold mb-0.5">{note.title}</div>}
                          {note.content && <div className="text-xs">{note.content}</div>}
                          {!note.title && !note.content && (
                            <div className="text-xs text-black/40">Click edit to add content</div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
