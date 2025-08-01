"use client"

import { createContext, useContext, ReactNode } from "react"
import { useSound as useSoundHook } from "@/hooks/use-sound"

interface SoundContextType {
  playSound: (soundType: import("@/hooks/use-sound").SoundType) => void
  isEnabled: boolean
  volume: number
  soundType: "soft" | "modern" | "minimal"
}

const SoundContext = createContext<SoundContextType | null>(null)

interface SoundProviderProps {
  children: ReactNode
}

export function SoundProvider({ children }: SoundProviderProps) {
  const soundHook = useSoundHook()

  return (
    <SoundContext.Provider value={{
      playSound: soundHook.playSound,
      isEnabled: soundHook.isEnabled,
      volume: soundHook.volume,
      soundType: soundHook.soundType,
    }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useGlobalSound() {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error("useGlobalSound must be used within a SoundProvider")
  }
  return context
}