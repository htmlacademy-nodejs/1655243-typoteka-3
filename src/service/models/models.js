'use strict';

const defineArticle = require(`./article`);
const defineArticleCategory = require(`./article-category`);
const defineComment = require(`./comment`);
const defineCategory = require(`./category`);
const Alias = require(`./alias`);

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Category = defineCategory(sequelize);

  Article.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `articleId`});
  Article.belongsToMany(Category, {through: ArticleCategory, as: Alias.CATEGORIES, foreignKey: `articleId`});

  Comment.belongsTo(Article, {as: Alias.ARTICLES, foreignKey: `articleId`});

  Category.belongsToMany(Article, {through: ArticleCategory, as: Alias.ARTICLES, foreignKey: `categoryId`});
  Category.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORY, foreignKey: `categoryId`});

  return {
    Article,
    ArticleCategory,
    Comment,
    Category,
  };
};

module.exports = define;
