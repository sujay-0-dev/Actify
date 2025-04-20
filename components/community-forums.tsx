import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ThumbsUp, Eye, PlusCircle } from "lucide-react"

export default function CommunityForums() {
  const discussions = [
    {
      id: 1,
      title: "Ideas for improving local park maintenance",
      category: "Environment",
      author: "Rahul S.",
      authorKarma: 450,
      time: "2 hours ago",
      replies: 24,
      views: 156,
      likes: 38,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      title: "Organizing a community clean-up drive",
      category: "Events",
      author: "Priya M.",
      authorKarma: 520,
      time: "5 hours ago",
      replies: 18,
      views: 124,
      likes: 42,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      title: "Proposal for better street lighting in Sector 7",
      category: "Infrastructure",
      author: "Amit K.",
      authorKarma: 380,
      time: "1 day ago",
      replies: 32,
      views: 210,
      likes: 65,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const polls = [
    {
      id: 1,
      question: "What should be our next community project?",
      options: [
        { text: "Community Garden", votes: 45 },
        { text: "Children's Playground", votes: 32 },
        { text: "Senior Citizen Center", votes: 28 },
      ],
      totalVotes: 105,
      daysLeft: 3,
    },
    {
      id: 2,
      question: "Best time for monthly community meetings?",
      options: [
        { text: "Weekday Evenings", votes: 56 },
        { text: "Weekend Mornings", votes: 38 },
        { text: "Weekend Afternoons", votes: 22 },
      ],
      totalVotes: 116,
      daysLeft: 2,
    },
  ]

  return (
    <section id="community" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Community Forums & Engagement</h2>
            <p className="text-muted-foreground mt-2 md:text-lg max-w-[600px]">
              Join discussions, share ideas, and collaborate with your community
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-blue-600">
            <PlusCircle className="mr-2 h-4 w-4" /> Start a Discussion
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold">Recent Discussions</h3>

            {discussions.map((discussion) => (
              <Card key={discussion.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={discussion.image} alt={discussion.author} />
                        <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{discussion.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span>{discussion.author}</span>
                          <span className="mx-2">•</span>
                          <span>{discussion.time}</span>
                        </div>
                      </div>
                    </div>
                    <Badge>{discussion.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua...
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {discussion.replies} replies
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Eye className="h-4 w-4 mr-1" />
                      {discussion.views} views
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {discussion.likes} likes
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <div className="text-center mt-8">
              <Button variant="outline">View All Discussions</Button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Active Polls</h3>

            {polls.map((poll) => (
              <Card key={poll.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{poll.question}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {poll.totalVotes} votes • {poll.daysLeft} days left
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {poll.options.map((option, index) => {
                      const percentage = Math.round((option.votes / poll.totalVotes) * 100)
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{option.text}</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground">{option.votes} votes</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full">Vote Now</Button>
                </CardFooter>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Members</span>
                    <span className="font-medium">1,245</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Discussions This Week</span>
                    <span className="font-medium">87</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Issues Resolved</span>
                    <span className="font-medium">32</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Upcoming Events</span>
                    <span className="font-medium">5</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  View Community Stats
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
