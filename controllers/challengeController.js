const mockDatabase = {
        challenges: [],
    };
    
    // Create a new challenge put raw json
    const createChallenge = (req, res) => {
        const { title, category, description, level, code, tests } = req.body;
    
        if (!title || !category || !description || !level || !code || !tests) {
            return res.status(400).json({ message: 'All fields are required' });
        }
    
        const newChallenge = {
            id: Date.now().toString(),
            title,
            category, //filter
            description,
            level,
            code,
            tests,
        };
    
        mockDatabase.challenges.push(newChallenge);
        res.status(201).json({ message: 'Challenge created successfully!', challenge: newChallenge });
    };
    
    // Get all challenges for 3. challenge listing
    const getAllChallenges = (req, res) => {
        const { category } = req.query; // to accept category query to filter by categ
    
        if (category) {
            const filteredChallenges = mockDatabase.challenges.filter(
                challenge => challenge.category.toLowerCase() === category.toLowerCase()
            );
            return res.status(200).json(filteredChallenges);
        }
    
        res.status(200).json(mockDatabase.challenges);
    };
    
    // Get achallenge by id 4. 
    const getChallengeById = (req, res) => {
        const { id } = req.params;
        const challenge = mockDatabase.challenges.find(challenge => challenge.id === id);
    
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
    
        res.status(200).json(challenge);
    };
    
    // Update a challenge
    const updateChallenge = (req, res) => {
        const { id } = req.params;
        const { title, category, description, level, code, tests } = req.body;
    
        const challenge = mockDatabase.challenges.find(challenge => challenge.id === id);
    
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
    
        Object.assign(challenge, { title, category, description, level, code, tests });
        res.status(200).json({ message: 'Challenge updated successfully!', challenge });
    };
    
    // Delete a challenge
    const deleteChallenge = (req, res) => {
        const { id } = req.params;
        const challengeIndex = mockDatabase.challenges.findIndex(challenge => challenge.id === id);
    
        if (challengeIndex === -1) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
    
        mockDatabase.challenges.splice(challengeIndex, 1);
        res.status(200).json({ message: 'Challenge deleted successfully!' });
    };
    
    module.exports = {
        createChallenge,
        getAllChallenges,
        getChallengeById,
        updateChallenge,
        deleteChallenge,
    };
    