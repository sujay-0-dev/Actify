import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request) {
  try {
    const { email, phone, otp, type } = await request.json()

    if (type === "email" && (!email || !otp)) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    if (type === "phone" && (!phone || !otp)) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Find the OTP record
    const query = type === "email" ? { email, type: "email" } : { phone, type: "phone" }
    const otpRecord = await db.collection("otps").findOne(query)

    if (!otpRecord) {
      return NextResponse.json({ error: "No OTP found. Please request a new one." }, { status: 400 })
    }

    // Check if OTP is expired
    if (new Date() > new Date(otpRecord.expiresAt)) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 })
    }

    // Check if OTP matches
    if (otpRecord.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 })
    }

    // Mark OTP as verified
    await db.collection("otps").updateOne({ _id: otpRecord._id }, { $set: { verified: true, verifiedAt: new Date() } })

    return NextResponse.json({
      success: true,
      message: `${type === "email" ? "Email" : "Phone"} verified successfully`,
    })
  } catch (error) {
    console.error(`Error verifying OTP:`, error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
