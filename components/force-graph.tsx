"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import * as THREE from "three" // Import THREE

// Dynamically import ForceGraph3D with no SSR
const ForceGraph3D = dynamic(() => import("react-force-graph-3d").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-primary/50 text-[15px] font-ai">Loading 3D graph...</div>
    </div>
  ),
})

// Define the node and link types
interface GraphNode {
  id: string
  name: string
  val?: number
  color?: string
  group?: number
}

interface GraphLink {
  source: string
  target: string
  value?: number
}

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

// Sample data for the graph
const sampleData: GraphData = {
  nodes: [
    { id: "ai", name: "AI", val: 20, color: "#80192e", group: 1 },
    { id: "nlp", name: "NLP", val: 15, group: 1 },
    { id: "ml", name: "Machine Learning", val: 15, group: 1 },
    { id: "dl", name: "Deep Learning", val: 15, group: 1 },
    { id: "cv", name: "Computer Vision", val: 12, group: 2 },
    { id: "nlg", name: "Natural Language Generation", val: 12, group: 2 },
    { id: "nlu", name: "Natural Language Understanding", val: 12, group: 2 },
    { id: "rl", name: "Reinforcement Learning", val: 10, group: 3 },
    { id: "nn", name: "Neural Networks", val: 10, group: 3 },
    { id: "transformer", name: "Transformers", val: 10, group: 3 },
    { id: "llm", name: "Large Language Models", val: 18, color: "#80192e", group: 4 },
    { id: "gpt", name: "GPT", val: 15, group: 4 },
    { id: "bert", name: "BERT", val: 12, group: 4 },
  ],
  links: [
    { source: "ai", target: "nlp" },
    { source: "ai", target: "ml" },
    { source: "ai", target: "dl" },
    { source: "ai", target: "llm" },
    { source: "nlp", target: "nlg" },
    { source: "nlp", target: "nlu" },
    { source: "ml", target: "dl" },
    { source: "ml", target: "rl" },
    { source: "dl", target: "nn" },
    { source: "dl", target: "transformer" },
    { source: "llm", target: "gpt" },
    { source: "llm", target: "bert" },
    { source: "transformer", target: "llm" },
    { source: "cv", target: "dl" },
    { source: "nn", target: "transformer" },
  ],
}

// Get color based on group
const getGroupColor = (group: number): string => {
  const colors = [
    "#ad0f39", // Vibrant primary red
    "#e01a4f", // Brighter red
    "#c9184a", // Medium vibrant red
    "#ff4d6d", // Light vibrant red
  ]
  return colors[group % colors.length]
}

interface ForceGraphProps {
  fullSize?: boolean
}

// Increase node sizes and text scaling
const createTextSprite = (node: GraphNode, fullSize: boolean) => {
  // Create a canvas for the text
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  if (!context) return null

  // Increase font size by 30%
  const fontSize = Math.max(18, (node.val || 10) * (fullSize ? 2 : 1.6))
  canvas.width = node.name.length * fontSize * 0.9
  canvas.height = fontSize * 2.5

  // Draw background with rounded corners
  context.fillStyle = "rgba(0, 0, 0, 0.7)"
  context.beginPath()
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fill()

  // Draw text with larger font
  context.font = `${fontSize}px Arial, sans-serif`
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillStyle = node.color || getGroupColor(node.group || 0)
  context.fillText(node.name, canvas.width / 2, canvas.height / 2)

  // Create sprite from canvas
  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({ map: texture })
  const sprite = new THREE.Sprite(material)

  // Increase scale by 40%
  const scale = Math.max(3.5, (node.val || 10) / (fullSize ? 2.2 : 3))
  sprite.scale.set(scale * 2.5, scale * 1.2, 1)

  return sprite
}

// Create a simple 2D force graph as a fallback
function SimpleForceGraph({ fullSize = false }: ForceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = document.querySelector(".graph-container")?.clientWidth || 0
      setDimensions({
        width: containerWidth > 0 ? containerWidth : window.innerWidth / 3,
        height: fullSize ? window.innerHeight * 0.8 : window.innerHeight * 0.4,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
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
        <h3 className="text-[15px] font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Knowledge Graph
        </h3>
      </div>
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full w-full"
        style={{ height: dimensions.height || 300 }}
      >
        <div className="text-center p-4">
          <div className="text-primary/70 text-[15px] mb-2">Knowledge Graph</div>
          <div className="text-primary/50 text-[15px]">Visualizing AI concepts and their relationships</div>
        </div>
      </div>
    </div>
  )
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
        <h3 className="text-[16px] font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Knowledge Graph
        </h3>
      </div>

      <div
        ref={containerRef}
        className="graph-container flex items-center justify-center"
        style={{ width: "100%", height: dimensions.height || 300 }}
      >
        <div className="text-center p-4">
          <div className="text-primary/70 text-[15px] mb-2">Knowledge Graph Visualization</div>
          <div className="text-primary/50 text-[13px]">A visualization of AI concepts and their relationships.</div>
        </div>
      </div>
    </div>
  )
}
