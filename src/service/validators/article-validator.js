'use strict';

const {HttpCode} = require(`../../constants`);
const articleKeys = [`announce`, `fullText`, `picture`, `title`, `categories`, `createdDate`, `userId`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);

  } else {
    next();
  }
};
