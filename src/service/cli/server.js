'use strict';

const {HttpCode, API_PREFIX, ExitCode} = require(`../../constants`);
const chalk = require(`chalk`);
const express = require(`express`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);
const getSequelize = require(`../lib/sequelize`);

const sequelize = getSequelize();
const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    const app = express();
    const logger = getLogger({name: `api`});

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      logger.info(`Connection to database established`);
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    app.use(express.json());
    app.use(API_PREFIX, routes());

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);

      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });

      next();
    });

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND).send(`Not found`);
      logger.error(`Route not found: ${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
    });

    app
      .listen(port, () => {
        return logger.info(chalk.green(`Listening to connection on ${port}`));
      })
      .on(`error`, (err) => {
        return logger.error(`An error occurred on server created ${err.message}`);
      });
  }
};
