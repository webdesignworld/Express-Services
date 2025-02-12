// middleware/leaderboardValidator.js
const Joi = require('joi');

const validateTopKCoders = (req, res, next) => {
    const schema = Joi.object({
        k: Joi.number().integer().positive().required() 
    });

    const { error, value } = schema.validate(req.query);

    if (error) {
        return res.status(400).json({ error: error.details });
    }


    req.query.k = value.k;
    next(); // Proceed to the controller
};

module.exports = {
    validateTopKCoders,
};
