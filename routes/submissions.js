const express = require('express');
const { body } = require('express-validator');
const { 
  submitTest, 
  getSubmissions, 
  getSubmissionDetails, 
  gradeSubmission 
} = require('../controllers/submissionController');
const { authenticateAdmin } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/:testId/submit', [
  body('takerName').notEmpty().trim(),
  body('takerEmail').isEmail().normalizeEmail(),
  body('answers').isObject()
], handleValidationErrors, submitTest);

// Admin routes
router.get('/', authenticateAdmin, getSubmissions);
router.get('/:id', authenticateAdmin, getSubmissionDetails);

// FIXED: Ensure this route matches what GradingInterface calls
router.post('/:id/grade', [
  authenticateAdmin,
  body('manualScore').isInt({ min: 0 })
], handleValidationErrors, gradeSubmission);

module.exports = router;