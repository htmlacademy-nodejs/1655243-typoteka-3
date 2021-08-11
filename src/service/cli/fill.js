'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  getRandomInt,
  shuffle,
  getRandomDate,
  readContent
} = require(`../../utils`);

const {
  ExitCode,
  AnnounceRestrict,
  MAX_COMMENTS,
  FILL_DB_FILE_NAME,
  DEFAULT_COUNT_ARTICLES,
  MAX_COUNT_ARTICLES,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  MONTH_DIFFERENCE_BETWEEN_DATES
} = require(`../../constants`);

module.exports = {
  name: `--fill`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT_ARTICLES;

    if (articlesCount > MAX_COUNT_ARTICLES) {
      console.info(chalk.red(`Не больше 1000 объявлений`));
      return;
    }

    const users = getGeneratedUsers();
    const articles = getGeneratedArticles(articlesCount, titles, categories.length, users.length, sentences, commentSentences);
    const comments = articles.flatMap((article) => article.comments);
    const articleCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.category[0]}));

    const dataInsertionSql = getDataInsertionSql(users, articles, categories, comments, articleCategories);
    writeDataInsertionSqlToFile(dataInsertionSql);
  }
};

const getGeneratedComments = (count, articleId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, comments.length))
      .join(` `),
  }))
);

const getGeneratedArticles = (articlesCount, titles, categoryCount, userCount, sentences, comments) => {
  return Array(articlesCount).fill({}).map((_, index) => ({
    userId: getRandomInt(1, userCount),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdAt: getRandomDate(MONTH_DIFFERENCE_BETWEEN_DATES),
    announce: shuffle(sentences).slice(AnnounceRestrict.MIN, AnnounceRestrict.MAX).join(` `),
    fullText: shuffle(sentences).slice(1, sentences.length - 1).join(` `),
    categories: [getRandomInt(1, categoryCount)],
    comments: getGeneratedComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
  }));
};

const getGeneratedUsers = () => {
  return [
    {
      email: `ivanov@example.com`,
      passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
      firstName: `Иван`,
      lastName: `Иванов`,
      avatar: `avatar1.jpg`
    },
    {
      email: `petrov@example.com`,
      passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
      firstName: `Пётр`,
      lastName: `Петров`,
      avatar: `avatar2.jpg`
    }
  ];
};

const getDataInsertionSql = (users, articles, categories, comments, articleCategories) => {
  const userValues = users.map(({firstName, lastName, passwordHash, avatar, email}) =>
    `('${firstName}', '${lastName}', '${passwordHash}', '${avatar}', '${email}')`
  ).join(`,\n`);

  const articleValues = articles.map(({userId, title, createdAt, announce, fullText}) =>
    `(${userId}, '${title}', '${createdAt}', '${announce}', '${fullText}')`
  ).join(`,\n`);

  const commentValues = comments.map(({articleId, userId, text}) =>
    `(${articleId}, ${userId}, '${text}')`
  ).join(`,\n`);

  const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

  const articleCategoryValues = articleCategories.map(({articleId, categoryId}) =>
    `(${articleId}, ${categoryId})`
  ).join(`,\n`);

  return `
INSERT INTO users(first_name, last_name, password_hash, avatar, email) VALUES
${userValues};
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(user_id, title, created_at, announce, full_text) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(article_id, user_id, text) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE article_category DISABLE TRIGGER ALL;
INSERT INTO article_category(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE article_category ENABLE TRIGGER ALL;
    `.trim();
};

const writeDataInsertionSqlToFile = async (dataInsertionSql) => {
  try {
    await fs.writeFile(FILL_DB_FILE_NAME, dataInsertionSql);
    console.log(chalk.green(`Operation success. File created.`));
  } catch (err) {
    console.error(chalk.red(`Can't write data to file...`));
    process.exit(ExitCode.ERROR);
  }
};
