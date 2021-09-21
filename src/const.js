export const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'];

export const FilterType = {
  EVERYTHING: 'Everything',
  PAST: 'Past',
  FUTURE: 'Future',
};

export const SortingType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

export const DISABLED_SORTING_TYPES = [
  SortingType.EVENT,
  SortingType.OFFER];

export const UserAction = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  DELETE: 'DELETE',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const BLANK_POINT = {
  type: 'taxi',
  basePrice: 0,
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
  destination: null,
  isFavorite: false,
  offers: [],
};

export const MenuItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};

export const STAT_TYPES = [
  'money',
  'type',
  'time-spend',
];
