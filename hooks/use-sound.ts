import { useCallback, useRef, useEffect } from 'react'

export type SoundType = 
  | 'click' 
  | 'navigation' 
  | 'typing' 
  | 'notification' 
  | 'success' 
  | 'error' 
  | 'hover'
  | 'toggle'
  | 'expand'
  | 'collapse'

export type SoundTheme = 
  | 'default' 
  | 'minimal' 
  | 'retro' 
  | 'nature' 
  | 'electronic'

interface SoundConfig {
  enabled: boolean
  volume: number
  theme: SoundTheme
}

interface SoundDefinition {
  frequency: number
  duration: number
  type: OscillatorType
  volume?: number
  fadeIn?: number
  fadeOut?: number
}

// Sound theme definitions
const soundThemes: Record<SoundTheme, Record<SoundType, SoundDefinition>> = {
  default: {
    click: { frequency: 800, duration: 100, type: 'sine', volume: 0.3 },
    navigation: { frequency: 600, duration: 150, type: 'sine', volume: 0.4 },
    typing: { frequency: 400, duration: 50, type: 'square', volume: 0.2 },
    notification: { frequency: 880, duration: 300, type: 'sine', volume: 0.5 },
    success: { frequency: 1000, duration: 200, type: 'sine', volume: 0.4 },
    error: { frequency: 300, duration: 400, type: 'sawtooth', volume: 0.4 },
    hover: { frequency: 1200, duration: 80, type: 'sine', volume: 0.2 },
    toggle: { frequency: 700, duration: 120, type: 'triangle', volume: 0.3 },
    expand: { frequency: 500, duration: 200, type: 'sine', volume: 0.3, fadeIn: 50 },
    collapse: { frequency: 300, duration: 150, type: 'sine', volume: 0.3, fadeOut: 50 }
  },
  minimal: {
    click: { frequency: 1000, duration: 30, type: 'sine', volume: 0.2 },
    navigation: { frequency: 800, duration: 50, type: 'sine', volume: 0.25 },
    typing: { frequency: 600, duration: 20, type: 'sine', volume: 0.15 },
    notification: { frequency: 1200, duration: 100, type: 'sine', volume: 0.3 },
    success: { frequency: 1400, duration: 80, type: 'sine', volume: 0.25 },
    error: { frequency: 400, duration: 150, type: 'sine', volume: 0.3 },
    hover: { frequency: 1500, duration: 25, type: 'sine', volume: 0.15 },
    toggle: { frequency: 900, duration: 40, type: 'sine', volume: 0.2 },
    expand: { frequency: 800, duration: 60, type: 'sine', volume: 0.2 },
    collapse: { frequency: 600, duration: 40, type: 'sine', volume: 0.2 }
  },
  retro: {
    click: { frequency: 800, duration: 150, type: 'square', volume: 0.4 },
    navigation: { frequency: 600, duration: 200, type: 'square', volume: 0.5 },
    typing: { frequency: 400, duration: 80, type: 'square', volume: 0.3 },
    notification: { frequency: 1000, duration: 400, type: 'square', volume: 0.6 },
    success: { frequency: 1200, duration: 300, type: 'square', volume: 0.5 },
    error: { frequency: 200, duration: 500, type: 'sawtooth', volume: 0.5 },
    hover: { frequency: 1400, duration: 100, type: 'square', volume: 0.3 },
    toggle: { frequency: 700, duration: 180, type: 'square', volume: 0.4 },
    expand: { frequency: 500, duration: 250, type: 'square', volume: 0.4 },
    collapse: { frequency: 300, duration: 200, type: 'square', volume: 0.4 }
  },
  nature: {
    click: { frequency: 2000, duration: 80, type: 'sine', volume: 0.25 },
    navigation: { frequency: 1500, duration: 120, type: 'triangle', volume: 0.3 },
    typing: { frequency: 3000, duration: 40, type: 'sine', volume: 0.15 },
    notification: { frequency: 1800, duration: 250, type: 'triangle', volume: 0.4 },
    success: { frequency: 2200, duration: 180, type: 'sine', volume: 0.35 },
    error: { frequency: 150, duration: 300, type: 'triangle', volume: 0.3 },
    hover: { frequency: 2500, duration: 60, type: 'sine', volume: 0.2 },
    toggle: { frequency: 1200, duration: 100, type: 'triangle', volume: 0.25 },
    expand: { frequency: 1000, duration: 180, type: 'triangle', volume: 0.3, fadeIn: 40 },
    collapse: { frequency: 800, duration: 140, type: 'triangle', volume: 0.3, fadeOut: 40 }
  },
  electronic: {
    click: { frequency: 1200, duration: 120, type: 'sawtooth', volume: 0.35 },
    navigation: { frequency: 900, duration: 180, type: 'sawtooth', volume: 0.45 },
    typing: { frequency: 1800, duration: 60, type: 'triangle', volume: 0.25 },
    notification: { frequency: 1600, duration: 350, type: 'sawtooth', volume: 0.55 },
    success: { frequency: 2000, duration: 250, type: 'triangle', volume: 0.45 },
    error: { frequency: 100, duration: 450, type: 'sawtooth', volume: 0.45 },
    hover: { frequency: 2200, duration: 90, type: 'triangle', volume: 0.25 },
    toggle: { frequency: 1000, duration: 150, type: 'sawtooth', volume: 0.35 },
    expand: { frequency: 700, duration: 220, type: 'sawtooth', volume: 0.35, fadeIn: 60 },
    collapse: { frequency: 500, duration: 170, type: 'sawtooth', volume: 0.35, fadeOut: 60 }
  }
}

const DEFAULT_CONFIG: SoundConfig = {
  enabled: true,
  volume: 0.7,
  theme: 'default'
}

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const configRef = useRef<SoundConfig>(DEFAULT_CONFIG)

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.warn('Web Audio API not supported:', error)
      }
    }
  }, [])

  // Load config from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('sound-config')
      if (savedConfig) {
        try {
          configRef.current = { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) }
        } catch (error) {
          console.warn('Error loading sound config:', error)
        }
      }
    }
  }, [])

  const saveConfig = useCallback((config: Partial<SoundConfig>) => {
    configRef.current = { ...configRef.current, ...config }
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound-config', JSON.stringify(configRef.current))
    }
  }, [])

  const playSound = useCallback((soundType: SoundType) => {
    if (!configRef.current.enabled || !audioContextRef.current) return

    try {
      const ctx = audioContextRef.current
      const soundDef = soundThemes[configRef.current.theme][soundType]
      
      if (!soundDef) return

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(soundDef.frequency, ctx.currentTime)
      oscillator.type = soundDef.type
      
      const volume = (soundDef.volume || 0.5) * configRef.current.volume
      
      if (soundDef.fadeIn) {
        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + soundDef.fadeIn / 1000)
      } else {
        gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      }
      
      if (soundDef.fadeOut) {
        const fadeOutStart = ctx.currentTime + (soundDef.duration - soundDef.fadeOut) / 1000
        gainNode.gain.setValueAtTime(volume, fadeOutStart)
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + soundDef.duration / 1000)
      } else {
        gainNode.gain.setValueAtTime(0, ctx.currentTime + soundDef.duration / 1000)
      }
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + soundDef.duration / 1000)
    } catch (error) {
      console.warn('Error playing sound:', error)
    }
  }, [])

  const updateConfig = useCallback((config: Partial<SoundConfig>) => {
    saveConfig(config)
  }, [saveConfig])

  const getConfig = useCallback(() => configRef.current, [])

  return {
    playSound,
    updateConfig,
    getConfig,
    soundThemes: Object.keys(soundThemes) as SoundTheme[]
  }
}