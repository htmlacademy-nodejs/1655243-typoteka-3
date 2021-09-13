'use strict';

const INCORRECT_EMAIL_FORMAT_ERROR_MESSAGE = `Некорректный формат почты`;

const SHORT_PASSWORD_LENGTH_ERROR_MESSAGE = `Пароль должен быть не меньше 6 символов`;
const LONG_PASSWORD_LENGTH_ERROR_MESSAGE = `Пароль должен быть не больше 12 символов`;

const getRequiredFieldErrorMessage = (fieldName) => `Поле '${fieldName}' обязательно для заполнения`;
const getFieldCannotBeEmptyErrorMessage = (fieldName) => `Поле '${fieldName}' не может быть пустым`;
const getShortFieldLengthErrorMessage = (fieldName, minLength) => `Поле '${fieldName}' должно содержать не менее ${minLength} символов`;
const getLongFieldLengthErrorMessage = (fieldName, maxLength) => `Поле '${fieldName}' должно содержать не более ${maxLength} символов`;
const getOnlyWordCharactersErrorMessage = (fieldName) => `Поле '${fieldName}' должно содержать только буквы`;

module.exports = {
  INCORRECT_EMAIL_FORMAT_ERROR_MESSAGE,
  SHORT_PASSWORD_LENGTH_ERROR_MESSAGE,
  LONG_PASSWORD_LENGTH_ERROR_MESSAGE,
  getRequiredFieldErrorMessage,
  getFieldCannotBeEmptyErrorMessage,
  getShortFieldLengthErrorMessage,
  getLongFieldLengthErrorMessage,
  getOnlyWordCharactersErrorMessage
};
