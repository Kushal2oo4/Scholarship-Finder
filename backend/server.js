const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const scholarshipscraper = require('./scrapers/scholarship.scraper');
const scholarshipModel = require('./models/scholarship.model');

const scholarshiproutes = require('./routes/scholarship.route');
const authRoutes = require('./routes/auth.route');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Base route
app.get('/', (req, res) => {
  res.send('🎓 Scholarship Finder API');
});

// Routes
app.use('/api/scholarships', scholarshiproutes);
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    const results = await scholarshipscraper();

    // Refresh DB with latest scholarships
    await scholarshipModel.deleteMany({});
    await scholarshipModel.insertMany(results);

    console.log(`📥 Scraped and stored ${results.length} scholarships on startup.`);
  } catch (err) {
    console.error('❌ Error scraping or saving scholarships:', err);
  }
});
