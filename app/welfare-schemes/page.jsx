"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  Lightbulb,
  Users,
  Home,
  GraduationCap,
  Heart,
  Tractor,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  HelpCircle,
} from "lucide-react"

export default function WelfareSchemesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [eligibilityDialogOpen, setEligibilityDialogOpen] = useState(false)
  const [selectedScheme, setSelectedScheme] = useState(null)

  // Mock data for welfare schemes
  const schemes = [
    {
      id: 1,
      title: "PM Kisan Samman Nidhi",
      category: "Agriculture",
      icon: Tractor,
      description: "Financial support of ₹6,000 per year for farmer families",
      eligibility: "Small and marginal farmers with cultivable landholding",
      benefits: "₹6,000 per year in three equal installments",
      documents: ["Aadhaar Card", "Land Records", "Bank Account Details"],
      applicationProcess: "Apply online through PM Kisan portal or visit nearest Common Service Center",
      deadline: "Ongoing",
      status: "active",
      applicants: 1245,
      successRate: 85,
    },
    {
      id: 2,
      title: "Pradhan Mantri Awas Yojana",
      category: "Housing",
      icon: Home,
      description: "Financial assistance for construction of pucca houses for eligible rural households",
      eligibility: "Households with kutcha/dilapidated house or no house",
      benefits: "Financial assistance of ₹1.20 lakh in plain areas and ₹1.30 lakh in hilly areas",
      documents: ["Aadhaar Card", "Income Certificate", "Land Documents", "Bank Account Details"],
      applicationProcess: "Apply through Gram Panchayat or Block Development Office",
      deadline: "December 31, 2023",
      status: "active",
      applicants: 2350,
      successRate: 72,
    },
    {
      id: 3,
      title: "PM Scholarship Scheme",
      category: "Education",
      icon: GraduationCap,
      description: "Scholarships for the wards of ex-servicemen/ex-coast guards",
      eligibility: "Children of ex-servicemen/ex-coast guards pursuing professional courses",
      benefits: "₹2,500 per month for boys and ₹3,000 per month for girls",
      documents: ["Aadhaar Card", "Ex-Serviceman Certificate", "Academic Records", "Bank Account Details"],
      applicationProcess: "Apply online through the official website",
      deadline: "October 15, 2023",
      status: "active",
      applicants: 876,
      successRate: 90,
    },
    {
      id: 4,
      title: "Ayushman Bharat Yojana",
      category: "Health",
      icon: Heart,
      description: "Health insurance coverage of ₹5 lakh per family per year",
      eligibility: "Economically weaker sections and low-income families",
      benefits: "Cashless and paperless access to healthcare services",
      documents: ["Aadhaar Card", "Ration Card", "Income Certificate"],
      applicationProcess: "Apply through Common Service Centers or Ayushman Mitra at hospitals",
      deadline: "Ongoing",
      status: "active",
      applicants: 3450,
      successRate: 95,
    },
    {
      id: 5,
      title: "National Social Assistance Programme",
      category: "Social Welfare",
      icon: Users,
      description: "Financial assistance to elderly, widows, and persons with disabilities",
      eligibility: "Elderly persons (60+ years), widows, and persons with disabilities living below poverty line",
      benefits: "Monthly pension ranging from ₹200 to ₹500",
      documents: ["Aadhaar Card", "Age Certificate", "BPL Card", "Bank Account Details"],
      applicationProcess: "Apply through local Gram Panchayat or Municipal Office",
      deadline: "Ongoing",
      status: "active",
      applicants: 1890,
      successRate: 88,
    },
  ]

  // Filter schemes based on search query and category
  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      searchQuery === "" ||
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "applied" && scheme.status === "applied") ||
      (activeTab === "eligible" && scheme.status === "active")

    return matchesSearch && matchesCategory && matchesTab
  })

  const openEligibilityChecker = (scheme) => {
    setSelectedScheme(scheme)
    setEligibilityDialogOpen(true)
  }

  const categories = ["Agriculture", "Housing", "Education", "Health", "Social Welfare"]

  // Mock user profile data for eligibility checking
  const userProfile = {
    occupation: "Farmer",
    income: "120000",
    familySize: 4,
    location: "Rural",
    hasLand: true,
    age: 45,
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Welfare Schemes & Benefits
              </h1>
              <p className="mt-4 text-white/80 md:text-xl max-w-[600px]">
                Discover government schemes tailored to your needs. Check eligibility, apply easily, and help others
                access benefits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-amber-600 hover:bg-white/90"
                  onClick={() => setEligibilityDialogOpen(true)}
                >
                  <Lightbulb className="mr-2 h-4 w-4" /> Check Your Eligibility
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                  <Link href="#schemes">Browse All Schemes</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="relative w-[350px] h-[350px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-white/20">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Scheme Navigator</div>
                      <div className="text-sm text-white/70">Find the right schemes for you</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm font-medium">Your Eligibility Status</div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-full bg-green-500/20">
                            <CheckCircle2 className="h-3 w-3 text-green-300" />
                          </div>
                          <span className="text-xs">PM Kisan</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-full bg-green-500/20">
                            <CheckCircle2 className="h-3 w-3 text-green-300" />
                          </div>
                          <span className="text-xs">Awas Yojana</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-full bg-amber-500/20">
                            <AlertCircle className="h-3 w-3 text-amber-300" />
                          </div>
                          <span className="text-xs">Ayushman</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-full bg-red-500/20">
                            <AlertCircle className="h-3 w-3 text-red-300" />
                          </div>
                          <span className="text-xs">Scholarship</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm font-medium">Karma Rewards</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-white/70">Help others apply</span>
                        <Badge className="bg-white/20 text-white hover:bg-white/30">+20 Karma</Badge>
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
      <section id="schemes" className="py-12">
        <div className="container px-4 md:px-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search schemes..."
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
                  <TabsTrigger value="all">All Schemes</TabsTrigger>
                  <TabsTrigger value="eligible">Eligible For You</TabsTrigger>
                  <TabsTrigger value="applied">Applied</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6 mt-6">
                  {filteredSchemes.length > 0 ? (
                    filteredSchemes.map((scheme) => (
                      <Card key={scheme.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                <scheme.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <Link href={`/welfare-schemes/${scheme.id}`}>
                                  <CardTitle className="text-lg hover:text-amber-600 transition-colors">
                                    {scheme.title}
                                  </CardTitle>
                                </Link>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Badge variant="outline">{scheme.category}</Badge>
                                  <span className="mx-2">•</span>
                                  <span>Deadline: {scheme.deadline}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                              Active
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{scheme.description}</p>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-amber-500" />
                              <span className="text-muted-foreground">{scheme.applicants} applicants</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-muted-foreground">{scheme.successRate}% success rate</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <Button variant="outline" size="sm" onClick={() => openEligibilityChecker(scheme)}>
                            Check Eligibility
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/welfare-schemes/${scheme.id}`}>Apply Now</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Lightbulb className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">No schemes found</h3>
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

                <TabsContent value="eligible" className="space-y-6 mt-6">
                  <div className="bg-amber-50 p-4 rounded-md dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Eligibility Check</h3>
                        <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                          <p>
                            Based on your profile information, we've identified schemes you might be eligible for. For a
                            more accurate assessment, please complete your profile or use our eligibility checker.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {filteredSchemes.slice(0, 3).map((scheme) => (
                    <Card key={scheme.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                              <scheme.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <Link href={`/welfare-schemes/${scheme.id}`}>
                                <CardTitle className="text-lg hover:text-amber-600 transition-colors">
                                  {scheme.title}
                                </CardTitle>
                              </Link>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Badge variant="outline">{scheme.category}</Badge>
                                <span className="mx-2">•</span>
                                <span>Deadline: {scheme.deadline}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            Likely Eligible
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{scheme.description}</p>
                        <div className="mt-3">
                          <div className="text-sm font-medium mb-1">Eligibility Match</div>
                          <div className="flex items-center gap-2">
                            <Progress value={scheme.id === 1 ? 95 : scheme.id === 2 ? 85 : 75} className="h-2" />
                            <span className="text-xs text-muted-foreground">
                              {scheme.id === 1 ? 95 : scheme.id === 2 ? 85 : 75}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => openEligibilityChecker(scheme)}>
                          Verify Eligibility
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/welfare-schemes/${scheme.id}`}>Apply Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="applied" className="space-y-6 mt-6">
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
                    <p className="text-muted-foreground">You haven't applied for any schemes yet</p>
                    <Button className="mt-4" onClick={() => setActiveTab("all")}>
                      Browse Schemes
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Eligibility Checker Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Eligibility Check</CardTitle>
                  <CardDescription>Find schemes you qualify for</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Select defaultValue="farmer">
                        <SelectTrigger id="occupation">
                          <SelectValue placeholder="Select occupation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farmer">Farmer</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="self-employed">Self-employed</SelectItem>
                          <SelectItem value="private-job">Private Job</SelectItem>
                          <SelectItem value="government-job">Government Job</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="income">Annual Income (₹)</Label>
                      <Input id="income" type="number" placeholder="e.g., 120000" defaultValue="120000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select defaultValue="rural">
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rural">Rural</SelectItem>
                          <SelectItem value="urban">Urban</SelectItem>
                          <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hasLand" defaultChecked />
                      <Label htmlFor="hasLand">I own agricultural land</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full">Check Eligibility</Button>
                </CardFooter>
              </Card>

              {/* Help Others Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Help Others Apply</CardTitle>
                  <CardDescription>Earn Karma by helping community members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                      <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">Ramesh needs help with PM Kisan</div>
                        <div className="text-xs text-muted-foreground">2 km away • Posted 2 days ago</div>
                      </div>
                      <Badge className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                        +20 Karma
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                      <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          Elderly couple needs Ayushman help
                        </div>
                        <div className="text-xs text-muted-foreground">5 km away • Posted 1 day ago</div>
                      </div>
                      <Badge className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                        +25 Karma
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    View All Requests
                  </Button>
                </CardFooter>
              </Card>

              {/* Badges Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Welfare Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <div className="mt-2 text-sm font-medium">Scheme Navigator</div>
                      <div className="text-xs text-muted-foreground">Applied to 3+ schemes</div>
                    </div>
                    <div className="flex flex-col items-center text-center opacity-50">
                      <div className="p-3 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                      <div className="mt-2 text-sm font-medium">Awareness Spreader</div>
                      <div className="text-xs text-muted-foreground">Help 5+ people apply</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Checker Dialog */}
      <Dialog open={eligibilityDialogOpen} onOpenChange={setEligibilityDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Eligibility Checker</DialogTitle>
            <DialogDescription>
              {selectedScheme
                ? `Check your eligibility for ${selectedScheme.title}`
                : "Find schemes you're eligible for based on your profile"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedScheme && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <selectedScheme.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{selectedScheme.title}</div>
                  <div className="text-sm text-muted-foreground">{selectedScheme.description}</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="dialog-occupation">Occupation</Label>
              <Select defaultValue={userProfile.occupation.toLowerCase()}>
                <SelectTrigger id="dialog-occupation">
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">Farmer</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="private-job">Private Job</SelectItem>
                  <SelectItem value="government-job">Government Job</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-income">Annual Income (₹)</Label>
              <Input id="dialog-income" type="number" defaultValue={userProfile.income} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-location">Location</Label>
              <Select defaultValue={userProfile.location.toLowerCase()}>
                <SelectTrigger id="dialog-location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rural">Rural</SelectItem>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-age">Age</Label>
              <Input id="dialog-age" type="number" defaultValue={userProfile.age} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="dialog-hasLand" defaultChecked={userProfile.hasLand} />
              <Label htmlFor="dialog-hasLand">I own agricultural land</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEligibilityDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Check Eligibility</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-900 dark:to-amber-950">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Apply Easily, Get Benefits</h2>
          <p className="mt-4 text-gray-600 md:text-lg max-w-[800px] mx-auto dark:text-gray-400">
            Don't miss out on government schemes you're eligible for. Check your eligibility, apply online, and track
            your applications all in one place.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white"
              onClick={() => setEligibilityDialogOpen(true)}
            >
              Check Your Benefits <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20"
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
