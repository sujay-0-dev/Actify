"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  PlusCircle,
  Filter,
  Search,
  Award,
  TrendingUp,
  Calendar,
  Users,
  MapPin,
} from "lucide-react"
import LevelBadge from "@/components/gamification/level-badge"

export default function CommunityPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("discussions")
  const [newPostOpen, setNewPostOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Mock data for discussions
  const discussions = [
    {
      id: 1,
      title: "Ideas for improving local park maintenance",
      category: "Environment",
      author: "Rahul S.",
      authorLevel: 3,
      authorKarma: 450,
      time: "2 hours ago",
      replies: 24,
      views: 156,
      likes: 38,
      image: "/placeholder.svg?height=80&width=80",
      excerpt:
        "I've noticed that our local park is not being maintained properly. The grass is overgrown, and there's trash everywhere. I think we should organize a community clean-up and also petition the local authorities to increase maintenance frequency.",
      tags: ["parks", "maintenance", "community-action"],
    },
    {
      id: 2,
      title: "Organizing a community clean-up drive",
      category: "Events",
      author: "Priya M.",
      authorLevel: 4,
      authorKarma: 520,
      time: "5 hours ago",
      replies: 18,
      views: 124,
      likes: 42,
      image: "/placeholder.svg?height=80&width=80",
      excerpt:
        "Let's organize a community clean-up drive this weekend. I've already spoken with the municipal corporation, and they're willing to provide cleaning supplies and waste collection support. We need volunteers!",
      tags: ["clean-up", "volunteer", "weekend-activity"],
    },
    {
      id: 3,
      title: "Proposal for better street lighting in Sector 7",
      category: "Infrastructure",
      author: "Amit K.",
      authorLevel: 2,
      authorKarma: 380,
      time: "1 day ago",
      replies: 32,
      views: 210,
      likes: 65,
      image: "/placeholder.svg?height=80&width=80",
      excerpt:
        "The street lighting in Sector 7 is inadequate, making it unsafe for residents, especially women and elderly, to walk after dark. I've drafted a proposal for improved LED lighting that's both energy-efficient and brighter.",
      tags: ["safety", "lighting", "infrastructure"],
    },
    {
      id: 4,
      title: "Starting a neighborhood watch program",
      category: "Safety",
      author: "Neha G.",
      authorLevel: 3,
      authorKarma: 410,
      time: "2 days ago",
      replies: 27,
      views: 180,
      likes: 53,
      image: "/placeholder.svg?height=80&width=80",
      excerpt:
        "With the recent increase in petty thefts in our area, I think it's time we start a neighborhood watch program. This would involve residents taking turns to patrol the area and report suspicious activities to the police.",
      tags: ["safety", "neighborhood-watch", "community-security"],
    },
    {
      id: 5,
      title: "Weekly farmers market proposal",
      category: "Events",
      author: "Vikram S.",
      authorLevel: 5,
      authorKarma: 650,
      time: "3 days ago",
      replies: 41,
      views: 230,
      likes: 78,
      image: "/placeholder.svg?height=80&width=80",
      excerpt:
        "I'm proposing a weekly farmers market in our community center. This would give local farmers a platform to sell fresh produce directly to consumers, eliminating middlemen and reducing costs for everyone.",
      tags: ["farmers-market", "local-produce", "community-event"],
    },
  ]

  // Mock data for events
  const events = [
    {
      id: 1,
      title: "Community Clean-up Drive",
      date: "June 15, 2023",
      time: "9:00 AM - 12:00 PM",
      location: "Central Park",
      organizer: "Priya M.",
      attendees: 28,
      image: "/placeholder.svg?height=200&width=300",
      description:
        "Join us for a community clean-up drive at Central Park. Bring gloves and water. Cleaning supplies will be provided.",
    },
    {
      id: 2,
      title: "Weekly Farmers Market",
      date: "Every Sunday",
      time: "7:00 AM - 11:00 AM",
      location: "Community Center",
      organizer: "Vikram S.",
      attendees: 150,
      image: "/placeholder.svg?height=200&width=300",
      description:
        "Fresh produce directly from local farmers. Support local agriculture and get the freshest vegetables and fruits.",
    },
    {
      id: 3,
      title: "Neighborhood Safety Workshop",
      date: "June 22, 2023",
      time: "6:00 PM - 8:00 PM",
      location: "Public Library",
      organizer: "Neha G.",
      attendees: 35,
      image: "/placeholder.svg?height=200&width=300",
      description: "Learn about home safety, emergency preparedness, and how to start a neighborhood watch program.",
    },
  ]

  // Mock data for polls
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

  // Mock data for top contributors
  const topContributors = [
    {
      name: "Vikram S.",
      karma: 650,
      level: 5,
      posts: 32,
      comments: 87,
      image: "/placeholder.svg?height=40&width=40",
      badges: ["Top Contributor", "Helpful", "Initiator"],
    },
    {
      name: "Priya M.",
      karma: 520,
      level: 4,
      posts: 28,
      comments: 65,
      image: "/placeholder.svg?height=40&width=40",
      badges: ["Helpful", "Initiator"],
    },
    {
      name: "Rahul S.",
      karma: 450,
      level: 3,
      posts: 18,
      comments: 42,
      image: "/placeholder.svg?height=40&width=40",
      badges: ["Helpful"],
    },
  ]

  // Filter discussions based on search query and category
  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      searchQuery === "" ||
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || discussion.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleCreatePost = (e) => {
    e.preventDefault()
    // In a real app, you would submit the form data to your backend
    setNewPostOpen(false)
    // Show success message or redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Community Forums & Engagement
              </h1>
              <p className="mt-4 text-white/80 md:text-xl max-w-[600px]">
                Join discussions, share ideas, and collaborate with your community. Earn Karma and badges as you
                contribute.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-white/90">
                      <PlusCircle className="mr-2 h-4 w-4" /> Start a Discussion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create a New Discussion</DialogTitle>
                      <DialogDescription>
                        Share your thoughts, ideas, or questions with the community. Earn Karma for quality
                        contributions.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreatePost}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="title" className="text-sm font-medium">
                            Title
                          </label>
                          <Input id="title" placeholder="Enter a descriptive title" required />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="category" className="text-sm font-medium">
                            Category
                          </label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="environment">Environment</SelectItem>
                              <SelectItem value="events">Events</SelectItem>
                              <SelectItem value="infrastructure">Infrastructure</SelectItem>
                              <SelectItem value="safety">Safety</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="health">Health</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="content" className="text-sm font-medium">
                            Content
                          </label>
                          <Textarea
                            id="content"
                            placeholder="Share your thoughts, ideas, or questions..."
                            rows={6}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="tags" className="text-sm font-medium">
                            Tags (comma separated)
                          </label>
                          <Input id="tags" placeholder="e.g., environment, community, safety" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setNewPostOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Post Discussion</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                  <Link href="#discussions">Browse Discussions</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="relative w-[350px] h-[350px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <Image src="/placeholder.svg?height=48&width=48" alt="User" width={48} height={48} />
                    </div>
                    <div>
                      <div className="font-medium text-white">Community Member</div>
                      <div className="text-sm text-white/70">Level 3 • 450 Karma</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm font-medium">Your Community Impact</div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-xl font-bold">12</div>
                          <div className="text-xs text-white/70">Posts</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold">48</div>
                          <div className="text-xs text-white/70">Comments</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold">320</div>
                          <div className="text-xs text-white/70">Karma</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm font-medium">Recent Badges</div>
                      <div className="mt-2 flex gap-2">
                        <div className="p-2 bg-indigo-500/20 rounded-full">
                          <Award className="h-4 w-4" />
                        </div>
                        <div className="p-2 bg-purple-500/20 rounded-full">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div className="p-2 bg-pink-500/20 rounded-full">
                          <ThumbsUp className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="discussions" className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search discussions..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Environment">Environment</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> New Post
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="polls">Polls</TabsTrigger>
                </TabsList>

                {/* Discussions Tab */}
                <TabsContent value="discussions" className="space-y-6 mt-6">
                  {filteredDiscussions.length > 0 ? (
                    filteredDiscussions.map((discussion) => (
                      <Card
                        key={discussion.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={discussion.image} alt={discussion.author} />
                                  <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1">
                                  <LevelBadge level={discussion.authorLevel} size="xs" />
                                </div>
                              </div>
                              <div>
                                <Link href={`/community/discussions/${discussion.id}`}>
                                  <CardTitle className="text-lg hover:text-indigo-600 transition-colors">
                                    {discussion.title}
                                  </CardTitle>
                                </Link>
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
                          <p className="text-sm text-muted-foreground">{discussion.excerpt}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {discussion.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
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
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/community/discussions/${discussion.id}`}>Read More</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">No discussions found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                      <Button
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("")
                          setCategoryFilter("all")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Events Tab */}
                <TabsContent value="events" className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-48 w-full">
                          <Image
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-bold text-white">{event.title}</h3>
                            <div className="flex items-center text-sm text-white/80 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {event.date} • {event.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{event.attendees} attending</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <div className="text-sm text-muted-foreground">
                            Organized by: <span className="font-medium">{event.organizer}</span>
                          </div>
                          <Button size="sm">Join Event</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center">
                    <Button variant="outline">View All Events</Button>
                  </div>
                </TabsContent>

                {/* Polls Tab */}
                <TabsContent value="polls" className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
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
                                    <div className="h-full bg-indigo-600" style={{ width: `${percentage}%` }} />
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
                  </div>
                  <div className="text-center">
                    <Button variant="outline">View All Polls</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Community Stats */}
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

              {/* Top Contributors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Contributors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={contributor.image} alt={contributor.name} />
                            <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1">
                            <LevelBadge level={contributor.level} size="xs" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{contributor.name}</div>
                            <div className="flex items-center text-xs text-indigo-600">
                              <Award className="h-3 w-3 mr-1" />
                              <span>{contributor.karma} Karma</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {contributor.posts} posts • {contributor.comments} comments
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {contributor.badges.map((badge, badgeIndex) => (
                              <Badge key={badgeIndex} variant="outline" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    View All Contributors
                  </Button>
                </CardFooter>
              </Card>

              {/* How to Earn Karma */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How to Earn Karma</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Create Quality Posts</div>
                        <p className="text-xs text-muted-foreground">+10-20 Karma per post</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                        <ThumbsUp className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Helpful Comments</div>
                        <p className="text-xs text-muted-foreground">+5-10 Karma per comment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Organize Events</div>
                        <p className="text-xs text-muted-foreground">+30 Karma per event</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Regular Participation</div>
                        <p className="text-xs text-muted-foreground">+2 Karma daily for activity</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Level Up in Your Community</h2>
          <p className="mt-4 text-gray-600 md:text-lg max-w-[800px] mx-auto dark:text-gray-400">
            Join discussions, organize events, and help your neighbors. Earn Karma, unlock badges, and make a real
            difference.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white" asChild>
              <Link href="/register">Join the Community</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
              asChild
            >
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
