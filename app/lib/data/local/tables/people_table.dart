import 'package:drift/drift.dart';

class People extends Table {
  TextColumn get id => text()();
  TextColumn get householdId => text()();
  TextColumn get name => text()();
  IntColumn get birthdayMonth => integer()();
  IntColumn get birthdayDay => integer()();
  IntColumn get birthYear => integer().nullable()();
  TextColumn get relationshipType => text().nullable()();
  TextColumn get notes => text().nullable()();
  BoolColumn get isDeceased => boolean().withDefault(const Constant(false))();
  TextColumn get leapYearPref => text().withDefault(const Constant('feb28'))();
  TextColumn get reminderDays => text().nullable()(); // JSON array
  TextColumn get reminderTime => text().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}
