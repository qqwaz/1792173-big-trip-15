import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);
dayjs.extend(duration);

export const formatDate = (date, format) =>
  date
    ? dayjs(date).format(format)
    : '';

export const formatDateFull = (date) => formatDate(date, 'DD/MM/YY HH:mm');

export const formatDuration = (time) => {
  if (time === 0) {
    return '0M';
  }
  const diff = dayjs.duration(time);
  return [
    diff.days() ? diff.format('DD[D]') : '',
    diff.hours() ? diff.format('HH[H]') : '',
    diff.minutes() ? diff.format('mm[M]') : '',
  ].join(' ');
};

export const formatPeriod = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return '';
  }
  return formatDuration(dayjs(dateTo).diff(dateFrom));
};

export const dateDiff = (from, to) => dayjs(to).diff(dayjs(from));

export const isTodayOrFutureDate = (date) => dayjs().isSameOrBefore(dayjs(date), 'D');

export const isPastDate = (date) => dayjs().isAfter(dayjs(date), 'D');
