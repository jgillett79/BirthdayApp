# Birthday Reminder App - Claude Code Setup

## Quick Start

This document explains how to use these specification files with Claude Code to build the app.

---

## Prerequisites

Before starting with Claude Code, ensure you have:

1. **Node.js 20+** - `node --version`
2. **Flutter 3.x** - `flutter --version`
3. **PostgreSQL** (for local development) - or use Railway's DB
4. **Firebase account** - For auth and push notifications
5. **Apple Developer account** - For Apple Sign-In and iOS deployment
6. **Google Cloud account** - For Google Sign-In

---

## Project Files Overview

```
birthday-app/
├── SPEC.md           # Product specification (features, user flows)
├── ARCHITECTURE.md   # Technical architecture (stack, APIs, schema)
├── TESTING.md        # Testing strategy (unit, integration, e2e)
└── CLAUDE_CODE.md    # This file (setup instructions)
```

---

## Getting Started with Claude Code

### 1. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Start Claude Code

```bash
cd birthday-app
claude
```

### 3. Initialize the Project

Tell Claude Code to read the specs first:

```
Read SPEC.md, ARCHITECTURE.md, and TESTING.md to understand the project.
Then create the initial project structure for both the Flutter app and Node.js backend.
```

---

## Recommended Build Order

### Phase 1: Project Setup
1. Create Flutter project structure
2. Create Node.js/Express backend structure
3. Set up Prisma schema and initial migration
4. Configure Firebase project
5. Set up Railway deployment

### Phase 2: Backend Core
1. Database models and migrations
2. Auth middleware (Firebase token verification)
3. Household CRUD endpoints
4. People CRUD endpoints
5. Yearly events endpoints
6. Basic tests for all endpoints

### Phase 3: Flutter Core
1. Local database setup (Drift)
2. Data models
3. Auth flow (Apple/Google Sign-In)
4. Onboarding screens (household setup)
5. Basic navigation shell

### Phase 4: Main Features
1. Home screen (upcoming birthdays)
2. Add person screen (15-second flow)
3. Person detail screen
4. Person anchor selection
5. Calendar view
6. Settings screen

### Phase 5: Sync & Offline
1. Sync queue implementation
2. Background sync service
3. Conflict resolution
4. Offline indicators

### Phase 6: Notifications
1. Firebase Cloud Messaging setup
2. Notification scheduler (backend)
3. Local notification handling (app)
4. Notification preferences

### Phase 7: Polish & Testing
1. Widget implementation
2. Full test suite
3. Performance optimization
4. App store preparation

---

## Key Commands for Claude Code

### Creating the Flutter App

```
Create the Flutter app in ./app following the structure in ARCHITECTURE.md.
Start with the data layer (models, local database with Drift).
```

### Creating the Backend

```
Create the Node.js backend in ./backend following ARCHITECTURE.md.
Set up Express, Prisma, and the initial database schema.
```

### Running Tests

```
Run all Flutter tests and show me the coverage report.
```

```
Run the backend tests including integration tests.
```

### Specific Features

```
Implement the AddPersonScreen following the 15-second entry flow from SPEC.md.
Include validation and person anchor selection.
```

```
Implement the notification scheduler that runs daily and queues 
birthday reminders based on user preferences.
```

---

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/birthday_app

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Environment
NODE_ENV=development
PORT=3000
```

### Flutter (lib/config/environment.dart)

```dart
class Environment {
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000/api',
  );
}
```

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "birthday-reminder-app"
3. Enable Authentication
4. Add iOS app (bundle ID)
5. Add Android app (package name)
6. Download config files

### 2. Enable Auth Providers

1. Firebase Console → Authentication → Sign-in method
2. Enable "Apple" provider
3. Enable "Google" provider
4. Configure OAuth consent screen

### 3. Set up Cloud Messaging

1. Firebase Console → Cloud Messaging
2. Generate server key
3. Configure APNs for iOS

### 4. Service Account

1. Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Save JSON file securely
4. Extract values for environment variables

---

## Railway Setup

### 1. Create Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### 2. Add PostgreSQL

```bash
railway add postgresql
```

### 3. Deploy Backend

```bash
cd backend
railway up
```

### 4. Configure Environment

In Railway dashboard:
1. Go to your service
2. Add environment variables from .env
3. Set DATABASE_URL (auto-configured if using Railway Postgres)

---

## Common Claude Code Prompts

### Starting Fresh

```
I'm building a birthday reminder app. Please read all the .md files 
in this directory to understand the requirements, then help me 
build it step by step.
```

### Continuing Work

```
Let's continue building the birthday app. Show me what's been 
completed and what needs to be done next.
```

### Debugging

```
The notification scheduler isn't firing correctly. Help me debug 
the notificationScheduler.ts file and add better logging.
```

### Adding Tests

```
Add comprehensive unit tests for the PeopleService following 
the testing strategy in TESTING.md.
```

### Refactoring

```
The AddPersonScreen is getting complex. Refactor it to use 
smaller widgets while keeping the 15-second entry flow intact.
```

---

## Deployment Checklist

### Before First Deploy

- [ ] Firebase project created and configured
- [ ] Apple Developer account set up
- [ ] Google Cloud project configured
- [ ] Railway project created
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] All tests passing

### For Each Release

- [ ] Run full test suite
- [ ] Check test coverage ≥80%
- [ ] Run regression checklist (TESTING.md)
- [ ] Update version numbers
- [ ] Build release versions
- [ ] Deploy backend to Railway
- [ ] Submit to app stores

---

## Troubleshooting

### Flutter Issues

**"Firebase not initialized"**
```dart
// Ensure this is in main.dart
await Firebase.initializeApp(
  options: DefaultFirebaseOptions.currentPlatform,
);
```

**"Drift database not found"**
```bash
flutter pub run build_runner build
```

### Backend Issues

**"Prisma client not generated"**
```bash
npx prisma generate
```

**"Database connection failed"**
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Check Railway service status

### Auth Issues

**"Apple Sign-In not working"**
- Verify bundle ID matches Firebase config
- Check Apple Developer portal configuration
- Ensure entitlements are correct

**"Google Sign-In not working"**
- Verify SHA-1 fingerprint in Firebase
- Check google-services.json is up to date
- Verify OAuth consent screen is configured

---

## Resources

- [Flutter Documentation](https://docs.flutter.dev/)
- [Drift (SQLite) Documentation](https://drift.simonbinder.eu/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Firebase Flutter Setup](https://firebase.google.com/docs/flutter/setup)
- [Railway Documentation](https://docs.railway.app/)
- [Apple Sign-In](https://developer.apple.com/sign-in-with-apple/)
