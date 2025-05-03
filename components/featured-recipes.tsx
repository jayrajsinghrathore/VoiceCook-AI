"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

const featuredRecipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    image: "https://as2.ftcdn.net/v2/jpg/01/40/23/83/1000_F_140238395_N98evndTbdvp2RbDlbBB2zxnoZmld0br.jpg",
    readyInMinutes: 30,
    diets: ["Italian"],
  },
  {
    id: 2,
    title: "Vegetarian Buddha Bowl",
    image: "https://as2.ftcdn.net/v2/jpg/02/30/28/15/1000_F_230281578_IvhUK0hfokUVae0XtklBaBPyRN2a10L9.jpg",
    readyInMinutes: 25,
    diets: ["Vegetarian", "Vegan", "Gluten Free"],
  },
  {
    id: 3,
    title: "Chicken Tikka Masala",
    image: "https://as1.ftcdn.net/v2/jpg/07/30/51/14/1000_F_730511477_TnGUlp423SDU57is9IvJGyGaRVSjJBio.jpg",
    readyInMinutes: 45,
    diets: ["Indian"],
  },
]

export default function FeaturedRecipes() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {featuredRecipes.map((recipe, index) => (
        <Link href={`/search?query=${encodeURIComponent(recipe.title)}`} key={recipe.id} passHref>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="h-full"
          >
            <Card className="overflow-hidden h-full cursor-pointer group">
              <div className="relative h-48">
                <Image
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  fill
                  className="object-cover transition-transform duration-500"
                  style={{
                    transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                  }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                />
                <Badge variant="secondary" className="absolute bottom-2 right-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {recipe.readyInMinutes} min
                </Badge>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-medium text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
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
            </Card>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}
