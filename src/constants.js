'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MAX_ID_LENGTH = 6;

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

module.exports = {
  API_PREFIX,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MAX_ID_LENGTH,
  HttpCode,
  ExitCode,
  AnnounceRestrict,
  Environment
};
