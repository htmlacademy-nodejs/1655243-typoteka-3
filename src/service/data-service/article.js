'use strict';

const Aliase = require(`../models/alias`);
const Sequelize = require(`sequelize`);
const {Op} = require(`sequelize`);


class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._User = sequelize.models.User;
  }

  async findAll(comments, userId) {
    const options = {
      include: [Aliase.CATEGORIES],
    };

    if (userId) {
      options.where = {userId};
    }

    if (comments) {
      options.include.push(Aliase.COMMENTS);
    }

    const articles = await this._Article.findAll(options);
    return articles.map((item) => item.get());
  }

  findOne(id) {
    return this._Article.findByPk(id, {
      include: [Aliase.CATEGORIES, {
        model: this._Comment,
        as: Aliase.COMMENTS,
        attributes: [
          `id`,
          `text`,
          `articleId`,
        ],
        include: [{
          model: this._User,
          as: Aliase.USER,
          attributes: [
            `name`,
            `surname`,
            `avatar`,
          ]
        }],
      }]
    });
  }

  async findByCategoryPage(needComments, {categoryId, limit, offset}) {
    const articlesByCategory = await this._ArticleCategory.findAll({where: {categoryId}});
    const articleIdsByCategory = articlesByCategory.map((item) => item.get().articleId);

    const {count, rows} = await this._Article.findAndCountAll({
      where: {
        id: {
          [Op.in]: articleIdsByCategory
        }
      },
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
      distinct: true,
      limit,
      offset,
      order: [[`createdAt`, `DESC`]]
    });

    return {
      articles: rows,
      count,
    };
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
      distinct: true,
      order: [[`createdAt`, `DESC`]],
    });
    return {count, articles: rows};
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async getPopularArticles(popularArticlesAmount) {
    const articlesByPopularity = await this._Article.findAll({
      attributes: [
        `id`,
        `title`,
        `picture`,
        `announce`,
        `fullText`,
        `createdAt`,
        `userId`,
        [Sequelize.fn(`COUNT`, `comments.id`), `commentsCount`]
      ],
      group: [Sequelize.col(`Article.id`)],
      order: [[Sequelize.col(`commentsCount`), `DESC`]],
      include: [{
        model: this._Comment,
        as: Aliase.COMMENTS,
        attributes: []
      }]
    });

    return articlesByPopularity
      .map((article) => article.get())
      .slice(0, popularArticlesAmount);
  }

  async getLastComments(lastCommentsAmount) {
    const commentsByCreatedDate = await this._Comment.findAll({
      attributes: [
        `id`,
        `text`,
        `articleId`,
      ],
      include: [{
        model: this._User,
        as: Aliase.USER,
        attributes: [
          `name`,
          `surname`,
          `avatar`,
        ]
      }]
    });

    return commentsByCreatedDate
      .map((comment) => comment.get())
      .slice(0, lastCommentsAmount);
  }
}

module.exports = ArticleService;
