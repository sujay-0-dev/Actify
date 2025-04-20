import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    // Get platform stats
    const stats = {
      totalUsers: await db.collection("users").countDocuments(),
      totalReports: await db.collection("reports").countDocuments(),
      totalSkills: await db.collection("skills").countDocuments(),
      totalProducts: await db.collection("products").countDocuments(),
      totalChallenges: await db.collection("eco_challenges").countDocuments(),
      verifiedReports: await db.collection("reports").countDocuments({ status: "verified" }),
      completedChallenges: await db.collection("challenge_participants").countDocuments({ status: "completed" }),
    }

    // Get featured eco challenges
    const featuredChallenges = await db
      .collection("eco_challenges")
      .find({ status: "active" })
      .sort({ participants: -1 })
      .limit(3)
      .toArray()
      .then((challenges) =>
        challenges.map((challenge) => ({
          id: challenge._id,
          title: challenge.title,
          description: challenge.description,
          category: challenge.category,
          deadline: challenge.deadline,
          points: challenge.points,
          participants: challenge.participants || 0,
          completions: challenge.completions || 0,
        })),
      )

    // Get recent public issues
    const recentReports = await db
      .collection("reports")
      .find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray()
      .then((reports) =>
        reports.map((report) => ({
          id: report._id,
          title: report.title,
          description: report.description,
          category: report.category,
          type: report.type,
          location: report.location,
          status: report.status,
          upvotes: report.upvotes?.length || 0,
          createdAt: report.createdAt,
        })),
      )

    // Get top contributors
    const topContributors = await db
      .collection("users")
      .find({})
      .sort({ "karma.total": -1 })
      .limit(4)
      .toArray()
      .then((users) =>
        users.map((user) => ({
          id: user._id,
          name: user.name,
          avatar: user.avatar || null,
          level: user.level || 1,
          karma: user.karma?.total || 0,
          topBadges: (user.badges || []).slice(0, 4).map((badge) => ({
            name: badge.name,
            icon: badge.icon,
            color: badge.color,
          })),
        })),
      )

    return NextResponse.json({
      stats,
      featuredChallenges,
      recentReports,
      topContributors,
    })
  } catch (error) {
    console.error("Error fetching home data:", error)
    return NextResponse.json({ error: "Failed to fetch home data" }, { status: 500 })
  }
}
