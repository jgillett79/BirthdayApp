# 🎂 Birthday Reminder App - Setup Instructions

**Time Required:** 15-20 minutes
**Difficulty:** Beginner-friendly

Follow these steps to get your Birthday Reminder app running locally.

---

## ✅ Prerequisites Checklist

Before starting, install these if you don't have them:

- [ ] **Node.js 20+** - [Download here](https://nodejs.org/)
- [ ] **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/)
- [ ] **Flutter 3.x** - [Install guide](https://docs.flutter.dev/get-started/install)
- [ ] **Git** - [Download here](https://git-scm.com/)

**Verify installations:**
```bash
node --version    # Should show v20.x.x or higher
postgres --version # Should show 15.x or higher
flutter --version  # Should show 3.x.x
git --version
```

---

## 📦 Step 1: Clone & Install (2 minutes)

### 1.1 Clone the Repository

```bash
# Clone to your local machine
git clone https://github.com/jgillett79/BirthdayApp.git
cd BirthdayApp
```

### 1.2 Install Backend Dependencies

```bash
cd backend
npm install
```

**Expected output:** You should see "added XXX packages" without errors.

### 1.3 Install Flutter Dependencies

```bash
cd ../app
flutter pub get
```

**Expected output:** "Got dependencies!" without errors.

---

## 🗄️ Step 2: Database Setup (3 minutes)

### 2.1 Create PostgreSQL Database

**Option A - Using psql (Terminal):**
```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE birthday_app;

# Verify it was created
\l

# Exit
\q
```

**Option B - Using pgAdmin (GUI):**
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `birthday_app`
4. Click "Save"

### 2.2 Configure Database Connection

```bash
cd ../backend

# Copy environment template
cp .env.example .env
```

**Edit `.env` file:**
```env
# Update this line with your PostgreSQL credentials
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/birthday_app

# Example:
# DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/birthday_app
```

> **💡 Tip:** Your PostgreSQL username is usually `postgres`. Password is what you set during installation.

### 2.3 Run Database Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate
```

**Expected output:**
```
✔ Generated Prisma Client
Your database is now in sync with your schema.
```

---

## 🔥 Step 3: Firebase Setup (5 minutes)

Firebase is required for authentication (Apple/Google Sign-In) and push notifications.

### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Project name: `birthday-reminder-app` (or your choice)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 3.2 Enable Authentication

1. In Firebase Console, click **"Authentication"** in left menu
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Google"**:
   - Click "Google"
   - Toggle "Enable"
   - Click "Save"

> **Note:** Apple Sign-In requires an Apple Developer account. You can skip it for now and use Google Sign-In only.

### 3.3 Get Service Account Credentials

1. Click the **gear icon** → **"Project settings"**
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** (downloads a JSON file)
5. **Save this file safely** - you'll need it next

### 3.4 Configure Backend with Firebase

**Open the downloaded JSON file** and find these values:

- `project_id`
- `private_key`
- `client_email`

**Update your `backend/.env` file:**

```env
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/birthday_app

# Firebase Admin SDK - Copy from your JSON file
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Environment
NODE_ENV=development
PORT=3000

# CORS (leave as is for development)
CORS_ORIGINS=http://localhost:3000,http://localhost:8080
```

> **⚠️ Important:** Keep the private key on ONE line. Include the quotes and `\n` characters.

---

## 🚀 Step 4: Start the Backend (1 minute)

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ Environment variables validated
✅ Firebase initialized
✅ Database connected successfully
📅 Notification scheduler started
🚀 Server running on port 3000
```

**Test it works:**
Open [http://localhost:3000/health](http://localhost:3000/health) in your browser.
You should see: `{"status":"ok","timestamp":"..."}`

> **Keep this terminal open** - the backend must stay running.

---

## 📱 Step 5: Configure Flutter App (3 minutes)

Open a **NEW terminal window** (keep backend running in the first one).

### 5.1 Add Firebase to Flutter

For full functionality, you'd normally add Firebase config files:
- iOS: `GoogleService-Info.plist`
- Android: `google-services.json`

**For now, to test the UI without Firebase:**

The app is already configured to show the UI. Firebase is only needed for authentication, which you can add later.

### 5.2 Generate Database Code

```bash
cd app
flutter pub run build_runner build --delete-conflicting-outputs
```

**Expected output:**
```
[INFO] Succeeded after XXs with XX outputs
```

This generates the code for the local SQLite database.

---

## ▶️ Step 6: Run the App! (2 minutes)

### Option A: Run on iOS Simulator (Mac only)

```bash
# List available simulators
flutter devices

# Run on iOS
flutter run -d iPhone
```

### Option B: Run on Android Emulator

```bash
# Make sure Android emulator is running
# (Start it from Android Studio)

flutter run -d emulator
```

### Option C: Run on Web (Quick Test)

```bash
flutter run -d chrome
```

**Expected result:**
The app launches and shows the home screen with sample birthday data!

---

## 🎉 Success! What Now?

### Verify Everything Works

- [x] Backend running at http://localhost:3000
- [x] Database created with tables
- [x] Flutter app showing home screen
- [x] Can navigate between screens

### Test the UI

Try these actions in the app:
1. Browse the home screen (shows upcoming birthdays)
2. Tap the + button to add a birthday
3. Tap bottom navigation to switch screens
4. Navigate to Settings

### Next Steps

The app currently shows **mock data**. To connect it to the backend:

1. **Add authentication** - Implement Firebase sign-in
2. **Connect to API** - Wire up the API client to screens
3. **Test sync** - Try adding a birthday and see it sync

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "Can't reach database server"**

**Fix:**
```bash
# Check if PostgreSQL is running
# Mac:
brew services start postgresql@15

# Linux:
sudo systemctl start postgresql

# Windows:
# Start PostgreSQL from Services app
```

**Error: "Missing environment variables"**

**Fix:** Double-check your `.env` file has all required fields filled in.

---

### Flutter errors

**Error: "Failed to build iOS app"**

**Fix:**
```bash
cd app/ios
pod install
cd ..
flutter run
```

**Error: "Conflicting outputs"**

**Fix:**
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

---

### Database issues

**Reset database (WARNING: Deletes all data):**
```bash
cd backend
npx prisma migrate reset
```

**View database in GUI:**
```bash
npm run prisma:studio
# Opens at http://localhost:5555
```

---

## 📚 What's Next?

Now that everything is running:

1. **Explore the code** - Check out the different screens and components
2. **Read the docs** - See PROJECT_STATUS.md for what's complete
3. **Make it yours** - Customize colors, add features
4. **Deploy** - Follow ARCHITECTURE.md to deploy to production

### Quick Links

- [Project Status](PROJECT_STATUS.md) - What's done and what's left
- [Getting Started Guide](GETTING_STARTED.md) - Detailed setup
- [Architecture Docs](design/ARCHITECTURE.md) - How it all works
- [Product Spec](design/SPEC.md) - Full feature list

---

## 🆘 Need Help?

1. Check [GETTING_STARTED.md](GETTING_STARTED.md) for detailed guides
2. Review [PROJECT_STATUS.md](PROJECT_STATUS.md) for implementation details
3. Check the `/design` folder for architecture documentation

---

## ✨ You're All Set!

The app is now running locally. Both backend and Flutter app are connected and ready for development.

**Backend:** http://localhost:3000
**App:** Running on your device/simulator

Happy coding! 🎂
