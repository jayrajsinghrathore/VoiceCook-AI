export type Recipe = {
  id: number
  title: string
  image?: string
  readyInMinutes?: number
  servings?: number
  summary?: string
  diets?: string[]
  ingredients?: string[]
  instructions?: string
}
