import {
  countDaysUntilExpired,
  getLastDay,
  isOlderThan,
  rangeOfYears,
  setMinDate,
} from '../../src/helpers/time';

describe('helpers/time', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-10T00:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('isOlderThan returns true for dates older than N days', () => {
    expect(isOlderThan('2025-01-08T00:00:00Z', 1)).toBe(true);
    expect(isOlderThan('2025-01-09T00:00:00Z', 1)).toBe(false);
  });

  test('rangeOfYears returns diff in years', () => {
    expect(rangeOfYears('2020-01-01', '2025-01-01')).toBe(5);
  });

  test('countDaysUntilExpired returns day diff', () => {
    expect(countDaysUntilExpired('2025-01-11T00:00:00Z')).toBe(1);
  });

  test('setMinDate formats UTC date', () => {
    const date = new Date(Date.UTC(2025, 0, 2));
    expect(setMinDate(date, '/')).toBe('02/01/2025');
  });

  test('getLastDay returns last day of month', () => {
    expect(getLastDay(2024, 2)).toBe(29);
  });
});
