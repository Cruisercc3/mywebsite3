"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, X, MessageSquare, Brain, StickyNote, HelpCircle, Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/use-sound"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatItem {
  id: string
  name: string
  active: boolean
  subChats?: ChatItem[]
}

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  chatId: string | null
}

interface SidebarProps {
  isOpen: boolean
  messages: Message[]
  className?: string
  onToggle: () => void
  activeChatId: string
  onChatSelect: (chatId: string) => void
  onQuestionClick: (question: string) => void
  onCreateSubChat: (parentId: string) => void
  onClick?: (e: React.MouseEvent) => void
  conversations: ChatItem[]
}

export function Sidebar({
  isOpen,
  messages,
  className,
  onToggle,
  activeChatId,
  onChatSelect,
  onCreateSubChat,
  onClick,
  conversations: initialConversations,
}: SidebarProps) {
  const { playSound, isEnabled } = useSound()
  const [searchQuery, setSearchQuery] = useState("")
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, chatId: null })
  const [conversations, setConversations] = useState<ChatItem[]>(initialConversations)
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set())
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setConversations(initialConversations)
  }, [initialConversations])

  // Prevent sidebar from closing when clicking inside it
  const handleSidebarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onClick) onClick(e)
  }

  // Handle button clicks to dispatch events to main UI
  const handleQuestionClick = () => {
    window.dispatchEvent(new CustomEvent("create-question-popup"))
  }

  const handleStickyNoteClick = () => {
    window.dispatchEvent(
      new CustomEvent("create-sticky-note", {
        detail: {
          text: "New note...",
          isEditable: true,
        },
      }),
    )
  }

  const handleClarificationClick = () => {
    window.dispatchEvent(new CustomEvent("create-clarification-popup"))
  }

  // Handle new chat creation
  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`
    // In a real app, you'd update a global state or call a prop to add this chat
    // For this example, we'll just select it, assuming app/page.tsx handles creation
    onChatSelect(newChatId)
  }

  const handleContextMenu = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault()
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, chatId })
  }

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, chatId: null })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu.visible && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeContextMenu()
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [contextMenu.visible])

  const handleCreateSubChat = () => {
    if (contextMenu.chatId) {
      onCreateSubChat(contextMenu.chatId)
    }
    closeContextMenu()
  }

  const handleSelectChat = (chatId: string) => {
    setSelectedChats((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(chatId)) {
        newSet.delete(chatId)
      } else {
        newSet.add(chatId)
      }
      return newSet
    })
    closeContextMenu()
  }

  const handleDeleteChat = (chatId: string) => {
    const deleteRecursive = (items: ChatItem[]): ChatItem[] => {
      return items.filter((item) => {
        if (item.id === chatId) return false
        if (item.subChats) {
          item.subChats = deleteRecursive(item.subChats)
        }
        return true
      })
    }

    setConversations((prev) => deleteRecursive(prev))
    setSelectedChats((prev) => {
      const newSet = new Set(prev)
      newSet.delete(chatId)
      return newSet
    })
    closeContextMenu()
  }

  const handleCollapseSelected = () => {
    if (selectedChats.size < 2) return

    const selectedArray = Array.from(selectedChats)
    const newChatId = `collapsed-${Date.now()}`
    const newChatName = `Merged Chat (${selectedArray.length} chats)`

    // Create new collapsed chat
    const newChat: ChatItem = {
      id: newChatId,
      name: newChatName,
      active: false,
      subChats: [],
    }

    // Remove selected chats and add the new one
    const removeSelected = (items: ChatItem[]): ChatItem[] => {
      return items.filter((item) => !selectedChats.has(item.id))
    }

    setConversations((prev) => [newChat, ...removeSelected(prev)])
    setSelectedChats(new Set())
    closeContextMenu()
  }

  const renderChatItems = (items: ChatItem[], level = 0) => {
    return items.map((conversation) => (
      <div key={conversation.id} className="space-y-1">
        <div className="flex items-center group">
          <button
            className={cn(
              "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors flex-grow",
              conversation.active
                ? "bg-primary/10 text-primary font-medium"
                : selectedChats.has(conversation.id)
                  ? "bg-blue-500/20 text-blue-600 border border-blue-500/30"
                  : "hover:bg-sidebar-accent text-sidebar-foreground/80",
              level > 0 && "pl-4",
            )}
            style={{ paddingLeft: `${0.5 + level * 1}rem` }}
            onClick={() => {
              if (isEnabled) playSound("navigation")
              onChatSelect(conversation.id)
            }}
            onContextMenu={(e) => handleContextMenu(e, conversation.id)}
          >
            <div className="flex items-center">
              {level === 0 ? (
                <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
              ) : (
                <div className="w-1 h-1 rounded-full bg-primary/40 mr-2 shrink-0 ml-[1px]"></div>
              )}
              <span className="truncate">{conversation.name}</span>
              {selectedChats.has(conversation.id) && (
                <div className="w-2 h-2 rounded-full bg-blue-500 ml-auto mr-1"></div>
              )}
            </div>
          </button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
            onClick={(e) => handleContextMenu(e, conversation.id)}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </div>
        {conversation.subChats && conversation.subChats.length > 0 && (
          <div className="space-y-1 mt-1">{renderChatItems(conversation.subChats, level + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "fixed top-[2px] left-0 z-30 h-screen w-64 bg-sidebar backdrop-blur-sm border-r border-sidebar-border transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className,
      )}
      onClick={handleSidebarClick}
    >
      {/* Header with Theme Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="bg-background/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-primary/10">
            <ThemeToggle />
          </div>
          <h2 className="text-lg font-semibold text-sidebar-foreground">Chats</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0 rounded-full">
          <X className="h-4 w-4" />
          <span className="sr-only">Close Sidebar</span>
        </Button>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-sidebar-foreground/40" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-9 h-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-2 border-b border-sidebar-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-9 justify-center text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent border-sidebar-border"
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="text-sm">New Chat</span>
        </Button>
      </div>

      {/* Conversations List - with adjusted height */}
      <div className="overflow-y-auto sidebar-scroll flex-grow" style={{ height: "calc(100vh - 120px)" }}>
        <div className="p-2 space-y-1">{renderChatItems(conversations)}</div>
      </div>

      {/* Action Buttons - moved higher */}
      <div className="p-2 border-t border-sidebar-border mt-auto" style={{ marginBottom: "20px" }}>
        <div className="grid grid-cols-3 gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 justify-center text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent flex-col py-1"
            onClick={handleQuestionClick}
          >
            <HelpCircle className="h-4 w-4 mb-0.5" />
            <span className="text-[10px]">Question</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 justify-center text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent flex-col py-1"
            onClick={handleStickyNoteClick}
          >
            <StickyNote className="h-4 w-4 mb-0.5" />
            <span className="text-[10px]">Notes</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 justify-center text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent flex-col py-1"
            onClick={handleClarificationClick}
          >
            <Brain className="h-4 w-4 mb-0.5" />
            <span className="text-[10px]">Clarify</span>
          </Button>
        </div>
      </div>

      {contextMenu.visible && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 bg-background border border-primary/20 rounded-md shadow-lg py-1 w-40"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCreateSubChat}
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-primary/10 text-foreground"
          >
            New Sub Chat
          </button>
          <button
            onClick={() => handleSelectChat(contextMenu.chatId!)}
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-primary/10 text-foreground"
          >
            {selectedChats.has(contextMenu.chatId!) ? "Deselect" : "Select"}
          </button>
          {selectedChats.size > 1 && (
            <button
              onClick={handleCollapseSelected}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-primary/10 text-foreground"
            >
              Collapse Selected
            </button>
          )}
          <button
            onClick={() => handleDeleteChat(contextMenu.chatId!)}
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-primary/10 text-foreground text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
