import { dateDiff, isTodayOrFutureDate, isPastDate } from './date';
import { FilterType } from '../const.js';

export const sortByDayDesc = (a, b) => dateDiff(b.dateFrom, a.dateFrom);

export const sortByPriceDesc = (a, b) => b.basePrice - a.basePrice;

export const sortByDurationDesc = (a, b) => dateDiff(b.dateFrom, b.dateTo) - dateDiff(a.dateFrom, a.dateTo);

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isPastDate(point.dateFrom)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isTodayOrFutureDate(point.dateTo)),
};
