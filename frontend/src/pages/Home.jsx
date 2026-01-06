import React from 'react'
import { 
  Container, Typography, Button, Box, Grid, Paper, 
  Card, CardContent, CardActions, Fade, Zoom, Grow,
  Avatar, Chip, Stack, Divider
} from '@mui/material'
import { Link } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ReportIcon from '@mui/icons-material/Report'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import GroupsIcon from '@mui/icons-material/Groups'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { keyframes } from '@emotion/react'

// Animation keyframes
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

const Home = () => {
  const features = [
    {
      icon: <ReportIcon sx={{ fontSize: 48 }} />,
      title: 'Report Issues',
      description: 'Easily report civic issues with photos, location, and detailed descriptions.',
      color: '#FF6B6B',
      stats: '10K+ Issues Reported'
    },
    {
      icon: <TrackChangesIcon sx={{ fontSize: 48 }} />,
      title: 'Track Progress',
      description: 'Real-time updates and notifications on complaint resolution status.',
      color: '#4ECDC4',
      stats: '85% Resolution Rate'
    },
    {
      icon: <VolunteerActivismIcon sx={{ fontSize: 48 }} />,
      title: 'Community Power',
      description: 'Collaborate, vote, and work together with neighbors and local authorities.',
      color: '#FFD166',
      stats: '50K+ Active Users'
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 48 }} />,
      title: 'Smart Routing',
      description: 'Automatic routing to relevant authorities based on location and issue type.',
      color: '#06D6A0',
      stats: '24h Response Time'
    }
  ]

  const recentIssues = [
    { id: 1, title: 'Garbage cleared in Central Park', type: 'Sanitation', time: '2 hours ago', votes: 45 },
    { id: 2, title: 'Pothole fixed on Main Street', type: 'Infrastructure', time: '5 hours ago', votes: 32 },
    { id: 3, title: 'Street light repaired in Downtown', type: 'Electricity', time: '1 day ago', votes: 28 },
    { id: 4, title: 'Park bench installed near Library', type: 'Public Amenities', time: '2 days ago', votes: 19 }
  ]

  const stats = [
    { value: '50,000+', label: 'Active Citizens', icon: <GroupsIcon /> },
    { value: '95%', label: 'Satisfaction Rate', icon: <EmojiEventsIcon /> },
    { value: '30+', label: 'Cities Covered', icon: <LocationOnIcon /> },
    { value: '2M+', label: 'Issues Resolved', icon: <CheckCircleIcon /> }
  ]

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section with gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            animation: `${floatAnimation} 20s ease-in-out infinite`
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            animation: `${floatAnimation} 15s ease-in-out infinite reverse`
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Fade in timeout={1000}>
                <Box>
                  <Chip 
                    label="Join 50,000+ Active Citizens" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      mb: 3,
                      animation: `${pulseAnimation} 2s infinite`
                    }}
                    icon={<TrendingUpIcon />}
                  />
                  <Typography 
                    variant="h1" 
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2
                    }}
                  >
                    Transform Your
                    <Box component="span" sx={{ color: '#FFD166', display: 'block' }}>
                      Neighborhood Together
                    </Box>
                  </Typography>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      opacity: 0.9, 
                      mb: 4,
                      fontSize: { xs: '1.1rem', md: '1.5rem' }
                    }}
                  >
                    Report civic issues, track resolutions, and collaborate with your community 
                    to create cleaner, safer spaces for everyone.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Zoom in timeout={1200} style={{ transitionDelay: '200ms' }}>
                      <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        size="large"
                        sx={{
                          bgcolor: '#FFD166',
                          color: 'black',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          '&:hover': { 
                            bgcolor: '#FFC233',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(255, 209, 102, 0.4)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Start Reporting Now
                      </Button>
                    </Zoom>
                    <Zoom in timeout={1200} style={{ transitionDelay: '400ms' }}>
                      <Button
                        component={Link}
                        to="/login"
                        variant="outlined"
                        size="large"
                        sx={{
                          borderColor: 'rgba(255,255,255,0.3)',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': { 
                            borderColor: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Sign In to Account
                      </Button>
                    </Zoom>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={5}>
              <Grow in timeout={1500}>
                <Paper
                  sx={{
                    p: 4,
                    bgcolor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #FFD166, #06D6A0)'
                    }}
                  />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    🎉 Recently Resolved
                  </Typography>
                  <Stack spacing={3}>
                    {recentIssues.map((issue) => (
                      <Box 
                        key={issue.id}
                        sx={{ 
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.2)',
                            transform: 'translateX(5px)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: 'rgba(255,255,255,0.2)',
                            fontSize: '0.8rem'
                          }}>
                            {issue.votes}
                          </Avatar>
                          <Chip 
                            label={issue.type} 
                            size="small" 
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                          />
                        </Box>
                        <Typography sx={{ fontWeight: 500, mb: 0.5 }}>
                          {issue.title}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {issue.time} • {issue.votes} votes
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8, mt: -4 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            bgcolor: 'white'
          }}
        >
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Grow in timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      mb: 2
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {stat.value}
                    </Typography>
                    <Typography color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
            How Clean Street Works
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            A simple, powerful platform connecting citizens with local authorities
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: `0 20px 40px ${feature.color}33`,
                      '& .feature-icon': {
                        transform: 'scale(1.1)'
                      }
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box 
                      className="feature-icon"
                      sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: `${feature.color}15`,
                        color: feature.color,
                        mb: 3,
                        transition: 'all 0.4s ease'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                      {feature.description}
                    </Typography>
                    <Chip 
                      label={feature.stats}
                      size="small"
                      sx={{ 
                        bgcolor: `${feature.color}15`,
                        color: feature.color,
                        fontWeight: 500
                      }}
                    />
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ 
        py: 12,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="md">
          <Zoom in timeout={1000}>
            <Paper 
              sx={{ 
                p: { xs: 4, md: 8 },
                textAlign: 'center',
                borderRadius: 4,
                bgcolor: 'white',
                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #667eea, #764ba2)'
                }}
              />
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
                Ready to Make an Impact?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                Join thousands of empowered citizens creating positive change in their communities.
                Together, we can build better neighborhoods.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Join Free Today
                </Button>
                <Button
                  component={Link}
                  to="/about"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                    borderWidth: 2,
                    fontWeight: 600,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Learn More
                </Button>
              </Stack>
              <Typography variant="caption" display="block" sx={{ mt: 3, opacity: 0.7 }}>
                No credit card required • Takes less than 2 minutes
              </Typography>
            </Paper>
          </Zoom>
        </Container>
      </Box>
    </Box>
  )
}

export default Home