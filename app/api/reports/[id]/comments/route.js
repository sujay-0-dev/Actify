import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request, { params }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const report = await db.collection("reports").findOne({ _id: new ObjectId(id) }, { projection: { comments: 1 } })

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json(report.comments || [])
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

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

    const { text } = await request.json()

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if report exists
    const report = await db.collection("reports").findOne({ _id: new ObjectId(id) })

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    const now = new Date()
    const formattedDate = now.toISOString().split("T")[0]
    const formattedTime = now.toTimeString().split(" ")[0].substring(0, 5)

    const comment = {
      _id: new ObjectId(),
      userId: session.user.id,
      userName: session.user.name,
      userAvatar: session.user.image || null,
      text: text.trim(),
      date: formattedDate,
      time: formattedTime,
      timestamp: now,
    }

    await db.collection("reports").updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { comments: comment },
        $set: { updatedAt: now },
      },
    )

    return NextResponse.json({
      success: true,
      comment,
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
