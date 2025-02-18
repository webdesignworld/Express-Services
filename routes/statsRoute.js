
const express = require("express");
const router = express.Router();
const Challenge = require("../models/challengeSchema"); // Your challenge model
const Submission = require("../models/submissionSchema"); // Your submission model
// const requireCoder = require("../middleware/requireCoder"); // JWT-based authentication middleware
const authorize = require ("../middleware/auth")

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
router.get("/solved-challenges", authorize(["coder"]), async (req, res) => { //protect the route of the trending categories from auth
  try {
    // 1. Get total challenges available per each level.
    const challengeCounts = await Challenge.aggregate([
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 },
        },
      },
    ]);

    //total count for each level
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

     // Create an object to store correct submissions per level
    const solvedChallenges = { Easy: 0, Moderate: 0, Hard: 0 };
    solvedCounts.forEach(item => {
      if (item._id === "Easy") solvedChallenges.Easy = item.count;
      if (item._id === "Moderate") solvedChallenges.Moderate = item.count;
      if (item._id === "Hard") solvedChallenges.Hard = item.count;
    });

    const result = {
      totalEasySolvedChallenges: solvedChallenges.Easy, //The total number of Easy solved challenges (say 10)
      totalModerateSolvedChallenges: solvedChallenges.Moderate, // The total number of Moderate solved challenges (say 2)
      totalHardSolvedChallenges: solvedChallenges.Hard, // The total number of Hard solved challenges (say 1)
      totalEasyChallenges: totalChallenges.Easy,  // The total number of Easy challenges that are available in the platform (say 111)
      totalModerateChallenges: totalChallenges.Moderate, // The total number of Moderate challenges that are available in the platform (say 40)
      totalHardChallenges: totalChallenges.Hard, // The total number of Hard challenges that are available in the platform (say 5)
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
 * 1. Filter submissions Filter submissions to include only those that were correctly passed to
ensure that only passed submissions are considered for further
processing in the pipeline.
 * - 2. Perform a lookup (similar to SQL join operation) from submissions to
challenges.
 * - 3. Next, you can group the result by category and cumulate the number
of occurrences denoted by count.
4. Next, you can add the category field to the result which is the o
expected in the output
 * - 5. Next, you have to sort the results based on the count in descending
order.
 * - 6. Finally, you have to project the result and keep the category and
count fields only
 */
router.get("/trending-categories", authorize(["coder"]), async (req, res) => { //protect the route of the trending categories requireCoder middleware
  try {
    const trendingCategories = await Submission.aggregate([ //filter the submissions to only include those with passed: true.
      { $match: { passed: true } },
      {
        $lookup: { //performs a lookup from the Submission collection to the Challenge collection
          from: "challenges",
          localField: "challengeId",
          foreignField: "_id",
          as: "challenge",
        },
      },
      { $unwind: "$challenge" }, //unwinds the joined challenge array with $unwind to work with a single challenge object
      {
        $group: { //groups the data by the challenge's category field while summing the occurrences
          _id: "$challenge.category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, //sorts the results by the count in descending order
      {
        $project: {
          _id: 0,          
          category: "$_id", //category
          count: 1, //count
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
router.get("/heatmap", authorize(["coder"]), async (req, res) => {
  try {
    let { start_date, end_date } = req.query; //extract start_date and end_date from the query parameters.
    const currentDate = new Date();
    if (!end_date) {    // If end_date is not provided, it defaults to the current date. Otherwise, it converts the string to a Date object.
      end_date = currentDate;
    } else {
      end_date = new Date(end_date);
    }
    if (!start_date) { //If start_date is not provided, it defaults to one year before the current date. Otherwise, it converts the provided string to a Date object.
      start_date = new Date(currentDate);
      start_date.setFullYear(start_date.getFullYear() - 1);
    } else {
      start_date = new Date(start_date);
    }



     console.log("start_date:", start_date);
     console.log("end_date:", end_date);

    const heatmap = await Submission.aggregate([
      {
        $match: {
          coderId: req.user.id, //coderId matches req.user.id from my require coder middleware
          passed: true, // passed true
          submittedAt: { $gte: start_date, $lte: end_date }, // submittedAt is within the provided date range in ISO format 2025-02-13T08:53:10.983+00:00
        },
      },
      {
        $addFields: { //Add a new field called date which formats the submittedAt field into a string in the YYYY/mm/dd format.
          date: { $dateToString: { format: "%Y/%m/%d", date: "$submittedAt" } },
        },
      },
      {
        $group: { //Groups the submissions by the newly created date field and calculates the count for each group.
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      {
        $project: { //projects the final output to only include the date and count fields.
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      { $sort: { date: 1 } }, //Sorts the results in ascending order based on the date.
    ]);

    return res.status(200).json(heatmap); //Return the aggregated heatmap data as a JSON response.
  } catch (error) {
    console.error("Error fetching heatmap statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
