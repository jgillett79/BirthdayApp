import 'package:drift/drift.dart';

class Households extends Table {
  TextColumn get id => text()();
  TextColumn get name => text().nullable()();
  TextColumn get inviteCode => text()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

class HouseholdMembers extends Table {
  TextColumn get id => text()();
  TextColumn get householdId => text()();
  TextColumn get userId => text().nullable()();
  TextColumn get name => text()();
  TextColumn get role => text()(); // 'ADULT' or 'CHILD'
  BoolColumn get isOwner => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

class PersonAnchors extends Table {
  TextColumn get id => text()();
  TextColumn get personId => text()();
  TextColumn get householdMemberId => text()();

  @override
  Set<Column> get primaryKey => {id};
}
