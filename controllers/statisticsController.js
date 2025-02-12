

const mockSubmissions = [
    { coderId: '1', challengeId: '101', date: '2025-01-01', difficulty: 'easy', isCorrect: true, category: 'math' },
    { coderId: '2', challengeId: '102', date: '2025-01-02', difficulty: 'medium', isCorrect: true, category: 'algorithms' },
    { coderId: '2', challengeId: '103', date: '2025-01-03', difficulty: 'hard', isCorrect: false, category: 'data-structures' },
];

// Solved challenges statistics
const getSolvedChallengesStats = (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        // Validate dates
        if (!start_date || !end_date) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        // Filter solved challenges within the date range
        const solvedChallenges = mockSubmissions.filter(submission => {
            const submissionDate = new Date(submission.date);
            return submission.isCorrect && submissionDate >= new Date(start_date) && submissionDate <= new Date(end_date);
        });

        // Calculate statistics based on difficulty
        const stats = solvedChallenges.reduce((acc, submission) => {
            acc[submission.difficulty] = (acc[submission.difficulty] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json({ status: 'success', data: stats });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Trending categories
const getTrendingCategories = (req, res) => {
    try {
        // Calculate correct submissions by category
        const categoryCounts = mockSubmissions.reduce((acc, submission) => {
            if (submission.isCorrect) {
                acc[submission.category] = (acc[submission.category] || 0) + 1;
            }
            return acc;
        }, {});

        // Sort categories by number of correct submissions
        const sortedCategories = Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([category]) => category);

        res.status(200).json({ status: 'success', data: sortedCategories });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Heatmap
const getHeatmap = (req, res) => {
    try {
        const { coderId, start_date, end_date } = req.query;

        // Validate query params
        if (!coderId || !start_date || !end_date) {
            return res.status(400).json({ message: 'Coder ID, start date, and end date are required' });
        }

        // Filter submissions based on coderId, correctness, and date range
        const heatmapData = mockSubmissions.filter(submission => {
            const submissionDate = new Date(submission.date);
            return (
                submission.coderId === coderId &&
                submission.isCorrect &&
                submissionDate >= new Date(start_date) &&
                submissionDate <= new Date(end_date)
            );
        });

        // Prepare heatmap data by date
        const heatmap = heatmapData.reduce((acc, submission) => {
            acc[submission.date] = (acc[submission.date] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json({ status: 'success', data: heatmap });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    getSolvedChallengesStats,
    getTrendingCategories,
    getHeatmap,
};
