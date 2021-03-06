'use strict';

const Sequelize = require(`sequelize`);
const {getLogger} = require(`./logger`);
const {DbPoolConnection} = require(`../../constants`);

let sequelizeInstance;

module.exports = () => {
  const logger = getLogger({name: `DB`});

  if (!sequelizeInstance) {
    const {
      DB_HOST,
      DB_PORT,
      DB_NAME,
      DB_USER,
      DB_PASSWORD,
      DB_POOL_MIN_CONNECTION,
      DB_POOL_MAX_CONNECTION,
      DB_POLL_ACQUIRE,
      DB_POLL_IDLE,
    } = process.env;

    const somethingIsNotDefined = [
      DB_HOST,
      DB_PORT,
      DB_NAME,
      DB_USER,
      DB_PASSWORD,
      DB_POOL_MIN_CONNECTION,
      DB_POOL_MAX_CONNECTION,
      DB_POLL_ACQUIRE,
      DB_POLL_IDLE
    ].some((it) => !it);

    if (somethingIsNotDefined) {
      throw new Error(`One or more environmental variables are not defined`);
    }

    sequelizeInstance = new Sequelize(
        DB_NAME,
        DB_USER,
        DB_PASSWORD, {
          host: DB_HOST,
          port: DB_PORT,
          dialect: `postgres`,
          pool: {
            min: Number(DB_POOL_MIN_CONNECTION) || DbPoolConnection.MIN,
            max: Number(DB_POOL_MAX_CONNECTION) || DbPoolConnection.MAX,
            acquire: DB_POLL_ACQUIRE,
            idle: DB_POLL_IDLE,
          },
          define: {
            timestamps: false
          },
          logging: logger.debug.bind(logger),
        }
    );
  }

  return sequelizeInstance;
};
