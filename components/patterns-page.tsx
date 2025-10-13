"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Search, Plus, Filter, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarViewProps {
  className?: string
}

interface KnowledgeCardData {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  lastUpdated: string
}

// Simple KnowledgeCard component for the calendar view
function KnowledgeCard({ card, onClick }: { card: KnowledgeCardData; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">{card.title}</h3>
          <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2">
            {card.category}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{card.content}</p>
        <div className="flex flex-wrap gap-1">
          {card.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
              #{tag}
            </span>
          ))}
          {card.tags.length > 3 && <span className="text-xs text-muted-foreground">+{card.tags.length - 3} more</span>}
        </div>
        <p className="text-xs text-muted-foreground">Updated: {card.lastUpdated}</p>
      </div>
    </motion.div>
  )
}

export function CalendarView({ className }: CalendarViewProps) {
  const [selectedCard, setSelectedCard] = useState<KnowledgeCardData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Expanded knowledge cards data to fill the page
  const knowledgeCards: KnowledgeCardData[] = [
    {
      id: "1",
      title: "Machine Learning Fundamentals",
      content:
        "Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn and make decisions from data without being explicitly programmed.",
      category: "AI/ML",
      tags: ["machine learning", "AI", "algorithms"],
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      title: "React Hooks Best Practices",
      content:
        "React Hooks provide a way to use state and lifecycle methods in functional components. Key hooks include useState, useEffect, useContext, and custom hooks.",
      category: "Development",
      tags: ["react", "hooks", "frontend"],
      lastUpdated: "2024-01-14",
    },
    {
      id: "3",
      title: "Database Optimization Techniques",
      content:
        "Database optimization involves indexing, query optimization, normalization, and proper schema design to improve performance and reduce resource usage.",
      category: "Database",
      tags: ["database", "optimization", "performance"],
      lastUpdated: "2024-01-13",
    },
    {
      id: "4",
      title: "Cybersecurity Principles",
      content:
        "Core cybersecurity principles include confidentiality, integrity, availability, authentication, authorization, and non-repudiation.",
      category: "Security",
      tags: ["security", "cybersecurity", "principles"],
      lastUpdated: "2024-01-12",
    },
    {
      id: "5",
      title: "Cloud Computing Architecture",
      content:
        "Cloud computing provides on-demand access to computing resources including servers, storage, databases, networking, software, and analytics over the internet.",
      category: "Cloud",
      tags: ["cloud", "architecture", "scalability"],
      lastUpdated: "2024-01-11",
    },
    {
      id: "6",
      title: "API Design Patterns",
      content:
        "RESTful API design follows principles of statelessness, uniform interface, cacheable responses, and layered system architecture for scalable web services.",
      category: "Development",
      tags: ["API", "REST", "design patterns"],
      lastUpdated: "2024-01-10",
    },
    {
      id: "7",
      title: "DevOps Pipeline Automation",
      content:
        "DevOps practices integrate development and operations through continuous integration, continuous deployment, and infrastructure as code methodologies.",
      category: "DevOps",
      tags: ["devops", "CI/CD", "automation"],
      lastUpdated: "2024-01-09",
    },
    {
      id: "8",
      title: "Data Structures and Algorithms",
      content:
        "Understanding fundamental data structures like arrays, linked lists, trees, and graphs, along with sorting and searching algorithms for efficient problem solving.",
      category: "Computer Science",
      tags: ["algorithms", "data structures", "programming"],
      lastUpdated: "2024-01-08",
    },
    {
      id: "9",
      title: "Microservices Architecture",
      content:
        "Microservices break down applications into small, independent services that communicate over well-defined APIs, enabling scalability and maintainability.",
      category: "Architecture",
      tags: ["microservices", "architecture", "scalability"],
      lastUpdated: "2024-01-07",
    },
    {
      id: "10",
      title: "User Experience Design",
      content:
        "UX design focuses on creating meaningful and relevant experiences for users through research, prototyping, testing, and iterative design processes.",
      category: "Design",
      tags: ["UX", "design", "user research"],
      lastUpdated: "2024-01-06",
    },
    {
      id: "11",
      title: "Blockchain Technology",
      content:
        "Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, linked and secured using cryptography.",
      category: "Technology",
      tags: ["blockchain", "cryptocurrency", "distributed systems"],
      lastUpdated: "2024-01-05",
    },
    {
      id: "12",
      title: "Mobile App Development",
      content:
        "Mobile development encompasses native iOS and Android development, cross-platform frameworks like React Native and Flutter, and progressive web apps.",
      category: "Development",
      tags: ["mobile", "iOS", "Android", "React Native"],
      lastUpdated: "2024-01-04",
    },
    {
      id: "13",
      title: "Network Security Protocols",
      content:
        "Network security involves implementing protocols like HTTPS, VPN, firewalls, and intrusion detection systems to protect data transmission and network infrastructure.",
      category: "Security",
      tags: ["network security", "protocols", "encryption"],
      lastUpdated: "2024-01-03",
    },
    {
      id: "14",
      title: "Agile Project Management",
      content:
        "Agile methodology emphasizes iterative development, collaboration, customer feedback, and responding to change over following a rigid plan.",
      category: "Management",
      tags: ["agile", "scrum", "project management"],
      lastUpdated: "2024-01-02",
    },
    {
      id: "15",
      title: "Artificial Neural Networks",
      content:
        "Neural networks are computing systems inspired by biological neural networks, consisting of interconnected nodes that process information using connectionist approaches.",
      category: "AI/ML",
      tags: ["neural networks", "deep learning", "AI"],
      lastUpdated: "2024-01-01",
    },
    {
      id: "16",
      title: "Version Control with Git",
      content:
        "Git is a distributed version control system that tracks changes in source code during software development, enabling collaboration and code history management.",
      category: "Development",
      tags: ["git", "version control", "collaboration"],
      lastUpdated: "2023-12-31",
    },
    {
      id: "17",
      title: "Container Orchestration",
      content:
        "Container orchestration platforms like Kubernetes automate deployment, scaling, and management of containerized applications across clusters of hosts.",
      category: "DevOps",
      tags: ["kubernetes", "containers", "orchestration"],
      lastUpdated: "2023-12-30",
    },
    {
      id: "18",
      title: "Functional Programming",
      content:
        "Functional programming is a programming paradigm that treats computation as evaluation of mathematical functions, avoiding changing state and mutable data.",
      category: "Programming",
      tags: ["functional programming", "immutability", "pure functions"],
      lastUpdated: "2023-12-29",
    },
    {
      id: "19",
      title: "Web Performance Optimization",
      content:
        "Web performance optimization involves techniques like code splitting, lazy loading, caching, CDN usage, and image optimization to improve page load times.",
      category: "Development",
      tags: ["performance", "optimization", "web development"],
      lastUpdated: "2023-12-28",
    },
    {
      id: "20",
      title: "Quantum Computing Basics",
      content:
        "Quantum computing uses quantum-mechanical phenomena like superposition and entanglement to perform operations on data, potentially solving complex problems exponentially faster.",
      category: "Technology",
      tags: ["quantum computing", "quantum mechanics", "algorithms"],
      lastUpdated: "2023-12-27",
    },
    {
      id: "21",
      title: "GraphQL API Development",
      content:
        "GraphQL is a query language and runtime for APIs that allows clients to request exactly the data they need, providing a more efficient alternative to REST.",
      category: "Development",
      tags: ["GraphQL", "API", "query language"],
      lastUpdated: "2023-12-26",
    },
    {
      id: "22",
      title: "Internet of Things (IoT)",
      content:
        "IoT refers to the network of physical devices embedded with sensors, software, and connectivity to collect and exchange data with other devices and systems.",
      category: "Technology",
      tags: ["IoT", "sensors", "connectivity"],
      lastUpdated: "2023-12-25",
    },
    {
      id: "23",
      title: "Serverless Computing",
      content:
        "Serverless computing allows developers to build and run applications without managing servers, automatically scaling and charging only for actual usage.",
      category: "Cloud",
      tags: ["serverless", "lambda", "cloud functions"],
      lastUpdated: "2023-12-24",
    },
    {
      id: "24",
      title: "Data Visualization Techniques",
      content:
        "Data visualization transforms complex datasets into visual representations like charts, graphs, and interactive dashboards to communicate insights effectively.",
      category: "Data Science",
      tags: ["data visualization", "charts", "dashboards"],
      lastUpdated: "2023-12-23",
    },
  ]

  const handleCardClick = (card: KnowledgeCardData) => {
    setSelectedCard(card)
  }

  const handleCloseDetails = () => {
    setSelectedCard(null)
  }

  const filteredCards = knowledgeCards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className={cn("p-6", className)}>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Agent Patterns</h2>
        <p className="text-muted-foreground">Explore your knowledge base with contextual information</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3 w-full max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search patterns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-200"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 hover:bg-primary/10 hover:border-primary/30 bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Insight
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 hover:bg-primary/10 hover:border-primary/30 bg-transparent"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 hover:bg-primary/10 hover:border-primary/30 px-2 bg-transparent"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-center">
            <p className="text-lg mb-2">No patterns found</p>
            <p className="text-sm">Try adjusting your search terms or add new patterns</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 p-4 hover:shadow-md transition-all duration-300 hover:border-primary/20 cursor-pointer"
              onClick={() => handleCardClick(card)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2">{card.title}</h3>
                  <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2">
                    {card.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{card.content}</p>
                <div className="flex flex-wrap gap-1">
                  {card.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                  {card.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{card.tags.length - 3} more</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Updated: {card.lastUpdated}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for Card Details */}
      {selectedCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseDetails}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-xl border border-primary/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-foreground">{selectedCard.title}</h3>
              <button
                onClick={handleCloseDetails}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                  {selectedCard.category}
                </span>
              </div>
              <p className="text-foreground leading-relaxed">{selectedCard.content}</p>
              <div className="flex flex-wrap gap-2">
                {selectedCard.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Last updated: {selectedCard.lastUpdated}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
