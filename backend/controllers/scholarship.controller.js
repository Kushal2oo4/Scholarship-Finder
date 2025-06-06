const Scholarship = require('../models/scholarship.model');
const User = require('../models/user.model'); // Changed from Student to User
const scrapeScholarshipsCom = require('../scrapers/scholarship.scraper');
const jwt = require('jsonwebtoken');


function convertDeadlineToDate(deadlineStr) {
  return new Date(deadlineStr);
}

const getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find();

    scholarships.sort((a, b) => {
      const dateA = convertDeadlineToDate(a.deadline);
      const dateB = convertDeadlineToDate(b.deadline);
      return dateA - dateB;
    });

    res.json(scholarships);
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const fetchScholarshipsCom = async (req, res) => {
  try {
    const scraped = await scrapeScholarshipsCom();

    for (let item of scraped) {
      await Scholarship.updateOne(
        { title: item.title },
        { $set: item },
        { upsert: true }
      );
    }

    res.status(200).json({ inserted: scraped.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATED: Get scholarships relevant to the logged-in user
const getScholarshipsForStudent = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    
  const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      const { gpa, course, location, amount, amountValue} = user;

      const query = {
        gpa: { $lte: gpa },
        amountValue: { $gte: amount },
      };

      const matchedScholarships = await Scholarship.find(query);
      matchedScholarships.sort((a, b) => {
        const dateA = convertDeadlineToDate(a.deadline);
        const dateB = convertDeadlineToDate(b.deadline);
        return dateA - dateB;
      });

      res.status(200).json(matchedScholarships);
    } 
    catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
  fetchScholarshipsCom,
  getAllScholarships,
  getScholarshipsForStudent
};
