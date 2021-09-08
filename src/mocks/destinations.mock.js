import { getRandomArrayElement, getRandomInt, getShuffledArray } from '../utils.js';
import { names, descriptions, pictures } from './destinations.const.js';

const destinations = names
  .map((name) => ({
    name,
    description: getRandomArrayElement(descriptions),
    pictures: getShuffledArray(pictures, getRandomInt(5)),
  }));


export const getDestination = () => getRandomArrayElement(destinations);
