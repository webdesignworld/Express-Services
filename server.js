// const express = require("express");
// const port = process.env.PORT || 8000;
// const authRoutes = require("./routes/authRoutes");
// const challengeRoutes = require("./routes/challengeRoutes");
// const gradingRoutes = require("./routes/gradingRoutes");
// const leaderboardRoutes = require("./routes/leaderboardRoutes");
// const statisticsRoutes = require("./routes/statisticsRoutes");

// // const cors = require('cors'); does not like it

// // app.use(cors());

// const app = express();

// // Middleware for parsing JSON
// app.use(express.json());

// //setup validators folder as a middleware for various API endpoints
// app.use("/auth", authRoutes);

// app.use("/challenges", challengeRoutes);

// app.use("/grading", gradingRoutes);

// app.use("/leaderboard", leaderboardRoutes);

// app.use("/statistics", statisticsRoutes);

// app.listen(port, () => console.log(`Server is running on port ${port}`));



const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
require('dotenv').config();

// Database connection
const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


const challengeRoutes = require('./routes/challengeCreationRoute');
const categoryRoutes = require('./routes/challengesCategoriesListingRoute');

app.use('/', challengeRoutes);
app.use('/', categoryRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
