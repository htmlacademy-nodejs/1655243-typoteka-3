'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `f_I4su`,
    "title": `Ёлки. История деревьев`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов.`,
    "fullText": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Золотое сечение — соотношение двух величин гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха.`,
    "createdDate": `2021-06-07 15:59:27`,
    "category": [
      `Кино`,
      `Программирование`,
      `IT`,
      `Без рамки`,
      `Разное`,
      `Музыка`,
      `Деревья`
    ],
    "comments": [
      {
        "id": `lPqOjh`,
        "text": `Плюсую, но слишком много буквы! Согласен с автором! Это где ж такие красоты?`
      },
      {
        "id": `XhxO1M`,
        "text": `Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `MHyPke`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    "id": `QqpToc`,
    "title": `Борьба с прокрастинацией`,
    "announce": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "fullText": `Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Первая большая ёлка была установлена только в 1938 году. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Достичь успеха помогут ежедневные повторения. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Программировать не настолько сложно как об этом говорят. Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Собрать камни бесконечности легко если вы прирожденный герой. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "createdDate": `2021-05-08 03:57:55`,
    "category": [
      `Без рамки`,
      `Кино`,
      `Деревья`,
      `Музыка`,
      `За жизнь`
    ],
    "comments": [
      {
        "id": `JWjjEv`,
        "text": `Согласен с автором!`
      },
      {
        "id": `TFImzp`,
        "text": `Совсем немного...`
      }
    ]
  },
  {
    "id": `CdxHMb`,
    "title": `Лучшие рок-музыканты 20-века`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Из под его пера вышло 8 платиновых альбомов. Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно как об этом говорят. Собрать камни бесконечности легко если вы прирожденный герой. Как начать действовать? Для начала просто соберитесь. Простые ежедневные упражнения помогут достичь успеха. Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин гармоническая пропорция.`,
    "createdDate": `2021-03-21 06:19:18`,
    "category": [
      `Железо`,
      `Программирование`,
      `Деревья`,
      `IT`,
      `За жизнь`
    ],
    "comments": [
      {
        "id": `QetDhV`,
        "text": `Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то?`
      }
    ]
  },
  {
    "id": `xY6FFq`,
    "title": `Лучшие рок-музыканты 20-века`,
    "announce": `Это один из лучших рок-музыкантов. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "fullText": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Простые ежедневные упражнения помогут достичь успеха. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Достичь успеха помогут ежедневные повторения. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь. Программировать не настолько сложно как об этом говорят. Собрать камни бесконечности легко если вы прирожденный герой. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "createdDate": `2021-04-24 13:02:10`,
    "category": [
      `Разное`,
      `Программирование`,
      `Деревья`,
      `IT`,
      `Без рамки`,
      `За жизнь`
    ],
    "comments": [
      {
        "id": `DjB7gW`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `4dnGVN`,
        "text": `Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "id": `Tp-qy4`,
    "title": `Что такое золотое сечение`,
    "announce": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко если вы прирожденный герой. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "fullText": `Золотое сечение — соотношение двух величин гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Из под его пера вышло 8 платиновых альбомов. Собрать камни бесконечности легко если вы прирожденный герой. Это один из лучших рок-музыкантов. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Программировать не настолько сложно как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "createdDate": `2021-05-16 06:40:25`,
    "category": [
      `Деревья`,
      `Разное`
    ],
    "comments": [
      {
        "id": `hF53mz`,
        "text": `Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const FIRST_ARTICLE_ID = `f_I4su`;
const FIRST_ARTICLE_TITLE = `Ёлки. История деревьев`;
const FIRST_COMMENT_ID = `lPqOjh`;

const newArticle = {
  title: `New title`,
  announce: `New announce`,
  createdDate: `2021-01-01T00:00:00`,
  category: `Cats`,
};

const createAPI = () => {
  const app = express();
  app.use(express.json());

  const cloneData = JSON.parse(JSON.stringify(mockData));
  article(app, new ArticleService(cloneData), new CommentService());

  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First article id equals ${FIRST_ARTICLE_ID}`, () => expect(response.body[0].id).toBe(FIRST_ARTICLE_ID));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${FIRST_ARTICLE_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is ${FIRST_ARTICLE_TITLE}`, () => {
    expect(response.body.title).toBe(FIRST_ARTICLE_TITLE);
  });
});

describe(`API creates new article if data is valid`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () => {
    expect(response.body).toEqual(expect.objectContaining(newArticle));
  });
  test(`Articles count increased by one`, async () => {
    await request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API refuses to create an article if data is invalid`, () => {
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    await request(app).post(`/articles`).send({}).expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API modifies an existing article`, () => {
  const modifiedArticle = {
    title: `Modified title`,
    announce: `Modified announce`,
    createdDate: `2021-01-01T00:00:00`,
    category: `Cats`,
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/${FIRST_ARTICLE_ID}`).send(modifiedArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns modified article`, () => {
    expect(response.body).toEqual(expect.objectContaining(modifiedArticle));
  });
  test(`The article is really modified`, async () => {
    await request(app).get(`/articles/${FIRST_ARTICLE_ID}`)
      .expect((res) => expect(res.body.title).toBe(`Modified title`));
  });
});

test(`API returns status code 404 when trying to modify a non-existent article`, async () => {
  const app = createAPI();

  await request(app).put(`/articles/nonexistent`).send(newArticle).expect(HttpCode.NOT_FOUND);
});

describe(`API correctly removes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/${FIRST_ARTICLE_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(FIRST_ARTICLE_ID));
  test(`Articles count decreased by one`, async () => {
    await request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API returns status code 404 if try to remove a non-existent article`, async () => {
  const app = createAPI();
  await request(app).delete(`/articles/nonexistent`).expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${FIRST_ARTICLE_ID}/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment id is ${FIRST_COMMENT_ID}`, () => expect(response.body[0].id).toBe(FIRST_COMMENT_ID));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Comment text`
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles/${FIRST_ARTICLE_ID}/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => {
    expect(response.body).toEqual(expect.objectContaining(newComment));
  });
  test(`Comments count increased by one`, async () => {
    await request(app).get(`/articles/${FIRST_ARTICLE_ID}/comments`)
      .expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API refuses to create a comment to non-existent article`, async () => {
  const app = createAPI();

  await request(app).post(`/articles/nonexistent/comments`).send({text: `comment`})
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid`, async () => {
  const app = createAPI();
  await request(app).post(`/articles/${FIRST_ARTICLE_ID}/comments`).send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly removes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/${FIRST_ARTICLE_ID}/comments/${FIRST_COMMENT_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment removed`, () => expect(response.body.id).toBe(FIRST_COMMENT_ID));
  test(`Comments count decreased by one`, async () => {
    await request(app).get(`/articles/${FIRST_ARTICLE_ID}/comments`)
      .expect((res) => expect(res.body.length).toBe(2));
  });
});

test(`API refuses to remove non-existent comment`, async () => {
  const app = createAPI();
  await request(app).delete(`/articles/${FIRST_ARTICLE_ID}/comments/nonexistent`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to remove a comment to non-existent article`, async () => {
  const app = createAPI();
  await request(app).delete(`/articles/nonexistent/${FIRST_COMMENT_ID}`).expect(HttpCode.NOT_FOUND);
});
