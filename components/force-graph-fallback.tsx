"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ForceGraphProps {
  fullSize?: boolean
}

export function ForceGraph({ fullSize = false }: ForceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = document.querySelector(".graph-container")?.clientWidth || 0
      setDimensions({
        width: containerWidth > 0 ? containerWidth : window.innerWidth / 3,
        height: fullSize ? window.innerHeight * 0.8 : window.innerHeight * 0.4,
      })
    }

    // Set initial dimensions
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [fullSize])

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm border border-primary/10 shadow-sm h-full",
        fullSize && "w-full",
      )}
      style={{ width: fullSize ? "100%" : dimensions.width }}
    >
      <div className="absolute top-0 left-0 w-full p-2 z-10 bg-gradient-to-b from-background/80 to-transparent border-b border-primary/5">
        <h3 className="text-sm font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Knowledge Graph
        </h3>
      </div>

      <div
        ref={containerRef}
        className="graph-container flex items-center justify-center"
        style={{ width: "100%", height: dimensions.height || 300 }}
      >
        <div className="text-center p-4">
          <div className="text-primary/70 text-sm mb-2">Knowledge Graph Visualization</div>
          <div className="text-primary/50 text-xs">
            A 3D visualization of AI concepts and their relationships.
            <br />
            (3D graph rendering is currently unavailable)
          </div>
        </div>
      </div>
    </div>
  )
}
