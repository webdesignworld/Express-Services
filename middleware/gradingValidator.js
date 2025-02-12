const Joi = require('joi');

// Validator for submission data
const validateSubmission = (req, res, next) => {
    const schema = Joi.object({
        challenge_id: Joi.string().required(),
        lang: Joi.string().valid('py', 'js').required(),
        code: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: 'Invalid submission data', details: error.details });
    }

    next(); //if valid passes
};

module.exports = {
        ...require('./challengeValidator'),
    validateSubmission,
};
