import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { put } from "@vercel/blob"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const sellerId = searchParams.get("sellerId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db()

    // Build query
    const query = {}
    if (category) query.category = category
    if (status) query.status = status
    if (sellerId) query["seller.id"] = sellerId

    // Get products with pagination
    const products = await db
      .collection("products")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count for pagination
    const total = await db.collection("products").countDocuments(query)

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
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
    const price = formData.get("price")
    const description = formData.get("description")
    const condition = formData.get("condition")
    const location = formData.get("location")
    const tags = formData.get("tags")
    const status = formData.get("status") || "active"

    // Validate required fields
    if (!title || !category || !price || !description || !condition || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process images
    const imageFiles = formData.getAll("images")
    const images = []

    for (const file of imageFiles) {
      if (file instanceof File) {
        // Upload image to Vercel Blob
        const blob = await put(`products/${Date.now()}-${file.name}`, file, {
          access: "public",
        })

        // Store image data
        images.push({
          url: blob.url,
          name: file.name,
        })
      }
    }

    if (images.length === 0 && status === "active") {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get user info
    const user = await db.collection("users").findOne({ _id: session.user.id })

    // Create product object
    const product = {
      title,
      category,
      price: Number.parseFloat(price),
      description,
      condition,
      location,
      tags: tags
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [],
      images,
      seller: {
        id: session.user.id,
        name: session.user.name,
        avatar: session.user.image || "/placeholder.svg?height=80&width=80",
        level: user?.level || 1,
        rating: user?.rating || 0,
        reviews: user?.reviews || 0,
        verified: user?.verified || false,
      },
      status,
      views: 0,
      favorites: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert product
    const result = await db.collection("products").insertOne(product)

    // Update user karma if product is published (not draft)
    if (status === "active") {
      await db.collection("users").updateOne(
        { _id: session.user.id },
        {
          $inc: { "karma.community": 10 },
          $push: {
            activity: {
              type: "product_listed",
              productId: result.insertedId,
              title: title,
              timestamp: new Date(),
            },
          },
        },
      )
    }

    return NextResponse.json({
      success: true,
      productId: result.insertedId,
      message: status === "active" ? "Product listed successfully" : "Product draft saved",
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
