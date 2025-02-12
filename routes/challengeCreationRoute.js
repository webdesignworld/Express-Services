
const express = require('express');
const router = express.Router();
const Challenge = require('../models/challenge');
const Submission = require('../models/submission'); // For later use in listings

// Dummy authentication middleware for testing
const requireAuth = (req, res, next) => {
  // In production, authentication middleware would verify the user.
  // For testing, we hardcode a user (e.g., a manager creating a challenge).
  req.user = { id: 'test-manager-id', role: 'manager' };
  next();
};

// 1. Challenge Creation Service
router.post('/challenges', requireAuth, async (req, res) => {
  try {
    // Destructure required fields from the request body
    const { title, category, description, level, code, tests } = req.body;

    // Validate that all required fields are present
    if (!title || !category || !description || !level || !code || !tests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new challenge document
    const newChallenge = new Challenge({
      title,
      category,
      description,
      level,
      code,
      tests,
      createdBy: req.user.id, // Associate the challenge with the manager
      createdAt: new Date()
    });

    // Save the challenge in the database
    const savedChallenge = await newChallenge.save();
    return res.status(201).json({
      message: 'Challenge created successfully',
      challenge: savedChallenge
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// // 2. Challenge Listing Service
// router.get('/challenges', requireAuth, async (req, res) => {
//         try {
//           let challenges;
//           // If the user is a manager, show only challenges they created; if a coder, show all challenges.
//           if (req.user.role === 'manager') {
//             challenges = await Challenge.find({ createdBy: req.user.id });
//           } else if (req.user.role === 'coder') {
//             challenges = await Challenge.find({});
//           } else {
//             return res.status(403).json({ error: 'Invalid role' });
//           }
      
//           // Process each challenge to include additional information
//           const updatedChallenges = await Promise.all(challenges.map(async (challenge) => {
//             const challengeObj = challenge.toObject();
      
//             // Compute solution_rate (if any attempts exist)
//             if (challenge.attemptedCount > 0) {
//               challengeObj.solution_rate = (challenge.solvedCount / challenge.attemptedCount) * 100;
//             } else {
//               challengeObj.solution_rate = 0;
//             }
      
//             // For coders, determine the submission status
//             if (req.user.role === 'coder') {
//               const submission = await Submission.findOne({
//                 challengeId: challenge._id,
//                 coderId: req.user.id
//               });
//               if (!submission) {
//                 challengeObj.status = 'Waiting';
//               } else if (!submission.passed) {
//                 challengeObj.status = 'Attempted';
//               } else if (submission.passed) {
//                 challengeObj.status = 'Completed';
//               }
//             }
//             return challengeObj;
//           }));
      
//           return res.status(200).json({ challenges: updatedChallenges });
//         } catch (error) {
//           console.error('Error listing challenges:', error);
//           return res.status(500).json({ error: 'Internal server error' });
//         }
//       });
      
      // 3. Get Challenge by ID Service
      // router.get('/challenges/:id', requireAuth, async (req, res) => {
      //   try {
      //     const challenge = await Challenge.findById(req.params.id);
      //     if (!challenge) {
      //       return res.status(404).json({ error: 'Challenge not found' });
      //     }
      
      //     // If the user is a manager, ensure they can only access their own challenge
      //     if (req.user.role === 'manager' && challenge.createdBy !== req.user.id) {
      //       return res.status(403).json({ error: 'Unauthorized access' });
      //     }
      
      //     const challengeObj = challenge.toObject();
      //     if (challenge.attemptedCount > 0) {
      //       challengeObj.solution_rate = (challenge.solvedCount / challenge.attemptedCount) * 100;
      //     } else {
      //       challengeObj.solution_rate = 0;
      //     }
      
      //     if (req.user.role === 'coder') {
      //       const submission = await Submission.findOne({
      //         challengeId: challenge._id,
      //         coderId: req.user.id
      //       });
      //       if (!submission) {
      //         challengeObj.status = 'Waiting';
      //       } else if (!submission.passed) {
      //         challengeObj.status = 'Attempted';
      //       } else if (submission.passed) {
      //         challengeObj.status = 'Completed';
      //       }
      //     }
      
      //     return res.status(200).json({ challenge: challengeObj });
      //   } catch (error) {
      //     console.error('Error retrieving challenge by id:', error);
      //     return res.status(500).json({ error: 'Internal server error' });
      //   }
      // });
      
      module.exports = router;
      
