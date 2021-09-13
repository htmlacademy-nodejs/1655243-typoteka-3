'use strict';

const defineArticle = require(`./article`);
const defineArticleCategory = require(`./article-category`);
const defineComment = require(`./comment`);
const defineCategory = require(`./category`);
const Alias = require(`./alias`);
const defineUser = require(`./user`);

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Category = defineCategory(sequelize);
  const User = defineUser(sequelize);

  User.hasMany(Article, {as: Alias.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: Alias.USER, foreignKey: `userId`});

  User.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Alias.USER, foreignKey: `userId`});

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
    User,
  };
};

module.exports = define;
