const Scholarship = require('../models/scholarship.model');
const User = require('../models/user.model');
const scrapeScholarshipsCom = require('../scrapers/scholarship.scraper');
const jwt = require('jsonwebtoken');

// Convert deadline string to Date object
function convertDeadlineToDate(deadlineStr) {
  return new Date(deadlineStr);
}

// All scholarships sorted by deadline
const getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find();

    // Sort by ascending deadline
    scholarships.sort((a, b) => {
      return convertDeadlineToDate(a.deadline) - convertDeadlineToDate(b.deadline);
    });

    res.json(scholarships);
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Scrape and upsert scholarships from scholarships.com
const fetchScholarshipsCom = async (req, res) => {
  try {
    const scraped = await scrapeScholarshipsCom();

    for (const item of scraped) {
      await Scholarship.updateOne(
        { title: item.title },  
        { $set: item },         
        { upsert: true }         
      );
    }

    res.status(200).json({ inserted: scraped.length });
  } catch (error) {
    console.error('Scraping failed:', error);
    res.status(500).json({ error: error.message });
  }
};

// Scholarships matched to the logged-in user
const getScholarshipsForStudent = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { gpa, amount } = user;

    // Filter scholarships matching user profile
    const query = {
      gpa: { $lte: gpa },
      amountValue: { $gte: amount },
    };

    const matchedScholarships = await Scholarship.find(query);

    // Sort by deadline
    matchedScholarships.sort((a, b) => {
      return convertDeadlineToDate(a.deadline) - convertDeadlineToDate(b.deadline);
    });

    res.status(200).json(matchedScholarships);
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  fetchScholarshipsCom,
  getAllScholarships,
  getScholarshipsForStudent,
};
