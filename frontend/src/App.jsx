import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import { CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'

// Layout
import MainLayout from './components/Layout/MainLayout'
import PublicLayout from './components/Layout/PublicLayout'
import AdminLayout from './components/Layout/AdminLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import Profile from './pages/Profile'
import Dashboard from './pages/user/Dashboard'
import Reports from './pages/user/Reports'
import Map from './pages/user/Map'
import History from './pages/user/History'
import AdminDashboard from './pages/admin/Dashboard'
import AdminLogin from './pages/admin/Login'
import SetupWizard from './components/setup/SetupWizard'
import ReportIssue from './pages/ReportIssue'

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute'

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
})

function App() {
  // Detect if accessing via admin subdomain
  const isAdminSubdomain = typeof window !== 'undefined' && 
    window.location.hostname.startsWith('admin.')
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Admin Subdomain Routes */}
            {isAdminSubdomain ? (
              <>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/setup" element={<SetupWizard />} />
                <Route path="/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />
                <Route path="/dashboard" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/setup" element={<SetupWizard />} />
                <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
                <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
                <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
                <Route path="/verify-email" element={<PublicLayout><VerifyEmail /></PublicLayout>} />
                <Route path="/report" element={<PublicLayout><ReportIssue /></PublicLayout>} />
                
                {/* Protected User Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <PublicLayout>
                      <Profile />
                    </PublicLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Reports />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/map" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Map />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <History />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Admin Path Routes (fallback) */}
                <Route path="/admin/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
              </>
            )}
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App