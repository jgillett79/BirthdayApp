# Birthday Reminder App - Technical Architecture

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Mobile App** | Flutter (Dart) | Single codebase, excellent testing, good performance |
| **Backend** | Node.js + Express | JavaScript ecosystem, Railway-friendly |
| **Database** | PostgreSQL | Relational data, Railway native support |
| **Auth** | Firebase Auth | Apple/Google Sign-In, no password management |
| **Push Notifications** | Firebase Cloud Messaging | Reliable, free tier sufficient |
| **Local Storage** | SQLite (Drift) | Offline-first, sync-friendly |
| **Deployment** | Railway | Simple, cost-effective |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Mobile App (Flutter)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   UI Layer  │  │  BLoC/State │  │  Repository Layer       │  │
│  │   (Widgets) │◄─┤  Management │◄─┤  (Data abstraction)     │  │
│  └─────────────┘  └─────────────┘  └───────────┬─────────────┘  │
│                                                 │                │
│  ┌──────────────────────────────────────────────┴──────────────┐│
│  │                    Local Database (SQLite/Drift)            ││
│  │                    - Offline-first storage                  ││
│  │                    - Sync queue                             ││
│  └──────────────────────────────────────────────┬──────────────┘│
└─────────────────────────────────────────────────┼───────────────┘
                                                  │
                                          HTTPS   │
                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   REST API  │  │  Auth       │  │  Notification           │  │
│  │   Routes    │  │  Middleware │  │  Scheduler              │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                      │                │
│  ┌──────┴────────────────┴──────────────────────┴──────────────┐│
│  │                    Service Layer                            ││
│  │  - HouseholdService                                         ││
│  │  - PersonService                                            ││
│  │  - YearlyEventService                                       ││
│  │  - NotificationService                                      ││
│  └──────────────────────────────────────────────┬──────────────┘│
│                                                 │                │
│  ┌──────────────────────────────────────────────┴──────────────┐│
│  │                    Data Access Layer                        ││
│  │                    (Prisma ORM)                             ││
│  └──────────────────────────────────────────────┬──────────────┘│
└─────────────────────────────────────────────────┼───────────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PostgreSQL (Railway)                        │
└─────────────────────────────────────────────────────────────────┘

                    External Services
                    ─────────────────
┌─────────────────┐  ┌─────────────────┐
│  Firebase Auth  │  │  Firebase FCM   │
│  (Apple/Google) │  │  (Push Notifs)  │
└─────────────────┘  └─────────────────┘
```

---

## Project Structure

### Flutter App (`/app`)

```
app/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   │
│   ├── core/
│   │   ├── constants/
│   │   ├── errors/
│   │   ├── utils/
│   │   │   ├── date_utils.dart
│   │   │   └── zodiac_utils.dart
│   │   └── theme/
│   │       ├── app_theme.dart
│   │       └── colors.dart
│   │
│   ├── data/
│   │   ├── local/
│   │   │   ├── database.dart          # Drift database
│   │   │   ├── tables/
│   │   │   │   ├── people_table.dart
│   │   │   │   ├── yearly_events_table.dart
│   │   │   │   ├── household_table.dart
│   │   │   │   └── sync_queue_table.dart
│   │   │   └── daos/
│   │   │       ├── people_dao.dart
│   │   │       └── yearly_events_dao.dart
│   │   │
│   │   ├── remote/
│   │   │   ├── api_client.dart
│   │   │   ├── auth_service.dart
│   │   │   └── endpoints/
│   │   │       ├── people_api.dart
│   │   │       ├── household_api.dart
│   │   │       └── sync_api.dart
│   │   │
│   │   ├── repositories/
│   │   │   ├── auth_repository.dart
│   │   │   ├── people_repository.dart
│   │   │   ├── household_repository.dart
│   │   │   └── sync_repository.dart
│   │   │
│   │   └── models/
│   │       ├── person.dart
│   │       ├── yearly_event.dart
│   │       ├── household.dart
│   │       ├── household_member.dart
│   │       └── user.dart
│   │
│   ├── domain/
│   │   └── services/
│   │       ├── notification_service.dart
│   │       ├── sync_service.dart
│   │       └── calendar_export_service.dart
│   │
│   ├── presentation/
│   │   ├── blocs/
│   │   │   ├── auth/
│   │   │   ├── people/
│   │   │   ├── household/
│   │   │   └── settings/
│   │   │
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   └── sign_in_screen.dart
│   │   │   ├── onboarding/
│   │   │   │   ├── welcome_screen.dart
│   │   │   │   └── household_setup_screen.dart
│   │   │   ├── home/
│   │   │   │   └── home_screen.dart
│   │   │   ├── calendar/
│   │   │   │   └── calendar_screen.dart
│   │   │   ├── people/
│   │   │   │   ├── people_list_screen.dart
│   │   │   │   ├── person_detail_screen.dart
│   │   │   │   └── add_person_screen.dart
│   │   │   └── settings/
│   │   │       └── settings_screen.dart
│   │   │
│   │   └── widgets/
│   │       ├── birthday_card.dart
│   │       ├── countdown_badge.dart
│   │       ├── anchor_chips.dart
│   │       ├── date_picker.dart
│   │       └── quick_checkbox.dart
│   │
│   └── widgets/                        # Home screen widgets
│       └── birthday_widget.dart
│
├── test/
│   ├── unit/
│   │   ├── utils/
│   │   ├── models/
│   │   ├── repositories/
│   │   └── blocs/
│   ├── integration/
│   │   ├── database_test.dart
│   │   └── sync_test.dart
│   └── widget/
│       ├── screens/
│       └── widgets/
│
├── integration_test/
│   └── app_test.dart
│
├── pubspec.yaml
└── analysis_options.yaml
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── index.ts                        # Entry point
│   ├── app.ts                          # Express app setup
│   │
│   ├── config/
│   │   ├── database.ts
│   │   ├── firebase.ts
│   │   └── environment.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts                     # Firebase token verification
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   │
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── household.routes.ts
│   │   ├── people.routes.ts
│   │   ├── yearlyEvents.routes.ts
│   │   └── sync.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── household.service.ts
│   │   ├── people.service.ts
│   │   ├── yearlyEvents.service.ts
│   │   ├── notification.service.ts
│   │   └── sync.service.ts
│   │
│   ├── jobs/
│   │   └── notificationScheduler.ts    # Daily job to queue notifications
│   │
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   ├── zodiacUtils.ts
│   │   └── errors.ts
│   │
│   └── types/
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── routes/
│   │   └── database/
│   └── setup.ts
│
├── package.json
├── tsconfig.json
├── jest.config.js
└── .env.example
```

---

## Database Schema

### PostgreSQL (via Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  firebaseUid   String    @unique
  email         String?
  name          String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  householdMemberships HouseholdMember[]
  
  @@map("users")
}

model Household {
  id          String    @id @default(uuid())
  name        String?
  inviteCode  String    @unique @default(uuid())
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  members     HouseholdMember[]
  people      Person[]
  
  @@map("households")
}

model HouseholdMember {
  id          String    @id @default(uuid())
  householdId String
  userId      String?   // null for children (non-account holders)
  name        String
  role        MemberRole
  isOwner     Boolean   @default(false)
  createdAt   DateTime  @default(now())
  
  household   Household @relation(fields: [householdId], references: [id], onDelete: Cascade)
  user        User?     @relation(fields: [userId], references: [id])
  
  // People anchored to this member
  anchoredPeople PersonAnchor[]
  
  @@unique([householdId, userId])
  @@map("household_members")
}

enum MemberRole {
  ADULT
  CHILD
}

model Person {
  id              String    @id @default(uuid())
  householdId     String
  name            String
  birthdayMonth   Int       // 1-12
  birthdayDay     Int       // 1-31
  birthYear       Int?      // nullable for unknown
  relationshipType RelationshipType?
  notes           String?
  isDeceased      Boolean   @default(false)
  leapYearPref    LeapYearPreference @default(FEB_28)
  
  // Reminder overrides (null = use defaults)
  reminderDays    Int[]     // e.g., [7, 1, 0] for 7 days, 1 day, day-of
  reminderTime    String?   // e.g., "08:00"
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  createdByUserId String?
  
  household       Household @relation(fields: [householdId], references: [id], onDelete: Cascade)
  anchors         PersonAnchor[]
  yearlyEvents    YearlyEvent[]
  
  @@map("people")
}

model PersonAnchor {
  id                String          @id @default(uuid())
  personId          String
  householdMemberId String
  
  person            Person          @relation(fields: [personId], references: [id], onDelete: Cascade)
  householdMember   HouseholdMember @relation(fields: [householdMemberId], references: [id], onDelete: Cascade)
  
  @@unique([personId, householdMemberId])
  @@map("person_anchors")
}

enum RelationshipType {
  FAMILY
  FRIEND
  SCHOOL
  WORK
  NEIGHBOUR
  OTHER
}

enum LeapYearPreference {
  FEB_28
  MARCH_1
  LEAP_ONLY
}

model YearlyEvent {
  id            String    @id @default(uuid())
  personId      String
  year          Int
  
  partyDate     DateTime?
  partyTime     String?   // "14:00"
  partyLocation String?
  
  giftBought    Boolean   @default(false)
  giftDescription String?
  rsvpSent      Boolean   @default(false)
  cardSent      Boolean   @default(false)
  notes         String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  person        Person    @relation(fields: [personId], references: [id], onDelete: Cascade)
  
  @@unique([personId, year])
  @@map("yearly_events")
}

model NotificationLog {
  id            String    @id @default(uuid())
  userId        String
  personId      String
  year          Int
  daysBefore    Int       // 7, 1, 0 etc.
  sentAt        DateTime  @default(now())
  fcmMessageId  String?
  
  @@unique([userId, personId, year, daysBefore])
  @@map("notification_logs")
}
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register          # Create user after Firebase auth
GET    /api/auth/me                # Get current user + household
```

### Household
```
POST   /api/household              # Create household
GET    /api/household              # Get user's household
POST   /api/household/join         # Join household with invite code
POST   /api/household/leave        # Leave household (with data copy option)
PUT    /api/household/members      # Update household members
DELETE /api/household/members/:id  # Remove member
```

### People
```
GET    /api/people                 # List all people in household
POST   /api/people                 # Create person
GET    /api/people/:id             # Get person details
PUT    /api/people/:id             # Update person
DELETE /api/people/:id             # Delete person
POST   /api/people/import          # Bulk import from contacts
```

### Yearly Events
```
GET    /api/people/:id/events           # Get all yearly events for person
GET    /api/people/:id/events/:year     # Get specific year
PUT    /api/people/:id/events/:year     # Update yearly event
```

### Sync
```
POST   /api/sync/push              # Push local changes to server
GET    /api/sync/pull              # Pull changes since timestamp
```

---

## Sync Strategy

### Offline-First Approach

1. **All operations write to local DB first**
2. **Sync queue tracks pending changes**
3. **Background sync when online**
4. **Conflict resolution: Last-write-wins**

### Sync Queue Table (Local)
```dart
class SyncQueueEntry {
  String id;
  String entityType;    // 'person', 'yearly_event', etc.
  String entityId;
  String operation;     // 'create', 'update', 'delete'
  String payload;       // JSON
  DateTime createdAt;
  int retryCount;
}
```

### Sync Flow
```
1. User makes change
2. Write to local DB
3. Add to sync queue
4. If online:
   a. Process sync queue
   b. Send changes to server
   c. Server returns server timestamp
   d. Mark queue items as synced
   e. Pull any changes from other devices
5. If offline:
   a. Queue builds up
   b. When online, process queue in order
```

---

## Notification System

### Daily Scheduler Job

```typescript
// Runs daily at 00:05 UTC
async function scheduleNotifications() {
  // Get all birthdays in next 30 days
  // For each birthday:
  //   - Check reminder preferences
  //   - Check if notification already sent (NotificationLog)
  //   - Queue FCM notification for appropriate time
}
```

### Notification Payload
```json
{
  "notification": {
    "title": "🎂 Mia Thompson turns 9 in 7 days",
    "body": "Emily's friend"
  },
  "data": {
    "personId": "uuid",
    "type": "birthday_reminder",
    "daysUntil": "7"
  }
}
```

---

## Testing Strategy

### Unit Tests
- **Flutter:** All utils, models, repositories, BLoCs
- **Backend:** All services, utils

### Integration Tests
- **Flutter:** Database operations, sync logic
- **Backend:** API endpoints, database operations

### Widget Tests
- All screens
- All custom widgets
- Form validation

### End-to-End Tests
- Full user flows (signup → add birthday → receive notification)

### Test Coverage Target
- **Minimum:** 80% line coverage
- **Critical paths:** 100% (auth, sync, notifications)

---

## Deployment

### Railway Setup

**Backend Service:**
```yaml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run start"
healthcheckPath = "/health"
healthcheckTimeout = 30

[service]
internalPort = 3000
```

**Database:**
- PostgreSQL plugin (Railway native)
- Automatic backups enabled

**Environment Variables:**
```
DATABASE_URL=postgresql://...
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
NODE_ENV=production
```

### CI/CD Pipeline

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd backend && npm ci
      - run: cd backend && npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/cli-action@v1
        with:
          command: up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

```yaml
# .github/workflows/flutter.yml
name: Flutter CI

on:
  push:
    branches: [main]
    paths: ['app/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
      - run: cd app && flutter pub get
      - run: cd app && flutter test --coverage
      - run: cd app && flutter analyze
```

---

## Security Considerations

1. **Authentication:** Firebase Auth handles all auth, tokens validated on backend
2. **Authorization:** All API calls check user belongs to household
3. **Data isolation:** Users can only access their household's data
4. **Transport:** HTTPS only
5. **Secrets:** All secrets in environment variables, never in code
6. **Input validation:** All inputs validated on both client and server
