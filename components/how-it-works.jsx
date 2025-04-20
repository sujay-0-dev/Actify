import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, PenToolIcon as Tool, Award } from "lucide-react"
import Image from "next/image"

export default function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: "Report Hazards",
      description: "Users report civic issues with photos & location. Verified reports earn Karma points.",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: Tool,
      title: "Skill Marketplace",
      description: "Verified users share skills & collaborate. Connect with trusted community members.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Award,
      title: "Earn Rewards",
      description: "Users gain Karma points & redeem KarmaCash for real-world benefits and services.",
      color: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
          <p className="text-muted-foreground md:text-xl max-w-[800px]">
            ActiSathi makes community engagement simple and rewarding through our three-step process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${step.color}`}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>

                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-4xl h-[300px] rounded-xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=300&width=1000"
              alt="Interactive Infographic"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-600/80 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">See ActiSathi in Action</h3>
                <p className="mb-4">Watch our interactive demo to learn more about how ActiSathi works</p>
                <Button variant="outline" className="border-white text-white hover:bg-white/20">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
