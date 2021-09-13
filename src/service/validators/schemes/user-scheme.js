'use strict';

const Joi = require(`joi`);

const {
  getRequiredFieldErrorMessage,
  INCORRECT_EMAIL_FORMAT_ERROR_MESSAGE,
  SHORT_PASSWORD_LENGTH_ERROR_MESSAGE,
  LONG_PASSWORD_LENGTH_ERROR_MESSAGE,
  getOnlyWordCharactersErrorMessage
} = require(`./scheme-validation-errors`);

const {MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH} = require(`../../../constants`);

module.exports = Joi.object({
  name: Joi
    .string()
    .pattern(/^[a-zA-Zа-яА-ЯёЁ]+$/)
    .min(1)
    .max(255)
    .required()
    .messages({
      'any.required': getRequiredFieldErrorMessage(`Имя`),
      'string.pattern.base': getOnlyWordCharactersErrorMessage(`Имя`)
    }),

  surname: Joi
    .string()
    .pattern(/^[a-zA-Zа-яА-ЯёЁ]+$/)
    .min(1)
    .max(255)
    .required()
    .messages({
      'any.required': getRequiredFieldErrorMessage(`Фамилия`),
      'string.pattern.base': getOnlyWordCharactersErrorMessage(`Фамилия`)
    }),

  avatar: Joi.string()
    .empty(``),

  email: Joi.string()
    .required()
    .email()
    .messages({
      'any.required': getRequiredFieldErrorMessage(`Почта`),
      'string.email': INCORRECT_EMAIL_FORMAT_ERROR_MESSAGE,
    }),

  password: Joi.string()
    .required()
    .min(MIN_PASSWORD_LENGTH)
    .max(MAX_PASSWORD_LENGTH)
    .messages({
      'any.required': getRequiredFieldErrorMessage(`Пароль`),
      'string.min': SHORT_PASSWORD_LENGTH_ERROR_MESSAGE,
      'string.max': LONG_PASSWORD_LENGTH_ERROR_MESSAGE,
    }),

  passwordRepeat: Joi.string()
    .required()
    .valid(Joi.ref(`password`))
    .messages({
      'any.required': getRequiredFieldErrorMessage(`Повтор пароля`),
      'any.only': `Пароли не совпадают`,
    }),
});
