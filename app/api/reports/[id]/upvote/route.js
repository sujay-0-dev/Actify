import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if report exists
    const report = await db.collection("reports").findOne({ _id: new ObjectId(id) })

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Check if user already upvoted
    const existingUpvote = report.upvotes.find((upvote) => upvote.userId === session.user.id)

    if (existingUpvote) {
      // Remove upvote if already exists (toggle behavior)
      await db.collection("reports").updateOne(
        { _id: new ObjectId(id) },
        {
          $pull: { upvotes: { userId: session.user.id } },
          $set: { updatedAt: new Date() },
        },
      )

      return NextResponse.json({
        success: true,
        message: "Upvote removed",
        upvoted: false,
        upvoteCount: report.upvotes.length - 1,
      })
    } else {
      // Add upvote
      await db.collection("reports").updateOne(
        { _id: new ObjectId(id) },
        {
          $push: {
            upvotes: {
              userId: session.user.id,
              timestamp: new Date(),
            },
          },
          $set: { updatedAt: new Date() },
        },
      )

      return NextResponse.json({
        success: true,
        message: "Report upvoted successfully",
        upvoted: true,
        upvoteCount: report.upvotes.length + 1,
      })
    }
  } catch (error) {
    console.error("Error upvoting report:", error)
    return NextResponse.json({ error: "Failed to upvote report" }, { status: 500 })
  }
}
