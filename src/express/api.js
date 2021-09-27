'use strict';

const axios = require(`axios`);

const {HttpMethod} = require(`../constants`);
const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request(({url, ...options}));
    return response.data;
  }

  async getArticles({offset, limit, comments, userId, popularArticlesAmount, lastCommentsAmount}) {
    return await this._load(`/articles`, {params: {offset, limit, comments, userId, popularArticlesAmount, lastCommentsAmount}});
  }

  async getArticleById(id) {
    return await this._load(`/articles/${id}`);
  }

  async getArticlesByCategory({categoryId, offset, limit, comments} = {}) {
    return await this._load(`/articles/category/${categoryId}`, {params: {offset, limit, comments}});
  }

  async createArticle(data) {
    return await this._load(`/articles`, {
      method: HttpMethod.POST,
      data,
    });
  }

  async getCategories(count) {
    return await this._load(`/categories`, {params: {count}});
  }

  async search(query) {
    return await this._load(`/search`, {params: {query}});
  }

  async editArticle(id, data) {
    return await this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  async createComment(id, data) {
    return await this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  async createUser(data) {
    return await this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  async auth(email, password) {
    return await this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
