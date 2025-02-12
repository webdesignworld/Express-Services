
const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { validateStatisticsQuery,  validateDateRange  } = require('../middleware/statisticsValidator'); 

// Route to get solved challenges statistics
router.get('/solved-challenges', validateDateRange, statisticsController.getSolvedChallengesStats);

// Route to get trending categories
router.get('/trending-categories', statisticsController.getTrendingCategories);


// Route to get heatmap from statistics validator middleware
router.get('/heatmap', validateStatisticsQuery, statisticsController.getHeatmap);

module.exports = router;
