const express = require('express');
const {
    createChallenge,
    getAllChallenges,
    getChallengeById,
    updateChallenge,
    deleteChallenge,
} = require('../controllers/challengeController');

const router = express.Router();

router.post('/', createChallenge); //1. challenge creation
router.get('/', getAllChallenges); //3. challenge listing
router.get('/:id', getChallengeById); //4. challenge listing by id


router.put('/:id', updateChallenge);
router.delete('/:id', deleteChallenge);

module.exports = router;
