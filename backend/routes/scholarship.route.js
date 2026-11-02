
const express = require('express');
const router = express.Router();

const {
  fetchScholarshipsCom,
  getAllScholarships,
  getScholarshipsForStudent,
  getAlerts,
  setAlertDays
} = require('../controllers/scholarship.controller');

router.get('/fetch', fetchScholarshipsCom);
router.get('/all', getAllScholarships);
router.get('/mysch', getScholarshipsForStudent);

router.get('/alerts', getAlerts);
router.put('/alert-days', setAlertDays);

module.exports = router;
