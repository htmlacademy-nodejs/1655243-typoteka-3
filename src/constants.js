'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MAX_ID_LENGTH = 6;
const DEFAULT_COUNT_ARTICLES = 1;
const MAX_COUNT_ARTICLES = 1000;
const MONTH_DIFFERENCE_BETWEEN_DATES = 3;
const MAX_COMMENTS = 4;
const MAX_COMMENT_SENTENCES = 3;

const MOCKS_FILE_NAME = `mocks.json`;
const FILL_DB_FILE_NAME = `fill-db.sql`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 12;

const ARTICLES_PER_PAGE = 8;

const ExitCode = {
  ERROR: 1,
};

const AnnounceRestrict = {
  MIN: 1,
  MAX: 5,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const API_PREFIX = `/api`;

const Environment = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

const DbPoolConnection = {
  MIN: 0,
  MAX: 5,
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const USERS = [
  {
    name: `Иван`,
    surname: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: `ivanov`,
    avatar: `avatar01.jpg`
  },
  {
    name: `Пётр`,
    surname: `Петров`,
    email: `petrov@example.com`,
    passwordHash: `petrov`,
    avatar: `avatar02.jpg`
  }
];

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};

module.exports = {
  API_PREFIX,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MAX_ID_LENGTH,
  DEFAULT_COUNT_ARTICLES,
  MAX_COUNT_ARTICLES,
  MONTH_DIFFERENCE_BETWEEN_DATES,
  MAX_COMMENTS,
  MAX_COMMENT_SENTENCES,
  MOCKS_FILE_NAME,
  FILL_DB_FILE_NAME,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  USERS,
  ARTICLES_PER_PAGE,
  HttpCode,
  ExitCode,
  AnnounceRestrict,
  Environment,
  DbPoolConnection,
  HttpMethod,
  ErrorAuthMessage
};
