import { getDestination } from './destinations.mock.js';
import { getOffers } from './offers.mock.js';
import { PointTypes } from '../const.js';
import { getRandomInt, getRandomArrayElement, getShuffledArray } from '../utils.js';
import { addDays, addMinutes } from 'date-fns';

const JOURNEY_START_DATE = addDays(new Date(), getRandomInt(10));
const MAX_MINUTES_BETWEEN_POINTS = 60;
const MAX_MINUTES_AT_POINT = 60 * 72;

const generatePoint = (id, previousPoint) => {
  const type = getRandomArrayElement(PointTypes);

  const previousPointDepartureDate = previousPoint ? previousPoint.dateTo : JOURNEY_START_DATE;
  const dateFrom = addMinutes(previousPointDepartureDate, getRandomInt(MAX_MINUTES_BETWEEN_POINTS));
  const dateTo = addMinutes(dateFrom, getRandomInt(MAX_MINUTES_AT_POINT));

  return {
    id,
    type,
    basePrice: getRandomInt(1, 10) * 100,
    dateFrom,
    dateTo,
    destination: getDestination(),
    isFavorite: !getRandomInt(3),
    offers: getShuffledArray(getOffers(type), getRandomInt(5)),
  };
};

export const getPoints = (amount) => new Array(amount).fill()
  .map((_, i, arr) => generatePoint(i, arr[i-1]));


