const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import individual route files
const testRouter = require('./tests');
const submissionRouter = require('./submissions');
const adminRouter = require('./admin');

// Import auth controller
const { adminLogin } = require('../controllers/authController');
const { handleValidationErrors } = require('../middleware/validation');

// --- Auth Routes ---
router.post('/auth/admin/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], handleValidationErrors, adminLogin);

// --- Feature Routes ---
router.use('/tests', testRouter);
router.use('/submissions', submissionRouter);
router.use('/admin', adminRouter);

module.exports = router;