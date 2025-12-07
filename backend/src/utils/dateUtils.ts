export class DateUtils {
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static getDaysInMonth(month: number, year: number): number {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && this.isLeapYear(year)) {
      return 29;
    }
    return daysInMonth[month - 1];
  }

  static isValidDate(month: number, day: number): boolean {
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;

    // For Feb 29, allow it (we'll handle leap year preference elsewhere)
    if (month === 2 && day === 29) return true;

    // Check against max days in month (using 2024 as leap year reference)
    const maxDays = this.getDaysInMonth(month, 2024);
    return day <= maxDays;
  }

  static getZodiacSign(month: number, day: number): string {
    const zodiacDates = [
      { sign: 'capricorn', endMonth: 1, endDay: 19 },
      { sign: 'aquarius', endMonth: 2, endDay: 18 },
      { sign: 'pisces', endMonth: 3, endDay: 20 },
      { sign: 'aries', endMonth: 4, endDay: 19 },
      { sign: 'taurus', endMonth: 5, endDay: 20 },
      { sign: 'gemini', endMonth: 6, endDay: 20 },
      { sign: 'cancer', endMonth: 7, endDay: 22 },
      { sign: 'leo', endMonth: 8, endDay: 22 },
      { sign: 'virgo', endMonth: 9, endDay: 22 },
      { sign: 'libra', endMonth: 10, endDay: 22 },
      { sign: 'scorpio', endMonth: 11, endDay: 21 },
      { sign: 'sagittarius', endMonth: 12, endDay: 21 },
    ];

    for (let i = 0; i < zodiacDates.length; i++) {
      const current = zodiacDates[i];
      if (month < current.endMonth || (month === current.endMonth && day <= current.endDay)) {
        return current.sign;
      }
    }

    return 'capricorn'; // Dec 22-31
  }

  static daysUntilBirthday(month: number, day: number, fromDate: Date = new Date()): number {
    const today = new Date(fromDate);
    today.setHours(0, 0, 0, 0);

    const currentYear = today.getFullYear();
    let birthdayThisYear = new Date(currentYear, month - 1, day);

    if (birthdayThisYear < today) {
      // Birthday already passed this year, calculate for next year
      birthdayThisYear = new Date(currentYear + 1, month - 1, day);
    }

    const diffTime = birthdayThisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  static calculateAge(birthYear: number, month: number, day: number, fromDate: Date = new Date()): number {
    const today = fromDate;
    let age = today.getFullYear() - birthYear;

    // Check if birthday hasn't occurred yet this year
    const birthdayThisYear = new Date(today.getFullYear(), month - 1, day);
    if (today < birthdayThisYear) {
      age--;
    }

    return age;
  }

  static getEffectiveBirthdayDate(
    month: number,
    day: number,
    year: number,
    leapYearPref: 'FEB_28' | 'MARCH_1' | 'LEAP_ONLY'
  ): Date | null {
    // If not Feb 29, return normal date
    if (month !== 2 || day !== 29) {
      return new Date(year, month - 1, day);
    }

    // Feb 29 birthday handling
    if (this.isLeapYear(year)) {
      return new Date(year, 1, 29); // Feb 29
    }

    // Non-leap year
    switch (leapYearPref) {
      case 'FEB_28':
        return new Date(year, 1, 28); // Feb 28
      case 'MARCH_1':
        return new Date(year, 2, 1); // March 1
      case 'LEAP_ONLY':
        return null; // No reminder in non-leap years
      default:
        return new Date(year, 1, 28);
    }
  }
}
