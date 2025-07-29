"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StorageViewProps {
  className?: string
}

interface StoredItem {
  id: string
  text: string
  timestamp: Date
  source?: string
}

export function StorageView({ className }: StorageViewProps) {
  const [storedItems, setStoredItems] = useState<StoredItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    const handleStoreText = (event: CustomEvent) => {
      const { text, source } = event.detail
      if (text) {
        const newItem: StoredItem = {
          id: Date.now().toString(),
          text: text.trim(),
          timestamp: new Date(),
          source: source || "Unknown",
        }
        setStoredItems((prev) => [newItem, ...prev])
      }
    }

    window.addEventListener("store-text", handleStoreText as EventListener)
    return () => window.removeEventListener("store-text", handleStoreText as EventListener)
  }, [])

  const filteredItems = storedItems.filter((item) => item.text.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Storage</h2>
        <p className="text-muted-foreground">Your stored highlighted text and content</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search stored items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No stored items yet. Highlight text and click "Storage" to save it here.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top left" }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 p-4 hover:shadow-md transition-all duration-300 hover:border-primary/20"
            >
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  {item.timestamp.toLocaleDateString()} • {item.source}
                </div>
                <div className="text-foreground leading-relaxed text-sm">
                  {item.text.length > 200 ? `${item.text.substring(0, 200)}...` : item.text}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
