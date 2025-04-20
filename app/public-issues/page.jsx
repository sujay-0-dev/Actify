"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  MapPin,
  Users,
  Filter,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  FlameIcon as Fire,
  Leaf,
  Zap,
  Home,
  Shield,
  Trophy,
  Star,
  Award,
  Sparkles,
  ThumbsUp,
  BadgeCheck
} from "lucide-react"

export default function PublicIssuesPage() {
  const auth = useAuth() || {};
  const { user, logout } = auth;
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [nearbyIssues, setNearbyIssues] = useState([])
  const [mapZoom, setMapZoom] = useState(14)
  const [userGameStats, setUserGameStats] = useState({
    level: 3,
    xp: 350,
    nextLevel: 500,
    badges: ['first_report', 'local_hero', 'problem_solver'],
    streak: 5
  })

  useEffect(() => {
    // Get user's location if they allow
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(userPos)
          console.log("User location detected:", userPos)
        },
        (error) => {
          console.error("Error getting location:", error)
          // Fallback to Delhi coordinates
          setUserLocation({ lat: 28.6139, lng: 77.209 })
        }
      )
    }

    // Simulate loading data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for public issue reports with more gamified elements
      const mockReports = [
        {
          id: 1,
          type: "pothole",
          category: "infrastructure",
          title: "Large pothole on Main Street",
          description: "There's a large pothole that's causing traffic issues and potential damage to vehicles.",
          location: "Main St & 5th Ave, New Delhi",
          coordinates: { lat: 28.6139, lng: 77.209 },
          status: "verified",
          user: {
            name: "Rahul S.",
            avatar: "/placeholder.svg?height=40&width=40",
            level: 5,
          },
          karma: 45,
          date: "2023-06-15",
          time: "14:30",
          upvotes: 12,
          images: ["/placeholder.svg?height=200&width=300"],
          rewards: ["localHero", "fastReporter"],
          impactScore: 85
        },
        {
          id: 2,
          type: "streetlight",
          category: "safety",
          title: "Street light not working",
          description: "The street light has been out for over a week, making the area unsafe at night.",
          location: "Park Road, Near City Mall, New Delhi",
          coordinates: { lat: 28.6129, lng: 77.2295 },
          status: "in-progress",
          user: {
            name: "Priya M.",
            avatar: "/placeholder.svg?height=40&width=40",
            level: 7,
          },
          karma: 78,
          date: "2023-06-12",
          time: "19:45",
          upvotes: 8,
          images: ["/placeholder.svg?height=200&width=300"],
          rewards: ["nightWatcher", "communityGuard"],
          impactScore: 65
        },
        {
          id: 3,
          type: "garbage",
          category: "environmental",
          title: "Garbage pile not collected",
          description: "Garbage has been piling up for days and is causing a health hazard in the residential area.",
          location: "Residential Block C, New Delhi",
          coordinates: { lat: 28.5355, lng: 77.241 },
          status: "pending",
          user: {
            name: "Amit K.",
            avatar: "/placeholder.svg?height=40&width=40",
            level: 4,
          },
          karma: 32,
          date: "2023-06-10",
          time: "08:15",
          upvotes: 15,
          images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
          rewards: ["greenWarrior"],
          impactScore: 70
        },
        {
          id: 4,
          type: "water",
          category: "utility",
          title: "Water leakage from main pipe",
          description:
            "There's a significant water leakage from the main pipe that's wasting water and creating a mess.",
          location: "Gandhi Road, New Delhi",
          coordinates: { lat: 28.6304, lng: 77.2177 },
          status: "resolved",
          user: {
            name: "Sneha R.",
            avatar: "/placeholder.svg?height=40&width=40",
            level: 8,
          },
          karma: 60,
          date: "2023-06-05",
          time: "11:20",
          upvotes: 20,
          images: ["/placeholder.svg?height=200&width=300"],
          rewards: ["waterSaver", "quickResolver"],
          impactScore: 90
        },
        {
          id: 5,
          type: "encroachment",
          category: "civic",
          title: "Illegal shop on footpath",
          description: "Several illegal shops have been set up on the footpath, blocking pedestrian movement.",
          location: "Market Area, Sector 18, Noida",
          coordinates: { lat: 28.5691, lng: 77.3223 },
          status: "pending",
          user: {
            name: "Vikram J.",
            avatar: "/placeholder.svg?height=40&width=40",
            level: 3,
          },
          karma: 42,
          date: "2023-06-08",
          time: "16:45",
          upvotes: 18,
          images: ["/placeholder.svg?height=200&width=300"],
          rewards: ["civilRights"],
          impactScore: 75
        },
        {
          id: 6,
          type: "fire",
          category: "emergency",
          title: "Small fire in vacant lot",
          description: "There's a small fire in the vacant lot that could spread to nearby buildings if not addressed.",
          location: "Behind City Center, Gurgaon",
          coordinates: { lat: 28.4595, lng: 77.0266 },
          status: "resolved",
          user: {
            name: "Deepak T.",
            avatar: "/placeholder.svg?height=40&width=40",
            level: 9,
          },
          karma: 85,
          date: "2023-06-03",
          time: "20:10",
          upvotes: 25,
          images: ["/placeholder.svg?height=200&width=300"],
          rewards: ["firstResponder", "lifeGuardian"],
          impactScore: 95
        },
      ]

      setReports(mockReports)
      setIsLoading(false)
      
      // Find nearby issues
      if (userLocation) {
        const nearby = findNearbyIssues(mockReports, userLocation, 2); // within 2km
        setNearbyIssues(nearby);
      }
    }

    loadData()
  }, [userLocation])

  // Calculate distance between two coordinates (in km)
  const calculateDistance = (pos1, pos2) => {
    const R = 6371; // Earth radius in km
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLon = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Find issues near user's location
  const findNearbyIssues = (issues, location, radius) => {
    return issues.filter(issue => {
      const distance = calculateDistance(location, issue.coordinates);
      return distance <= radius;
    });
  }

  const categoryIcons = {
    infrastructure: <MapPin className="w-4 h-4" />,
    environmental: <Leaf className="w-4 h-4" />,
    safety: <Shield className="w-4 h-4" />,
    utility: <Zap className="w-4 h-4" />,
    civic: <Home className="w-4 h-4" />,
    emergency: <Fire className="w-4 h-4" />,
  }

  const issueCategories = [
    { id: "all", label: "All Issues", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "infrastructure", label: "Infrastructure", icon: <MapPin className="w-4 h-4" /> },
    { id: "environmental", label: "Environmental", icon: <Leaf className="w-4 h-4" /> },
    { id: "safety", label: "Public Safety", icon: <Shield className="w-4 h-4" /> },
    { id: "utility", label: "Utility", icon: <Zap className="w-4 h-4" /> },
    { id: "civic", label: "Civic", icon: <Home className="w-4 h-4" /> },
    { id: "emergency", label: "Emergency", icon: <Fire className="w-4 h-4" /> },
  ]

  const badgeIcons = {
    first_report: <Star className="w-3 h-3" />,
    local_hero: <Award className="w-3 h-3" />,
    problem_solver: <CheckCircle className="w-3 h-3" />
  }

  const rewardIcons = {
    localHero: <Trophy className="w-3 h-3 text-amber-500" />,
    fastReporter: <Zap className="w-3 h-3 text-blue-500" />,
    nightWatcher: <Shield className="w-3 h-3 text-purple-500" />,
    communityGuard: <Users className="w-3 h-3 text-green-500" />,
    greenWarrior: <Leaf className="w-3 h-3 text-green-500" />,
    waterSaver: <Zap className="w-3 h-3 text-blue-500" />,
    quickResolver: <CheckCircle className="w-3 h-3 text-green-500" />,
    civilRights: <Home className="w-3 h-3 text-indigo-500" />,
    firstResponder: <AlertTriangle className="w-3 h-3 text-red-500" />,
    lifeGuardian: <BadgeCheck className="w-3 h-3 text-amber-500" />
  }

  const filteredReports = reports
    .filter((report) => activeFilter === "all" || report.category === activeFilter)
    .filter(
      (report) =>
        searchQuery === "" ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const statusColors = {
    verified: "bg-green-500",
    "in-progress": "bg-amber-500",
    pending: "bg-blue-500",
    resolved: "bg-purple-500",
  }

  const statusIcons = {
    verified: <CheckCircle className="w-4 h-4 text-green-500" />,
    "in-progress": <Loader2 className="w-4 h-4 text-amber-500" />,
    pending: <AlertCircle className="w-4 h-4 text-blue-500" />,
    resolved: <CheckCircle className="w-4 h-4 text-purple-500" />,
  }

  const handleCreateReport = () => {
    if (!user) {
      router.push("/login?redirect=/public-issues/create")
    } else {
      router.push("/public-issues/create")
    }
  }

  const handleUpvote = (reportId) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId ? {...report, upvotes: report.upvotes + 1} : report
      )
    );
  }

  return (
    <>
      {/* Hero Section with Gamification UI */}
      <section className="py-12 text-white bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Public Issue Reporting</h1>
            <p className="mb-6 text-xl text-white/80">
              Report civic issues, earn rewards, and climb the leaderboard. Make your community better together!
            </p>
            
            {user && (
              <div className="p-4 mb-6 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                      <Trophy className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="font-bold">Level {userGameStats.level} Citizen</h3>
                      <div className="flex items-center gap-2">
                        {userGameStats.badges.map((badge, i) => (
                          <Badge key={i} variant="outline" className="border-0 bg-white/20">
                            <div className="flex items-center gap-1">
                              {badgeIcons[badge]}
                              <span className="capitalize">{badge.replace('_', ' ')}</span>
                            </div>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="font-bold">{userGameStats.xp} XP</span>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <Fire className="w-4 h-4 text-orange-400" />
                      <span>{userGameStats.streak} day streak</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Next level</span>
                    <span>{userGameStats.xp}/{userGameStats.nextLevel} XP</span>
                  </div>
                  <Progress value={(userGameStats.xp/userGameStats.nextLevel)*100} className="h-2 bg-white/20" indicatorClassName="bg-amber-400" />
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button onClick={handleCreateReport} className="text-blue-600 bg-white hover:bg-white/90">
                <AlertTriangle className="w-4 h-4 mr-2" /> Report an Issue
              </Button>
              
              {nearbyIssues.length > 0 && (
                <Button variant="outline" className="text-white border-white/40 hover:bg-white/10">
                  <MapPin className="w-4 h-4 mr-2" /> {nearbyIssues.length} Issues Nearby
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-4 mb-8 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                placeholder="Search reports..."
                className="pl-10 border-gray-300 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
              <Button onClick={handleCreateReport} className="text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> New Report
              </Button>
            </div>
          </div>

          <div className="mb-8 overflow-x-auto">
            <div className="flex pb-2 space-x-2 min-w-max">
              {issueCategories.map((category) => (
                <Badge
                  key={category.id}
                  variant={activeFilter === category.id ? "default" : "outline"}
                  className="flex items-center gap-1 px-3 py-1 cursor-pointer"
                  onClick={() => setActiveFilter(category.id)}
                >
                  {category.icon}
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          <Tabs defaultValue="map" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>Live Issue Map</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setMapZoom(Math.max(12, mapZoom - 1))}>-</Button>
                        <span className="text-sm">Zoom: {mapZoom}</span>
                        <Button variant="outline" size="sm" onClick={() => setMapZoom(Math.min(18, mapZoom + 1))}>+</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-[500px] rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {/* Replace placeholder with real map implementation */}
                      <Image src="/placeholder.svg?height=500&width=800" alt="Map View" fill className="object-cover" />
                      
                      {/* User location indicator */}
                      {userLocation && (
                        <div 
                          className="absolute z-30"
                          style={{
                            top: "50%",
                            left: "50%",
                          }}
                        >
                          <div className="relative -translate-x-1/2 -translate-y-1/2">
                            <div className="w-6 h-6 bg-blue-600 border-2 border-white rounded-full animate-pulse"></div>
                            <div className="absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-400 rounded-full top-1/2 left-1/2 opacity-70 animate-ping"></div>
                            <div className="absolute px-2 py-1 text-xs text-white transform -translate-x-1/2 bg-blue-700 rounded -bottom-6 left-1/2 whitespace-nowrap">
                              You are here
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Map pins */}
                      {!isLoading &&
                        reports.map((report) => (
                          <div
                            key={report.id}
                            className="absolute cursor-pointer"
                            style={{
                              top: `${Math.random() * 80 + 10}%`,
                              left: `${Math.random() * 80 + 10}%`,
                            }}
                          >
                            <div className="relative group">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  report.category === "infrastructure"
                                    ? "bg-blue-100 text-blue-600"
                                    : report.category === "environmental"
                                      ? "bg-green-100 text-green-600"
                                      : report.category === "safety"
                                        ? "bg-amber-100 text-amber-600"
                                        : report.category === "utility"
                                          ? "bg-purple-100 text-purple-600"
                                          : report.category === "civic"
                                            ? "bg-indigo-100 text-indigo-600"
                                            : "bg-red-100 text-red-600"
                                }`}
                              >
                                {categoryIcons[report.category]}
                              </div>
                              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                                {report.id}
                              </div>

                              {/* Tooltip with more gamified info */}
                              <div className="absolute z-10 invisible w-64 p-3 mb-2 transition-all duration-200 transform -translate-x-1/2 bg-white rounded-lg shadow-lg opacity-0 bottom-full left-1/2 group-hover:opacity-100 group-hover:visible dark:bg-gray-800 dark:border dark:border-gray-700">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</div>
                                <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">{report.location}</div>
                                
                                <div className="flex items-center mt-1 mb-2">
                                  <div className={`w-2 h-2 rounded-full ${statusColors[report.status]}`} />
                                  <span className="ml-1 text-xs text-gray-500 capitalize dark:text-gray-400">
                                    {report.status}
                                  </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {report.rewards.map((reward, idx) => (
                                    <Badge key={idx} variant="outline" className="flex items-center gap-1 text-[10px]">
                                      {rewardIcons[reward]}
                                      <span className="capitalize">{reward.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="w-3 h-3 text-blue-500" />
                                    <span className="text-xs">{report.upvotes}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-amber-500" />
                                    <span className="text-xs">Impact: {report.impactScore}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-500">
                    {userLocation ? (
                      <div className="flex items-center justify-between w-full">
                        <span>Showing issues around your current location</span>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {nearbyIssues.length} nearby issues
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Enable location to see issues around you</span>
                      </div>
                    )}
                  </CardFooter>
                </Card>

                <div className="space-y-6">
                  {nearbyIssues.length > 0 && (
                    <Card className="border-2 border-blue-200 dark:border-blue-900">
                      <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-900/20">
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          Nearby Issues
                          <Badge className="ml-auto">{nearbyIssues.length}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {nearbyIssues.map((report) => (
                            <Link href={`/public-issues/${report.id}`} key={report.id}>
                              <div className="flex items-start gap-3 p-3 transition-colors border border-blue-200 rounded-lg hover:bg-blue-50/80 dark:border-blue-900 dark:hover:bg-blue-900/20">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    report.category === "infrastructure"
                                      ? "bg-blue-100 text-blue-600"
                                      : report.category === "environmental"
                                        ? "bg-green-100 text-green-600"
                                        : report.category === "safety"
                                          ? "bg-amber-100 text-amber-600"
                                          : report.category === "utility"
                                            ? "bg-purple-100 text-purple-600"
                                            : report.category === "civic"
                                              ? "bg-indigo-100 text-indigo-600"
                                              : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {categoryIcons[report.category]}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-gray-900 dark:text-white">{report.title}</h4>
                                    {statusIcons[report.status]}
                                  </div>
                                  <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    <MapPin className="w-3 h-3 mr-1" /> {report.location.split(",")[0]}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Badge className="justify-center w-full text-blue-800 bg-blue-100 cursor-pointer hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100">
                          <Star className="w-3 h-3 mr-1" /> 
                          Report issues nearby for bonus XP!
                        </Badge>
                      </CardFooter>
                    </Card>
                  )}

                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Recent Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {isLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                          </div>
                        ) : (
                          filteredReports.slice(0, 3).map((report) => (
                            <Link href={`/public-issues/${report.id}`} key={report.id}>
                              <div className="flex items-start gap-3 p-3 transition-colors border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-900 dark:hover:bg-blue-900/10">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    report.category === "infrastructure"
                                      ? "bg-blue-100 text-blue-600"
                                      : report.category === "environmental"
                                        ? "bg-green-100 text-green-600"
                                        : report.category === "safety"
                                          ? "bg-amber-100 text-amber-600"
                                          : report.category === "utility"
                                            ? "bg-purple-100 text-purple-600"
                                            : report.category === "civic"
                                              ? "bg-indigo-100 text-indigo-600"
                                              : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {categoryIcons[report.category]}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-gray-900 dark:text-white">{report.title}</h4>
                                    {statusIcons[report.status]}
                                  </div>
                                  <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    <MapPin className="w-3 h-3 mr-1" /> {report.location.split(",")[0]}
                                  </div>
                                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Clock className="w-3 h-3 mr-1" /> {report.date} at {report.time}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                      <Button variant="outline" className="w-full mt-4" asChild>
                        <Link href="/public-issues/all">View All Reports</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Top Contributors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-800">
                              <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">User {i}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{30 - i * 5} reports</div>
                            </div>
                            <Badge variant="secondary">{150 - i * 20} Karma</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>All Reports</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                  ) : filteredReports.length === 0 ? (
                    <div className="py-12 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No reports found</h3>
                      <p className="mb-6 text-gray-500 dark:text-gray-400">
                        No reports match your current filters or search query.
                      </p>
                      <Button
                        onClick={() => {
                          setActiveFilter("all")
                          setSearchQuery("")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredReports.map((report) => (
                        <Link href={`/public-issues/${report.id}`} key={report.id}>
                          <div className="flex items-start gap-4 p-4 transition-colors border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-900 dark:hover:bg-blue-900/10">
                            <div className="w-16 h-16 overflow-hidden bg-gray-100 rounded-md dark:bg-gray-800">
                              <Image
                                src={report.images[0] || "/placeholder.svg"}
                                alt={report.title}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">{report.title}</h4>
                                <Badge variant="outline" className="capitalize">
                                  {report.type}
                                </Badge>
                                <Badge
                                  className={`capitalize ${
                                    report.category === "infrastructure"
                                      ? "bg-blue-500"
                                      : report.category === "environmental"
                                        ? "bg-green-500"
                                        : report.category === "safety"
                                          ? "bg-amber-500"
                                          : report.category === "utility"
                                            ? "bg-purple-500"
                                            : report.category === "civic"
                                              ? "bg-indigo-500"
                                              : "bg-red-500"
                                  }`}
                                >
                                  {report.category}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {report.description}
                              </p>
                              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin className="w-3 h-3 mr-1" /> {report.location}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <span>Reported by {report.user.name}</span>
                                  <span className="mx-2">•</span>
                                  <span>
                                    {report.date} at {report.time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {statusIcons[report.status]}
                                    <span className="ml-1 text-xs capitalize">{report.status}</span>
                                  </div>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 15 15"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M7.5 1.5L8.5 3.5L10.5 4L9 6L9.5 8H7.5L6.5 10L5 8.5L3 9L4 7L2.5 5L4.5 4.5L5.5 2.5L6.5 4.5L7.5 1.5Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                    {report.upvotes}
                                  </Badge>
                                  <Badge variant="secondary">{report.karma} Karma</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  )
}
