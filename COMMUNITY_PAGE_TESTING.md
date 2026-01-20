# Community Page - Quick Setup & Testing Guide

## 🚀 Quick Start

### Backend Setup
No additional npm packages needed - all endpoints have been added to the existing `routes/reports.js`

### Frontend Setup
Make sure you have `react-hot-toast` installed (it should already be in your project):
```bash
npm install react-hot-toast  # if not already installed
```

## 📝 Testing the Community Page

### Step 1: Create Some Test Data
Create several issues through the "Report Issue" page (at least 3-5 with different categories and images)

### Step 2: Access Community Page
Navigate to `/community` after logging in, or click "Community" in the sidebar

### Step 3: Test Features

#### Feature 1: Browse & Filter
- [ ] Issues load in a grid format
- [ ] Filter by different categories
- [ ] View paginated results (20 per page)

#### Feature 2: Search
- [ ] Type in search box
- [ ] Results filter by title, description, or address
- [ ] Clear search to see all issues

#### Feature 3: Like Issues
- [ ] Click like button on any issue
- [ ] Heart icon fills up (becomes solid)
- [ ] Like count increases
- [ ] Click again to unlike
- [ ] Count decreases

#### Feature 4: View Details
- [ ] Click on issue card or "View Details" menu
- [ ] Modal opens with full details
- [ ] All images display correctly
- [ ] Shows reporter info
- [ ] Displays like/comment/share counts

#### Feature 5: Add Comments
- [ ] In modal, scroll down to Comments section
- [ ] Type a comment in the textarea
- [ ] Click "Post Comment"
- [ ] Comment appears immediately in the list
- [ ] Shows your name, profile pic, timestamp

#### Feature 6: Comment Interactions
- [ ] Like other users' comments
- [ ] Like your own comments
- [ ] Delete your comments (shows confirmation)
- [ ] Comment count updates

#### Feature 7: Share
- [ ] Click share button on issue card or in details
- [ ] Share dialog appears
- [ ] Test each share option:
  - WhatsApp: Should open WhatsApp with pre-filled message
  - Facebook: Should open Facebook share dialog
  - Twitter: Should open Twitter compose
  - Copy Link: Should copy URL to clipboard

#### Feature 8: Responsive Design
- [ ] Test on desktop (3 columns)
- [ ] Test on tablet (2 columns)
- [ ] Test on mobile (1 column)
- [ ] Verify touch interactions work on mobile

## 🔧 API Testing with cURL/Postman

### Get Community Feed
```bash
curl -X GET "http://localhost:5000/api/reports/community/feed?category=garbage&limit=10&page=1" \
  -H "Cookie: clean_street.sid=YOUR_SESSION_ID"
```

### Add Comment
```bash
curl -X POST "http://localhost:5000/api/reports/ISSUE_ID/comment" \
  -H "Content-Type: application/json" \
  -H "Cookie: clean_street.sid=YOUR_SESSION_ID" \
  -d '{"text": "Great report! This area really needs attention."}'
```

### Like Issue
```bash
curl -X POST "http://localhost:5000/api/reports/ISSUE_ID/like" \
  -H "Cookie: clean_street.sid=YOUR_SESSION_ID"
```

### Like Comment
```bash
curl -X POST "http://localhost:5000/api/reports/ISSUE_ID/comment/COMMENT_ID/like" \
  -H "Cookie: clean_street.sid=YOUR_SESSION_ID"
```

### Record Share
```bash
curl -X POST "http://localhost:5000/api/reports/ISSUE_ID/share"
```

## 🎨 Customization Tips

### Change Icon
Edit `/frontend/src/components/Layout/MainLayout.jsx` line 934:
```jsx
icon: <LocationOn />  // Change to any other icon
```

### Change Colors
Edit category colors in `IssueCard.jsx`:
```javascript
const getCategoryColor = (category) => {
  const colors = {
    garbage: '#FF6B6B',      // Red
    pothole: '#4ECDC4',      // Teal
    water: '#45B7D1',        // Blue
    // ... customize as needed
  }
}
```

### Change Grid Layout
Edit `Community.jsx` line 200:
```jsx
<Grid item xs={12} sm={6} md={4} key={issue._id}>  // 4 = 3 columns on desktop
  // Change md={4} to md={3} for 4 columns, md={6} for 2 columns
```

### Change Issues Per Page
Edit `Community.jsx` line 90:
```jsx
const params = {
  page,
  limit: 12,  // Change from 12 to desired number
}
```

## 🐛 Troubleshooting

### Issue 1: Comments not showing
- Check browser console for errors
- Verify `allowComments` is `true` on the issue
- Ensure you're logged in

### Issue 2: Like button not working
- Must be logged in to like
- Check network tab in DevTools
- Verify API response in console

### Issue 3: Images not loading
- Check image URLs in database
- Verify Cloudinary/image upload service is working
- Check CORS settings

### Issue 4: Search not working
- Ensure issues have title, description, or address
- Check MongoDB text index creation if needed
- Verify search string is not empty

### Issue 5: Pagination not working
- Check total count in response
- Verify page number calculation
- Check limit parameter

## 📊 Database Checks

### Check if likes are working
```javascript
// In MongoDB shell
db.reports.findOne({ _id: ObjectId("...") })
// Look for the "likes" array - should contain user IDs
```

### Check comments structure
```javascript
db.reports.findOne({ _id: ObjectId("...") })
// Look for "comments" array with userId, userName, userProfilePicture, etc.
```

### Count issues by category
```javascript
db.reports.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } }
])
```

## 🎯 Performance Testing

### Load Test - Many Issues
1. Create 100+ issues
2. Navigate to `/community`
3. Check browser performance tab
4. Verify pagination improves load time

### Memory Usage
- Open DevTools Memory tab
- Navigate to community
- Take heap snapshot
- Check for memory leaks

### Network
- Open DevTools Network tab
- Filter by XHR requests
- Verify pagination reduces payload
- Check image sizes

## 📱 Mobile Testing

### Using Chrome DevTools
1. F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. Test different screen sizes
3. Verify touch interactions
4. Test share functionality on mobile

### Real Device Testing
1. Use `http://YOUR_IP:3000` from another device
2. Test touch interactions
3. Test share buttons with actual WhatsApp/Facebook apps

## ✅ Final Verification Checklist

- [ ] Community page loads without errors
- [ ] All 9 categories filter correctly
- [ ] Search works across title/description/address
- [ ] Like button updates count and state
- [ ] Comments can be added and deleted
- [ ] Share buttons work (or at least don't error)
- [ ] Pagination works correctly
- [ ] Modal opens and closes properly
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] Dark mode works
- [ ] Images load correctly
- [ ] User info displays properly
- [ ] Timestamps are correct
- [ ] Empty states display correctly

## 🚢 Deployment Notes

1. **Database Migration**: No migration needed - schema is backward compatible
2. **Environment Variables**: No new env vars needed
3. **Node Version**: Ensure Node 14+ for modern syntax
4. **Build**: Run `npm run build` in frontend before deployment
5. **API Endpoints**: All new endpoints are at `/api/reports/*`

## 📞 Support

If you encounter issues:
1. Check browser console for error messages
2. Check server logs for API errors
3. Verify MongoDB is running and connected
4. Ensure all dependencies are installed
5. Clear browser cache and try again

## 🎉 Success!

Once all tests pass, the Community Page is ready for production!
