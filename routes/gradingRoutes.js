const express = require('express');
const { submitCode } = require('../controllers/gradingController');
const { validateSubmission } = require('../middleware/gradingValidator');

const router = express.Router();

// Route to post a submission
router.post('/submit', validateSubmission, submitCode);

module.exports = router;
