"use client"

import { motion } from "framer-motion"
import { Code, BookOpen, Database, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AgentsViewProps {
  className?: string
}

export function AgentsView({ className }: AgentsViewProps) {
  const agents = [
    {
      id: "agent1",
      name: "Research Assistant",
      icon: BookOpen,
      description: "Specialized in finding and analyzing information from various sources.",
      specialty: "Research & Analysis",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      id: "agent2",
      name: "Creative Writer",
      icon: Code,
      description: "Helps with creative writing, storytelling, and content creation.",
      specialty: "Creative Writing",
      gradient: "from-green-500 to-teal-500",
    },
    {
      id: "agent3",
      name: "Code Expert",
      icon: Code,
      description: "Assists with programming, debugging, and technical questions.",
      specialty: "Programming",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "agent4",
      name: "Data Analyst",
      icon: Database,
      description: "Specializes in data analysis, visualization, and interpretation.",
      specialty: "Data Analysis",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "agent5",
      name: "Business Strategist",
      icon: LineChart,
      description: "Provides insights on business strategy, marketing, and growth.",
      specialty: "Business Strategy",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "agent6",
      name: "Learning Assistant",
      icon: BookOpen,
      description: "Helps with learning new subjects and educational content.",
      specialty: "Education",
      gradient: "from-yellow-500 to-amber-500",
    },
  ]

  return (
    <div className={`p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            className="flex"
          >
            <Card className="flex flex-col w-full overflow-hidden border border-primary/10 bg-background/80 backdrop-blur-sm">
              <div className={`h-2 bg-gradient-to-r ${agent.gradient}`}></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{agent.name}</CardTitle>
                  <div className={`p-2 rounded-full bg-gradient-to-r ${agent.gradient}`}>
                    <agent.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <CardDescription>{agent.specialty}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Select Agent
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
