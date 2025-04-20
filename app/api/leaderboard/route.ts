import { type NextRequest, NextResponse } from "next/server"

/**
 * Proxy endpoint for Leaderboard API
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get("category") || "overall"
  const limit = searchParams.get("limit") || "10"

  try {
    const apiUrl = process.env.KARMA_API_URL || "http://localhost:8000"
    const response = await fetch(`${apiUrl}/api/v1/leaderboard?category=${category}&limit=${limit}`, {
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
    console.error("Error proxying to Leaderboard API:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard data" }, { status: 500 })
  }
}
