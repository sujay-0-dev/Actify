"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Star,
  Search,
  Filter,
  CheckCircle,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Award,
  Sparkles,
  Lightbulb,
  Loader2,
} from "lucide-react"
import LevelBadge from "@/components/gamification/level-badge"
import XpProgress from "@/components/gamification/xp-progress"

export default function SkillSharingPage() {
  const auth = useAuth() || {};
  const { user, logout } = auth;
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [skills, setSkills] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("find")

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for skills
      const mockSkills = [
        {
          id: 1,
          title: "Web Development Basics",
          provider: {
            name: "Rahul S.",
            avatar: "/placeholder.svg?height=80&width=80",
            level: 3,
          },
          category: "technology",
          type: "workshop",
          rating: 4.8,
          reviews: 24,
          karma: 450,
          verified: true,
          tags: ["HTML", "CSS", "JavaScript"],
          description: "Learn the fundamentals of web development with hands-on projects and exercises.",
          nextSession: "2023-07-15",
          time: "18:00",
          duration: "2 hours",
          capacity: 10,
          enrolled: 6,
        },
        {
          id: 2,
          title: "Graphic Design Masterclass",
          provider: {
            name: "Priya M.",
            avatar: "/placeholder.svg?height=80&width=80",
            level: 4,
          },
          category: "design",
          type: "course",
          rating: 4.9,
          reviews: 36,
          karma: 520,
          verified: true,
          tags: ["Photoshop", "Illustrator", "UI/UX"],
          description:
            "Comprehensive course covering all aspects of graphic design from basics to advanced techniques.",
          nextSession: "2023-07-10",
          time: "17:00",
          duration: "1.5 hours",
          capacity: 8,
          enrolled: 7,
        },
        {
          id: 3,
          title: "Content Writing Workshop",
          provider: {
            name: "Amit K.",
            avatar: "/placeholder.svg?height=80&width=80",
            level: 2,
          },
          category: "writing",
          type: "workshop",
          rating: 4.7,
          reviews: 18,
          karma: 380,
          verified: true,
          tags: ["Blogs", "Articles", "SEO"],
          description: "Learn how to write engaging content that ranks well in search engines.",
          nextSession: "2023-07-20",
          time: "19:00",
          duration: "1 hour",
          capacity: 15,
          enrolled: 9,
        },
        {
          id: 4,
          title: "Mobile App Development",
          provider: {
            name: "Sneha R.",
            avatar: "/placeholder.svg?height=80&width=80",
            level: 3,
          },
          category: "technology",
          type: "course",
          rating: 4.6,
          reviews: 15,
          karma: 320,
          verified: false,
          tags: ["Android", "iOS", "Flutter"],
          description: "Learn to build cross-platform mobile apps using Flutter framework.",
          nextSession: "2023-07-18",
          time: "20:00",
          duration: "2 hours",
          capacity: 12,
          enrolled: 5,
        },
        {
          id: 5,
          title: "Digital Marketing Essentials",
          provider: {
            name: "Vikram J.",
            avatar: "/placeholder.svg?height=80&width=80",
            level: 2,
          },
          category: "marketing",
          type: "workshop",
          rating: 4.5,
          reviews: 12,
          karma: 290,
          verified: true,
          tags: ["Social Media", "SEO", "Analytics"],
          description: "Master the fundamentals of digital marketing and grow your online presence.",
          nextSession: "2023-07-25",
          time: "18:30",
          duration: "1.5 hours",
          capacity: 20,
          enrolled: 12,
        },
        {
          id: 6,
          title: "Video Editing Techniques",
          provider: {
            name: "Neha P.",
            avatar: "/placeholder.svg?height=80&width=80",
            level: 3,
          },
          category: "multimedia",
          type: "course",
          rating: 4.7,
          reviews: 20,
          karma: 410,
          verified: false,
          tags: ["Premiere Pro", "After Effects", "Animation"],
          description: "Learn professional video editing techniques and create stunning videos.",
          nextSession: "2023-07-12",
          time: "19:30",
          duration: "2 hours",
          capacity: 10,
          enrolled: 8,
        },
      ]

      setSkills(mockSkills)
      setIsLoading(false)
    }

    loadData()
  }, [])

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "technology", label: "Technology" },
    { id: "design", label: "Design" },
    { id: "writing", label: "Writing" },
    { id: "marketing", label: "Marketing" },
    { id: "multimedia", label: "Multimedia" },
  ]

  const filteredSkills = skills
    .filter((skill) => categoryFilter === "all" || skill.category === categoryFilter)
    .filter(
      (skill) =>
        searchQuery === "" ||
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )

  const handleShareSkill = () => {
    if (!user) {
      router.push("/login?redirect=/skill-sharing/create")
    } else {
      router.push("/skill-sharing/create")
    }
  }

  const handleEnroll = (skillId) => {
    if (!user) {
      router.push("/login?redirect=/skill-sharing")
      return
    }

    // In a real app, you would make an API call to enroll
    toast({
      title: "Enrolled Successfully!",
      description: "You've enrolled in this skill session. +15 Karma points earned!",
      action: (
        <div className="flex items-center justify-center p-1 bg-green-100 rounded-full dark:bg-green-900/30">
          <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
      ),
    })
  }

  const userSkills = [
    {
      id: 101,
      title: "Photography Basics",
      category: "multimedia",
      type: "workshop",
      description: "Learn the fundamentals of photography and camera settings",
      nextSession: "2023-07-30",
      time: "16:00",
      duration: "1.5 hours",
      capacity: 12,
      enrolled: 4,
      status: "active",
    },
    {
      id: 102,
      title: "Cooking Indian Cuisine",
      category: "culinary",
      type: "course",
      description: "Master the art of cooking authentic Indian dishes",
      nextSession: "2023-08-05",
      time: "18:00",
      duration: "2 hours",
      capacity: 8,
      enrolled: 6,
      status: "draft",
    },
  ]

  const enrolledSkills = [
    {
      id: 2,
      title: "Graphic Design Masterclass",
      provider: {
        name: "Priya M.",
        avatar: "/placeholder.svg?height=80&width=80",
        level: 4,
      },
      nextSession: "2023-07-10",
      time: "17:00",
      progress: 60,
    },
    {
      id: 5,
      title: "Digital Marketing Essentials",
      provider: {
        name: "Vikram J.",
        avatar: "/placeholder.svg?height=80&width=80",
        level: 2,
      },
      nextSession: "2023-07-25",
      time: "18:30",
      progress: 30,
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 text-white bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Skill Sharing Platform</h1>
            <p className="mb-6 text-xl text-white/80">
              Teach what you know, learn what you don't. Connect with mentors and students in your community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleShareSkill} className="text-purple-600 bg-white hover:bg-white/90">
                <Lightbulb className="w-4 h-4 mr-2" /> Share Your Skill
              </Button>
              <Button variant="outline" className="text-black border-white hover:bg-white/20">
                <BookOpen className="w-4 h-4 mr-2" /> Find a Mentor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-[600px] grid-cols-3 mb-8">
              <TabsTrigger value="find">Find Skills</TabsTrigger>
              <TabsTrigger value="my-skills">My Skills</TabsTrigger>
              <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
            </TabsList>

            <TabsContent value="find" className="space-y-6">
              <div className="flex flex-col gap-4 mb-8 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    placeholder="Search for skills..."
                    className="pl-10 border-gray-300 dark:border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                  </Button>
                  <Button onClick={handleShareSkill} className="text-white bg-purple-600 hover:bg-purple-700">
                    Share Your Skill
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={categoryFilter === category.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCategoryFilter(category.id)}
                  >
                    {category.label}
                  </Badge>
                ))}
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSkills.map((skill) => (
                    <Card
                      key={skill.id}
                      className="overflow-hidden transition-shadow duration-300 hover:shadow-lg game-card"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={skill.provider.avatar} alt={skill.provider.name} />
                                <AvatarFallback>{skill.provider.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1">
                                <LevelBadge level={skill.provider.level} size="sm" />
                              </div>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{skill.title}</CardTitle>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <span>{skill.provider.name}</span>
                                {skill.verified && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {skill.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{skill.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="ml-1 font-medium">{skill.rating}</span>
                            <span className="mx-1 text-gray-400">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{skill.reviews} reviews</span>
                          </div>
                          <Badge variant="secondary">{skill.karma} Karma</Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {skill.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-gray-50/50 dark:bg-gray-800/50">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                              <span>{new Date(skill.nextSession).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                              <span>
                                {skill.time} ({skill.duration})
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-sm">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                              <span>
                                {skill.enrolled}/{skill.capacity} enrolled
                              </span>
                            </div>
                            <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                              {skill.capacity - skill.enrolled} spots left
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/20"
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="text-white bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleEnroll(skill.id)}
                        >
                          Enroll Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {filteredSkills.length === 0 && !isLoading && (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full dark:bg-purple-900/30">
                    <Search className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">No skills found</h3>
                  <p className="mb-6 text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
                  <Button
                    onClick={() => {
                      setCategoryFilter("all")
                      setSearchQuery("")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-skills" className="space-y-6">
              {!user ? (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full dark:bg-purple-900/30">
                    <Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Share Your Knowledge</h3>
                  <p className="mb-6 text-gray-500 dark:text-gray-400">
                    Sign in to start sharing your skills with the community
                  </p>
                  <Button asChild>
                    <Link href="/login?redirect=/skill-sharing">Sign In</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">My Shared Skills</h2>
                    <Button onClick={handleShareSkill} className="text-white bg-purple-600 hover:bg-purple-700">
                      Create New Skill
                    </Button>
                  </div>

                  {userSkills.length === 0 ? (
                    <div className="py-12 text-center rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full dark:bg-purple-900/30">
                        <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">No Skills Shared Yet</h3>
                      <p className="mb-6 text-gray-500 dark:text-gray-400">
                        Start sharing your knowledge and earn Karma points
                      </p>
                      <Button onClick={handleShareSkill}>Share Your First Skill</Button>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {userSkills.map((skill) => (
                        <Card
                          key={skill.id}
                          className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${skill.status === "draft" ? "border-dashed border-gray-300 dark:border-gray-700" : ""}`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{skill.title}</CardTitle>
                              <Badge variant={skill.status === "active" ? "default" : "outline"} className="capitalize">
                                {skill.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{skill.description}</p>

                            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                                  <span>{new Date(skill.nextSession).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                                  <span>
                                    {skill.time} ({skill.duration})
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2 text-sm">
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                                  <span>
                                    {skill.enrolled}/{skill.capacity} enrolled
                                  </span>
                                </div>
                                {skill.status === "active" && (
                                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                    {skill.capacity - skill.enrolled} spots left
                                  </div>
                                )}
                              </div>
                            </div>

                            {skill.status === "active" && (
                              <div className="flex items-center justify-between text-sm">
                                <div className="text-gray-500 dark:text-gray-400">Karma earned</div>
                                <div className="font-medium text-purple-600 dark:text-purple-400">+45 points</div>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="flex justify-between pt-4 border-t">
                            <Button variant="outline" size="sm">
                              {skill.status === "draft" ? "Edit Draft" : "Manage"}
                            </Button>
                            {skill.status === "draft" ? (
                              <Button size="sm" className="text-white bg-purple-600 hover:bg-purple-700">
                                Publish
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                Cancel Session
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="p-6 mt-8 border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-800">
                    <div className="flex flex-col items-center gap-6 md:flex-row">
                      <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full dark:bg-purple-900/30">
                        <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Skill Guru Status</h3>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">
                          Share more skills and earn reviews to level up your Skill Guru status
                        </p>
                        <XpProgress currentXp={45} nextLevelXp={100} level={1} />
                      </div>
                      <div className="text-center md:text-right">
                        <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">Current Status</div>
                        <Badge className="text-purple-800 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                          Skill Sharer
                        </Badge>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Next: Skill Mentor</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="enrolled" className="space-y-6">
              {!user ? (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full dark:bg-purple-900/30">
                    <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Learn New Skills</h3>
                  <p className="mb-6 text-gray-500 dark:text-gray-400">
                    Sign in to view your enrolled skills and track your progress
                  </p>
                  <Button asChild>
                    <Link href="/login?redirect=/skill-sharing">Sign In</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">My Enrolled Skills</h2>

                  {enrolledSkills.length === 0 ? (
                    <div className="py-12 text-center rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full dark:bg-purple-900/30">
                        <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">No Enrolled Skills Yet</h3>
                      <p className="mb-6 text-gray-500 dark:text-gray-400">
                        Explore and enroll in skills to start learning
                      </p>
                      <Button onClick={() => setActiveTab("find")}>Find Skills</Button>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {enrolledSkills.map((skill) => (
                        <Card key={skill.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{skill.title}</CardTitle>
                              <div className="relative">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={skill.provider.avatar} alt={skill.provider.name} />
                                  <AvatarFallback>{skill.provider.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1">
                                  <LevelBadge level={skill.provider.level} size="sm" />
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                                  <span>Next: {new Date(skill.nextSession).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                                  <span>{skill.time}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                <span className="font-medium">{skill.progress}%</span>
                              </div>
                              <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                                <div
                                  className="h-full transition-all duration-300 bg-purple-600 rounded-full"
                                  style={{ width: `${skill.progress}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <div className="text-gray-500 dark:text-gray-400">Karma earned</div>
                              <div className="font-medium text-purple-600 dark:text-purple-400">+15 points</div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-4 border-t">
                            <Button variant="outline" size="sm">
                              View Materials
                            </Button>
                            <Button size="sm" className="text-white bg-purple-600 hover:bg-purple-700">
                              Join Session
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="p-6 mt-8 border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-800">
                    <div className="flex flex-col items-center gap-6 md:flex-row">
                      <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full dark:bg-purple-900/30">
                        <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Learning Journey</h3>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">
                          Complete skills and earn badges to showcase your learning achievements
                        </p>
                        <XpProgress currentXp={30} nextLevelXp={100} level={1} />
                      </div>
                      <div className="text-center md:text-right">
                        <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">Current Status</div>
                        <Badge className="text-purple-800 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                          Active Learner
                        </Badge>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Next: Skill Enthusiast</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl dark:text-white">
              Skill Sharing Achievements
            </h2>
            <p className="text-gray-600 md:text-lg max-w-[800px] mx-auto mt-4 dark:text-gray-400">
              Earn badges and rewards as you share and learn skills
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                name: "Skill Guru",
                description: "Share 5 skills with the community",
                icon: Lightbulb,
                status: "unlocked",
              },
              { name: "Active Learner", description: "Complete 3 skill sessions", icon: BookOpen, status: "unlocked" },
              {
                name: "Skill Sharer",
                description: "Receive 10 positive reviews",
                icon: Star,
                status: "locked",
                progress: 4,
                total: 10,
              },
              {
                name: "Mentor",
                description: "Help 20 community members",
                icon: Users,
                status: "locked",
                progress: 0,
                total: 20,
              },
            ].map((badge, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`achievement-badge ${badge.status}`}>
                  <badge.icon className="w-6 h-6" />
                  {badge.progress > 0 && badge.progress < badge.total && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-white px-1.5 py-0.5 text-xs font-medium text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                      {badge.progress}/{badge.total}
                    </div>
                  )}
                </div>
                <span className="mt-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300">
                  {badge.name}
                </span>
                <span className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400">{badge.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
