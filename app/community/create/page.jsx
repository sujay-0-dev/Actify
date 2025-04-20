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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Upload, X, Loader2, MapPin, Info, AlertTriangle, CheckCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"

// Mock content moderation API service
const checkContentModeration = async (text, images = []) => {
  // In a real implementation, this would call an AI moderation API
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Check for obvious problematic words (very basic implementation)
  const problematicWords = ["hate", "kill", "violence", "attack", "threat", "abuse", "racist"]

  const hasProblematicWords = problematicWords.some((word) => text.toLowerCase().includes(word))

  if (hasProblematicWords) {
    return {
      approved: false,
      reason: "Your post contains content that may violate our community guidelines.",
    }
  }

  return {
    approved: true,
  }
}

export default function CreateCommunityPost() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef(null)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [images, setImages] = useState([])
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shareWithNeighbors, setShareWithNeighbors] = useState(true)
  const [isPublic, setIsPublic] = useState(true)
  const [isCheckingContent, setIsCheckingContent] = useState(false)
  const [moderationResult, setModerationResult] = useState(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/community/create")
    }
  }, [user, loading, router])

  // Get user's location when the component mounts
  useEffect(() => {
    if (user?.location) {
      setLocation(user.location)
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          // In a real app, this would be a call to a geocoding service
          // For now, we'll use a placeholder
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [user])

  const handleAddTag = () => {
    if (!tagInput.trim()) return
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
    }
    setTagInput("")
  }

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag))
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

  const checkForViolations = async () => {
    if (!title || !content || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return false
    }

    setIsCheckingContent(true)
    setModerationResult(null)

    try {
      const result = await checkContentModeration(`${title} ${content}`, images)

      setModerationResult(result)

      if (!result.approved) {
        toast({
          title: "Content moderation alert",
          description: result.reason,
          variant: "destructive",
        })
        return false
      }

      return true
    } catch (error) {
      console.error("Error checking content:", error)
      toast({
        title: "Error",
        description: "Failed to check content. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsCheckingContent(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // First check content moderation
    const contentApproved = await checkForViolations()
    if (!contentApproved) return

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to create the post
      // For this demo, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Post created successfully",
        description: "Your post has been published to the community",
      })

      router.push("/community")
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error creating post",
        description: error.message || "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { value: "discussion", label: "General Discussion" },
    { value: "events", label: "Events & Activities" },
    { value: "questions", label: "Questions & Help" },
    { value: "announcements", label: "Announcements" },
    { value: "initiatives", label: "Community Initiatives" },
    { value: "issues", label: "Local Issues" },
    { value: "marketplace", label: "Buy, Sell, Trade" },
    { value: "skills", label: "Skills & Knowledge Sharing" },
    { value: "other", label: "Other" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" />
            Create a Community Post
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Post Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Give your post a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-gray-300 focus:border-indigo-500 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="border-gray-300 focus:border-indigo-500 dark:border-gray-700">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
                className="border-gray-300 focus:border-indigo-500 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label>Images (Max 5)</Label>
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
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Upload relevant images to enhance your post (optional)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a relevant tag"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  className="border-gray-300 focus:border-indigo-500 dark:border-gray-700"
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center">
                Location
                <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  (Will help show your post to relevant community members)
                </div>
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    id="location"
                    placeholder="Your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-indigo-500 dark:border-gray-700"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords
                          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
                        },
                        (error) => {
                          console.error("Error getting location:", error)
                          toast({
                            title: "Error getting location",
                            description: error.message,
                            variant: "destructive",
                          })
                        },
                      )
                    }
                  }}
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Get Location
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="share-neighbors" checked={shareWithNeighbors} onCheckedChange={setShareWithNeighbors} />
                <Label htmlFor="share-neighbors">Share with neighboring communities</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="public-post" checked={isPublic} onCheckedChange={setIsPublic} />
                <Label htmlFor="public-post">Make post public</Label>
              </div>
            </div>

            {moderationResult && !moderationResult.approved && (
              <div className="p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Content Moderation Alert</h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                      <p>{moderationResult.reason}</p>
                      <p className="mt-1">
                        Please review and adjust your content to comply with our community guidelines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {moderationResult && moderationResult.approved && (
              <div className="p-4 border border-green-200 rounded-md bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Content Approved</h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                      <p>Your content has passed our moderation checks and is ready to be published.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 border border-indigo-100 rounded-md bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Community Guidelines</h3>
                  <div className="mt-2 text-sm text-indigo-700 dark:text-indigo-400">
                    <ul className="pl-5 space-y-1 list-disc">
                      <li>Be respectful and considerate of others</li>
                      <li>No hate speech, discrimination, or harassment</li>
                      <li>Avoid sharing sensitive personal information</li>
                      <li>Post content relevant to the community</li>
                      <li>Verify information before sharing to prevent misinformation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 dark:border-gray-700"
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              {!moderationResult && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={checkForViolations}
                  disabled={isCheckingContent || isSubmitting}
                  className="border-gray-300 dark:border-gray-700"
                >
                  {isCheckingContent ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking Content...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Check Content
                    </>
                  )}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || isCheckingContent || (moderationResult && !moderationResult.approved)}
                className="text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Post to Community
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
