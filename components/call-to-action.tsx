import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export default function CallToAction() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Join the ActiSathi Movement Today
            </h2>
            <p className="mt-4 text-primary-foreground/80 md:text-xl max-w-[600px]">
              Be part of a growing community that's making a real difference. Together, we can create safer, more
              connected neighborhoods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Join Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
            <p className="text-primary-foreground/80 mb-6">
              Subscribe to our newsletter for the latest updates, events, and community initiatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter your email"
                className="bg-white/20 border-white/20 placeholder:text-white/50 text-white"
              />
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 shrink-0">
                Subscribe
              </Button>
            </div>
            <p className="text-xs mt-4 text-primary-foreground/60">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
