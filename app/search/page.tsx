import RecipeSearch from "@/components/recipe-search"
import { Toaster } from "@/components/ui/toaster"

export default function SearchPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Recipe Search</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Search for recipes using your voice. Try saying "Find me pasta recipes" or "Show vegetarian dishes"
      </p>
      <RecipeSearch />
      <Toaster />
    </main>
  )
}
