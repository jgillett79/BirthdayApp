import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'tables/people_table.dart';
import 'tables/yearly_events_table.dart';
import 'tables/household_table.dart';
import 'tables/sync_queue_table.dart';

part 'database.g.dart';

@DriftDatabase(tables: [
  People,
  YearlyEvents,
  Households,
  HouseholdMembers,
  PersonAnchors,
  SyncQueue,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  // People operations
  Future<List<PersonData>> getAllPeople(String householdId) {
    return (select(people)..where((p) => p.householdId.equals(householdId))).get();
  }

  Future<PersonData?> getPersonById(String id) {
    return (select(people)..where((p) => p.id.equals(id))).getSingleOrNull();
  }

  Future<int> insertPerson(PeopleCompanion person) {
    return into(people).insert(person);
  }

  Future<bool> updatePerson(PeopleCompanion person) {
    return update(people).replace(person);
  }

  Future<int> deletePerson(String id) {
    return (delete(people)..where((p) => p.id.equals(id))).go();
  }

  // Yearly Events operations
  Future<List<YearlyEventData>> getYearlyEventsForPerson(String personId) {
    return (select(yearlyEvents)
          ..where((e) => e.personId.equals(personId))
          ..orderBy([(e) => OrderingTerm.desc(e.year)]))
        .get();
  }

  Future<YearlyEventData?> getYearlyEvent(String personId, int year) {
    return (select(yearlyEvents)
          ..where((e) => e.personId.equals(personId) & e.year.equals(year)))
        .getSingleOrNull();
  }

  Future<int> insertYearlyEvent(YearlyEventsCompanion event) {
    return into(yearlyEvents).insert(event);
  }

  Future<bool> updateYearlyEvent(YearlyEventsCompanion event) {
    return update(yearlyEvents).replace(event);
  }

  // Household operations
  Future<HouseholdData?> getHousehold(String id) {
    return (select(households)..where((h) => h.id.equals(id))).getSingleOrNull();
  }

  Future<List<HouseholdMemberData>> getHouseholdMembers(String householdId) {
    return (select(householdMembers)
          ..where((m) => m.householdId.equals(householdId)))
        .get();
  }

  Future<int> insertHousehold(HouseholdsCompanion household) {
    return into(households).insert(household);
  }

  Future<int> insertHouseholdMember(HouseholdMembersCompanion member) {
    return into(householdMembers).insert(member);
  }

  // Person Anchors operations
  Future<List<PersonAnchorData>> getAnchorsForPerson(String personId) {
    return (select(personAnchors)..where((a) => a.personId.equals(personId))).get();
  }

  Future<void> setAnchorsForPerson(String personId, List<String> memberIds) async {
    await (delete(personAnchors)..where((a) => a.personId.equals(personId))).go();

    for (final memberId in memberIds) {
      await into(personAnchors).insert(
        PersonAnchorsCompanion.insert(
          personId: personId,
          householdMemberId: memberId,
        ),
      );
    }
  }

  // Sync Queue operations
  Future<List<SyncQueueData>> getPendingSync() {
    return (select(syncQueue)
          ..orderBy([(s) => OrderingTerm.asc(s.createdAt)]))
        .get();
  }

  Future<int> addToSyncQueue(SyncQueueCompanion item) {
    return into(syncQueue).insert(item);
  }

  Future<int> removeSyncQueueItem(String id) {
    return (delete(syncQueue)..where((s) => s.id.equals(id))).go();
  }

  Future<int> clearSyncQueue() {
    return delete(syncQueue).go();
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'birthday_app.sqlite'));
    return NativeDatabase(file);
  });
}
