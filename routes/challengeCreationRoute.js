const express = require("express");
const router = express.Router();
const Challenge = require("../models/challengeSchema");
const Submission = require("../models/submissionSchema");
const authorize = require("../middleware/auth");

//Generated a dummy token for manager role from (node generateToken.js)   (see console and copy token into Auth Headers)

// 1. Challenge Creation 
router.post("/challenges", authorize(["manager"]), async (req, res) => {
  try {
    // Destructure required fields from the request body
    const { title, category, description, level, code, tests } = req.body;

    // Validate that all required fields are present
    if (!title || !category || !description || !level || !code || !tests) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new challenge document
    const newChallenge = new Challenge({
      title, //"factorial",
      category, //"Math",
      description, //"### Problem Statement:\nCompute the factorial of a non-negative integer `n`.\n\n### Example:\nFor example, the factorial of `5` is `120`.",
      level, //"Hard",
      code, // "function_name": "factorial",
      // "code_text": [
//         {
//           "language": "py",
//           "text": "def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)",
//           "_id": "67b4a471eb4fb345159237e1"
//       },
//       {
//           "language": "js",
//           "text": "function factorial(n) {\n    if (n === 0) return 1;\n    return n * factorial(n-1);\n}",
//           "_id": "67b4a471eb4fb345159237e2"
//       }
//   ],
//   "inputs": [
//       "[ { name: 'n', type: 'number' } ]"
//   ]
// },
      tests,
      //  "tests": [
  //       {
  //         "weight": 1,
  //         "inputs": [
  //             {
  //                 "name": "n",
  //                 "value": 5,
  //                 "_id": "67b4a471eb4fb345159237e4"
  //             }
  //         ],
  //         "output": 120,
  //         "_id": "67b4a471eb4fb345159237e3"
  //     }
  // ],
      createdBy: req.user.id, // Associate the challenge with the manager
      createdAt: new Date(),
    });

    // Save the challenge in the database
    const savedChallenge = await newChallenge.save();
    return res.status(201).json({
      message: "Challenge created successfully",
      challenge: savedChallenge,
    });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return res.status(500).json({ error: "Internal server error" }); //Make sure to return proper responses upon successful creation and
    // report any errors
  }
});

module.exports = router;
