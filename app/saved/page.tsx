import SavedRecipes from "@/components/saved-recipes"
import { Toaster } from "@/components/ui/toaster"

export default function SavedPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Saved Recipes</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        View all your saved recipes. Try saying "Show my saved recipes" from any page to navigate here.
      </p>
      <SavedRecipes />
      <Toaster />
    </main>
  )
}
