import express from 'express'
import Report from '../models/Report.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).json({
    success: false,
    error: 'Not authenticated'
  })
}

// Create a new report
router.post('/create', isAuthenticated, [
  body('category').isIn(['garbage', 'pothole', 'water', 'streetlight', 'park', 'sewage', 'vandalism', 'other']),
  body('title').trim().notEmpty().isLength({ min: 5 }),
  body('description').trim().notEmpty().isLength({ min: 10 }),
  body('address').trim().notEmpty(),
  body('latitude').isFloat(),
  body('longitude').isFloat(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical'])
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const {
      category,
      title,
      description,
      priority = 'medium',
      latitude,
      longitude,
      address,
      isAnonymous = false,
      allowComments = true
    } = req.body

    const report = new Report({
      userId: req.user._id,
      category,
      title,
      description,
      priority,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      latitude,
      longitude,
      address,
      isAnonymous,
      allowComments
    })

    await report.save()

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      report: {
        id: report._id,
        category: report.category,
        title: report.title,
        status: report.status,
        createdAt: report.createdAt
      }
    })
  } catch (error) {
    console.error('Report creation error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create report'
    })
  }
})

// Get user's reports
router.get('/my-reports', isAuthenticated, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .select('-comments')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      reports,
      count: reports.length
    })
  } catch (error) {
    console.error('Fetch reports error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports'
    })
  }
})

// Get single report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('userId', 'name email profilePicture')

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      })
    }

    res.json({
      success: true,
      report
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report'
    })
  }
})

// Update report status (admin only)
router.put('/:id/status', isAuthenticated, [
  body('status').isIn(['open', 'in-progress', 'resolved', 'rejected'])
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { status } = req.body
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'resolved' && { resolvedAt: new Date(), resolvedBy: req.user._id })
      },
      { new: true }
    )

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      })
    }

    res.json({
      success: true,
      message: 'Report status updated',
      report
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update report'
    })
  }
})

// Get all reports (public)
router.get('/', async (req, res) => {
  try {
    const { category, status, priority, limit = 50, page = 1 } = req.query

    const filter = {}
    if (category) filter.category = category
    if (status) filter.status = status
    if (priority) filter.priority = priority

    const skip = (page - 1) * limit

    const reports = await Report.find(filter)
      .select('-comments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean()

    const total = await Report.countDocuments(filter)

    res.json({
      success: true,
      reports,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports'
    })
  }
})

export default router
