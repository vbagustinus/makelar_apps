import { maskEmail, maskPhoneNumber } from '../../src/helpers/maskString';

describe('helpers/maskString', () => {
  test('maskPhoneNumber masks middle digits', () => {
    expect(maskPhoneNumber('+6285157212193')).toBe('+628xxxxxxxx93');
  });

  test('maskPhoneNumber returns "-" for empty input', () => {
    expect(maskPhoneNumber('')).toBe('-');
  });

  test('maskEmail masks username middle', () => {
    expect(maskEmail('abcdef@gmail.com')).toBe('abxxef@gmail.com');
  });

  test('maskEmail returns "-" for empty input', () => {
    expect(maskEmail()).toBe('-');
  });
});
