'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (
  async (req, res, next) => {
    const {email} = req.body;
    const foundUser = await service.findByEmail(email);

    if (foundUser) {
      res
        .status(HttpCode.BAD_REQUEST)
        .json({
          errorMessages: [`Пользователь с такой почтой уже зарегистрирован`],
          requestData: req.body
        });

      return;
    }

    next();
  }
);
