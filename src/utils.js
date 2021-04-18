'use strict';

const dayjs = require(`dayjs`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getRandomItemsFromArray = (array) => {
  const shuffledArray = shuffle([...array]);
  const arrayLastItemIndex = shuffledArray.length - 1;
  const randomStartIndex = getRandomInt(1, arrayLastItemIndex - 1);

  return shuffledArray.slice(randomStartIndex, arrayLastItemIndex);
};

const getRandomDate = (monthDifferenceBetweenDates) => {
  const dateFormat = `YYYY-MM-DD HH:mm:ss`;
  const currentDate = dayjs();
  const startDate = currentDate.subtract(monthDifferenceBetweenDates, `month`);

  return dayjs(currentDate - Math.random() * currentDate.diff(startDate)).format(dateFormat);
};

module.exports = {
  getRandomInt,
  shuffle,
  getRandomItemsFromArray,
  getRandomDate
};
