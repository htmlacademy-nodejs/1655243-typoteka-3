'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleExists = require(`../middlewares/article-exists`);
const schemeValidator = require(`../validators/scheme-validator`);
const articleScheme = require(`../validators/schemes/article-scheme`);
const commentScheme = require(`../validators/schemes/comment-scheme`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments, popularArticlesAmount, lastCommentsAmount, userId} = req.query;
    let articlePromise;

    if (userId) {
      const articles = await articleService.findAll(comments, userId);
      return res.status(HttpCode.OK).json(articles);
    }

    if (limit || offset) {
      articlePromise = articleService.findPage({limit, offset});
    } else {
      articlePromise = articleService.findAll(comments);
    }

    const [articlesData, popularArticles, lastComments] = await Promise.all([
      articlePromise,
      articleService.getPopularArticles(popularArticlesAmount),
      articleService.getLastComments(lastCommentsAmount)
    ]);

    return res.status(HttpCode.OK).json({
      articlesData,
      popularArticles,
      lastComments
    });
  });

  route.get(`/category/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {offset, limit, comments} = req.query;
    const articles = await articleService.findByCategoryPage(comments, {categoryId, offset, limit});

    if (articles) {
      res
        .status(HttpCode.OK)
        .json(articles);

    } else {
      res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found articles belonging to category with id:${categoryId}`);
    }
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, schemeValidator(articleScheme), async (req, res) => {
    const article = await articleService.create(req.body);
    res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, schemeValidator(articleScheme), async (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = await articleService.update(articleId, req.body);

    if (!updatedArticle) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);
    res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), async (req, res) => {
    const {commentId} = req.params;
    const commentWasRemoved = await commentService.drop(commentId);

    if (!commentWasRemoved) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${commentId}`);
    }

    return res.status(HttpCode.OK).json(commentWasRemoved);
  });

  route.post(`/:articleId/comments`, [articleExists(articleService), schemeValidator(commentScheme)], async (req, res) => {
    const {articleId} = req.params;
    const userId = 1;

    const comment = await commentService.create(articleId, userId, req.body);

    res
      .status(HttpCode.CREATED)
      .json(comment);
  });
};
