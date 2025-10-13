"use client"

import * as React from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, Globe, MessageSquare, Calendar } from "lucide-react"
import { useClickAway } from "@/hooks/use-click-away"

interface NotesFilter {
  id: string
  label: string
  value: "global" | "local" | "calendar"
  icon: React.ElementType
  color: string
}

const notesFilters: NotesFilter[] = [
  { id: "global", label: "Global", value: "global", icon: Globe, color: "#4ECDC4" },
  { id: "local", label: "Local", value: "local", icon: MessageSquare, color: "#A06CD5" },
  { id: "calendar", label: "Calendar", value: "calendar", icon: Calendar, color: "#FF6B6B" },
]

const IconWrapper = ({
  icon: Icon,
  isHovered,
  color,
}: { icon: React.ElementType; isHovered: boolean; color: string }) => (
  <motion.div className="w-4 h-4 mr-2 relative" initial={false} animate={isHovered ? { scale: 1.2 } : { scale: 1 }}>
    <Icon className="w-4 h-4" />
    {isHovered && (
      <motion.div
        className="absolute inset-0"
        style={{ color }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Icon className="w-4 h-4" strokeWidth={2} />
      </motion.div>
    )}
  </motion.div>
)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

interface NotesFilterDropdownProps {
  currentFilter: "global" | "local" | "calendar"
  onFilterChange: (filter: "global" | "local" | "calendar") => void
}

export default function NotesFilterDropdown({ currentFilter, onFilterChange }: NotesFilterDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedFilter, setSelectedFilter] = React.useState<NotesFilter>(
    notesFilters.find((f) => f.value === currentFilter) || notesFilters[0],
  )
  const [hoveredFilter, setHoveredFilter] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const matchingFilter = notesFilters.find((f) => f.value === currentFilter)
    if (matchingFilter) {
      setSelectedFilter(matchingFilter)
    }
  }, [currentFilter])

  useClickAway(dropdownRef, () => setIsOpen(false))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "justify-between bg-background text-foreground min-w-[120px]",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
            "transition-all duration-200 ease-in-out",
            "border border-primary/10",
            isOpen && "bg-accent text-accent-foreground",
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="flex items-center">
            <IconWrapper icon={selectedFilter.icon} isHovered={false} color={selectedFilter.color} />
            {selectedFilter.label}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "16px",
              height: "16px",
            }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 1, y: 0, height: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              exit={{
                opacity: 0,
                y: 0,
                height: 0,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              className="absolute right-0 top-full mt-2 z-50"
              onKeyDown={handleKeyDown}
            >
              <motion.div
                className={cn(
                  "w-[140px] rounded-lg border border-primary/20",
                  "bg-background/95 backdrop-blur-sm p-1 shadow-lg",
                )}
                initial={{ borderRadius: 8 }}
                animate={{
                  borderRadius: 12,
                  transition: { duration: 0.2 },
                }}
                style={{ transformOrigin: "top" }}
              >
                <motion.div className="py-1 relative" variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div
                    layoutId="hover-highlight"
                    className="absolute inset-x-1 bg-accent rounded-md"
                    animate={{
                      y: notesFilters.findIndex((f) => (hoveredFilter || selectedFilter.id) === f.id) * 36,
                      height: 36,
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0.15,
                      duration: 0.5,
                    }}
                  />
                  {notesFilters.map((filter) => (
                    <motion.button
                      key={filter.id}
                      onClick={() => {
                        setSelectedFilter(filter)
                        onFilterChange(filter.value)
                        setIsOpen(false)
                      }}
                      onHoverStart={() => setHoveredFilter(filter.id)}
                      onHoverEnd={() => setHoveredFilter(null)}
                      className={cn(
                        "relative flex w-full items-center px-3 py-2 text-sm rounded-md",
                        "transition-colors duration-150",
                        "focus:outline-none",
                        selectedFilter.id === filter.id || hoveredFilter === filter.id
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                      whileTap={{ scale: 0.98 }}
                      variants={itemVariants}
                    >
                      <IconWrapper icon={filter.icon} isHovered={hoveredFilter === filter.id} color={filter.color} />
                      {filter.label}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
