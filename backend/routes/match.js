const express = require("express");
const router = express.Router();
const Scholarship = require("../models/scholarship");
const { body, validationResult } = require("express-validator");

// POST /api/match
router.post(
  "/",
  [
    body("course").notEmpty().withMessage("Course is required"),
    body("gpa").isFloat({ min: 0 }).withMessage("GPA must be a valid number"),
    body("location").notEmpty().withMessage("Location is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { course, gpa, location } = req.body;

    try {
      const results = await Scholarship.find({
        course,
        location,
        gpa: { $lte: parseFloat(gpa) },
      }).sort({ deadline: 1 }); // soonest deadlines first

      if (results.length === 0) {
        return res.status(404).json({ message: "No scholarships found" });
      }

      res.json({
        scholarships: results,
        message: "Scholarships matched successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
