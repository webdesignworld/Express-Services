const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { validateTopKCoders } = require('../middleware/leaderboardValidator'); // Import the validation middleware

// Route to get the leaderboard
router.get('/', leaderboardController.getLeaderboard);

// Route to get the top K coders (with validation for `k` query parameter)
router.get('/top', validateTopKCoders, leaderboardController.getTopKCoders);

module.exports = router;


