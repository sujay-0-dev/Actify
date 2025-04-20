"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Store registration success data for the success page
      const successData = {
        userId: data.userId,
        fullName: userData.name,
        username: userData.email.split("@")[0],
        email: userData.email,
        level: 1,
        karma: 50,
        xp: 50,
        nextLevelXp: 100,
      }

      localStorage.setItem("registrationSuccess", JSON.stringify(successData))

      // Store registered user in localStorage for persistence
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      registeredUsers.push({
        userId: data.userId,
        name: userData.name,
        username: userData.email.split("@")[0],
        email: userData.email,
        password: userData.password, // In a real app, this would be hashed
        level: 1,
        karma: 50,
        xp: 50,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      })

      router.push("/registration-success")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)

      // In a real app, this would be an API call
      // For now, we'll check against our localStorage registered users
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const user = registeredUsers.find((u) => u.email === email && u.password === password)

      if (!user) {
        throw new Error("Invalid email or password")
      }

      // Create a user object with the necessary fields
      const userData = {
        userId: user.userId,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar || "/placeholder.svg?height=200&width=200",
        level: user.level || 1,
        karma: user.karma || 50,
        badges: user.badges || ["newcomer"],
        profile: user.profile || {},
      }

      // Store user data and token
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", "user-token-" + Math.random().toString(36).substring(2))

      setUser(userData)

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      })

      router.push("/profile")
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, loading, register, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}