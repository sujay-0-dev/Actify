import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-600/5 dark:from-primary/5 dark:to-blue-900/10 -z-10" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                ActiSathi – Empowering Communities with Trust & Action!
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Join our community-driven platform that integrates public hazard reporting, skill-sharing, and welfare
                scheme discovery with a trust-based Karma system.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 min-[400px]:gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              >
                Join the Movement
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <Image src={`/placeholder.svg?height=32&width=32`} alt={`User ${i}`} width={32} height={32} />
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">1,200+</span> community members
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-square">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Community Engagement"
                width={500}
                height={500}
                className="rounded-2xl shadow-xl"
                priority
              />
              <div className="absolute -bottom-6 -left-6 bg-background rounded-lg shadow-lg p-4 max-w-[200px]">
                <div className="text-sm font-medium">Hazards Reported</div>
                <div className="text-2xl font-bold">2,543</div>
                <div className="text-xs text-green-500 flex items-center">+12% this month</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-background rounded-lg shadow-lg p-4 max-w-[200px]">
                <div className="text-sm font-medium">Karma Points</div>
                <div className="text-2xl font-bold">152K</div>
                <div className="text-xs text-green-500 flex items-center">Growing community</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
