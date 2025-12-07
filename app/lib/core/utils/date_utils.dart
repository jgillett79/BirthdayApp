class DateHelper {
  static bool isLeapYear(int year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }

  static int getDaysInMonth(int month, int year) {
    final daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month == 2 && isLeapYear(year)) {
      return 29;
    }
    return daysInMonth[month - 1];
  }

  static int daysUntilBirthday(int month, int day, {DateTime? from}) {
    final now = from ?? DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    DateTime nextBirthday = DateTime(now.year, month, day);

    if (nextBirthday.isBefore(today)) {
      nextBirthday = DateTime(now.year + 1, month, day);
    }

    return nextBirthday.difference(today).inDays;
  }

  static int calculateAge(int birthYear, int month, int day, {DateTime? from}) {
    final now = from ?? DateTime.now();
    int age = now.year - birthYear;

    final birthdayThisYear = DateTime(now.year, month, day);
    if (now.isBefore(birthdayThisYear)) {
      age--;
    }

    return age;
  }

  static String getZodiacSign(int month, int day) {
    const zodiacSigns = [
      {'sign': 'Capricorn', 'month': 1, 'day': 19},
      {'sign': 'Aquarius', 'month': 2, 'day': 18},
      {'sign': 'Pisces', 'month': 3, 'day': 20},
      {'sign': 'Aries', 'month': 4, 'day': 19},
      {'sign': 'Taurus', 'month': 5, 'day': 20},
      {'sign': 'Gemini', 'month': 6, 'day': 20},
      {'sign': 'Cancer', 'month': 7, 'day': 22},
      {'sign': 'Leo', 'month': 8, 'day': 22},
      {'sign': 'Virgo', 'month': 9, 'day': 22},
      {'sign': 'Libra', 'month': 10, 'day': 22},
      {'sign': 'Scorpio', 'month': 11, 'day': 21},
      {'sign': 'Sagittarius', 'month': 12, 'day': 21},
    ];

    for (var zodiac in zodiacSigns) {
      if (month < zodiac['month']! ||
          (month == zodiac['month'] && day <= zodiac['day']!)) {
        return zodiac['sign']! as String;
      }
    }

    return 'Capricorn'; // Dec 22-31
  }

  static String formatDaysUntil(int days) {
    if (days == 0) return 'Today';
    if (days == 1) return 'Tomorrow';
    if (days < 7) return '$days days';
    if (days < 14) return '1 week';
    if (days < 21) return '2 weeks';
    if (days < 30) return '3 weeks';
    return '${(days / 30).round()} months';
  }
}
