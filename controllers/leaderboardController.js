
const mockLeaderboard = [
    { username: 'user1', score: 150 },
    { username: 'user2', score: 200 },
    { username: 'user3', score: 100 },
    { username: 'user4', score: 250 },
    { username: 'user5', score: 180 },
    { username: 'user6', score: 300 },
    { username: 'user7', score: 50 },
    { username: 'user8', score: 400 }
];
const Joi = require('joi');

const getLeaderboard = (req, res) => {
    try {
        const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => b.score - a.score);
        res.json(sortedLeaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
};




  //get top coders 

const getTopKCoders = (req, res) => {
    try {
        const kSchema = Joi.number().integer().min(1).positive();
        const validationResult = kSchema.validate(req.query.k);

        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error.details });
        }

        const k = validationResult.value;
        const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => b.score - a.score);
        const topKCoders = sortedLeaderboard.slice(0, k);
        res.json(topKCoders);
    } catch (error) {
        console.error("Error fetching top K coders:", error);
        res.status(500).json({ error: "Failed to fetch top K coders" });
    }
};




module.exports = {
    getLeaderboard,
    getTopKCoders
};