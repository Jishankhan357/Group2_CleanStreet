# 📡 Community Page - API Reference

## Base URL
```
http://localhost:5000/api/reports
```

---

## 1️⃣ Get Community Feed

### Request
```http
GET /community/feed?category=garbage&limit=20&page=1&search=pothole
```

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `category` | string | `all` | Filter by category (all, garbage, pothole, water, streetlight, park, sewage, vandalism, other) |
| `limit` | number | `20` | Issues per page |
| `page` | number | `1` | Page number |
| `search` | string | - | Search in title, description, address |

### Response (200 OK)
```json
{
  "success": true,
  "reports": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "profilePicture": "https://..."
      },
      "category": "garbage",
      "title": "Trash piled up at corner",
      "description": "Large amount of garbage...",
      "status": "open",
      "address": "Main Street, City",
      "images": [
        {
          "url": "https://...",
          "public_id": "..."
        }
      ],
      "likes": [
        {
          "_id": "507f1f77bcf86cd799439013",
          "name": "Jane Smith"
        }
      ],
      "comments": [
        {
          "_id": "507f1f77bcf86cd799439014",
          "userName": "Mike Johnson",
          "userProfilePicture": "https://...",
          "text": "This is urgent!",
          "likes": ["507f1f77bcf86cd799439015"],
          "createdAt": "2026-01-20T10:30:00Z"
        }
      ],
      "shares": 5,
      "views": 42,
      "createdAt": "2026-01-20T09:15:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 8
  }
}
```

### Example Calls
```bash
# Get all garbage reports
curl -X GET "http://localhost:5000/api/reports/community/feed?category=garbage"

# Search for pothole issues
curl -X GET "http://localhost:5000/api/reports/community/feed?search=pothole"

# Get page 2 with 50 issues per page
curl -X GET "http://localhost:5000/api/reports/community/feed?page=2&limit=50"

# Combined filters
curl -X GET "http://localhost:5000/api/reports/community/feed?category=water&search=leak&page=1"
```

---

## 2️⃣ Get Issue Details

### Request
```http
GET /community/post/:issueId
```

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `issueId` | string | Yes | MongoDB ObjectId of the issue |

### Response (200 OK)
```json
{
  "success": true,
  "report": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": "https://..."
    },
    "category": "garbage",
    "title": "Trash piled up at corner",
    "description": "Large amount of garbage blocking the sidewalk...",
    "priority": "high",
    "status": "in-progress",
    "address": "Main Street, City",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "images": [
      {
        "url": "https://...",
        "public_id": "...",
        "uploadedAt": "2026-01-20T09:15:00Z"
      }
    ],
    "likes": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Jane Smith",
        "profilePicture": "https://..."
      }
    ],
    "comments": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "userId": {
          "_id": "507f1f77bcf86cd799439015",
          "name": "Mike Johnson",
          "profilePicture": "https://..."
        },
        "userName": "Mike Johnson",
        "userProfilePicture": "https://...",
        "text": "This area needs immediate cleanup!",
        "likes": ["507f1f77bcf86cd799439016"],
        "createdAt": "2026-01-20T10:30:00Z"
      }
    ],
    "shares": 5,
    "views": 42,
    "createdAt": "2026-01-20T09:15:00Z",
    "updatedAt": "2026-01-20T15:45:00Z"
  }
}
```

### Error Response (404 Not Found)
```json
{
  "success": false,
  "error": "Report not found"
}
```

---

## 3️⃣ Add Comment

### Request
```http
POST /reports/:issueId/comment
Content-Type: application/json
Authorization: Bearer <token> (via session cookie)

{
  "text": "This is a great report! Action needed ASAP."
}
```

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `issueId` | string | Yes | MongoDB ObjectId of the issue |
| `text` | string | Yes | Comment text (1-1000 characters) |

### Request Headers
- `Content-Type: application/json`
- Session cookie (set by express-session)

### Response (201 Created)
```json
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439012",
    "userName": "John Doe",
    "userProfilePicture": "https://...",
    "text": "This is a great report! Action needed ASAP.",
    "likes": [],
    "createdAt": "2026-01-20T11:20:00Z"
  }
}
```

### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "error": "Not authenticated"
}
```

### Example Call
```bash
curl -X POST "http://localhost:5000/api/reports/507f1f77bcf86cd799439011/comment" \
  -H "Content-Type: application/json" \
  -H "Cookie: clean_street.sid=YOUR_SESSION_ID" \
  -d '{"text": "Great report! This needs immediate attention."}'
```

---

## 4️⃣ Delete Comment

### Request
```http
DELETE /reports/:issueId/comment/:commentId
Authorization: Bearer <token> (via session cookie)
```

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `issueId` | string | Yes | MongoDB ObjectId of the issue |
| `commentId` | string | Yes | MongoDB ObjectId of the comment |

### Response (200 OK)
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

### Error Responses

**404 Not Found**
```json
{
  "success": false,
  "error": "Report not found"
}
```

**403 Forbidden (Not Author)**
```json
{
  "success": false,
  "error": "Not authorized to delete this comment"
}
```

### Example Call
```bash
curl -X DELETE "http://localhost:5000/api/reports/507f1f77bcf86cd799439011/comment/507f1f77bcf86cd799439014" \
  -H "Cookie: clean_street.sid=YOUR_SESSION_ID"
```

---

## 5️⃣ Like/Unlike Issue

### Request
```http
POST /reports/:issueId/like
Authorization: Bearer <token> (via session cookie)
```

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `issueId` | string | Yes | MongoDB ObjectId of the issue |

### Response (200 OK)
```json
{
  "success": true,
  "message": "Report liked",
  "liked": true,
  "likesCount": 42
}
```

### Toggle Response (If Already Liked)
```json
{
  "success": true,
  "message": "Like removed",
  "liked": false,
  "likesCount": 41
}
```

### Error Response
```json
{
  "success": false,
  "error": "Not authenticated"
}
```

### Example Call
```bash
# First like
curl -X POST "http://localhost:5000/api/reports/507f1f77bcf86cd799439011/like" \
  -H "Cookie: clean_street.sid=YOUR_SESSION_ID"

# Response: { liked: true, likesCount: 42 }

# Second call (unlike)
curl -X POST "http://localhost:5000/api/reports/507f1f77bcf86cd799439011/like" \
  -H "Cookie: clean_street.sid=YOUR_SESSION_ID"

# Response: { liked: false, likesCount: 41 }
```

---

## 6️⃣ Like/Unlike Comment

### Request
```http
POST /reports/:issueId/comment/:commentId/like
Authorization: Bearer <token> (via session cookie)
```

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `issueId` | string | Yes | MongoDB ObjectId of the issue |
| `commentId` | string | Yes | MongoDB ObjectId of the comment |

### Response (200 OK)
```json
{
  "success": true,
  "message": "Comment liked",
  "liked": true,
  "likesCount": 5
}
```

### Example Call
```bash
curl -X POST "http://localhost:5000/api/reports/507f1f77bcf86cd799439011/comment/507f1f77bcf86cd799439014/like" \
  -H "Cookie: clean_street.sid=YOUR_SESSION_ID"
```

---

## 7️⃣ Record Share

### Request
```http
POST /reports/:issueId/share
```

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `issueId` | string | Yes | MongoDB ObjectId of the issue |

### Response (200 OK)
```json
{
  "success": true,
  "message": "Share count incremented",
  "sharesCount": 12
}
```

### Note
- **No authentication required** - Public action
- Share count increments every time this endpoint is called
- Used for tracking issue popularity/virality

### Example Call
```bash
curl -X POST "http://localhost:5000/api/reports/507f1f77bcf86cd799439011/share"
```

---

## Status Codes Reference

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful read/update |
| 201 | Created | Comment added |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | No permission to delete |
| 404 | Not Found | Issue/comment doesn't exist |
| 500 | Server Error | Database error |

---

## Data Validation

### Comment Text
- **Min length**: 1 character
- **Max length**: 1000 characters
- **Required**: Yes
- **Trimmed**: Yes (whitespace removed)

### Category
Valid values:
- `garbage`
- `pothole`
- `water`
- `streetlight`
- `park`
- `sewage`
- `vandalism`
- `other`

### Status
Valid values:
- `open`
- `in-progress`
- `resolved`
- `rejected`

### Priority
Valid values:
- `low`
- `medium`
- `high`
- `critical`

---

## Rate Limiting

All `/api/reports` endpoints use the global API rate limiter:
- **Limit**: Based on IP address
- **Window**: 15 minutes
- **Max Requests**: 100 per 15 minutes

---

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Not authenticated" | No valid session | Log in first |
| "Comment not found" | Wrong comment ID | Verify ID is correct |
| "Report not found" | Issue doesn't exist | Check issue ID |
| "Not authorized" | Not comment author | Can only delete own comments |
| "Comments are disabled" | Reporter disabled comments | Cannot add comments |
| "Validation error" | Invalid input data | Check required fields |

---

## Best Practices

### 1. Pagination
```bash
# Always use limit and page for large datasets
curl "http://localhost:5000/api/reports/community/feed?limit=20&page=1"
```

### 2. Filtering
```bash
# Use specific filters to reduce response size
curl "http://localhost:5000/api/reports/community/feed?category=garbage"
```

### 3. Search
```bash
# Use search for specific queries
curl "http://localhost:5000/api/reports/community/feed?search=pothole+on+Main+Street"
```

### 4. Caching
```javascript
// Frontend: Cache results in React state
const [cachedFeed, setCachedFeed] = useState({})

// Only refetch on filter/page change
```

### 5. Error Handling
```javascript
// Always handle errors gracefully
try {
  const response = await axios.post(`/api/reports/${id}/like`)
  // Handle success
} catch (error) {
  console.error(error.response?.data?.error)
  // Show user-friendly error
}
```

---

## Integration Examples

### JavaScript/Fetch
```javascript
// Get community feed
fetch('/api/reports/community/feed?category=garbage')
  .then(r => r.json())
  .then(data => console.log(data.reports))

// Add comment
fetch('/api/reports/507f1f77bcf86cd799439011/comment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Great report!' }),
  credentials: 'include'
})
```

### Axios
```javascript
import axios from 'axios'

// Configure for credentials
axios.defaults.withCredentials = true

// Get feed
const { data } = await axios.get('/api/reports/community/feed')

// Like issue
await axios.post('/api/reports/507f1f77bcf86cd799439011/like')
```

### cURL
```bash
# Get feed with filters
curl -X GET "http://localhost:5000/api/reports/community/feed?category=garbage&page=1"

# Add comment
curl -X POST "http://localhost:5000/api/reports/507f1f77bcf86cd799439011/comment" \
  -H "Content-Type: application/json" \
  -d '{"text": "Great report!"}' \
  -b "clean_street.sid=SESSION_ID"
```

---

## Testing with Postman

### Setup Postman Environment
```json
{
  "variable": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:5000"
    },
    {
      "key": "ISSUE_ID",
      "value": "YOUR_ISSUE_ID"
    },
    {
      "key": "COMMENT_ID",
      "value": "YOUR_COMMENT_ID"
    }
  ]
}
```

### Sample Requests
```
GET {{BASE_URL}}/api/reports/community/feed?category=garbage
GET {{BASE_URL}}/api/reports/community/post/{{ISSUE_ID}}
POST {{BASE_URL}}/api/reports/{{ISSUE_ID}}/comment
DELETE {{BASE_URL}}/api/reports/{{ISSUE_ID}}/comment/{{COMMENT_ID}}
POST {{BASE_URL}}/api/reports/{{ISSUE_ID}}/like
POST {{BASE_URL}}/api/reports/{{ISSUE_ID}}/share
```

---

**Happy API Integration! 🚀**
