const express = require('express');
const { body } = require('express-validator');
const { adminLogin } = require('../controllers/authController');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/admin/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], handleValidationErrors, adminLogin);

module.exports = router;