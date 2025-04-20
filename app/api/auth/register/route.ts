import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "password", "age", "gender", "occupation", "location"]
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Check if passwords match
    if (userData.password !== userData.confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    // Generate unique user ID
    const userId = generateUserId()

    // In a real app, you would:
    // 1. Hash the password
    // 2. Check if email already exists
    // 3. Store user in database

    // For demo purposes, we'll just return success with the generated userId
    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      userId: userId,
      gamification: {
        xpGained: 50,
        badgesUnlocked: ["newcomer"],
      },
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}

function generateUserId(): string {
  const prefix = "ACT"
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `${prefix}${timestamp}${random}`
}
