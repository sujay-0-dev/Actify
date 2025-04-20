import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Only allow users to view their own profile
    if (id !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get user data
    const user = await db.collection("users").findOne({ _id: id })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user activity
    const activity = await db
      .collection("user_activity")
      .find({ userId: id })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray()

    // Format activity for display
    const formattedActivity = activity.map((item) => {
      let description = ""

      switch (item.type) {
        case "report_created":
          description = `Created a public issue report: "${item.title}"`
          break
        case "report_upvoted":
          description = `Upvoted a public issue report: "${item.title}"`
          break
        case "report_verified":
          description = `Your report "${item.title}" was verified by authorities`
          break
        case "skill_created":
          description = `Shared a new skill: "${item.title}"`
          break
        case "skill_enrolled":
          description = `Enrolled in a skill session: "${item.title}"`
          break
        case "product_listed":
          description = `Listed a new product: "${item.title}"`
          break
        case "product_sold":
          description = `Sold your product: "${item.title}"`
          break
        case "challenge_joined":
          description = `Joined an eco challenge: "${item.title}"`
          break
        case "challenge_completed":
          description = `Completed an eco challenge: "${item.title}"`
          break
        case "challenge_created":
          description = `Created a new eco challenge: "${item.title}"`
          break
        case "karma_earned":
          description = `Earned ${item.points} karma points for ${item.reason}`
          break
        default:
          description = item.description || "Performed an action"
      }

      return {
        ...item,
        description,
      }
    })

    // Get user stats
    const stats = {
      reports: {
        total: await db.collection("reports").countDocuments({ "creator.id": id }),
        verified: await db.collection("reports").countDocuments({ "creator.id": id, status: "verified" }),
        upvotes: await db
          .collection("reports")
          .aggregate([
            { $match: { "creator.id": id } },
            { $group: { _id: null, total: { $sum: { $size: { $ifNull: ["$upvotes", []] } } } } },
          ])
          .toArray()
          .then((result) => result[0]?.total || 0),
      },
      skills: {
        total: await db.collection("skills").countDocuments({ "provider.id": id }),
        participants: await db.collection("skill_participants").countDocuments({ skillProviderId: id }),
        rating: await db
          .collection("skills")
          .aggregate([{ $match: { "provider.id": id } }, { $group: { _id: null, avg: { $avg: "$rating" } } }])
          .toArray()
          .then((result) => result[0]?.avg || 0),
      },
      products: {
        total: await db.collection("products").countDocuments({ "seller.id": id }),
        sold: await db.collection("products").countDocuments({ "seller.id": id, status: "sold" }),
        active: await db.collection("products").countDocuments({ "seller.id": id, status: "active" }),
      },
      challenges: {
        created: await db.collection("eco_challenges").countDocuments({ "creator.id": id }),
        participated: await db.collection("challenge_participants").countDocuments({ userId: id }),
        completed: await db.collection("challenge_participants").countDocuments({ userId: id, status: "completed" }),
      },
    }

    // Prepare profile data
    const profileData = {
      userId: user._id,
      username: user.username || user.name.toLowerCase().replace(/\s+/g, "_"),
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar || "/placeholder.svg?height=200&width=200",
      profile: user.profile || {},
      karma: user.karma || { total: 0, civic: 0, skill: 0, community: 0, eco: 0 },
      level: user.level || 1,
      badges: user.badges || [],
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      activity: formattedActivity,
      recentActivity: formattedActivity.slice(0, 10),
      stats,
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}
