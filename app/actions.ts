"use server"

import type { Recipe } from "@/lib/types"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Search recipes from Spoonacular API
export async function searchRecipes(query: string, filters: any): Promise<Recipe[]> {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY

    const url = new URL("https://api.spoonacular.com/recipes/complexSearch")
    url.searchParams.append("query", query)
    url.searchParams.append("apiKey", apiKey || "")
    url.searchParams.append("addRecipeInformation", "true")
    url.searchParams.append("fillIngredients", "true")
    url.searchParams.append("number", "20") // Fetch 20 recipes at a time

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error("Failed to fetch recipes")
    }

    const data = await response.json()
    console.log("API Response Data:", data); // Log the entire response

    const recipes: Recipe[] = data.results.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      summary: recipe.summary || "",
      instructions: recipe.instructions || "",
      diets: recipe.diets || [],
      ingredients: recipe.extendedIngredients?.map((ingredient: any) => ingredient.original) || [],
    }))
    // console.log("Mapped Recipes:", recipes)
    // Now apply same filters as before
    return recipes.filter((recipe) => {
      const matchesQuery = !query || recipe.title.toLowerCase().includes(query.toLowerCase())
      const matchesCuisine =
        !filters.cuisine ||
        filters.cuisine === "any" ||
        recipe.diets?.some((diet) => diet.toLowerCase() === filters.cuisine.toLowerCase())
      const matchesDiet =
        !filters.diet ||
        filters.diet === "any" ||
        recipe.diets?.some((diet) => diet.toLowerCase() === filters.diet.toLowerCase())
      const matchesIngredients =
        !filters.includeIngredients ||
        filters.includeIngredients
          .split(",")
          .every((ingredient : string) =>
            recipe.ingredients?.some((i) => i.toLowerCase().includes(ingredient.trim().toLowerCase())),
          )

      return matchesQuery && matchesCuisine && matchesDiet && matchesIngredients
    })
  } catch (error) {
    console.error("Error searching recipes:", error)
    return []
  }
}

export async function saveRecipe(recipe: Recipe) {
  try {
    const userId = "user123"

    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        spoonacularId: recipe.id,
        userId: userId,
      },
    })

    if (existingRecipe) {
      return { success: true, message: "Recipe already saved" }
    }

    await prisma.recipe.create({
      data: {
        spoonacularId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        summary: recipe.summary,
        instructions: recipe.instructions,
        diets: recipe.diets || [],
        ingredients: recipe.ingredients || [],
        userId: userId,
      },
    })

    revalidatePath("/saved")
    return { success: true, message: "Recipe saved successfully" }
  } catch (error) {
    console.error("Error saving recipe:", error)
    return { success: false, message: "Failed to save recipe" }
  }
}

export async function getSavedRecipes(): Promise<Recipe[]> {
  try {
    const userId = "user123"

    const savedRecipes = await prisma.recipe.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return savedRecipes.map((recipe) => ({
      id: recipe.spoonacularId || recipe.id,
      title: recipe.title,
      image: recipe.image ?? undefined, // 👈 Fix here
      readyInMinutes: recipe.readyInMinutes ?? undefined,
      servings: recipe.servings ?? undefined,
      summary: recipe.summary ?? "",
      instructions: recipe.instructions ?? "",
      diets: recipe.diets || [],
      ingredients: recipe.ingredients || [],
    }))
    
  } catch (error) {
    console.error("Error getting saved recipes:", error)
    return []
  }
}

export async function deleteRecipe(id: number) {
  try {
    const userId = "user123"

    await prisma.recipe.deleteMany({
      where: {
        spoonacularId: id,
        userId: userId,
      },
    })

    revalidatePath("/saved")
    return { success: true, message: "Recipe deleted successfully" }
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return { success: false, message: "Failed to delete recipe" }
  }
}

