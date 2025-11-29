const Joi = require('joi');
const { ValidationError } = require('./errorHandler.middleware');

/**
 * Validation middleware factory
 * @param {object} schema - Joi validation schema
 * @param {string} property - Request property to validate (body, query, params)
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(new ValidationError('Validation failed', details));
    }

    // Replace request property with validated value
    req[property] = value;
    next();
  };
}

module.exports = { validate };

