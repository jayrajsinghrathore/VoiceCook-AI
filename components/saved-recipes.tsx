"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getSavedRecipes, deleteRecipe } from "@/app/actions"
import type { Recipe } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import RecipeModal from "@/components/recipe-modal"
import Link from "next/link"

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadSavedRecipes()
  }, [])

  const loadSavedRecipes = async () => {
    setIsLoading(true)
    try {
      const savedRecipes = await getSavedRecipes()
      setRecipes(savedRecipes)
    } catch (error) {
      console.error("Error loading saved recipes:", error)
      toast({
        title: "Error",
        description: "Failed to load saved recipes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deleteRecipe(id)
      setRecipes(recipes.filter((recipe) => recipe.id !== id))
      toast({
        title: "Recipe Deleted",
        description: "The recipe has been removed from your saved collection.",
      })
    } catch (error) {
      console.error("Error deleting recipe:", error)
      toast({
        title: "Error",
        description: "Failed to delete recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="h-[300px] rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <h2 className="text-2xl font-medium mb-2">No saved recipes yet</h2>
        <p className="text-muted-foreground mb-6">Search for recipes and save them to build your collection</p>
        <Link href="/search" passHref>
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white">
            Find Recipes
          </Button>
        </Link>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden h-full flex flex-col group">
                <div className="relative h-48 cursor-pointer" onClick={() => setSelectedRecipe(recipe)}>
                  <Image
                    src={recipe.image || `/placeholder.svg?height=300&width=400`}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                    onClick={() => setSelectedRecipe(recipe)}
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
                    onClick={() => setSelectedRecipe(recipe)}
                    className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 dark:hover:border-emerald-800"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(recipe.id)}
                    disabled={deletingId === recipe.id}
                    className="hover:bg-red-50 hover:text-red-500 transition-colors dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  >
                    {deletingId === recipe.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5 text-red-500" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onSave={() => {}} // Already saved
        />
      )}
    </>
  )
}
