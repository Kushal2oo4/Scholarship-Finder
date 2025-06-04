const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (replace with your MongoDB URI)
mongoose.connect("mongodb://localhost:27017/scholarships", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const scholarshipSchema = new mongoose.Schema({
  title: String,
  award: String,
  eligibility: String,
});

const Scholarship = mongoose.model("Scholarship", scholarshipSchema);

// API route to get scholarships with optional filtering
app.get("/api/scholarships", async (req, res) => {
  const { year = "", course = "" } = req.query;
  try {
    // Case-insensitive regex filter for eligibility
    const filter = {};
    if (year) filter.eligibility = { $regex: year, $options: "i" };
    if (course) {
      // If eligibility already has filter, combine with AND
      if (filter.eligibility) {
        filter.eligibility = {
          $regex: `(?=.*${year})(?=.*${course})`, // positive lookaheads to match both
          $options: "i",
        };
      } else {
        filter.eligibility = { $regex: course, $options: "i" };
      }
    }

    const scholarships = await Scholarship.find(filter);
    res.json(scholarships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
