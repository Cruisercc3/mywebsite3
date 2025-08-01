"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatHistoryProps {
  messages: Message[]
}

interface SubChat {
  id: string
  name: string
}

interface Conversation {
  id: string
  name: string
  active: boolean
  subChats?: SubChat[]
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { toggleSidebar } = useSidebar()

  // Group messages by conversation (for this demo, we'll create fake conversations)
  const conversations: Conversation[] = [
    { id: "current", name: "Current Chat", active: true },
    {
      id: "prev1",
      name: "Previous Chat 1",
      active: false,
      subChats: [
        { id: "prev1-sub1", name: "Sub Chat 1.1" },
        { id: "prev1-sub2", name: "Sub Chat 1.2" },
      ],
    },
    { id: "prev2", name: "Previous Chat 2", active: false },
  ]

  return (
    <Sidebar collapsible="offcanvas" variant="floating" className="w-full">
      <SidebarHeader className="p-3 space-y-3 bg-gradient-to-b from-primary/10 to-transparent rounded-t-xl">
        <div className="flex items-center justify-between">
          <motion.h2
            className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Chat History
          </motion.h2>
          <SidebarTrigger className="text-primary hover:text-primary/80 transition-all duration-300" />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-primary/50" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8 rounded-full border-primary/20 focus-visible:ring-primary/30 h-8 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/70 font-medium text-xs">Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <AnimatePresence>
                {conversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={conversation.active}
                        className={cn(
                          "flex justify-between rounded-xl text-sm py-1.5",
                          conversation.active && "font-medium bg-primary/10",
                        )}
                      >
                        <motion.span
                          className="glow-text"
                          whileHover={{
                            textShadow: "0 0 8px rgba(var(--primary-rgb), 0.7)",
                          }}
                        >
                          {conversation.name}
                        </motion.span>
                        <span className="text-xs text-primary/60">{new Date().toLocaleDateString()}</span>
                      </SidebarMenuButton>

                      {/* Sub Chats */}
                      {conversation.subChats && conversation.subChats.length > 0 && (
                        <SidebarMenuSub>
                          {conversation.subChats.map((subChat) => (
                            <SidebarMenuSubItem key={subChat.id}>
                              <SidebarMenuSubButton>{subChat.name}</SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-primary/10" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/70 font-medium text-xs">Message Previews</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-2 p-2">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02, x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={cn(
                        "p-2 rounded-xl text-xs",
                        message.role === "user" ? "bg-primary/15 border-l-2 border-primary" : "bg-secondary/70",
                      )}
                    >
                      <div className="font-medium text-primary/90">{message.role === "user" ? "You" : "AI"}</div>
                      <motion.div
                        className="truncate glow-text"
                        whileHover={{
                          textShadow: "0 0 8px rgba(var(--primary-rgb), 0.7)",
                        }}
                      >
                        {message.content}
                      </motion.div>
                      <div className="text-xs text-primary/60 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-primary/50 p-4 text-xs">No messages yet</div>
                )}
              </div>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2 bg-gradient-to-t from-primary/10 to-transparent rounded-b-xl">
        <Button
          className="w-full rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-102 text-xs py-1.5 h-auto"
          variant="outline"
        >
          <Plus className="mr-2 h-3.5 w-3.5" />
          New Chat
        </Button>
        <Button
          className="w-full rounded-xl hover:bg-primary/5 text-primary/80 transition-all duration-300 text-xs py-1 h-auto"
          variant="ghost"
          size="sm"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Clear History
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
