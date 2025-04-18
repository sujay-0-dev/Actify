import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Lightbulb, MessageSquare, Leaf, ShoppingBag, Share2 } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: <MessageSquare className="h-10 w-10 text-indigo-600" />,
      title: "Community",
      description: "Collaborate, discuss issues, share knowledge, and organize events with community members.",
      href: "#",
      color: "bg-indigo-50 dark:bg-indigo-950",
      textColor: "text-indigo-600 dark:text-indigo-400",
      cta: "Join the Conversation",
    },
    {
      icon: <Share2 className="h-10 w-10 text-purple-600" />,
      title: "Skill Sharing",
      description: "Teach and learn skills from community members. Become a mentor or find one.",
      href: "#",
      color: "bg-purple-50 dark:bg-purple-950",
      textColor: "text-purple-600 dark:text-purple-400",
      cta: "Share Your Skills",
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-pink-600" />,
      title: "Marketplace",
      description: "Buy and sell products created by community members. Support local crafts.",
      href: "#",
      color: "bg-pink-50 dark:bg-pink-950",
      textColor: "text-pink-600 dark:text-pink-400",
      cta: "Explore Marketplace",
    },
    {
      icon: <MapPin className="h-10 w-10 text-red-600" />,
      title: "Public Issue Reporting",
      description: "Report local problems with location tags and media. Be a civic hero.",
      href: "#",
      color: "bg-red-50 dark:bg-red-950",
      textColor: "text-red-600 dark:text-red-400",
      cta: "Report an Issue",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-amber-600" />,
      title: "Welfare Schemes",
      description: "Discover government schemes tailored to your needs. Check eligibility easily.",
      href: "#",
      color: "bg-amber-50 dark:bg-amber-950",
      textColor: "text-amber-600 dark:text-amber-400",
      cta: "Check Your Benefits",
    },
    {
      icon: <Leaf className="h-10 w-10 text-green-600" />,
      title: "Eco Challenges",
      description: "Participate in environmental tasks. Take challenges and earn eco-karma.",
      href: "#",
      color: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
      cta: "Take a Challenge",
    },
  ]

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Features</h2>
          <p className="text-muted-foreground md:text-xl max-w-[800px]">
            ActiSathi offers a comprehensive suite of tools to empower your community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href} className="group">
              <div className="h-full border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className={`p-6 ${feature.color}`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                      {feature.icon}
                    </div>
                    <h3 className={`text-xl font-bold ${feature.textColor}`}>{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 w-full">
                      {feature.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
