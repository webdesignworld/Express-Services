const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
require("dotenv").config();

// Database connection
const connectDB = require("./config/db");
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

const authorize = require("./middleware/auth");

// Import routes
const challengeRoutes = require("./routes/challengeCreationRoute");
const categoryRoutes = require("./routes/challengesCategoriesListingRoute");
const gradingRoutes = require("./routes/gradingRoute");
const leaderboardRoutes = require("./routes/leaderboardRoute");
const signupRoutes = require("./routes/signupRoutes");
const loginRoutes = require("./routes/loginRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const statsRoutes = require("./routes/statsRoute");

app.use("/auth", signupRoutes);
app.use("/auth", loginRoutes);
app.use("/auth", verifyRoutes);

app.use("/challenges", challengeRoutes); //1. challenge creation 2. challenge listing 
app.use("/categories", categoryRoutes); //4. categories listing 
app.use("/grading", gradingRoutes); //Grading
app.use("/leaderboard", leaderboardRoutes);//leaderboard
app.use("/stats", statsRoutes); //sys stat

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
