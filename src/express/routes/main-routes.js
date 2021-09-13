'use strict';

const {Router} = require(`express`);
const {calculatePaginationParams} = require(`../../utils`);
const upload = require(`../../service/middlewares/upload`);

const mainRouter = new Router();
const api = require(`../api`).getAPI();

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  const {page, limit, offset} = calculatePaginationParams(req, ARTICLES_PER_PAGE);

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main`, {articles, page, totalPages, categories});
});

mainRouter.get(`/register`, async (req, res) => {
  const {error} = req.query;
  res.render(`sign-up`, {error});
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

mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);
    res.render(`search`, {results, search});
  } catch (err) {
    res.render(`search`, {results: [], search: req.query.search});
  }
});

mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();

  res.render(`all-categories`, {categories});
});

module.exports = mainRouter;
