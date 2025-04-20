"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  Mail,
  Phone,
  MapPin,
  Award,
  Star,
  Calendar,
  Activity,
  BarChart3,
  Leaf,
  ShoppingBag,
  Lightbulb,
  AlertTriangle,
  Edit,
  LogOut,
  Loader2,
  Trophy,
  Zap,
  Shield,
  ThumbsUp,
} from "lucide-react"

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile")
      return
    }

    if (user) {
      fetchProfileData()
    }
  }, [user, loading, router])

  const fetchProfileData = async () => {
    setIsLoading(true)
    try {
      // In a real app, we would fetch this from an API
      // For now, we'll create mock data based on the user object

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockProfileData = {
        userId: user.userId,
        username: user.username || user.name.toLowerCase().replace(/\s+/g, "_"),
        name: user.name,
        email: user.email,
        phone: "+91 9876543210",
        avatar: user.avatar || "/placeholder.svg?height=200&width=200",
        profile: {
          age: 28,
          gender: "Male",
          occupation: "Software Developer",
          location: "New Delhi, India",
          interests: ["Technology", "Environment", "Education"],
        },
        karma: {
          total: user.karma || 50,
          civic: 20,
          skill: 10,
          community: 10,
          eco: 10,
        },
        level: user.level || 1,
        badges: [
          {
            id: "newcomer",
            name: "Newcomer",
            description: "Joined the Actify community",
            color: "blue",
            icon: "🌟",
            earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(),
        activity: generateMockActivity(20),
        recentActivity: generateMockActivity(5),
        stats: {
          reports: {
            total: 2,
            verified: 1,
            upvotes: 5,
          },
          skills: {
            total: 1,
            participants: 3,
            rating: 4.5,
          },
          products: {
            total: 0,
            sold: 0,
            active: 0,
          },
          challenges: {
            created: 0,
            participated: 1,
            completed: 1,
          },
        },
      }

      setProfileData(mockProfileData)
    } catch (error) {
      console.error("Error fetching profile data:", error)
      toast({
        title: "Error loading profile",
        description: "Failed to load profile data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockActivity = (count) => {
    const activityTypes = [
      { type: "report_created", title: "Reported a pothole on Main Street", points: 15 },
      { type: "report_upvoted", title: "Upvoted a report about street lighting", points: 5 },
      { type: "skill_created", title: "Shared a skill: Basic Computer Training", points: 20 },
      { type: "challenge_joined", title: "Joined the 'Plant a Tree' challenge", points: 10 },
      { type: "karma_earned", title: "Earned karma points for community participation", points: 5 },
    ]

    return Array.from({ length: count }, (_, i) => {
      const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      return {
        id: `activity-${i}`,
        type: activity.type,
        description: activity.title,
        points: activity.points,
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      }
    })
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error logging out",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Error</CardTitle>
            <CardDescription>Could not load your profile data</CardDescription>
          </CardHeader>
          <CardContent>
            <p>There was an error loading your profile. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const getNextLevelProgress = () => {
    const { karma, level } = profileData
    const currentLevelThreshold = getLevelThreshold(level)
    const nextLevelThreshold = getLevelThreshold(level + 1)
    const karmaNeeded = nextLevelThreshold - currentLevelThreshold
    const karmaProgress = karma.total - currentLevelThreshold
    return Math.min(Math.floor((karmaProgress / karmaNeeded) * 100), 100)
  }

  const getLevelThreshold = (level) => {
    const thresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000]
    return thresholds[level - 1] || 0
  }

  const getKarmaNeededForNextLevel = () => {
    const { karma, level } = profileData
    const nextLevelThreshold = getLevelThreshold(level + 1)
    return Math.max(0, nextLevelThreshold - karma.total)
  }

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <CardContent className="pt-16 pb-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                  <div className="relative p-1 bg-white rounded-full">
                    <Image
                      src={profileData.avatar || "/placeholder.svg?height=100&width=100"}
                      alt={profileData.name}
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  </div>
                  <div className="absolute flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-yellow-500 border-2 border-white rounded-full -bottom-2 -right-2">
                    {profileData.level}
                  </div>
                </div>

                <h2 className="text-xl font-bold">{profileData.name}</h2>
                <p className="mb-2 text-gray-500">@{profileData.username}</p>
                <div className="flex items-center gap-1 mb-4">
                  <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                    {profileData.userId}
                  </Badge>
                </div>

                <div className="w-full mb-6">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Level {profileData.level}</span>
                    <span>Level {profileData.level + 1}</span>
                  </div>
                  <Progress value={getNextLevelProgress()} className="h-2" />
                  <p className="mt-1 text-xs text-center text-gray-500">
                    {getKarmaNeededForNextLevel()} karma points needed for next level
                  </p>
                </div>

                <div className="grid w-full grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 rounded-lg bg-blue-50">
                    <Trophy className="w-5 h-5 mb-1 text-blue-600" />
                    <span className="text-lg font-bold">{profileData.karma.total}</span>
                    <span className="text-xs text-gray-500">Total Karma</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg bg-purple-50">
                    <Award className="w-5 h-5 mb-1 text-purple-600" />
                    <span className="text-lg font-bold">{profileData.badges.length}</span>
                    <span className="text-xs text-gray-500">Badges</span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{profileData.profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Joined {new Date(profileData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6 border-t">
              <Button variant="outline" size="sm" onClick={() => router.push("/profile/edit")}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-green-50">
                    <Leaf className="w-6 h-6 mb-2 text-green-600" />
                    <span className="text-xl font-bold">{profileData.karma.eco}</span>
                    <span className="text-xs text-gray-500">Eco Karma</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-amber-50">
                    <AlertTriangle className="w-6 h-6 mb-2 text-amber-600" />
                    <span className="text-xl font-bold">{profileData.karma.civic}</span>
                    <span className="text-xs text-gray-500">Civic Karma</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-purple-50">
                    <Lightbulb className="w-6 h-6 mb-2 text-purple-600" />
                    <span className="text-xl font-bold">{profileData.karma.skill}</span>
                    <span className="text-xs text-gray-500">Skill Karma</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-pink-50">
                    <ShoppingBag className="w-6 h-6 mb-2 text-pink-600" />
                    <span className="text-xl font-bold">{profileData.karma.community}</span>
                    <span className="text-xs text-gray-500">Community Karma</span>
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center mb-3 text-lg font-semibold">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                    Recent Badges
                  </h3>
                  {profileData.badges.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {profileData.badges.slice(0, 4).map((badge) => (
                        <div
                          key={badge.id}
                          className="flex items-center p-3 border rounded-lg bg-gradient-to-r from-white to-gray-50"
                        >
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 text-white bg-${badge.color}-500`}
                          >
                            <span className="text-lg">{badge.icon}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{badge.name}</h4>
                            <p className="text-xs text-gray-500">{badge.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No badges earned yet. Start contributing to earn badges!</p>
                  )}
                  {profileData.badges.length > 4 && (
                    <Button variant="link" className="p-0 mt-2" onClick={() => setActiveTab("achievements")}>
                      View all badges
                    </Button>
                  )}
                </div>

                <div>
                  <h3 className="flex items-center mb-3 text-lg font-semibold">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    Recent Activity
                  </h3>
                  {profileData.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {profileData.recentActivity.slice(0, 3).map((activity, index) => (
                        <div key={index} className="flex items-start p-3 border rounded-lg">
                          <div className="flex-shrink-0 mr-3">
                            {activity.type === "report_created" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                            {activity.type === "skill_created" && <Lightbulb className="w-5 h-5 text-purple-500" />}
                            {activity.type === "product_listed" && <ShoppingBag className="w-5 h-5 text-pink-500" />}
                            {activity.type === "challenge_joined" && <Leaf className="w-5 h-5 text-green-500" />}
                            {activity.type === "karma_earned" && <Zap className="w-5 h-5 text-yellow-500" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleDateString()} •{" "}
                              {new Date(activity.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          {activity.points && (
                            <div className="flex items-center text-sm font-medium text-green-600">
                              +{activity.points}
                              <Star className="w-3 h-3 ml-1" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No recent activity. Start contributing to the platform!</p>
                  )}
                  {profileData.recentActivity.length > 3 && (
                    <Button variant="link" className="p-0 mt-2" onClick={() => setActiveTab("activity")}>
                      View all activity
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <div>
                  <h3 className="flex items-center mb-3 text-lg font-semibold">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                    Badges Earned
                  </h3>
                  {profileData.badges.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {profileData.badges.map((badge) => (
                        <div
                          key={badge.id}
                          className="flex items-center p-4 border rounded-lg bg-gradient-to-r from-white to-gray-50"
                        >
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 text-white bg-${badge.color}-500`}
                          >
                            <span className="text-xl">{badge.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{badge.name}</h4>
                            <p className="text-sm text-gray-500">{badge.description}</p>
                            <p className="text-xs text-gray-400">
                              Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <h4 className="text-lg font-medium text-gray-700">No Badges Yet</h4>
                      <p className="max-w-md mx-auto mt-2 text-gray-500">
                        Start contributing to the platform by reporting issues, sharing skills, or participating in eco
                        challenges to earn badges.
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="flex items-center mb-3 text-lg font-semibold">
                    <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                    Level Progress
                  </h3>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-lg font-bold">Level {profileData.level}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({profileData.karma.total} / {getLevelThreshold(profileData.level + 1)} karma)
                        </span>
                      </div>
                      <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                        {profileData.level < 10
                          ? `${getNextLevelProgress()}% to Level ${profileData.level + 1}`
                          : "Max Level"}
                      </Badge>
                    </div>
                    <Progress value={getNextLevelProgress()} className="h-3" />

                    <div className="grid grid-cols-5 gap-2 mt-4">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full ${
                            i + 1 <= profileData.level ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Advanced</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center text-lg font-semibold">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    Activity History
                  </h3>
                  <select className="p-1 text-sm border rounded-md">
                    <option value="all">All Activity</option>
                    <option value="reports">Reports</option>
                    <option value="skills">Skills</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="challenges">Eco Challenges</option>
                  </select>
                </div>

                {profileData.activity.length > 0 ? (
                  <div className="space-y-3">
                    {profileData.activity.map((activity, index) => (
                      <div key={index} className="flex items-start p-3 border rounded-lg">
                        <div className="flex-shrink-0 mr-3">
                          {activity.type === "report_created" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                          {activity.type === "report_upvoted" && <ThumbsUp className="w-5 h-5 text-blue-500" />}
                          {activity.type === "skill_created" && <Lightbulb className="w-5 h-5 text-purple-500" />}
                          {activity.type === "product_listed" && <ShoppingBag className="w-5 h-5 text-pink-500" />}
                          {activity.type === "challenge_joined" && <Leaf className="w-5 h-5 text-green-500" />}
                          {activity.type === "challenge_completed" && <Trophy className="w-5 h-5 text-yellow-500" />}
                          {activity.type === "karma_earned" && <Zap className="w-5 h-5 text-yellow-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString()} •{" "}
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {activity.points && (
                          <div className="flex items-center text-sm font-medium text-green-600">
                            +{activity.points}
                            <Star className="w-3 h-3 ml-1" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <h4 className="text-lg font-medium text-gray-700">No Activity Yet</h4>
                    <p className="max-w-md mx-auto mt-2 text-gray-500">
                      Your activity history will appear here once you start contributing to the platform.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <div>
                  <h3 className="flex items-center mb-3 text-lg font-semibold">
                    <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
                    Contribution Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 text-sm font-medium text-gray-500">Public Issues</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-2xl font-bold">{profileData.stats.reports.total}</p>
                          <p className="text-xs text-gray-500">Total Reports</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{profileData.stats.reports.verified}</p>
                          <p className="text-xs text-gray-500">Verified</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 text-sm font-medium text-gray-500">Skills Shared</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-2xl font-bold">{profileData.stats.skills.total}</p>
                          <p className="text-xs text-gray-500">Total Skills</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{profileData.stats.skills.participants}</p>
                          <p className="text-xs text-gray-500">Participants</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 text-sm font-medium text-gray-500">Marketplace</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-2xl font-bold">{profileData.stats.products.total}</p>
                          <p className="text-xs text-gray-500">Products Listed</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{profileData.stats.products.sold}</p>
                          <p className="text-xs text-gray-500">Sold</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="mb-2 text-sm font-medium text-gray-500">Eco Challenges</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-2xl font-bold">{profileData.stats.challenges.participated}</p>
                          <p className="text-xs text-gray-500">Participated</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{profileData.stats.challenges.completed}</p>
                          <p className="text-xs text-gray-500">Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center mb-3 text-lg font-semibold">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Karma Breakdown
                  </h3>
                  <div className="p-4 border rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Civic Karma</span>
                          <span className="text-sm font-medium">
                            {profileData.karma.civic} / {profileData.karma.total}
                          </span>
                        </div>
                        <Progress
                          value={(profileData.karma.civic / profileData.karma.total) * 100}
                          className="h-2 bg-gray-100"
                        >
                          <div className="h-full rounded-full bg-amber-500"></div>
                        </Progress>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Skill Karma</span>
                          <span className="text-sm font-medium">
                            {profileData.karma.skill} / {profileData.karma.total}
                          </span>
                        </div>
                        <Progress
                          value={(profileData.karma.skill / profileData.karma.total) * 100}
                          className="h-2 bg-gray-100"
                        >
                          <div className="h-full bg-purple-500 rounded-full"></div>
                        </Progress>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Community Karma</span>
                          <span className="text-sm font-medium">
                            {profileData.karma.community} / {profileData.karma.total}
                          </span>
                        </div>
                        <Progress
                          value={(profileData.karma.community / profileData.karma.total) * 100}
                          className="h-2 bg-gray-100"
                        >
                          <div className="h-full bg-pink-500 rounded-full"></div>
                        </Progress>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Eco Karma</span>
                          <span className="text-sm font-medium">
                            {profileData.karma.eco} / {profileData.karma.total}
                          </span>
                        </div>
                        <Progress
                          value={(profileData.karma.eco / profileData.karma.total) * 100}
                          className="h-2 bg-gray-100"
                        >
                          <div className="h-full bg-green-500 rounded-full"></div>
                        </Progress>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
