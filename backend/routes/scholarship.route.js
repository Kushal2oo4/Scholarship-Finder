
const express = require('express');
const router = express.Router();

const {
  fetchScholarshipsCom,
  getAllScholarships,
  getScholarshipsForStudent,
  getAlerts,
  setAlertDays,
  getSaved,
  saveScholarship,
  unsaveScholarship
} = require('../controllers/scholarship.controller');

router.get('/fetch', fetchScholarshipsCom);
router.get('/all', getAllScholarships);
router.get('/mysch', getScholarshipsForStudent);

router.get('/alerts', getAlerts);
router.put('/alert-days', setAlertDays);

router.get('/saved', getSaved);
router.post('/save/:id', saveScholarship);
router.delete('/save/:id', unsaveScholarship);

module.exports = router;
