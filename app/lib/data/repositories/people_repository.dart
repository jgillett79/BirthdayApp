import 'package:uuid/uuid.dart';
import '../local/database.dart';
import '../models/person.dart';
import '../remote/api_client.dart';
import 'package:drift/drift.dart' as drift;

class PeopleRepository {
  final AppDatabase _database;
  final ApiClient _apiClient;
  final _uuid = const Uuid();

  PeopleRepository({
    required AppDatabase database,
    required ApiClient apiClient,
  })  : _database = database,
        _apiClient = apiClient;

  // Get all people (from local DB)
  Future<List<PersonData>> getAllPeople(String householdId) async {
    return await _database.getAllPeople(householdId);
  }

  // Get person by ID (from local DB)
  Future<PersonData?> getPerson(String id) async {
    return await _database.getPersonById(id);
  }

  // Add person (offline-first)
  Future<PersonData> addPerson({
    required String householdId,
    required String name,
    required int birthdayMonth,
    required int birthdayDay,
    int? birthYear,
    String? relationshipType,
    String? notes,
    List<String>? anchorMemberIds,
  }) async {
    final id = _uuid.v4();
    final now = DateTime.now();

    // Save to local DB first
    final person = PeopleCompanion(
      id: drift.Value(id),
      householdId: drift.Value(householdId),
      name: drift.Value(name),
      birthdayMonth: drift.Value(birthdayMonth),
      birthdayDay: drift.Value(birthdayDay),
      birthYear: drift.Value(birthYear),
      relationshipType: drift.Value(relationshipType),
      notes: drift.Value(notes),
      createdAt: drift.Value(now),
      updatedAt: drift.Value(now),
    );

    await _database.insertPerson(person);

    // Add to sync queue
    await _addToSyncQueue(
      entityType: 'person',
      entityId: id,
      operation: 'create',
      payload: {
        'householdId': householdId,
        'name': name,
        'birthdayMonth': birthdayMonth,
        'birthdayDay': birthdayDay,
        'birthYear': birthYear,
        'relationshipType': relationshipType,
        'notes': notes,
        'anchorMemberIds': anchorMemberIds,
      },
    );

    // Set anchors if provided
    if (anchorMemberIds != null && anchorMemberIds.isNotEmpty) {
      await _database.setAnchorsForPerson(id, anchorMemberIds);
    }

    // Try to sync immediately (but don't wait)
    _syncNow();

    return (await _database.getPersonById(id))!;
  }

  // Update person
  Future<PersonData> updatePerson({
    required String id,
    String? name,
    int? birthdayMonth,
    int? birthdayDay,
    int? birthYear,
    String? relationshipType,
    String? notes,
    List<String>? anchorMemberIds,
  }) async {
    final existing = await _database.getPersonById(id);
    if (existing == null) {
      throw Exception('Person not found');
    }

    final updated = PeopleCompanion(
      id: drift.Value(id),
      name: name != null ? drift.Value(name) : drift.Value(existing.name),
      birthdayMonth: birthdayMonth != null
          ? drift.Value(birthdayMonth)
          : drift.Value(existing.birthdayMonth),
      birthdayDay: birthdayDay != null
          ? drift.Value(birthdayDay)
          : drift.Value(existing.birthdayDay),
      birthYear: drift.Value(birthYear ?? existing.birthYear),
      relationshipType: drift.Value(relationshipType ?? existing.relationshipType),
      notes: drift.Value(notes ?? existing.notes),
      updatedAt: drift.Value(DateTime.now()),
    );

    await _database.updatePerson(updated);

    // Update anchors if provided
    if (anchorMemberIds != null) {
      await _database.setAnchorsForPerson(id, anchorMemberIds);
    }

    // Add to sync queue
    await _addToSyncQueue(
      entityType: 'person',
      entityId: id,
      operation: 'update',
      payload: {
        'name': name,
        'birthdayMonth': birthdayMonth,
        'birthdayDay': birthdayDay,
        'birthYear': birthYear,
        'relationshipType': relationshipType,
        'notes': notes,
        'anchorMemberIds': anchorMemberIds,
      },
    );

    _syncNow();

    return (await _database.getPersonById(id))!;
  }

  // Delete person
  Future<void> deletePerson(String id) async {
    await _database.deletePerson(id);

    await _addToSyncQueue(
      entityType: 'person',
      entityId: id,
      operation: 'delete',
      payload: {},
    );

    _syncNow();
  }

  // Get upcoming birthdays
  Future<List<PersonData>> getUpcomingBirthdays(
    String householdId, {
    int daysAhead = 30,
  }) async {
    final allPeople = await _database.getAllPeople(householdId);

    // Filter by days until birthday
    final upcoming = allPeople.where((person) {
      final daysUntil = _calculateDaysUntil(
        person.birthdayMonth,
        person.birthdayDay,
      );
      return daysUntil <= daysAhead;
    }).toList();

    // Sort by days until birthday
    upcoming.sort((a, b) {
      final aDays = _calculateDaysUntil(a.birthdayMonth, a.birthdayDay);
      final bDays = _calculateDaysUntil(b.birthdayMonth, b.birthdayDay);
      return aDays.compareTo(bDays);
    });

    return upcoming;
  }

  int _calculateDaysUntil(int month, int day) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    DateTime nextBirthday = DateTime(now.year, month, day);

    if (nextBirthday.isBefore(today)) {
      nextBirthday = DateTime(now.year + 1, month, day);
    }

    return nextBirthday.difference(today).inDays;
  }

  Future<void> _addToSyncQueue({
    required String entityType,
    required String entityId,
    required String operation,
    required Map<String, dynamic> payload,
  }) async {
    final queueItem = SyncQueueCompanion(
      id: drift.Value(_uuid.v4()),
      entityType: drift.Value(entityType),
      entityId: drift.Value(entityId),
      operation: drift.Value(operation),
      payload: drift.Value(_encodePayload(payload)),
      createdAt: drift.Value(DateTime.now()),
    );

    await _database.addToSyncQueue(queueItem);
  }

  String _encodePayload(Map<String, dynamic> payload) {
    // In production, use json.encode()
    return payload.toString();
  }

  void _syncNow() {
    // TODO: Trigger sync service
    // This would be handled by a sync service in production
  }
}
