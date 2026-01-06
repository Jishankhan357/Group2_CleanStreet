import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'

const Map = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          City Map
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View all reported issues on the interactive city map.
        </Typography>
        <Box sx={{ mt: 4, height: '500px', bgcolor: 'background.default', borderRadius: 2 }}>
          {/* Map component will go here */}
        </Box>
      </Paper>
    </Container>
  )
}

export default Map
