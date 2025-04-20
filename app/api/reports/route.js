import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { extractImageFeatures, checkDuplicateReport } from "@/lib/image-processing"
import { put } from "@vercel/blob"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db()

    // Build query
    const query = {}
    if (category) query.category = category
    if (status) query.status = status

    // Get reports with pagination
    const reports = await db.collection("reports").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    // Get total count for pagination
    const total = await db.collection("reports").countDocuments(query)

    return NextResponse.json({
      reports,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const title = formData.get("title")
    const category = formData.get("category")
    const type = formData.get("type")
    const description = formData.get("description")
    const location = formData.get("location")
    const lat = Number.parseFloat(formData.get("lat"))
    const lng = Number.parseFloat(formData.get("lng"))

    // Validate required fields
    if (!title || !category || !type || !description || !location || !lat || !lng) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process images
    const imageFiles = formData.getAll("images")
    const images = []
    const imageVectors = []

    for (const file of imageFiles) {
      if (file instanceof File) {
        // Extract image features for similarity detection
        const buffer = await file.arrayBuffer()
        const imageVector = await extractImageFeatures(buffer)
        imageVectors.push(imageVector)

        // Upload image to Vercel Blob
        const blob = await put(`reports/${Date.now()}-${file.name}`, file, {
          access: "public",
        })

        // Store image data
        images.push({
          url: blob.url,
          imageVector,
        })
      }
    }

    const client = await clientPromise
    const db = client.db()

    // Check for duplicate reports
    const existingReports = await db
      .collection("reports")
      .find({
        category,
        status: { $ne: "resolved" },
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      })
      .toArray()

    const { isDuplicate, similarityScore, match } = await checkDuplicateReport({
      imageVectors,
      category,
      type,
      coordinates: { lat, lng },
      description,
      existingReports,
    })

    // If it's a duplicate, update the original report with an upvote instead
    if (isDuplicate && match) {
      // Add upvote to the original report
      await db.collection("reports").updateOne(
        { _id: match.reportId },
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
        success: false,
        isDuplicate: true,
        message: "A similar report already exists. Your report has been converted to an upvote.",
        originalReport: match.reportId,
        similarityScore,
        similarityDetails: match.components,
      })
    }

    // Create new report
    const now = new Date()
    const formattedDate = now.toISOString().split("T")[0]
    const formattedTime = now.toTimeString().split(" ")[0].substring(0, 5)

    const newReport = {
      userId: session.user.id,
      title,
      category,
      type,
      description,
      location,
      coordinates: { lat, lng },
      status: "reported",
      images,
      upvotes: [
        {
          userId: session.user.id,
          timestamp: now,
        },
      ],
      comments: [],
      updates: [
        {
          status: "reported",
          date: formattedDate,
          time: formattedTime,
          description: "Report submitted",
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("reports").insertOne(newReport)

    return NextResponse.json({
      success: true,
      reportId: result.insertedId,
      message: "Report submitted successfully",
    })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}
