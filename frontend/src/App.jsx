import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import { CssBaseline } from '@mui/material'
import { useMemo, useState } from 'react'
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
import AdminHome from './pages/admin/Home'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminReports from './pages/admin/Reports'
import AdminSettings from './pages/admin/Settings'
import AdminLogin from './pages/admin/Login'
import SetupWizard from './components/setup/SetupWizard'
import ReportIssue from './pages/ReportIssue'
import About from './pages/About'
import Contact from './pages/Contact'
import Issues from './pages/user/Issues'
import Settings from './pages/user/Settings'
import Activity from './pages/user/Activity'
import Analytics from './pages/user/Analytics'

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  const [mode, setMode] = useState('light')

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#0f1115',
        paper: mode === 'light' ? '#ffffff' : '#141821',
      },
    },
  }), [mode])

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

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
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/setup" element={<SetupWizard />} />
                <Route path="/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />
                <Route path="/home" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminHome />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminReports />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminSettings />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/home" />} />
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
                {/* Report Issue moved under protected route as /report-issue */}
                <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                
                {/* Protected User Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <PublicLayout>
                      <Profile />
                    </PublicLayout>
                  </ProtectedRoute>
                } />
                <Route path="/report-issue" element={
                  <ProtectedRoute>
                    <MainLayout toggleColorMode={toggleColorMode}>
                      <ReportIssue />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/issues" element={
                  <ProtectedRoute>
                    <MainLayout toggleColorMode={toggleColorMode}>
                      <Issues />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/my-reports" element={
                  <ProtectedRoute>
                    <MainLayout toggleColorMode={toggleColorMode}>
                      <Reports />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <MainLayout toggleColorMode={toggleColorMode}>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <MainLayout toggleColorMode={toggleColorMode}>
                      <Reports />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/map" element={
                  <ProtectedRoute>
                    <MainLayout toggleColorMode={toggleColorMode}>
                      <Map />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <MainLayout toggleColorMode={toggleColorMode}>
                      <History />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <MainLayout toggleColorMode={toggleColorMode}>
                      <Settings />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/activity" element={
                  <ProtectedRoute>
                    <MainLayout toggleColorMode={toggleColorMode}>
                      <Activity />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <MainLayout toggleColorMode={toggleColorMode}>
                      <Analytics />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Admin Path Routes (fallback) */}
                <Route path="/admin/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />
                <Route path="/admin/home" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminHome />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminReports />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminSettings />
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