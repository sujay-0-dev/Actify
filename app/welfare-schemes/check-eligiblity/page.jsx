"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Lightbulb, Loader2, Info, CheckCircle, AlertCircle, User } from 'lucide-react'

export default function CheckEligibilityPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isForSelf, setIsForSelf] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState(null)
  
  // Form fields
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [occupation, setOccupation] = useState("")
  const [annualIncome, setAnnualIncome] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [education, setEducation] = useState("")
  const [maritalStatus, setMaritalStatus] = useState("")
  const [hasLand, setHasLand] = useState(false)
  const [hasDisability, setHasDisability] = useState(false)
  const [isBPL, setIsBPL] = useState(false)
  const [isMinority, setIsMinority] = useState(false)
  const [isVeteran, setIsVeteran] = useState(false)
  const [hasBankAccount, setHasBankAccount] = useState(true)
  const [hasAadhaar, setHasAadhaar] = useState(true)

  useEffect(() => {
    if (!loading && user) {
      // Pre-fill form with user data if available
      if (user.age) setAge(user.age.toString())
      if (user.gender) setGender(user.gender)
      if (user.profession) setOccupation(user.profession)
      if (user.location) setLocation(user.location)
    }
  }, [user, loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!age || !gender || !occupation || !annualIncome || !location || !category || !education || !maritalStatus) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data for eligibility check
      const eligibilityData = {
        age: parseInt(age),
        gender,
        occupation,
        annualIncome: parseInt(annualIncome),
        location,
        category,
        education,
        maritalStatus,
        hasLand,
        hasDisability,
        isBPL,
        isMinority,
        isVeteran,
        hasBankAccount,
        hasAadhaar,
        isForSelf,
      }

      // Call API to check eligibility
      const response = await fetch("/api/welfare-schemes/check-eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eligibilityData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to check eligibility")
      }

      // Set results
      setResults(result)

      toast({
        title: "Eligibility check complete",
        description: `Found ${result.eligibleSchemes.length} eligible schemes`,
      })
    } catch (error) {
      console.error("Error checking eligibility:", error)
      toast({
        title: "Error checking eligibility",
        description: error.message || "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewScheme = (schemeId) => {
    router.push(`/welfare-schemes/${schemeId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
            Check Welfare Scheme Eligibility
          </CardTitle>
        </CardHeader>
        
        {results ? (
          <CardContent className="space-y-6">
            <div className="p-4 rounded-md bg-amber-50 dark:bg-amber-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="w-5 h-5 text-amber-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Eligibility Results</h3>
                  <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                    <p>Based on the provided information, we've identified the following schemes:</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Eligible Schemes ({results.eligibleSchemes.length})</h3>
              
              {results.eligibleSchemes.length > 0 ? (
                <div className="space-y-3">
                  {results.eligibleSchemes.map((scheme) => (
                    <div key={scheme.id} className="p-4 transition-colors border rounded-lg hover:border-amber-300">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            <h4 className="font-medium">{scheme.title}</h4>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{scheme.description}</p>
                          <div className="flex items-center mt-2">
                            <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-300">
                              {scheme.category}
                            </span>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              Provider: {scheme.provider}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleViewScheme(scheme.id)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center border rounded-lg">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                  <p className="text-gray-600 dark:text-gray-400">No eligible schemes found based on the criteria</p>
                </div>
              )}

              {results.potentialSchemes.length > 0 && (
                <>
                  <h3 className="mt-6 text-lg font-medium">Potentially Eligible Schemes ({results.potentialSchemes.length})</h3>
                  <div className="space-y-3">
                    {results.potentialSchemes.map((scheme) => (
                      <div key={scheme.id} className="p-4 transition-colors border rounded-lg hover:border-amber-300">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                              <h4 className="font-medium">{scheme.title}</h4>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{scheme.description}</p>
                            <div className="flex items-center mt-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                {scheme.category}
                              </span>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                Additional verification needed
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleViewScheme(scheme.id)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setResults(null)}>
                Check Again
              </Button>
              <Button onClick={() => router.push("/welfare-schemes")}>
                Browse All Schemes
              </Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Who are you checking eligibility for?</Label>
                <RadioGroup value={isForSelf ? "self" : "other"} onValueChange={(v) => setIsForSelf(v === "self")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self" id="self" />
                    <Label htmlFor="self" className="font-normal">Myself</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="font-normal">Someone else</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="border-gray-300 focus:border-amber-500 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Select value={gender} onValueChange={setGender} required>
                    <SelectTrigger className="border-gray-300 focus:border-amber-500 dark:border-gray-700">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">
                    Occupation <span className="text-red-500">*</span>
                  </Label>
                  <Select value={occupation} onValueChange={setOccupation} required>
                    <SelectTrigger className="border-gray-300 focus:border-amber-500 dark:border-gray-700">
                      <SelectValue placeholder="Select occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="laborer">Laborer</SelectItem>
                      <SelectItem value="government">Government Employee</SelectItem>
                      <SelectItem value="private">Private Sector Employee</SelectItem>
                      <SelectItem value="business">Business Owner</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="homemaker">Homemaker</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualIncome">
                    Annual Income (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    min="0"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    required
                    className="border-gray-300 focus:border-amber-500 dark:border-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Select value={location} onValueChange={setLocation} required>
                    <SelectTrigger className="border-gray-300 focus:border-amber-500 dark:border-gray-700">
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
                  <Label htmlFor="category">
                    Social Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="border-gray-300 focus:border-amber-500 dark:border-gray-700">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="sc">Scheduled Caste (SC)</SelectItem>
                      <SelectItem value="st">Scheduled Tribe (ST)</SelectItem>
                      <SelectItem value="obc">Other Backward Class (OBC)</SelectItem>
                      <SelectItem value="ews">Economically Weaker Section (EWS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="education">
                    Education Level <span className="text-red-500">*</span>
                  </Label>
                  <Select value={education} onValueChange={setEducation} required>
                    <SelectTrigger className="border-gray-300 focus:border-amber-500 dark:border-gray-700">
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Formal Education</SelectItem>
                      <SelectItem value="primary">Primary School</SelectItem>
                      <SelectItem value="secondary">Secondary School</SelectItem>
                      <SelectItem value="higher_secondary">Higher Secondary</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="post_graduate">Post Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">
                    Marital Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={maritalStatus} onValueChange={setMaritalStatus} required>
                    <SelectTrigger className="border-gray-300 focus:border-amber-500 dark:border-gray-700">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Additional Information</Label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasLand"
                      checked={hasLand}
                      onCheckedChange={setHasLand}
                    />
                    <Label htmlFor="hasLand" className="text-sm font-normal">
                      Owns Agricultural Land
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasDisability"
                      checked={hasDisability}
                      onCheckedChange={setHasDisability}
                    />
                    <Label htmlFor="hasDisability" className="text-sm font-normal">
                      Person with Disability
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isBPL"
                      checked={isBPL}
                      onCheckedChange={setIsBPL}
                    />
                    <Label htmlFor="isBPL" className="text-sm font-normal">
                      Below Poverty Line (BPL)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isMinority"
                      checked={isMinority}
                      onCheckedChange={setIsMinority}
                    />
                    <Label htmlFor="isMinority" className="text-sm font-normal">
                      Belongs to Minority Group
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isVeteran"
                      checked={isVeteran}
                      onCheckedChange={setIsVeteran}
                    />
                    <Label htmlFor="isVeteran" className="text-sm font-normal">
                      Ex-Serviceman/Veteran
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Document Availability</Label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasBankAccount"
                      checked={hasBankAccount}
                      onCheckedChange={setHasBankAccount}
                    />
                    <Label htmlFor="hasBankAccount" className="text-sm font-normal">
                      Has Active Bank Account
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasAadhaar"
                      checked={hasAadhaar}
                      onCheckedChange={setHasAadhaar}
                    />
                    <Label htmlFor="hasAadhaar" className="text-sm font-normal">
                      Has Aadhaar Card
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => router.push("/welfare-schemes")}>
                Browse All Schemes
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Eligibility"
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}