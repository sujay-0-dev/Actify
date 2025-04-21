"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setToken(storedToken)
      } catch (error) {
        console.error("Failed to parse user data", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }

    setLoading(false)
  }, [])

  const login = async (usernameOrEmail, password) => {
    try {
      setLoading(true)

      // In a real app, this would be an API call to your backend
      // For demo purposes, we're simulating a successful login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Save to localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setUser(data.user)
      setToken(data.token)

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.fullName}!`,
      })

      return true
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)

      // In a real app, this would be an API call to your backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      return {
        success: true,
        user: data.user,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed",
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setToken(null)
    router.push("/")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const updateProfile = async (updatedData) => {
    try {
      // In a real app, this would be an API call to your backend
      const updatedUser = { ...user, ...updatedData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      return true
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile.",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
