// // const express = require("express");
// // const cors = require("cors");
// // const app = express();
// // const port = process.env.PORT || 8000;
// // require("dotenv").config();

// // // Database connection
// // const connectDB = require("./config/db");
// // connectDB();

// // // Middleware
// // app.use(cors());
// // app.use(express.json());

// // app.use("/auth", authRoutes); //for userSchema 

// // // Import routes
// // const challengeRoutes = require("./routes/challengeCreationRoute");
// // const categoryRoutes = require("./routes/challengesCategoriesListingRoute");
// // const gradingRoutes = require("./routes/gradingRoute");
// // const leaderboardRoutes = require("./routes/leaderboardRoute");
// // const authRoutes = require("./routes/authRoute");

// // app.use("/challenges", challengeRoutes); //challenges/challenges
// // app.use("/categories", categoryRoutes);
// // app.use("/grading", gradingRoutes); ///grading/grade
// // app.use("/leaderboard", leaderboardRoutes);


// // app.listen(port, () => {
// //   console.log(`Server is running on port ${port}`);
// // });


// const express = require("express");
// const cors = require("cors");
// const app = express();
// const port = process.env.PORT || 8000;
// require("dotenv").config();

// // Database connection
// const connectDB = require("./config/db");
// connectDB();

// // Middleware
// app.use(cors());
// const authorize = require("./middleware/auth");
// app.use(express.json());

// app.get("/protected", authorize(["Coder", "Manager"]), (req, res) => {
//   res.send(`Hello, ${req.user.email}. Your role is ${req.user.role}.`);
// });


// // Import routes

// const challengeRoutes = require("./routes/challengeCreationRoute");
// const categoryRoutes = require("./routes/challengesCategoriesListingRoute");
// const gradingRoutes = require("./routes/gradingRoute");
// const leaderboardRoutes = require("./routes/leaderboardRoute");
// const signupRoutes = require("./routes/signupRoutes");  
// const loginRoutes = require("./routes/loginRoutes");   
// const verifyRoutes = require("./routes/verifyRoutes");





// app.use("/auth", authRoute); // e.g., /auth/register, /auth/login
// app.use("/challenges", challengeRoutes);
// app.use("/categories", categoryRoutes);
// app.use("/grading", gradingRoutes);
// app.use("/leaderboard", leaderboardRoutes);


// app.use("/auth", signupRoutes);  
// app.use("/auth", loginRoutes);   
// app.use("/auth", verifyRoutes); 



// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

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

app.use("/challenges", challengeRoutes);
app.use("/categories", categoryRoutes);
app.use("/grading", gradingRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/stats", statsRoutes); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
