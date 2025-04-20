import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    const client = await clientPromise
    const db = client.db()

    // Check if challenge exists
    const challenge = await db.collection("eco_challenges").findOne({ _id: id })
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    // Check if user already taking this challenge
    const existingParticipation = await db.collection("challenge_participants").findOne({
      challengeId: id,
      userId: session.user.id,
    })

    if (existingParticipation) {
      return NextResponse.json({ error: "You are already participating in this challenge" }, { status: 400 })
    }

    // Add user as participant
    const participation = {
      challengeId: id,
      userId: session.user.id,
      userName: session.user.name,
      userAvatar: session.user.image || "/placeholder.svg?height=80&width=80",
      status: "in_progress",
      progress: 0,
      startedAt: new Date(),
      updatedAt: new Date(),
      completedSteps: [],
      proofSubmitted: false,
    }

    await db.collection("challenge_participants").insertOne(participation)

    // Increment participants count
    await db.collection("eco_challenges").updateOne({ _id: id }, { $inc: { participants: 1 } })

    // Add to user activity
    await db.collection("users").updateOne(
      { _id: session.user.id },
      {
        $push: {
          activity: {
            type: "challenge_joined",
            challengeId: id,
            title: challenge.title,
            timestamp: new Date(),
          },
        },
      },
    )

    return NextResponse.json({
      success: true,
      message: "You have successfully joined this challenge",
    })
  } catch (error) {
    console.error("Error taking challenge:", error)
    return NextResponse.json({ error: "Failed to join challenge" }, { status: 500 })
  }
}
