const express = require("express");
const router = express.Router();
const Scholarship = require("../models/scholarship");

// POST /api/match
router.post("/", async (req, res) => {
  const { course, gpa, location, incomeStatus, specialCategory } = req.body;

  try {
    const results = await Scholarship.find({
      course: course,
      location: location,
      gpa: { $lte: parseFloat(gpa) },
    }).sort({ deadline: 1 }); // soonest deadlines first

    // res.json(results);
    res(console.log("Yay!"));
    res.send({
      scholarships: results,
      message: "Scholarships matched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
