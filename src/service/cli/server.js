'use strict';

const {HttpCode, API_PREFIX} = require(`../../constants`);
const chalk = require(`chalk`);
const express = require(`express`);
const routes = require(`../api`);
const getMockData = require(`../lib/get-mock-data`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    const app = express();

    const mockData = await getMockData();
    const logger = getLogger({name: `api`});

    app.use(express.json());
    app.use(API_PREFIX, routes(mockData));

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
