// In send-otp.js
if (type === "email") {
  // Check if email already exists
  const existingUser = await db.collection("users").findOne({ email })
  if (existingUser) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 })
  }

  // Store email OTP
  await db.collection("otps").updateOne({ email, type: "email" }, { $set: { ...otpData, email } }, { upsert: true })

  // Send OTP via email - in development, this might be a no-op
  const emailResult = await sendEmailOTP(email, otp)
  if (!emailResult.success) {
    return NextResponse.json({ error: emailResult.message }, { status: 500 })
  }
} else if (type === "phone") {
  // Similar changes for phone OTP...
  const existingUser = await db.collection("users").findOne({ phone })
  if (existingUser) {
    return NextResponse.json({ error: "Phone number already registered" }, { status: 400 })
  }

  // Store phone OTP
  await db.collection("otps").updateOne({ phone, type: "phone" }, { $set: { ...otpData, phone } }, { upsert: true })

  // Send OTP via SMS - in development, this might be a no-op
  const smsResult = await sendSMSOTP(phone, otp)
  if (!smsResult.success) {
    return NextResponse.json({ error: smsResult.message }, { status: 500 })
  }
}