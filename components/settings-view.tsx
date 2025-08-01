"use client"

import { useState } from "react"
import { Check, Moon, Sun, Laptop, Volume2, VolumeX, Eye, EyeOff, Lock, Unlock, RefreshCw, Play, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider" // Assuming this is the correct path
import { useSound, type SoundType } from "@/hooks/use-sound"

interface SettingsViewProps {
  className?: string
}

export function SettingsView({ className }: SettingsViewProps) {
  const { theme, setTheme, highContrast, setHighContrast } = useTheme()
  const { config, updateConfig, testSound, playSound } = useSound()
  const [reduceMotion, setReduceMotion] = useState(false)
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
            <h3 className="text-lg font-semibold text-primary">Audio & Sound Effects</h3>
          </div>
          <div className="p-6 space-y-6">
            {/* Main Sound Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {config.enabled ? (
                    <Volume2 className="h-5 w-5 text-primary" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-primary/60" />
                  )}
                  <div>
                    <div className="text-sm font-medium">Sound Effects</div>
                    <div className="text-xs text-primary/60">Calming sounds for interface interactions</div>
                  </div>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(enabled) => {
                    updateConfig({ enabled })
                    if (enabled) playSound("toggle")
                  }}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            {/* Sound Configuration */}
            {config.enabled && (
              <div className="space-y-6 pt-2">
                {/* Volume Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary/70" />
                      <span className="text-sm font-medium">Volume</span>
                    </div>
                    <span className="text-xs text-primary/60">{Math.round(config.volume * 100)}%</span>
                  </div>
                  <Slider
                    value={[config.volume]}
                    onValueChange={([volume]) => {
                      updateConfig({ volume })
                      testSound("click")
                    }}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Sound Style Selection */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Sound Style</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      className={cn(
                        "relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 text-xs",
                        config.soundType === "soft"
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      )}
                      onClick={() => {
                        updateConfig({ soundType: "soft" })
                        testSound("click")
                      }}
                    >
                      <span className="font-medium">Soft</span>
                      <span className="text-xs text-primary/60 mt-1">Gentle & calming</span>
                      {config.soundType === "soft" && <Check className="absolute top-1 right-1 h-3 w-3 text-primary" />}
                    </button>
                    <button
                      className={cn(
                        "relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 text-xs",
                        config.soundType === "modern"
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      )}
                      onClick={() => {
                        updateConfig({ soundType: "modern" })
                        testSound("click")
                      }}
                    >
                      <span className="font-medium">Modern</span>
                      <span className="text-xs text-primary/60 mt-1">Crisp & clean</span>
                      {config.soundType === "modern" && <Check className="absolute top-1 right-1 h-3 w-3 text-primary" />}
                    </button>
                    <button
                      className={cn(
                        "relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 text-xs",
                        config.soundType === "minimal"
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      )}
                      onClick={() => {
                        updateConfig({ soundType: "minimal" })
                        testSound("click")
                      }}
                    >
                      <span className="font-medium">Minimal</span>
                      <span className="text-xs text-primary/60 mt-1">Subtle & quiet</span>
                      {config.soundType === "minimal" && <Check className="absolute top-1 right-1 h-3 w-3 text-primary" />}
                    </button>
                  </div>
                </div>

                {/* Sound Preview */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Preview Sounds</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: "click" as SoundType, label: "Click", description: "Button presses" },
                      { type: "hover" as SoundType, label: "Hover", description: "Element focus" },
                      { type: "success" as SoundType, label: "Success", description: "Completed actions" },
                      { type: "notification" as SoundType, label: "Notification", description: "Alerts & messages" },
                    ].map(({ type, label, description }) => (
                      <button
                        key={type}
                        className="flex items-center gap-2 p-2 rounded-lg border border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                        onClick={() => testSound(type)}
                      >
                        <Play className="h-3 w-3 text-primary/70" />
                        <div className="text-left">
                          <div className="text-xs font-medium">{label}</div>
                          <div className="text-xs text-primary/60">{description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notification Preferences */}
            <div className="pt-4 space-y-4 border-t border-primary/10">
              <h4 className="text-sm font-medium">Notification Preferences</h4>
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
