const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // To load .env

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Use Routes
const matchRoute = require("./routes/match");
app.use("/api/match", matchRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
