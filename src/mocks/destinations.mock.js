import { getRandomArrayElement, getRandomInt, getShuffledArray } from '../utils.js';
import {
  DESTINATION_NAMES,
  DESTINATION_DESCRIPTIONS,
  DESTINATION_PICTURE_SOURCES,
  DESTINATION_PICTURE_DESCRIPTIONS
} from './destinations.const.js';

export const Destinations = getShuffledArray(DESTINATION_NAMES, getRandomInt(10))
  .map((name) => ({
    name,
    description: getRandomArrayElement(DESTINATION_DESCRIPTIONS),
    pictures: new Array(getRandomInt(5)).fill()
      .map(() => ({
        src: getRandomArrayElement(DESTINATION_PICTURE_SOURCES),
        description: getRandomArrayElement(DESTINATION_PICTURE_DESCRIPTIONS),
      })),
  }));

export const getDestination = () => getRandomArrayElement(Destinations);
