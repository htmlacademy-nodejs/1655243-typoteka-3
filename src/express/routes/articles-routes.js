'use strict';

const {
  Router
} = require(`express`);

const articlesRoutes = new Router();

articlesRoutes.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));
articlesRoutes.get(`/add`, (req, res) => res.render(`articles/new-post`));
articlesRoutes.get(`/edit/:id`, (req, res) => res.render(`articles/new-post`));
articlesRoutes.get(`/:id`, (req, res) => res.render(`articles/post`));

module.exports = articlesRoutes;
