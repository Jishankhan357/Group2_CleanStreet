# Cloudinary Image Upload Setup Guide

## Your Credentials
```
Cloud Name: dugkqeu60
API Key: 141292343768355
API Secret: BfyhRm02RolF-_fRCgZIkG0MIKs
```

## Step 1: Install Required Packages

Run these commands in the backend directory:

```bash
npm install cloudinary
npm install multer
```

## Step 2: Environment Variables

Add these to your `.env` file in the backend folder:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dugkqeu60
CLOUDINARY_API_KEY=141292343768355
CLOUDINARY_API_SECRET=BfyhRm02RolF-_fRCgZIkG0MIKs
```

**Note:** These are already set as defaults in the code, but using `.env` is more secure!

## Step 3: How Image Upload Works

### Backend Flow
```
User uploads image
    ↓
POST /api/reports/upload-image (with image file)
    ↓
Multer receives file in memory
    ↓
Cloudinary uploads from memory buffer
    ↓
Returns image URL and public_id
    ↓
Frontend stores image data
```

### Frontend Flow
```
User selects image
    ↓
Upload to /api/reports/upload-image
    ↓
Get image URL from response
    ↓
Add to images array
    ↓
Submit report with images
```

## Step 4: API Endpoints

### Upload Image
```http
POST /api/reports/upload-image
Content-Type: multipart/form-data
Authorization: Required (logged-in user)

Body:
- image: [file] (JPEG, PNG, GIF, WebP, max 10MB)

Response:
{
  "success": true,
  "message": "Image uploaded successfully",
  "image": {
    "url": "https://res.cloudinary.com/dugkqeu60/image/upload/v1234567890/clean_street/reports/...",
    "public_id": "clean_street/reports/...",
    "thumbnail": "https://res.cloudinary.com/dugkqeu60/image/upload/w_300,h_300,c_fill/..."
  }
}
```

### Create Report with Images
```http
POST /api/reports/create
Content-Type: application/json
Authorization: Required

Body:
{
  "category": "garbage",
  "title": "Trash at Main Street",
  "description": "Large pile of garbage...",
  "address": "Main Street, City",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "images": [
    {
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "public_id": "clean_street/reports/..."
    },
    {
      "url": "https://res.cloudinary.com/.../image2.jpg",
      "public_id": "clean_street/reports/..."
    }
  ]
}
```

## Step 5: Using in Frontend

### Upload Image
```javascript
const handleImageUpload = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await axios.post(
      '/api/reports/upload-image',
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )

    // Store image data
    setUploadedImages([...uploadedImages, response.data.image])
    toast.success('Image uploaded successfully!')
  } catch (error) {
    toast.error('Failed to upload image')
  }
}
```

### Submit Report with Images
```javascript
const handleSubmitReport = async () => {
  const reportData = {
    category: 'garbage',
    title: 'Issue title',
    description: 'Issue description',
    address: 'Address',
    latitude: 40.7128,
    longitude: -74.0060,
    images: uploadedImages // Array of {url, public_id}
  }

  await axios.post('/api/reports/create', reportData, {
    withCredentials: true
  })
}
```

## Step 6: Images on Community Page

Images automatically display on the Community Page:
- Thumbnail on issue card (300x300)
- Full image in details modal
- Optimized by Cloudinary for fast loading

## Features Included

✅ **Automatic Compression**: Cloudinary auto-optimizes images
✅ **Format Conversion**: Converts to best format (WebP for modern browsers)
✅ **Responsive Thumbnails**: 300x300 for cards, full for modal
✅ **File Validation**: Only accepts image files
✅ **Size Limit**: 10MB max per image
✅ **Secure Upload**: Only authenticated users can upload
✅ **Unique Names**: Prevents filename conflicts with timestamp + random string

## File Structure

```
backend/src/
├── config/
│   ├── cloudinary.js (NEW) - Cloudinary configuration
│   └── multer.js (NEW) - File upload handler
├── routes/
│   └── reports.js (UPDATED) - Added upload endpoint
└── models/
    └── Report.js (unchanged)
```

## Testing

### Test Upload with cURL
```bash
curl -X POST "http://localhost:5000/api/reports/upload-image" \
  -H "Cookie: clean_street.sid=YOUR_SESSION" \
  -F "image=@/path/to/image.jpg"
```

### Test in Browser DevTools
```javascript
// In console
const file = document.querySelector('input[type="file"]').files[0]
const formData = new FormData()
formData.append('image', file)

fetch('/api/reports/upload-image', {
  method: 'POST',
  body: formData,
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
```

## Troubleshooting

### Issue: "CLOUDINARY_API_SECRET is missing"
**Solution**: Add credentials to `.env` file or they're using defaults

### Issue: "Only image files are allowed"
**Solution**: Upload a valid image file (JPEG, PNG, GIF, WebP)

### Issue: "File size exceeds 10MB"
**Solution**: Compress image before uploading or increase limit in multer.js

### Issue: "Failed to upload image"
**Solution**: 
- Check internet connection
- Verify Cloudinary credentials
- Check backend logs for errors

### Issue: Images not showing on Community Page
**Solution**: 
- Verify images were saved in database
- Check image URLs are valid
- Clear browser cache

## Security Notes

✅ Only authenticated users can upload
✅ File type validation on backend
✅ File size limit enforced
✅ Credentials stored in environment variables (in production)
✅ Unique filenames prevent overwrites
✅ Using secure_url (HTTPS) from Cloudinary

## Performance Tips

1. **Compression**: Cloudinary auto-compresses
2. **Format**: Auto-selects best format (WebP for Chrome, etc.)
3. **Thumbnails**: Use thumbnail URLs for cards (smaller file size)
4. **Caching**: Cloudinary CDN handles caching

## Image Transformation Examples

```
Original: https://res.cloudinary.com/dugkqeu60/image/upload/v1234567890/...

Thumbnail (300x300):
https://res.cloudinary.com/dugkqeu60/image/upload/w_300,h_300,c_fill/...

Smaller (150x150):
https://res.cloudinary.com/dugkqeu60/image/upload/w_150,h_150,c_fill/...

Quality adjustment:
https://res.cloudinary.com/dugkqeu60/image/upload/q_60/...

Format conversion:
https://res.cloudinary.com/dugkqeu60/image/upload/f_auto/...
```

## Advanced Configuration

You can modify image upload settings in `backend/src/config/cloudinary.js`:

```javascript
// Add to upload configuration for more options:
{
  quality: 'auto:best',      // Auto quality
  fetch_format: 'auto',      // Auto format
  max_width: 1600,           // Max width
  max_height: 1200,          // Max height
  folder: 'clean_street/reports',  // Organization
  tags: ['clean-street', 'report'],  // Tagging
}
```

## Next Steps

1. Install packages: `npm install cloudinary multer`
2. Add `.env` variables
3. Restart backend server
4. Test upload in browser
5. Create reports with images
6. View on Community Page!

---

**Now your users can upload images and they'll automatically appear on the Community Page!** 🎉
