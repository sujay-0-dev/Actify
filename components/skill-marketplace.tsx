import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Search, Filter, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SkillMarketplace() {
  const skills = [
    {
      id: 1,
      title: "Web Development",
      provider: "Rahul S.",
      rating: 4.8,
      reviews: 24,
      karma: 450,
      verified: true,
      tags: ["HTML", "CSS", "JavaScript"],
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      title: "Graphic Design",
      provider: "Priya M.",
      rating: 4.9,
      reviews: 36,
      karma: 520,
      verified: true,
      tags: ["Photoshop", "Illustrator", "UI/UX"],
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      title: "Content Writing",
      provider: "Amit K.",
      rating: 4.7,
      reviews: 18,
      karma: 380,
      verified: true,
      tags: ["Blogs", "Articles", "SEO"],
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      title: "Mobile App Development",
      provider: "Sneha R.",
      rating: 4.6,
      reviews: 15,
      karma: 320,
      verified: false,
      tags: ["Android", "iOS", "Flutter"],
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 5,
      title: "Digital Marketing",
      provider: "Vikram J.",
      rating: 4.5,
      reviews: 12,
      karma: 290,
      verified: true,
      tags: ["Social Media", "SEO", "Analytics"],
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 6,
      title: "Video Editing",
      provider: "Neha P.",
      rating: 4.7,
      reviews: 20,
      karma: 410,
      verified: false,
      tags: ["Premiere Pro", "After Effects", "Animation"],
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <section id="skill-marketplace" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Skill-Sharing Marketplace</h2>
            <p className="text-muted-foreground mt-2 md:text-lg max-w-[600px]">
              Connect with verified community members and share skills
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-blue-600">Offer Your Skills</Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search for skills..." className="pl-10" />
          </div>
          <Button variant="outline" className="md:w-auto">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Card key={skill.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={skill.image} alt={skill.provider} />
                      <AvatarFallback>{skill.provider.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{skill.title}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{skill.provider}</span>
                        {skill.verified && <CheckCircle className="ml-1 h-3 w-3 text-primary" />}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{skill.karma} Karma</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">{skill.rating}</span>
                  </div>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{skill.reviews} reviews</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skill.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-muted/50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
                <Button size="sm">Request Skill</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="mx-auto">
            Load More Skills
          </Button>
        </div>
      </div>
    </section>
  )
}
