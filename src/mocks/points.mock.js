import { getDestination } from './destinations.mock.js';
import { getOffers } from './offers.mock.js';
import { POINT_TYPES } from '../const.js';
import { getRandomInt, getRandomArrayElement, getShuffledArray } from '../utils.js';
import dayjs from 'dayjs';

const JOURNEY_START_DATE = dayjs().add(getRandomInt(10), 'd');
const MAX_MINUTES_BETWEEN_POINTS = 60;
const MAX_MINUTES_AT_POINT = 60 * 72;

const generatePoint = (id, previousPoint) => {
  const type = getRandomArrayElement(POINT_TYPES);

  const previousPointDepartureDate = previousPoint ? previousPoint.dateTo : JOURNEY_START_DATE;
  const dateFrom = dayjs(previousPointDepartureDate).add(getRandomInt(MAX_MINUTES_BETWEEN_POINTS), 'm');
  const dateTo = dayjs(dateFrom).add(getRandomInt(MAX_MINUTES_AT_POINT), 'm');

  return {
    id,
    type,
    basePrice: getRandomInt(1, 10) * 100,
    dateFrom,
    dateTo,
    destination: getDestination(),
    isFavorite: !getRandomInt(3),
    offers: getShuffledArray(getOffers(type), getRandomInt(1, 5)),
  };
};

export const getPoints = (amount) => new Array(amount).fill()
  .map((_, i, arr) => generatePoint(i, arr[i-1]));
