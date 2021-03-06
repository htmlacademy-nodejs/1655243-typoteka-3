'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/alias`);

class SearchService {
  constructor(sequelize) {
    this._Articles = sequelize.models.Article;
  }

  async findAll(searchText) {
    const articles = await this._Articles.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Aliase.CATEGORIES],
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
