"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart, Users, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import type { Recipe } from "@/lib/types"

type RecipeModalProps = {
  recipe: Recipe
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function RecipeModal({ recipe, isOpen, onClose, onSave }: RecipeModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "ingredients" | "instructions">("overview")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative h-64 md:h-80">
          <Image
            src={recipe.image || `/placeholder.svg?height=400&width=800`}
            alt={recipe.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <DialogTitle className="text-2xl md:text-3xl text-white">{recipe.title}</DialogTitle>
            <div className="flex flex-wrap gap-3 mt-3">
              {recipe.readyInMinutes && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {recipe.readyInMinutes} min
                </Badge>
              )}

              {recipe.servings && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {recipe.servings} servings
                </Badge>
              )}

              {recipe.diets?.slice(0, 3).map((diet) => (
                <Badge key={diet} variant="outline" className="bg-white/10 backdrop-blur-sm">
                  {diet}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex border-b">
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            Overview
          </TabButton>
          <TabButton active={activeTab === "ingredients"} onClick={() => setActiveTab("ingredients")}>
            Ingredients
          </TabButton>
          <TabButton active={activeTab === "instructions"} onClick={() => setActiveTab("instructions")}>
            Instructions
          </TabButton>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {recipe.summary && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Summary</h3>
                    <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: recipe.summary }} />
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "ingredients" && (
              <motion.div
                key="ingredients"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {recipe.ingredients?.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Ingredients</h3>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex items-start gap-2 p-2 rounded-md hover:bg-muted"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-800/30 flex items-center justify-center mt-0.5">
                            <span className="text-xs text-emerald-600 dark:text-emerald-400">✓</span>
                          </div>
                          <span>{ingredient}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No ingredients information available.</div>
                )}
              </motion.div>
            )}

            {activeTab === "instructions" && (
              <motion.div
                key="instructions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {recipe.instructions ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Instructions</h3>
                    <div className="space-y-4" dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No instructions information available.</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handleSave}
            className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                Save Recipe
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      className={`flex-1 py-3 px-4 text-center relative ${
        active ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
      }`}
      onClick={onClick}
    >
      {children}
      {active && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400"
          layoutId="tab-indicator"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  )
}
