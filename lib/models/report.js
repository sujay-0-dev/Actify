import mongoose from "mongoose"

// Define the schema if it doesn't exist
const ReportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["reported", "verified", "in-progress", "resolved"],
    default: "reported",
  },
  images: [
    {
      url: String,
      imageVector: [Number], // Store image feature vector for similarity detection
    },
  ],
  upvotes: [
    {
      userId: String,
      timestamp: Date,
    },
  ],
  comments: [
    {
      userId: String,
      userName: String,
      userAvatar: String,
      text: String,
      date: String,
      time: String,
      timestamp: Date,
    },
  ],
  updates: [
    {
      status: String,
      date: String,
      time: String,
      description: String,
      timestamp: Date,
    },
  ],
  potentialDuplicateOf: {
    type: String,
    default: null,
  },
  similarityScore: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Add geospatial index for location-based queries
ReportSchema.index({ coordinates: "2dsphere" })

// Add text index for text search
ReportSchema.index({ title: "text", description: "text" })

export default mongoose.models.Report || mongoose.model("Report", ReportSchema)
