const mongoose = require("mongoose");

const ScholarshipSchema = new mongoose.Schema({
  title: String,
  description: String,
  course: String,
  gpa: Number,
  location: String,
  amount: String,
  deadline: Date,
  link: String,
  incomeStatus: String,        
  specialCategory: String      
});

module.exports = mongoose.model("Scholarship", ScholarshipSchema);
