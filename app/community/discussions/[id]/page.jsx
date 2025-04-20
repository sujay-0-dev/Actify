"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageSquare, ThumbsUp, Eye, Share2, Flag, Award } from "lucide-react"
import LevelBadge from "@/components/gamification/level-badge"

export default function DiscussionDetailPage({ params }) {
  const router = useRouter()
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  
  // Mock discussion data
  const discussion = {
    id: unwrappedParams.id,
    title: "Ideas for improving local park maintenance",
    category: "Environment",
    author: "Rahul S.",
    authorLevel: 3,
    authorKarma: 450,
    time: "2 days ago",
    replies: 24,
    views: 156,
    likes: 38,
    image: "/placeholder.svg?height=80&width=80",
    content: `
      <p>I've noticed that our local park is not being maintained properly. The grass is overgrown, and there's trash everywhere. This is becoming a health and safety concern, especially for children who play there.</p>
      
      <p>I think we should organize a community clean-up and also petition the local authorities to increase maintenance frequency. Here are some specific issues I've noticed:</p>
      
      <ul>
        <li>Overgrown grass and weeds</li>
        <li>Trash accumulation near benches</li>
        <li>Broken playground equipment</li>
        <li>Poor lighting in the evening</li>
      </ul>
      
      <p>I've already spoken with a few neighbors, and they're also concerned about the state of the park. I believe if we come together as a community, we can make a significant difference.</p>
      
      <p>Has anyone else noticed these issues? Would you be interested in participating in a community clean-up day? I'm thinking of organizing one for next Saturday.</p>
    `,
    tags: ["parks", "maintenance", "community-action"],
    comments: [
      {
        id: 1,
        author: "Priya M.",
        authorLevel: 4,
        authorKarma: 520,
        image: "/placeholder.svg?height=40&width=40",
        time: "1 day ago",
        content:
          "I completely agree with your observations. The park has been neglected for too long. I'd be happy to join the clean-up effort and can bring some gardening tools.",
        likes: 12,
      },
      {
        id: 2,
        author: "Amit K.",
        authorLevel: 2,
        authorKarma: 380,
        image: "/placeholder.svg?height=40&width=40",
        time: "1 day ago",
        content:
          "I've also noticed the broken playground equipment. It's a safety hazard for children. I've taken some photos that we can include in our petition to the local authorities.",
        likes: 8,
      },
      {
        id: 3,
        author: "Neha G.",
        authorLevel: 3,
        authorKarma: 410,
        image: "/placeholder.svg?height=40&width=40",
        time: "12 hours ago",
        content:
          "Count me in for the clean-up! I can also help spread the word through our neighborhood WhatsApp group. The more people we get involved, the bigger impact we can make.",
        likes: 15,
      },
    ],
  }

  const handleSubmitComment = () => {
    if (!comment.trim()) return

    setIsSubmitting(true)

    // In a real app, you would submit the comment to your backend
    setTimeout(() => {
      setComment("")
      setIsSubmitting(false)
      // In a real app, you would update the comments list with the new comment
    }, 1000)
  }

  return (
    <div className="container py-10">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/community")}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Discussions
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Discussion Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{discussion.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge>{discussion.category}</Badge>
                    {discussion.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={discussion.image} alt={discussion.author} />
                    <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    <LevelBadge level={discussion.authorLevel} size="xs" />
                  </div>
                </div>
                <div>
                  <div className="font-medium">{discussion.author}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{discussion.time}</span>
                    <span className="mx-1">•</span>
                    <Award className="w-3 h-3 mr-1 text-indigo-500" />
                    <span>{discussion.authorKarma} Karma</span>
                  </div>
                </div>
              </div>

              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: discussion.content }}
              />
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Like ({discussion.likes})</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Flag className="w-4 h-4" />
                  <span>Report</span>
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {discussion.views} views
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {discussion.replies} replies
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Comments Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Comments ({discussion.comments.length})</h2>

            {/* Add Comment */}
            <Card>
              <CardContent className="pt-6">
                <Textarea
                  placeholder="Add your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-muted-foreground">
                    <Award className="inline w-3 h-3 mr-1 text-indigo-500" />
                    Earn 5-10 Karma for helpful comments
                  </p>
                  <Button onClick={handleSubmitComment} disabled={!comment.trim() || isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            {discussion.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.image} alt={comment.author} />
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1">
                        <LevelBadge level={comment.authorLevel} size="xs" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{comment.author}</div>
                          <div className="text-xs text-muted-foreground">
                            {comment.time} • {comment.authorKarma} Karma
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span className="text-xs">{comment.likes}</span>
                        </Button>
                      </div>
                      <p className="mt-2 text-sm">{comment.content}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* About the Author */}
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-lg font-bold">About the Author</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={discussion.image} alt={discussion.author} />
                    <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    <LevelBadge level={discussion.authorLevel} size="sm" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-bold">{discussion.author}</div>
                  <div className="text-sm text-muted-foreground">Member since Jan 2023</div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <Award className="w-4 h-4 mr-1 text-indigo-500" />
                  <span>{discussion.authorKarma} Karma</span>
                </div>
                <Separator className="my-4" />
                <div className="w-full">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Posts</span>
                    <span>42</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Comments</span>
                    <span>156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Badges</span>
                    <span>7</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href={`/profile/${discussion.author.replace(/\s+/g, "-").toLowerCase()}`}>View Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Discussions */}
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-lg font-bold">Related Discussions</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Community garden proposal for the park",
                    replies: 18,
                    time: "3 days ago",
                  },
                  {
                    title: "Fundraising ideas for park improvements",
                    replies: 12,
                    time: "1 week ago",
                  },
                  {
                    title: "Safety concerns in public parks",
                    replies: 24,
                    time: "2 weeks ago",
                  },
                ].map((item, index) => (
                  <div key={index} className="pb-3 border-b last:border-0 last:pb-0">
                    <Link href="#" className="font-medium transition-colors hover:text-indigo-600">
                      {item.title}
                    </Link>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      <span>{item.replies} replies</span>
                      <span className="mx-2">•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-lg font-bold">Community Guidelines</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Be respectful and considerate</p>
                <p>• Stay on topic and contribute meaningfully</p>
                <p>• No hate speech or personal attacks</p>
                <p>• Verify information before sharing</p>
                <p>• Report inappropriate content</p>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Read Full Guidelines
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}