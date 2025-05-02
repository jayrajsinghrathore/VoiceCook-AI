"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Mic } from "lucide-react"

export default function AnimatedHero() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [commandIndex, setCommandIndex] = useState(0)

  const voiceCommands = [
    "Find me a pasta recipe with tomatoes and basil",
    "Show vegetarian dinner ideas",
    "Search for quick breakfast recipes",
    "Find recipes with chicken and rice",
    "Show me dessert recipes",
  ]

  useEffect(() => {
    // Start animation after component mounts
    setIsAnimating(true)

    // Set up interval to restart animation and change command
    const interval = setInterval(() => {
      setIsAnimating(false)
      setTimeout(() => {
        setCommandIndex((prev) => (prev + 1) % voiceCommands.length)
        setIsAnimating(true)
      }, 500)
    }, 8000) // Change command every 8 seconds

    return () => clearInterval(interval)
  }, [voiceCommands.length])

  return (
    <motion.div
      className="relative flex items-center justify-center lg:justify-end"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative h-[400px] w-full max-w-[500px] overflow-hidden rounded-2xl border bg-background shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

        {/* Phone frame */}
        <div className="absolute inset-0 border-[12px] border-gray-800 rounded-2xl z-20 pointer-events-none" />

        {/* Status bar */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 z-30 flex items-center justify-between px-4">
          <div className="w-16 h-1 bg-gray-600 rounded-full" />
          <div className="w-3 h-3 bg-gray-600 rounded-full" />
        </div>

        {/* Recipe image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={commandIndex}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={`/placeholder.svg?height=400&width=500&text=${encodeURIComponent(voiceCommands[commandIndex].split(" ").slice(0, 3).join(" "))}`}
              alt="Recipe"
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Voice UI overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 z-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border"
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                initial={{ scale: 1 }}
                animate={
                  isAnimating
                    ? {
                        scale: [1, 1.2, 1],
                        backgroundColor: ["rgb(209 250 229)", "rgb(52 211 153)", "rgb(209 250 229)"],
                      }
                    : { scale: 1 }
                }
                transition={{
                  duration: 2,
                  repeat: isAnimating ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "loop",
                }}
                className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center"
              >
                <Mic className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <div className="flex-1">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={isAnimating ? { width: ["0%", "100%", "60%", "100%", "30%", "80%"] } : { width: "0%" }}
                  transition={{
                    duration: 3,
                    repeat: isAnimating ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "loop",
                  }}
                  className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={commandIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-medium"
              >
                "{voiceCommands[commandIndex]}"
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
