"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, MapPin, Camera, Users, Filter } from "lucide-react"
import Image from "next/image"

export default function HazardReporting() {
  const [activeFilter, setActiveFilter] = useState("all")

  const hazardTypes = [
    { id: "all", label: "All Hazards" },
    { id: "potholes", label: "Potholes" },
    { id: "lights", label: "Broken Lights" },
    { id: "garbage", label: "Garbage" },
    { id: "water", label: "Water Issues" },
  ]

  const recentReports = [
    {
      id: 1,
      type: "potholes",
      title: "Large pothole on Main Street",
      location: "Main St & 5th Ave",
      status: "verified",
      user: "Rahul S.",
      karma: 45,
      time: "2 hours ago",
      upvotes: 12,
    },
    {
      id: 2,
      type: "lights",
      title: "Street light not working",
      location: "Park Road, Near City Mall",
      status: "in-progress",
      user: "Priya M.",
      karma: 78,
      time: "5 hours ago",
      upvotes: 8,
    },
    {
      id: 3,
      type: "garbage",
      title: "Garbage pile not collected",
      location: "Residential Block C",
      status: "pending",
      user: "Amit K.",
      karma: 32,
      time: "1 day ago",
      upvotes: 15,
    },
  ]

  const filteredReports =
    activeFilter === "all" ? recentReports : recentReports.filter((report) => report.type === activeFilter)

  const statusColors = {
    verified: "bg-green-500",
    "in-progress": "bg-amber-500",
    pending: "bg-blue-500",
  }

  return (
    <section id="hazard-reporting" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Hazard Reporting Dashboard</h2>
            <p className="text-muted-foreground mt-2 md:text-lg max-w-[600px]">
              Real-time tracking of community-reported issues in your area
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-blue-600">
            <AlertTriangle className="mr-2 h-4 w-4" /> Report a Hazard
          </Button>
        </div>

        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Interactive Map</CardTitle>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-[400px] rounded-md overflow-hidden bg-muted">
                    <Image src="/placeholder.svg?height=400&width=800" alt="Map View" fill className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">Interactive map showing reported hazards</p>
                    </div>

                    {/* Map pins */}
                    <div className="absolute top-1/4 left-1/3">
                      <div className="relative">
                        <MapPin className="h-8 w-8 text-red-500" />
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                          3
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-1/2 right-1/4">
                      <div className="relative">
                        <MapPin className="h-8 w-8 text-amber-500" />
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                          2
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-1/3 left-1/2">
                      <div className="relative">
                        <MapPin className="h-8 w-8 text-blue-500" />
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                          5
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Filter by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {hazardTypes.map((type) => (
                        <Badge
                          key={type.id}
                          variant={activeFilter === type.id ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setActiveFilter(type.id)}
                        >
                          {type.label}
                        </Badge>
                      ))}
                    </div>
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
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">User {i}</div>
                            <div className="text-sm text-muted-foreground">{30 - i * 5} reports</div>
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
                  <CardTitle>Recent Reports</CardTitle>
                  <div className="flex gap-2">
                    {hazardTypes.map((type) => (
                      <Badge
                        key={type.id}
                        variant={activeFilter === type.id ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setActiveFilter(type.id)}
                      >
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Camera className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{report.title}</h4>
                          <div
                            className={`w-2 h-2 rounded-full ${statusColors[report.status as keyof typeof statusColors]}`}
                          />
                          <span className="text-xs text-muted-foreground capitalize">{report.status}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" /> {report.location}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>Reported by {report.user}</span>
                            <span className="mx-2">•</span>
                            <span>{report.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
