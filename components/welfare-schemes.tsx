"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, FileText, Calendar, Users, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function WelfareSchemes() {
  const [searchQuery, setSearchQuery] = useState("")

  const schemes = [
    {
      id: 1,
      title: "Digital Literacy Program",
      provider: "Ministry of Electronics & IT",
      category: "education",
      eligibility: "All citizens",
      deadline: "Ongoing",
      beneficiaries: 25000,
      description: "Free training program to enhance digital literacy skills among citizens.",
    },
    {
      id: 2,
      title: "Startup India Seed Fund",
      provider: "Ministry of Commerce & Industry",
      category: "business",
      eligibility: "Early-stage startups",
      deadline: "30 June 2023",
      beneficiaries: 3500,
      description: "Financial assistance for startups to help them grow and succeed.",
    },
    {
      id: 3,
      title: "Rural Housing Scheme",
      provider: "Ministry of Rural Development",
      category: "housing",
      eligibility: "Rural families below poverty line",
      deadline: "31 December 2023",
      beneficiaries: 12000,
      description: "Financial assistance for construction of houses for rural poor.",
    },
    {
      id: 4,
      title: "Women Entrepreneurship Platform",
      provider: "NITI Aayog",
      category: "business",
      eligibility: "Women entrepreneurs",
      deadline: "Ongoing",
      beneficiaries: 8500,
      description: "Platform to help women realize their entrepreneurial aspirations.",
    },
    {
      id: 5,
      title: "Skill Development Initiative",
      provider: "Ministry of Skill Development",
      category: "education",
      eligibility: "Youth aged 18-35",
      deadline: "Ongoing",
      beneficiaries: 45000,
      description: "Training programs to enhance employability of the youth.",
    },
    {
      id: 6,
      title: "Healthcare for All",
      provider: "Ministry of Health",
      category: "health",
      eligibility: "All citizens",
      deadline: "Ongoing",
      beneficiaries: 120000,
      description: "Comprehensive healthcare coverage for all citizens.",
    },
  ]

  const filteredSchemes = searchQuery
    ? schemes.filter(
        (scheme) =>
          scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scheme.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scheme.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : schemes

  return (
    <section id="welfare-schemes" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Welfare Scheme Discovery Hub</h2>
            <p className="text-muted-foreground mt-2 md:text-lg max-w-[600px]">
              Find government & NGO schemes tailored to your needs
            </p>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Find the Right Schemes for You</h3>
                <p className="text-muted-foreground mb-4">
                  Our smart search helps you discover welfare schemes you're eligible for
                </p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by keyword, category, or provider..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=500"
                  alt="Welfare Schemes"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-600/80 flex items-center justify-center p-6">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-bold mb-2">Personalized Recommendations</h3>
                    <p className="mb-4">Complete your profile to get schemes matched to your eligibility</p>
                    <Button variant="outline" className="border-white text-white hover:bg-white/20">
                      Complete Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-4">
            <TabsTrigger value="all">All Schemes</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="health">Healthcare</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes.map((scheme) => (
                <Card key={scheme.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <Badge className="w-fit mb-2">{scheme.category}</Badge>
                    <CardTitle>{scheme.title}</CardTitle>
                    <CardDescription>{scheme.provider}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{scheme.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Eligibility: {scheme.eligibility}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Deadline: {scheme.deadline}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{scheme.beneficiaries.toLocaleString()} beneficiaries</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button className="w-full">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes
                .filter((scheme) => scheme.category === "education")
                .map((scheme) => (
                  <Card key={scheme.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <Badge className="w-fit mb-2">{scheme.category}</Badge>
                      <CardTitle>{scheme.title}</CardTitle>
                      <CardDescription>{scheme.provider}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{scheme.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Eligibility: {scheme.eligibility}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Deadline: {scheme.deadline}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{scheme.beneficiaries.toLocaleString()} beneficiaries</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button className="w-full">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes
                .filter((scheme) => scheme.category === "business")
                .map((scheme) => (
                  <Card key={scheme.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <Badge className="w-fit mb-2">{scheme.category}</Badge>
                      <CardTitle>{scheme.title}</CardTitle>
                      <CardDescription>{scheme.provider}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{scheme.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Eligibility: {scheme.eligibility}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Deadline: {scheme.deadline}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{scheme.beneficiaries.toLocaleString()} beneficiaries</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button className="w-full">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="health" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes
                .filter((scheme) => scheme.category === "health")
                .map((scheme) => (
                  <Card key={scheme.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <Badge className="w-fit mb-2">{scheme.category}</Badge>
                      <CardTitle>{scheme.title}</CardTitle>
                      <CardDescription>{scheme.provider}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{scheme.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Eligibility: {scheme.eligibility}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Deadline: {scheme.deadline}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{scheme.beneficiaries.toLocaleString()} beneficiaries</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button className="w-full">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
