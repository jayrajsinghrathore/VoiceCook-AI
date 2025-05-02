import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Mic, Search, BookOpen, ArrowDown } from "lucide-react"
import FeaturedRecipes from "@/components/featured-recipes"
import AnimatedHero from "@/components/animated-hero"
import AnimatedSection from "@/components/animated-section"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <AnimatedSection className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-400 dark:from-emerald-400 dark:to-teal-300">
                  Cook with your voice, not your hands
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Find, save, and cook recipes using just your voice. Our AI-powered assistant makes cooking easier than
                  ever.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/search" passHref>
                  <Button
                    size="lg"
                    className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works" passHref>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-300"
                  >
                    How It Works
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
            <AnimatedHero />
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:block">
          <Link
            href="#features"
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-sm mb-1">Scroll to explore</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-emerald-100 dark:bg-emerald-800/30 px-3 py-1 text-sm">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Everything you need for hands-free cooking
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our voice-controlled cooking assistant makes it easy to find and follow recipes without touching your
                device.
              </p>
            </div>
          </AnimatedSection>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <AnimatedFeatureCard
              icon={<Mic className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
              title="Voice Control"
              description="Search for recipes, save favorites, and navigate the app using just your voice."
              delay={0}
            />
            <AnimatedFeatureCard
              icon={<Search className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
              title="Smart Search"
              description="Find recipes by cuisine, diet, or ingredients with powerful filtering options."
              delay={0.1}
            />
            <AnimatedFeatureCard
              icon={<BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
              title="Recipe Collection"
              description="Save your favorite recipes and access them anytime, even offline."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-emerald-100 dark:bg-emerald-800/30 px-3 py-1 text-sm">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple as 1-2-3</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get started with VoiceCook in just a few simple steps.
              </p>
            </div>
          </AnimatedSection>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
            <AnimatedStepCard
              number={1}
              title="Tap the Mic"
              description="Click the microphone button to activate voice recognition."
              delay={0}
            />
            <AnimatedStepCard
              number={2}
              title="Speak a Command"
              description="Say &quot;Find me pasta recipes&quot; or &quot;Show vegetarian dishes&quot;."
              delay={0.1}
            />
            <AnimatedStepCard
              number={3}
              title="Get Cooking"
              description="Browse results, save favorites, and start cooking with hands-free assistance."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-emerald-100 dark:bg-emerald-800/30 px-3 py-1 text-sm">
                Featured Recipes
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Popular Recipes</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover our most popular recipes loved by home cooks everywhere.
              </p>
            </div>
          </AnimatedSection>
          <FeaturedRecipes />
          <AnimatedSection className="flex justify-center mt-8">
            <Link href="/search" passHref>
              <Button
                size="lg"
                variant="outline"
                className="gap-1.5 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-300"
              >
                Explore All Recipes <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to get cooking?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start your hands-free cooking journey today with VoiceCook.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/search" passHref>
                <Button
                  size="lg"
                  className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  )
}

// Animated Feature Card Component
function AnimatedFeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <AnimatedSection
      className="flex flex-col items-center space-y-2 rounded-lg p-6 transition-all hover:bg-muted"
      delay={delay}
    >
      <div className="rounded-full bg-emerald-100 dark:bg-emerald-800/30 p-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-center text-muted-foreground">{description}</p>
    </AnimatedSection>
  )
}

// Animated Step Card Component
function AnimatedStepCard({ number, title, description, delay = 0 }) {
  return (
    <AnimatedSection
      className="flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all hover:shadow-md"
      delay={delay}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-600 dark:bg-emerald-800/30 dark:text-emerald-400">
        {number}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-center text-muted-foreground">{description}</p>
    </AnimatedSection>
  )
}
