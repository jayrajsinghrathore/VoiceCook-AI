"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Sun, Moon, Laptop } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <motion.div
      className="flex items-center justify-center p-1 rounded-full bg-muted/80 backdrop-blur-sm border"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex space-x-1">
        <ThemeButton
          active={theme === "light"}
          onClick={() => setTheme("light")}
          icon={<Sun className="h-4 w-4" />}
          tooltip="Light"
        />
        <ThemeButton
          active={theme === "dark"}
          onClick={() => setTheme("dark")}
          icon={<Moon className="h-4 w-4" />}
          tooltip="Dark"
        />
        <ThemeButton
          active={theme === "system"}
          onClick={() => setTheme("system")}
          icon={<Laptop className="h-4 w-4" />}
          tooltip="System"
        />
      </div>
    </motion.div>
  )
}

interface ThemeButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  tooltip: string
}

function ThemeButton({ active, onClick, icon, tooltip }: ThemeButtonProps) {
  return (
    <motion.button
      className="relative flex items-center justify-center w-8 h-8 rounded-full"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="sr-only">Use {tooltip} theme</span>
      {icon}
      {active && (
        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-500/20 ring-1 ring-emerald-500"
          layoutId="theme-active"
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
      <span className="absolute bottom-full mb-1 hidden opacity-0 transition-opacity group-hover:opacity-100 text-xs font-medium">
        {tooltip}
      </span>
    </motion.button>
  )
}
