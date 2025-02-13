const Joi = require('joi');

const submissionSchema = Joi.object({
  lang: Joi.string().valid('py', 'js').required(),
  code: Joi.string().required(),
  challenge_id: Joi.string().required(), 
});

module.exports = submissionSchema;