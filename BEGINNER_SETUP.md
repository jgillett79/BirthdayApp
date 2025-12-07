# 🎂 Birthday App - Complete Beginner Setup Guide

**For people who've never done this before!**

I'll walk you through EVERYTHING. Just follow along step by step.

---

## Part 1: Install Required Software (One Time Only)

You need to install 4 programs. I'll show you how.

### Step 1.1: Install Node.js (JavaScript Runtime)

**What is it?** Software that runs the backend server.

**How to install:**

1. Go to: https://nodejs.org/
2. Click the **big green button** that says "Download Node.js (LTS)"
3. **Wait for download** (it's about 80MB)
4. **Run the installer:**
   - **Windows:** Double-click the downloaded .msi file
   - **Mac:** Double-click the downloaded .pkg file
5. **Click "Next"** through all the screens (keep all defaults)
6. **Click "Install"** at the end
7. **Wait** for it to finish (takes 1-2 minutes)
8. **Click "Finish"**

**Verify it worked:**

1. **Open Terminal/Command Prompt:**
   - **Windows:** Press `Windows key`, type `cmd`, press Enter
   - **Mac:** Press `Cmd + Space`, type `terminal`, press Enter

2. **Type this command and press Enter:**
   ```bash
   node --version
   ```

3. **You should see:** `v20.11.0` or similar (any v20+ is good)

✅ If you see a version number, Node.js is installed!

---

### Step 1.2: Install PostgreSQL (Database)

**What is it?** Database software to store all the birthdays.

**How to install:**

**WINDOWS:**

1. Go to: https://www.postgresql.org/download/windows/
2. Click **"Download the installer"**
3. Click the **latest version** (15.x or 16.x)
4. **Download** the Windows x86-64 installer
5. **Run the installer**
6. **Setup wizard:**
   - Click "Next"
   - Installation directory: **Keep default**, click "Next"
   - Components: **Check all boxes**, click "Next"
   - Data directory: **Keep default**, click "Next"
   - **PASSWORD:** Choose a password you'll remember (write it down!)
   - Port: **Keep as 5432**, click "Next"
   - Locale: **Keep default**, click "Next"
   - Click "Next" then "Finish"

**MAC:**

1. **Open Terminal** (Cmd + Space, type "terminal")
2. **Install Homebrew** (if you don't have it):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   Press Enter when asked, enter your Mac password

3. **Install PostgreSQL:**
   ```bash
   brew install postgresql@15
   ```
   Wait 2-3 minutes for download and install

4. **Start PostgreSQL:**
   ```bash
   brew services start postgresql@15
   ```

**Verify it worked:**

In Terminal/Command Prompt, type:
```bash
psql --version
```

✅ You should see: `psql (PostgreSQL) 15.x` or similar

---

### Step 1.3: Install Flutter (Mobile App Framework)

**What is it?** Software to build and run the mobile app.

**WINDOWS:**

1. Go to: https://docs.flutter.dev/get-started/install/windows
2. Click **"Download Flutter SDK"** (big blue button)
3. **Extract the zip file:**
   - Right-click downloaded file
   - Choose "Extract All"
   - Extract to: `C:\src\flutter` (create this folder)
4. **Add to PATH:**
   - Press `Windows key`, type "environment"
   - Click "Edit environment variables for your account"
   - Under "User variables", select "Path", click "Edit"
   - Click "New"
   - Add: `C:\src\flutter\bin`
   - Click "OK" on all windows
5. **Close and reopen Command Prompt**

**MAC:**

1. **Open Terminal**
2. **Download Flutter:**
   ```bash
   cd ~
   curl -O https://storage.googleapis.com/flutter_infra_release/releases/stable/macos/flutter_macos_arm64_3.16.0-stable.zip
   unzip flutter_macos_arm64_3.16.0-stable.zip
   ```

3. **Add to PATH:**
   ```bash
   echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.zshrc
   source ~/.zshrc
   ```

**Verify it worked:**

Close and reopen Terminal, then type:
```bash
flutter --version
```

✅ You should see Flutter version info

---

### Step 1.4: Install Git (Version Control)

**What is it?** Software to download code from GitHub.

**WINDOWS:**

1. Go to: https://git-scm.com/download/win
2. Download will start automatically
3. **Run the installer**
4. **Keep all defaults**, just click "Next" through everything
5. Click "Install" then "Finish"

**MAC:**

1. **Open Terminal**
2. Type:
   ```bash
   git --version
   ```
3. If not installed, Mac will prompt you to install. Click "Install"

**Verify it worked:**

```bash
git --version
```

✅ You should see: `git version 2.x.x`

---

## Part 2: Download the Birthday App Code

### Step 2.1: Clone the Repository

**Open Terminal/Command Prompt** and follow these exact steps:

1. **Navigate to a folder where you want the code:**

   **Choose ONE:**

   **Windows:**
   ```bash
   cd C:\Users\YourName\Documents
   ```
   (Replace `YourName` with your actual Windows username)

   **Mac:**
   ```bash
   cd ~/Documents
   ```

2. **Download the code:**
   ```bash
   git clone https://github.com/jgillett79/BirthdayApp.git
   ```

   **You should see:**
   ```
   Cloning into 'BirthdayApp'...
   Receiving objects: 100% ...
   ```

3. **Go into the folder:**
   ```bash
   cd BirthdayApp
   ```

4. **Checkout the correct branch:**
   ```bash
   git checkout claude/transfer-design-files-016RPv13LgER24hhGf6vWRQW
   ```

✅ **You should see:** "Switched to branch..."

**What you have now:** A folder called `BirthdayApp` with all the code!

---

## Part 3: Set Up the Database

### Step 3.1: Create the Database

**Open a NEW Terminal/Command Prompt window** (keep the old one open).

**Type these commands ONE AT A TIME:**

1. **Connect to PostgreSQL:**

   **Windows:**
   ```bash
   psql -U postgres
   ```

   **Mac:**
   ```bash
   psql postgres
   ```

   **It will ask for password:** Enter the password you chose during PostgreSQL installation

   **You should see:** `postgres=#` (this means you're connected!)

2. **Create the database:**

   Copy this EXACT command:
   ```sql
   CREATE DATABASE birthday_app;
   ```
   Press Enter

   **You should see:** `CREATE DATABASE`

3. **Verify it was created:**
   ```sql
   \l
   ```
   Press Enter

   **Look for** `birthday_app` in the list

4. **Exit PostgreSQL:**
   ```sql
   \q
   ```
   Press Enter

✅ **Database created successfully!**

---

## Part 4: Set Up Firebase (Free Account)

### Step 4.1: Create Firebase Account

1. **Go to:** https://console.firebase.google.com/
2. **Click "Sign in with Google"**
3. **Choose your Google account** (or create one if you don't have one)

### Step 4.2: Create a Project

1. **Click "Add project"** (big purple button)
2. **Project name:** Type `birthday-app` (or anything you want)
3. **Click "Continue"**
4. **Google Analytics:** Toggle it OFF (we don't need it)
5. **Click "Create project"**
6. **Wait 30 seconds** while it creates
7. **Click "Continue"** when done

### Step 4.3: Enable Google Sign-In

1. **In the left menu, click "Authentication"** (🔐 icon)
2. **Click "Get started"** button
3. **Click "Sign-in method"** tab at the top
4. **Find "Google"** in the list, click it
5. **Toggle the switch to "Enable"**
6. **In "Project support email", select your email** from dropdown
7. **Click "Save"** at the bottom

✅ **Google Sign-In enabled!**

### Step 4.4: Get Service Account Credentials

This is the MOST IMPORTANT part - follow carefully!

1. **Click the ⚙️ (gear icon)** at the top left → **"Project settings"**
2. **Click the "Service accounts" tab** at the top
3. **Click "Generate new private key"** button
4. **Click "Generate key"** in the popup
5. **A JSON file downloads** - THIS IS IMPORTANT!
6. **Move this file to somewhere safe** - you'll need it in the next step

**IMPORTANT:** Don't lose this file! You need it for the next part.

✅ **Firebase is ready!**

---

## Part 5: Configure the Backend

### Step 5.1: Install Backend Dependencies

**Go back to your first Terminal** (the one in BirthdayApp folder)

If you closed it, reopen and:
```bash
cd BirthdayApp
cd backend
```

**Install packages:**
```bash
npm install
```

**Wait 1-2 minutes.** You'll see lots of text scrolling. This is normal.

**You should see:** "added XXX packages"

✅ **Packages installed!**

### Step 5.2: Create Environment File

**Still in the `backend` folder**, type:

**Windows:**
```bash
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

**You should see:** File created successfully

### Step 5.3: Edit Environment File

**Now we need to fill in the `.env` file with your settings.**

**Windows - Edit the file:**
```bash
notepad .env
```

**Mac - Edit the file:**
```bash
open -a TextEdit .env
```

**You'll see a file that looks like this:**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/birthday_app

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

NODE_ENV=development
PORT=3000
CORS_ORIGINS=http://localhost:3000,http://localhost:8080
```

**STEP BY STEP - Edit each line:**

**Line 1 - DATABASE_URL:**

Replace with YOUR PostgreSQL password:

**Windows:**
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/birthday_app
```

**Mac:**
```
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/birthday_app
```

Replace `YOUR_PASSWORD` with the password you chose when installing PostgreSQL.

**Lines 4-6 - Firebase Credentials:**

1. **Open the JSON file** that Firebase downloaded (the service account file)
2. **Find these values in the JSON:**
   - `project_id` - copy this
   - `private_key` - copy this (it's long!)
   - `client_email` - copy this

3. **Replace in .env:**

```env
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_FROM_JSON
FIREBASE_PRIVATE_KEY="PASTE_PRIVATE_KEY_HERE"
FIREBASE_CLIENT_EMAIL=PASTE_CLIENT_EMAIL_HERE
```

**IMPORTANT for FIREBASE_PRIVATE_KEY:**
- Keep it on ONE line
- Keep the quotes: `"..."`
- Keep the `\n` characters in the key
- It should look like: `"-----BEGIN PRIVATE KEY-----\nMIIEvQ...very long...==\n-----END PRIVATE KEY-----\n"`

**Lines 8-10 - Leave as is**

**Save the file:**
- Notepad: Ctrl+S
- TextEdit: Cmd+S

**Close the editor**

✅ **Backend configured!**

### Step 5.4: Set Up Database Tables

**In Terminal, in the `backend` folder**, run these commands:

1. **Generate Prisma client:**
   ```bash
   npm run prisma:generate
   ```

   **Wait 10-20 seconds**

   **You should see:** "✔ Generated Prisma Client"

2. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

   **It asks for migration name**, type:
   ```
   init
   ```
   Press Enter

   **You should see:** "Your database is now in sync"

✅ **Database tables created!**

---

## Part 6: Start the Backend Server

**Still in `backend` folder**, type:

```bash
npm run dev
```

**You should see:**
```
✅ Environment variables validated
✅ Firebase initialized
✅ Database connected successfully
📅 Notification scheduler started
🚀 Server running on port 3000
```

**✅ If you see this, YOUR BACKEND IS RUNNING!**

**Test it:** Open a web browser and go to:
```
http://localhost:3000/health
```

You should see: `{"status":"ok","timestamp":"..."}`

**KEEP THIS TERMINAL WINDOW OPEN!** The backend needs to stay running.

---

## Part 7: Run the Flutter App

### Step 7.1: Open a NEW Terminal Window

**Windows:** Press `Windows key`, type `cmd`, press Enter
**Mac:** Press `Cmd + Space`, type `terminal`, press Enter

### Step 7.2: Navigate to App Folder

```bash
cd BirthdayApp/app
```

(If you're not sure where BirthdayApp is, it's in Documents from earlier)

**Windows full path:**
```bash
cd C:\Users\YourName\Documents\BirthdayApp\app
```

**Mac full path:**
```bash
cd ~/Documents/BirthdayApp/app
```

### Step 7.3: Install Flutter Packages

```bash
flutter pub get
```

**Wait 30-60 seconds**

**You should see:** "Got dependencies!"

### Step 7.4: Generate Database Code

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

**Wait 20-30 seconds**

**You should see:** "[INFO] Succeeded after..."

### Step 7.5: Run the App!

**Choose your platform:**

**For Web (easiest to test):**
```bash
flutter run -d chrome
```

**For iOS Simulator (Mac only):**
```bash
flutter run -d iPhone
```

**For Android Emulator:**
1. First, open Android Studio
2. Start an emulator (Tools → Device Manager → Play button)
3. Then run:
```bash
flutter run
```

**The app will build (takes 2-5 minutes first time)**

**You should see:**
```
Launching lib/main.dart on Chrome in debug mode...
Built build/web/main.dart.js
```

**THEN THE APP OPENS! 🎉**

---

## 🎉 SUCCESS! You're Running the App!

**You should see:**
- A home screen with sample birthdays
- Bottom navigation (Home, Calendar, People, Settings)
- A purple/pink color theme
- Working UI you can click through

---

## What You Can Test Right Now

**Try these:**

1. **Click the "+" button** - Opens add birthday screen
2. **Type a name** - Try adding a birthday
3. **Bottom navigation** - Tap Calendar, People, Settings
4. **Click a birthday card** - Opens person details

**It all works!** The UI is fully functional with sample data.

---

## ⚠️ Troubleshooting

### "psql: command not found"

PostgreSQL isn't in your PATH.

**Windows:** Restart your computer
**Mac:** Run:
```bash
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
```

### "npm: command not found"

Close and reopen Terminal after installing Node.js.

### "Database connection failed"

Check your password in `.env` is correct:
```bash
cd backend
notepad .env
```

Verify the DATABASE_URL password matches your PostgreSQL password.

### "Flutter command not found"

**Windows:**
1. Restart Command Prompt
2. Check PATH has `C:\src\flutter\bin`

**Mac:**
```bash
export PATH="$PATH:$HOME/flutter/bin"
```

### Backend won't start - "Missing environment variables"

Your `.env` file is missing values. Check:
1. File exists: `backend/.env`
2. All fields are filled in
3. FIREBASE_PRIVATE_KEY is in quotes

### App won't build

Try:
```bash
cd app
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
flutter run
```

---

## 📞 Still Stuck?

If something isn't working:

1. **Check which step failed** - error messages tell you what's wrong
2. **Re-read that step** - did you miss something?
3. **Try the troubleshooting section** above
4. **Close everything and start fresh** - sometimes a restart fixes it

---

## ✅ Checklist - Did Everything Work?

- [ ] Node.js installed (`node --version` works)
- [ ] PostgreSQL installed (`psql --version` works)
- [ ] Flutter installed (`flutter --version` works)
- [ ] Git installed (`git --version` works)
- [ ] Code downloaded (BirthdayApp folder exists)
- [ ] Database created (saw "CREATE DATABASE")
- [ ] Firebase project created
- [ ] Service account JSON downloaded
- [ ] .env file configured
- [ ] Backend packages installed (`npm install` succeeded)
- [ ] Database migrated (`prisma:migrate` succeeded)
- [ ] Backend running (see "Server running on port 3000")
- [ ] http://localhost:3000/health shows OK
- [ ] Flutter packages installed
- [ ] Database code generated
- [ ] App running and showing UI

**All checked?** You're done! 🎉

---

## What's Next?

The app is running with sample data. To make it fully functional:

1. The UI works - you can navigate everywhere
2. The backend API works - it's ready for real data
3. To connect them - need to add authentication and state management

But **you can test and explore everything right now!**

Enjoy your birthday app! 🎂
