"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface ThemeContextProps {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
  highContrast: boolean
  setHighContrast: (highContrast: boolean) => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
  highContrast: false,
  setHighContrast: () => {},
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [highContrast, setHighContrast] = useState<boolean>(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    const storedHighContrast = localStorage.getItem("highContrast")
    
    if (storedTheme) {
      setTheme(storedTheme === "dark" ? "dark" : "light")
    } else {
      localStorage.setItem("theme", "light")
    }
    
    if (storedHighContrast) {
      setHighContrast(storedHighContrast === "true")
    } else {
      localStorage.setItem("highContrast", "false")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem("highContrast", highContrast.toString())
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [highContrast])

  return <ThemeContext.Provider value={{ theme, setTheme, highContrast, setHighContrast }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
