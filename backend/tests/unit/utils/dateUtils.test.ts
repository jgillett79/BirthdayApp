import { DateUtils } from '../../../src/utils/dateUtils';

describe('DateUtils', () => {
  describe('isLeapYear', () => {
    it('should return true for leap years', () => {
      expect(DateUtils.isLeapYear(2024)).toBe(true);
      expect(DateUtils.isLeapYear(2000)).toBe(true);
      expect(DateUtils.isLeapYear(2400)).toBe(true);
    });

    it('should return false for non-leap years', () => {
      expect(DateUtils.isLeapYear(2023)).toBe(false);
      expect(DateUtils.isLeapYear(1900)).toBe(false);
      expect(DateUtils.isLeapYear(2100)).toBe(false);
    });
  });

  describe('getDaysInMonth', () => {
    it('should return correct days for each month', () => {
      expect(DateUtils.getDaysInMonth(1, 2024)).toBe(31); // January
      expect(DateUtils.getDaysInMonth(2, 2024)).toBe(29); // February (leap year)
      expect(DateUtils.getDaysInMonth(2, 2023)).toBe(28); // February (non-leap)
      expect(DateUtils.getDaysInMonth(4, 2024)).toBe(30); // April
      expect(DateUtils.getDaysInMonth(12, 2024)).toBe(31); // December
    });
  });

  describe('isValidDate', () => {
    it('should validate correct dates', () => {
      expect(DateUtils.isValidDate(1, 15)).toBe(true);
      expect(DateUtils.isValidDate(2, 29)).toBe(true); // Feb 29 allowed
      expect(DateUtils.isValidDate(12, 31)).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(DateUtils.isValidDate(0, 15)).toBe(false); // Invalid month
      expect(DateUtils.isValidDate(13, 15)).toBe(false); // Invalid month
      expect(DateUtils.isValidDate(1, 0)).toBe(false); // Invalid day
      expect(DateUtils.isValidDate(2, 30)).toBe(false); // Feb 30
      expect(DateUtils.isValidDate(4, 31)).toBe(false); // April 31
    });
  });

  describe('getZodiacSign', () => {
    it('should return correct zodiac signs', () => {
      expect(DateUtils.getZodiacSign(1, 15)).toBe('capricorn');
      expect(DateUtils.getZodiacSign(3, 25)).toBe('aries');
      expect(DateUtils.getZodiacSign(7, 25)).toBe('leo');
      expect(DateUtils.getZodiacSign(12, 25)).toBe('capricorn');
    });

    it('should handle boundary dates correctly', () => {
      expect(DateUtils.getZodiacSign(1, 19)).toBe('capricorn');
      expect(DateUtils.getZodiacSign(1, 20)).toBe('aquarius');
      expect(DateUtils.getZodiacSign(12, 21)).toBe('sagittarius');
      expect(DateUtils.getZodiacSign(12, 22)).toBe('capricorn');
    });
  });

  describe('daysUntilBirthday', () => {
    it('should calculate days until birthday', () => {
      const today = new Date('2025-12-07');

      // Birthday in same month, after today
      expect(DateUtils.daysUntilBirthday(12, 15, today)).toBe(8);

      // Birthday already passed this year
      expect(DateUtils.daysUntilBirthday(1, 15, today)).toBeGreaterThan(30);

      // Birthday today
      expect(DateUtils.daysUntilBirthday(12, 7, today)).toBe(0);
    });
  });

  describe('calculateAge', () => {
    it('should calculate age correctly', () => {
      const today = new Date('2025-12-07');

      // Birthday already happened this year
      expect(DateUtils.calculateAge(2015, 1, 15, today)).toBe(10);

      // Birthday not yet this year
      expect(DateUtils.calculateAge(2015, 12, 25, today)).toBe(9);

      // Birthday today
      expect(DateUtils.calculateAge(2015, 12, 7, today)).toBe(10);
    });
  });
});
