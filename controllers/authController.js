const mockDatabase = {
    coders: [
        { id: '1', email: 'coder@example.com', password: 'securepassword', firstName: 'Laura', lastName: 'D', about: 'bio', role: 'Coder' },
    ],
    managers: [
        { id: '1', email: 'manager@example.com', password: 'verysecurepassword', firstName: 'Frank', lastName: 'D', about: 'bio', role: 'Manager' },
    ],
};

// Registration for coder controller 
const registerCoder = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const newCoder = { id: Date.now().toString(), email, password, firstName, lastName, about: '', role: 'Coder' };
    mockDatabase.coders.push(newCoder);
    res.status(201).json({ message: 'Coder registered successfully!', user: newCoder });
};

const registerManager = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const newManager = { id: Date.now().toString(), email, password, firstName, lastName, about: '', role: 'Manager' };
    mockDatabase.managers.push(newManager);
    res.status(201).json({ message: 'Manager registered successfully!', user: newManager });
};

// Login controller logic
const loginCoder = async (req, res) => {
    const { email, password } = req.body;
    const coder = mockDatabase.coders.find(user => user.email === email && user.password === password);
    if (!coder) return res.status(401).json({ message: 'Invalid email or password' });
    res.status(200).json({ message: 'Login successful', user: coder });
};

const loginManager = async (req, res) => {
    const { email, password } = req.body;
    const manager = mockDatabase.managers.find(user => user.email === email && user.password === password);
    if (!manager) return res.status(401).json({ message: 'Invalid email or password' });
    res.status(200).json({ message: 'Login successful', user: manager });
};

// Profile Management endpoints for general info query
const getCoderProfile = async (req, res) => {
    const { id } = req.params;
    const coder = mockDatabase.coders.find(user => user.id === id);
    if (!coder) return res.status(404).json({ message: 'Coder not found' });
    res.status(200).json(coder);
};

const getManagerProfile = async (req, res) => {
    const { id } = req.params;
    const manager = mockDatabase.managers.find(user => user.id === id);
    if (!manager) return res.status(404).json({ message: 'Manager not found' });
    res.status(200).json(manager);
};

const updateCoderProfile = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, about } = req.body;
    const coder = mockDatabase.coders.find(user => user.id === id);
    if (!coder) return res.status(404).json({ message: 'Coder not found' });
    Object.assign(coder, { firstName, lastName, about });
    res.status(200).json({ message: 'Profile updated successfully!', user: coder });
};

const updateManagerProfile = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, about } = req.body;
    const manager = mockDatabase.managers.find(user => user.id === id);
    if (!manager) return res.status(404).json({ message: 'Manager not found' });
    Object.assign(manager, { firstName, lastName, about });
    res.status(200).json({ message: 'Profile updated successfully!', user: manager });
};

module.exports = {
    registerCoder,
    registerManager,
    loginCoder,
    loginManager,
    getCoderProfile,
    getManagerProfile,
    updateCoderProfile,
    updateManagerProfile,
};
