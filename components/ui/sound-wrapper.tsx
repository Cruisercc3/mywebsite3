"use client"

import React, { cloneElement, isValidElement, useCallback } from 'react'
import { useSound, type SoundType } from '@/hooks/use-sound'

interface SoundWrapperProps {
  children: React.ReactNode
  soundType?: SoundType
  disabled?: boolean
  className?: string
}

export function SoundWrapper({ 
  children, 
  soundType = 'click', 
  disabled = false,
  className
}: SoundWrapperProps) {
  const { playSound } = useSound()

  const handleClick = useCallback((originalOnClick?: (e: any) => void) => {
    return (e: React.MouseEvent) => {
      if (!disabled) {
        playSound(soundType)
      }
      originalOnClick?.(e)
    }
  }, [playSound, soundType, disabled])

  const handleMouseEnter = useCallback((originalOnMouseEnter?: (e: any) => void) => {
    return (e: React.MouseEvent) => {
      if (!disabled && soundType !== 'typing') {
        playSound('hover')
      }
      originalOnMouseEnter?.(e)
    }
  }, [playSound, disabled, soundType])

  if (!isValidElement(children)) {
    return <>{children}</>
  }

  const childProps = children.props || {}
  
  return cloneElement(children, {
    ...childProps,
    className: className ? `${childProps.className || ''} ${className}` : childProps.className,
    onClick: handleClick(childProps.onClick),
    onMouseEnter: handleMouseEnter(childProps.onMouseEnter),
  })
}

// Typing sound wrapper for input elements
interface TypingSoundWrapperProps {
  children: React.ReactNode
  disabled?: boolean
}

export function TypingSoundWrapper({ children, disabled = false }: TypingSoundWrapperProps) {
  const { playSound } = useSound()
  
  const handleKeyDown = useCallback((originalOnKeyDown?: (e: any) => void) => {
    return (e: React.KeyboardEvent) => {
      if (!disabled && e.key.length === 1) { // Only play sound for character keys
        playSound('typing')
      }
      originalOnKeyDown?.(e)
    }
  }, [playSound, disabled])

  if (!isValidElement(children)) {
    return <>{children}</>
  }

  const childProps = children.props || {}
  
  return cloneElement(children, {
    ...childProps,
    onKeyDown: handleKeyDown(childProps.onKeyDown),
  })
}