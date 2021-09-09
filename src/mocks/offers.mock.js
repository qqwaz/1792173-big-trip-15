import { getRandomInt, getShuffledArray, getRandomArrayElement } from '../utils.js';
import { OFFRER_TITLES } from './offers.const.js';
import { POINT_TYPES } from '../const.js';

const availableOffers = getShuffledArray(POINT_TYPES)
  .map((type) => ({
    type,
    offers: new Array(getRandomInt(10)).fill()
      .map(() => ({
        title: getRandomArrayElement(OFFRER_TITLES),
        price: getRandomInt(5, 20) * 10,
      })),
  }));

export const getOffers = (type) => availableOffers.find((item) => item.type === type).offers;
