import { getRandomInt, getShuffledArray } from '../utils.js';
import { offers } from './offers.const.js';
import { PointTypes } from '../const.js';

const availableOffers = PointTypes
  .map((type) => ({
    type,
    offers: getShuffledArray(offers, getRandomInt(10)),
  }));

export const getOffers = (type) => availableOffers.find((item) => item.type === type).offers;

