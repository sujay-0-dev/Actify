"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
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
} from "lucide-react"

export default function PublicIssuesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for public issue reports
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
          },
          karma: 45,
          date: "2023-06-15",
          time: "14:30",
          upvotes: 12,
          images: ["/placeholder.svg?height=200&width=300"],
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
          },
          karma: 78,
          date: "2023-06-12",
          time: "19:45",
          upvotes: 8,
          images: ["/placeholder.svg?height=200&width=300"],
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
          },
          karma: 32,
          date: "2023-06-10",
          time: "08:15",
          upvotes: 15,
          images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
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
          },
          karma: 60,
          date: "2023-06-05",
          time: "11:20",
          upvotes: 20,
          images: ["/placeholder.svg?height=200&width=300"],
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
          },
          karma: 42,
          date: "2023-06-08",
          time: "16:45",
          upvotes: 18,
          images: ["/placeholder.svg?height=200&width=300"],
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
          },
          karma: 85,
          date: "2023-06-03",
          time: "20:10",
          upvotes: 25,
          images: ["/placeholder.svg?height=200&width=300"],
        },
      ]

      setReports(mockReports)
      setIsLoading(false)
    }

    loadData()
  }, [])

  const categoryIcons = {
    infrastructure: <MapPin className="h-4 w-4" />,
    environmental: <Leaf className="h-4 w-4" />,
    safety: <Shield className="h-4 w-4" />,
    utility: <Zap className="h-4 w-4" />,
    civic: <Home className="h-4 w-4" />,
    emergency: <Fire className="h-4 w-4" />,
  }

  const issueCategories = [
    { id: "all", label: "All Issues", icon: <AlertTriangle className="h-4 w-4" /> },
    { id: "infrastructure", label: "Infrastructure", icon: <MapPin className="h-4 w-4" /> },
    { id: "environmental", label: "Environmental", icon: <Leaf className="h-4 w-4" /> },
    { id: "safety", label: "Public Safety", icon: <Shield className="h-4 w-4" /> },
    { id: "utility", label: "Utility", icon: <Zap className="h-4 w-4" /> },
    { id: "civic", label: "Civic", icon: <Home className="h-4 w-4" /> },
    { id: "emergency", label: "Emergency", icon: <Fire className="h-4 w-4" /> },
  ]

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
    verified: <CheckCircle className="h-4 w-4 text-green-500" />,
    "in-progress": <Loader2 className="h-4 w-4 text-amber-500" />,
    pending: <AlertCircle className="h-4 w-4 text-blue-500" />,
    resolved: <CheckCircle className="h-4 w-4 text-purple-500" />,
  }

  const handleCreateReport = () => {
    if (!user) {
      router.push("/login?redirect=/public-issues/create")
    } else {
      router.push("/public-issues/create")
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Public Issue Reporting</h1>
            <p className="text-xl text-white/80 mb-6">
              Report civic issues with photos & location. Verified reports earn Karma points.
            </p>
            <Button onClick={handleCreateReport} className="bg-white text-blue-600 hover:bg-white/90">
              <AlertTriangle className="mr-2 h-4 w-4" /> Report an Issue
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search reports..."
                className="pl-10 border-gray-300 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button onClick={handleCreateReport} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> New Report
              </Button>
            </div>
          </div>

          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 min-w-max pb-2">
              {issueCategories.map((category) => (
                <Badge
                  key={category.id}
                  variant={activeFilter === category.id ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1 flex items-center gap-1"
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
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>Interactive Map</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-[500px] rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image src="/placeholder.svg?height=500&width=800" alt="Map View" fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">Interactive map showing reported issues</p>
                      </div>

                      {/* Map pins */}
                      {!isLoading &&
                        reports.map((report) => (
                          <div
                            key={report.id}
                            className="absolute"
                            style={{
                              top: `${Math.random() * 80 + 10}%`,
                              left: `${Math.random() * 80 + 10}%`,
                            }}
                          >
                            <div className="relative cursor-pointer group">
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

                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 dark:bg-gray-800 dark:border dark:border-gray-700">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{report.location}</div>
                                <div className="flex items-center mt-1">
                                  <div className={`w-2 h-2 rounded-full ${statusColors[report.status]}`} />
                                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 capitalize">
                                    {report.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Recent Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {isLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                          </div>
                        ) : (
                          filteredReports.slice(0, 3).map((report) => (
                            <Link href={`/public-issues/${report.id}`} key={report.id}>
                              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors dark:border-gray-800 dark:hover:border-blue-900 dark:hover:bg-blue-900/10">
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
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <MapPin className="h-3 w-3 mr-1" /> {report.location.split(",")[0]}
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <Clock className="h-3 w-3 mr-1" /> {report.date} at {report.time}
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
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center dark:bg-gray-800">
                              <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
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
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : filteredReports.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reports found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
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
                          <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors dark:border-gray-800 dark:hover:border-blue-900 dark:hover:bg-blue-900/10">
                            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                              <Image
                                src={report.images[0] || "/placeholder.svg"}
                                alt={report.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
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
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {report.description}
                              </p>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                                <MapPin className="h-3 w-3 mr-1" /> {report.location}
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
