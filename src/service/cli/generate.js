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
  MOCKS_FILE_NAME,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  MAX_COMMENT_SENTENCES,
  DEFAULT_COUNT_ARTICLES,
  MAX_COUNT_ARTICLES,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  MONTH_DIFFERENCE_BETWEEN_DATES
} = require(`../../constants`);

const {nanoid} = require(`nanoid`);

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT_ARTICLES;

    if (countOffer > MAX_COUNT_ARTICLES) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(generateArticles(countOffer, titles, categories, sentences, comments));

    try {
      await fs.writeFile(MOCKS_FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));

    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};

const generateArticles = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(AnnounceRestrict.MIN, AnnounceRestrict.MAX).join(` `),
    fullText: shuffle(sentences).slice(1, sentences.length - 1).join(` `),
    createdAt: getRandomDate(MONTH_DIFFERENCE_BETWEEN_DATES),
    category: getRandomItemsFromArray(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments)
  }))
);

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, MAX_COMMENT_SENTENCES))
      .join(` `),
  }))
);
