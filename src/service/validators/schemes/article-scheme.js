'use strict';

const Joi = require(`joi`);

const {
  getShortFieldLengthErrorMessage,
  getLongFieldLengthErrorMessage,
  getRequiredFieldErrorMessage,
  getFieldCannotBeEmptyErrorMessage
} = require(`./scheme-validation-errors`);

const TITLE_FIELD_NAME = `Заголовок`;
const ANNOUNCE_FILED_NAME = `Анонс публикации`;
const FULL_TEXT_FIELD_NAME = `Полный текст публикации`;

module.exports = Joi.object({
  title: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'any.required': getRequiredFieldErrorMessage(TITLE_FIELD_NAME),
      'string.min': getShortFieldLengthErrorMessage(TITLE_FIELD_NAME, 30),
      'string.max': getLongFieldLengthErrorMessage(TITLE_FIELD_NAME, 250),
      'string.empty': getFieldCannotBeEmptyErrorMessage(TITLE_FIELD_NAME)
    }),

  announce: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'any.required': getRequiredFieldErrorMessage(ANNOUNCE_FILED_NAME),
      'string.min': getShortFieldLengthErrorMessage(ANNOUNCE_FILED_NAME, 30),
      'string.max': getLongFieldLengthErrorMessage(ANNOUNCE_FILED_NAME, 250),
      'string.empty': getFieldCannotBeEmptyErrorMessage(ANNOUNCE_FILED_NAME)
    }),

  fullText: Joi.string()
    .max(1000)
    .empty(``)
    .messages({
      'string.max': getLongFieldLengthErrorMessage(FULL_TEXT_FIELD_NAME, 1000),
    }),

  picture: Joi.string()
    .empty(``),

  categories: Joi.array()
    .items(Joi.number())
    .min(1)
    .required(),

  createdDate: Joi.date().required(),

  userId: Joi
    .number()
    .integer()
    .positive()
    .required()
});
