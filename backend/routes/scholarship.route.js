const express = require('express');
const router = express.Router();
const {
  fetchScholarshipsCom,
  getAllScholarships,
  getScholarshipsForStudent
} = require('../controllers/scholarship.controller');

router.get('/fetch', fetchScholarshipsCom); // For admin or cron usage
router.get('/all', getAllScholarships); // Public/all users
router.get('/mysch', getScholarshipsForStudent); // 🔐 Protected

module.exports = router;
