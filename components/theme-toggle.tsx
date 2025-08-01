"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
      document.documentElement.classList.add("theme-dark-blue")
    } else {
      setTheme("light")
      document.documentElement.classList.remove("theme-dark-blue")
    }
  }

  if (!mounted) {
    return <Button variant="ghost" size="sm" disabled className="w-5 h-5 p-0" />
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-5 h-5 p-0 relative rounded-full hover:bg-primary/10 icon-glow"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {theme === "light" ? (
                <Sun className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-primary" />
              )}
            </div>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="text-[10px]">Toggle theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
