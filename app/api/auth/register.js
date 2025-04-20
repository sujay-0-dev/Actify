import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { generateUserId } from "@/lib/user-utils"

export async function POST(request) {
  try {
    const userData = await request.json()

    // Validate required fields - remove phone from required fields
    const requiredFields = ["name", "email", "password", "age", "gender", "occupation", "location"]
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const client = await clientPromise
    const db = client.db()

    // No OTP verification required anymore

    // Phone is optional
    if (userData.phone) {
      // Check if phone already exists
      const existingPhone = await db.collection("users").findOne({ phone: userData.phone })
      if (existingPhone) {
        return NextResponse.json({ error: "Phone number already registered" }, { status: 400 })
      }
    }

    // Check if email already exists
    const existingEmail = await db.collection("users").findOne({ email: userData.email })
    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userData.password, salt)

    // Generate unique user ID
    const userId = generateUserId()

    // Create user object with additional gamification fields
    const user = {
      _id: userId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || null,
      password: hashedPassword,
      profile: {
        avatar: userData.avatar || "/avatars/default.svg",
        age: Number.parseInt(userData.age),
        gender: userData.gender,
        occupation: userData.occupation,
        income: userData.income || null,
        location: userData.location,
        interests: userData.interests ? userData.interests.split(",").map((item) => item.trim()) : [],
      },
      gamification: {
        karma: {
          total: 10, // Start with 10 karma points as welcome bonus
          civic: 0,
          skill: 0,
          community: 10, // Give them initial community points
          eco: 0,
        },
        level: 1,
        xp: 20, // Start with 20 XP
        xpToNextLevel: 100,
        badges: ["newcomer"], // Add a welcome badge
        achievements: [{
          id: "account_created",
          name: "First Steps",
          description: "Created an ActiSathi account",
          awardedAt: new Date()
        }],
        streaks: {
          current: 1, // Start with a 1-day streak
          longest: 1,
          lastActive: new Date()
        },
        challenges: {
          completed: 0,
          inProgress: [{
            id: "complete_profile",
            name: "Complete Your Profile",
            progress: 50,
            totalRequired: 100
          }],
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      status: "active",
      emailVerified: true, // Auto-mark email as verified since we're skipping OTP
      phoneVerified: false,
    }

    // Insert user
    await db.collection("users").insertOne(user)

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      userId: userId,
      gamification: {
        xpGained: 20,
        badgesUnlocked: ["newcomer"]
      }
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}