'use strict';

const {Router} = require(`express`);

const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const user = require(`../api/user-routes`);

const getSequelize = require(`../lib/sequelize`);
const defineModels = require(`../models/models`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  UserService,
  CommentService,
} = require(`../data-service`);

module.exports = () => {
  const app = new Router();
  const sequelize = getSequelize();

  defineModels(sequelize);

  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  user(app, new UserService(sequelize));

  return app;
};
