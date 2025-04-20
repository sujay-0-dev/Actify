"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
// Temporarily comment out the useAuth hook until it's properly implemented
// import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowRight, Mail, Shield, Trophy, Award, Star, Sparkles, User, Map, Briefcase } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function RegisterPage() {
  // Mock the register function temporarily until auth context is implemented
  // const { register } = useAuth()
  const register = async (userData) => {
    // Mock implementation - replace with actual implementation once auth context is ready
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("User registered:", userData);
        resolve();
      }, 1500);
    });
  };
 
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // optional
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    occupation: "",
    income: "",
    location: "",
    interests: "",
    avatar: "/placeholder.svg?height=70&width=70", // default avatar
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Update progress bar whenever form data changes
  useEffect(() => {
    updateProgressBar()
  }, [formData])

  const updateProgressBar = () => {
    // Count filled required fields
    const requiredFields = ["name", "email", "password", "confirmPassword", "age", "gender", "occupation", "location"]
    const filledFields = requiredFields.filter((field) => formData[field]?.trim())
    const percentage = Math.round((filledFields.length / requiredFields.length) * 100)
    setProgressValue(percentage)
  }

  const validatePersonalInfo = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const validateAdditionalInfo = () => {
    if (!formData.age || !formData.gender || !formData.occupation || !formData.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleNext = () => {
    if (activeTab === "personal") {
      if (validatePersonalInfo()) {
        setActiveTab("additional")

        // Show achievement toast when user completes personal info
        toast({
          title: "Step 1 Complete!",
          description: "You've unlocked +10 XP. Keep going!",
          action: (
            <div className="flex items-center justify-center p-1 bg-green-100 rounded-full dark:bg-green-900/30">
              <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          ),
        })
      }
    }
  }

  const handleAvatarSelection = (avatar) => {
    setFormData((prev) => ({ ...prev, avatar }))

    // Show a fun toast when avatar is selected
    toast({
      title: "Avatar Selected!",
      description: "Great choice! This will be your identity in Actify.",
      action: (
        <div className="flex items-center justify-center p-1 bg-blue-100 rounded-full dark:bg-blue-900/30">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      ),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateAdditionalInfo()) {
      return
    }

    setIsSubmitting(true)

    try {
      await register(formData)

      // Success! Show achievement toast
      toast({
        title: "Registration Achievement Unlocked!",
        description: "Welcome to Actify! You've earned your first badge.",
        action: (
          <div className="flex items-center justify-center p-1 bg-purple-100 rounded-full dark:bg-purple-900/30">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
        ),
      })

      router.push("/login")
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false)
    }
  }

  // Avatar options
  const avatarOptions = [
    "/placeholder.svg?height=70&width=70",
    "/placeholder.svg?height=70&width=70",
    "/placeholder.svg?height=70&width=70",
    "/placeholder.svg?height=70&width=70",
    "/placeholder.svg?height=70&width=70",
    "/placeholder.svg?height=70&width=70",
  ]

  return (
    <div className="container flex items-center justify-center min-h-screen py-10 bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
      <Card className="w-full max-w-lg border-0 shadow-lg">
        <CardHeader className="relative space-y-1 text-center">
          <div className="absolute flex items-center gap-2 px-3 py-1 text-xs font-medium text-white rounded-full top-2 right-2 bg-gradient-to-r from-purple-600 to-indigo-600">
            <Star className="w-4 h-4" />
            <span>New User</span>
          </div>
          <div className="flex justify-center mb-2">
            <Image
              src="/placeholder.svg?height=64&width=64"
              alt="Actify Logo"
              width={64}
              height={64}
              className="drop-shadow-lg"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
            Join Actify Community
          </CardTitle>
          <CardDescription className="text-lg">Start your journey to become a community hero</CardDescription>

          {/* Registration Progress Tracker */}
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Registration Progress</span>
              <span className="font-medium">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="additional" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                <span>Profile Setup</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="personal" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="transition-all focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="transition-all focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <span className="text-indigo-600">📱</span> Phone Number{" "}
                    <span className="text-xs text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Your phone number (optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    className="transition-all focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="transition-all focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="transition-all focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>

                <Button
                  type="button"
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 font-medium text-white transition-all duration-300 rounded-md shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
                  onClick={handleNext}
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </TabsContent>

              <TabsContent value="additional" className="space-y-4">
                <div className="mb-6 space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    Choose Your Avatar
                  </Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {avatarOptions.map((avatar, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer rounded-full p-1 border-2 hover:border-indigo-500 transition-all ${formData.avatar === avatar ? "border-indigo-600 bg-indigo-50 shadow-md scale-105" : "border-gray-200"}`}
                        onClick={() => handleAvatarSelection(avatar)}
                      >
                        <Image
                          src={avatar || "/placeholder.svg"}
                          width={70}
                          height={70}
                          alt={`Avatar option ${index + 1}`}
                          className="rounded-full"
                        />
                        {formData.avatar === avatar && (
                          <div className="absolute bottom-0 right-0 p-1 bg-indigo-500 rounded-full">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center gap-2">
                      <span className="text-indigo-600">🎂</span>
                      Age <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="25"
                      min="13"
                      max="120"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="transition-all focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="flex items-center gap-2">
                      <span className="text-indigo-600">👤</span>
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="flex w-full h-10 px-3 py-2 text-sm transition-all border rounded-md border-input bg-background ring-offset-background focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    Occupation <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="flex w-full h-10 px-3 py-2 text-sm transition-all border rounded-md border-input bg-background focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    required
                  >
                    <option value="">Select occupation</option>
                    <option value="student">Student</option>
                    <option value="employed">Employed</option>
                    <option value="self_employed">Self-employed</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="homemaker">Homemaker</option>
                    <option value="retired">Retired</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income" className="flex items-center gap-2">
                    <span className="text-indigo-600">💰</span>
                    Annual Income (₹) <span className="text-xs text-gray-500">(Optional)</span>
                  </Label>
                  <select
                    id="income"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    className="flex w-full h-10 px-3 py-2 text-sm transition-all border rounded-md border-input bg-background focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  >
                    <option value="">Select income range</option>
                    <option value="below_100k">Below ₹1,00,000</option>
                    <option value="100k_300k">₹1,00,000 - ₹3,00,000</option>
                    <option value="300k_500k">₹3,00,000 - ₹5,00,000</option>
                    <option value="500k_1000k">₹5,00,000 - ₹10,00,000</option>
                    <option value="above_1000k">Above ₹10,00,000</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-indigo-600" />
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="transition-all focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests" className="flex items-center gap-2">
                    <span className="text-indigo-600">✨</span>
                    Interests <span className="text-xs text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                    id="interests"
                    name="interests"
                    placeholder="Environment, Education, Technology, etc."
                    value={formData.interests}
                    onChange={handleChange}
                    className="transition-all focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                  <p className="text-xs text-gray-500">Separate multiple interests with commas</p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 text-indigo-700 border-indigo-500"
                    onClick={() => setActiveTab("personal")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 px-4 py-2 font-medium text-white transition-all duration-300 rounded-md shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        Complete Registration
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center">
            <span className="inline-block px-3 py-1 mb-2 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
              <Sparkles className="inline w-3 h-3 mr-1" />
              Join 10,000+ Actify Heroes!
            </span>
            <div className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 transition-all hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
