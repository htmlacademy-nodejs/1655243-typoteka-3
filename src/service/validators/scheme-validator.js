'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (schema) => (
  async (req, res, next) => {
    const {body} = req;

    try {
      await schema.validateAsync(body, {abortEarly: false});
    } catch (error) {
      const {details} = error;

      res
        .status(HttpCode.BAD_REQUEST)
        .json({
          errorMessages: details.map((err) => err.message),
          requestData: body
        });

      return;
    }

    next();
  }
);
