const express = require('express');
const { getTestsByRole, getTestById } = require('../controllers/testController');

const router = express.Router();

router.get('/', getTestsByRole);
router.get('/:id', getTestById);

module.exports = router;