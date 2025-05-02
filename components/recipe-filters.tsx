"use client"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const cuisines = [
  "African",
  "American",
  "British",
  "Cajun",
  "Caribbean",
  "Chinese",
  "Eastern European",
  "European",
  "French",
  "German",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Japanese",
  "Jewish",
  "Korean",
  "Latin American",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nordic",
  "Southern",
  "Spanish",
  "Thai",
  "Vietnamese",
]

const diets = [
  "Gluten Free",
  "Ketogenic",
  "Vegetarian",
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
  "Vegan",
  "Pescetarian",
  "Paleo",
  "Primal",
  "Low FODMAP",
  "Whole30",
]

type FilterProps = {
  filters: {
    cuisine: string
    diet: string
    includeIngredients: string
  }
  onChange: (filters: any) => void
  onSearch: () => void
}

export default function RecipeFilters({ filters, onChange, onSearch }: FilterProps) {
  const handleChange = (key: string, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Label htmlFor="cuisine">Cuisine</Label>
        <Select value={filters.cuisine} onValueChange={(value) => handleChange("cuisine", value)}>
          <SelectTrigger id="cuisine">
            <SelectValue placeholder="Any cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any cuisine</SelectItem>
            {cuisines.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Label htmlFor="diet">Diet</Label>
        <Select value={filters.diet} onValueChange={(value) => handleChange("diet", value)}>
          <SelectTrigger id="diet">
            <SelectValue placeholder="Any diet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any diet</SelectItem>
            {diets.map((diet) => (
              <SelectItem key={diet} value={diet.toLowerCase().replace("-", " ")}>
                {diet}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Label htmlFor="ingredients">Include Ingredients</Label>
        <Input
          id="ingredients"
          placeholder="e.g., tomato, cheese (comma separated)"
          value={filters.includeIngredients}
          onChange={(e) => handleChange("includeIngredients", e.target.value)}
        />
      </motion.div>

      <motion.div
        className="md:col-span-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
          onClick={onSearch}
        >
          Apply Filters
        </Button>
      </motion.div>
    </div>
  )
}
