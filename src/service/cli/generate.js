'use strict';

const {
  getRandomInt,
  shuffle,
  getRandomItemsFromArray,
  getRandomDate
} = require(`../../utils`);

const {
  AnnounceRestrict, ExitCode
} = require(`./const`);

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const DEFAULT_COUNT_OFFER = 1;
const MAX_COUNT_OFFER = 1000;
const MOCKS_FILE_NAME = `mocks.json`;
const MONTH_DIFFERENCE_BETWEEN_DATES = 3;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT_OFFER;

    if (countOffer > MAX_COUNT_OFFER) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(MOCKS_FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));

    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};

const readContent = async (filePath) => {
  const encoding = `utf-8`;

  try {
    const content = await fs.readFile(filePath, encoding);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(AnnounceRestrict.MIN, AnnounceRestrict.MAX).join(` `),
    fullText: shuffle(sentences).slice(1, sentences.length - 1).join(` `),
    createdDate: getRandomDate(MONTH_DIFFERENCE_BETWEEN_DATES),
    category: getRandomItemsFromArray(categories),
  }))
);

