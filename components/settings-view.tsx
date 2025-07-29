"use client"

import { useState } from "react"
import { Check, Moon, Sun, Laptop, Volume2, VolumeX, Eye, EyeOff, Lock, Unlock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider" // Assuming this is the correct path

interface SettingsViewProps {
  className?: string
}

export function SettingsView({ className }: SettingsViewProps) {
  const { theme, setTheme } = useTheme()
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [privacyMode, setPrivacyMode] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [dataCollection, setDataCollection] = useState(true)

  // Function to handle theme change
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
  }

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  }

  return (
    <div className={cn("flex flex-col items-center justify-center w-full p-4 md:p-6", className)}>
      {/* The red "Settings" h2 title has been removed from here */}
      {/* The page title will be handled by the header in app/page.tsx */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-6xl mx-auto mt-8">
        {" "}
        {/* Added mt-8 for spacing */}
        {/* Appearance Card */}
        <motion.div
          className="rounded-xl border border-primary/10 bg-background/80 backdrop-blur-sm shadow-sm overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="p-4 bg-gradient-to-b from-primary/5 to-transparent border-b border-primary/10">
            <h3 className="text-lg font-semibold text-primary">Appearance</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-4">Theme</h4>
              <div className="grid grid-cols-3 gap-3">
                <button
                  className={cn(
                    "relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200", // Added relative
                    theme === "light"
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-primary/20 hover:border-primary/40 hover:bg-primary/5",
                  )}
                  onClick={() => handleThemeChange("light")}
                >
                  <Sun className="h-5 w-5 mb-2 text-primary" />
                  <span className="text-xs">Light</span>
                  {theme === "light" && <Check className="absolute top-2 right-2 h-3 w-3 text-primary" />}
                </button>
                <button
                  className={cn(
                    "relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200", // Added relative
                    theme === "dark"
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-primary/20 hover:border-primary/40 hover:bg-primary/5",
                  )}
                  onClick={() => handleThemeChange("dark")}
                >
                  <Moon className="h-5 w-5 mb-2 text-primary" />
                  <span className="text-xs">Dark</span>
                  {theme === "dark" && <Check className="absolute top-2 right-2 h-3 w-3 text-primary" />}
                </button>
                <button
                  className={cn(
                    "relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200", // Added relative
                    theme === "system"
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-primary/20 hover:border-primary/40 hover:bg-primary/5",
                  )}
                  onClick={() => handleThemeChange("system")}
                >
                  <Laptop className="h-5 w-5 mb-2 text-primary" />
                  <span className="text-xs">System</span>
                  {theme === "system" && <Check className="absolute top-2 right-2 h-3 w-3 text-primary" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Reduce Motion</div>
                  <div className="text-xs text-primary/60">Minimize animations</div>
                </div>
                <Switch
                  checked={reduceMotion}
                  onCheckedChange={setReduceMotion}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">High Contrast</div>
                  <div className="text-xs text-primary/60">Increase contrast between elements</div>
                </div>
                <Switch
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>
        </motion.div>
        {/* Audio & Notifications Card */}
        <motion.div
          className="rounded-xl border border-primary/10 bg-background/80 backdrop-blur-sm shadow-sm overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <div className="p-4 bg-gradient-to-b from-primary/5 to-transparent border-b border-primary/10">
            <h3 className="text-lg font-semibold text-primary">Audio & Notifications</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {soundEnabled ? (
                    <Volume2 className="h-5 w-5 text-primary" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-primary/60" />
                  )}
                  <div>
                    <div className="text-sm font-medium">Sound Effects</div>
                    <div className="text-xs text-primary/60">Play sounds for notifications and actions</div>
                  </div>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <h4 className="text-sm font-medium mb-2">Notification Preferences</h4>

              <div className="space-y-3 pl-2">
                <div className="flex items-center gap-2">
                  <Switch id="chat-notifications" className="data-[state=checked]:bg-primary" defaultChecked />
                  <label htmlFor="chat-notifications" className="text-xs cursor-pointer">
                    Chat messages
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="system-notifications" className="data-[state=checked]:bg-primary" defaultChecked />
                  <label htmlFor="system-notifications" className="text-xs cursor-pointer">
                    System updates
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="weekly-summary" className="data-[state=checked]:bg-primary" />
                  <label htmlFor="weekly-summary" className="text-xs cursor-pointer">
                    Weekly summary
                  </label>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Privacy & Security Card */}
        <motion.div
          className="rounded-xl border border-primary/10 bg-background/80 backdrop-blur-sm shadow-sm overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <div className="p-4 bg-gradient-to-b from-primary/5 to-transparent border-b border-primary/10">
            <h3 className="text-lg font-semibold text-primary">Privacy & Security</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {privacyMode ? (
                    <Lock className="h-5 w-5 text-primary" />
                  ) : (
                    <Unlock className="h-5 w-5 text-primary/60" />
                  )}
                  <div>
                    <div className="text-sm font-medium">Privacy Mode</div>
                    <div className="text-xs text-primary/60">Hide sensitive content from view</div>
                  </div>
                </div>
                <Switch
                  checked={privacyMode}
                  onCheckedChange={setPrivacyMode}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {dataCollection ? (
                    <Eye className="h-5 w-5 text-primary" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-primary/60" />
                  )}
                  <div>
                    <div className="text-sm font-medium">Data Collection</div>
                    <div className="text-xs text-primary/60">Allow collection of usage data to improve service</div>
                  </div>
                </div>
                <Switch
                  checked={dataCollection}
                  onCheckedChange={setDataCollection}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30 w-full"
              >
                Change Password
              </Button>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 text-red-500 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30 w-full"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </motion.div>
        {/* Data Management Card */}
        <motion.div
          className="rounded-xl border border-primary/10 bg-background/80 backdrop-blur-sm shadow-sm overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <div className="p-4 bg-gradient-to-b from-primary/5 to-transparent border-b border-primary/10">
            <h3 className="text-lg font-semibold text-primary">Data Management</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className={cn("h-5 w-5", autoSave ? "text-primary" : "text-primary/60")} />
                  <div>
                    <div className="text-sm font-medium">Auto-Save Conversations</div>
                    <div className="text-xs text-primary/60">Automatically save chat history</div>
                  </div>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} className="data-[state=checked]:bg-primary" />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30 w-full"
              >
                Export All Data
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30 w-full"
              >
                Clear Chat History
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 text-primary/80 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30 w-full"
              >
                Reset to Default Settings
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
