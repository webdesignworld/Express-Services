
const Joi = require('joi');

// // Validate date range for statistics
const validateDateRange = (req, res, next) => {
    const schema = Joi.object({
        start_date: Joi.date().iso().required(),
        end_date: Joi.date().iso().required(),
    });

    const { error, value } = schema.validate(req.query);

    if (error) {
        return res.status(400).json({ error: error.details });
    }

    req.query = value; 
    next();
};



// Validate query parameters for both date range and coder ID
const validateStatisticsQuery = (req, res, next) => {
    const schema = Joi.object({
        coderId: Joi.alternatives().try(Joi.string(), Joi.number()).required(), // Allow either string or number for coderId
        start_date: Joi.date().iso().required(), // ISO date format for start date
        end_date: Joi.date().iso().required().greater(Joi.ref('start_date')), // ISO date format for end date, must be after start_date
    });

    const { error, value } = schema.validate(req.query);

    if (error) {
        return res.status(400).json({ error: error.details });
    }

    req.query = value; 
    next();
};

module.exports = {
    validateStatisticsQuery,
    validateDateRange,
};
