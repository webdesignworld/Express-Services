
const express = require("express");
const router = express.Router();
const Challenge = require("../models/challengeSchema"); // Your challenge model
const Submission = require("../models/submissionSchema"); // Your submission model
const requireCoder = require("../middleware/requireCoder"); // JWT-based authentication middleware

/**
 * 1. Solved Challenges Statistics endpoint
 *
 * Output format:
 * {
 *   "totalEasySolvedChallenges": 10,   The total number of Easy solved challenges
 *   "totalModerateSolvedChallenges": 2, The total number of Moderate solved challenges
 *   "totalHardSolvedChallenges": 1, The total number of Hard solved challenges
 *   "totalEasyChallenges": 111, The total number of Easy challenges that are available in the platform
 *   "totalModerateChallenges": 40, The total number of Moderate challenges that are available in the platform
 *   "totalHardChallenges": 5 The total number of Hard challenges that are available in the platform
 * }
 *
 * - "solved challenges" are determined by the coder's correct submissions.
 * - "total challenges" are the total available challenges per difficulty level.
 */
router.get("/solved-challenges", requireCoder, async (req, res) => {
  try {
    // 1. Get total challenges available per difficulty level.
    const challengeCounts = await Challenge.aggregate([
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 },
        },
      },
    ]);
    const totalChallenges = { Easy: 0, Moderate: 0, Hard: 0 };
    challengeCounts.forEach(item => {
      if (item._id === "Easy") totalChallenges.Easy = item.count;
      if (item._id === "Moderate") totalChallenges.Moderate = item.count;
      if (item._id === "Hard") totalChallenges.Hard = item.count;
    });

    // 2. Get number of solved challenges (i.e. passed submissions) for the authenticated coder.
    const solvedCounts = await Submission.aggregate([
      {
        $match: { 
          coderId: req.user.id, 
          passed: true 
        },
      },
      {
        $lookup: {
          from: "challenges",
          localField: "challengeId",
          foreignField: "_id",
          as: "challenge",
        },
      },
      { $unwind: "$challenge" },
      {
        $group: {
          _id: "$challenge.level",
          count: { $sum: 1 },
        },
      },
    ]);
    const solvedChallenges = { Easy: 0, Moderate: 0, Hard: 0 };
    solvedCounts.forEach(item => {
      if (item._id === "Easy") solvedChallenges.Easy = item.count;
      if (item._id === "Moderate") solvedChallenges.Moderate = item.count;
      if (item._id === "Hard") solvedChallenges.Hard = item.count;
    });

    const result = {
      totalEasySolvedChallenges: solvedChallenges.Easy,
      totalModerateSolvedChallenges: solvedChallenges.Moderate,
      totalHardSolvedChallenges: solvedChallenges.Hard,
      totalEasyChallenges: totalChallenges.Easy,
      totalModerateChallenges: totalChallenges.Moderate,
      totalHardChallenges: totalChallenges.Hard,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching solved challenges statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 2. Trending Categories Statistics
 *
 * Output format (sorted descending by count):
 * [
 *   { "category": "Data structure", "count": 300 },
 *   { "category": "Graphs", "count": 100 },
 *   { "category": "Tree", "count": 5 },
 *   { "category": "Math", "count": 1 }
 * ]
 *
 * Pipeline steps:
 * - Filter submissions to only include passed submissions.
 * - Perform a lookup from submissions to challenges.
 * - Group by challenge.category and accumulate a count.
 * - Sort the results by count in descending order.
 * - Project only the category and count fields.
 */
router.get("/trending-categories", requireCoder, async (req, res) => {
  try {
    const trendingCategories = await Submission.aggregate([
      { $match: { passed: true } },
      {
        $lookup: {
          from: "challenges",
          localField: "challengeId",
          foreignField: "_id",
          as: "challenge",
        },
      },
      { $unwind: "$challenge" },
      {
        $group: {
          _id: "$challenge.category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    return res.status(200).json(trendingCategories);
  } catch (error) {
    console.error("Error fetching trending categories statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 3. Heatmap
 *
 * Output format (one object per date):
 * [
 *   { "date": "2024/04/01", "count": 10 },
 *   { "date": "2024/04/02", "count": 5 },
 *   ...
 * ]
 *
 * - The user can specify start_date and end_date as query parameters.
 * - If not provided, default start_date to one year ago and end_date to today.
 * - Use aggregation to filter submissions for the authenticated coder (passed submissions only)
 *   within the specified date range.
 * - Add a new field "date" using $dateToString to format submittedAt as "YYYY/mm/dd".
 * - Group by the new date field and count the number of submissions per day.
 * - Project only the date and count fields.
 */
router.get("/heatmap", requireCoder, async (req, res) => {
  try {
    let { start_date, end_date } = req.query;
    const currentDate = new Date();
    if (!end_date) {
      end_date = currentDate;
    } else {
      end_date = new Date(end_date);
    }
    if (!start_date) {
      start_date = new Date(currentDate);
      start_date.setFullYear(start_date.getFullYear() - 1);
    } else {
      start_date = new Date(start_date);
    }

    const heatmap = await Submission.aggregate([
      {
        $match: {
          coderId: req.user.id,
          passed: true,
          submittedAt: { $gte: start_date, $lte: end_date },
        },
      },
      {
        $addFields: {
          date: { $dateToString: { format: "%Y/%m/%d", date: "$submittedAt" } },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    return res.status(200).json(heatmap);
  } catch (error) {
    console.error("Error fetching heatmap statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
