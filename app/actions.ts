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

// 👇 Baaki tera pura original code waise ka waise hi hai
// Save, Get, Delete — untouched
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

// "use server"

// import type { Recipe } from "@/lib/types"
// import { prisma } from "@/lib/prisma"
// import { revalidatePath } from "next/cache"

// // Search recipes from Spoonacular API
// export async function searchRecipes(query: string, filters: any): Promise<Recipe[]> {
//   try {
//     // In a production app, you would call the Spoonacular API here
//     // const apiKey = process.env.SPOONACULAR_API_KEY
//     // const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}...`)

//     // For demo purposes, we'll use mock data
//     const mockRecipes: Recipe[] = [
//       {
//         id: 1,
//         title: "Spaghetti Carbonara",
//         image: "/placeholder.svg?height=300&width=400&text=Spaghetti+Carbonara",
//         readyInMinutes: 30,
//         servings: 4,
//         summary: "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
//         diets: ["Italian"],
//         ingredients: [
//           "200g spaghetti",
//           "100g pancetta",
//           "2 large eggs",
//           "50g pecorino cheese",
//           "50g parmesan",
//           "Freshly ground black pepper",
//           "Salt",
//         ],
//         instructions:
//           "<ol><li>Cook pasta until al dente.</li><li>Fry pancetta until crispy.</li><li>Mix eggs and cheese in a bowl.</li><li>Combine all ingredients and serve immediately.</li></ol>",
//       },
//       {
//         id: 2,
//         title: "Vegetarian Buddha Bowl",
//         image: "/placeholder.svg?height=300&width=400&text=Buddha+Bowl",
//         readyInMinutes: 25,
//         servings: 2,
//         summary: "A nutritious bowl packed with vegetables, grains, and plant-based protein.",
//         diets: ["Vegetarian", "Vegan", "Gluten Free"],
//         ingredients: [
//           "1 cup quinoa",
//           "1 sweet potato",
//           "1 cup chickpeas",
//           "1 avocado",
//           "2 cups mixed greens",
//           "Tahini dressing",
//         ],
//         instructions:
//           "<ol><li>Cook quinoa according to package instructions.</li><li>Roast sweet potato and chickpeas.</li><li>Assemble bowl with all ingredients.</li><li>Drizzle with tahini dressing.</li></ol>",
//       },
//       {
//         id: 3,
//         title: "Chicken Tikka Masala",
//         image: "/placeholder.svg?height=300&width=400&text=Chicken+Tikka+Masala",
//         readyInMinutes: 45,
//         servings: 4,
//         summary: "A popular Indian dish with marinated chicken in a creamy tomato sauce.",
//         diets: ["Indian"],
//         ingredients: [
//           "500g chicken breast",
//           "200ml yogurt",
//           "2 tbsp garam masala",
//           "1 onion",
//           "3 cloves garlic",
//           "1 tbsp ginger",
//           "400g tomato sauce",
//           "200ml cream",
//           "Fresh coriander",
//         ],
//         instructions:
//           "<ol><li>Marinate chicken in yogurt and spices.</li><li>Grill until charred.</li><li>Make sauce with onions, garlic, ginger, and tomatoes.</li><li>Add cream and simmer.</li><li>Combine with chicken and serve with rice.</li></ol>",
//       },
//       {
//         id: 4,
//         title: "Avocado Toast with Poached Egg",
//         image: "/placeholder.svg?height=300&width=400&text=Avocado+Toast",
//         readyInMinutes: 15,
//         servings: 1,
//         summary: "A simple and nutritious breakfast with creamy avocado and perfectly poached egg.",
//         diets: ["Vegetarian"],
//         ingredients: [
//           "1 slice sourdough bread",
//           "1 ripe avocado",
//           "1 egg",
//           "Salt and pepper",
//           "Red pepper flakes",
//           "Lemon juice",
//         ],
//         instructions:
//           "<ol><li>Toast bread until golden.</li><li>Mash avocado with lemon juice, salt and pepper.</li><li>Poach egg in simmering water.</li><li>Spread avocado on toast and top with egg.</li></ol>",
//       },
//       {
//         id: 5,
//         title: "Beef Stir Fry with Vegetables",
//         image: "/placeholder.svg?height=300&width=400&text=Beef+Stir+Fry",
//         readyInMinutes: 20,
//         servings: 2,
//         summary: "A quick and flavorful stir fry with tender beef and crisp vegetables.",
//         diets: ["High Protein"],
//         ingredients: [
//           "300g beef strips",
//           "1 bell pepper",
//           "1 broccoli head",
//           "2 carrots",
//           "3 tbsp soy sauce",
//           "1 tbsp oyster sauce",
//           "2 cloves garlic",
//           "1 tbsp ginger",
//         ],
//         instructions:
//           "<ol><li>Marinate beef in soy sauce.</li><li>Stir fry vegetables until crisp-tender.</li><li>Add beef and cook until done.</li><li>Add sauces and toss to combine.</li></ol>",
//       },
//       {
//         id: 6,
//         title: "Greek Salad",
//         image: "/placeholder.svg?height=300&width=400&text=Greek+Salad",
//         readyInMinutes: 10,
//         servings: 2,
//         summary: "A refreshing Mediterranean salad with tomatoes, cucumber, olives, and feta cheese.",
//         diets: ["Vegetarian", "Mediterranean", "Low Carb"],
//         ingredients: [
//           "2 tomatoes",
//           "1 cucumber",
//           "1 red onion",
//           "100g feta cheese",
//           "50g kalamata olives",
//           "2 tbsp olive oil",
//           "1 tbsp red wine vinegar",
//           "1 tsp dried oregano",
//         ],
//         instructions:
//           "<ol><li>Chop vegetables into chunks.</li><li>Add olives and crumbled feta.</li><li>Mix dressing with oil, vinegar, and oregano.</li><li>Toss everything together and serve.</li></ol>",
//       },
//     ]

//     // Filter mock data based on query and filters
//     return mockRecipes.filter((recipe) => {
//       const matchesQuery = !query || recipe.title.toLowerCase().includes(query.toLowerCase())
//       const matchesCuisine =
//         !filters.cuisine ||
//         filters.cuisine === "any" ||
//         recipe.diets?.some((diet) => diet.toLowerCase() === filters.cuisine.toLowerCase())
//       const matchesDiet =
//         !filters.diet ||
//         filters.diet === "any" ||
//         recipe.diets?.some((diet) => diet.toLowerCase() === filters.diet.toLowerCase())
//       const matchesIngredients =
//         !filters.includeIngredients ||
//         filters.includeIngredients
//           .split(",")
//           .every((ingredient) =>
//             recipe.ingredients?.some((i) => i.toLowerCase().includes(ingredient.trim().toLowerCase())),
//           )

//       return matchesQuery && matchesCuisine && matchesDiet && matchesIngredients
//     })
//   } catch (error) {
//     console.error("Error searching recipes:", error)
//     return []
//   }
// }

// // Save recipe to database
// export async function saveRecipe(recipe: Recipe) {
//   try {
//     // For demo purposes, we'll use a mock userId
//     const userId = "user123"

//     // Check if recipe already exists
//     const existingRecipe = await prisma.recipe.findFirst({
//       where: {
//         spoonacularId: recipe.id,
//         userId: userId,
//       },
//     })

//     if (existingRecipe) {
//       // Recipe already saved
//       return { success: true, message: "Recipe already saved" }
//     }

//     // Save recipe to database
//     await prisma.recipe.create({
//       data: {
//         spoonacularId: recipe.id,
//         title: recipe.title,
//         image: recipe.image,
//         readyInMinutes: recipe.readyInMinutes,
//         servings: recipe.servings,
//         summary: recipe.summary,
//         instructions: recipe.instructions,
//         diets: recipe.diets || [],
//         ingredients: recipe.ingredients || [],
//         userId: userId,
//       },
//     })

//     revalidatePath("/saved")
//     return { success: true, message: "Recipe saved successfully" }
//   } catch (error) {
//     console.error("Error saving recipe:", error)
//     return { success: false, message: "Failed to save recipe" }
//   }
// }

// // Get saved recipes from database
// export async function getSavedRecipes(): Promise<Recipe[]> {
//   try {
//     // For demo purposes, we'll use a mock userId
//     const userId = "user123"

//     const savedRecipes = await prisma.recipe.findMany({
//       where: {
//         userId: userId,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     return savedRecipes.map((recipe) => ({
//       id: recipe.spoonacularId || recipe.id,
//       title: recipe.title,
//       image: recipe.image,
//       readyInMinutes: recipe.readyInMinutes,
//       servings: recipe.servings,
//       summary: recipe.summary,
//       instructions: recipe.instructions,
//       diets: recipe.diets,
//       ingredients: recipe.ingredients,
//     }))
//   } catch (error) {
//     console.error("Error getting saved recipes:", error)
//     return []
//   }
// }

// // Delete recipe from database
// export async function deleteRecipe(id: number) {
//   try {
//     // For demo purposes, we'll use a mock userId
//     const userId = "user123"

//     await prisma.recipe.deleteMany({
//       where: {
//         spoonacularId: id,
//         userId: userId,
//       },
//     })

//     revalidatePath("/saved")
//     return { success: true, message: "Recipe deleted successfully" }
//   } catch (error) {
//     console.error("Error deleting recipe:", error)
//     return { success: false, message: "Failed to delete recipe" }
//   }
// }
