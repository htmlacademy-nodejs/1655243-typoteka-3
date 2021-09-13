'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {calculatePaginationParams} = require(`../../utils`);
const upload = require(`../../service/middlewares/upload`);

const ARTICLES_BY_CATEGORY_PER_PAGE = 8;
const TEMP_USER_ID = 1;

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {page} = calculatePaginationParams(req, ARTICLES_BY_CATEGORY_PER_PAGE);
  const totalPages = 1;

  const categories = await api.getCategories(true);

  res.render(`articles/articles-by-category`, {page, totalPages, categories});
});

articlesRouter.get(`/add`, async (req, res) => {
  const {error} = req.query;
  const categories = await api.getCategories();
  res.render(`articles/new-post`, {categories, error});
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    createdDate: body.date,
    title: body.title,
    categories: [],
    announce: body.announcement,
    fullText: body[`full-text`],
    picture: body.picture ? body.picture : ``,
    userId: TEMP_USER_ID,
  };

  if (file) {
    articleData.picture = file.filename;
  }

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
      creationErrors: errorMessages
    });
  }
});

articlesRouter.get(`/edit/:id`, async (req, res, next) => {
  try {
    const {id} = req.params;
    const {error} = req.query;
    const [article, categories] = await Promise.all([
      api.getArticleById(id),
      api.getCategories(),
    ]);

    res.render(`articles/edit-post`, {article, categories, error});
  } catch (error) {
    res.status(400);
    next();
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    createdDate: body.date,
    title: body.title,
    categories: [],
    announce: body.announcement,
    fullText: body[`full-text`],
    picture: body.picture ? body.picture : ``,
    userId: TEMP_USER_ID
  };

  if (file) {
    articleData.picture = file.filename;
  }

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
      updateErrors: errorMessages
    });
  }
});

articlesRouter.get(`/:id`, async (req, res, next) => {
  try {
    const {id} = req.params;
    const {error} = req.query;
    const article = await api.getArticleById(id);

    res.render(`articles/post`, {article, error});
  } catch (error) {
    res.status(400);
    next();
  }
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;

  try {
    await api.createComment(id, {
      text: message,
      userId: TEMP_USER_ID,
    });
    res.redirect(`/articles/${id}`);
  } catch (error) {
    const {errorMessages} = error.response.data;
    const errors = errorMessages.map((errorDescription) => `${errorDescription}&`);

    res.redirect(`/articles/${id}?error=${encodeURIComponent(errors)}`);
  }
});

module.exports = articlesRouter;
