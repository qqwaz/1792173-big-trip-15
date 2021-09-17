export const getRandomInt = (a, b = 0, multiplicator = 1) => {
  const [min, max] = a > b ? [b, a] : [a, b];
  return Math.floor(Math.random() * (max - min + 1) + min) * multiplicator;
};

export const getRandomArrayElement = (array) => array[getRandomInt(array.length - 1)];

export const getShuffledArray = (array, length) => {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.slice(0, Math.min(array.length, (Number.isInteger(length) ? length : array.length)));
};

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
