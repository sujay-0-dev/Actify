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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  ArrowLeft,
  Loader2,
  Save,
  CalendarIcon,
  Leaf,
  TreePine,
  Recycle,
  Droplets,
  Wind,
  Award,
  Plus,
  Trash2,
} from "lucide-react"

export default function CreateChallengePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [points, setPoints] = useState("50")
  const [deadline, setDeadline] = useState(null)
  const [steps, setSteps] = useState([""])
  const [isDraft, setIsDraft] = useState(false)

  const getCategoryIcon = () => {
    switch (category) {
      case "Plantation":
        return <TreePine className="w-5 h-5 text-green-500" />
      case "Waste Management":
        return <Recycle className="w-5 h-5 text-amber-500" />
      case "Water":
        return <Droplets className="w-5 h-5 text-blue-500" />
      case "Energy":
        return <Wind className="w-5 h-5 text-purple-500" />
      default:
        return <Leaf className="w-5 h-5 text-green-500" />
    }
  }

  const addStep = () => {
    setSteps([...steps, ""])
  }

  const removeStep = (index) => {
    const newSteps = [...steps]
    newSteps.splice(index, 1)
    setSteps(newSteps)
  }

  const updateStep = (index, value) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !category || !description || !difficulty || !points || !deadline) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Filter out empty steps
    const filteredSteps = steps.filter((step) => step.trim() !== "")
    if (filteredSteps.length === 0) {
      toast({
        title: "Missing steps",
        description: "Please add at least one step for the challenge",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const challengeData = {
        title,
        category,
        description,
        difficulty,
        points: Number.parseInt(points),
        deadline: format(deadline, "yyyy-MM-dd"),
        steps: filteredSteps,
        creator: {
          id: user.id,
          name: user.name,
          avatar: user.image || "/placeholder.svg?height=80&width=80",
          level: user.level || 1,
        },
        status: isDraft ? "draft" : "active",
        participants: 0,
        completions: 0,
        createdAt: new Date().toISOString(),
      }

      const response = await fetch("/api/eco-challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challengeData),
      })

      if (!response.ok) {
        throw new Error("Failed to create challenge")
      }

      toast({
        title: isDraft ? "Draft saved" : "Challenge created",
        description: isDraft
          ? "Your challenge has been saved as a draft"
          : "Your challenge has been published successfully",
      })

      router.push("/eco-challenges")
    } catch (error) {
      console.error("Error creating challenge:", error)
      toast({
        title: "Error creating challenge",
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
          <CardTitle className="flex items-center text-2xl">
            <Leaf className="w-5 h-5 mr-2 text-green-500" />
            Create Eco Challenge
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Challenge Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="E.g., Plant a Tree, Zero Waste Week"
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
                    <SelectItem value="Plantation">Plantation</SelectItem>
                    <SelectItem value="Waste Management">Waste Management</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Biodiversity">Biodiversity</SelectItem>
                    <SelectItem value="Sustainable Living">Sustainable Living</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">
                  Difficulty Level <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={difficulty} onValueChange={setDifficulty} className="flex gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easy" id="easy" />
                    <Label htmlFor="easy">Easy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="hard" />
                    <Label htmlFor="hard">Hard</Label>
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
                placeholder="Describe the challenge, its environmental impact, and what participants will achieve"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="points">
                  Eco-Karma Points <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Award className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                  <Select value={points} onValueChange={setPoints} required>
                    <SelectTrigger id="points" className="pl-10">
                      <SelectValue placeholder="Select points" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25 points (Easy)</SelectItem>
                      <SelectItem value="50">50 points (Medium)</SelectItem>
                      <SelectItem value="75">75 points (Hard)</SelectItem>
                      <SelectItem value="100">100 points (Very Hard)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">
                  Deadline <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start w-full font-normal text-left">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>
                  Challenge Steps <span className="text-red-500">*</span>
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={addStep}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </div>

              {steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-800 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                    {index + 1}
                  </div>
                  <div className="relative flex-1">
                    <Input
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`Step ${index + 1}: e.g., Plant a native tree species`}
                      className="pr-10"
                    />
                    {steps.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute w-6 h-6 p-0 transform -translate-y-1/2 right-2 top-1/2"
                        onClick={() => removeStep(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
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
            <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isDraft ? "Saving..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isDraft ? "Save as Draft" : "Create Challenge"}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
