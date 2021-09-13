'use strict';

const Joi = require(`joi`);

const {
  getRequiredFieldErrorMessage,
  getShortFieldLengthErrorMessage,
  getLongFieldLengthErrorMessage
} = require(`./scheme-validation-errors`);

module.exports = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .required()
    .messages({
      'any.required': getRequiredFieldErrorMessage(`Название категории`),
      'string.min': getShortFieldLengthErrorMessage(5),
      'string.max': getLongFieldLengthErrorMessage(30),
    })
});
