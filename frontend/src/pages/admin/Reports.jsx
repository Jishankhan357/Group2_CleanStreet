import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  Stack,
  Button
} from '@mui/material'
import { Refresh, Room, Flag } from '@mui/icons-material'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

const statusColor = {
  open: 'warning',
  'in-progress': 'info',
  resolved: 'success',
  rejected: 'default'
}

const AdminReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReports = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiClient.get('/reports', { params: { limit: 100 } })
      setReports(res.data.reports || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Reports</Typography>
        <Button variant="outlined" startIcon={<Refresh />} onClick={fetchReports} disabled={loading}>
          Refresh
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="500">{report.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{report.description?.slice(0, 60)}</Typography>
                </TableCell>
                <TableCell>
                  <Chip icon={<Flag sx={{ fontSize: 16 }} />} label={report.category} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.status}
                    color={statusColor[report.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.priority || 'medium'}
                    color={report.priority === 'high' || report.priority === 'critical' ? 'error' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Room sx={{ fontSize: 16, color: 'text.secondary' }} />
                    {report.address || '—'}
                  </Typography>
                </TableCell>
                <TableCell>{report.createdAt ? new Date(report.createdAt).toLocaleString() : '—'}</TableCell>
              </TableRow>
            ))}
            {!loading && reports.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">No reports found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}

export default AdminReports
