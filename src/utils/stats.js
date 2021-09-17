import { POINT_TYPES } from '../const';
import { dateDiff, formatDuration } from './date';

const initial = () => Object.fromEntries(POINT_TYPES.map((type) => ([type, 0])));

export const calcMoney = (points) => {
  const data = points
    .reduce((acc, point) => {
      acc[point.type] += point.basePrice;
      return acc;
    }, initial());
  return new Map(Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .map((item) => [item[0].toUpperCase(), item[1]]),
  );
};

export const calcType = (points) => {
  const data = points
    .reduce((acc, point) => {
      acc[point.type]++;
      return acc;
    }, initial());
  return new Map(Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .map((item) => [item[0].toUpperCase(), item[1]]),
  );
};

export const calcTime = (points) => {
  const data = points
    .reduce((acc, point) => {
      acc[point.type] += dateDiff(point.dateFrom, point.dateTo);
      return acc;
    }, initial());
  return new Map(Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .map((item) => [item[0].toUpperCase(), item[1]]),
  );
};

export const formatMoney = (value) => `€ ${value}`;

export const formatType = (value) => `${value}x`;

export const formatTime = (value) => formatDuration(value);
