import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  CircularProgress,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  InputAdornment,
  LinearProgress,
  alpha,
  useTheme,
  Badge
} from '@mui/material'
import {
  Add,
  Delete,
  Lock,
  LockOpen,
  AdminPanelSettings,
  Person,
  Refresh,
  Key,
  Search,
  MoreVert,
  CheckCircle,
  Cancel,
  TrendingUp,
  Group,
  Security,
  Download,
  Email,
  Phone,
  CalendarToday,
  Visibility,
  Logout,
  PeopleAlt,
  SupervisedUserCircle,
  HourglassEmpty
} from '@mui/icons-material'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = '/api'

// Create a dedicated axios instance with proper defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

const AdminDashboard = () => {
  const theme = useTheme()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    admins: 0,
    superAdmins: 0,
    pendingVerifications: 0,
    userGrowth: 0
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false)
  const [openUserDetails, setOpenUserDetails] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [selectedActionUser, setSelectedActionUser] = useState(null)
  
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    name: '',
    password: '',
    role: 'admin',
    permissions: [],
    phone: '',
    department: ''
  })

  const permissionsList = [
    { value: 'manage_users', label: 'Manage Users' },
    { value: 'manage_reports', label: 'Manage Reports' },
    { value: 'manage_settings', label: 'Manage Settings' },
    { value: 'manage_admins', label: 'Manage Admins' },
    { value: 'view_analytics', label: 'View Analytics' },
    { value: 'manage_content', label: 'Manage Content' }
  ]

  useEffect(() => {
    if (isAuthenticated && isAdmin && user) {
      fetchDashboardData()
    } else {
      navigate('/login')
    }
  }, [isAuthenticated, isAdmin, user])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [usersRes, statsRes] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/admin/dashboard/stats')
      ])
      
      setUsers(usersRes.data.users || [])
      setFilteredUsers(usersRes.data.users || [])
      setStats(statsRes.data.stats || {})
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    filterUsers()
  }, [searchTerm, statusFilter, roleFilter, users])

  const filterUsers = () => {
    let filtered = [...users]
    
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      )
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => {
        if (roleFilter === 'super-admin') return user.isSuperAdmin
        if (roleFilter === 'admin') return user.role === 'admin' && !user.isSuperAdmin
        return user.role === roleFilter
      })
    }
    
    setFilteredUsers(filtered)
  }

  const handleCreateAdmin = async () => {
    setLoading(true)
    try {
      const response = await apiClient.post('/admin/create-admin', newAdmin)
      
      setSuccess('Admin created successfully')
      setNewAdmin({
        email: '',
        name: '',
        password: '',
        role: 'admin',
        permissions: [],
        phone: '',
        department: ''
      })
      setOpenDialog(false)
      fetchDashboardData()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create admin')
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await apiClient.put(
        `/admin/users/${userId}/status`, 
        { isActive: !isActive }
      )
      
      setSuccess(`User ${isActive ? 'deactivated' : 'activated'} successfully`)
      fetchDashboardData()
    } catch (err) {
      setError('Failed to update user status')
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }
    
    try {
      await apiClient.delete(`/admin/users/${userId}`)
      
      setSuccess('User deleted successfully')
      fetchDashboardData()
    } catch (err) {
      setError('Failed to delete user')
    }
  }

  const handlePermissionToggle = (permission) => {
    setNewAdmin(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewAdmin(prev => ({ ...prev, password }))
  }

  const handleActionMenuOpen = (event, user) => {
    setActionMenuAnchor(event.currentTarget)
    setSelectedActionUser(user)
  }

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null)
    setSelectedActionUser(null)
  }

  const handleExportData = () => {
    // Implement export functionality
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Created At'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.isSuperAdmin ? 'Super Admin' : user.role,
        user.isActive ? 'Active' : 'Inactive',
        new Date(user.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users-export.csv'
    a.click()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = (name) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading && !users.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {user?.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<Refresh />}
              onClick={fetchDashboardData}
              variant="outlined"
            >
              Refresh
            </Button>
            <Button
              startIcon={<Download />}
              onClick={handleExportData}
              variant="contained"
            >
              Export
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert 
            severity="success" 
            onClose={() => setSuccess('')}
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        )}
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="body2" fontWeight="medium">
                    TOTAL USERS
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalUsers.toLocaleString()}
                  </Typography>
                  {stats.userGrowth > 0 && (
                    <Typography variant="caption" color="success.main">
                      <TrendingUp sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                      +{stats.userGrowth}% growth
                    </Typography>
                  )}
                </Box>
                <Badge badgeContent={stats.totalUsers} color="primary">
                  <Group sx={{ fontSize: 40, color: 'primary.main' }} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: alpha(theme.palette.success.main, 0.08),
            borderLeft: `4px solid ${theme.palette.success.main}`,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="body2" fontWeight="medium">
                    ACTIVE USERS
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.activeUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {((stats.activeUsers / stats.totalUsers) * 100 || 0).toFixed(1)}% active
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: alpha(theme.palette.warning.main, 0.08),
            borderLeft: `4px solid ${theme.palette.warning.main}`,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="body2" fontWeight="medium">
                    ADMINS
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.admins}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.superAdmins} super admins
                  </Typography>
                </Box>
                <Security sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: alpha(theme.palette.info.main, 0.08),
            borderLeft: `4px solid ${theme.palette.info.main}`,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="body2" fontWeight="medium">
                    PENDING
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.pendingVerifications || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Awaiting verification
                  </Typography>
                </Box>
                <HourglassEmpty sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Management Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              User Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Add New Admin
            </Button>
          </Box>

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search users..."
              size="small"
              sx={{ width: 300 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="All"
                onClick={() => setStatusFilter('all')}
                color={statusFilter === 'all' ? 'primary' : 'default'}
                variant={statusFilter === 'all' ? 'filled' : 'outlined'}
              />
              <Chip
                label="Active"
                onClick={() => setStatusFilter('active')}
                color={statusFilter === 'active' ? 'success' : 'default'}
                variant={statusFilter === 'active' ? 'filled' : 'outlined'}
              />
              <Chip
                label="Inactive"
                onClick={() => setStatusFilter('inactive')}
                color={statusFilter === 'inactive' ? 'error' : 'default'}
                variant={statusFilter === 'inactive' ? 'filled' : 'outlined'}
              />
              
              <Chip
                label="All Roles"
                onClick={() => setRoleFilter('all')}
                color={roleFilter === 'all' ? 'primary' : 'default'}
                variant={roleFilter === 'all' ? 'filled' : 'outlined'}
              />
              <Chip
                label="Super Admin"
                onClick={() => setRoleFilter('super-admin')}
                color={roleFilter === 'super-admin' ? 'warning' : 'default'}
                variant={roleFilter === 'super-admin' ? 'filled' : 'outlined'}
              />
              <Chip
                label="Admin"
                onClick={() => setRoleFilter('admin')}
                color={roleFilter === 'admin' ? 'primary' : 'default'}
                variant={roleFilter === 'admin' ? 'filled' : 'outlined'}
              />
            </Box>
          </Box>
        </Box>

        {loading ? (
          <LinearProgress />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user._id}
                    hover
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: user.isSuperAdmin ? 'warning.main' : 'primary.main' }}>
                          {getInitials(user.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {user.name}
                          </Typography>
                          {user.phone && (
                            <Typography variant="body2" color="text.secondary">
                              <Phone sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                              {user.phone}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        <Email sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {user.isSuperAdmin ? <AdminPanelSettings color="warning" /> : <Person />}
                        <Chip 
                          label={user.isSuperAdmin ? 'Super Admin' : user.role}
                          color={user.isSuperAdmin ? 'warning' : user.role === 'admin' ? 'primary' : 'default'}
                          size="small"
                          sx={{ fontWeight: 'medium' }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.isActive ? 'Active' : 'Inactive'}
                        color={user.isActive ? 'success' : 'error'}
                        size="small"
                        icon={user.isActive ? <CheckCircle /> : <Cancel />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => {
                            setSelectedUser(user)
                            setOpenUserDetails(true)
                          }}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={user.isActive ? "Deactivate" : "Activate"}>
                          <IconButton
                            size="small"
                            color={user.isActive ? 'error' : 'success'}
                            onClick={() => toggleUserStatus(user._id, user.isActive)}
                          >
                            {user.isActive ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionMenuOpen(e, user)}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {filteredUsers.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <PeopleAlt sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Create Admin Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Create New Admin
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  margin="normal"
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={newAdmin.department}
                  onChange={(e) => setNewAdmin({ ...newAdmin, department: e.target.value })}
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="subtitle2">
                  Set Password
                </Typography>
                <Button
                  size="small"
                  startIcon={<Key />}
                  onClick={generatePassword}
                  variant="outlined"
                >
                  Generate Secure Password
                </Button>
              </Box>
              
              <TextField
                fullWidth
                label="Password"
                type="text"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                helperText="Minimum 8 characters with letters, numbers, and special characters"
                required
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Permissions
              </Typography>
              
              <List dense>
                {permissionsList.map((perm) => (
                  <ListItem key={perm.value}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newAdmin.permissions.includes(perm.value)}
                          onChange={() => handlePermissionToggle(perm.value)}
                        />
                      }
                      label={perm.label}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateAdmin} 
            variant="contained"
            disabled={!newAdmin.email || !newAdmin.name || !newAdmin.password}
            sx={{ minWidth: 120 }}
          >
            Create Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog 
        open={openUserDetails} 
        onClose={() => setOpenUserDetails(false)} 
        maxWidth="md"
        fullWidth
      >
        {selectedUser && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: selectedUser.isSuperAdmin ? 'warning.main' : 'primary.main' }}>
                  {getInitials(selectedUser.name)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedUser.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="bold">
                    USER INFORMATION
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="User ID"
                          secondary={selectedUser._id}
                          secondaryTypographyProps={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Full Name"
                          secondary={selectedUser.name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Email"
                          secondary={selectedUser.email}
                        />
                      </ListItem>
                      {selectedUser.phone && (
                        <ListItem>
                          <ListItemText 
                            primary="Phone"
                            secondary={selectedUser.phone}
                          />
                        </ListItem>
                      )}
                      <ListItem>
                        <ListItemText 
                          primary="Role"
                          secondary={
                            <Chip 
                              label={selectedUser.isSuperAdmin ? 'Super Admin' : selectedUser.role}
                              color={selectedUser.isSuperAdmin ? 'warning' : selectedUser.role === 'admin' ? 'primary' : 'default'}
                              size="small"
                              icon={selectedUser.isSuperAdmin ? <AdminPanelSettings /> : undefined}
                            />
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Status"
                          secondary={
                            <Chip 
                              label={selectedUser.isActive ? 'Active' : 'Inactive'}
                              color={selectedUser.isActive ? 'success' : 'error'}
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="bold">
                    ACCOUNT DETAILS
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Account Created"
                          secondary={new Date(selectedUser.createdAt).toLocaleString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Last Updated"
                          secondary={new Date(selectedUser.updatedAt).toLocaleString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Last Login"
                          secondary={selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Email Verified"
                          secondary={
                            <Chip 
                              label={selectedUser.isEmailVerified ? 'Verified' : 'Not Verified'}
                              color={selectedUser.isEmailVerified ? 'success' : 'warning'}
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="2FA Enabled"
                          secondary={
                            <Chip 
                              label={selectedUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                              color={selectedUser.twoFactorEnabled ? 'success' : 'default'}
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                
                {selectedUser.permissions && selectedUser.permissions.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="bold">
                      PERMISSIONS
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedUser.permissions.map(perm => (
                        <Chip 
                          key={perm}
                          label={perm.charAt(0).toUpperCase() + perm.slice(1).replace(/_/g, ' ')}
                          size="small"
                          color={perm === 'all' ? 'error' : 'primary'}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button onClick={() => setOpenUserDetails(false)}>
                Close
              </Button>
              <Button 
                variant="contained"
                color={selectedUser.isActive ? 'error' : 'success'}
                onClick={() => {
                  toggleUserStatus(selectedUser._id, selectedUser.isActive)
                  setOpenUserDetails(false)
                }}
              >
                {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        {selectedActionUser && (
          <>
            <MenuItem onClick={() => {
              setSelectedUser(selectedActionUser)
              setOpenUserDetails(true)
              handleActionMenuClose()
            }}>
              <Visibility sx={{ mr: 1, fontSize: 20 }} />
              View Details
            </MenuItem>
            <MenuItem onClick={() => {
              toggleUserStatus(selectedActionUser._id, selectedActionUser.isActive)
              handleActionMenuClose()
            }}>
              {selectedActionUser.isActive ? (
                <>
                  <Lock sx={{ mr: 1, fontSize: 20 }} />
                  Deactivate User
                </>
              ) : (
                <>
                  <LockOpen sx={{ mr: 1, fontSize: 20 }} />
                  Activate User
                </>
              )}
            </MenuItem>
            <MenuItem 
              onClick={() => {
                navigator.clipboard.writeText(selectedActionUser.email)
                setSuccess('Email copied to clipboard')
                handleActionMenuClose()
              }}
            >
              <Email sx={{ mr: 1, fontSize: 20 }} />
              Copy Email
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${selectedActionUser.name}?`)) {
                  deleteUser(selectedActionUser._id)
                  handleActionMenuClose()
                }
              }}
              sx={{ color: 'error.main' }}
            >
              <Delete sx={{ mr: 1, fontSize: 20 }} />
              Delete User
            </MenuItem>
          </>
        )}
      </Menu>
    </Container>
  )
}

export default AdminDashboard