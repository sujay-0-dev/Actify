import { type NextRequest, NextResponse } from "next/server"

/**
 * Proxy endpoint for Karma Cash Rewards API
 */
export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.KARMA_API_URL || "http://localhost:8000"
    const response = await fetch(`${apiUrl}/api/v1/karma-cash/rewards`, {
      headers: {
        Authorization: `Bearer ${process.env.KARMA_API_KEY || ""}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying to Karma Cash Rewards API:", error)
    return NextResponse.json({ error: "Failed to fetch rewards data" }, { status: 500 })
  }
}
