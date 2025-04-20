import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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
    const imageFiles = formData.getAll("images")

    // Prepare data for image processing API
    const apiFormData = new FormData()
    apiFormData.append("user_id", session.user.id)
    apiFormData.append("latitude", lat)
    apiFormData.append("longitude", lng)
    apiFormData.append("category", category)
    apiFormData.append("description", description)

    // Add images to form data
    for (const file of imageFiles) {
      if (file instanceof File) {
        apiFormData.append("photos", file)
      }
    }

    // Call the image processing API to check for duplicates
    const response = await fetch("http://your-image-processing-api-url/issues", {
      method: "POST",
      body: apiFormData,
    })

    const result = await response.json()

    // Check if a duplicate was found
    if (result.isDuplicate && result.duplicate_of) {
      // Fetch the original report details
      const originalReportResponse = await fetch(`/api/reports/${result.duplicate_of}`)
      const originalReport = await originalReportResponse.json()

      return NextResponse.json({
        isDuplicate: true,
        originalReport: originalReport,
        similarityScore: result.similarity_score,
        similarityDetails: result.similarity_details,
      })
    }

    // No duplicate found
    return NextResponse.json({
      isDuplicate: false,
    })
  } catch (error) {
    console.error("Error checking for duplicate report:", error)
    return NextResponse.json({ error: "Failed to check for duplicate report" }, { status: 500 })
  }
}
