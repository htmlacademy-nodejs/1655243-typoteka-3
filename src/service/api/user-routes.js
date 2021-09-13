'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const schemeValidator = require(`../validators/scheme-validator`);
const userExists = require(`../validators/user-exists`);
const userScheme = require(`../validators/schemes/user-scheme`);

module.exports = (app, userService) => {
  const route = new Router();

  app.use(`/user`, route);

  route.post(`/`, [schemeValidator(userScheme), userExists(userService)], async (req, res) => {
    const userData = req.body;
    const newUser = await userService.add(userData);

    return res
      .status(HttpCode.CREATED)
      .json(newUser);
  });
};
