const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import your route modules
const testRouter = require('./tests');
const submissionRouter = require('./submissions');
const adminRouter = require('./admin');

// Import controllers for direct auth routes
const { adminLogin } = require('../controllers/authController');
const { handleValidationErrors } = require('../middleware/validation');

// --- Auth Routes ---
router.post('/auth/admin/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], handleValidationErrors, adminLogin);

// --- Resource Routes ---
router.use('/tests', testRouter);
router.use('/submissions', submissionRouter);
router.use('/admin', adminRouter);

module.exports = router;