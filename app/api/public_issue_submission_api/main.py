from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends, Query
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Tuple
from pydantic import BaseModel, Field
import pymongo
import uuid
import os
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import io
import numpy as np
import faiss
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from geopy.distance import geodesic
import re
from fastapi_utils.tasks import repeat_every
from contextlib import asynccontextmanager

# For potential CLIP model loading issues
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Startup tasks here")
    # db.connect()
    yield
    print("🛑 Shutdown tasks here")
    # db.disconnect()

# Initialize FastAPI app
app = FastAPI(title="Public Issue Reporting API", 
              description="API for reporting public issues with advanced duplicate detection")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with actual frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class Location(BaseModel):
    latitude: float
    longitude: float

class IssueCreate(BaseModel):
    user_id: str
    location: Location
    category: str
    description: str
    severity: Optional[str] = "Medium"
    
class IssueResponse(BaseModel):
    issue_id: str
    created_at: str
    status: str
    duplicate_of: Optional[str] = None
    similarity_score: Optional[float] = None
    duplicate_details: Optional[dict] = None

class Issue(IssueCreate):
    issue_id: str
    created_at: datetime
    status: str = "Reported"
    photo_urls: List[str]
    duplicate_of: Optional[str] = None
    
# Database setup
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["public_issues_db"]
issues_collection = db["issues"]
vector_collection = db["image_vectors"]

# Create indexes
issues_collection.create_index([("location", pymongo.GEOSPHERE)])
issues_collection.create_index("category")
issues_collection.create_index("status")
issues_collection.create_index("created_at")  # Added for time-based filtering

# Create fallback text model
def create_fallback_text_model():
    """Create a simple fallback text model for when online models can't be loaded"""
    class SimpleTextEncoder:
        def __init__(self):
            self.vocab = {}
            self.vector_size = 100
            
        def encode(self, text):
            # Simple bag of words with hashing trick
            if not text:
                return np.zeros(self.vector_size)
                
            # Clean text
            text = text.lower()
            words = re.findall(r'\w+', text)
            
            # Simple feature hashing
            vec = np.zeros(self.vector_size)
            for word in words:
                # Hash the word to a position
                idx = hash(word) % self.vector_size
                vec[idx] += 1
                
            # Normalize the vector
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
                
            return vec
    
    return SimpleTextEncoder()

# Load text model (with fallback)
try:
    print("Loading text embedding model...")
    # You can use sentence_transformers if available, or implement a fallback here
    text_model = create_fallback_text_model()
    print("Text model loaded successfully")
except Exception as e:
    print(f"Failed to load text model: {e}")
    print("Using fallback text encoding model")
    text_model = create_fallback_text_model()

# Load CLIP model for image embeddings
try:
    print("Loading CLIP model...")
    clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32", use_fast=True)
    clip_loaded = True
    print("CLIP model loaded successfully")
except Exception as e:
    print(f"Failed to load CLIP model: {e}")
    clip_loaded = False

# Initialize FAISS index
dimension = 512  # CLIP embedding size
image_index = faiss.IndexFlatL2(dimension)

# Google Drive setup
def get_gdrive_service():
    SCOPES = ['https://www.googleapis.com/auth/drive']
    SERVICE_ACCOUNT_FILE = 'service_account.json'  # Path to your service account key
    
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    service = build('drive', 'v3', credentials=credentials)
    return service

# Authentication dependency
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Replace with proper JWT validation in production
    return {"user_id": token}

# Helper functions
def extract_image_features(image_bytes):
    """Extract feature vector from image using CLIP model"""
    if not clip_loaded:
        # Return zeros if CLIP model isn't loaded
        return np.zeros(dimension, dtype=np.float32)
    
    try:
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Process image with CLIP
        inputs = processor(images=image, return_tensors="pt")
        
        # Get embeddings without gradient calculation
        with torch.no_grad():
            embedding = clip_model.get_image_features(**inputs).squeeze().numpy()
            
        # Normalize embedding
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
            
        return embedding.astype(np.float32)
    except Exception as e:
        print(f"Error in image feature extraction: {str(e)}")
        return np.zeros(dimension, dtype=np.float32)

def upload_to_gdrive(file_bytes, filename):
    """Upload file to Google Drive and return shareable link"""
    try:
        service = get_gdrive_service()
        
        # Define folder ID where to upload images (create this folder in your Drive)
        folder_id = 'your_folder_id_here'
        
        file_metadata = {
            'name': filename,
            'parents': [folder_id]
        }
        
        media = MediaIoBaseUpload(io.BytesIO(file_bytes), mimetype='image/jpeg', resumable=True)
        
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id,webViewLink'
        ).execute()
        
        # Make the file publicly viewable
        service.permissions().create(
            fileId=file['id'],
            body={'type': 'anyone', 'role': 'reader'}
        ).execute()
        
        return file['webViewLink']
    
    except Exception as e:
        print(f"Error uploading to Google Drive: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upload image")

def calculate_cosine_similarity(vec1, vec2):
    """Calculate cosine similarity between two vectors"""
    if np.linalg.norm(vec1) * np.linalg.norm(vec2) > 0:
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
    return 0.0

def check_duplicate_issue(location, category, description, image_vectors, current_time):
    """Enhanced check if a similar issue already exists"""
    # Step 1: Pre-filter by location, category and time
    
    # Define parameters for filtering
    max_distance = 100  # meters
    time_window = timedelta(days=30)  # Only look at issues from the past month
    min_time = current_time - time_window
    
    # Prefilter query
    prefilter_query = {
        "category": category,
        "status": {"$ne": "Resolved"},  # Only look at unresolved issues
        "created_at": {"$gte": min_time}  # Time-based filter
    }
    
    # Get candidate issues
    candidate_issues_cursor = issues_collection.find(prefilter_query)
    
    # Create lists to store issues and their similarity scores
    nearby_issues = []
    
    for issue in candidate_issues_cursor:
        # Calculate geographic distance
        issue_loc = (issue['location']['latitude'], issue['location']['longitude'])
        new_loc = (location.latitude, location.longitude)
        distance = geodesic(issue_loc, new_loc).meters
        
        # Only include issues within the distance threshold
        if distance <= max_distance:
            issue['geo_distance'] = distance  # Store distance for scoring
            nearby_issues.append(issue)
    
    if not nearby_issues:
        return None, 0.0, {}
    
    # Step 2: Calculate similarities for each dimension and combined score
    
    # Prepare description embedding
    desc_embedding = text_model.encode(description)
    
    best_match = None
    highest_score = 0.0
    score_details = {}
    
    for issue in nearby_issues:
        # Initialize similarity components
        similarity_components = {
            "location": 0.0,
            "text": 0.0,
            "image": 0.0,
            "time": 0.0
        }
        
        # Location similarity (inverse of distance, normalized)
        max_possible_distance = max_distance
        similarity_components["location"] = 1.0 - (issue['geo_distance'] / max_possible_distance)
        
        # Text similarity (cosine similarity of embeddings)
        stored_embedding = text_model.encode(issue['description'])
        similarity_components["text"] = calculate_cosine_similarity(desc_embedding, stored_embedding)
        
        # Time similarity (more recent issues get higher similarity)
        time_diff = current_time - issue['created_at']
        similarity_components["time"] = 1.0 - (time_diff.total_seconds() / time_window.total_seconds())
        
        # Image similarity
        if image_vectors and 'image_vectors' in issue:
            image_similarities = []
            
            for new_vec in image_vectors:
                best_image_sim = 0
                for stored_vec in issue['image_vectors']:
                    # Calculate cosine similarity for image vectors
                    sim_score = calculate_cosine_similarity(new_vec, np.array(stored_vec))
                    best_image_sim = max(best_image_sim, sim_score)
                    
                image_similarities.append(best_image_sim)
            
            # Average of best image similarities
            if image_similarities:
                similarity_components["image"] = sum(image_similarities) / len(image_similarities)
        
        # Calculate weighted combined score
        weights = {
            "location": 0.3,  # Location is important for spatial issues
            "text": 0.3,      # Description content is equally important
            "image": 0.3,     # Image similarity is equally important
            "time": 0.1       # Time is less important but still considered
        }
        
        combined_score = sum(component * weights[key] for key, component in similarity_components.items())
        
        if combined_score > highest_score:
            highest_score = combined_score
            best_match = issue
            score_details = {
                "overall_score": combined_score,
                "components": similarity_components,
                "weights": weights
            }
    
    # Return the best match and detailed scores
    return best_match, highest_score, score_details

# Routes
@app.post("/issues/", response_model=IssueResponse)
async def create_issue(
    user_id: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    severity: Optional[str] = Form("Medium"),
    photos: List[UploadFile] = File(..., max_items=3)
):
    """
    Create a new issue report with enhanced duplicate detection
    """
    # Validate input
    if len(photos) < 1 or len(photos) > 3:
        raise HTTPException(status_code=400, detail="Please provide 1-3 photos")
    
    # Process location
    location = Location(latitude=latitude, longitude=longitude)
    current_time = datetime.now()
    
    # Process photos
    photo_urls = []
    image_vectors = []
    
    for i, photo in enumerate(photos):
        # Read file
        file_content = await photo.read()
        
        # Extract image features for similarity detection
        try:
            feature_vector = extract_image_features(file_content)
            image_vectors.append(feature_vector.tolist())
        except Exception as e:
            print(f"Error extracting features: {str(e)}")
            # Continue even if feature extraction fails
        
        # Upload to Google Drive
        filename = f"{uuid.uuid4()}_{photo.filename}"
        photo_url = upload_to_gdrive(file_content, filename)
        photo_urls.append(photo_url)
    
    # Check for duplicate issues with enhanced logic
    duplicate_issue, similarity_score, score_details = check_duplicate_issue(
        location, category, description, image_vectors, current_time
    )
    
    # Thresholds for duplicate detection
    EXACT_DUPLICATE_THRESHOLD = 0.90
    SIMILAR_ISSUE_THRESHOLD = 0.75
    
    if duplicate_issue and similarity_score >= EXACT_DUPLICATE_THRESHOLD:
        # This is a highly probable duplicate - return without creating a new issue
        return IssueResponse(
            issue_id="duplicate_detected",
            created_at=current_time.isoformat(),
            status="Duplicate",
            duplicate_of=duplicate_issue['issue_id'],
            similarity_score=similarity_score,
            duplicate_details={
                "original_issue": {
                    "issue_id": duplicate_issue['issue_id'],
                    "category": duplicate_issue['category'],
                    "description": duplicate_issue['description'],
                    "status": duplicate_issue['status'],
                    "created_at": duplicate_issue['created_at'].isoformat(),
                    "photo_urls": duplicate_issue.get('photo_urls', [])
                },
                "similarity_score": similarity_score,
                "score_details": score_details
            }
        )
    
    # Create new issue
    issue_id = str(uuid.uuid4())
    
    new_issue = {
        "issue_id": issue_id,
        "user_id": user_id,
        "location": location.dict(),
        "category": category,
        "description": description,
        "severity": severity,
        "created_at": current_time,
        "status": "Reported",
        "photo_urls": photo_urls,
        "image_vectors": image_vectors,
        "upvotes": []  # Initialize empty upvotes list
    }
    
    # If potential duplicate, mark it but still create the issue
    if duplicate_issue and similarity_score >= SIMILAR_ISSUE_THRESHOLD:
        new_issue["potential_duplicate_of"] = duplicate_issue['issue_id']
        new_issue["similarity_score"] = similarity_score
        new_issue["similarity_details"] = score_details
    
    # Save to database
    issues_collection.insert_one(new_issue)
    
    response_data = IssueResponse(
        issue_id=issue_id,
        created_at=new_issue['created_at'].isoformat(),
        status=new_issue['status'],
        similarity_score=similarity_score if similarity_score >= SIMILAR_ISSUE_THRESHOLD else None
    )
    
    # If there's a potential duplicate, include the details
    if duplicate_issue and similarity_score >= SIMILAR_ISSUE_THRESHOLD:
        response_data.duplicate_of = duplicate_issue['issue_id']
        response_data.duplicate_details = {
            "original_issue": {
                "issue_id": duplicate_issue['issue_id'],
                "category": duplicate_issue['category'],
                "description": duplicate_issue['description'],
                "status": duplicate_issue['status'],
                "created_at": duplicate_issue['created_at'].isoformat(),
                "photo_urls": duplicate_issue.get('photo_urls', [])
            },
            "similarity_score": similarity_score,
            "score_details": score_details
        }
    
    return response_data

@app.get("/issues/", response_model=List[dict])
async def get_issues(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    duplicate_status: Optional[bool] = Query(None),
    skip: int = 0,
    limit: int = 20
):
    """
    Get a list of issues with optional filtering
    """
    query = {}
    
    if status:
        query["status"] = status
    
    if category:
        query["category"] = category
    
    # Filter by duplicate status if requested
    if duplicate_status is not None:
        if duplicate_status:
            # Show only duplicate issues
            query["potential_duplicate_of"] = {"$exists": True}
        else:
            # Show only non-duplicate issues
            query["potential_duplicate_of"] = {"$exists": False}
    
    issues = issues_collection.find(query).sort("created_at", pymongo.DESCENDING).skip(skip).limit(limit)
    result = []
    
    for issue in issues:
        issue['_id'] = str(issue['_id'])  # Convert ObjectId to string
        issue['created_at'] = issue['created_at'].isoformat()
        
        # Add upvote count
        issue['upvote_count'] = len(issue.get('upvotes', []))
        
        result.append(issue)
    
    return result

@app.get("/issues/{issue_id}", response_model=dict)
async def get_issue(issue_id: str):
    """
    Get a specific issue by ID
    """
    issue = issues_collection.find_one({"issue_id": issue_id})
    
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    issue['_id'] = str(issue['_id'])
    issue['created_at'] = issue['created_at'].isoformat()
    
    # Add upvote count
    issue['upvote_count'] = len(issue.get('upvotes', []))
    
    # If this is a duplicate, fetch the original issue
    if 'potential_duplicate_of' in issue:
        original_issue = issues_collection.find_one({"issue_id": issue['potential_duplicate_of']})
        if original_issue:
            original_issue['_id'] = str(original_issue['_id'])
            original_issue['created_at'] = original_issue['created_at'].isoformat()
            issue['original_issue'] = original_issue
    
    return issue

@app.put("/issues/{issue_id}/status", response_model=dict)
async def update_issue_status(
    issue_id: str,
    status: str = Form(...),
    mark_duplicates: Optional[bool] = Form(False)
):
    """
    Update the status of an issue and optionally its duplicates
    """
    valid_statuses = ["Reported", "Under Review", "In Progress", "Resolved"]
    
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {valid_statuses}")
    
    # Update the main issue
    result = issues_collection.update_one(
        {"issue_id": issue_id},
        {"$set": {"status": status, "updated_at": datetime.now()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    # If requested and the status is "Resolved", also update all issues that are duplicates of this one
    if mark_duplicates and status == "Resolved":
        issues_collection.update_many(
            {"potential_duplicate_of": issue_id},
            {"$set": {"status": "Resolved", "updated_at": datetime.now()}}
        )
    
    updated_issue = issues_collection.find_one({"issue_id": issue_id})
    updated_issue['_id'] = str(updated_issue['_id'])
    updated_issue['created_at'] = updated_issue['created_at'].isoformat()
    
    return updated_issue

@app.post("/issues/{issue_id}/upvote")
async def upvote_issue(issue_id: str, user_id: str = Form(...)):
    """
    Upvote an issue to indicate it affects more people
    """
    # Make sure the issue exists
    issue = issues_collection.find_one({"issue_id": issue_id})
    
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    # Add user to upvotes if not already there
    result = issues_collection.update_one(
        {"issue_id": issue_id, "upvotes.user_id": {"$ne": user_id}},
        {"$push": {"upvotes": {"user_id": user_id, "timestamp": datetime.now()}}}
    )
    
    if result.modified_count == 0:
        # User already upvoted or issue not found
        existing_upvote = issues_collection.find_one(
            {"issue_id": issue_id, "upvotes.user_id": user_id}
        )
        
        if existing_upvote:
            raise HTTPException(status_code=400, detail="User has already upvoted this issue")
    
    # Get updated upvote count
    updated_issue = issues_collection.find_one({"issue_id": issue_id})
    upvote_count = len(updated_issue.get('upvotes', []))
    
    # If this is a duplicate, also increment the upvote counter on the original issue
    # This helps promote the visibility of issues that have many duplicates
    if 'potential_duplicate_of' in updated_issue:
        original_id = updated_issue['potential_duplicate_of']
        # Log the duplicate upvote but don't count it as a user upvote on the original
        issues_collection.update_one(
            {"issue_id": original_id},
            {"$push": {"duplicate_upvotes": {"from_issue": issue_id, "user_id": user_id, "timestamp": datetime.now()}}}
        )
    
    return {
        "issue_id": issue_id, 
        "upvote_count": upvote_count,
        "message": "Upvote recorded successfully"
    }

@app.get("/issues/{issue_id}/duplicates")
async def get_issue_duplicates(issue_id: str, skip: int = 0, limit: int = 10):
    """
    Get all issues that have been marked as duplicates of the specified issue
    """
    # Make sure the issue exists
    issue = issues_collection.find_one({"issue_id": issue_id})
    
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    # Find all duplicates
    duplicates = issues_collection.find(
        {"potential_duplicate_of": issue_id}
    ).sort("created_at", pymongo.DESCENDING).skip(skip).limit(limit)
    
    result = []
    for duplicate in duplicates:
        duplicate['_id'] = str(duplicate['_id'])
        duplicate['created_at'] = duplicate['created_at'].isoformat()
        duplicate['upvote_count'] = len(duplicate.get('upvotes', []))
        result.append(duplicate)
    
    return {
        "issue_id": issue_id,
        "duplicate_count": issues_collection.count_documents({"potential_duplicate_of": issue_id}),
        "duplicates": result
    }

@app.post("/admin/merge-duplicates/{target_issue_id}/{source_issue_id}")
async def merge_duplicate_issues(
    target_issue_id: str, 
    source_issue_id: str
):
    """
    Administrative endpoint to merge two issues, transferring all upvotes and marking as duplicate
    """
    # Verify both issues exist
    target_issue = issues_collection.find_one({"issue_id": target_issue_id})
    source_issue = issues_collection.find_one({"issue_id": source_issue_id})
    
    if not target_issue or not source_issue:
        raise HTTPException(status_code=404, detail="One or both issues not found")
    
    # Transfer upvotes from source to target
    # First get all upvotes from source that aren't already in target
    source_upvotes = source_issue.get('upvotes', [])
    target_upvotes = target_issue.get('upvotes', [])
    
    # Get user_ids already in target
    target_user_ids = {upvote['user_id'] for upvote in target_upvotes}
    
    # Filter source upvotes to only include new ones
    new_upvotes = [upvote for upvote in source_upvotes if upvote['user_id'] not in target_user_ids]
    
    # Add the new upvotes to target
    if new_upvotes:
        issues_collection.update_one(
            {"issue_id": target_issue_id},
            {"$push": {"upvotes": {"$each": new_upvotes}}}
        )
    
    # Mark source as duplicate of target
    issues_collection.update_one(
        {"issue_id": source_issue_id},
        {"$set": {
            "status": "Duplicate",
            "potential_duplicate_of": target_issue_id,
            "similarity_score": 1.0,  # Perfect match as it's manually merged
            "manually_merged": True,
            "merged_at": datetime.now()
        }}
    )
    
    # If the source issue had any duplicates pointing to it, update them to point to the target
    issues_collection.update_many(
        {"potential_duplicate_of": source_issue_id},
        {"$set": {"potential_duplicate_of": target_issue_id}}
    )
    
    return {
        "message": "Issues successfully merged",
        "target_issue_id": target_issue_id,
        "source_issue_id": source_issue_id,
        "transferred_upvotes": len(new_upvotes)
    }

# Add a specific endpoint for testing similar images
@app.post("/test/similar-images")
async def test_similar_images(
    image: UploadFile = File(...),
    top_k: int = Query(5, ge=1, le=20)
):
    """
    Test endpoint to find similar images in the database
    """
    # Read query image
    image_content = await image.read()
    
    # Extract features
    query_vector = extract_image_features(image_content)
    
    # Get all image vectors from database
    all_issues = issues_collection.find({"image_vectors": {"$exists": True}})
    
    results = []
    for issue in all_issues:
        for i, vec in enumerate(issue.get("image_vectors", [])):
            # Calculate similarity with query image
            similarity = calculate_cosine_similarity(query_vector, np.array(vec))
            
            results.append({
                "issue_id": issue["issue_id"],
                "image_index": i,
                "similarity": float(similarity),
                "photo_url": issue["photo_urls"][i] if i < len(issue.get("photo_urls", [])) else None,
                "category": issue["category"],
                "status": issue["status"]
            })
    
    # Sort by similarity (highest first)
    results.sort(key=lambda x: x["similarity"], reverse=True)
    
    # Return top-k results
    return {"results": results[:top_k]}

@app.get("/statistics/duplicates")
async def get_duplicate_statistics():
    """
    Get statistics about duplicate issues in the system
    """
    # Count total issues
    total_issues = issues_collection.count_documents({})
    
    # Count duplicates
    duplicate_issues = issues_collection.count_documents({"potential_duplicate_of": {"$exists": True}})
    
    # Get issues with the most duplicates
    pipeline = [
        {"$match": {"potential_duplicate_of": {"$exists": True}}},
        {"$group": {"_id": "$potential_duplicate_of", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    
    most_duplicated = list(issues_collection.aggregate(pipeline))
    
    # Enrich with issue details
    for item in most_duplicated:
        original = issues_collection.find_one({"issue_id": item["_id"]})
        if original:
            item["category"] = original["category"]
            item["description"] = original["description"]
            item["status"] = original["status"]
            item["created_at"] = original["created_at"].isoformat()
    
    return {
        "total_issues": total_issues,
        "duplicate_issues": duplicate_issues,
        "duplicate_percentage": round((duplicate_issues / total_issues) * 100, 2) if total_issues > 0 else 0,
        "most_duplicated_issues": most_duplicated
    }
    
    
    
    
@app.post("/issues/{issue_id}/duplicate-feedback")
async def submit_duplicate_feedback(
    issue_id: str,
    feedback_type: str = Form(...),  # "confirm" or "dispute"
    user_id: str = Form(...),
    comment: Optional[str] = Form(None)
):
    """
    Allow users to confirm or dispute a duplicate classification
    """
    # Validate input
    if feedback_type not in ["confirm", "dispute"]:
        raise HTTPException(status_code=400, detail="Feedback type must be either 'confirm' or 'dispute'")
    
    # Fetch the issue
    issue = issues_collection.find_one({"issue_id": issue_id})
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    # Verify that it's actually marked as a duplicate
    if "potential_duplicate_of" not in issue:
        raise HTTPException(status_code=400, detail="This issue is not marked as a duplicate")
    
    # Store the feedback
    feedback = {
        "user_id": user_id,
        "feedback_type": feedback_type,
        "comment": comment,
        "timestamp": datetime.now()
    }
    
    # Update the issue with the feedback
    issues_collection.update_one(
        {"issue_id": issue_id},
        {
            "$push": {"duplicate_feedback": feedback},
            "$set": {"last_feedback_at": datetime.now()}
        }
    )
    
    # Track confirmation and dispute counts
    if feedback_type == "confirm":
        issues_collection.update_one(
            {"issue_id": issue_id},
            {"$inc": {"confirmation_count": 1}}
        )
    else:  # dispute
        issues_collection.update_one(
            {"issue_id": issue_id},
            {"$inc": {"dispute_count": 1}}
        )
    
    # Check if the threshold for automatic reclassification is met
    issue = issues_collection.find_one({"issue_id": issue_id})
    dispute_count = issue.get("dispute_count", 0)
    confirmation_count = issue.get("confirmation_count", 0)
    
    # If there are significantly more disputes than confirmations, reclassify
    if dispute_count >= 3 and dispute_count > confirmation_count * 2:
        # Remove duplicate classification
        issues_collection.update_one(
            {"issue_id": issue_id},
            {
                "$unset": {
                    "potential_duplicate_of": "",
                    "similarity_score": "",
                    "similarity_details": ""
                },
                "$set": {
                    "status": "Reported",
                    "was_reclassified": True,
                    "reclassified_at": datetime.now(),
                    "reclassification_reason": "User feedback indicated this is not a duplicate"
                }
            }
        )
        return {
            "message": "Feedback recorded. Issue has been reclassified as a unique report based on user feedback.",
            "issue_id": issue_id,
            "current_status": "Reported",
            "is_duplicate": False
        }
    
    # If highly confirmed, mark for deletion after 10 days
    if confirmation_count >= 3 and confirmation_count > dispute_count * 2:
        deletion_date = datetime.now() + timedelta(days=10)
        issues_collection.update_one(
            {"issue_id": issue_id},
            {
                "$set": {
                    "scheduled_for_deletion": True,
                    "deletion_date": deletion_date,
                    "deletion_reason": "Confirmed duplicate"
                }
            }
        )
        return {
            "message": "Feedback recorded. This confirmed duplicate will be removed after 10 days.",
            "issue_id": issue_id,
            "current_status": "Duplicate",
            "is_duplicate": True,
            "scheduled_for_deletion": True,
            "deletion_date": deletion_date.isoformat()
        }
    
    return {
        "message": "Feedback recorded successfully",
        "issue_id": issue_id,
        "confirmation_count": confirmation_count,
        "dispute_count": dispute_count
    }

# 2. Get duplicate feedback status
@app.get("/issues/{issue_id}/duplicate-feedback")
async def get_duplicate_feedback(issue_id: str):
    """
    Get the current feedback status for a duplicate issue
    """
    issue = issues_collection.find_one({"issue_id": issue_id})
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    feedback = issue.get("duplicate_feedback", [])
    confirmation_count = issue.get("confirmation_count", 0)
    dispute_count = issue.get("dispute_count", 0)
    
    # Check if scheduled for deletion
    deletion_info = None
    if issue.get("scheduled_for_deletion"):
        deletion_info = {
            "scheduled_for_deletion": True,
            "deletion_date": issue["deletion_date"].isoformat(),
            "deletion_reason": issue.get("deletion_reason", "Confirmed duplicate")
        }
    
    return {
        "issue_id": issue_id,
        "is_duplicate": "potential_duplicate_of" in issue,
        "duplicate_of": issue.get("potential_duplicate_of"),
        "confirmation_count": confirmation_count,
        "dispute_count": dispute_count,
        "feedback_summary": {
            "total": len(feedback),
            "confirmations": confirmation_count,
            "disputes": dispute_count,
            "last_feedback_at": issue.get("last_feedback_at", None)
        },
        "deletion_info": deletion_info
    }

# 3. Cancel scheduled deletion (for admins)
@app.post("/admin/issues/{issue_id}/cancel-deletion")
async def cancel_scheduled_deletion(issue_id: str):
    """
    Administrative endpoint to cancel a scheduled deletion
    """
    issue = issues_collection.find_one({"issue_id": issue_id})
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    if not issue.get("scheduled_for_deletion"):
        raise HTTPException(status_code=400, detail="This issue is not scheduled for deletion")
    
    issues_collection.update_one(
        {"issue_id": issue_id},
        {
            "$unset": {
                "scheduled_for_deletion": "",
                "deletion_date": "",
                "deletion_reason": ""
            }
        }
    )
    
    return {
        "message": "Scheduled deletion has been canceled",
        "issue_id": issue_id
    }

# 4. Background task to run daily and delete confirmed duplicates after 10 days
@app.on_event("startup")
@repeat_every(seconds=60*60*24)  # Run daily
async def delete_confirmed_duplicates():
    """
    Background task to delete confirmed duplicate issues that have passed their deletion date
    """
    # Find issues scheduled for deletion with a deletion date in the past
    current_time = datetime.now()
    query = {
        "scheduled_for_deletion": True,
        "deletion_date": {"$lt": current_time}
    }
    
    # Get issues to delete
    issues_to_delete = issues_collection.find(query)
    deleted_count = 0
    archived_count = 0
    
    for issue in issues_to_delete:
        try:
            # Archive essential metadata before deletion
            archived_data = {
                "original_issue_id": issue["issue_id"],
                "duplicate_of": issue.get("potential_duplicate_of"),
                "category": issue["category"],
                "location": issue["location"],
                "created_at": issue["created_at"],
                "deletion_date": current_time,
                "upvote_count": len(issue.get("upvotes", [])),
                "confirmation_count": issue.get("confirmation_count", 0),
                "dispute_count": issue.get("dispute_count", 0)
            }
            
            # Insert into archives collection
            db["archived_duplicates"].insert_one(archived_data)
            archived_count += 1
            
            # Delete the original issue
            issues_collection.delete_one({"issue_id": issue["issue_id"]})
            deleted_count += 1
            
            # Log deletion
            print(f"Deleted confirmed duplicate issue: {issue['issue_id']}")
            
        except Exception as e:
            print(f"Error deleting issue {issue['issue_id']}: {str(e)}")
    
    print(f"Deleted {deleted_count} confirmed duplicates. Archived {archived_count} records.")
    return {"deleted_count": deleted_count, "archived_count": archived_count}

# 5. Manual trigger for duplicate deletion job (for testing/admin)
@app.post("/admin/trigger-duplicate-deletion")
async def trigger_duplicate_deletion():
    """
    Manually trigger the duplicate deletion job
    """
    result = await delete_confirmed_duplicates()
    return {
        "message": "Duplicate deletion job completed",
        "result": result
    }

# 6. Endpoint to get deletion statistics
@app.get("/admin/deletion-statistics")
async def get_deletion_statistics():
    """
    Get statistics about deleted duplicates
    """
    # Count archived duplicates
    total_archived = db["archived_duplicates"].count_documents({})
    
    # Count by category
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    by_category = list(db["archived_duplicates"].aggregate(pipeline))
    
    # Count by month
    pipeline = [
        {"$project": {
            "year_month": {"$dateToString": {"format": "%Y-%m", "date": "$deletion_date"}}
        }},
        {"$group": {"_id": "$year_month", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    by_month = list(db["archived_duplicates"].aggregate(pipeline))
    
    return {
        "total_archived_duplicates": total_archived,
        "by_category": by_category,
        "by_month": by_month
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)