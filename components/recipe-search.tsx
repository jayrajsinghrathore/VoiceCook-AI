"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Search, Filter, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import RecipeCard from "@/components/recipe-card"
import RecipeFilters from "@/components/recipe-filters"
import { searchRecipes } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import type { Recipe } from "@/lib/types"

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export default function RecipeSearch() {
  const router = useRouter()
  const { toast } = useToast()

  const [query, setQuery] = useState("")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    cuisine: "",
    diet: "",
    includeIngredients: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const hasVoiceTriggered = useRef(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const audioLevelInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const initialQuery = urlSearchParams.get("query") || ""
      const cuisine = urlSearchParams.get("cuisine") || ""
      const diet = urlSearchParams.get("diet") || ""
      const includeIngredients = urlSearchParams.get("includeIngredients") || ""

      const initialFilters = { cuisine, diet, includeIngredients }

      setQuery(initialQuery)
      setFilters(initialFilters)

      if (initialQuery || cuisine || diet || includeIngredients) {
        setHasSearched(true)
        handleSearch(initialQuery, initialFilters)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex
        const transcriptText = event.results[current][0].transcript
        setTranscript(transcriptText)

        const lowerText = transcriptText.toLowerCase()

        if (hasVoiceTriggered.current) return

        if (lowerText.includes("find me") || lowerText.includes("search for")) {
          const searchQuery = lowerText
            .replace("find me", "")
            .replace("search for", "")
            .replace("recipes", "")
            .trim()

          if (searchQuery) {
            hasVoiceTriggered.current = true
            setQuery(searchQuery)
            handleSearch(searchQuery, filters)
          }
        } else if (lowerText.includes("show my saved recipes") || lowerText.includes("go to saved recipes")) {
          hasVoiceTriggered.current = true
          router.push("/saved")
        }
      }

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        })
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
      if (audioLevelInterval.current) clearInterval(audioLevelInterval.current)
    }
  }, [router, toast, filters])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      hasVoiceTriggered.current = false
      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current)
        audioLevelInterval.current = null
      }
    } else {
      setTranscript("")
      hasVoiceTriggered.current = false
      recognitionRef.current.start()
      setIsListening(true)

      audioLevelInterval.current = setInterval(() => {
        setAudioLevel(Math.random())
      }, 100)

      toast({
        title: "Listening...",
        description: "Try saying: 'Find me pasta recipes' or 'Show my saved recipes'",
      })
    }
  }

  const handleSearch = async (searchQuery = query, searchFilters = filters) => {
    if (!searchQuery && !searchFilters.cuisine && !searchFilters.diet && !searchFilters.includeIngredients) {
      toast({
        title: "Search Error",
        description: "Please enter a search term or select filters",
        variant: "destructive",
      })
      return
    }

    const queryParams = new URLSearchParams()

    if (searchQuery) queryParams.set("query", searchQuery)
    if (searchFilters.cuisine) queryParams.set("cuisine", searchFilters.cuisine)
    if (searchFilters.diet) queryParams.set("diet", searchFilters.diet)
    if (searchFilters.includeIngredients) queryParams.set("includeIngredients", searchFilters.includeIngredients)

    router.push(`?${queryParams.toString()}`)

    setIsLoading(true)
    setHasSearched(true)
    setRecipes([])

    try {
      const results = await searchRecipes(searchQuery, searchFilters)
      setRecipes(results)

      if (results.length === 0) {
        toast({
          title: "No recipes found",
          description: "Try different search terms or filters",
        })
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Error",
        description: "Failed to search recipes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="p-4 md:p-6 shadow-md">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search recipes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch()
                  }}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleListening}
                  className={`relative ${isListening ? "bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700" : ""}`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isListening && (
                    <motion.span
                      className="absolute inset-0 rounded-md"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(220, 38, 38, 0)",
                          "0 0 0 4px rgba(220, 38, 38, 0.3)",
                          "0 0 0 0 rgba(220, 38, 38, 0)",
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700" : ""}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => handleSearch()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Search"
                  )}
                </Button>
              </motion.div>
            </div>

            <AnimatePresence>
              {isListening && transcript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-muted rounded-md text-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 flex items-center gap-1 h-2">
                        {[...Array(20)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="flex-1 bg-emerald-500 rounded-full"
                            animate={{
                              height: `${Math.max(0.2, Math.min(1, audioLevel * Math.sin(i / 3) + 0.5)) * 16}px`,
                            }}
                            transition={{ duration: 0.1 }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="font-medium">Listening:</p>
                    <p>{transcript}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <RecipeFilters filters={filters} onChange={handleFilterChange} onSearch={() => handleSearch()} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="h-[300px] rounded-lg bg-muted animate-pulse"
              />
            ))}
          </motion.div>
        ) : recipes.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </motion.div>
        ) : hasSearched ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No recipes found. Try different search terms or filters.</p>
          </motion.div>
        ) : (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              Search for recipes or try using your voice by clicking the microphone button
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}