"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Users, X, ChevronRight, ChevronLeft, ArrowRight, Maximize2, Minimize2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatMessage from "@/components/chat-message"
import { Sidebar } from "@/components/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GlowMenu } from "@/components/glow-menu"
import { CalendarView } from "@/components/calendar-view"
import { SettingsView } from "@/components/settings-view"
import { StorageView } from "@/components/storage-view"
import { ColorfulTextGenerate } from "@/components/colorful-text-generate"
import { motion } from "framer-motion"
import { CardStackCompact } from "@/components/card-stack-compact"
import { NoteManager } from "@/components/note-manager"
import { AgentsView } from "@/components/agents-view"
import { AgentQuestionsView } from "@/components/agent-questions-view"
import { QuestionDetailView } from "@/components/question-detail-view"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatData {
  id: string
  messages: Message[]
  input: string
  agentMessages: Message[]
  agentResponses: string[]
}

interface Agent {
  id: string
  name: string
  avatar: string
  description: string
  specialty: string
}

interface ChatItem {
  id: string
  name: string
  active: boolean
  subChats?: ChatItem[]
}

interface QuestionSet {
  id: string
  inputNumber: number
  originalInput: string
  questions: string[]
  timestamp: Date
}

type ViewType =
  | "home"
  | "brain"
  | "calendar"
  | "settings"
  | "agent"
  | "agents"
  | "storage"
  | "agent-questions"
  | "question-detail"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [agentMessages, setAgentMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [isAgentFullscreen, setIsAgentFullscreen] = useState(false)
  const [agentFullscreenInput, setAgentFullscreenInput] = useState("")
  const [messageGroups, setMessageGroups] = useState<Message[][]>([])
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentView, setCurrentView] = useState<ViewType>("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [newInput, setNewInput] = useState("")
  const [agentResponse, setAgentResponse] = useState<string>("")
  const [agentResponses, setAgentResponses] = useState<string[]>([])
  const [agentInputText, setAgentInputText] = useState<string>("")
  const [isInputExpanded, setIsInputExpanded] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [chats, setChats] = useState<Record<string, ChatData>>({})
  const [activeChatId, setActiveChatId] = useState<string>("current1")

  // New state variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1)
  const [totalQuestions, setTotalQuestions] = useState(3)
  const [inputCounter, setInputCounter] = useState(1)
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([])
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<QuestionSet | null>(null)

  // Initial conversations state
  const [conversations, setConversations] = useState<ChatItem[]>([
    { id: "current1", name: "Current Chat", active: true, subChats: [] },
    {
      id: "prev1",
      name: "Previous Chat 1",
      active: false,
      subChats: [
        { id: "prev1-sub1", name: "Sub Chat 1.1", active: false, subChats: [] },
        { id: "prev1-sub2", name: "Sub Chat 1.2", active: false, subChats: [] },
      ],
    },
    { id: "prev2", name: "Previous Chat 2", active: false, subChats: [] },
  ])

  // Sample agents data
  const agents: Agent[] = [
    {
      id: "agent1",
      name: "Research Assistant",
      avatar: "👩‍🔬",
      description: "Specialized in finding and analyzing information from various sources.",
      specialty: "Research & Analysis",
    },
    {
      id: "agent2",
      name: "Creative Writer",
      avatar: "✍️",
      description: "Helps with creative writing, storytelling, and content creation.",
      specialty: "Creative Writing",
    },
    {
      id: "agent3",
      name: "Code Expert",
      avatar: "👨‍💻",
      description: "Assists with programming, debugging, and technical questions.",
      specialty: "Programming",
    },
    {
      id: "agent4",
      name: "Data Analyst",
      avatar: "📊",
      description: "Specializes in data analysis, visualization, and interpretation.",
      specialty: "Data Analysis",
    },
  ]

  // Define consistent text styling that matches AI output exactly
  const consistentTextStyles = {
    fontSize: "18px",
    fontFamily: "var(--font-user)",
    fontWeight: "normal",
    lineHeight: "1.6",
    letterSpacing: "-0.015em",
    wordSpacing: "normal",
    textAlign: "left" as const,
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    overflowWrap: "break-word" as const,
  }

  const generateMirroredResponse = (userInput: string) => {
    return userInput
  }

  const generateQuestions = (userInput: string): string[] => {
    // Generate sample questions based on the input
    return [
      `Can you elaborate more on "${userInput.substring(0, 30)}..."?`,
      `What are the implications of "${userInput.substring(0, 30)}..."?`,
      `How does this relate to previous discussions about "${userInput.substring(0, 20)}..."?`,
    ]
  }

  const toggleAgentsView = () => {
    setCurrentView(currentView === "agents" ? "home" : "agents")
  }

  const toggleAgentInterpretation = () => {
    setCurrentView(currentView === "agent" ? "home" : "agent")
  }

  const goToHome = () => {
    setCurrentView("home")
  }

  const goToAgentQuestions = () => {
    setCurrentView("agent-questions")
  }

  const goToQuestionDetail = (questionSet: QuestionSet) => {
    setSelectedQuestionSet(questionSet)
    setCurrentView("question-detail")
  }

  // Update the function names to reflect the swap
  const goToKnowledge = () => {
    setCurrentView("calendar") // This now shows knowledge cards
  }

  const goToStorage = () => {
    setCurrentView("storage") // This now shows stored items
  }

  const goToInsights = () => {
    setCurrentView("calendar")
  }

  const goToSettings = () => {
    setCurrentView("settings")
  }

  const toggleRightPanel = () => {
    setRightPanelOpen(!rightPanelOpen)
  }

  const toggleInputExpanded = () => {
    setIsInputExpanded(!isInputExpanded)
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 100)
  }

  useEffect(() => {
    const groups: Message[][] = []
    let currentGroup: Message[] = []
    let currentRole: string | null = null
    messages.forEach((message) => {
      if (currentRole === null || message.role === currentRole) {
        currentGroup.push(message)
      } else {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup])
        }
        currentGroup = [message]
      }
      currentRole = message.role
    })
    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }
    setMessageGroups(groups)
  }, [messages])

  useEffect(() => {
    if (!chats[activeChatId]) {
      setChats((prev) => ({
        ...prev,
        [activeChatId]: {
          id: activeChatId,
          messages: [],
          input: "",
          agentMessages: [],
          agentResponses: [],
        },
      }))
    }
  }, [activeChatId, chats])

  useEffect(() => {
    const handleAskQuestion = (event: CustomEvent) => {
      const { question } = event.detail
      if (question) {
        setNewInput(question)
        setCurrentView("home")
        // Auto-submit the question
        setTimeout(() => {
          const form = document.querySelector("form") as HTMLFormElement
          if (form) {
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
          }
        }, 100)
      }
    }
    window.addEventListener("ask-question", handleAskQuestion as EventListener)
    return () => window.removeEventListener("ask-question", handleAskQuestion as EventListener)
  }, [])

  useEffect(() => {
    const handleHighlightReply = (event: CustomEvent) => {
      const { highlightId, highlightText, replyText, inCard } = event.detail
      if (inCard) return
      if (highlightId && replyText) {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: `Regarding: "${highlightText}"\n\n${replyText}`,
          role: "user",
          timestamp: new Date(),
        }
        const updatedChats = { ...chats }
        if (!updatedChats[activeChatId]) {
          updatedChats[activeChatId] = {
            id: activeChatId,
            messages: [],
            input: "",
            agentMessages: [],
            agentResponses: [],
          }
        }
        updatedChats[activeChatId].messages = [...(updatedChats[activeChatId].messages || []), userMessage]
        setChats(updatedChats)
        setMessages((prev) => [...prev, userMessage])
        setIsLoading(true)
        setTimeout(() => {
          const cleanResponse = `Analysis of your reply to highlighted text: "${highlightText}". The agent has processed your specific response and generated a tailored reply.`
          const mirroredResponse = generateMirroredResponse(replyText)
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `Regarding your comment on: "${highlightText}"\n\n${mirroredResponse}`,
            role: "assistant",
            timestamp: new Date(),
          }
          const updatedChatsWithResponse = { ...chats }
          updatedChatsWithResponse[activeChatId].messages = [
            ...(updatedChatsWithResponse[activeChatId].messages || []),
            aiMessage,
          ]
          updatedChatsWithResponse[activeChatId].agentResponses = [
            ...(updatedChatsWithResponse[activeChatId].agentResponses || []),
            cleanResponse,
          ]
          const agentMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: `${replyText}`,
            role: "assistant",
            timestamp: new Date(),
          }
          updatedChatsWithResponse[activeChatId].agentMessages = [
            ...(updatedChatsWithResponse[activeChatId].agentMessages || []),
            agentMessage,
          ]
          setChats(updatedChatsWithResponse)
          setMessages((prev) => [...prev, aiMessage])
          setAgentResponses((prev) => [...prev, cleanResponse])
          setAgentMessages((prev) => [...prev, agentMessage])
          setIsLoading(false)
        }, 1000)
      }
    }
    window.addEventListener("highlight-reply", handleHighlightReply as EventListener)
    return () => window.removeEventListener("highlight-reply", handleHighlightReply as EventListener)
  }, [chats, activeChatId])

  useEffect(() => {
    const handleAddToContext = (event: CustomEvent) => {
      const { highlightId, highlightText, addText } = event.detail
      if (highlightId && addText) {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: `Adding context to: "${highlightText}"\n\n${addText}`,
          role: "user",
          timestamp: new Date(),
        }
        const updatedChats = { ...chats }
        if (!updatedChats[activeChatId]) {
          updatedChats[activeChatId] = {
            id: activeChatId,
            messages: [],
            input: "",
            agentMessages: [],
            agentResponses: [],
          }
        }
        updatedChats[activeChatId].messages = [...(updatedChats[activeChatId].messages || []), userMessage]
        setChats(updatedChats)
        setMessages((prev) => [...prev, userMessage])
        setIsLoading(true)
        setTimeout(() => {
          const cleanResponse = `Analysis of your added context to: "${highlightText}". The agent has processed your additional information.`
          const mirroredResponse = `I've incorporated your additional context about "${highlightText}". This helps me understand better. ${generateMirroredResponse(addText)}`
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: mirroredResponse,
            role: "assistant",
            timestamp: new Date(),
          }
          const updatedChatsWithResponse = { ...chats }
          updatedChatsWithResponse[activeChatId].messages = [
            ...(updatedChatsWithResponse[activeChatId].messages || []),
            aiMessage,
          ]
          updatedChatsWithResponse[activeChatId].agentResponses = [
            ...(updatedChatsWithResponse[activeChatId].agentResponses || []),
            cleanResponse,
          ]
          setChats(updatedChatsWithResponse)
          setMessages((prev) => [...prev, aiMessage])
          setAgentResponses((prev) => [...prev, cleanResponse])
          setIsLoading(false)
        }, 1000)
      }
    }
    window.addEventListener("add-to-context", handleAddToContext as EventListener)
    return () => window.removeEventListener("add-to-context", handleAddToContext as EventListener)
  }, [chats, activeChatId])

  // Add this useEffect after the existing ones
  useEffect(() => {
    const handleStoreHighlight = (event: CustomEvent) => {
      const { highlightId, highlightText } = event.detail
      if (highlightId && highlightText) {
        // Dispatch event to storage
        window.dispatchEvent(
          new CustomEvent("store-text", {
            detail: {
              text: highlightText,
              source: "Chat Highlight",
            },
          }),
        )
      }
    }
    window.addEventListener("store-highlight", handleStoreHighlight as EventListener)
    return () => window.removeEventListener("store-highlight", handleStoreHighlight as EventListener)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setIsSubmitting(true)
    const userMessage: Message = { id: Date.now().toString(), content: input, role: "user", timestamp: new Date() }

    // Generate questions for this input
    const questions = generateQuestions(input)
    const newQuestionSet: QuestionSet = {
      id: Date.now().toString(),
      inputNumber: inputCounter,
      originalInput: input,
      questions,
      timestamp: new Date(),
    }
    setQuestionSets((prev) => [...prev, newQuestionSet])

    setTimeout(() => {
      const updatedChats = { ...chats }
      if (!updatedChats[activeChatId]) {
        updatedChats[activeChatId] = {
          id: activeChatId,
          messages: [],
          input: "",
          agentMessages: [],
          agentResponses: [],
        }
      }
      updatedChats[activeChatId].messages = [...(updatedChats[activeChatId].messages || []), userMessage]
      setChats(updatedChats)
      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)
      setIsSubmitting(false)
      setInputCounter((prev) => prev + 1)
      setCurrentQuestionIndex(1) // Reset to first question for new input
      setIsInputExpanded(false)
      setTimeout(() => {
        const cleanResponse = `Analysis of your query about "${userMessage.content}": The agent has processed your specific request and generated a tailored response.`
        const mirroredResponse = generateMirroredResponse(userMessage.content)
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: mirroredResponse,
          role: "assistant",
          timestamp: new Date(),
        }
        const updatedChatsWithResponse = { ...chats }
        updatedChatsWithResponse[activeChatId].messages = [
          ...(updatedChatsWithResponse[activeChatId].messages || []),
          aiMessage,
        ]
        updatedChatsWithResponse[activeChatId].agentResponses = [
          ...(updatedChatsWithResponse[activeChatId].agentResponses || []),
          cleanResponse,
        ]
        const agentMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: `${userMessage.content}`,
          role: "assistant",
          timestamp: new Date(),
        }
        updatedChatsWithResponse[activeChatId].agentMessages = [
          ...(updatedChatsWithResponse[activeChatId].agentMessages || []),
          agentMessage,
        ]
        setChats(updatedChatsWithResponse)
        setMessages((prev) => [...prev, aiMessage])
        setAgentResponses((prev) => [...prev, cleanResponse])
        setAgentMessages((prev) => [...prev, agentMessage])
        setIsLoading(false)
      }, 1000)
    }, 300)
  }

  const handleNewInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newInput.trim()) return
    const userMessage: Message = { id: Date.now().toString(), content: newInput, role: "user", timestamp: new Date() }

    // Generate questions for this input
    const questions = generateQuestions(newInput)
    const newQuestionSet: QuestionSet = {
      id: Date.now().toString(),
      inputNumber: inputCounter,
      originalInput: newInput,
      questions,
      timestamp: new Date(),
    }
    setQuestionSets((prev) => [...prev, newQuestionSet])

    const updatedChats = { ...chats }
    if (!updatedChats[activeChatId]) {
      updatedChats[activeChatId] = { id: activeChatId, messages: [], input: "", agentMessages: [], agentResponses: [] }
    }
    updatedChats[activeChatId].messages = [...(updatedChats[activeChatId].messages || []), userMessage]
    setChats(updatedChats)
    setMessages((prev) => [...prev, userMessage])
    setNewInput("")
    setIsLoading(true)
    setIsInputExpanded(false)
    setInputCounter((prev) => prev + 1)
    setCurrentQuestionIndex(1) // Reset to first question for new input
    setTimeout(() => {
      const cleanResponse = `The agent has analyzed your request about "${userMessage.content}" and provided a detailed answer specific to your query.`
      const mirroredResponse = generateMirroredResponse(userMessage.content)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: mirroredResponse,
        role: "assistant",
        timestamp: new Date(),
      }
      const updatedChatsWithResponse = { ...chats }
      updatedChatsWithResponse[activeChatId].messages = [
        ...(updatedChatsWithResponse[activeChatId].messages || []),
        aiMessage,
      ]
      updatedChatsWithResponse[activeChatId].agentResponses = [
        ...(updatedChatsWithResponse[activeChatId].agentResponses || []),
        cleanResponse,
      ]
      const agentMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: mirroredResponse,
        role: "assistant",
        timestamp: new Date(),
      }
      updatedChatsWithResponse[activeChatId].agentMessages = [
        ...(updatedChatsWithResponse[activeChatId].agentMessages || []),
        agentMessage,
      ]
      setChats(updatedChatsWithResponse)
      setMessages((prev) => [...prev, aiMessage])
      setAgentResponses((prev) => [...prev, cleanResponse])
      setAgentMessages((prev) => [...prev, agentMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleAgentFullscreenSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agentFullscreenInput.trim()) return
    const inputText = agentFullscreenInput
    setAgentInputText(inputText)
    const userMessage: Message = { id: Date.now().toString(), content: inputText, role: "user", timestamp: new Date() }
    const updatedChats = { ...chats }
    if (!updatedChats[activeChatId]) {
      updatedChats[activeChatId] = { id: activeChatId, messages: [], input: "", agentMessages: [], agentResponses: [] }
    }
    updatedChats[activeChatId].agentMessages = [...(updatedChats[activeChatId].agentMessages || []), userMessage]
    setChats(updatedChats)
    setAgentMessages((prev) => [...prev, userMessage])
    setAgentFullscreenInput("")
    setTimeout(() => {
      const mirroredResponse = generateMirroredResponse(inputText)
      const cleanResponse = `Analysis of "${inputText}": The agent has processed your specific request and generated a tailored response.`
      const updatedChatsWithResponse = { ...chats }
      updatedChatsWithResponse[activeChatId].agentResponses = [
        ...(updatedChatsWithResponse[activeChatId].agentResponses || []),
        cleanResponse,
      ]
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: mirroredResponse,
        role: "assistant",
        timestamp: new Date(),
      }
      updatedChatsWithResponse[activeChatId].agentMessages = [
        ...(updatedChatsWithResponse[activeChatId].agentMessages || []),
        aiMessage,
      ]
      const mainAiMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: mirroredResponse,
        role: "assistant",
        timestamp: new Date(),
      }
      updatedChatsWithResponse[activeChatId].messages = [
        ...(updatedChatsWithResponse[activeChatId].messages || []),
        mainAiMessage,
      ]
      setChats(updatedChatsWithResponse)
      setAgentResponses((prev) => [...prev, cleanResponse])
      setAgentMessages((prev) => [...prev, aiMessage])
      setMessages((prev) => [...prev, mainAiMessage])
    }, 800)
  }

  const handleChatSelect = (chatId: string) => {
    const updatedChats = { ...chats }
    if (activeChatId && updatedChats[activeChatId]) {
      updatedChats[activeChatId] = { ...updatedChats[activeChatId], input: newInput }
    }
    setActiveChatId(chatId)
    if (!updatedChats[chatId]) {
      updatedChats[chatId] = { id: chatId, messages: [], input: "", agentMessages: [], agentResponses: [] }
    }
    setChats(updatedChats)
    setMessages(updatedChats[chatId].messages || [])
    setNewInput(updatedChats[chatId].input || "")
    setAgentMessages(updatedChats[chatId].agentMessages || [])
    setAgentResponses(updatedChats[chatId].agentResponses || [])

    // Update active state in conversations list
    const updateActive = (items: ChatItem[]): ChatItem[] => {
      return items.map((item) => ({
        ...item,
        active: item.id === chatId,
        subChats: item.subChats ? updateActive(item.subChats) : [],
      }))
    }
    setConversations((prev) => updateActive(prev))
  }

  const handleCreateSubChat = (parentId: string) => {
    const newSubChatId = `subchat-${parentId}-${Date.now()}`
    const newSubChat: ChatItem = {
      id: newSubChatId,
      name: `Sub Chat ${Math.random().toString(36).substring(7)}`, // Random name for demo
      active: false,
      subChats: [],
    }

    const addSubChatRecursive = (items: ChatItem[], targetParentId: string): ChatItem[] => {
      return items.map((item) => {
        if (item.id === targetParentId) {
          return {
            ...item,
            subChats: [...(item.subChats || []), newSubChat],
          }
        }
        if (item.subChats && item.subChats.length > 0) {
          return {
            ...item,
            subChats: addSubChatRecursive(item.subChats, targetParentId),
          }
        }
        return item
      })
    }

    setConversations((prevConversations) => addSubChatRecursive(prevConversations, parentId))

    // Create chat data for the new sub-chat
    setChats((prevChats) => ({
      ...prevChats,
      [newSubChatId]: {
        id: newSubChatId,
        messages: [],
        input: "",
        agentMessages: [],
        agentResponses: [],
      },
    }))
    handleChatSelect(newSubChatId) // Optionally switch to the new sub-chat
  }

  const toggleAgentFullscreen = () => {
    if (isAgentFullscreen) {
      setCurrentView("home")
    } else {
      setCurrentView("agent")
    }
    setIsAgentFullscreen(!isAgentFullscreen)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleQuestionClick = (question: string) => {
    const questionChatId = `question-${Date.now()}`
    const updatedChats = { ...chats }
    updatedChats[questionChatId] = {
      id: questionChatId,
      messages: [],
      input: "",
      agentMessages: [],
      agentResponses: [],
    }
    const questionMessage: Message = {
      id: Date.now().toString(),
      content: question,
      role: "user",
      timestamp: new Date(),
    }
    updatedChats[questionChatId].messages = [questionMessage]
    setChats(updatedChats)
    setActiveChatId(questionChatId)
    setMessages(updatedChats[questionChatId].messages)
    setNewInput("")
    setIsLoading(true)
    setTimeout(() => {
      const mirroredResponse = generateMirroredResponse(question)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: mirroredResponse,
        role: "assistant",
        timestamp: new Date(),
      }
      updatedChats[questionChatId].messages.push(aiMessage)
      setMessages(updatedChats[questionChatId].messages)
      setChats(updatedChats)
      const agentResponseText = `Analysis of the question: "${question}" - This provides context for this specific topic.`
      updatedChats[questionChatId].agentResponses = [agentResponseText]
      setAgentResponses([agentResponseText])
      setIsLoading(false)
    }, 1000)
  }

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent)
  }

  const inputContainerClass =
    "flex-1 bg-background/70 backdrop-blur-sm rounded-full shadow-md border border-primary/20 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 group px-2 h-10 min-w-[300px]"

  // Update active state in conversations when activeChatId changes
  useEffect(() => {
    const updateActiveRecursively = (items: ChatItem[]): ChatItem[] => {
      return items.map((item) => ({
        ...item,
        active: item.id === activeChatId,
        subChats: item.subChats ? updateActiveRecursively(item.subChats) : [],
      }))
    }
    setConversations((prev) => updateActiveRecursively(prev))
  }, [activeChatId])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Top Navigation Bar - moved down slightly */}
      <div className="top-nav" style={{ marginTop: "12px" }}>
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex items-center gap-2">{/* Remove the Button with Sparkles icon */}</div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <GlowMenu
              toggleBrainView={toggleAgentsView}
              goToHome={goToHome}
              goToCalendar={goToKnowledge} // Now goes to knowledge cards
              goToStorage={goToStorage}
              goToSettings={goToSettings}
            />
          </div>
        </div>
      </div>

      {!sidebarOpen && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="fixed left-0 top-20 z-50"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0 rounded-r-full rounded-l-none bg-background/80 backdrop-blur-sm border border-l-0 border-primary/15 hover:bg-primary/10"
          >
            <ChevronRight className="h-4 w-4 text-primary/70" />
          </Button>
        </motion.div>
      )}

      {currentView === "home" && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="fixed right-0 top-20 z-50"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRightPanel}
            className="h-8 w-8 p-0 rounded-l-full rounded-r-none bg-background/80 backdrop-blur-sm border border-r-0 border-primary/15 hover:bg-primary/10"
          >
            {rightPanelOpen ? (
              <ChevronRight className="h-4 w-4 text-primary/70" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-primary/70" />
            )}
          </Button>
        </motion.div>
      )}

      {currentView === "agent" && (
        <>
          <div className="relative" style={{ marginTop: "20px" }}>
            <Sidebar
              isOpen={sidebarOpen}
              messages={messages}
              className={`shrink-0 transition-all duration-300 absolute z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
              onToggle={toggleSidebar}
              activeChatId={activeChatId}
              onChatSelect={handleChatSelect}
              onQuestionClick={handleQuestionClick}
              onCreateSubChat={handleCreateSubChat}
              conversations={conversations}
            />
          </div>
          <div
            className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 mt-12"
            style={{ marginLeft: sidebarOpen ? "40px" : "0" }}
          >
            <header className="py-1 flex justify-between items-center mt-4">
              <div className="flex items-center justify-center w-full"></div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full hover:bg-primary/10 h-6 w-6 p-0 mr-4 absolute right-0"
                onClick={goToHome}
              >
                <X className="h-3.5 w-3.5 text-primary" />
                <span className="sr-only">Exit Agent Interpretation</span>
              </Button>
            </header>
            <div className="flex-1 flex flex-row overflow-hidden">
              <div className="flex-1 flex flex-col overflow-hidden">
                <div
                  className="flex-1 overflow-y-scroll p-2.5 pb-24 space-y-1.5 messages-container custom-scrollbar agent-messages-container chat-surface"
                  style={{
                    width: "100%",
                    maxWidth: "1800px",
                    margin: "0 auto",
                    paddingLeft: sidebarOpen ? "260px" : "40px",
                    paddingRight: "340px",
                    transition: "padding 0.1s ease",
                    willChange: "transform",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="space-y-4 mt-4">
                    {agentResponses.length > 0 ? (
                      agentResponses.map((response, index) => (
                        <div
                          key={index}
                          className="bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 shadow-sm p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="text-[16px] font-user whitespace-pre-wrap break-words prose-like">
                            {response}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 shadow-sm p-4">
                        <p className="text-[16px] text-foreground/70 font-user">
                          Agent interpretations will appear here when you start a conversation.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="w-[25%] flex flex-col p-2.5 graph-container"
                style={{
                  paddingBottom: "80px",
                  marginRight: "40px",
                  marginTop: "-8px",
                  overflowY: "hidden",
                  position: "fixed",
                  right: "0",
                  top: "72px",
                  bottom: "0",
                  width: "25%",
                  maxWidth: "400px",
                }}
              >
                <div className="h-2/5 mb-2.5 mt-0 bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 shadow-sm overflow-hidden">
                  <div className="p-1.5 bg-gradient-to-b from-background/90 to-transparent border-b border-primary/10 flex items-center justify-between">
                    <h3 className="text-[18px] font-semibold text-center text-primary flex-1">Input</h3>
                  </div>
                  <div className="p-2.5 h-[calc(100%-40px)] flex flex-col justify-center">
                    <div className="relative w-full">
                      <textarea
                        value={agentInputText}
                        onChange={(e) => setAgentInputText(e.target.value)}
                        placeholder="Type your input here..."
                        className="w-full p-3 bg-background border border-primary/10 rounded-lg focus:ring-1 focus:ring-primary/30 focus:outline-none resize-none transition-all duration-300 min-h-[60px]"
                        style={consistentTextStyles}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            if (agentInputText.trim()) {
                              handleAgentFullscreenSubmit(new Event("submit") as any)
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={(e) => handleAgentFullscreenSubmit(new Event("submit") as any)}
                        className="absolute bottom-2 right-2 rounded-full bg-primary hover:bg-primary/90 shadow-md h-8 w-8 p-0 flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                        disabled={!agentInputText.trim()}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 border border-primary/15 rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm flex flex-col shadow-sm mb-8">
                  <div className="p-1.5 bg-gradient-to-b from-background/90 to-transparent border-b border-primary/10 flex items-center justify-between">
                    <h3 className="text-[18px] font-semibold text-center text-primary flex-1">Output</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toggleAgentsView()
                              setCurrentView("agent")
                            }}
                            className="h-6 w-6 p-0 rounded-full hover:bg-primary/10 icon-glow"
                          >
                            <Users className="h-4 w-4 text-primary" />
                            <span className="sr-only">Fullscreen Agents</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-[10px]">Open Agents in Fullscreen</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex-1 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar chat-surface">
                    {agentResponses.length > 0 ? (
                      <div className="space-y-4">
                        {agentResponses.map((response, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-1.5 p-2 transition-all duration-300 mb-1 w-full"
                          >
                            <div className="flex-1 space-y-0.5">
                              <div
                                className="pl-17 message-content text-[18px] font-user font-light tracking-normal leading-relaxed prose-like"
                                style={{
                                  textOverflow: "ellipsis",
                                  overflowWrap: "break-word",
                                  wordBreak: "break-word",
                                  whiteSpace: "pre-wrap",
                                  display: "block",
                                  width: "100%",
                                  paddingLeft: "17px",
                                  paddingRight: "17px",
                                  maxWidth: "100%",
                                  overflow: "hidden",
                                }}
                              >
                                {response.length > 10000 ? (
                                  <div className="text-[18px] font-user whitespace-pre-wrap break-words prose-like">
                                    {response}
                                  </div>
                                ) : (
                                  <ColorfulTextGenerate text={response} className="text-[18px] font-user prose-like" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[18px] text-foreground/70 font-user p-3">
                        Enter input above to see agent outputs here.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Agent Questions View */}
      {currentView === "agent-questions" && (
        <div className="flex h-screen bg-background overflow-hidden">
          <div className="relative" style={{ marginTop: "20px" }}>
            <Sidebar
              isOpen={sidebarOpen}
              messages={messages}
              className={`shrink-0 transition-all duration-300 absolute z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
              onToggle={toggleSidebar}
              activeChatId={activeChatId}
              onChatSelect={handleChatSelect}
              onQuestionClick={handleQuestionClick}
              onCreateSubChat={handleCreateSubChat}
              conversations={conversations}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div
            className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 mt-12"
            style={{
              marginLeft: sidebarOpen ? "40px" : "0",
              paddingLeft: sidebarOpen ? "260px" : "40px",
              paddingRight: "40px",
            }}
          >
            <div className="flex-1 overflow-auto flex justify-center items-start">
              <AgentQuestionsView
                className="w-full"
                questionSets={questionSets}
                onBack={goToHome}
                onQuestionSetSelect={goToQuestionDetail}
              />
            </div>
          </div>
        </div>
      )}

      {/* Question Detail View */}
      {currentView === "question-detail" && selectedQuestionSet && (
        <div className="flex h-screen bg-background overflow-hidden">
          <div className="relative" style={{ marginTop: "20px" }}>
            <Sidebar
              isOpen={sidebarOpen}
              messages={messages}
              className={`shrink-0 transition-all duration-300 absolute z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
              onToggle={toggleSidebar}
              activeChatId={activeChatId}
              onChatSelect={handleChatSelect}
              onQuestionClick={handleQuestionClick}
              onCreateSubChat={handleCreateSubChat}
              conversations={conversations}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div
            className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 mt-12"
            style={{
              marginLeft: sidebarOpen ? "40px" : "0",
              paddingLeft: sidebarOpen ? "260px" : "40px",
              paddingRight: "40px",
            }}
          >
            <div className="flex-1 overflow-auto flex justify-center items-start">
              <QuestionDetailView className="w-full" questionSet={selectedQuestionSet} onBack={goToAgentQuestions} />
            </div>
          </div>
        </div>
      )}

      {/* Common structure for Agents, Calendar, Settings, Storage views */}
      {(currentView === "agents" ||
        currentView === "calendar" ||
        currentView === "settings" ||
        currentView === "storage") &&
        currentView !== "agent" && (
          <div className="flex h-screen bg-background overflow-hidden">
            <div className="relative" style={{ marginTop: "20px" }}>
              <Sidebar
                isOpen={sidebarOpen}
                messages={messages}
                className={`shrink-0 transition-all duration-300 absolute z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                onToggle={toggleSidebar}
                activeChatId={activeChatId}
                onChatSelect={handleChatSelect}
                onQuestionClick={handleQuestionClick}
                onCreateSubChat={handleCreateSubChat}
                conversations={conversations}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div
              className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 mt-12"
              style={{
                marginLeft: sidebarOpen ? "40px" : "0",
                paddingLeft: sidebarOpen ? "260px" : "40px",
                paddingRight: "40px",
              }}
            >
              <header className="border-b py-1.5 px-2.5 flex justify-between items-center">
                <div className="flex items-center">
                  {/* Update the header labels */}
                  <h1 className="text-base font-semibold text-foreground">
                    {currentView === "agents" && "Agents"}
                    {currentView === "calendar" && "Knowledge Cards"}
                    {currentView === "settings" && "Settings"}
                    {currentView === "storage" && "Storage"}
                  </h1>
                </div>
              </header>
              <div className="flex-1 overflow-auto flex justify-center items-start">
                {currentView === "agents" && <AgentsView className="w-full" />}
                {currentView === "calendar" && <CalendarView className="w-full max-w-4xl mx-auto" />}
                {currentView === "settings" && <SettingsView className="w-full max-w-6xl mx-auto" />}
                {currentView === "storage" && <StorageView className="w-full" />}
              </div>
            </div>
          </div>
        )}

      {currentView === "home" && (
        <>
          <div className="relative" style={{ marginTop: "20px" }}>
            <Sidebar
              isOpen={sidebarOpen}
              messages={messages}
              className={`shrink-0 transition-all duration-300 absolute z-40 pointer-events-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
              onToggle={toggleSidebar}
              activeChatId={activeChatId}
              onChatSelect={handleChatSelect}
              onQuestionClick={handleQuestionClick}
              onCreateSubChat={handleCreateSubChat}
              conversations={conversations}
            />
          </div>
          <div
            className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 mt-12"
            style={{ marginLeft: sidebarOpen ? "40px" : "0" }}
          >
            <header className="py-1 flex justify-between items-center">
              <div className="flex items-center"></div>
            </header>
            <div className="flex-1 flex flex-row overflow-hidden">
              <div className="flex-1 flex flex-col overflow-hidden">
                <div
                  className="flex-1 overflow-y-scroll p-2.5 space-y-1.5 messages-container custom-scrollbar chat-surface"
                  style={{
                    width: "100%",
                    maxWidth: "1800px",
                    margin: "0 auto",
                    paddingLeft: sidebarOpen ? "260px" : "40px",
                    paddingRight: "340px",
                    transition: "padding 0.1s ease",
                    paddingBottom: "60px",
                    willChange: "transform",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {messages.length === 0 ? (
                    <div className="flex flex-col p-4">
                      <form onSubmit={handleNewInputSubmit} className="w-full">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                            <span className="text-primary text-xs font-medium">You</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="relative">
                              <div className="flex items-center mb-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={toggleInputExpanded}
                                  className="h-6 w-6 p-0 rounded-full hover:bg-primary/10 mr-2 flex-shrink-0"
                                  title={isInputExpanded ? "Collapse input" : "Expand input"}
                                >
                                  {isInputExpanded ? (
                                    <Minimize2 className="h-3.5 w-3.5 text-primary/70" />
                                  ) : (
                                    <Maximize2 className="h-3.5 w-3.5 text-primary/70" />
                                  )}
                                </Button>
                              </div>
                              <textarea
                                ref={textareaRef}
                                value={newInput}
                                onChange={(e) => setNewInput(e.target.value)}
                                placeholder="Type your message here..."
                                className={`w-full p-3 bg-background border border-primary/10 rounded-lg focus:ring-1 focus:ring-primary/30 focus:outline-none resize-none transition-all duration-300 ${isInputExpanded ? "min-h-[300px]" : "min-h-[60px]"}`}
                                style={consistentTextStyles}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey && !isInputExpanded) {
                                    e.preventDefault()
                                    if (newInput.trim()) {
                                      handleNewInputSubmit(e)
                                    }
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                type="submit"
                                className="absolute bottom-2 right-2 rounded-full bg-primary hover:bg-primary/90 shadow-md h-8 w-8 p-0 flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                                disabled={isLoading || !newInput.trim()}
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                                <span className="sr-only">Send</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  ) : (
                    messageGroups.map((group, groupIndex) => (
                      <div key={groupIndex} className="message-group">
                        {group.map((message, messageIndex) => {
                          const isLatestAI =
                            message.role === "assistant" &&
                            groupIndex === messageGroups.length - 1 &&
                            messageIndex === group.length - 1 &&
                            messages[messages.length - 1].role === "assistant"
                          return (
                            <ChatMessage
                              key={message.id}
                              message={message}
                              isInGroup={group.length > 1}
                              isFirstInGroup={messageIndex === 0}
                              isLastInGroup={messageIndex === group.length - 1}
                              isLatest={isLatestAI}
                            />
                          )
                        })}
                      </div>
                    ))
                  )}
                  {messages.length > 0 && !isLoading && (
                    <div className="flex flex-col p-4 mt-2">
                      <form onSubmit={handleNewInputSubmit} className="w-full">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                            <span className="text-primary text-xs font-medium">You</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="relative">
                              <div className="flex items-center mb-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={toggleInputExpanded}
                                  className="h-6 w-6 p-0 rounded-full hover:bg-primary/10 mr-2 flex-shrink-0"
                                  title={isInputExpanded ? "Collapse input" : "Expand input"}
                                >
                                  {isInputExpanded ? (
                                    <Minimize2 className="h-3.5 w-3.5 text-primary/70" />
                                  ) : (
                                    <Maximize2 className="h-3.5 w-3.5 text-primary/70" />
                                  )}
                                </Button>
                              </div>
                              <textarea
                                ref={textareaRef}
                                value={newInput}
                                onChange={(e) => setNewInput(e.target.value)}
                                placeholder="Type your message here..."
                                className={`w-full p-3 bg-background border border-primary/10 rounded-lg focus:ring-1 focus:ring-primary/30 focus:outline-none resize-none transition-all duration-300 ${isInputExpanded ? "min-h-[300px]" : "min-h-[60px]"}`}
                                style={consistentTextStyles}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey && !isInputExpanded) {
                                    e.preventDefault()
                                    if (newInput.trim()) {
                                      handleNewInputSubmit(e)
                                    }
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                type="submit"
                                className="absolute bottom-2 right-2 rounded-full bg-primary hover:bg-primary/90 shadow-md h-8 w-8 p-0 flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                                disabled={isLoading || !newInput.trim()}
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                                <span className="sr-only">Send</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                  {isLoading && (
                    <div className="flex items-center space-x-2 p-2.5">
                      <div className="flex space-x-1">
                        <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                        <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                        <span className="w-1 h-1 bg-primary rounded-full animate-pulse delay-150" />
                      </div>
                      <span className="text-primary/70" style={consistentTextStyles}>
                        AI is thinking...
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`${rightPanelOpen ? "w-[25%]" : "w-0 opacity-0"} flex flex-col p-2.5 graph-container transition-all duration-300`}
                style={{
                  paddingBottom: "80px",
                  marginRight: rightPanelOpen ? "40px" : "0",
                  marginTop: "50px",
                  overflow: "hidden",
                  position: "fixed",
                  right: "0",
                  top: "72px",
                  bottom: "0",
                  width: rightPanelOpen ? "25%" : "0",
                  maxWidth: "400px",
                }}
              >
                <div className="h-2/5 mb-2.5 mt-0 bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 shadow-sm overflow-hidden">
                  <div className="p-1.5 bg-gradient-to-b from-background/90 to-transparent border-b border-primary/10 flex items-center justify-between">
                    <div className="flex flex-col flex-1">
                      <h3 className="text-[18px] font-semibold text-center text-primary">Agent Questions</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-primary/70">
                          {currentQuestionIndex}/{totalQuestions}
                        </span>
                        <div className="flex flex-col items-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={goToAgentQuestions}
                            className="h-4 w-4 p-0 rounded-full hover:bg-primary/10 mb-1"
                          >
                            <HelpCircle className="h-3 w-3 text-primary/70" />
                          </Button>
                          <span className="text-xs text-primary/70">{inputCounter}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[calc(100%-40px)] flex items-center justify-center">
                    <CardStackCompact />
                  </div>
                </div>
                <div className="flex-1 border border-primary/15 rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm flex flex-col shadow-sm mb-8">
                  <div className="p-1.5 bg-gradient-to-b from-background/90 to-transparent border-b border-primary/10 flex items-center justify-between">
                    <h3 className="text-[18px] font-semibold text-center text-primary flex-1">Agent Interpretation</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleAgentInterpretation}
                            className="h-6 w-6 p-0 rounded-full hover:bg-primary/10 icon-glow"
                          >
                            <Users className="h-4 w-4 text-primary" />
                            <span className="sr-only">Fullscreen Agent Interpretation</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-[10px]">Open Agent Interpretation in Fullscreen</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex-1 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar chat-surface">
                    {agentResponses.length > 0 ? (
                      <div className="space-y-4">
                        {agentResponses.map((response, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-1.5 p-2 transition-all duration-300 mb-1 w-full"
                          >
                            <div className="flex-1 space-y-0.5">
                              <div
                                className="pl-17 message-content text-[18px] font-user font-light tracking-normal leading-relaxed prose-like"
                                style={{
                                  textOverflow: "ellipsis",
                                  overflowWrap: "break-word",
                                  wordBreak: "break-word",
                                  whiteSpace: "pre-wrap",
                                  display: "block",
                                  width: "100%",
                                  paddingLeft: "17px",
                                  paddingRight: "17px",
                                  maxWidth: "100%",
                                  overflow: "hidden",
                                }}
                              >
                                {response.length > 10000 ? (
                                  <div className="text-[18px] font-user whitespace-pre-wrap break-words prose-like">
                                    {response}
                                  </div>
                                ) : (
                                  <ColorfulTextGenerate text={response} className="text-[18px] font-user prose-like" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[18px] text-foreground/70 font-user p-3">Agent outputs will appear here.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <NoteManager />
    </div>
  )
}
