const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const Submission = require("../models/submissionSchema");
const authorize = require ("../middleware/auth")

// const requiremyCoder = (req, res, next) => {
//   req.user = { id: "67addfce5fb6d2d47a9ea4f7", role: "coder" };
//   if (req.user.role !== "coder") {
//     return res
//       .status(403)
//       .json({ error: "Only coders can view this information." }); // 1. First, make sure to protect the route for this service so that only coders
//     //     are allowed to see the leaderboard.
//   }
//   next();
// };

/**
 * GET 2. Add the service to get the leaderboard.
 * - 3. The leaderboard should list all the coders sorted by their score (from the
highest to the lowest).
 * - 4. You should add the number of solved_challenges for each coder in
the response. Solved challenges are the challenges from the coder's
correct submissions.
 */
router.get("/leaderboard", authorize(["coder"]), async (req, res) => {
  try {
    // Aggregate users with role "coder"
    const leaderboard = await User.aggregate([
      // Only include users with the "coder" role.
      { $match: { role: "coder" } },
      // Lookup corresponding submissions from the submissions collection.
      {
        $lookup: {
          from: "submissions", // collection name in MongoDB (usually lower-cased and pluralized)
          localField: "_id",
          foreignField: "coderId",
          as: "submissions",
        },
      },
      // Add a new field "solvedChallenges" by filtering submissions that passed.
      {
        $addFields: {
          solvedChallenges: {
            $size: {
              $filter: {
                input: "$submissions",
                as: "sub",
                cond: { $eq: ["$$sub.passed", true] },
              },
            },
          },
        },
      },
      // Sort coders by totalScore descending.
      { $sort: { totalScore: -1 } },
      // Project only the fields we want to return.
      {
        $project: {
          username: 1,
          totalScore: 1,
          solvedChallenges: 1,
        },
      },
    ]);

    return res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /leaderboard/top/:k
 * - Lists only the top k coders based on total score.
 * - Route is protected so that only a coder can request the top k.
 */
router.get("/leaderboard/top/:k", requiremyCoder, async (req, res) => {
  try {
    const k = parseInt(req.params.k, 10);
    if (isNaN(k) || k <= 0) {
      return res.status(400).json({ error: "Invalid value for k" });
    }

    // Similar aggregation as before, but limit to the top k coders.
    const topCoders = await User.aggregate([
      { $match: { role: "coder" } },
      {
        $lookup: {
          from: "submissions",
          localField: "_id",
          foreignField: "coderId",
          as: "submissions",
        },
      },
      {
        $addFields: {
          solvedChallenges: {
            $size: {
              $filter: {
                input: "$submissions",
                as: "sub",
                cond: { $eq: ["$$sub.passed", true] },
              },
            },
          },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: k },
      {
        $project: {
          username: 1,
          totalScore: 1,
          solvedChallenges: 1,
        },
      },
    ]);

    return res.status(200).json({ topCoders });
  } catch (error) {
    console.error("Error fetching top coders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
