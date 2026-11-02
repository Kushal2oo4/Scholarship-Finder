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


const getUserFromRequest = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id).select('-password');
  } catch (err) {
    return null;
  }
};

const getAlerts = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.gpa == null || user.amount == null) {
      return res.json({ alertDays: user.alertDays, alerts: [] });
    }

    const matched = await Scholarship.find({
      gpa: { $lte: user.gpa },
      amountValue: { $gte: user.amount },
    });

    const now = new Date();
    const limit = new Date();
    limit.setDate(limit.getDate() + user.alertDays);

    const alerts = matched.filter((s) => {
      const due = convertDeadlineToDate(s.deadline);
      return !isNaN(due) && due >= now && due <= limit;
    });

    alerts.sort((a, b) => {
      return convertDeadlineToDate(a.deadline) - convertDeadlineToDate(b.deadline);
    });

    res.json({ alertDays: user.alertDays, alerts });
  } catch (err) {
    console.error('Alerts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const setAlertDays = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const days = parseInt(req.body.alertDays, 10);

    if (isNaN(days) || days < 1 || days > 60) {
      return res.status(400).json({
        message: 'alertDays must be between 1 and 60'
      });
    }

    await User.findByIdAndUpdate(user._id, { alertDays: days });

    res.json({ alertDays: days });
  } catch (err) {
    console.error('Set alert days error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  fetchScholarshipsCom,
  getAllScholarships,
  getScholarshipsForStudent,
  getAlerts,
  setAlertDays,
};
