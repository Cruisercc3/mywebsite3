"use client"

import { ReactElement, cloneElement, forwardRef } from "react"
import { useSound, type SoundType } from "@/hooks/use-sound"

interface SoundWrapperProps {
  children: ReactElement
  clickSound?: SoundType
  hoverSound?: SoundType
  focusSound?: SoundType
  disabled?: boolean
  className?: string
}

export const SoundWrapper = forwardRef<HTMLElement, SoundWrapperProps>(({
  children,
  clickSound = "click",
  hoverSound,
  focusSound,
  disabled = false,
  className,
}, ref) => {
  const { playSound, isEnabled } = useSound()

  const handleClick = (originalOnClick?: (event: any) => void) => (event: any) => {
    if (!disabled && isEnabled && clickSound) {
      playSound(clickSound)
    }
    if (originalOnClick) {
      originalOnClick(event)
    }
  }

  const handleMouseEnter = (originalOnMouseEnter?: (event: any) => void) => (event: any) => {
    if (!disabled && isEnabled && hoverSound) {
      playSound(hoverSound)
    }
    if (originalOnMouseEnter) {
      originalOnMouseEnter(event)
    }
  }

  const handleFocus = (originalOnFocus?: (event: any) => void) => (event: any) => {
    if (!disabled && isEnabled && focusSound) {
      playSound(focusSound)
    }
    if (originalOnFocus) {
      originalOnFocus(event)
    }
  }

  return cloneElement(children, {
    ref,
    className: className ? `${children.props.className || ''} ${className}`.trim() : children.props.className,
    onClick: handleClick(children.props.onClick),
    onMouseEnter: hoverSound ? handleMouseEnter(children.props.onMouseEnter) : children.props.onMouseEnter,
    onFocus: focusSound ? handleFocus(children.props.onFocus) : children.props.onFocus,
  })
})

SoundWrapper.displayName = "SoundWrapper"