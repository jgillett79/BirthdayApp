# ⚡ Quick Start - Birthday Reminder App

**Get running in 15 minutes!**

## ✅ Prerequisites

Install these first (skip if you have them):

```bash
# Check what you have
node --version     # Need 20+
postgres --version # Need 15+
flutter --version  # Need 3.x
```

**Don't have them?**
- Node.js: https://nodejs.org/
- PostgreSQL: https://www.postgresql.org/download/
- Flutter: https://docs.flutter.dev/get-started/install

---

## 🚀 6 Steps to Running App

### 1️⃣ Clone & Install (2 min)

```bash
git clone https://github.com/jgillett79/BirthdayApp.git
cd BirthdayApp

# Install backend
cd backend
npm install

# Install Flutter
cd ../app
flutter pub get
```

---

### 2️⃣ Create Database (1 min)

```bash
# Open PostgreSQL
psql postgres

# Create database (copy this)
CREATE DATABASE birthday_app;
\q
```

---

### 3️⃣ Setup Firebase (3 min)

**Quick steps:**

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** → Name it anything
3. Click **Authentication** → **Get started**
4. Enable **Google** sign-in method
5. Click **⚙️ Settings** → **Service accounts**
6. Click **"Generate new private key"** → **Download JSON**

**Save that JSON file!** You need it next.

---

### 4️⃣ Configure Backend (2 min)

```bash
cd backend
cp .env.example .env
```

**Edit `backend/.env`:**

Open the JSON file you downloaded and copy these values:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/birthday_app

FIREBASE_PROJECT_ID=copy-from-json
FIREBASE_PRIVATE_KEY="copy-from-json-keep-quotes-and-\n"
FIREBASE_CLIENT_EMAIL=copy-from-json

NODE_ENV=development
PORT=3000
CORS_ORIGINS=http://localhost:3000
```

**Then run migrations:**

```bash
npm run prisma:generate
npm run prisma:migrate
```

---

### 5️⃣ Start Backend (1 min)

```bash
npm run dev
```

**You should see:**
```
✅ Environment variables validated
✅ Firebase initialized
✅ Database connected
🚀 Server running on port 3000
```

**Test:** Open http://localhost:3000/health

**✨ Leave this terminal running!**

---

### 6️⃣ Run Flutter App (2 min)

**Open a NEW terminal:**

```bash
cd app
flutter pub run build_runner build --delete-conflicting-outputs
flutter run
```

**Choose your device:**
- iOS Simulator
- Android Emulator
- Chrome (for quick test)

---

## 🎉 Done!

The app should launch showing the home screen with sample birthdays!

---

## 🆘 Problems?

### Backend won't start?

**PostgreSQL not running:**
```bash
# Mac:
brew services start postgresql@15

# Linux:
sudo systemctl start postgresql
```

**Wrong password in .env:**
Update `DATABASE_URL` with your actual PostgreSQL password.

---

### Flutter errors?

**Missing dependencies:**
```bash
cd app
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

**iOS build fails:**
```bash
cd ios
pod install
cd ..
flutter run
```

---

## 📖 Next Steps

1. **Explore the UI** - Navigate through all screens
2. **Read the docs:**
   - **SETUP_INSTRUCTIONS.md** - Detailed setup help
   - **PROJECT_STATUS.md** - What's complete, what's next
3. **Start coding!**

---

## 📱 What You Can Test Now

Without authentication, you can:
- ✅ View all screens (Home, Calendar, People, Settings)
- ✅ See the UI design and navigation
- ✅ Browse mock birthday data
- ✅ Test date calculations (age, zodiac, countdown)

**Backend API is fully functional** - just needs authentication wired up!

---

## 🔥 Shortcuts

**Backend commands:**
```bash
cd backend
npm run dev              # Start server
npm run prisma:studio    # View database GUI
npm test                 # Run tests
```

**Flutter commands:**
```bash
cd app
flutter run              # Run app
flutter test             # Run tests
flutter analyze          # Check code
```

---

**That's it! You're running! 🚀**

Questions? Check **SETUP_INSTRUCTIONS.md** for detailed help.
