const express = require('express');
const router = express.Router();
const Challenge = require('../models/challengeSchema');
const Submission = require('../models/submissionSchema'); 

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

      
      module.exports = router;
      
