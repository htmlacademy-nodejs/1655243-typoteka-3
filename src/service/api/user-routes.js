'use strict';

const {Router} = require(`express`);
const {HttpCode, ErrorAuthMessage} = require(`../../constants`);
const {compare} = require(`../lib/password`);

const schemeValidator = require(`../validators/scheme-validator`);
const userExists = require(`../validators/user-exists`);
const userScheme = require(`../validators/schemes/user-scheme`);
const userLoginScheme = require(`../validators/schemes/user-login-scheme`);

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

  route.post(`/auth`, schemeValidator(userLoginScheme), async (req, res) => {
    const {email, password} = req.body;
    const user = await userService.findByEmail(email);

    if (!user) {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .json({
          errorMessages: [ErrorAuthMessage.EMAIL]
        });
    }

    const passwordIsCorrect = await compare(password, user.passwordHash);

    if (passwordIsCorrect) {
      delete user.passwordHash;
      return res.status(HttpCode.OK).json(user);
    } else {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .json({
          errorMessages: [ErrorAuthMessage.PASSWORD]
        });
    }
  });
};
