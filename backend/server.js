const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const scholarshipscraper = require('./scrapers/scholarship.scraper')
const scholarshipModel = require('./models/scholarship.model');

const scholarshiproutes = require('./routes/scholarship.route'); 
const auth = require('./routes/auth.route'); 

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));


app.get('/', (req, res) => {
    res.send("Scholarship Finder API");
});
app.use('/api/scholarships', scholarshiproutes);
app.use('/api/auth', auth); // Correct mounting


const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {  
  console.log(`Server running on port ${PORT}`);

  try {
    const results = await scholarshipscraper();

    await scholarshipModel.deleteMany({});
    await scholarshipModel.insertMany(results);

    console.log(`Scraped and saved ${results.length} scholarships on startup.`);
  } catch (err) {
    console.error('Error running scraper or saving to DB:', err);
  }
});