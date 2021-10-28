'use strict';

const {
  getRandomInt,
  shuffle,
  getRandomItemsFromArray,
  getRandomDate,
  readContent,
} = require(`../../utils`);

const {
  AnnounceRestrict,
  ExitCode,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  MAX_COMMENT_SENTENCES,
  DEFAULT_COUNT_ARTICLES,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  MONTH_DIFFERENCE_BETWEEN_DATES,
  USERS,
} = require(`../../constants`);

const {customAlphabet} = require(`nanoid`);

const {getLogger} = require(`../lib/logger`);
const getSequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const sequelize = getSequelize();
const logger = getLogger({name: `filldb`});

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    logger.info(`Connection to database established`);

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT_ARTICLES;
    const articles = generateArticles(countOffer, titles, categories, sentences, comments, USERS);

    await initDatabase(sequelize, {articles, categories, users: USERS});
    await sequelize.close();
  }
};

const generateArticles = (count, titles, categories, sentences, comments, users) => {
  const nanoid = customAlphabet(`1234567890`, MAX_ID_LENGTH);

  return Array(count).fill({}).map(() => ({
    id: nanoid(),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(AnnounceRestrict.MIN, AnnounceRestrict.MAX).join(` `),
    fullText: shuffle(sentences).slice(1, sentences.length - 1).join(` `),
    createdAt: getRandomDate(MONTH_DIFFERENCE_BETWEEN_DATES),
    categories: getRandomItemsFromArray(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, users),
    user: users[getRandomInt(0, users.length - 1)].email
  }));
};

const generateComments = (count, comments, users) => {
  const nanoid = customAlphabet(`1234567890`, MAX_ID_LENGTH);

  return Array(count).fill({}).map(() => ({
    id: nanoid(),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, MAX_COMMENT_SENTENCES))
      .join(` `),
    createdAt: getRandomDate(MONTH_DIFFERENCE_BETWEEN_DATES),
    user: users[getRandomInt(0, users.length - 1)].email
  }));
};
