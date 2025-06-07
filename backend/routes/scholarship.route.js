const express = require('express');
const router = express.Router();
const {
  fetchScholarshipsCom,
  getAllScholarships,
  getScholarshipsForStudent
} = require('../controllers/scholarship.controller');

router.get('/fetch', fetchScholarshipsCom); 
router.get('/all', getAllScholarships); 
router.get('/mysch', getScholarshipsForStudent); 

module.exports = router;
