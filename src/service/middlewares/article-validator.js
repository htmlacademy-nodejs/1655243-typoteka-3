'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const schema = Joi.object({
  title: Joi.string().min(30).max(250).required(),
  picture: Joi.string().allow(``),
  createdDate: Joi.date().required(),
  categories: Joi.array().items(
      Joi.number().integer().positive()
  ).min(1).required(),
  announce: Joi.string().min(30).max(250).required(),
  fullText: Joi.string().allow(``).max(1000),
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
