"use client"

import { useCallback } from "react"
import type * as React from "react"
import { motion } from "framer-motion"
import { Home, MessageSquare, Calendar, Settings, StickyNote } from "lucide-react"
import { useTheme } from "next-themes"
import { useSound } from "@/hooks/use-sound"

interface MenuItem {
  icon: React.ElementType
  label: string
  href: string
  gradient: string
  iconColor: string
  action: string | null
}

const menuItems: MenuItem[] = [
  {
    icon: Home,
    label: "Home",
    href: "#",
    gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-primary",
    action: "goToHome",
  },
  {
    icon: MessageSquare,
    label: "Questions",
    href: "#",
    gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-primary",
    action: "toggleBrainView",
  },
  {
    icon: Calendar,
    label: "Insights",
    href: "#",
    gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-primary",
    action: "goToCalendar",
  },
  {
    icon: StickyNote,
    label: "Notes",
    href: "#",
    gradient: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(147,51,234,0.06) 50%, rgba(126,34,206,0) 100%)",
    iconColor: "text-primary",
    action: "goToStorage",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
    gradient: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
    iconColor: "text-primary",
    action: "goToSettings",
  },
]

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
}

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
}

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const sharedTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5,
}

interface GlowMenuProps {
  toggleBrainView?: () => void
  goToHome?: () => void
  goToCalendar?: () => void
  goToStorage?: () => void
  goToSettings?: () => void
}

export function GlowMenu({ toggleBrainView, goToHome, goToCalendar, goToStorage, goToSettings }: GlowMenuProps) {
  const { theme } = useTheme()
  const { playSound } = useSound()

  const isDarkTheme = theme === "dark"

  const handleAction = useCallback(
    (action: string | null, e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!action) return

      // Play navigation sound
      playSound('navigation')

      // Use setTimeout to ensure the action happens after the click event
      setTimeout(() => {
        switch (action) {
          case "toggleBrainView":
            toggleBrainView?.()
            break
          case "goToHome":
            goToHome?.()
            break
          case "goToCalendar":
            goToCalendar?.()
            break
          case "goToStorage":
            goToStorage?.()
            break
          case "goToSettings":
            goToSettings?.()
            break
        }
      }, 0)
    },
    [toggleBrainView, goToHome, goToCalendar, goToStorage, goToSettings, playSound],
  )

  return (
    <motion.nav
      className="p-2 rounded-2xl bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-lg border border-border/40 shadow-lg relative overflow-hidden"
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        className={`absolute -inset-2 bg-gradient-radial from-transparent ${
          isDarkTheme
            ? "via-primary/30 via-30% via-primary/20 via-60% via-primary/10 via-90%"
            : "via-primary/20 via-30% via-primary/15 via-60% via-primary/10 via-90%"
        } to-transparent rounded-3xl z-0 pointer-events-none`}
        variants={navGlowVariants}
      />
      <ul className="flex items-center gap-1 relative z-10">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.li key={item.label} className="relative">
              <motion.div
                className="block rounded-xl overflow-visible group relative"
                style={{ perspective: "600px" }}
                whileHover="hover"
                initial="initial"
              >
                <motion.div
                  className="absolute inset-0 z-0 pointer-events-none"
                  variants={glowVariants}
                  style={{
                    background: item.gradient,
                    opacity: 0,
                    borderRadius: "16px",
                  }}
                />
                <motion.button
                  type="button"
                  onClick={(e) => handleAction(item.action, e)}
                  className="flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent text-muted-foreground group-hover:text-foreground transition-colors rounded-xl border-0 outline-none cursor-pointer"
                  variants={itemVariants}
                  transition={sharedTransition}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
                >
                  <span className="transition-colors duration-300 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-[18px]">{item.label}</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={(e) => handleAction(item.action, e)}
                  className="flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent text-muted-foreground group-hover:text-foreground transition-colors rounded-xl border-0 outline-none cursor-pointer"
                  variants={backVariants}
                  transition={sharedTransition}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "center top", rotateX: 90 }}
                >
                  <span className="transition-colors duration-300 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-[18px]">{item.label}</span>
                </motion.button>
              </motion.div>
            </motion.li>
          )
        })}
      </ul>
    </motion.nav>
  )
}
