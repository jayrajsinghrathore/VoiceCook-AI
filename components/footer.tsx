import Link from "next/link"
import { Mic, Github, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-8 md:py-12 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800/30 flex items-center justify-center">
                <Mic className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xl font-bold">VoiceCook</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              VoiceCook is a voice-controlled cooking assistant that helps you find, save, and cook recipes using just
              your voice.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Navigation</h3>
              <nav className="grid gap-2">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Search
                </Link>
                <Link href="/saved" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Saved Recipes
                </Link>
              </nav>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Legal</h3>
              <nav className="grid gap-2">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">© 2025 VoiceCook. All rights reserved.</p>
          <div className="flex gap-4">
          <Link
            href="https://github.com/jayrajsinghrathore"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/jayraj-singh-rathore-786b13217/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:text-primary transition-colors"
          >
            <Linkedin className="h-4 w-4" />
          </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
