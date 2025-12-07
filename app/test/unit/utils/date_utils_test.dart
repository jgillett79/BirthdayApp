import 'package:flutter_test/flutter_test.dart';
import 'package:birthday_app/core/utils/date_utils.dart';

void main() {
  group('DateHelper', () {
    group('isLeapYear', () {
      test('returns true for leap years', () {
        expect(DateHelper.isLeapYear(2024), isTrue);
        expect(DateHelper.isLeapYear(2000), isTrue);
        expect(DateHelper.isLeapYear(2400), isTrue);
      });

      test('returns false for non-leap years', () {
        expect(DateHelper.isLeapYear(2023), isFalse);
        expect(DateHelper.isLeapYear(1900), isFalse);
        expect(DateHelper.isLeapYear(2100), isFalse);
      });
    });

    group('getDaysInMonth', () {
      test('returns correct days for each month', () {
        expect(DateHelper.getDaysInMonth(1, 2024), equals(31)); // January
        expect(DateHelper.getDaysInMonth(2, 2024), equals(29)); // Feb (leap)
        expect(DateHelper.getDaysInMonth(2, 2023), equals(28)); // Feb (non-leap)
        expect(DateHelper.getDaysInMonth(4, 2024), equals(30)); // April
        expect(DateHelper.getDaysInMonth(12, 2024), equals(31)); // December
      });
    });

    group('daysUntilBirthday', () {
      test('calculates days until future birthday in same year', () {
        final testDate = DateTime(2025, 12, 7);
        final days = DateHelper.daysUntilBirthday(12, 15, from: testDate);
        expect(days, equals(8));
      });

      test('calculates days until birthday next year', () {
        final testDate = DateTime(2025, 12, 7);
        final days = DateHelper.daysUntilBirthday(1, 15, from: testDate);
        expect(days, greaterThan(30));
      });

      test('returns 0 for birthday today', () {
        final testDate = DateTime(2025, 12, 7);
        final days = DateHelper.daysUntilBirthday(12, 7, from: testDate);
        expect(days, equals(0));
      });
    });

    group('calculateAge', () {
      test('calculates age correctly when birthday passed', () {
        final testDate = DateTime(2025, 12, 7);
        final age = DateHelper.calculateAge(2015, 1, 15, from: testDate);
        expect(age, equals(10));
      });

      test('calculates age correctly when birthday not yet this year', () {
        final testDate = DateTime(2025, 12, 7);
        final age = DateHelper.calculateAge(2015, 12, 25, from: testDate);
        expect(age, equals(9));
      });

      test('calculates age correctly on birthday', () {
        final testDate = DateTime(2025, 12, 7);
        final age = DateHelper.calculateAge(2015, 12, 7, from: testDate);
        expect(age, equals(10));
      });
    });

    group('getZodiacSign', () {
      test('returns correct zodiac signs', () {
        expect(DateHelper.getZodiacSign(1, 15), equals('Capricorn'));
        expect(DateHelper.getZodiacSign(3, 25), equals('Aries'));
        expect(DateHelper.getZodiacSign(7, 25), equals('Leo'));
        expect(DateHelper.getZodiacSign(12, 25), equals('Capricorn'));
      });

      test('handles boundary dates correctly', () {
        expect(DateHelper.getZodiacSign(1, 19), equals('Capricorn'));
        expect(DateHelper.getZodiacSign(1, 20), equals('Aquarius'));
      });
    });

    group('formatDaysUntil', () {
      test('formats days correctly', () {
        expect(DateHelper.formatDaysUntil(0), equals('Today'));
        expect(DateHelper.formatDaysUntil(1), equals('Tomorrow'));
        expect(DateHelper.formatDaysUntil(5), equals('5 days'));
        expect(DateHelper.formatDaysUntil(10), equals('1 week'));
        expect(DateHelper.formatDaysUntil(20), equals('2 weeks'));
      });
    });
  });
}
