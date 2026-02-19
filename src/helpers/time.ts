import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(isSameOrAfter);

// in days
export const isOlderThan = (timestamp, n = 1) => {
  const comparisonDate = dayjs().subtract(n, 'day');
  return dayjs(timestamp).isBefore(comparisonDate);
};

// in years
export const rangeOfYears = (setelman, tempo) => {
  const start = dayjs(setelman || new Date());
  const end = dayjs(tempo || new Date());
  return end.diff(start, 'year');
};

export const countDaysUntilExpired = expiredDate => {
  const start = dayjs();
  const end = dayjs(expiredDate || new Date());
  return end.diff(start, 'day');
};

export const setMinDate = (date, separate) =>
  ('0' + date.getUTCDate()).slice(-2) +
  separate +
  ('0' + (date.getUTCMonth() + 1)).slice(-2) +
  separate +
  date.getUTCFullYear();

export const setMaxDate = (date, separate) =>
  ('0' + date.getUTCDate()).slice(-2) +
  separate +
  ('0' + (date.getUTCMonth() + 1)).slice(-2) +
  separate +
  date.getUTCFullYear();

export const getLastDay = (y, m) => new Date(y, m, 0).getDate();
