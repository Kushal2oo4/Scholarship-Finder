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

    const { course, gpa, location, incomeStatus, specialCategory } = req.body;

    // Flexible query building
    const query = {};

    if (course && course !== "Any") query.course = course;
    if (location && location !== "Any") query.location = location;
    if (gpa) query.gpa = { $lte: parseFloat(gpa) };
    if (incomeStatus && incomeStatus !== "Any") query.incomeStatus = incomeStatus;
    if (specialCategory && specialCategory !== "None") query.specialCategory = specialCategory;

    console.log("Query used:", query); // optional debug log

    try {
      const results = await Scholarship.find(query).sort({ deadline: 1 });

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
