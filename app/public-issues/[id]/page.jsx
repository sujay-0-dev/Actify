import { notFound } from "next/navigation"

export default async function PublicIssueDetailPage({ params }) {
  const id = params.id

  // This will be a server component, so we'll fetch data server-side
  try {
    // In a real app, you would fetch from your API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock data for the report
    const report = {
      id: Number.parseInt(id),
      type: "pothole",
      category: "infrastructure",
      title: "Large pothole on Main Street",
      description:
        "There's a large pothole that's causing traffic issues and potential damage to vehicles. It's approximately 2 feet wide and 8 inches deep. This has been a problem for several weeks now and is getting worse with the recent rains. Several cars have already been damaged.",
      location: "Main St & 5th Ave, New Delhi",
      coordinates: { lat: 28.6139, lng: 77.209 },
      status: "verified",
      user: {
        id: 1,
        name: "Rahul S.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      karma: 45,
      date: "2023-06-15",
      time: "14:30",
      upvotes: 12,
      images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
      comments: [
        {
          id: 1,
          user: {
            id: 2,
            name: "Priya M.",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          text: "I noticed this too! My car was damaged last week because of this pothole.",
          date: "2023-06-16",
          time: "09:45",
        },
        {
          id: 2,
          user: {
            id: 3,
            name: "Amit K.",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          text: "The municipal corporation should fix this ASAP. It's becoming dangerous.",
          date: "2023-06-16",
          time: "11:20",
        },
      ],
      updates: [
        {
          id: 1,
          status: "reported",
          date: "2023-06-15",
          time: "14:30",
          description: "Report submitted",
        },
        {
          id: 2,
          status: "verified",
          date: "2023-06-16",
          time: "10:15",
          description: "Report verified by community moderator",
        },
      ],
    }

    return <PublicIssueDetailClient report={report} />
  } catch (error) {
    console.error("Error fetching report:", error)
    notFound()
  }
}
;("use client")

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertTriangle,
  MapPin,
  Clock,
  ThumbsUp,
  MessageSquare,
  Share2,
  Flag,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  RouteIcon as Road,
  Leaf,
  Shield,
  Zap,
  Home,
  FlameIcon as Fire,
} from "lucide-react"

function PublicIssueDetailClient({ report: initialReport }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [comment, setComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [report, setReport] = useState(initialReport)

  const handleUpvote = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upvote reports",
        variant: "destructive",
      })
      return
    }

    setHasUpvoted(!hasUpvoted)
    setReport((prev) => ({
      ...prev,
      upvotes: hasUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
    }))

    toast({
      title: hasUpvoted ? "Upvote removed" : "Upvoted!",
      description: hasUpvoted ? "You have removed your upvote" : "Thank you for your feedback",
    })
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingComment(true)

    try {
      // In a real app, you would submit to your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newComment = {
        id: Math.floor(Math.random() * 1000),
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
        text: comment,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().split(" ")[0].substring(0, 5),
      }

      setReport((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }))

      setComment("")

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "reported":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Loader2 className="h-4 w-4 text-amber-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-purple-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "infrastructure":
        return <Road className="h-4 w-4 text-blue-500" />
      case "environmental":
        return <Leaf className="h-4 w-4 text-green-500" />
      case "safety":
        return <Shield className="h-4 w-4 text-amber-500" />
      case "utility":
        return <Zap className="h-4 w-4 text-purple-500" />
      case "civic":
        return <Home className="h-4 w-4 text-indigo-500" />
      case "emergency":
        return <Fire className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  if (!report) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The issue report you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/public-issues">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Public Issues
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Button variant="outline" className="mb-6 border-gray-300 dark:border-gray-700" asChild>
        <Link href="/public-issues">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Public Issues
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="capitalize">{report.type}</Badge>
                    <Badge
                      className={`capitalize flex items-center gap-1 ${
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
                      {getCategoryIcon(report.category)}
                      {report.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{report.title}</CardTitle>
                </div>
                <Badge
                  className={`capitalize ${
                    report.status === "verified"
                      ? "bg-green-500"
                      : report.status === "in-progress"
                        ? "bg-amber-500"
                        : report.status === "resolved"
                          ? "bg-purple-500"
                          : "bg-blue-500"
                  }`}
                >
                  {report.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    Reported on {report.date} at {report.time}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{report.location}</span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{report.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {report.images.map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Image ${index + 1} of ${report.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleUpvote}
                    className={`flex items-center gap-1 text-sm ${
                      hasUpvoted
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{report.upvotes} Upvotes</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    <MessageSquare className="h-4 w-4" />
                    <span>{report.comments.length} Comments</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-700">
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-700">
                    <Flag className="h-4 w-4 mr-1" /> Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Comments ({report.comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {user ? (
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <Textarea
                    placeholder="Add your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 dark:border-gray-700"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmittingComment}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSubmittingComment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        "Post Comment"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md text-center dark:bg-gray-800">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Please log in to add a comment</p>
                  <Button asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t">
                {report.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">{comment.user.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {comment.date} at {comment.time}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 ml-2">
                        <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                          Like
                        </button>
                        <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Reported By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={report.user.avatar || "/placeholder.svg"} alt={report.user.name} />
                  <AvatarFallback>{report.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{report.user.name}</div>
                  <Badge variant="outline">{report.karma} Karma</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Status Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-6 relative">
                  {report.updates.map((update, index) => (
                    <div key={update.id} className="flex gap-3">
                      <div className="relative z-10">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            index === 0
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : update.status === "verified"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : update.status === "in-progress"
                                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                  : update.status === "resolved"
                                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {getStatusIcon(update.status)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white capitalize">{update.status}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{update.description}</p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {update.date} at {update.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
                <Image src="/placeholder.svg?height=200&width=400" alt="Map location" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Map view of location</p>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div className="font-medium">{report.location}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Coordinates: {report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Similar Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Link href={`/public-issues/${i}`} key={i}>
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors dark:border-gray-800 dark:hover:border-blue-900 dark:hover:bg-blue-900/10">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt="Issue thumbnail"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Similar issue report #{i}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Nearby location • {i} days ago</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
