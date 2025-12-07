# Getting Started with Birthday Reminder App

This guide will help you set up and run the Birthday Reminder App locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+** - [Download](https://nodejs.org/)
- **Flutter 3.x** - [Install Guide](https://docs.flutter.dev/get-started/install)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/) (or use Railway's hosted DB)
- **Firebase Account** - [Create Account](https://firebase.google.com/)
- **Git** - [Download](https://git-scm.com/)

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/BirthdayApp.git
cd BirthdayApp
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials (see Firebase Setup below)
# nano .env  # or use your preferred editor
```

#### Create PostgreSQL Database

```bash
# Create database
createdb birthday_app

# Or using psql
psql -U postgres
CREATE DATABASE birthday_app;
\q
```

#### Run Database Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) View database in Prisma Studio
npm run prisma:studio
```

#### Start Backend Server

```bash
npm run dev

# Server will start at http://localhost:3000
# Health check: http://localhost:3000/health
```

### 3. Flutter App Setup

In a new terminal:

```bash
cd app

# Install dependencies
flutter pub get

# Generate code for Drift database
flutter pub run build_runner build

# Run on iOS Simulator
flutter run -d iOS

# OR run on Android Emulator
flutter run -d Android
```

## Firebase Setup (Required)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it: `birthday-reminder-app`
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Apple** (required for iOS)
   - Follow the [Apple Sign-In setup guide](https://firebase.google.com/docs/auth/ios/apple)
3. Enable **Google** (required for Android, optional for iOS)
   - Add your SHA-1 fingerprint for Android

### 3. Add Apps to Firebase

#### For iOS:
1. Click "Add app" → iOS
2. Enter bundle ID: `com.birthdayapp.app`
3. Download `GoogleService-Info.plist`
4. Place in: `app/ios/Runner/GoogleService-Info.plist`

#### For Android:
1. Click "Add app" → Android
2. Enter package name: `com.birthdayapp.app`
3. Download `google-services.json`
4. Place in: `app/android/app/google-services.json`

### 4. Get Service Account Credentials

1. Go to **Project Settings** → **Service Accounts**
2. Click "Generate new private key"
3. Save the JSON file
4. Extract these values for your `.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### 5. Update Backend .env

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/birthday_app

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-key-here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Environment
NODE_ENV=development
PORT=3000

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8080
```

## Development Workflow

### Running Both Backend and App

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Flutter:**
```bash
cd app
flutter run
```

### Database Management

```bash
# View database in Prisma Studio
cd backend
npm run prisma:studio

# Create new migration after schema changes
npm run prisma:migrate

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset
```

### Code Generation

When you modify Drift tables in Flutter:

```bash
cd app
flutter pub run build_runner build --delete-conflicting-outputs
```

## Testing

### Backend Tests

```bash
cd backend
npm test                 # Run all tests
npm run test:coverage    # With coverage report
npm run test:watch       # Watch mode
```

### Flutter Tests

```bash
cd app
flutter test             # Run all tests
flutter test --coverage  # With coverage
```

## Common Issues & Solutions

### Backend won't start

**Issue:** `Error: P1001: Can't reach database server`

**Solution:** Ensure PostgreSQL is running and DATABASE_URL is correct

```bash
# Check if PostgreSQL is running
pg_isadmin

# Start PostgreSQL (macOS)
brew services start postgresql@15

# Start PostgreSQL (Linux)
sudo systemctl start postgresql
```

### Firebase Auth Error

**Issue:** `Error: Failed to initialize Firebase`

**Solution:** Check that your service account credentials are correct in `.env`

### Flutter Build Runner Fails

**Issue:** `Conflicting outputs were detected`

**Solution:** Use the delete flag:

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### iOS Build Issues

**Issue:** Pod install fails

**Solution:**
```bash
cd app/ios
pod repo update
pod install
cd ../..
flutter run
```

## Next Steps

- Read the [Product Specification](design/SPEC.md) to understand all features
- Review [Architecture Documentation](design/ARCHITECTURE.md) for technical details
- Check [Testing Strategy](design/TESTING.md) for testing guidelines

## Need Help?

- Check the [README](README.md) for more information
- Review design specifications in `/design` folder
- Open an issue on GitHub

---

Happy coding! 🎂
