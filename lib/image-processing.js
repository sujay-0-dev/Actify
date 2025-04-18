/**
 * Image processing utilities for public issue reporting
 * This module handles image feature extraction and similarity detection
 */

// Simple feature extraction function (placeholder for actual ML model)
export async function extractImageFeatures(imageBuffer) {
  // In a real implementation, this would use a pre-trained model like CLIP or ResNet
  // For this demo, we'll return a random feature vector

  // Create a random feature vector of length 512 (typical for embedding models)
  const featureVector = Array.from({ length: 512 }, () => Math.random())

  // Normalize the vector (important for cosine similarity)
  const magnitude = Math.sqrt(featureVector.reduce((sum, val) => sum + val * val, 0))
  const normalizedVector = featureVector.map((val) => val / magnitude)

  return normalizedVector
}

// Calculate cosine similarity between two vectors
export function calculateCosineSimilarity(vec1, vec2) {
  if (!vec1 || !vec2 || vec1.length !== vec2.length) {
    return 0
  }

  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0)
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0))
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0))

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }

  return dotProduct / (magnitude1 * magnitude2)
}

// Check if an image is similar to any in a collection
export async function checkImageSimilarity(imageVector, existingVectors, threshold = 0.85) {
  if (!existingVectors || existingVectors.length === 0) {
    return { isSimilar: false, similarityScore: 0, matchIndex: -1 }
  }

  let highestSimilarity = 0
  let matchIndex = -1

  for (let i = 0; i < existingVectors.length; i++) {
    const similarity = calculateCosineSimilarity(imageVector, existingVectors[i])
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity
      matchIndex = i
    }
  }

  return {
    isSimilar: highestSimilarity >= threshold,
    similarityScore: highestSimilarity,
    matchIndex: matchIndex,
  }
}

// Check if a report is a potential duplicate based on multiple factors
export async function checkDuplicateReport({
  imageVectors,
  category,
  type,
  coordinates,
  description,
  existingReports,
}) {
  if (!existingReports || existingReports.length === 0) {
    return { isDuplicate: false }
  }

  // Define weights for different similarity components
  const weights = {
    location: 0.3,
    category: 0.1,
    type: 0.2,
    image: 0.3,
    text: 0.1,
  }

  let bestMatch = null
  let highestScore = 0

  for (const report of existingReports) {
    // Skip resolved reports
    if (report.status === "resolved") {
      continue
    }

    // Calculate location similarity (inverse of distance)
    const MAX
    continue

    // Calculate location similarity (inverse of distance)
    const MAX_DISTANCE = 1000 // meters
    const distance = calculateDistance(coordinates.lat, coordinates.lng, report.coordinates.lat, report.coordinates.lng)
    const locationSimilarity = Math.max(0, 1 - distance / MAX_DISTANCE)

    // Category and type similarity (exact match = 1, no match = 0)
    const categorySimilarity = category === report.category ? 1 : 0
    const typeSimilarity = type === report.type ? 1 : 0

    // Image similarity (average of best matches)
    let imageSimilarity = 0
    if (imageVectors && imageVectors.length > 0 && report.images) {
      const reportImageVectors = report.images.filter((img) => img.imageVector).map((img) => img.imageVector)

      if (reportImageVectors.length > 0) {
        let totalSimilarity = 0
        for (const vector of imageVectors) {
          const { similarityScore } = await checkImageSimilarity(vector, reportImageVectors)
          totalSimilarity += similarityScore
        }
        imageSimilarity = totalSimilarity / imageVectors.length
      }
    }

    // Text similarity (simple for demo - in production use NLP)
    const textSimilarity = calculateTextSimilarity(description, report.description)

    // Calculate weighted score
    const score =
      weights.location * locationSimilarity +
      weights.category * categorySimilarity +
      weights.type * typeSimilarity +
      weights.image * imageSimilarity +
      weights.text * textSimilarity

    if (score > highestScore) {
      highestScore = score
      bestMatch = {
        reportId: report._id,
        score,
        components: {
          location: locationSimilarity,
          category: categorySimilarity,
          type: typeSimilarity,
          image: imageSimilarity,
          text: textSimilarity,
        },
      }
    }
  }

  // Threshold for considering a duplicate
  const DUPLICATE_THRESHOLD = 0.75

  return {
    isDuplicate: highestScore >= DUPLICATE_THRESHOLD,
    similarityScore: highestScore,
    match: bestMatch,
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula to calculate distance between two points on Earth
  const R = 6371e3 // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

// Simple text similarity function
function calculateTextSimilarity(text1, text2) {
  if (!text1 || !text2) return 0

  // Convert to lowercase and tokenize
  const tokens1 = text1
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2)
  const tokens2 = text2
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2)

  // Count matching tokens
  const set1 = new Set(tokens1)
  const set2 = new Set(tokens2)

  let matchCount = 0
  for (const token of set1) {
    if (set2.has(token)) {
      matchCount++
    }
  }

  // Jaccard similarity
  const unionSize = set1.size + set2.size - matchCount
  return unionSize > 0 ? matchCount / unionSize : 0
}
