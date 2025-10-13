"use client"

import * as React from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { useClickAway } from "@/hooks/use-click-away"

interface ZoomLevel {
  id: string
  label: string
  value: number
  icon: React.ElementType
  color: string
}

const zoomLevels: ZoomLevel[] = [
  { id: "50", label: "50%", value: 0.5, icon: ZoomOut, color: "#FF6B6B" },
  { id: "75", label: "75%", value: 0.75, icon: ZoomOut, color: "#F9C74F" },
  { id: "100", label: "100%", value: 1.0, icon: Maximize2, color: "#4ECDC4" },
  { id: "125", label: "125%", value: 1.25, icon: ZoomIn, color: "#45B7D1" },
  { id: "150", label: "150%", value: 1.5, icon: ZoomIn, color: "#A06CD5" },
  { id: "200", label: "200%", value: 2.0, icon: ZoomIn, color: "#E63946" },
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

interface ZoomDropdownProps {
  currentZoom: number
  onZoomChange: (zoom: number) => void
}

export default function ZoomDropdown({ currentZoom, onZoomChange }: ZoomDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedZoom, setSelectedZoom] = React.useState<ZoomLevel>(
    zoomLevels.find((z) => z.value === currentZoom) || zoomLevels[2],
  )
  const [hoveredZoom, setHoveredZoom] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Update selected zoom when currentZoom prop changes
  React.useEffect(() => {
    const matchingZoom = zoomLevels.find((z) => Math.abs(z.value - currentZoom) < 0.01)
    if (matchingZoom) {
      setSelectedZoom(matchingZoom)
    }
  }, [currentZoom])

  // Handle click outside to close dropdown
  useClickAway(dropdownRef, () => setIsOpen(false))

  // Handle keyboard navigation
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
            <IconWrapper icon={selectedZoom.icon} isHovered={false} color={selectedZoom.color} />
            {selectedZoom.label}
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
                      y: zoomLevels.findIndex((z) => (hoveredZoom || selectedZoom.id) === z.id) * 36,
                      height: 36,
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0.15,
                      duration: 0.5,
                    }}
                  />
                  {zoomLevels.map((zoom) => (
                    <motion.button
                      key={zoom.id}
                      onClick={() => {
                        setSelectedZoom(zoom)
                        onZoomChange(zoom.value)
                        setIsOpen(false)
                      }}
                      onHoverStart={() => setHoveredZoom(zoom.id)}
                      onHoverEnd={() => setHoveredZoom(null)}
                      className={cn(
                        "relative flex w-full items-center px-3 py-2 text-sm rounded-md",
                        "transition-colors duration-150",
                        "focus:outline-none",
                        selectedZoom.id === zoom.id || hoveredZoom === zoom.id
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                      whileTap={{ scale: 0.98 }}
                      variants={itemVariants}
                    >
                      <IconWrapper icon={zoom.icon} isHovered={hoveredZoom === zoom.id} color={zoom.color} />
                      {zoom.label}
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
