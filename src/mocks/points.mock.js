import { Destinations } from './destinations.const.js';
import { Offers } from './offers.const.js';
import * as Utl from '../utils.js';

const JOURNEY_START_DATE = Utl.addDays(new Date(), Utl.getRandomInt(10));
const MAX_MINUTES_BETWEEN_POINTS = 60;
const MAX_MINUTES_AT_POINT = 60 * 72;

const generatePoint = (id, previousPoint) => {
  const typeOffers = Utl.getRandomArrayElement(Offers);

  const previousPointDepartureDate = previousPoint ? previousPoint.dateTo : JOURNEY_START_DATE;
  const dateFrom = Utl.addMinutes(previousPointDepartureDate, Utl.getRandomInt(MAX_MINUTES_BETWEEN_POINTS));
  const dateTo = Utl.addMinutes(dateFrom, Utl.getRandomInt(MAX_MINUTES_AT_POINT));

  return {
    id,
    type: typeOffers.type,
    basePrice: Utl.getRandomInt(1, 10) * 100,
    dateFrom,
    dateTo,
    destination: Utl.getRandomArrayElement(Destinations),
    isFavorite: !Utl.getRandomInt(3),
    offers: typeOffers.offers.slice(0, Utl.getRandomInt(5)),
  };
};

export const getPoints = (amount) => new Array(amount).fill()
  .map((_, i, arr) => generatePoint(i, arr[i-1]));


