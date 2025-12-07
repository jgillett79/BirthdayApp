# 🚂 Deploy Birthday App to Railway - Complete Guide

**Railway hosts your backend for FREE!** This means you don't need to install or run PostgreSQL or Node.js locally.

**Time: 15 minutes**

---

## What Railway Does For You

✅ **Hosts your backend** - No need to run `npm run dev` on your computer
✅ **Provides PostgreSQL** - Database included, no local install needed
✅ **Auto-deploys** - Push code, it deploys automatically
✅ **Free tier** - $5/month free credit (more than enough for this app)

## What You Still Need Locally

You'll still need:
- ✅ Flutter (to run the mobile app)
- ✅ Git (to download code)
- ✅ Firebase account (for authentication)

**You DON'T need:**
- ❌ Node.js locally
- ❌ PostgreSQL locally

---

## Part 1: Create Railway Account (2 minutes)

### Step 1.1: Sign Up

1. **Go to:** https://railway.app/
2. **Click "Start a New Project"** or "Login"
3. **Click "Login with GitHub"**
4. **Authorize Railway** to access your GitHub
5. **You're in!** Free account created

✅ Railway account ready!

---

## Part 2: Set Up Firebase (5 minutes)

**You still need Firebase for user authentication.**

### Step 2.1: Create Firebase Project

1. **Go to:** https://console.firebase.google.com/
2. **Click "Add project"**
3. **Name:** `birthday-app` (or anything)
4. **Disable Google Analytics** (toggle off)
5. **Click "Create project"**
6. **Wait 30 seconds**, then click "Continue"

### Step 2.2: Enable Google Sign-In

1. **Click "Authentication"** in left menu
2. **Click "Get started"**
3. **Click "Sign-in method"** tab
4. **Find "Google"**, click it
5. **Toggle "Enable"** to ON
6. **Select your email** in "Project support email"
7. **Click "Save"**

### Step 2.3: Get Service Account Credentials

**IMPORTANT - You need this for Railway:**

1. **Click ⚙️ gear icon** → "Project settings"
2. **Click "Service accounts"** tab
3. **Click "Generate new private key"**
4. **Click "Generate key"**
5. **A JSON file downloads** - SAVE THIS FILE!

**Open the JSON file** and find these 3 values:
- `project_id`
- `private_key` (very long)
- `client_email`

**Keep this file open** - you'll need it in the next step!

✅ Firebase ready!

---

## Part 3: Deploy Backend to Railway (5 minutes)

### Step 3.1: Fork or Push Code to Your GitHub

**If the code is already in your GitHub (jgillett79/BirthdayApp):**
- ✅ You're good! Skip to Step 3.2

**If the code is only on your computer:**

1. **Create a new repo on GitHub:**
   - Go to https://github.com/new
   - Name: `BirthdayApp`
   - Make it Private
   - Don't initialize with anything
   - Click "Create repository"

2. **Push your local code:**
   ```bash
   cd BirthdayApp
   git remote set-url origin https://github.com/YOUR_USERNAME/BirthdayApp.git
   git push -u origin main
   ```

### Step 3.2: Deploy to Railway

1. **Go to Railway dashboard:** https://railway.app/dashboard
2. **Click "New Project"**
3. **Click "Deploy from GitHub repo"**
4. **If first time:** Click "Configure GitHub App" and authorize Railway
5. **Select your repository:** `BirthdayApp`
6. **Railway will detect it and show:**
   - ✅ "Node.js app detected"
   - Click "Deploy Now"

**Wait 2-3 minutes** while Railway deploys...

### Step 3.3: Add PostgreSQL Database

1. **In your project dashboard, click "New"**
2. **Click "Database"**
3. **Click "Add PostgreSQL"**
4. **Wait 30 seconds** - database is created!

Railway automatically connects it to your app.

### Step 3.4: Configure Environment Variables

**This is where you add your Firebase credentials!**

1. **Click on your backend service** (the one that says "backend" or your app name)
2. **Click "Variables" tab**
3. **Click "Raw Editor"** button
4. **Paste this template:**

   ```env
   NODE_ENV=production
   PORT=3000
   CORS_ORIGINS=https://your-app.railway.app

   FIREBASE_PROJECT_ID=paste-from-json-file
   FIREBASE_PRIVATE_KEY=paste-from-json-file
   FIREBASE_CLIENT_EMAIL=paste-from-json-file
   ```

5. **Fill in the Firebase values** from your downloaded JSON file:
   - Replace `FIREBASE_PROJECT_ID` with `project_id` from JSON
   - Replace `FIREBASE_PRIVATE_KEY` with `private_key` from JSON (keep the quotes and \n)
   - Replace `FIREBASE_CLIENT_EMAIL` with `client_email` from JSON

6. **Click "Update Variables"**

**Railway will redeploy automatically** (takes 1-2 minutes)

### Step 3.5: Run Database Migrations

**IMPORTANT:** You need to create the database tables!

1. **In Railway, click your backend service**
2. **Click "Settings" tab**
3. **Scroll down to "Deploy"**
4. **Find "Custom Start Command"**
5. **Add this command:**
   ```
   npm run prisma:migrate deploy && npm run start
   ```
6. **Click "Update"**

**Or use Railway CLI (easier):**

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Link your project:**
   ```bash
   cd BirthdayApp/backend
   railway link
   ```
   Select your project from the list

4. **Run migrations:**
   ```bash
   railway run npx prisma migrate deploy
   ```

### Step 3.6: Get Your Backend URL

1. **In Railway, click your backend service**
2. **Click "Settings" tab**
3. **Scroll to "Domains"**
4. **Click "Generate Domain"**
5. **Copy the URL** - it looks like: `https://birthdayapp-production.up.railway.app`

**Save this URL!** You need it for the Flutter app.

✅ **Your backend is LIVE on the internet!**

**Test it:** Open your Railway URL + `/health` in a browser:
```
https://your-app.railway.app/health
```

You should see: `{"status":"ok","timestamp":"..."}`

---

## Part 4: Set Up Flutter App (3 minutes)

Now you just need to run the Flutter app and point it to your Railway backend!

### Step 4.1: Install Flutter (if you haven't)

**Windows:**
1. Download: https://docs.flutter.dev/get-started/install/windows
2. Extract to `C:\src\flutter`
3. Add to PATH: `C:\src\flutter\bin`

**Mac:**
```bash
cd ~
git clone https://github.com/flutter/flutter.git -b stable
echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.zshrc
source ~/.zshrc
```

**Verify:**
```bash
flutter --version
```

### Step 4.2: Clone Code (if you haven't)

```bash
cd ~/Documents
git clone https://github.com/YOUR_USERNAME/BirthdayApp.git
cd BirthdayApp/app
```

### Step 4.3: Configure API URL

**Update the app to use your Railway backend:**

1. **Create a config file:**

   **Create this file:** `app/lib/config/environment.dart`

   ```dart
   class Environment {
     static const String apiBaseUrl = String.fromEnvironment(
       'API_BASE_URL',
       defaultValue: 'https://YOUR-RAILWAY-URL.railway.app',
     );
   }
   ```

   **Replace `YOUR-RAILWAY-URL.railway.app`** with your actual Railway domain!

2. **Or use the .env approach:**

   Create `app/.env`:
   ```
   API_BASE_URL=https://your-app.railway.app
   ```

### Step 4.4: Install Dependencies

```bash
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

### Step 4.5: Run the App!

**Web (easiest to test):**
```bash
flutter run -d chrome
```

**iOS:**
```bash
flutter run -d iPhone
```

**Android:**
```bash
flutter run
```

**The app launches and connects to your Railway backend!** 🎉

---

## ✅ What You Have Now

- ✅ **Backend running on Railway** (https://your-app.railway.app)
- ✅ **PostgreSQL database on Railway** (managed, backed up)
- ✅ **Flutter app running locally** (connects to Railway)
- ✅ **Firebase auth ready**
- ✅ **Auto-deployment** (push to GitHub = automatic deploy)

---

## 🔄 How to Update Your App

**When you make changes:**

1. **Backend changes:**
   ```bash
   cd backend
   git add .
   git commit -m "Your changes"
   git push
   ```
   **Railway auto-deploys!** (takes 1-2 minutes)

2. **Flutter changes:**
   - Just edit code and run `flutter run`
   - Changes appear immediately

---

## 💰 Railway Costs

**Free tier includes:**
- ✅ $5/month credit (enough for this app)
- ✅ 500 hours of usage
- ✅ PostgreSQL database
- ✅ Automatic deployments

**Your app should stay FREE** unless you get thousands of users!

---

## 📊 Monitor Your App

**In Railway dashboard:**

1. **Click "Metrics"** - See traffic, memory, CPU
2. **Click "Deployments"** - See deploy history
3. **Click "Logs"** - See backend logs in real-time

---

## 🐛 Troubleshooting Railway

### "Deploy failed"

**Check build logs:**
1. Click your service
2. Click "Deployments"
3. Click the failed deployment
4. Read error message

**Common issues:**
- Missing environment variables
- TypeScript errors
- Build command wrong

### "Can't connect to database"

Railway auto-connects PostgreSQL. If issues:
1. Check database is running (green dot)
2. Restart your service

### "502 Bad Gateway"

Your app isn't starting:
1. Check logs for errors
2. Verify environment variables are set
3. Check start command is correct

### Test backend directly

```bash
curl https://your-app.railway.app/health
```

Should return: `{"status":"ok",...}`

---

## 🎯 Summary - What You Did

**Instead of running backend locally:**
- ❌ No PostgreSQL install
- ❌ No Node.js server running
- ❌ No environment variables locally

**You now have:**
- ✅ Backend hosted on Railway
- ✅ Database on Railway
- ✅ Just run Flutter app locally
- ✅ Everything connects automatically

**Much simpler!**

---

## 📱 Next Steps

1. **Test the backend:** https://your-app.railway.app/health
2. **Run Flutter app**
3. **Try adding a birthday** (once auth is wired up)
4. **Make changes and push** - auto-deploys!

Your backend is now live on the internet and ready for the mobile app to connect! 🚀

---

## 🆘 Need Help?

**Railway issues:**
- Check Railway docs: https://docs.railway.app/
- Check deployment logs in Railway dashboard

**App issues:**
- Make sure API_BASE_URL points to your Railway URL
- Check Railway logs for backend errors
- Verify environment variables are set in Railway

**Still stuck?**
- Railway has great Discord support
- Check BEGINNER_SETUP.md for local development alternative
