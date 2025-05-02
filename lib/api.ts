// Client-side API functions

export async function saveRecipeApi(recipeData: any) {
  try {
    const response = await fetch("/api/saveRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to save recipe")
    }

    return await response.json()
  } catch (error) {
    console.error("Error saving recipe:", error)
    throw error
  }
}
