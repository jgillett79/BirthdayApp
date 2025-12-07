import 'package:drift/drift.dart';

class YearlyEvents extends Table {
  TextColumn get id => text()();
  TextColumn get personId => text()();
  IntColumn get year => integer()();
  DateTimeColumn get partyDate => dateTime().nullable()();
  TextColumn get partyTime => text().nullable()();
  TextColumn get partyLocation => text().nullable()();
  BoolColumn get giftBought => boolean().withDefault(const Constant(false))();
  TextColumn get giftDescription => text().nullable()();
  BoolColumn get rsvpSent => boolean().withDefault(const Constant(false))();
  BoolColumn get cardSent => boolean().withDefault(const Constant(false))();
  TextColumn get notes => text().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}
