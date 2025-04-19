"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2, Upload, X, Tag, MapPin, DollarSign, Save } from "lucide-react"
import Image from "next/image"

export default function CreateProductPage() {
  const auth = useAuth() || {};
  const { user, logout } = auth;
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [condition, setCondition] = useState("new")
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState("")
  const [images, setImages] = useState([])
  const [isDraft, setIsDraft] = useState(false)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation",
        variant: "destructive",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Reverse geocoding to get address from coordinates
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`,
          )
          const data = await response.json()
          if (data.results && data.results.length > 0) {
            setLocation(data.results[0].formatted_address)
          } else {
            setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          }
        } catch (error) {
          console.error("Error getting address:", error)
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        }
      },
      (error) => {
        toast({
          title: "Location error",
          description: `Error getting location: ${error.message}`,
          variant: "destructive",
        })
      },
    )
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    if (images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images",
        variant: "destructive",
      })
      return
    }

    // Create object URLs for preview
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !category || !price || !description || !condition || !location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image of your product",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create form data for submission
      const formData = new FormData()
      formData.append("title", title)
      formData.append("category", category)
      formData.append("price", price)
      formData.append("description", description)
      formData.append("condition", condition)
      formData.append("location", location)
      formData.append("tags", tags)
      formData.append("status", isDraft ? "draft" : "active")

      // Add images
      images.forEach((image) => {
        formData.append("images", image.file)
      })

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to create product listing")
      }

      toast({
        title: isDraft ? "Draft saved" : "Product listed",
        description: isDraft ? "Your product has been saved as a draft" : "Your product has been listed successfully",
      })

      router.push("/marketplace")
    } catch (error) {
      console.error("Error creating product listing:", error)
      toast({
        title: "Error creating listing",
        description: error.message || "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">List Your Product</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Product Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="E.g., Handmade Bamboo Cutlery Set"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eco-friendly">Eco-Friendly</SelectItem>
                    <SelectItem value="handmade">Handmade</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="art">Art & Crafts</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (₹) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your product, including details about materials, size, usage, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">
                Condition <span className="text-red-500">*</span>
              </Label>
              <RadioGroup value={condition} onValueChange={setCondition} className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new">New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="like-new" id="like-new" />
                  <Label htmlFor="like-new">Like New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good">Good</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fair" id="fair" />
                  <Label htmlFor="fair">Fair</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poor" id="poor" />
                  <Label htmlFor="poor">Poor</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={handleGetLocation} className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  Get my location
                </Button>
              </div>
              <div className="relative">
                <MapPin className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  id="location"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tags">Tags</Label>
                <span className="text-xs text-gray-500">Comma separated</span>
              </div>
              <div className="relative">
                <Tag className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  id="tags"
                  placeholder="eco-friendly, handmade, cotton"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Product Images <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-gray-500">(Max 5)</span>
              </Label>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {images.map((image) => (
                  <div key={image.id} className="relative h-24 overflow-hidden bg-gray-100 rounded-md dark:bg-gray-800">
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

                {images.length < 5 && (
                  <div className="relative flex flex-col items-center justify-center h-24 text-gray-500 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-700 dark:text-gray-400">
                    <Upload className="w-6 h-6 mb-1" />
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
            </div>

            <div className="flex items-center pt-2 space-x-2">
              <input
                type="checkbox"
                id="draft"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
                className="border-gray-300 rounded"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="draft" className="text-sm font-medium leading-none">
                  Save as draft
                </Label>
                <p className="text-sm text-gray-500">Save now and publish later</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-pink-600 hover:bg-pink-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isDraft ? "Saving..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isDraft ? "Save as Draft" : "List Product"}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
