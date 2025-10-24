import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-block rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
            Bridging Academia and Industry
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Find Your Perfect Internship with PrashikshanConnect
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            A unified platform for students, colleges, and companies to collaborate on verified internships, track progress, and build job-ready skills.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
       {/* Animated background shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 h-72 w-72 animate-float rounded-full bg-primary/10 opacity-50 blur-3xl"></div>
        <div className="animation-delay-3000 absolute -right-1/4 bottom-1/4 h-72 w-72 animate-float rounded-full bg-accent/10 opacity-50 blur-3xl"></div>
      </div>
    </section>
  )
}
