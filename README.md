# Birthday Reminder App

A family-focused birthday and anniversary reminder app for iOS and Android.

## Overview

This is a **complete redesign** of the Birthday App, now built as a native mobile application using Flutter with a Node.js backend.

### Key Features

- **15-second entry** - Add a birthday in under 15 seconds
- **Person Anchors** - Know instantly "whose friend is Mia?" (Emily's friend)
- **Household sharing** - Both parents see the same list, real-time sync
- **Yearly event tracking** - Party dates and gift tracking that resets each year
- **Reliable notifications** - Never miss a birthday
- **Offline-first** - Works without internet, syncs when back online

## Architecture

### Mobile App (Flutter)
- **Location:** `/app`
- **Platform:** iOS & Android
- **State Management:** BLoC pattern
- **Local Database:** SQLite with Drift (offline-first)
- **Auth:** Firebase Auth (Apple Sign-In, Google Sign-In)

### Backend (Node.js)
- **Location:** `/backend`
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Deployment:** Railway
- **Authentication:** Firebase Admin SDK
- **Notifications:** Firebase Cloud Messaging

## Project Structure

```
birthday-app/
├── app/                    # Flutter mobile app
│   ├── lib/
│   │   ├── core/          # Constants, theme, utilities
│   │   ├── data/          # Models, repositories, local DB
│   │   ├── domain/        # Business logic services
│   │   └── presentation/  # UI (BLoCs, screens, widgets)
│   └── test/              # Tests (unit, widget, integration)
│
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── config/       # Environment, database, Firebase
│   │   ├── middleware/   # Auth, error handling
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helpers (date utils, etc.)
│   ├── prisma/           # Database schema & migrations
│   └── tests/            # Tests (unit, integration)
│
├── design/               # Product specifications
│   ├── SPEC.md          # Product requirements
│   ├── ARCHITECTURE.md  # Technical architecture
│   ├── TESTING.md       # Testing strategy
│   └── CLAUDE_CODE.md   # Setup instructions
│
└── old-webapp/          # Archived web app (previous version)
```

## Getting Started

### Prerequisites

- **Node.js 20+**
- **Flutter 3.x**
- **PostgreSQL** (or use Railway's hosted database)
- **Firebase account** (for auth & notifications)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The backend will be running at `http://localhost:3000`

### Flutter App Setup

```bash
cd app

# Install dependencies
flutter pub get

# Generate code (for Drift database)
flutter pub run build_runner build

# Run on iOS simulator
flutter run -d iOS

# Run on Android emulator
flutter run -d Android
```

## Documentation

See the `/design` folder for comprehensive documentation:

- **[SPEC.md](design/SPEC.md)** - Complete product specification
- **[ARCHITECTURE.md](design/ARCHITECTURE.md)** - Technical architecture details
- **[TESTING.md](design/TESTING.md)** - Testing strategy
- **[CLAUDE_CODE.md](design/CLAUDE_CODE.md)** - Setup with Claude Code

## Development Status

🚧 **Currently in active development** - Complete redesign in progress

### Completed
- ✅ Project structure created
- ✅ Backend foundation (Express, Prisma, Firebase)
- ✅ Database schema designed
- ✅ Flutter app scaffolding
- ✅ Core data models

### In Progress
- 🔄 API endpoints implementation
- 🔄 Flutter screens and UI
- 🔄 Offline sync system

### Upcoming
- ⏳ Authentication flows
- ⏳ Notification system
- ⏳ Testing suite
- ⏳ Deployment setup

## Testing

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:coverage    # With coverage
npm run test:integration # Integration tests only
```

### Flutter Tests
```bash
cd app
flutter test             # Unit & widget tests
flutter test --coverage  # With coverage
flutter test integration_test/  # E2E tests
```

## Deployment

### Backend (Railway)
```bash
cd backend
railway up
```

### Mobile App
- **iOS:** Submit to App Store via Xcode
- **Android:** Submit to Google Play via Android Studio

See [ARCHITECTURE.md](design/ARCHITECTURE.md) for detailed deployment instructions.

## License

Private project - All rights reserved

---

Built with ❤️ using Flutter & Node.js
