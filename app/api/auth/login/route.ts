import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { usernameOrEmail, password } = await request.json()

    // Basic validation
    if (!usernameOrEmail || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Check if user exists
    // 2. Verify password
    // 3. Generate JWT token

    // For demo purposes, we'll simulate a successful login
    const mockUser = {
      userId: `ACT${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      name: usernameOrEmail.includes("@") ? usernameOrEmail.split("@")[0] : usernameOrEmail,
      email: usernameOrEmail.includes("@") ? usernameOrEmail : `${usernameOrEmail}@example.com`,
      level: 2,
      karma: {
        total: 120,
        civic: 45,
        skill: 30,
        community: 25,
        eco: 20,
      },
      badges: ["newcomer", "first_report", "eco_starter"],
      profile: {
        age: 28,
        gender: "Male",
        occupation: "Software Developer",
        location: "New Delhi, India",
      },
    }

    // Generate mock token
    const token = `mock-jwt-token-${Math.random().toString(36).substring(2)}`

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: mockUser,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
