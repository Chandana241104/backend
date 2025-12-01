const express = require('express');
const { 
  getDashboardStats, 
  exportSubmissions 
} = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard/stats', authenticateAdmin, getDashboardStats);
router.get('/export', authenticateAdmin, exportSubmissions);

module.exports = router;