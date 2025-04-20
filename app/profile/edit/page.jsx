"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { User, Camera, Loader2, Save, X, ArrowLeft, Shield } from "lucide-react"

export default function EditProfilePage() {
  const { user, updateProfile, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  // Form state
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [phone, setPhone] = useState("")
  const [occupation, setOccupation] = useState("")
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [interests, setInterests] = useState([])
  const [newInterest, setNewInterest] = useState("")
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile/edit")
      return
    }

    if (user) {
      // Populate form with user data
      setFullName(user.fullName || user.name || "")
      setBio(user.bio || "")
      setLocation(user.location || "")
      setPhone(user.phone || "")
      setOccupation(user.profession || user.occupation || "")
      setSkills(user.skills || [])
      setInterests(user.interests || [])
      setProfileVisibility(user.settings?.profileVisibility !== false)
      setEmailNotifications(user.settings?.emailNotifications !== false)
      setAvatarPreview(user.avatar || "")
    }
  }, [user, loading, router])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // In a real app, you would upload this to your server
    // For this demo, we'll just create an object URL
    const preview = URL.createObjectURL(file)
    setAvatar(file)
    setAvatarPreview(preview)
  }

  const handleAddSkill = () => {
    if (!newSkill.trim()) return
    if (!skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
    }
    setNewSkill("")
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleAddInterest = () => {
    if (!newInterest.trim()) return
    if (!interests.includes(newInterest)) {
      setInterests([...interests, newInterest])
    }
    setNewInterest("")
  }

  const handleRemoveInterest = (interestToRemove) => {
    setInterests(interests.filter((interest) => interest !== interestToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would upload the avatar and update the profile
      // For this demo, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedProfile = {
        fullName,
        bio,
        location,
        phone,
        profession: occupation,
        skills,
        interests,
        settings: {
          profileVisibility,
          emailNotifications,
        },
        avatar: avatarPreview, // In a real app, this would be the URL from your server
      }

      // Update the profile
      await updateProfile(updatedProfile)

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      router.push("/profile")
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/profile")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
                <TabsTrigger value="settings">Privacy & Settings</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="personal" className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white ring-2 ring-indigo-100 dark:border-gray-800 dark:ring-gray-700">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview || "/placeholder.svg"}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
                          <User className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Click the camera icon to change your profile picture
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="Your occupation"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button type="button" onClick={handleAddSkill}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {skills.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No skills added yet</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInterest())}
                    />
                    <Button type="button" onClick={handleAddInterest}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interests.map((interest, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full dark:bg-purple-900/30 dark:text-purple-300"
                      >
                        <span>{interest}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {interests.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No interests added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Privacy Settings</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profileVisibility">Profile Visibility</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Make your profile visible to other community members
                      </p>
                    </div>
                    <Switch id="profileVisibility" checked={profileVisibility} onCheckedChange={setProfileVisibility} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Notification Settings</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive email notifications about activity related to you
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-md dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Privacy Notice</h3>
                      <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                        <p>
                          Your personal information is protected according to our privacy policy. We only share
                          information with your consent.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/profile")} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
