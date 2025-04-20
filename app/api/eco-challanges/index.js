import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const difficulty = searchParams.get("difficulty")
    const creatorId = searchParams.get("creatorId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db()

    // Build query
    const query = {}
    if (category) query.category = category
    if (status) query.status = status
    if (difficulty) query.difficulty = difficulty
    if (creatorId) query["creator.id"] = creatorId

    // Get challenges with pagination
    const challenges = await db
      .collection("eco_challenges")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count for pagination
    const total = await db.collection("eco_challenges").countDocuments(query)

    return NextResponse.json({
      challenges,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching challenges:", error)
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const challengeData = await request.json()

    // Validate required fields
    const requiredFields = ["title", "category", "description", "difficulty", "points", "deadline", "steps"]
    for (const field of requiredFields) {
      if (!challengeData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Ensure creator info is correct
    if (!challengeData.creator || challengeData.creator.id !== session.user.id) {
      challengeData.creator = {
        id: session.user.id,
        name: session.user.name,
        avatar: session.user.image || "/placeholder.svg?height=80&width=80",
        level: session.user.level || 1,
      }
    }

    // Add metadata
    challengeData.createdAt = new Date()
    challengeData.updatedAt = new Date()
    challengeData.participants = 0
    challengeData.completions = 0

    const client = await clientPromise
    const db = client.db()

    // Insert challenge
    const result = await db.collection("eco_challenges").insertOne(challengeData)

    // Update user karma if challenge is published (not draft)
    if (challengeData.status === "active") {
      await db.collection("users").updateOne(
        { _id: session.user.id },
        {
          $inc: { "karma.eco": 30 },
          $push: {
            activity: {
              type: "challenge_created",
              challengeId: result.insertedId,
              title: challengeData.title,
              timestamp: new Date(),
            },
          },
        },
      )
    }

    return NextResponse.json({
      success: true,
      challengeId: result.insertedId,
      message: challengeData.status === "active" ? "Challenge published successfully" : "Challenge draft saved",
    })
  } catch (error) {
    console.error("Error creating challenge:", error)
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 })
  }
}
