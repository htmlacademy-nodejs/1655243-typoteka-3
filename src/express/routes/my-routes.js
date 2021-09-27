'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const auth = require(`../../service/middlewares/auth`);

const myRouter = new Router();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({userId: user.id, comments: false});
  res.render(`my`, {articles, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({userId: user.id, comments: true});
  res.render(`comments`, {articles, user});
});

module.exports = myRouter;
