import type React from "react"
import type { Metadata } from "next"
import { Outfit, Roboto_Mono, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// Use Outfit as our main font
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  crossOrigin: "anonymous",
})

// Use Roboto Mono for AI output text
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  crossOrigin: "anonymous",
})

// Use Inter for user input text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  crossOrigin: "anonymous",
})

export const metadata: Metadata = {
  title: "AI Chat Interface",
  description: "A modern AI chat interface with history sidebar",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${outfit.variable} ${robotoMono.variable} ${inter.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
