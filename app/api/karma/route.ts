import { type NextRequest, NextResponse } from "next/server"

/**
 * Proxy endpoint for Karma API
 * This allows us to hide the actual API URL and add authentication
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
  }

  try {
    const apiUrl = process.env.KARMA_API_URL || "http://localhost:8000"
    const response = await fetch(`${apiUrl}/api/v1/karma/${userId}`, {
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
    console.error("Error proxying to Karma API:", error)
    return NextResponse.json({ error: "Failed to fetch karma data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, actionType, context } = body

    if (!userId || !actionType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const apiUrl = process.env.KARMA_API_URL || "http://localhost:8000"
    const response = await fetch(`${apiUrl}/api/v1/karma/action`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KARMA_API_KEY || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, actionType, context }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying to Karma API:", error)
    return NextResponse.json({ error: "Failed to record karma action" }, { status: 500 })
  }
}
