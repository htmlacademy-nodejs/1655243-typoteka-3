'use strict';

const {HttpCode, API_PREFIX} = require(`../../constants`);
const chalk = require(`chalk`);
const express = require(`express`);
const routes = require(`../api`);
const getMockData = require(`../lib/get-mock-data`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    const app = express();

    const mockData = await getMockData();

    app.use(express.json());
    app.use(API_PREFIX, routes(mockData));

    app.use((req, res) => res
      .status(HttpCode.NOT_FOUND)
      .send(`Not found`));

    app
      .listen(port, () => {
        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      })
      .on(`error`, (err) => {
        return console.error(`Ошибка при создании сервера - `, err);
      });
  }
};
