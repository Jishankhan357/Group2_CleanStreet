# 🚀 CLOUDINARY QUICK START - 5 MINUTES

## Your Credentials
```
Cloud: dugkqeu60
API Key: 141292343768355
Secret: BfyhRm02RolF-_fRCgZIkG0MIKs
```

## Install (2 min)
```bash
cd backend
npm install cloudinary multer
```

## Configure (1 min)
Create/update `backend/.env`:
```
CLOUDINARY_CLOUD_NAME=dugkqeu60
CLOUDINARY_API_KEY=141292343768355
CLOUDINARY_API_SECRET=BfyhRm02RolF-_fRCgZIkG0MIKs
```

## Start Servers (1 min)
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm start
```

## Test (1 min)
1. Go to http://localhost:3000
2. Login
3. Click "Report Issue"
4. Click "Upload Photos"
5. Select an image
6. Verify green checkmark
7. Submit report
8. Go to Community page
9. See your image! 🎉

---

## Files Modified
- ✅ `backend/src/config/cloudinary.js` (NEW)
- ✅ `backend/src/config/multer.js` (NEW)
- ✅ `backend/src/routes/reports.js` (UPDATED)
- ✅ `frontend/src/components/Community/CloudinaryImageUpload.jsx` (NEW)

## What Works Now
✅ Upload images when reporting issues
✅ See upload progress
✅ Images auto-compress
✅ Images appear on Community page
✅ Works on mobile
✅ Multiple images per report (up to 5)

## If It Doesn't Work

**Image won't upload:**
- Check backend is running (`npm start`)
- Check `.env` has Cloudinary credentials
- Check image is < 10MB
- Check browser console for errors

**Images not showing on Community page:**
- Hard refresh page (Ctrl+Shift+R)
- Check MongoDB has the images
- Check image URLs are valid

**"Module not found" error:**
- Run `npm install cloudinary multer` in backend

---

**That's it! You're done! 🎊**

See `CLOUDINARY_COMPLETE_SETUP.md` for full documentation.
