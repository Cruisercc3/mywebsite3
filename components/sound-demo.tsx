"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { useSound, type SoundType } from "@/hooks/use-sound"
import { Volume2, Play, CheckCircle, XCircle, Bell, ToggleLeft, MousePointer, Navigation } from "lucide-react"

export function SoundDemo() {
  const { playSound, isEnabled } = useSound()
  const [demoToggle, setDemoToggle] = useState(false)

  const soundEffects: Array<{
    type: SoundType
    label: string
    description: string
    icon: React.ReactNode
    color: string
  }> = [
    {
      type: "click",
      label: "Click",
      description: "Button presses and general interactions",
      icon: <MousePointer className="h-4 w-4" />,
      color: "text-blue-500"
    },
    {
      type: "hover",
      label: "Hover",
      description: "Element focus and mouse enter",
      icon: <MousePointer className="h-4 w-4" />,
      color: "text-purple-500"
    },
    {
      type: "success",
      label: "Success",
      description: "Completed actions and confirmations",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-500"
    },
    {
      type: "error",
      label: "Error",
      description: "Errors and destructive actions",
      icon: <XCircle className="h-4 w-4" />,
      color: "text-red-500"
    },
    {
      type: "notification",
      label: "Notification",
      description: "Alerts and important messages",
      icon: <Bell className="h-4 w-4" />,
      color: "text-yellow-500"
    },
    {
      type: "toggle",
      label: "Toggle",
      description: "Switch and checkbox interactions",
      icon: <ToggleLeft className="h-4 w-4" />,
      color: "text-indigo-500"
    },
    {
      type: "navigation",
      label: "Navigation",
      description: "Menu items and page transitions",
      icon: <Navigation className="h-4 w-4" />,
      color: "text-teal-500"
    },
    {
      type: "focus",
      label: "Focus",
      description: "Input focus and keyboard navigation",
      icon: <Volume2 className="h-4 w-4" />,
      color: "text-orange-500"
    }
  ]

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Sound Effects Demo</h2>
          <p className="text-sm text-muted-foreground">
            Experience the calming and modern sound effects throughout the interface
          </p>
        </div>

        {!isEnabled && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Sound effects are currently disabled. Enable them in the settings to hear the demo.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {soundEffects.map((sound) => (
            <div
              key={sound.type}
              className="flex items-center justify-between p-4 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`${sound.color}`}>
                  {sound.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{sound.label}</div>
                  <div className="text-xs text-muted-foreground">{sound.description}</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => playSound(sound.type)}
                className="h-8 w-8 p-0"
              >
                <Play className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-primary/10">
          <h3 className="font-medium mb-3">Interactive Examples</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Demo toggle (with sound)</span>
              <Switch
                checked={demoToggle}
                onCheckedChange={setDemoToggle}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="default" size="sm">
                Default Button
              </Button>
              <Button variant="outline" size="sm">
                Outline Button
              </Button>
              <Button variant="destructive" size="sm">
                Error Button
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-primary/10">
          <p className="text-xs text-muted-foreground">
            All sounds are generated using Web Audio API with carefully tuned frequencies for a calming experience
          </p>
        </div>
      </div>
    </Card>
  )
}