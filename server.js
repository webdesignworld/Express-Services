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

// Import routes
const challengeRoutes = require("./routes/challengeCreationRoute");
const categoryRoutes = require("./routes/challengesCategoriesListingRoute");
const gradingRoutes = require("./routes/gradingRoute");


app.use("/challenges", challengeRoutes); //challenges/challenges
app.use("/categories", categoryRoutes);
app.use("/grading", gradingRoutes); ///grading/grade


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
