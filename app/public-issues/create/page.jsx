"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertTriangle,
  MapPin,
  Camera,
  Upload,
  X,
  Loader2,
  CheckCircle,
  Info,
  RouteIcon as Road,
  Leaf,
  Shield,
  Zap,
  Home,
  FlameIcon as Fire,
  ThumbsUp,
  Clock,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock API service for similar report checking
const checkSimilarReports = async (location, category, type, imageData) => {
  // In a real implementation, this would be an API call
  // For demo, we'll simulate a 40% chance of finding a similar report
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

  const hasSimilar = Math.random() < 0.4

  if (hasSimilar) {
    return {
      found: true,
      report: {
        id: Math.floor(Math.random() * 100) + 1,
        title: `Similar ${type} issue near ${location.split(",")[0]}`,
        description: "A similar issue was reported in this area recently.",
        status: "verified",
        upvotes: Math.floor(Math.random() * 10) + 1,
        distance: (Math.random() * 0.5).toFixed(2) + " km away",
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
    }
  }

  return { found: false }
}

export default function CreatePublicIssueReportPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const mapRef = useRef(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [type, setType] = useState("")
  const [images, setImages] = useState([])
  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false)
  const [similarReport, setSimilarReport] = useState(null)
  const [showSimilarDialog, setShowSimilarDialog] = useState(false)
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/public-issues/create")
    }
  }, [user, loading, router])

  // Initialize map when coordinates are available
  useEffect(() => {
    if (coordinates && mapRef.current && !map) {
      // This is a mock implementation - in production, you'd use a real map library
      // like Google Maps, Mapbox, or Leaflet
      const mockMap = {
        setCenter: (coords) => {
          console.log("Map center set to:", coords)
          return mockMap
        },
        setZoom: (level) => {
          console.log("Map zoom set to:", level)
          return mockMap
        },
      }

      const mockMarker = {
        setPosition: (coords) => {
          console.log("Marker position set to:", coords)
          return mockMarker
        },
      }

      setMap(mockMap)
      setMarker(mockMarker)

      // In a real implementation, you'd initialize the map here
      // and set the marker at the coordinates
    }
  }, [coordinates, mapRef, map])

  // Update map when coordinates change
  useEffect(() => {
    if (map && marker && coordinates) {
      map.setCenter(coordinates)
      marker.setPosition(coordinates)
    }
  }, [coordinates, map, marker])

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      return
    }

    setIsLoadingLocation(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCoordinates({ lat: latitude, lng: longitude })

        try {
          // In a real app, this would be a call to a geocoding service
          // For now, we'll simulate the API call
          const apiKey = "YOUR_OPENCAGE_API_KEY";
          const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
          if (!response.ok) throw new Error("Geocoding failed");
          
          const data = await response.json();
          // For demo, we'll generate a random address based on the coordinates
          const address = `${Math.round(latitude * 100) / 100}° N, ${Math.round(longitude * 100) / 100}° E, Local Area`
          setLocation(address)
        } catch (error) {
          console.error("Error getting address:", error)
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`)
        setIsLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    )
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    if (images.length + files.length > 3) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 3 images",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would upload these to a server
    // For this demo, we'll just create object URLs
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(2),
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }))

    setImages([...images, ...newImages])
  }

  const handleRemoveImage = (id) => {
    const newImages = images.filter((image) => image.id !== id)
    setImages(newImages)
  }

  const checkForSimilarIssues = async () => {
    if (!coordinates || !category || !type || images.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and add at least one image",
        variant: "warning",
      })
      return false
    }

    setIsCheckingDuplicates(true)

    try {
      // Extract image data for similarity checking
      // In a real app, you'd send the actual image data or features
      const imageData = images.map((img) => ({
        id: img.id,
        name: img.name,
      }))

      const result = await checkSimilarReports(location, category, type, imageData)

      if (result.found) {
        setSimilarReport(result.report)
        setShowSimilarDialog(true)
        return true
      }

      return false
    } catch (error) {
      console.error("Error checking for similar reports:", error)
      toast({
        title: "Error",
        description: "Failed to check for similar reports. Proceeding with submission.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsCheckingDuplicates(false)
    }
  }

  const upvoteExistingReport = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to upvote the existing report
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Report upvoted",
        description: "Thank you for contributing! Your upvote helps prioritize this issue.",
        action: (
          <div className="p-1 text-green-600 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
            <ThumbsUp className="w-4 h-4" />
          </div>
        ),
      })

      router.push(`/public-issues/${similarReport.id}`)
    } catch (error) {
      console.error("Error upvoting report:", error)
      toast({
        title: "Error",
        description: "Failed to upvote the existing report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setShowSimilarDialog(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description || !category || !type || !location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // First, check for similar reports
    const hasSimilar = await checkForSimilarIssues()
    if (hasSimilar) {
      // The dialog will handle the upvote flow
      return
    }

    setIsSubmitting(true)

    try {
      // Create form data for submission
      const formData = new FormData()
      formData.append("title", title)
      formData.append("category", category)
      formData.append("type", type)
      formData.append("description", description)
      formData.append("location", location)
      formData.append("lat", coordinates?.lat || 0)
      formData.append("lng", coordinates?.lng || 0)

      // Add images
      images.forEach((image) => {
        formData.append("images", image.file)
      })

      // Submit to API
      // This is a mock implementation - in production, you'd call your actual API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Report submitted successfully",
        description: "Thank you for your contribution to the community!",
      })

      router.push("/public-issues")
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Error submitting report",
        description: error.message || "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getIssueTypesByCategory = () => {
    switch (category) {
      case "infrastructure":
        return [
          { value: "pothole", label: "Pothole" },
          { value: "broken_road", label: "Broken Road/Sidewalk" },
          { value: "traffic_signal", label: "Traffic Signal Malfunction" },
          { value: "damaged_signage", label: "Damaged Signage" },
          { value: "bridge_damage", label: "Bridge or Overpass Damage" },
        ]
      case "environmental":
        return [
          { value: "garbage", label: "Garbage Dumping" },
          { value: "open_burning", label: "Open Burning" },
          { value: "overgrown_vegetation", label: "Overgrown Vegetation" },
          { value: "pollution", label: "Pollution" },
          { value: "stagnant_water", label: "Stagnant Water" },
        ]
      case "safety":
        return [
          { value: "streetlight", label: "Streetlight Outage" },
          { value: "vandalism", label: "Vandalism" },
          { value: "noise", label: "Noise Disturbance" },
          { value: "suspicious", label: "Suspicious Activity" },
          { value: "blocked_exit", label: "Blocked Fire Hydrant/Exit" },
        ]
      case "utility":
        return [
          { value: "power_outage", label: "Power Outage" },
          { value: "water", label: "Water Leakage" },
          { value: "drainage", label: "Blocked Drainage/Sewage" },
          { value: "network", label: "Internet/Network Issues" },
        ]
      case "civic":
        return [
          { value: "encroachment", label: "Illegal Encroachment" },
          { value: "unclean", label: "Unclean Public Spaces" },
          { value: "event_nuisance", label: "Event-Related Nuisance" },
          { value: "illegal_parking", label: "Illegal Parking" },
          { value: "street_vendors", label: "Unauthorized Street Vendors" },
        ]
      case "emergency":
        return [
          { value: "fire", label: "Fire Hazard" },
          { value: "medical", label: "Medical Emergency" },
          { value: "accident", label: "Accidents" },
          { value: "gas_leak", label: "Gas Leak" },
        ]
      default:
        return []
    }
  }

  const getCategoryIcon = () => {
    switch (category) {
      case "infrastructure":
        return <Road className="w-5 h-5 text-blue-500" />
      case "environmental":
        return <Leaf className="w-5 h-5 text-green-500" />
      case "safety":
        return <Shield className="w-5 h-5 text-amber-500" />
      case "utility":
        return <Zap className="w-5 h-5 text-purple-500" />
      case "civic":
        return <Home className="w-5 h-5 text-indigo-500" />
      case "emergency":
        return <Fire className="w-5 h-5 text-red-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
            Report a Public Issue
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Issue Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <CardContent className="pt-6 space-y-6">
              <TabsContent value="details" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Brief title describing the issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Issue Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value)
                      setType("")
                    }}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-700">
                      <SelectValue placeholder="Select issue category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="infrastructure" className="flex items-center">
                          <div className="flex items-center">
                            <Road className="w-4 h-4 mr-2 text-blue-500" />
                            Infrastructure Issues
                          </div>
                        </SelectItem>
                        <SelectItem value="environmental">
                          <div className="flex items-center">
                            <Leaf className="w-4 h-4 mr-2 text-green-500" />
                            Environmental Issues
                          </div>
                        </SelectItem>
                        <SelectItem value="safety">
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-amber-500" />
                            Public Safety Concerns
                          </div>
                        </SelectItem>
                        <SelectItem value="utility">
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-2 text-purple-500" />
                            Property & Utility Issues
                          </div>
                        </SelectItem>
                        <SelectItem value="civic">
                          <div className="flex items-center">
                            <Home className="w-4 h-4 mr-2 text-indigo-500" />
                            Civic & Community Issues
                          </div>
                        </SelectItem>
                        <SelectItem value="emergency">
                          <div className="flex items-center">
                            <Fire className="w-4 h-4 mr-2 text-red-500" />
                            Emergency Situations
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {category && (
                  <div className="space-y-2">
                    <Label htmlFor="type">
                      Issue Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={type} onValueChange={setType} required>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-700">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {getIssueTypesByCategory().map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the issue"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                    className="border-gray-300 focus:border-blue-500 dark:border-gray-700"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setActiveTab("location")}
                >
                  Next: Location Information
                </Button>
              </TabsContent>

              <TabsContent value="location" className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGetLocation}
                      disabled={isLoadingLocation}
                      className="text-xs border-gray-300 dark:border-gray-700"
                    >
                      {isLoadingLocation ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Getting location...
                        </>
                      ) : coordinates ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                          Update location
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3 mr-1" />
                          Get my location
                        </>
                      )}
                    </Button>
                  </div>
                  <Input
                    id="location"
                    placeholder="Address of the issue"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 dark:border-gray-700"
                  />
                  {locationError && (
                    <p className="flex items-center mt-1 text-sm text-red-500">
                      <Info className="w-3 h-3 mr-1" /> {locationError}
                    </p>
                  )}
                  {coordinates && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </p>
                  )}
                </div>

                <div
                  ref={mapRef}
                  className="relative h-48 mb-3 overflow-hidden bg-gray-100 rounded-md dark:bg-gray-800"
                >
                  {coordinates ? (
                    // In a real app, this would be an actual map component
                    // For now, we'll show a placeholder with the coordinates
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="p-2 text-center rounded-lg bg-white/90 dark:bg-gray-800/90">
                        <p className="font-medium text-gray-800 dark:text-gray-200">Map View</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Lat: {coordinates.lat.toFixed(6)}
                          <br />
                          Lng: {coordinates.lng.toFixed(6)}
                        </p>
                      </div>
                      <div className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        <div className="flex items-center justify-center w-8 h-8 text-white bg-red-500 border-2 border-white rounded-full">
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={`https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=15&size=400x200&markers=color:red%7C${coordinates.lat},${coordinates.lng}&key=YOUR_API_KEY`}
                          alt="Map location"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">Click "Get my location" to see the map</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setActiveTab("details")}>
                    Back
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setActiveTab("media")}>
                    Next: Add Media
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                <div className="space-y-2">
                  <Label>
                    Images (Max 3) <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="relative h-24 overflow-hidden bg-gray-100 rounded-md dark:bg-gray-800"
                      >
                        <Image src={image.url || "/placeholder.svg"} alt={image.name} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image.id)}
                          className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {images.length < 3 && (
                      <div className="relative flex flex-col items-center justify-center h-24 text-gray-500 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-700 dark:text-gray-400">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-xs">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Upload clear images of the issue to help authorities address it faster.
                  </p>
                </div>

                <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Information</h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                        <ul className="pl-5 space-y-1 list-disc">
                          <li>Your name will be automatically included with this report</li>
                          <li>Verified reports earn Karma points</li>
                          <li>False reports may result in penalties</li>
                          <li>Your report will be visible to the community and relevant authorities</li>
                          <li>Similar reports will be detected automatically to prevent duplicates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setActiveTab("location")}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isCheckingDuplicates}
                    className="flex-1 text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting || isCheckingDuplicates ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isCheckingDuplicates ? "Checking for similar reports..." : "Submitting..."}
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
          <CardFooter className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 dark:border-gray-700"
            >
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Similar Report Dialog */}
      <AlertDialog open={showSimilarDialog} onOpenChange={setShowSimilarDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Similar Report Found</AlertDialogTitle>
            <AlertDialogDescription>We found a similar report already in our system:</AlertDialogDescription>
          </AlertDialogHeader>

          {similarReport && (
            <div className="p-4 my-4 border rounded-md">
              <h3 className="text-lg font-medium">{similarReport.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{similarReport.description}</p>
              <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {similarReport.distance}
                </span>
                <span className="flex items-center">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  {similarReport.upvotes} upvotes
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Reported on {similarReport.createdAt}
                </span>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={upvoteExistingReport} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Upvote Existing Report
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
