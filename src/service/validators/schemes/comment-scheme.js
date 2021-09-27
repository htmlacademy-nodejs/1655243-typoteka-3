'use strict';

const Joi = require(`joi`);

const {
  getRequiredFieldErrorMessage,
  getShortFieldLengthErrorMessage,
  getLongFieldLengthErrorMessage
} = require(`./scheme-validation-errors`);

module.exports = Joi.object({
  text: Joi.string()
    .min(20)
    .max(255)
    .required()
    .messages({
      'any.required': getRequiredFieldErrorMessage(`Текст комментария`),
      'string.min': getShortFieldLengthErrorMessage(`Текст комментария`, 20),
      'string.max': getLongFieldLengthErrorMessage(`Текст комментария`, 255),
    }),

  userId: Joi
    .number()
    .integer()
    .positive()
    .required()
});
