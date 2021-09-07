export * from 'date-fns';

export const getRandomInt = (a, b = 0) => {
  const [min, max] = a > b ? [b, a] : [a, b];
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomArrayElement = (array) => array[getRandomInt(array.length - 1)];

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

