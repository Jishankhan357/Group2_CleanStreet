import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material'
import {
  Person,
  Email,
  Report,
  VerifiedUser
} from '@mui/icons-material'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* User Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person sx={{ mr: 1 }} />
              <Typography variant="h6">Profile</Typography>
            </Box>
            <Typography variant="body1" gutterBottom>
              <strong>Name:</strong> {user?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Role:</strong> {user?.role}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {user?.isEmailVerified ? 'Verified' : 'Unverified'}
            </Typography>
          </Paper>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Report sx={{ mr: 1 }} />
              <Typography variant="h6">Statistics</Typography>
            </Box>
            <Typography variant="body1" gutterBottom>
              <strong>Complaints Reported:</strong> {user?.stats?.complaintsReported || 0}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Complaints Resolved:</strong> {user?.stats?.complaintsResolved || 0}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Votes Given:</strong> {user?.stats?.votesGiven || 0}
            </Typography>
            <Typography variant="body1">
              <strong>Comments Made:</strong> {user?.stats?.commentsMade || 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <Button variant="contained" color="primary">
                Report Complaint
              </Button>
              <Button variant="outlined" color="primary">
                View My Complaints
              </Button>
              <Button variant="outlined" color="secondary">
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard
