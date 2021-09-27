'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const upload = require(`../../service/middlewares/upload`);
const auth = require(`../../service/middlewares/auth`);
const {calculatePaginationParams} = require(`../../utils`);

const api = require(`../api`).getAPI();
const articlesRouter = new Router();

const csrfProtection = csrf();

const ARTICLES_BY_CATEGORY_PER_PAGE = 8;

articlesRouter.get(`/category/:categoryId`, async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;
  const {page, limit, offset} = calculatePaginationParams(req, ARTICLES_BY_CATEGORY_PER_PAGE);

  const [{articles, count}, categories] = await Promise.all([
    api.getArticlesByCategory({categoryId, limit, offset, comments: true}),
    api.getCategories(true)
  ]);

  const category = categories.find((c) => c.id === Number(categoryId));
  const totalPages = Math.ceil(count / ARTICLES_BY_CATEGORY_PER_PAGE);

  res.render(`articles/articles-by-category`, {articles, page, totalPages, categories, category, user});
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();

  res.render(`articles/new-post`, {categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/add`, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  const articleData = {
    createdDate: body.date,
    title: body.title,
    categories: [],
    announce: body.announcement,
    fullText: body[`full-text`],
    picture: file ? file.filename : ``,
    userId: user.id,
  };

  if (body.categories) {
    articleData.categories = body.categories.map(Number);
  }

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    const categories = await api.getCategories();
    let {errorMessages} = error.response.data;

    res.status(400);
    res.render(`articles/new-post`, {
      categories,
      articleData,
      creationErrors: errorMessages,
      csrfToken: req.csrfToken()
    });
  }
});

articlesRouter.get(`/edit/:id`, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticleById(id),
      api.getCategories(),
    ]);

    res.render(`articles/edit-post`, {article, categories, user, csrfToken: req.csrfToken()});
  } catch (error) {
    res.status(400);
    next();
  }
});

articlesRouter.post(`/edit/:id`, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    createdDate: body.date,
    title: body.title,
    categories: [],
    announce: body.announcement,
    fullText: body[`full-text`],
    picture: file ? file.filename : ``,
    userId: user.id
  };

  if (body.categories) {
    articleData.categories = body.categories.map(Number);
  }

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (error) {
    const {errorMessages} = error.response.data;

    const [article, categories] = await Promise.all([
      api.getArticleById(id),
      api.getCategories()
    ]);

    res.status(400);
    res.render(`articles/edit-post`, {
      categories,
      article,
      updateErrors: errorMessages,
      csrfToken: req.csrfToken()
    });
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticleById(id),
      api.getCategories(true)
    ]);

    res.render(`articles/post`, {
      article,
      categories,
      user,
      csrfToken: req.csrfToken()});
  } catch (error) {
    res.status(400);
    next();
  }
});

articlesRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;

  try {
    await api.createComment(id, {
      text: message,
      userId: user.id,
    });
    res.redirect(`/articles/${id}`);
  } catch (error) {
    const {errorMessages} = error.response.data;
    const [article, categories] = await Promise.all([
      api.getArticleById(id),
      api.getCategories(true)
    ]);

    res.render(`articles/post`, {
      article,
      categories,
      user,
      csrfToken: req.csrfToken(),
      commentCreationErrors: errorMessages,
    });
  }
});

module.exports = articlesRouter;
