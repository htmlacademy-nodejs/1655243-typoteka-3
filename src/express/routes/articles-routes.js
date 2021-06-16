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
  try {
    const {body, file} = req;

    const articleData = {
      createdDate: body.date,
      title: body.title,
      category: body.category || [],
      announce: body.announcement,
      fullText: body[`full-text`],
    };

    if (file) {
      articleData.picture = file.filename;
    }

    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`back`);
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

articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));

module.exports = articlesRouter;
