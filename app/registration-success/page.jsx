"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Copy, ArrowRight, Trophy, Star, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import LevelBadge from "@/components/gamification/level-badge"

export default function RegistrationSuccessPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [registrationData, setRegistrationData] = useState(null)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Get registration data from localStorage
    const data = localStorage.getItem("registrationSuccess")
    if (!data) {
      router.push("/register")
      return
    }

    try {
      setRegistrationData(JSON.parse(data))

      // Show achievement toast
      setTimeout(() => {
        toast({
          title: "Achievement Unlocked!",
          description: "Welcome to Actify! +50 XP",
          action: (
            <div className="flex items-center justify-center p-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          ),
        })
      }, 1000)
    } catch (error) {
      console.error("Error parsing registration data:", error)
      router.push("/register")
    }

    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [router, toast])

  const handleCopyUserId = () => {
    if (registrationData?.userId) {
      navigator.clipboard.writeText(registrationData.userId)
      toast({
        title: "User ID copied",
        description: "Your user ID has been copied to clipboard",
      })
    }
  }

  if (!registrationData) {
    return null // Loading or redirecting
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
              }}
            >
              <div
                className="w-4 h-4 rounded-sm"
                style={{
                  backgroundColor: [
                    "#6366F1", // Indigo
                    "#8B5CF6", // Violet
                    "#EC4899", // Pink
                    "#10B981", // Emerald
                    "#F59E0B", // Amber
                  ][Math.floor(Math.random() * 5)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center">
              <div className="relative w-10 h-10 mr-2">
                <Image src="/placeholder.svg?height=40&width=40" alt="Actify Logo" fill className="rounded-md" />
              </div>
              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                Actify
              </span>
            </div>
          </Link>
        </div>

        <Card className="overflow-visible border-0 shadow-lg">
          <div className="absolute p-2 transform -translate-x-1/2 bg-white border-4 border-indigo-100 rounded-full shadow-lg -top-6 left-1/2 dark:bg-gray-800 dark:border-indigo-900">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full -top-1 -right-1 bg-amber-500 animate-pulse">
                +1
              </div>
            </div>
          </div>

          <CardHeader className="pt-12 pb-6">
            <CardTitle className="text-2xl text-center text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
              Registration Successful!
            </CardTitle>
            <CardDescription className="text-center">Your adventure begins now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-white border border-indigo-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-indigo-800">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{registrationData.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                  <p className="font-medium text-gray-900 dark:text-white">{registrationData.username}</p>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Your User ID</p>
                      <p className="font-medium text-gray-900 dark:text-white">{registrationData.userId}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyUserId}
                      className="h-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-amber-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Your Progress</span>
                </div>
                <LevelBadge level={1} size="sm" showLabel={true} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>XP Progress</span>
                  <span className="font-medium">
                    {registrationData.xp}/{registrationData.nextLevelXp}
                  </span>
                </div>
                <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${(registrationData.xp / registrationData.nextLevelXp) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-indigo-100 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Karma Points</span>
                </div>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{registrationData.karma}</span>
              </div>
            </div>

            <div className="p-4 text-indigo-800 border border-indigo-100 rounded-md bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800">
              <p className="text-sm">
                Please save your User ID for future reference. You can log in using your email and password.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" asChild>
              <Link href="/login">
                Continue to Login <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
              asChild
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
