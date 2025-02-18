const express = require("express");
const router = express.Router();
const Challenge = require("../models/challengeSchema");
const Submission = require("../models/submissionSchema");
const authorize = require("../middleware/auth");

//test with user id, bypass auth
// const requireAuth = (req, res, next) => {
//   req.user = { id: "test-manager-id", role: "manager" };
//   next();
// };

//1. Implement a service to list all challenges.
router.get("/challenges", authorize(["manager", "coder"]), async (req, res) => {
  try {
    let challenges;


    if (req.user.role === "manager") { //2. If the requester is a manager, display only challenges created by them.
      challenges = await Challenge.find({ createdBy: req.user.id });
    } else if (req.user.role === "coder") {    // 3. If the requester is a coder, display all available challenges. 
      challenges = await Challenge.find({});
    } else {
      return res.status(403).json({ error: "Invalid role" });
    }

    const updatedChallenges = await Promise.all(
      challenges.map(async (challenge) => {
        const challengeObj = challenge.toObject();

        // 4. Include additional relevant information for each challenge, such as its
        // solution_rate, representing the percentage of coders who correctly
        // solved the challenge.

        if (challenge.attemptedCount > 0) {
          challengeObj.solution_rate =
            (challenge.solvedCount / challenge.attemptedCount) * 100; //percentage
        } else {
          challengeObj.solution_rate = 0;
        }

        //5. If the requester is a coder, display the status of each challenge as well.
        // Possible values for challenge status are:only for coder For coders, determine the submission
        // status:
        // waiting              The challenge has not been attempted or solved by that coder yet, attempted, completed

        //attempted             The challenge has been attempted which means that the coder has made a submission but it didn't pass

        //completed             The coder has successfully completed the challenge

        if (req.user.role === "coder") {
          const submission = await Submission.findOne({
            challengeId: challenge._id,
            coderId: req.user.id,
          });
          if (!submission) {
            challengeObj.status = "Waiting";
          } else if (!submission.passed) {
            challengeObj.status = "Attempted";
          } else if (submission.passed) {
            challengeObj.status = "Completed";
          }
        }
        return challengeObj;
      })
    );

    return res.status(200).json({ challenges: updatedChallenges });
  } catch (error) {
    console.error("Error listing challenges:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// The same thing should be done for getting the challenge by id.
router.get("/challenges/:id", requireAuth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    if (req.user.role === "manager" && challenge.createdBy !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const challengeObj = challenge.toObject();
    if (challenge.attemptedCount > 0) {
      challengeObj.solution_rate =
        (challenge.solvedCount / challenge.attemptedCount) * 100;
    } else {
      challengeObj.solution_rate = 0;
    }

    if (req.user.role === "coder") {
      const submission = await Submission.findOne({
        challengeId: challenge._id,
        coderId: req.user.id,
      });
      if (!submission) {
        challengeObj.status = "Waiting";
      } else if (!submission.passed) {
        challengeObj.status = "Attempted";
      } else if (submission.passed) {
        challengeObj.status = "Completed";
      }
    }

    return res.status(200).json({ challenge: challengeObj });
  } catch (error) {
    console.error("Error retrieving challenge by id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
