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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Save, ArrowLeft, Clock, Users, Tag } from "lucide-react"

export default function CreateSkillPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [type, setType] = useState("workshop")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [date, setDate] = useState(null)
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState("")
  const [capacity, setCapacity] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isDraft, setIsDraft] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !category || !description || !date || !time || !duration || !capacity) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const skillData = {
        title,
        category,
        type,
        description,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        nextSession: format(date, "yyyy-MM-dd"),
        time,
        duration,
        capacity: Number.parseInt(capacity),
        provider: {
          id: user.id,
          name: user.name,
          avatar: user.image || "/placeholder.svg?height=80&width=80",
          level: user.level || 1,
        },
        verified: isVerified,
        status: isDraft ? "draft" : "active",
        createdAt: new Date().toISOString(),
      }

      const response = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      })

      if (!response.ok) {
        throw new Error("Failed to create skill")
      }

      toast({
        title: isDraft ? "Draft saved" : "Skill created",
        description: isDraft ? "Your skill has been saved as a draft" : "Your skill has been published successfully",
      })

      router.push("/skill-sharing")
    } catch (error) {
      console.error("Error creating skill:", error)
      toast({
        title: "Error creating skill",
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
          <CardTitle className="text-2xl">Share Your Skill</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Skill Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="E.g., Web Development Basics, Cooking Masterclass"
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
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="multimedia">Multimedia</SelectItem>
                    <SelectItem value="culinary">Culinary</SelectItem>
                    <SelectItem value="crafts">Crafts</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={type} onValueChange={setType} className="flex gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="workshop" id="workshop" />
                    <Label htmlFor="workshop">Workshop</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="course" id="course" />
                    <Label htmlFor="course">Course</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mentoring" id="mentoring" />
                    <Label htmlFor="mentoring">Mentoring</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what participants will learn and what you'll cover"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
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
                  placeholder="HTML, CSS, JavaScript"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Next Session Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start w-full font-normal text-left">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">
                  Time <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duration <span className="text-red-500">*</span>
                </Label>
                <Select value={duration} onValueChange={setDuration} required>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 minutes">30 minutes</SelectItem>
                    <SelectItem value="1 hour">1 hour</SelectItem>
                    <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                    <SelectItem value="2 hours">2 hours</SelectItem>
                    <SelectItem value="3 hours">3 hours</SelectItem>
                    <SelectItem value="4 hours">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="capacity">
                  Capacity <span className="text-red-500">*</span>
                </Label>
                <span className="text-xs text-gray-500">Maximum number of participants</span>
              </div>
              <div className="relative">
                <Users className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="10"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 space-x-2">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="draft" className="text-base">
                  Save as draft
                </Label>
                <span className="text-sm text-gray-500">Save now and publish later</span>
              </div>
              <Switch id="draft" checked={isDraft} onCheckedChange={setIsDraft} />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isDraft ? "Saving..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isDraft ? "Save as Draft" : "Publish Skill"}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
