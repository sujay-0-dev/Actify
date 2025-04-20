"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertTriangle,
  Leaf,
  ShoppingBag,
  Lightbulb,
  Award,
  Users,
  ArrowRight,
  MapPin,
  Calendar,
  Star,
  Zap,
  Trophy,
  Activity,
} from "lucide-react"

export default function HomePage() {
  const auth = useAuth() || {};
  const { user, logout } = auth;
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState(null)
  const [featuredChallenges, setFeaturedChallenges] = useState([])
  const [recentReports, setRecentReports] = useState([])
  const [topContributors, setTopContributors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("/api/home")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch home data")
        }

        setStats(data.stats)
        setFeaturedChallenges(data.featuredChallenges)
        setRecentReports(data.recentReports)
        setTopContributors(data.topContributors)
      } catch (error) {
        console.error("Error fetching home data:", error)
        toast({
          title: "Error loading data",
          description: error.message || "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchHomeData()
  }, [toast])

  return (
    <div className="relative">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden text-white bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>

          {/* Animated particles */}
          <div className="absolute w-64 h-64 bg-blue-500 rounded-full top-1/4 left-1/4 mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bg-purple-500 rounded-full top-1/3 right-1/4 w-72 h-72 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bg-pink-500 rounded-full bottom-1/4 right-1/3 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 py-20 md:py-32">
          <div className="grid items-center grid-cols-1 gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <Badge className="px-3 py-1 text-sm text-white bg-white/10 backdrop-blur-sm border-white/20">
                <Zap className="h-3.5 w-3.5 mr-1" />
                Community-Powered Impact
              </Badge>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                <span className="block">Make a Difference</span>
                <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
                  Earn Karma Points
                </span>
              </h1>
              <p className="max-w-lg text-xl text-white/80">
                Join Actify to report public issues, share skills, discover welfare schemes, and participate in eco
                challenges - all while earning karma points and badges.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="text-blue-900 bg-white hover:bg-white/90"
                  onClick={() => router.push(user ? "/dashboard" : "/register")}
                >
                  {user ? "Go to Dashboard" : "Join Now"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/10"
                  onClick={() => router.push("/public-issues")}
                >
                  Explore Public Issues
                </Button>
              </div>

              {/* Gamified Stats */}
              {stats && (
                <div className="grid grid-cols-2 gap-3 mt-8 sm:grid-cols-4">
                  <div className="p-3 text-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <div className="text-xs text-white/70">Active Users</div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="text-2xl font-bold">{stats.totalReports}</div>
                    <div className="text-xs text-white/70">Issues Reported</div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="text-2xl font-bold">{stats.totalSkills}</div>
                    <div className="text-xs text-white/70">Skills Shared</div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="text-2xl font-bold">{stats.totalChallenges}</div>
                    <div className="text-xs text-white/70">Eco Challenges</div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative hidden md:block">
              <div className="relative w-full h-[500px]">
                <div className="absolute top-0 right-0 w-64 h-64 transform bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl rotate-6 opacity-80"></div>
                <div className="absolute w-64 h-64 transform top-20 right-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl -rotate-6 opacity-80"></div>
                <div className="absolute w-64 h-64 overflow-hidden bg-white shadow-xl top-10 right-10 rounded-2xl">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <Trophy className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Level Up!</h3>
                        <p className="text-xs text-gray-500">You reached Level 3</p>
                      </div>
                    </div>
                    <div className="h-2 mb-2 bg-gray-100 rounded-full">
                      <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
                    </div>
                    <p className="mb-3 text-xs text-gray-500">75% to Level 4</p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="p-2 text-center bg-green-100 rounded-lg">
                        <p className="text-lg font-bold text-green-600">120</p>
                        <p className="text-xs text-green-700">Eco</p>
                      </div>
                      <div className="p-2 text-center rounded-lg bg-amber-100">
                        <p className="text-lg font-bold text-amber-600">85</p>
                        <p className="text-xs text-amber-700">Civic</p>
                      </div>
                      <div className="p-2 text-center bg-purple-100 rounded-lg">
                        <p className="text-lg font-bold text-purple-600">65</p>
                        <p className="text-xs text-purple-700">Skill</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 transform w-72 h-72 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl -rotate-12 opacity-80"></div>
                <div className="absolute overflow-hidden bg-white shadow-xl bottom-20 left-20 w-72 h-72 rounded-2xl">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-800">New Badge Earned!</h3>
                      <Badge className="bg-yellow-500">+50 XP</Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                        <Leaf className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Eco Warrior</h3>
                        <p className="text-sm text-gray-500">Completed 5 eco challenges</p>
                      </div>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Share Achievement</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-16">
        {/* Features Section */}
        <div className="mb-16 text-center">
          <Badge className="mb-2">Platform Features</Badge>
          <h2 className="mb-4 text-3xl font-bold">Make an Impact in Multiple Ways</h2>
          <p className="max-w-2xl mx-auto text-gray-500">
            Actify offers multiple ways to contribute to your community and earn karma points.
          </p>

          <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden transition-shadow border-t-4 border-t-amber-500 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-amber-100">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Public Issue Reporting</h3>
                <p className="mb-4 text-gray-500">
                  Report public issues in your area and get them resolved by authorities.
                </p>
                <Link href="/public-issues/create" className="flex items-center font-medium text-amber-600">
                  Report an Issue
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-shadow border-t-4 border-t-purple-500 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-purple-100 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Skill Sharing</h3>
                <p className="mb-4 text-gray-500">
                  Share your skills with the community and help others learn something new.
                </p>
                <Link href="/skill-sharing" className="flex items-center font-medium text-purple-600">
                  Share a Skill
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-shadow border-t-4 border-t-pink-500 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-pink-100 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Marketplace</h3>
                <p className="mb-4 text-gray-500">
                  Buy and sell products within your community to promote local commerce.
                </p>
                <Link href="/marketplace" className="flex items-center font-medium text-pink-600">
                  Explore Marketplace
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-shadow border-t-4 border-t-green-500 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-lg">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Eco Challenges</h3>
                <p className="mb-4 text-gray-500">
                  Participate in eco-friendly challenges and make a positive impact on the environment.
                </p>
                <Link href="/eco-challenges" className="flex items-center font-medium text-green-600">
                  Join a Challenge
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured Eco Challenges */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Badge className="mb-2 text-green-800 bg-green-100 hover:bg-green-200">Featured</Badge>
              <h2 className="text-2xl font-bold">Eco Challenges</h2>
            </div>
            <Link href="/eco-challenges" className="flex items-center font-medium text-green-600">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-40 bg-gray-200 animate-pulse"></div>
                    <CardContent className="p-6">
                      <div className="w-3/4 h-6 mb-2 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 mb-1 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-5/6 h-4 mb-1 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-4/6 h-4 mb-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex justify-between">
                        <div className="w-1/3 h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-1/3 h-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : featuredChallenges.length > 0 ? (
              featuredChallenges.map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-40 bg-gradient-to-r from-green-500 to-teal-500">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Leaf className="w-16 h-16 text-white/50" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <Badge className="text-white bg-white/20">{challenge.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-lg font-bold">{challenge.title}</h3>
                    <p className="mb-4 text-sm text-gray-500 line-clamp-2">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Ends {new Date(challenge.deadline).toLocaleDateString()}</span>
                      </div>
                      <Badge className="text-green-800 bg-green-100">+{challenge.points} Points</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <Leaf className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700">No challenges available</h3>
                <p className="max-w-md mx-auto mt-2 text-gray-500">
                  Check back later for new eco challenges or create your own!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Public Issues */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Badge className="mb-2 bg-amber-100 text-amber-800 hover:bg-amber-200">Recent</Badge>
              <h2 className="text-2xl font-bold">Public Issues</h2>
            </div>
            <Link href="/public-issues" className="flex items-center font-medium text-amber-600">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="w-3/4 h-6 mb-2 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 mb-1 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-5/6 h-4 mb-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex justify-between">
                        <div className="w-1/3 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : recentReports.length > 0 ? (
              recentReports.map((report) => (
                <Card key={report.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold">{report.title}</h3>
                      <Badge
                        className={
                          report.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : report.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                        }
                      >
                        {report.status === "verified"
                          ? "Verified"
                          : report.status === "in_progress"
                            ? "In Progress"
                            : "Pending"}
                      </Badge>
                    </div>
                    <p className="mb-4 text-sm text-gray-500 line-clamp-2">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate max-w-[200px]">{report.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700">No public issues reported yet</h3>
                <p className="max-w-md mx-auto mt-2 text-gray-500">
                  Be the first to report a public issue in your area!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Contributors */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Badge className="mb-2 text-blue-800 bg-blue-100 hover:bg-blue-200">Community</Badge>
              <h2 className="text-2xl font-bold">Top Contributors</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="flex flex-col items-center p-6">
                      <div className="w-16 h-16 mb-3 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-24 h-6 mb-2 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-16 h-4 mb-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))
            ) : topContributors.length > 0 ? (
              topContributors.map((contributor) => (
                <Card key={contributor.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                  <CardContent className="flex flex-col items-center p-6">
                    <div className="relative mb-3">
                      <div className="w-16 h-16 overflow-hidden rounded-full">
                        <Image
                          src={contributor.avatar || "/placeholder.svg?height=64&width=64"}
                          alt={contributor.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-yellow-500 border-2 border-white rounded-full -bottom-1 -right-1">
                        {contributor.level}
                      </div>
                    </div>
                    <h3 className="mb-1 font-bold text-center">{contributor.name}</h3>
                    <div className="flex items-center mb-3 text-sm text-gray-500">
                      <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                      <span>{contributor.karma} Karma</span>
                    </div>
                    <div className="flex w-full gap-1">
                      {contributor.topBadges.map((badge, index) => (
                        <div
                          key={index}
                          className={`flex-1 h-8 rounded-md bg-${badge.color}-100 flex items-center justify-center`}
                          title={badge.name}
                        >
                          <span className="text-lg">{badge.icon}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-4 py-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700">No contributors yet</h3>
                <p className="max-w-md mx-auto mt-2 text-gray-500">
                  Start contributing to become one of our top contributors!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Karma System Explanation */}
      <div className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge className="mb-2 text-yellow-800 bg-yellow-100">Gamified Experience</Badge>
            <h2 className="mb-4 text-3xl font-bold">Karma System</h2>
            <p className="max-w-2xl mx-auto text-gray-500">
              Earn karma points for your contributions and level up your profile to unlock new features and badges.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-full">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Earn Points</h3>
                <p className="text-gray-500">
                  Earn karma points by reporting issues, sharing skills, participating in eco challenges, and more.
                  Different activities earn different types of karma.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-full">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Level Up</h3>
                <p className="text-gray-500">
                  As you accumulate karma points, you'll level up your profile. Higher levels unlock new features,
                  badges, and recognition in the community.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-purple-100 rounded-full">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Earn Badges</h3>
                <p className="text-gray-500">
                  Complete specific achievements to earn badges that showcase your contributions and expertise in
                  different areas of the platform.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => router.push(user ? "/profile" : "/register")}
            >
              {user ? "View Your Profile" : "Start Earning Karma"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-16">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col justify-center p-8 md:p-12">
              <Badge className="mb-2 w-fit">Join Today</Badge>
              <h2 className="mb-4 text-3xl font-bold">Ready to Make a Difference?</h2>
              <p className="mb-6 text-gray-500">
                Join Actify today and start contributing to your community while earning karma points and badges.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push(user ? "/dashboard" : "/register")}
                >
                  {user ? "Go to Dashboard" : "Create Account"}
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push(user ? "/profile" : "/login")}>
                  {user ? "View Profile" : "Log In"}
                </Button>
              </div>
            </div>
            <div className="relative flex items-center justify-center h-64 md:h-auto bg-gradient-to-br from-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
              <div className="relative z-10 p-8 text-center text-white">
                <Activity className="w-16 h-16 mx-auto mb-4 text-white/80" />
                <h3 className="mb-2 text-2xl font-bold">Community Impact</h3>
                <p className="max-w-md text-white/80">
                  Together, our community has reported {stats?.totalReports || "many"} issues, shared{" "}
                  {stats?.totalSkills || "numerous"} skills, and completed {stats?.totalChallenges || "countless"} eco
                  challenges.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
