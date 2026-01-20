# Community Page Feature - Implementation Guide

## Overview
The Community Page is a new feature that allows all users to view issues reported by the community, engage through comments, likes, and share functionalities. Each issue displays the reporter's location and category, facilitating community-driven transparency and engagement.

## Features

### 1. **View Community Issues**
- Browse all community-reported issues in a grid layout
- Filter by category (Garbage, Pothole, Water, Streetlight, Park, Sewage, Vandalism, Other)
- Search functionality for title, description, and address
- Pagination (20 issues per page)
- Status badges (Open, In Progress, Resolved, Rejected)
- Priority indicators

### 2. **Issue Cards**
Each issue card displays:
- Thumbnail image (or category color if no image)
- Category & Status chips
- Issue title and description (truncated)
- Location with address
- Reporter name and report date
- Like count
- Comment count
- Share button

### 3. **Like/Unlike**
- Authenticated users can like or unlike issues
- Like count updates in real-time
- Visual feedback (filled vs outlined heart icon)
- Toast notifications for actions

### 4. **Comments System**
- Add comments to issues (if comments are enabled by reporter)
- View all comments with author info and timestamp
- Like/unlike comments
- Delete own comments
- Comment count display
- Nested comment structure

### 5. **Share Functionality**
- Share via WhatsApp
- Share via Facebook
- Share via Twitter
- Copy link to clipboard
- Track share count for analytics

### 6. **Issue Details Modal**
- View full issue details in a modal dialog
- Display all images
- Show reporter information
- Display likes, comments, and shares count
- View and add comments
- Full commenting interface

## Database Changes

### Report Model Updates
```javascript
// Enhanced comments structure
comments: [{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  userName: String,
  userProfilePicture: String,
  text: String,
  likes: [ObjectId] (ref: User),
  createdAt: Date
}]

// New fields
likes: [ObjectId] (ref: User)     // Array of user IDs who liked
shares: Number                     // Share count
```

## Backend API Endpoints

### Get Community Feed
```
GET /api/reports/community/feed
Query Parameters:
  - category: string (optional) - Filter by category
  - limit: number (optional, default: 20)
  - page: number (optional, default: 1)
  - search: string (optional) - Search in title, description, address

Response:
{
  success: boolean,
  reports: Array[Report],
  pagination: {
    total: number,
    page: number,
    pages: number
  }
}
```

### Get Issue Details
```
GET /api/reports/community/post/:id
Response:
{
  success: boolean,
  report: Report (with populated userId, likes, comments)
}
```

### Add Comment
```
POST /api/reports/:id/comment
Body: {
  text: string (required, 1-1000 chars)
}
Authentication: Required
Response:
{
  success: boolean,
  message: string,
  comment: Comment
}
```

### Delete Comment
```
DELETE /api/reports/:id/comment/:commentId
Authentication: Required (user must be comment author)
Response:
{
  success: boolean,
  message: string
}
```

### Like/Unlike Issue
```
POST /api/reports/:id/like
Authentication: Required
Response:
{
  success: boolean,
  message: string,
  liked: boolean,
  likesCount: number
}
```

### Like/Unlike Comment
```
POST /api/reports/:id/comment/:commentId/like
Authentication: Required
Response:
{
  success: boolean,
  message: string,
  liked: boolean,
  likesCount: number
}
```

### Record Share
```
POST /api/reports/:id/share
Response:
{
  success: boolean,
  message: string,
  sharesCount: number
}
```

## Frontend Components

### 1. Community Page (`pages/user/Community.jsx`)
Main page component featuring:
- Search bar with icon
- Category filter dropdown
- Refresh button
- Issue grid layout
- Pagination controls
- Error handling
- Loading states
- Empty state message
- Issue details modal

### 2. IssueCard Component (`components/Community/IssueCard.jsx`)
Displays individual issue with:
- Image/category color background
- Category and status chips
- Title and description (2-line truncation)
- Location with icon
- Author avatar and name
- Date posted
- Action buttons (like, comment, share, more options)
- Hover effects and animations

### 3. CommentSection Component (`components/Community/CommentSection.jsx`)
Handles commenting with:
- Comment input textarea
- Comment list display
- User avatars and names
- Timestamps
- Like/unlike comments
- Delete functionality
- Confirmation dialogs
- Empty state message

## Frontend Routes

Added new route to App.jsx:
```jsx
<Route path="/community" element={
  <ProtectedRoute>
    <MainLayout toggleColorMode={toggleColorMode}>
      <Community />
    </MainLayout>
  </ProtectedRoute>
} />
```

## Navigation Integration

Added "Community" link to MainLayout sidebar navigation:
- Icon: LocationOn (from Material-UI)
- Color: Warning (amber/orange)
- Position: After "Issues", before "My Reports"

## User Experience Flow

1. **Browse**: User navigates to /community page
2. **Filter**: Optionally filters by category or searches
3. **View**: Clicks on issue card to open details modal
4. **Interact**: 
   - Likes/unlikes the issue
   - Reads and adds comments
   - Likes/unlikes comments
   - Deletes own comments
   - Shares issue via social media or link

## Security & Permissions

- Only authenticated users can comment
- Only comment authors can delete their comments
- Users can like/unlike issues and comments
- Share functionality is public (increments share count)
- Pagination ensures reasonable data loads
- Search and filters prevent excessive queries

## Performance Optimizations

1. **Pagination**: Only loads 20 issues per page
2. **Lean Queries**: Uses `.lean()` for read-only operations where appropriate
3. **Population**: Populates only necessary user fields
4. **Caching**: Issue details fetched on-demand
5. **Pagination**: Prevents loading all issues at once

## Styling Features

- Responsive grid layout (1, 2, 3 columns based on screen size)
- Smooth hover animations on cards
- Color-coded category chips
- Status-based color indicators
- Custom styled components with Material-UI
- Dark/light mode support
- Mobile-optimized interface

## Error Handling

- User-friendly error messages via toast notifications
- Graceful handling of API failures
- Loading states during data fetches
- Empty states when no data available
- Validation for comment length

## Testing Checklist

- [ ] Can filter issues by category
- [ ] Search functionality works across title, description, address
- [ ] Like/unlike works and updates count
- [ ] Comment add works and displays immediately
- [ ] Comment delete works with confirmation
- [ ] Share buttons open correct platforms
- [ ] Copy link functionality works
- [ ] Share count increments
- [ ] Pagination works correctly
- [ ] Modal opens with full details
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Dark mode works correctly

## Future Enhancements

1. **Advanced Filters**: Add priority, status filters
2. **Sorting Options**: Sort by newest, most liked, most commented
3. **User Profiles**: Click to view reporter's profile
4. **Report Modal**: Report inappropriate content
5. **Bookmarks**: Save favorite issues
6. **Notifications**: Get notified on new comments
7. **Map View**: View issues on map with clustering
8. **Trending Issues**: Show trending/popular issues
9. **Follow Issues**: Subscribe to updates on specific issues
10. **Comment Threads**: Reply to comments feature

## File Structure

```
frontend/
├── pages/
│   └── user/
│       └── Community.jsx (new)
├── components/
│   └── Community/ (new folder)
│       ├── IssueCard.jsx (new)
│       ├── CommentSection.jsx (new)
│       └── index.js (optional)
└── App.jsx (updated)

backend/
├── models/
│   └── Report.js (updated)
└── routes/
    └── reports.js (updated)
```

## Dependencies

Frontend:
- React
- Material-UI (@mui/material)
- Axios
- React Router
- React Hot Toast

Backend:
- Express
- MongoDB/Mongoose
- Express Validator

## Notes

- The community page is accessible only to authenticated users (protected route)
- Issues can be anonymous but still show on community page
- Comment allow/disable is controlled by issue reporter
- All timestamps are stored in UTC
- User profile pictures are optional
- Location data uses GeoJSON format (Point with coordinates)
