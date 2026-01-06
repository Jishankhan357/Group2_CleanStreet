# Clean Street - Civic Complaint Management System

A full-stack web application for reporting and managing civic issues like garbage dumps, potholes, and broken streetlights.

## Features

- **User Authentication**: Manual registration with email/password and Google OAuth
- **Role-Based Access**: Citizens, Volunteers, and Admins
- **Admin Panel**: Separate admin login and dashboard
- **User Dashboard**: Track complaints and profile statistics
- **Secure Sessions**: Express sessions with MongoDB store

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Passport.js for authentication (Local & Google OAuth)
- Express Session with connect-mongo
- bcryptjs for password hashing
- express-validator for input validation

### Frontend
- React 19
- Material-UI (MUI)
- React Router v7
- React Hook Form with Yup validation
- Axios for API calls
- Vite as build tool

## Project Structure

```
backend/
  ├── src/
  │   ├── config/
  │   │   ├── database.js       # MongoDB connection
  │   │   └── passport.js       # Passport strategies
  │   ├── models/
  │   │   └── User.js          # User model
  │   ├── routes/
  │   │   ├── auth.js          # User authentication routes
  │   │   └── admin.js         # Admin routes
  │   └── server.js            # Express server setup
  ├── scripts/
  │   └── setup-admin.js       # Admin setup script
  └── package.json

frontend/
  ├── src/
  │   ├── components/
  │   │   ├── Auth/
  │   │   │   └── ProtectedRoute.jsx
  │   │   └── Layout/
  │   │       └── MainLayout.jsx
  │   ├── contexts/
  │   │   └── AuthContext.jsx   # Auth state management
  │   ├── pages/
  │   │   ├── auth/             # Login, Register, etc.
  │   │   ├── admin/            # Admin pages
  │   │   ├── user/             # User dashboard
  │   │   └── Home.jsx
  │   ├── App.jsx
  │   └── main.jsx
  └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/clean_street
   SESSION_SECRET=your_session_secret_change_this_in_production
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   FRONTEND_URL=http://localhost:3000
   ADMIN_FRONTEND_URL=http://admin.localhost:3000
   ```

4. Create the first admin user:
   ```bash
   node scripts/setup-admin.js
   ```
   Default credentials:
   - Email: admin@cleanstreet.com
   - Password: admin123
   - ⚠️ Change password immediately after first login!

5. Start the backend server:
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_FRONTEND_URL=http://localhost:3000
   VITE_ADMIN_URL=http://admin.localhost:3000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:3000

## API Endpoints

### User Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - Logout
- `GET /me` - Get current user info
- `GET /google` - Google OAuth login
- `GET /google/callback` - Google OAuth callback

### Admin (`/api/admin`)
- `POST /login` - Admin login
- `GET /dashboard/stats` - Dashboard statistics
- `GET /users` - Get all users (paginated)
- `POST /users` - Create admin/volunteer
- `PUT /users/:id/status` - Update user status
- `GET /profile` - Get admin profile

## User Roles

1. **Citizen** (default)
   - Report complaints
   - View own complaints
   - Vote and comment

2. **Volunteer**
   - Same as citizen
   - Can be assigned to resolve complaints

3. **Admin**
   - Full access to admin panel
   - Manage users
   - View all complaints
   - Cannot login via regular login (must use admin portal)

## Security Features

- Password hashing with bcryptjs
- Session-based authentication
- HTTP-only cookies
- Rate limiting on auth endpoints
- Account lockout after failed attempts
- Admin-only routes protection
- CORS configuration
- Helmet.js security headers

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env` files

## Notes

- Admin accounts can ONLY be created manually via script or by existing admins
- Admins must use the admin login portal (`/admin/login`)
- Regular users login at `/login`
- The model file is named `User.js` (singular) for consistency

## Development

- Backend uses ES6 modules (`"type": "module"` in package.json)
- Frontend uses Vite for fast development and building
- Hot reload enabled for both frontend and backend (with nodemon)

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running
2. **Session Issues**: Clear cookies and restart server
3. **CORS Errors**: Check FRONTEND_URL and ADMIN_FRONTEND_URL in backend .env
4. **Port Conflicts**: Change PORT in .env files if 3000 or 5000 are in use

## License

MIT License
