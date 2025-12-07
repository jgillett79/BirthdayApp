# Birthday Reminder App - Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for the Birthday Reminder app. The goal is to achieve high confidence in code quality with full regression testing capability.

---

## Testing Pyramid

```
                    ┌─────────────────┐
                    │    E2E Tests    │  ← Few, slow, high confidence
                    │   (10-20 tests) │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │ Integration     │  ← Medium count, medium speed
                    │ Tests (50-100)  │
                    └────────┬────────┘
                             │
           ┌─────────────────┴─────────────────┐
           │          Unit Tests               │  ← Many, fast, isolated
           │          (200-500 tests)          │
           └───────────────────────────────────┘
```

---

## Flutter App Testing

### 1. Unit Tests

**Location:** `app/test/unit/`

#### Models
```dart
// test/unit/models/person_test.dart

void main() {
  group('Person', () {
    group('age calculation', () {
      test('calculates age correctly for past birthday this year', () {
        final person = Person(
          name: 'Test',
          birthdayMonth: 1,
          birthdayDay: 15,
          birthYear: 2015,
        );
        // Assuming current date is Dec 2025
        expect(person.age, equals(10));
      });

      test('calculates age correctly for upcoming birthday this year', () {
        final person = Person(
          name: 'Test',
          birthdayMonth: 12,
          birthdayDay: 25,
          birthYear: 2015,
        );
        // Assuming current date is Dec 7, 2025
        expect(person.age, equals(9)); // Not yet 10
      });

      test('returns null when birth year not provided', () {
        final person = Person(
          name: 'Test',
          birthdayMonth: 3,
          birthdayDay: 15,
          birthYear: null,
        );
        expect(person.age, isNull);
      });
    });

    group('days until birthday', () {
      test('calculates days for upcoming birthday', () {
        // Test with mocked current date
      });

      test('handles year boundary correctly', () {
        // Birthday in January, current date in December
      });

      test('returns 0 on birthday', () {
        // Current date matches birthday
      });
    });

    group('zodiac sign', () {
      test('returns correct sign for each date range', () {
        final testCases = [
          (month: 1, day: 15, expected: ZodiacSign.capricorn),
          (month: 2, day: 15, expected: ZodiacSign.aquarius),
          (month: 3, day: 25, expected: ZodiacSign.aries),
          (month: 4, day: 25, expected: ZodiacSign.taurus),
          (month: 5, day: 25, expected: ZodiacSign.gemini),
          (month: 6, day: 25, expected: ZodiacSign.cancer),
          (month: 7, day: 25, expected: ZodiacSign.leo),
          (month: 8, day: 25, expected: ZodiacSign.virgo),
          (month: 9, day: 25, expected: ZodiacSign.libra),
          (month: 10, day: 25, expected: ZodiacSign.scorpio),
          (month: 11, day: 25, expected: ZodiacSign.sagittarius),
          (month: 12, day: 25, expected: ZodiacSign.capricorn),
        ];

        for (final tc in testCases) {
          final person = Person(
            name: 'Test',
            birthdayMonth: tc.month,
            birthdayDay: tc.day,
          );
          expect(person.zodiacSign, equals(tc.expected));
        }
      });

      test('handles zodiac boundary dates correctly', () {
        // Test cusp dates (e.g., Jan 20 Capricorn vs Aquarius)
      });
    });
  });
}
```

#### Date Utilities
```dart
// test/unit/utils/date_utils_test.dart

void main() {
  group('DateUtils', () {
    group('isLeapYear', () {
      test('returns true for leap years', () {
        expect(DateUtils.isLeapYear(2024), isTrue);
        expect(DateUtils.isLeapYear(2000), isTrue);
      });

      test('returns false for non-leap years', () {
        expect(DateUtils.isLeapYear(2023), isFalse);
        expect(DateUtils.isLeapYear(1900), isFalse);
        expect(DateUtils.isLeapYear(2100), isFalse);
      });
    });

    group('getEffectiveBirthday', () {
      test('returns Feb 28 for Feb 29 birthday in non-leap year with FEB_28 pref', () {
        final result = DateUtils.getEffectiveBirthday(
          month: 2,
          day: 29,
          year: 2023,
          leapYearPref: LeapYearPreference.feb28,
        );
        expect(result.month, equals(2));
        expect(result.day, equals(28));
      });

      test('returns Mar 1 for Feb 29 birthday in non-leap year with MARCH_1 pref', () {
        final result = DateUtils.getEffectiveBirthday(
          month: 2,
          day: 29,
          year: 2023,
          leapYearPref: LeapYearPreference.march1,
        );
        expect(result.month, equals(3));
        expect(result.day, equals(1));
      });

      test('returns null for Feb 29 birthday in non-leap year with LEAP_ONLY pref', () {
        final result = DateUtils.getEffectiveBirthday(
          month: 2,
          day: 29,
          year: 2023,
          leapYearPref: LeapYearPreference.leapOnly,
        );
        expect(result, isNull);
      });

      test('returns Feb 29 for Feb 29 birthday in leap year', () {
        final result = DateUtils.getEffectiveBirthday(
          month: 2,
          day: 29,
          year: 2024,
          leapYearPref: LeapYearPreference.feb28,
        );
        expect(result.month, equals(2));
        expect(result.day, equals(29));
      });
    });

    group('daysUntil', () {
      test('calculates correctly within same month', () {
        // Current: Dec 7, Target: Dec 15 = 8 days
      });

      test('calculates correctly across months', () {
        // Current: Dec 7, Target: Jan 15 = 39 days
      });

      test('handles year boundary', () {
        // Current: Dec 31, Target: Jan 1 = 1 day
      });
    });
  });
}
```

#### Repository Tests
```dart
// test/unit/repositories/people_repository_test.dart

void main() {
  late MockPeopleDao mockDao;
  late MockPeopleApi mockApi;
  late MockSyncService mockSyncService;
  late PeopleRepository repository;

  setUp(() {
    mockDao = MockPeopleDao();
    mockApi = MockPeopleApi();
    mockSyncService = MockSyncService();
    repository = PeopleRepository(
      dao: mockDao,
      api: mockApi,
      syncService: mockSyncService,
    );
  });

  group('getPeople', () {
    test('returns people from local database', () async {
      when(mockDao.getAllPeople()).thenAnswer((_) async => [testPerson]);

      final result = await repository.getPeople();

      expect(result, hasLength(1));
      verify(mockDao.getAllPeople()).called(1);
      verifyNever(mockApi.getPeople());
    });
  });

  group('addPerson', () {
    test('saves to local DB and queues sync', () async {
      final person = Person(name: 'Test', birthdayMonth: 3, birthdayDay: 15);

      when(mockDao.insertPerson(any)).thenAnswer((_) async => 'id-123');

      final result = await repository.addPerson(person);

      expect(result, equals('id-123'));
      verify(mockDao.insertPerson(any)).called(1);
      verify(mockSyncService.queueChange(any)).called(1);
    });
  });
}
```

#### BLoC Tests
```dart
// test/unit/blocs/people_bloc_test.dart

void main() {
  late MockPeopleRepository mockRepository;
  late PeopleBloc bloc;

  setUp(() {
    mockRepository = MockPeopleRepository();
    bloc = PeopleBloc(repository: mockRepository);
  });

  tearDown(() {
    bloc.close();
  });

  group('LoadPeople', () {
    blocTest<PeopleBloc, PeopleState>(
      'emits [loading, loaded] when successful',
      build: () {
        when(mockRepository.getPeople()).thenAnswer((_) async => [testPerson]);
        return bloc;
      },
      act: (bloc) => bloc.add(LoadPeople()),
      expect: () => [
        PeopleLoading(),
        PeopleLoaded(people: [testPerson]),
      ],
    );

    blocTest<PeopleBloc, PeopleState>(
      'emits [loading, error] when fails',
      build: () {
        when(mockRepository.getPeople()).thenThrow(Exception('Network error'));
        return bloc;
      },
      act: (bloc) => bloc.add(LoadPeople()),
      expect: () => [
        PeopleLoading(),
        isA<PeopleError>(),
      ],
    );
  });

  group('AddPerson', () {
    blocTest<PeopleBloc, PeopleState>(
      'adds person and reloads list',
      build: () {
        when(mockRepository.addPerson(any)).thenAnswer((_) async => 'id-123');
        when(mockRepository.getPeople()).thenAnswer((_) async => [testPerson]);
        return bloc;
      },
      act: (bloc) => bloc.add(AddPerson(person: testPerson)),
      expect: () => [
        isA<PeopleLoading>(),
        isA<PeopleLoaded>(),
      ],
    );
  });
}
```

### 2. Widget Tests

**Location:** `app/test/widget/`

```dart
// test/widget/screens/add_person_screen_test.dart

void main() {
  group('AddPersonScreen', () {
    testWidgets('shows required fields', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider(
            create: (_) => MockPeopleBloc(),
            child: AddPersonScreen(),
          ),
        ),
      );

      expect(find.text('Name'), findsOneWidget);
      expect(find.text('Birthday'), findsOneWidget);
      expect(find.text('Save'), findsOneWidget);
    });

    testWidgets('validates empty name', (tester) async {
      await tester.pumpWidget(createTestApp());

      await tester.tap(find.text('Save'));
      await tester.pump();

      expect(find.text('Name is required'), findsOneWidget);
    });

    testWidgets('saves person with minimal data', (tester) async {
      final mockBloc = MockPeopleBloc();
      await tester.pumpWidget(createTestApp(bloc: mockBloc));

      await tester.enterText(find.byType(TextField).first, 'Mia Thompson');
      await tester.tap(find.text('Birthday'));
      await tester.pump();
      // Select date...
      await tester.tap(find.text('Save'));
      await tester.pump();

      verify(mockBloc.add(any)).called(1);
    });

    testWidgets('shows anchor chips when household has members', (tester) async {
      // Test person anchor selection UI
    });

    testWidgets('completes in under 15 seconds', (tester) async {
      // Performance test for quick entry
      final stopwatch = Stopwatch()..start();

      await tester.pumpWidget(createTestApp());
      await tester.enterText(find.byType(TextField).first, 'Test Person');
      await tester.tap(find.text('Birthday'));
      await tester.pump();
      // Quick date selection
      await tester.tap(find.text('Save'));
      await tester.pump();

      stopwatch.stop();
      expect(stopwatch.elapsedMilliseconds, lessThan(15000));
    });
  });
}
```

```dart
// test/widget/widgets/birthday_card_test.dart

void main() {
  group('BirthdayCard', () {
    testWidgets('displays name and countdown', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BirthdayCard(
            person: testPerson,
            daysUntil: 5,
          ),
        ),
      );

      expect(find.text('Mia Thompson'), findsOneWidget);
      expect(find.text('5 days'), findsOneWidget);
    });

    testWidgets('displays anchor text when provided', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BirthdayCard(
            person: testPersonWithAnchor,
            daysUntil: 5,
            anchorNames: ['Emily'],
          ),
        ),
      );

      expect(find.text("Emily's friend"), findsOneWidget);
    });

    testWidgets('displays age when birth year known', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BirthdayCard(
            person: testPersonWithYear,
            daysUntil: 5,
          ),
        ),
      );

      expect(find.text('Turns 9'), findsOneWidget);
    });

    testWidgets('shows checkboxes when birthday is soon', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BirthdayCard(
            person: testPerson,
            daysUntil: 7,
            showQuickActions: true,
          ),
        ),
      );

      expect(find.byType(Checkbox), findsNWidgets(2)); // Gift, RSVP
    });
  });
}
```

### 3. Integration Tests

**Location:** `app/test/integration/`

```dart
// test/integration/database_test.dart

void main() {
  late AppDatabase database;

  setUp(() async {
    database = AppDatabase(NativeDatabase.memory());
  });

  tearDown(() async {
    await database.close();
  });

  group('People operations', () {
    test('insert and retrieve person', () async {
      final person = PersonCompanion(
        name: Value('Test Person'),
        birthdayMonth: Value(3),
        birthdayDay: Value(15),
        householdId: Value('household-1'),
      );

      final id = await database.peopleDao.insertPerson(person);
      final retrieved = await database.peopleDao.getPersonById(id);

      expect(retrieved.name, equals('Test Person'));
      expect(retrieved.birthdayMonth, equals(3));
    });

    test('update person', () async {
      // Insert, update, verify
    });

    test('delete person cascades to yearly events', () async {
      // Insert person with yearly events, delete, verify cascade
    });

    test('filter by household', () async {
      // Insert people in different households, verify filtering
    });
  });

  group('Sync queue operations', () {
    test('queue change and retrieve pending', () async {
      // Add to queue, verify pending items
    });

    test('mark as synced', () async {
      // Add to queue, mark synced, verify removed from pending
    });
  });
}
```

```dart
// test/integration/sync_test.dart

void main() {
  group('Sync service', () {
    test('processes queue in order', () async {
      // Add multiple changes, verify order
    });

    test('handles conflicts with last-write-wins', () async {
      // Create conflicting changes, verify resolution
    });

    test('retries failed syncs', () async {
      // Simulate network failure, verify retry
    });
  });
}
```

### 4. End-to-End Tests

**Location:** `app/integration_test/`

```dart
// integration_test/app_test.dart

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Full user flow', () {
    testWidgets('new user signup and add birthday', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Sign in (mocked)
      await tester.tap(find.text('Continue with Google'));
      await tester.pumpAndSettle();

      // Household setup
      await tester.enterText(find.byKey(Key('name_field')), 'Test User');
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();

      // Add family member
      await tester.tap(find.text('Add family member'));
      await tester.enterText(find.byKey(Key('member_name')), 'Emily');
      await tester.tap(find.text('Child'));
      await tester.tap(find.text('Done'));
      await tester.pumpAndSettle();

      // Finish setup
      await tester.tap(find.text('Get Started'));
      await tester.pumpAndSettle();

      // Now on home screen
      expect(find.text('No upcoming birthdays'), findsOneWidget);

      // Add birthday
      await tester.tap(find.byType(FloatingActionButton));
      await tester.pumpAndSettle();

      await tester.enterText(find.byKey(Key('person_name')), 'Mia Thompson');
      await tester.tap(find.byKey(Key('date_picker')));
      await tester.pumpAndSettle();
      // Select date March 15
      await tester.tap(find.text('15'));
      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      // Select anchor
      await tester.tap(find.text('Emily'));
      await tester.pumpAndSettle();

      // Save
      await tester.tap(find.text('Save'));
      await tester.pumpAndSettle();

      // Verify on home screen
      expect(find.text('Mia Thompson'), findsOneWidget);
      expect(find.text("Emily's friend"), findsOneWidget);
    });
  });
}
```

---

## Backend Testing

### 1. Unit Tests

**Location:** `backend/tests/unit/`

```typescript
// tests/unit/services/people.service.test.ts

describe('PeopleService', () => {
  let service: PeopleService;
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    service = new PeopleService(mockPrisma);
  });

  describe('createPerson', () => {
    it('creates person with required fields', async () => {
      const input = {
        householdId: 'household-1',
        name: 'Test Person',
        birthdayMonth: 3,
        birthdayDay: 15,
      };

      mockPrisma.person.create.mockResolvedValue({
        id: 'person-1',
        ...input,
        birthYear: null,
        notes: null,
        // ... other defaults
      });

      const result = await service.createPerson(input);

      expect(result.name).toBe('Test Person');
      expect(mockPrisma.person.create).toHaveBeenCalledWith({
        data: expect.objectContaining(input),
      });
    });

    it('validates birthday month range', async () => {
      const input = {
        householdId: 'household-1',
        name: 'Test',
        birthdayMonth: 13, // Invalid
        birthdayDay: 15,
      };

      await expect(service.createPerson(input)).rejects.toThrow('Invalid month');
    });

    it('validates birthday day for month', async () => {
      const input = {
        householdId: 'household-1',
        name: 'Test',
        birthdayMonth: 2,
        birthdayDay: 30, // Invalid for February
      };

      await expect(service.createPerson(input)).rejects.toThrow('Invalid day');
    });

    it('allows Feb 29 for leap year birthdays', async () => {
      const input = {
        householdId: 'household-1',
        name: 'Leap Year Baby',
        birthdayMonth: 2,
        birthdayDay: 29,
      };

      mockPrisma.person.create.mockResolvedValue({
        id: 'person-1',
        ...input,
      });

      const result = await service.createPerson(input);

      expect(result.birthdayDay).toBe(29);
    });
  });

  describe('getUpcomingBirthdays', () => {
    it('returns birthdays within date range', async () => {
      // Test with various date scenarios
    });

    it('handles year boundary correctly', async () => {
      // Current: December, birthdays in January
    });

    it('applies leap year preference for Feb 29 birthdays', async () => {
      // Test all three preference options
    });
  });
});
```

```typescript
// tests/unit/utils/dateUtils.test.ts

describe('DateUtils', () => {
  describe('isLeapYear', () => {
    it.each([
      [2024, true],
      [2000, true],
      [2023, false],
      [1900, false],
      [2100, false],
    ])('isLeapYear(%i) returns %s', (year, expected) => {
      expect(DateUtils.isLeapYear(year)).toBe(expected);
    });
  });

  describe('getDaysInMonth', () => {
    it.each([
      [1, 2024, 31],  // January
      [2, 2024, 29],  // February leap year
      [2, 2023, 28],  // February non-leap year
      [4, 2024, 30],  // April
    ])('getDaysInMonth(%i, %i) returns %i', (month, year, expected) => {
      expect(DateUtils.getDaysInMonth(month, year)).toBe(expected);
    });
  });

  describe('getZodiacSign', () => {
    it.each([
      [3, 21, 'aries'],
      [4, 19, 'aries'],
      [4, 20, 'taurus'],
      [12, 21, 'sagittarius'],
      [12, 22, 'capricorn'],
      [1, 19, 'capricorn'],
      [1, 20, 'aquarius'],
    ])('getZodiacSign(%i, %i) returns %s', (month, day, expected) => {
      expect(DateUtils.getZodiacSign(month, day)).toBe(expected);
    });
  });
});
```

### 2. Integration Tests

**Location:** `backend/tests/integration/`

```typescript
// tests/integration/routes/people.routes.test.ts

describe('People API', () => {
  let app: Express;
  let prisma: PrismaClient;
  let authToken: string;
  let testHouseholdId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    app = createApp(prisma);
    
    // Create test user and household
    const { token, householdId } = await setupTestUser(prisma);
    authToken = token;
    testHouseholdId = householdId;
  });

  afterAll(async () => {
    await cleanupTestData(prisma);
    await prisma.$disconnect();
  });

  describe('POST /api/people', () => {
    it('creates person with valid data', async () => {
      const response = await request(app)
        .post('/api/people')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Person',
          birthdayMonth: 3,
          birthdayDay: 15,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Person');
      expect(response.body.id).toBeDefined();
    });

    it('returns 401 without auth', async () => {
      const response = await request(app)
        .post('/api/people')
        .send({ name: 'Test', birthdayMonth: 3, birthdayDay: 15 });

      expect(response.status).toBe(401);
    });

    it('returns 400 with invalid data', async () => {
      const response = await request(app)
        .post('/api/people')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: '', birthdayMonth: 13, birthdayDay: 32 });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/people', () => {
    it('returns all people in household', async () => {
      const response = await request(app)
        .get('/api/people')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('does not return people from other households', async () => {
      // Create person in different household
      // Verify not returned
    });
  });
});
```

```typescript
// tests/integration/database/migrations.test.ts

describe('Database migrations', () => {
  it('all migrations run successfully', async () => {
    // Run migrations on empty database
    // Verify all tables exist
  });

  it('seed data is valid', async () => {
    // Run seeds
    // Verify data integrity
  });
});
```

---

## Running Tests

### Flutter

```bash
# All tests
cd app && flutter test

# With coverage
cd app && flutter test --coverage

# Specific test file
cd app && flutter test test/unit/models/person_test.dart

# Integration tests (requires device/emulator)
cd app && flutter test integration_test/

# Generate coverage report
cd app && genhtml coverage/lcov.info -o coverage/html
```

### Backend

```bash
# All tests
cd backend && npm test

# With coverage
cd backend && npm run test:coverage

# Watch mode
cd backend && npm run test:watch

# Specific test file
cd backend && npm test -- --testPathPattern=people.service

# Integration tests only
cd backend && npm run test:integration
```

---

## CI/CD Test Configuration

```yaml
# .github/workflows/test.yml

name: Tests

on: [push, pull_request]

jobs:
  flutter-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
      
      - name: Install dependencies
        run: cd app && flutter pub get
      
      - name: Analyze
        run: cd app && flutter analyze
      
      - name: Run tests
        run: cd app && flutter test --coverage
      
      - name: Check coverage threshold
        run: |
          COVERAGE=$(lcov --summary app/coverage/lcov.info | grep "lines" | cut -d':' -f2 | cut -d'%' -f1 | tr -d ' ')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi

  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: birthday_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Run migrations
        run: cd backend && npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/birthday_test
      
      - name: Run tests
        run: cd backend && npm run test:coverage
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/birthday_test
      
      - name: Check coverage threshold
        run: |
          cd backend
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi
```

---

## Test Coverage Requirements

| Component | Minimum Coverage | Critical Paths |
|-----------|-----------------|----------------|
| Flutter Models | 90% | Age calculation, zodiac, dates |
| Flutter Utils | 95% | Date utils, leap year handling |
| Flutter BLoCs | 85% | All state transitions |
| Flutter Repositories | 80% | CRUD operations, sync |
| Flutter Widgets | 75% | Core widgets |
| Backend Services | 90% | All business logic |
| Backend Utils | 95% | Date utils, validation |
| Backend Routes | 85% | All endpoints |

---

## Regression Test Checklist

Run before each release:

### Critical Paths
- [ ] User can sign in with Apple
- [ ] User can sign in with Google
- [ ] New user can complete household setup
- [ ] User can add birthday in <15 seconds
- [ ] Person anchors display correctly
- [ ] Household sync works between two devices
- [ ] Notifications fire at correct times
- [ ] Offline mode works correctly
- [ ] Feb 29 birthdays handled correctly
- [ ] Age calculation is correct
- [ ] Zodiac signs are correct

### Data Integrity
- [ ] No data loss on sync conflicts
- [ ] Delete cascades correctly
- [ ] Household separation preserves data

### Performance
- [ ] App launches in <2 seconds
- [ ] List scrolling is smooth with 100+ people
- [ ] Sync completes in <5 seconds
