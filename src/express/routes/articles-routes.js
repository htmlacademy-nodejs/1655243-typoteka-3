'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const api = require(`../api`).getAPI();

const UPLOAD_DIR = `../upload/img`;
const uploadDirAbsolutePath = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolutePath,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  },
});

const articlesRouter = new Router();
const upload = multer({storage});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles/new-post`, {categories});
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    createdDate: body.date,
    title: body.title,
    categories: body.category || [],
    announce: body.announcement,
    fullText: body[`full-text`],
  };

  if (file) {
    articleData.picture = file.filename;
  }

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    const categories = await api.getCategories();
    res.status(400);
    res.render(`articles/new-post`, {categories, articleData});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res, next) => {
  try {
    const {id} = req.params;
    const [article, categories] = await Promise.all([
      api.getArticleById(id),
      api.getCategories(),
    ]);
    res.render(`articles/edit-post`, {article, categories});
  } catch (err) {
    next();
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticleById(id);
  res.render(`articles/post`, {article});
});

module.exports = articlesRouter;
