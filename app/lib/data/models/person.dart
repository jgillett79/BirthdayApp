import 'package:equatable/equatable.dart';

enum RelationshipType {
  family,
  friend,
  school,
  work,
  neighbour,
  other,
}

enum LeapYearPreference {
  feb28,
  march1,
  leapOnly,
}

class Person extends Equatable {
  final String id;
  final String householdId;
  final String name;
  final int birthdayMonth; // 1-12
  final int birthdayDay; // 1-31
  final int? birthYear;
  final RelationshipType? relationshipType;
  final String? notes;
  final bool isDeceased;
  final LeapYearPreference leapYearPref;
  final List<int>? reminderDays;
  final String? reminderTime;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Person({
    required this.id,
    required this.householdId,
    required this.name,
    required this.birthdayMonth,
    required this.birthdayDay,
    this.birthYear,
    this.relationshipType,
    this.notes,
    this.isDeceased = false,
    this.leapYearPref = LeapYearPreference.feb28,
    this.reminderDays,
    this.reminderTime,
    required this.createdAt,
    required this.updatedAt,
  });

  // Calculate age if birth year is known
  int? get age {
    if (birthYear == null) return null;

    final now = DateTime.now();
    int calculatedAge = now.year - birthYear!;

    // Check if birthday hasn't occurred yet this year
    final birthdayThisYear = DateTime(now.year, birthdayMonth, birthdayDay);
    if (now.isBefore(birthdayThisYear)) {
      calculatedAge--;
    }

    return calculatedAge;
  }

  // Calculate days until next birthday
  int get daysUntilBirthday {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    DateTime nextBirthday = DateTime(now.year, birthdayMonth, birthdayDay);

    if (nextBirthday.isBefore(today)) {
      nextBirthday = DateTime(now.year + 1, birthdayMonth, birthdayDay);
    }

    return nextBirthday.difference(today).inDays;
  }

  // Get zodiac sign
  String get zodiacSign {
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
      if (birthdayMonth < (zodiac['month'] as int) ||
          (birthdayMonth == zodiac['month'] && birthdayDay <= (zodiac['day'] as int))) {
        return zodiac['sign'] as String;
      }
    }

    return 'Capricorn'; // Dec 22-31
  }

  Person copyWith({
    String? id,
    String? householdId,
    String? name,
    int? birthdayMonth,
    int? birthdayDay,
    int? birthYear,
    RelationshipType? relationshipType,
    String? notes,
    bool? isDeceased,
    LeapYearPreference? leapYearPref,
    List<int>? reminderDays,
    String? reminderTime,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Person(
      id: id ?? this.id,
      householdId: householdId ?? this.householdId,
      name: name ?? this.name,
      birthdayMonth: birthdayMonth ?? this.birthdayMonth,
      birthdayDay: birthdayDay ?? this.birthdayDay,
      birthYear: birthYear ?? this.birthYear,
      relationshipType: relationshipType ?? this.relationshipType,
      notes: notes ?? this.notes,
      isDeceased: isDeceased ?? this.isDeceased,
      leapYearPref: leapYearPref ?? this.leapYearPref,
      reminderDays: reminderDays ?? this.reminderDays,
      reminderTime: reminderTime ?? this.reminderTime,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        householdId,
        name,
        birthdayMonth,
        birthdayDay,
        birthYear,
        relationshipType,
        notes,
        isDeceased,
        leapYearPref,
        reminderDays,
        reminderTime,
        createdAt,
        updatedAt,
      ];
}
