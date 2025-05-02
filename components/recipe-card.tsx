"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart, Loader2 } from "lucide-react"
import type { Recipe } from "@/lib/types"
import { saveRecipe } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import RecipeModal from "@/components/recipe-modal"

type RecipeCardProps = {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveRecipe(recipe)
      toast({
        title: "Recipe Saved",
        description: `${recipe.title} has been saved to your collection.`,
      })
    } catch (error) {
      console.error("Error saving recipe:", error)
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <motion.div whileHover={{ y: -5 }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
        <Card className="overflow-hidden h-full flex flex-col group">
          <div className="relative h-48 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <Image
              src={recipe.image || `/placeholder.svg?height=300&width=400`}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-500"
              style={{
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
            />
            {recipe.readyInMinutes && (
              <Badge variant="secondary" className="absolute bottom-2 right-2 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {recipe.readyInMinutes} min
              </Badge>
            )}
          </div>
          <CardContent className="pt-4 flex-grow">
            <h3
              className="font-medium text-lg mb-2 line-clamp-2 cursor-pointer group-hover:text-emerald-600 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              {recipe.title}
            </h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {recipe.diets?.slice(0, 3).map((diet) => (
                <Badge key={diet} variant="outline" className="text-xs">
                  {diet}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 dark:hover:border-emerald-800"
            >
              View Details
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={isSaving}
              className="hover:bg-red-50 hover:text-red-500 transition-colors dark:hover:bg-red-900/30 dark:hover:text-red-400"
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className="h-5 w-5" />}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <RecipeModal recipe={recipe} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
    </>
  )
}
