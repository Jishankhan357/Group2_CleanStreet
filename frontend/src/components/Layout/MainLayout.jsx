// import React from 'react'
// import { useAuth } from '../../contexts/AuthContext'
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   Container,
//   IconButton,
//   Menu,
//   MenuItem,
//   Avatar
// } from '@mui/material'
// import { Menu as MenuIcon } from '@mui/icons-material'
// import { useNavigate } from 'react-router-dom'

// const MainLayout = ({ children }) => {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const [anchorEl, setAnchorEl] = React.useState(null)

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleClose = () => {
//     setAnchorEl(null)
//   }

//   const handleLogout = async () => {
//     await logout()
//     handleClose()
//   }

//   const handleProfile = () => {
//     navigate('/profile')
//     handleClose()
//   }

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             Clean Street
//           </Typography>
          
//           {user && (
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <Typography variant="body1">
//                 {user.name}
//               </Typography>
//               <IconButton
//                 size="large"
//                 onClick={handleMenu}
//                 color="inherit"
//               >
//                 <Avatar sx={{ width: 32, height: 32 }}>
//                   {user.name.charAt(0).toUpperCase()}
//                 </Avatar>
//               </IconButton>
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleClose}
//               >
//                 <MenuItem onClick={handleProfile}>Profile</MenuItem>
//                 <MenuItem onClick={handleLogout}>Logout</MenuItem>
//               </Menu>
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>

//       <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', py: 3 }}>
//         {children}
//       </Box>

//       <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', bgcolor: 'background.paper' }}>
//         <Container maxWidth="lg">
//           <Typography variant="body2" color="text.secondary" align="center">
//             © {new Date().getFullYear()} Clean Street. All rights reserved.
//           </Typography>
//         </Container>
//       </Box>
//     </Box>
//   )
// }

// export default MainLayout




import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Badge,
  Fab,
  Zoom,
  CircularProgress,
  Tooltip,
  Breadcrumbs,
  Link,
  Alert,
  Snackbar
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home,
  Person,
  Logout,
  Dashboard,
  Report,
  Map,
  Settings,
  Notifications,
  KeyboardArrowUp,
  Brightness4,
  Brightness7,
  AdminPanelSettings,
  History
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import logoSvg from '../../assets/images/logo.svg'

const MainLayout = ({ children, toggleColorMode }) => {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth()
  const notifications = []
  const unreadCount = 0
  const markAsRead = () => {}
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  // Get breadcrumbs from current path
  const getBreadcrumbs = useCallback(() => {
    const pathnames = location.pathname.split('/').filter(x => x)
    return pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`
      const isLast = index === pathnames.length - 1
      
      const labelMap = {
        'admin': 'Admin',
        'profile': 'Profile',
        'map': 'Map',
        'reports': 'Reports',
        'dashboard': 'Dashboard',
        'settings': 'Settings'
      }
      
      const label = labelMap[value] || value.charAt(0).toUpperCase() + value.slice(1)
      
      return isLast ? (
        <Typography key={to} color="text.primary">
          {label}
        </Typography>
      ) : (
        <Link 
          key={to} 
          href={to}
          onClick={(e) => {
            e.preventDefault()
            navigate(to)
          }}
          color="inherit"
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          {label}
        </Link>
      )
    })
  }, [location.pathname, navigate])

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      setSnackbar({ open: true, message: 'Logged out successfully', severity: 'success' })
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      setSnackbar({ open: true, message: 'Logout failed. Please try again.', severity: 'error' })
    } finally {
      setLoggingOut(false)
      handleClose()
    }
  }

  const handleNavigation = (path) => {
    navigate(path)
    setMobileOpen(false)
    handleClose()
  }

  const navItems = [
    { label: 'Home', path: '/', icon: <Home />, show: true },
    { label: 'Map', path: '/map', icon: <Map />, show: true },
    { label: 'Reports', path: '/reports', icon: <Report />, show: true },
    { label: 'History', path: '/history', icon: <History />, show: true },
    { label: 'Admin Dashboard', path: '/admin', icon: <AdminPanelSettings />, show: isAdmin || isSuperAdmin },
    { label: 'Profile', path: '/profile', icon: <Person />, show: true },
  ].filter(item => item.show)

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Avatar 
          sx={{ 
            width: 56, 
            height: 56, 
            bgcolor: 'primary.main',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user?.email}
          </Typography>
          <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isSuperAdmin ? <AdminPanelSettings fontSize="small" /> : null}
            {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'User'}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ p: 2 }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.light',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                }
              },
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 'bold' : 'normal' }}
            />
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItem 
          button 
          onClick={toggleColorMode}
          sx={{ borderRadius: 2, mb: 1 }}
        >
          <ListItemIcon>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </ListItemIcon>
          <ListItemText primary={theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
        </ListItem>
        <ListItem 
          button 
          onClick={handleLogout}
          disabled={loggingOut}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon>
            {loggingOut ? <CircularProgress size={20} /> : <Logout />}
          </ListItemIcon>
          <ListItemText primary={loggingOut ? 'Logging out...' : 'Logout'} />
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme.zIndex.drawer + 1,
            backdropFilter: 'blur(10px)',
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[1],
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
              <Box
                component="img"
                src={logoSvg}
                alt="Clean Street Logo"
                sx={{ height: 40, width: 40 }}
              />
              <Typography variant="h6" component="div" fontWeight="bold" sx={{ 
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                Clean Street
              </Typography>
            </Box>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, mr: 3 }}>
                {navItems.slice(0, -1).map((item) => (
                  <Button
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                      borderBottom: location.pathname === item.path ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      borderRadius: 0,
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
            
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Notifications">
                  <IconButton 
                    color="inherit"
                    onClick={handleNotificationClick}
                    aria-label="notifications"
                  >
                    <Badge badgeContent={unreadCount} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Toggle theme">
                  <IconButton onClick={toggleColorMode} color="inherit" sx={{ ml: 1 }}>
                    {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Account settings">
                  <IconButton
                    size="large"
                    onClick={isMobile ? handleDrawerToggle : handleMenu}
                    color="inherit"
                    aria-label="account menu"
                  >
                    <Avatar sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: 'primary.main',
                      border: `2px solid ${theme.palette.mode === 'dark' ? '#424242' : '#e0e0e0'}`
                    }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                
                {!isMobile && (
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={() => handleNavigation('/profile')}>
                      <Person sx={{ mr: 1 }} /> Profile
                    </MenuItem>
                    <MenuItem onClick={toggleColorMode}>
                      {theme.palette.mode === 'dark' ? (
                        <>
                          <Brightness7 sx={{ mr: 1 }} /> Light Mode
                        </>
                      ) : (
                        <>
                          <Brightness4 sx={{ mr: 1 }} /> Dark Mode
                        </>
                      )}
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} disabled={loggingOut}>
                      {loggingOut ? (
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                      ) : (
                        <Logout sx={{ mr: 1 }} />
                      )}
                      {loggingOut ? 'Logging out...' : 'Logout'}
                    </MenuItem>
                  </Menu>
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 }
          }}
        >
          <Typography variant="subtitle2" sx={{ p: 2, fontWeight: 'bold', borderBottom: 1, borderColor: 'divider' }}>
            Notifications ({unreadCount})
          </Typography>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem 
                key={notification.id}
                onClick={() => {
                  markAsRead(notification.id)
                  if (notification.link) navigate(notification.link)
                  handleNotificationClose()
                }}
                sx={{
                  borderLeft: notification.unread ? `3px solid ${theme.palette.primary.main}` : 'none',
                  bgcolor: notification.unread ? 'action.hover' : 'transparent'
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" fontWeight={notification.unread ? 'bold' : 'normal'}>
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ width: '100%', py: 2 }}>
                No notifications
              </Typography>
            </MenuItem>
          )}
        </Menu>

        {/* Navigation Drawer */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 280,
                borderRight: `1px solid ${theme.palette.divider}`
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: 280,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 280,
                boxSizing: 'border-box',
                mt: '64px',
                borderRight: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.default'
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - 280px)` },
            ml: { md: '280px' },
            mt: '64px',
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default'
          }}
        >
          <Container 
            maxWidth="xl" 
            sx={{ 
              flexGrow: 1, 
              py: { xs: 2, md: 3 },
              px: { xs: 2, md: 3 }
            }}
          >
            {/* Breadcrumbs */}
            {location.pathname !== '/' && (
              <Breadcrumbs 
                aria-label="breadcrumb" 
                sx={{ mb: 3, mt: 1 }}
                separator="›"
              >
                <Link
                  component="button"
                  onClick={() => navigate('/')}
                  color="inherit"
                  sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Home
                </Link>
                {getBreadcrumbs()}
              </Breadcrumbs>
            )}
            
            {/* Page Content */}
            {children}
          </Container>

          {/* Footer */}
          <Box 
            component="footer" 
            sx={{ 
              mt: 'auto', 
              py: 3, 
              px: 2, 
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper'
            }}
          >
            <Container maxWidth="xl">
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between', 
                alignItems: 'center',
                gap: 2
              }}>
                <Typography variant="body2" color="text.secondary">
                  © {new Date().getFullYear()} Clean Street. Making cities cleaner, one report at a time.
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Link 
                    href="/privacy" 
                    color="text.secondary" 
                    underline="hover"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/privacy')
                    }}
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    href="/terms" 
                    color="text.secondary" 
                    underline="hover"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/terms')
                    }}
                  >
                    Terms of Service
                  </Link>
                  <Link 
                    href="/contact" 
                    color="text.secondary" 
                    underline="hover"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/contact')
                    }}
                  >
                    Contact
                  </Link>
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>

        {/* Scroll to Top Button */}
        <ScrollTop />
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

// ScrollTop Component
const ScrollTop = () => {
  const [visible, setVisible] = useState(false)
  const theme = useTheme()

  const toggleVisibility = useCallback(() => {
    if (window.pageYOffset > 300) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [toggleVisibility])

  return (
    <Zoom in={visible}>
      <Fab
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.dark',
          },
          boxShadow: theme.shadows[8]
        }}
        size="medium"
        aria-label="scroll back to top"
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  )
}

export default MainLayout
