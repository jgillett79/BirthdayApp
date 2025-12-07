import 'package:drift/drift.dart';

class SyncQueue extends Table {
  TextColumn get id => text()();
  TextColumn get entityType => text()(); // 'person', 'yearlyEvent', etc.
  TextColumn get entityId => text()();
  TextColumn get operation => text()(); // 'create', 'update', 'delete'
  TextColumn get payload => text()(); // JSON
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  IntColumn get retryCount => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {id};
}
