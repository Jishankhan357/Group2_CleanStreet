import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'

const Reports = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserReports()
  }, [])

  const fetchUserReports = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/reports/my-reports', {
        withCredentials: true
      })

      if (response.data.success) {
        setReports(response.data.reports)
      } else {
        setError('Failed to load reports')
      }
    } catch (err) {
      console.error('Fetch reports error:', err)
      setError(err.response?.data?.error || 'Failed to fetch reports')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      open: 'info',
      'in-progress': 'warning',
      resolved: 'success',
      rejected: 'error'
    }
    return colors[status] || 'default'
  }

  const getCategoryLabel = (category) => {
    const labels = {
      garbage: 'Garbage Dump',
      pothole: 'Pothole/Road Damage',
      water: 'Water Leakage',
      streetlight: 'Broken Light',
      park: 'Park Maintenance',
      sewage: 'Sewage Issue',
      vandalism: 'Vandalism',
      other: 'Other'
    }
    return labels[category] || category
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all your submitted reports here.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {reports.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You haven't submitted any reports yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/report-issue')}
            sx={{ mt: 2 }}
          >
            Submit Your First Report
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {reports.map((report) => (
            <Grid item xs={12} key={report._id}>
              <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {report.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {report.address}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={getCategoryLabel(report.category)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={report.status}
                        size="small"
                        color={getStatusColor(report.status)}
                        variant="filled"
                      />
                      <Chip
                        label={report.priority}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {report.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 4, mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Views
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {report.views}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Upvotes
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {report.upvotes}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Submitted
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default Reports

