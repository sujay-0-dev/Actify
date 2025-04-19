"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Leaf,
  Upload,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Trash2,
  Recycle,
  TreePine,
  Droplets,
  Wind,
  ArrowRight,
  Camera,
} from "lucide-react"
import LevelBadge from "@/components/gamification/level-badge"

export default function EcoChallengesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState(null)

  // Mock data for eco challenges
  const challenges = [
    {
      id: 1,
      title: "Plant a Tree",
      category: "Plantation",
      icon: TreePine,
      description: "Plant a tree in your neighborhood and help increase the green cover",
      points: 50,
      deadline: "June 30, 2023",
      participants: 245,
      completions: 128,
      difficulty: "easy",
      steps: [
        "Choose a native tree species suitable for your area",
        "Dig a hole twice as wide as the root ball",
        "Place the tree in the hole and fill with soil",
        "Water thoroughly and add mulch around the base",
        "Take a photo as proof of completion",
      ],
      status: "active",
      progress: 0,
    },
    {
      id: 2,
      title: "Community Clean-up",
      category: "Waste Management",
      icon: Trash2,
      description: "Organize or participate in a community clean-up drive in your locality",
      points: 75,
      deadline: "July 15, 2023",
      participants: 180,
      completions: 65,
      difficulty: "medium",
      steps: [
        "Gather cleaning supplies (gloves, bags, etc.)",
        "Clean a public area for at least 2 hours",
        "Separate recyclables from general waste",
        "Dispose of waste properly",
        "Take before and after photos as proof",
      ],
      status: "active",
      progress: 0,
    },
    {
      id: 3,
      title: "Zero Waste Week",
      category: "Waste Management",
      icon: Recycle,
      description: "Live a zero waste lifestyle for one week by avoiding single-use plastics and minimizing waste",
      points: 100,
      deadline: "July 31, 2023",
      participants: 120,
      completions: 42,
      difficulty: "hard",
      steps: [
        "Use reusable bags, bottles, and containers",
        "Avoid packaged foods and single-use items",
        "Compost food waste",
        "Repair items instead of replacing them",
        "Document your journey with daily photos",
      ],
      status: "active",
      progress: 0,
    },
    {
      id: 4,
      title: "Water Conservation",
      category: "Water",
      icon: Droplets,
      description: "Implement water conservation measures at home and track your reduced water usage",
      points: 60,
      deadline: "August 15, 2023",
      participants: 150,
      completions: 78,
      difficulty: "medium",
      steps: [
        "Fix any leaking taps or pipes",
        "Install water-saving devices in toilets and showers",
        "Collect and reuse rainwater for plants",
        "Track your water usage before and after implementation",
        "Take photos of your conservation methods",
      ],
      status: "active",
      progress: 0,
    },
    {
      id: 5,
      title: "Renewable Energy Challenge",
      category: "Energy",
      icon: Wind,
      description: "Switch to renewable energy sources or reduce your energy consumption significantly",
      points: 80,
      deadline: "August 30, 2023",
      participants: 90,
      completions: 35,
      difficulty: "hard",
      steps: [
        "Conduct an energy audit of your home",
        "Replace conventional bulbs with LED lights",
        "Use solar chargers for devices where possible",
        "Reduce air conditioning/heating usage",
        "Document your energy-saving measures",
      ],
      status: "active",
      progress: 0,
    },
  ]

  // Filter challenges based on search query and category
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      searchQuery === "" ||
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || challenge.category === selectedCategory
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && challenge.status === "active") ||
      (activeTab === "completed" && challenge.status === "completed") ||
      (activeTab === "my" && (challenge.status === "active" || challenge.status === "completed"))

    return matchesSearch && matchesCategory && matchesTab
  })

  const openUploadProof = (challenge) => {
    setSelectedChallenge(challenge)
    setUploadDialogOpen(true)
  }

  const categories = ["Plantation", "Waste Management", "Water", "Energy"]

  // Mock leaderboard data
  const leaderboard = [
    {
      name: "Vikram S.",
      points: 650,
      level: 5,
      challenges: 12,
      image: "/placeholder.svg?height=40&width=40",
      badges: ["Eco Warrior", "Zero Waste Champ"],
    },
    {
      name: "Priya M.",
      points: 520,
      level: 4,
      challenges: 9,
      image: "/placeholder.svg?height=40&width=40",
      badges: ["Eco Warrior"],
    },
    {
      name: "Rahul S.",
      points: 450,
      level: 3,
      challenges: 7,
      image: "/placeholder.svg?height=40&width=40",
      badges: ["Tree Planter"],
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Eco Challenges Arena</h1>
              <p className="mt-4 text-white/80 md:text-xl max-w-[600px]">
                Participate in environmental tasks, earn Eco-Karma, and make a real difference to our planet. Complete
                challenges and earn badges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-white/90" asChild>
                  <Link href="#challenges">
                    <Leaf className="mr-2 h-4 w-4" /> Take a Challenge
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                  <Link href="#leaderboard">View Leaderboard</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="relative w-[350px] h-[350px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-white/20">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Weekly Challenges</div>
                      <div className="text-sm text-white/70">Complete tasks, earn rewards</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm font-medium">Your Eco Impact</div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold">3</span>
                          <span className="text-xs text-white/70">Trees Planted</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-bold">12kg</span>
                          <span className="text-xs text-white/70">Waste Collected</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-bold">5</span>
                          <span className="text-xs text-white/70">Challenges</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-bold">250</span>
                          <span className="text-xs text-white/70">Eco-Karma</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm font-medium">Recent Badges</div>
                      <div className="mt-2 flex gap-2">
                        <div className="p-2 bg-green-500/20 rounded-full">
                          <TreePine className="h-4 w-4" />
                        </div>
                        <div className="p-2 bg-blue-500/20 rounded-full">
                          <Droplets className="h-4 w-4" />
                        </div>
                        <div className="p-2 bg-amber-500/20 rounded-full">
                          <Recycle className="h-4 w-4" />
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
      <section id="challenges" className="py-12">
        <div className="container px-4 md:px-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search challenges..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="active">Active Challenges</TabsTrigger>
                  <TabsTrigger value="my">My Challenges</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-6 mt-6">
                  {filteredChallenges.length > 0 ? (
                    filteredChallenges.map((challenge) => (
                      <Card
                        key={challenge.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                <challenge.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <Link href={`/eco-challenges/${challenge.id}`}>
                                  <CardTitle className="text-lg hover:text-green-600 transition-colors">
                                    {challenge.title}
                                  </CardTitle>
                                </Link>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Badge variant="outline">{challenge.category}</Badge>
                                  <span className="mx-2">•</span>
                                  <span>Deadline: {challenge.deadline}</span>
                                </div>
                              </div>
                            </div>
                            <Badge
                              className={
                                challenge.difficulty === "easy"
                                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                  : challenge.difficulty === "medium"
                                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              }
                            >
                              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-green-500" />
                              <span className="text-muted-foreground">{challenge.participants} participants</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-muted-foreground">{challenge.completions} completions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-amber-500" />
                              <span className="text-muted-foreground">+{challenge.points} Eco-Karma</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-indigo-500" />
                              <span className="text-muted-foreground">Ends: {challenge.deadline}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/eco-challenges/${challenge.id}`}>View Details</Link>
                          </Button>
                          <Button size="sm" onClick={() => openUploadProof(challenge)}>
                            Take Challenge
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Leaf className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">No challenges found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                      <Button
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("all")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="my" className="space-y-6 mt-6">
                  <div className="text-center py-12">
                    <Leaf className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No active challenges</h3>
                    <p className="text-muted-foreground">You haven't taken any challenges yet</p>
                    <Button className="mt-4" onClick={() => setActiveTab("active")}>
                      Browse Challenges
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="space-y-6 mt-6">
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No completed challenges</h3>
                    <p className="text-muted-foreground">You haven't completed any challenges yet</p>
                    <Button className="mt-4" onClick={() => setActiveTab("active")}>
                      Take a Challenge
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Eco Impact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Eco Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg dark:bg-green-900/20">
                      <div className="flex items-center gap-2">
                        <TreePine className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="font-medium">Trees Planted</span>
                      </div>
                      <div className="text-2xl font-bold mt-2 text-green-600 dark:text-green-400">3</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">Water Saved</span>
                      </div>
                      <div className="text-2xl font-bold mt-2 text-blue-600 dark:text-blue-400">120L</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg dark:bg-amber-900/20">
                      <div className="flex items-center gap-2">
                        <Recycle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <span className="font-medium">Waste Collected</span>
                      </div>
                      <div className="text-2xl font-bold mt-2 text-amber-600 dark:text-amber-400">12kg</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg dark:bg-purple-900/20">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium">Eco-Karma</span>
                      </div>
                      <div className="text-2xl font-bold mt-2 text-purple-600 dark:text-purple-400">250</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Leaderboard Card */}
              <Card id="leaderboard">
                <CardHeader>
                  <CardTitle className="text-lg">Eco Champions</CardTitle>
                  <CardDescription>Top contributors this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((contributor, index) => (
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
                            <div className="flex items-center text-xs text-green-600">
                              <Award className="h-3 w-3 mr-1" />
                              <span>{contributor.points} Points</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {contributor.challenges} challenges completed
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
                    View Full Leaderboard
                  </Button>
                </CardFooter>
              </Card>

              {/* Badges Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Eco Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <TreePine className="h-5 w-5" />
                      </div>
                      <div className="mt-2 text-sm font-medium">Tree Planter</div>
                      <div className="text-xs text-muted-foreground">Plant 5+ trees</div>
                    </div>
                    <div className="flex flex-col items-center text-center opacity-50">
                      <div className="p-3 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400">
                        <Recycle className="h-5 w-5" />
                      </div>
                      <div className="mt-2 text-sm font-medium">Zero Waste Champ</div>
                      <div className="text-xs text-muted-foreground">Complete 3 waste challenges</div>
                    </div>
                    <div className="flex flex-col items-center text-center opacity-50">
                      <div className="p-3 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400">
                        <Droplets className="h-5 w-5" />
                      </div>
                      <div className="mt-2 text-sm font-medium">Water Saver</div>
                      <div className="text-xs text-muted-foreground">Save 500+ liters of water</div>
                    </div>
                    <div className="flex flex-col items-center text-center opacity-50">
                      <div className="p-3 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400">
                        <Leaf className="h-5 w-5" />
                      </div>
                      <div className="mt-2 text-sm font-medium">Eco Warrior</div>
                      <div className="text-xs text-muted-foreground">Complete 10+ challenges</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Proof Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Challenge Proof</DialogTitle>
            <DialogDescription>
              {selectedChallenge
                ? `Submit proof for ${selectedChallenge.title} challenge`
                : "Upload photos or videos as proof of challenge completion"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedChallenge && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <selectedChallenge.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{selectedChallenge.title}</div>
                  <div className="text-sm text-muted-foreground">{selectedChallenge.description}</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Challenge Steps</Label>
              <div className="space-y-2">
                {selectedChallenge?.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="p-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mt-0.5">
                      <span className="text-xs font-bold block w-4 h-4 text-center">{index + 1}</span>
                    </div>
                    <div className="text-sm">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof-description">Description</Label>
              <Textarea id="proof-description" placeholder="Describe how you completed the challenge..." rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Upload Proof</Label>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center">
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Drag and drop your photos/videos here, or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" /> Choose Files
                  </Button>
                  <input type="file" className="hidden" multiple accept="image/*,video/*" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, MP4. Maximum file size: 10MB</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Proof</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-950">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Take the Challenge, Earn Eco-Karma</h2>
          <p className="mt-4 text-gray-600 md:text-lg max-w-[800px] mx-auto dark:text-gray-400">
            Join thousands of community members making a positive impact on the environment. Complete challenges, earn
            badges, and climb the leaderboard.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white" asChild>
              <Link href="#challenges">
                Take a Challenge <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
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
