'use strict';

const {Router} = require(`express`);

const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);

const getSequelize = require(`../lib/sequelize`);
const defineModels = require(`../models/models`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

module.exports = () => {
  const app = new Router();
  const sequelize = getSequelize();

  defineModels(sequelize);

  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));

  return app;
};
