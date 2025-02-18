const express = require("express");
const axios = require("axios");
const router = express.Router();
const Challenge = require("../models/challengeSchema");
const Submission = require("../models/submissionSchema");
const User = require("../models/userSchema");
const authorize = require("../middleware/auth");

router.post("/grade", authorize(["coder"]), async (req, res) => {
  try {
    const { challenge_id, lang, code } = req.body;
    if (!challenge_id || !lang || !code) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 3. We don't allow coders to submit correct solutions twice. So you should
    // send a response indicating that the challenge has already been solved.

    const existingSubmission = await Submission.findOne({
      challengeId: challenge_id,
      coderId: req.user.id,
      passed: true,
    });
    if (existingSubmission) {
      return res.status(400).json({ error: "Challenge already solved" });
    }

    const challenge = await Challenge.findById(challenge_id);
    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }
    // 4. The grader should take the submitted code and invoke the code runner
    // service.
    const payload = {
      lang: lang,
      code: code,
      func_name: challenge.code.function_name,
      tests: challenge.tests.map((test) => {
        return {
          _id: test._id,
          inputs: test.inputs.map((input) => ({ value: input.value ?? input })),
          output: test.output,
        };
      }),
    };
    //5. You should, based on the language provided in the submission, create a
    // grading payload and send it to the code test runner (Its URL is
    //     provided below).

    const runnerUrl = "https://runlang-v1.onrender.com/run";
    const runnerResponse = await axios.post(runnerUrl, payload);
    const runnerData = runnerResponse.data;

    if (runnerData.status !== "passed") {
      const submissionRecord = new Submission({
        challengeId: challenge_id,
        coderId: req.user.id,
        passed: false,
        score: 0,
      });
      await submissionRecord.save();

      return res.status(200).json({
        status: "failed",
        message: runnerData.message || "Tests failed",
        test_results: runnerData.test_results,
        score: 0, //6. If the tests fail then the submission fails and the score remains 0.
      });
    }

    let score = 0;
    challenge.tests.forEach((test) => {
      const testResult = runnerData.test_results.find(
        (tr) => tr.test_id === test._id.toString()
      );
      if (testResult && testResult.status === "passed") {
        score += test.weight * 100; //7. If the tests pass then the submission passes and the score should be
        // calculated using this formula: score = sum over all test cases
      }
    });

    const submissionRecord = new Submission({
      challengeId: challenge_id,
      coderId: req.user.id,
      passed: true,
      score: score,
    });
    await submissionRecord.save();

    // Update user score (if you have a User model):
    await User.findByIdAndUpdate(req.user.id, { $inc: { totalScore: score } }); // 8. This score should be added to the total score of the user.

    return res.status(200).json({
      status: "passed",
      message: runnerData.message || "Submission graded",
      test_results: runnerData.test_results,
      score: score,
    });
  } catch (error) {
    console.error("Error during grading:", error);
    return res.status(500).json({ error: "Internal server error" }); // 9. Make sure to return proper responses in case of errors.
  }
});

module.exports = router;
