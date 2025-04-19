import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    const body = await request.json()
    const { fullName, username, email, phone, age, password, profession, experience, location, idType, idNumber } = body

    // Basic validation
    if (!fullName || !username || !email || !phone || !password || !profession || !location) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Check if username or email already exists
    const existingUser = await db.collection("users").findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      return NextResponse.json({ success: false, message: "Username or email already exists" }, { status: 409 })
    }

    // Generate unique user ID
    const prefix = "ACT"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    const userId = `${prefix}${timestamp}${random}`

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user document
    const newUser = {
      userId,
      username,
      password: hashedPassword,
      fullName,
      email,
      phone,
      age: Number.parseInt(age),
      profession,
      experience: experience ? Number.parseInt(experience) : 0,
      location,
      verification: {
        idType,
        idNumber,
        verified: false,
      },
      documents: {
        govtId: [],
        certifications: [],
      },
      karma: {
        points: 0,
        level: 1,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert user into database
    await db.collection("users").insertOne(newUser)

    // Return success response (excluding password)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
