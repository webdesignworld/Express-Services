const Joi = require('joi');

// Validation schemas (installed joi from task but similar to zod...what is the difference?)
//registr schema validation
const registrationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
});

//login schema validation
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

//profile update validation
const profileUpdateSchema = Joi.object({
    firstName: Joi.string().min(1).optional(),
    lastName: Joi.string().min(1).optional(),
    about: Joi.string().max(500).optional(),
});

// Middleware validation for registation
const validateRegistration = (req, res, next) => {
    const { error } = registrationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation error', details: error.details });
    next();
};
//Middleware validation for login
const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation error', details: error.details });
    next();
};
//Middleware validation for prof update
const validateProfileUpdate = (req, res, next) => {
    const { error } = profileUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation error', details: error.details });
    next();
};

//don't forget to export!!!
module.exports = {
    validateRegistration,
    validateLogin,
    validateProfileUpdate,
};
