"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Sound types for different interface actions
export type SoundType = 
  | "click" 
  | "hover" 
  | "success" 
  | "error" 
  | "notification" 
  | "toggle" 
  | "focus" 
  | "navigation"
  | "ambient"

// Sound configuration interface
interface SoundConfig {
  enabled: boolean
  volume: number
  soundType: "soft" | "modern" | "minimal"
}

// Default sound configuration
const DEFAULT_SOUND_CONFIG: SoundConfig = {
  enabled: true,
  volume: 0.3,
  soundType: "soft"
}

// Sound file mappings - using Web Audio API generated tones for now
// In production, you'd replace these with actual audio files
const SOUND_FREQUENCIES = {
  soft: {
    click: { frequency: 800, duration: 0.1, type: "sine" as OscillatorType },
    hover: { frequency: 1000, duration: 0.05, type: "sine" as OscillatorType },
    success: { frequency: 523.25, duration: 0.2, type: "sine" as OscillatorType }, // C5
    error: { frequency: 220, duration: 0.3, type: "triangle" as OscillatorType }, // A3
    notification: { frequency: 659.25, duration: 0.15, type: "sine" as OscillatorType }, // E5
    toggle: { frequency: 698.46, duration: 0.1, type: "sine" as OscillatorType }, // F5
    focus: { frequency: 880, duration: 0.08, type: "sine" as OscillatorType }, // A5
    navigation: { frequency: 493.88, duration: 0.12, type: "sine" as OscillatorType }, // B4
    ambient: { frequency: 261.63, duration: 0.5, type: "sine" as OscillatorType }, // C4
  },
  modern: {
    click: { frequency: 1200, duration: 0.08, type: "square" as OscillatorType },
    hover: { frequency: 1400, duration: 0.04, type: "square" as OscillatorType },
    success: { frequency: 784, duration: 0.15, type: "sine" as OscillatorType },
    error: { frequency: 196, duration: 0.25, type: "sawtooth" as OscillatorType },
    notification: { frequency: 987.77, duration: 0.12, type: "sine" as OscillatorType },
    toggle: { frequency: 1046.5, duration: 0.08, type: "square" as OscillatorType },
    focus: { frequency: 1318.51, duration: 0.06, type: "sine" as OscillatorType },
    navigation: { frequency: 739.99, duration: 0.1, type: "sine" as OscillatorType },
    ambient: { frequency: 329.63, duration: 0.4, type: "triangle" as OscillatorType },
  },
  minimal: {
    click: { frequency: 600, duration: 0.06, type: "sine" as OscillatorType },
    hover: { frequency: 700, duration: 0.03, type: "sine" as OscillatorType },
    success: { frequency: 440, duration: 0.1, type: "sine" as OscillatorType },
    error: { frequency: 165, duration: 0.2, type: "triangle" as OscillatorType },
    notification: { frequency: 554.37, duration: 0.08, type: "sine" as OscillatorType },
    toggle: { frequency: 587.33, duration: 0.06, type: "sine" as OscillatorType },
    focus: { frequency: 659.25, duration: 0.04, type: "sine" as OscillatorType },
    navigation: { frequency: 415.3, duration: 0.08, type: "sine" as OscillatorType },
    ambient: { frequency: 220, duration: 0.3, type: "sine" as OscillatorType },
  }
}

export function useSound() {
  const [config, setConfig] = useState<SoundConfig>(DEFAULT_SOUND_CONFIG)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined" && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        gainNodeRef.current = audioContextRef.current.createGain()
        gainNodeRef.current.connect(audioContextRef.current.destination)
        gainNodeRef.current.gain.value = config.volume
      } catch (error) {
        console.warn("Audio context not supported:", error)
      }
    }
  }, [])

  // Update volume when config changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = config.volume
    }
  }, [config.volume])

  // Load sound configuration from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("sound-config")
      if (savedConfig) {
        try {
          setConfig({ ...DEFAULT_SOUND_CONFIG, ...JSON.parse(savedConfig) })
        } catch (error) {
          console.warn("Failed to parse saved sound config:", error)
        }
      }
    }
  }, [])

  // Save sound configuration to localStorage
  const updateConfig = useCallback((newConfig: Partial<SoundConfig>) => {
    const updatedConfig = { ...config, ...newConfig }
    setConfig(updatedConfig)
    if (typeof window !== "undefined") {
      localStorage.setItem("sound-config", JSON.stringify(updatedConfig))
    }
  }, [config])

  // Play sound function
  const playSound = useCallback((soundType: SoundType) => {
    if (!config.enabled || !audioContextRef.current || !gainNodeRef.current) {
      return
    }

    try {
      const soundConfig = SOUND_FREQUENCIES[config.soundType][soundType]
      if (!soundConfig) return

      // Resume audio context if suspended (required for user interaction)
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume()
      }

      const oscillator = audioContextRef.current.createOscillator()
      const envelope = audioContextRef.current.createGain()

      oscillator.connect(envelope)
      envelope.connect(gainNodeRef.current)

      oscillator.frequency.setValueAtTime(soundConfig.frequency, audioContextRef.current.currentTime)
      oscillator.type = soundConfig.type

      // Create envelope for smooth sound
      const now = audioContextRef.current.currentTime
      envelope.gain.setValueAtTime(0, now)
      envelope.gain.linearRampToValueAtTime(0.8, now + 0.01)
      envelope.gain.exponentialRampToValueAtTime(0.01, now + soundConfig.duration)

      oscillator.start(now)
      oscillator.stop(now + soundConfig.duration)

      // Clean up
      oscillator.onended = () => {
        try {
          oscillator.disconnect()
          envelope.disconnect()
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    } catch (error) {
      console.warn("Failed to play sound:", error)
    }
  }, [config])

  // Preload/test sound function
  const testSound = useCallback((soundType: SoundType) => {
    playSound(soundType)
  }, [playSound])

  return {
    config,
    updateConfig,
    playSound,
    testSound,
    isEnabled: config.enabled,
    volume: config.volume,
    soundType: config.soundType,
  }
}