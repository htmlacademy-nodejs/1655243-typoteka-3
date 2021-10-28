'use strict';

const {Router} = require(`express`);
const {calculatePaginationParams} = require(`../../utils`);
const upload = require(`../middlewares/upload`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);

const mainRouter = new Router();
const api = require(`../api`).getAPI();
const auth = require(`../middlewares/auth`);

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  const {page, limit, offset} = calculatePaginationParams(req, ARTICLES_PER_PAGE);

  const [
    {articlesData, popularArticles, lastComments},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true, popularArticlesAmount: 4, lastCommentsAmount: 4}),
    api.getCategories(true)
  ]);

  const {count, articles} = articlesData;

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main`, {
    articles,
    page,
    totalPages,
    categories,
    user,
    popularArticles,
    lastComments,
  });
});

mainRouter.get(`/register`, async (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  res.render(`sign-up`, {error, user});
});

mainRouter.post(`/register`, upload.single(`user-avatar`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename : ``,
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: body.password,
    passwordRepeat: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (error) {
    let {requestData, errorMessages} = error.response.data;

    res.render(`sign-up`, {
      registerErrors: errorMessages,
      userData: requestData,
    });
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  res.render(`login`, {user});
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;

  try {
    const {search} = req.query;
    const results = await api.search(search);
    res.render(`search`, {results, search});
  } catch (err) {
    res.render(`search`, {results: [], search: req.query.search, user});
  }
});

mainRouter.get(`/categories`, auth, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();

  res.render(`all-categories`, {categories, user});
});

mainRouter.post(`/login`, async (req, res) => {
  try {
    const {body} = req;
    const user = await api.auth(body.email, body.password);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (error) {
    let {errorMessages} = error.response.data;

    res.render(`login`, {loginErrors: errorMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

module.exports = mainRouter;
