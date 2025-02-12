const express = require('express');
const {
    registerCoder,
    registerManager,
    loginCoder,
    loginManager,
    getCoderProfile,
    getManagerProfile,
    updateCoderProfile,
    updateManagerProfile,
} = require('../controllers/authController');
const { validateRegistration, validateLogin, validateProfileUpdate } = require('../middleware/validators');

const router = express.Router();

// Account Registration routes (from 1st task)
router.post('/register/coder', validateRegistration, registerCoder);
router.post('/register/manager', validateRegistration, registerManager);

// Account Login routes (from 1st task)
router.post('/login/coder', validateLogin, loginCoder);
router.post('/login/manager', validateLogin, loginManager);

// Account Profile Management routes (from 1st task)
router.get('/profile/coder/:id', getCoderProfile);
router.get('/profile/manager/:id', getManagerProfile);
router.put('/profile/coder/:id', validateProfileUpdate, updateCoderProfile);
router.put('/profile/manager/:id', validateProfileUpdate, updateManagerProfile);

module.exports = router;
