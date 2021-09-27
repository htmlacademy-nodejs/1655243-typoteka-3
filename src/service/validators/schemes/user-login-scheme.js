'use strict';

const Joi = require(`joi`);
const {INCORRECT_EMAIL_FORMAT_ERROR_MESSAGE, getRequiredFieldErrorMessage} = require(`./scheme-validation-errors`);

module.exports = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.email': INCORRECT_EMAIL_FORMAT_ERROR_MESSAGE,
      'any.required': getRequiredFieldErrorMessage(`Почта`),
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': getRequiredFieldErrorMessage(`Пароль`),
    }),
});
