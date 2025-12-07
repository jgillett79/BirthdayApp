# 🚀 Railway Quick Start - No Firebase Required!

**Deploy and test your backend in 5 minutes - no authentication setup needed!**

This guide gets your backend running on Railway **without Firebase**. Perfect for testing the app before adding authentication.

---

## ✅ What You Need

- GitHub account
- Railway account (free - create at https://railway.app)
- That's it! No Firebase, no complicated setup.

---

## 📋 Step-by-Step (5 Minutes)

### 1️⃣ Create Railway Account (1 minute)

1. Go to https://railway.app/
2. Click "Login with GitHub"
3. Authorize Railway
4. ✅ Done!

---

### 2️⃣ Deploy Your App (2 minutes)

1. **In Railway, click "New Project"**
2. **Click "Deploy from GitHub repo"**
3. **Select your `BirthdayApp` repository**
4. **Railway detects Node.js automatically**
5. **Click "Deploy Now"**

⏳ Wait 2-3 minutes while it builds...

---

### 3️⃣ Add PostgreSQL Database (30 seconds)

1. **In your project, click "New"**
2. **Click "Database"**
3. **Click "Add PostgreSQL"**
4. ✅ Done! Railway auto-connects it

---

### 4️⃣ Set Environment Variables (1 minute)

**Only 2 variables needed for testing!**

1. **Click your backend service**
2. **Click "Variables" tab**
3. **Click "Raw Editor"**
4. **Paste this:**

```env
NODE_ENV=production
PORT=3000
```

5. **Click "Update Variables"**

That's it! No Firebase credentials needed!

---

### 5️⃣ Run Database Migrations (1 minute)

**Railway CLI method (recommended):**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link your project
cd backend
railway link

# Run migrations
railway run npx prisma migrate deploy
```

**OR Dashboard method:**

1. Click "Settings" tab
2. Scroll to "Deploy"
3. Custom Start Command: `npx prisma migrate deploy && npm run start`
4. Click "Update"

---

### 6️⃣ Get Your URL (30 seconds)

1. **Click your backend service**
2. **Click "Settings" tab**
3. **Scroll to "Domains"**
4. **Click "Generate Domain"**
5. **Copy the URL** (e.g., `https://birthdayapp-production.up.railway.app`)

**Test it!** Open in browser:
```
https://your-url.railway.app/health
```

Should return: `{"status":"ok"}`

✅ **Your backend is LIVE!**

---

## 🎉 What Works Without Firebase?

✅ **All API endpoints** - Create, read, update, delete birthdays
✅ **Database operations** - Full CRUD on people, households, events
✅ **Upcoming birthdays** - Query birthdays by date range
✅ **Household management** - Create/join households
✅ **Sync operations** - Offline sync queue

⚠️ **What doesn't work:**
- Firebase authentication (bypassed with test user)
- Push notifications (requires Firebase Cloud Messaging)

**But you can test everything else!**

---

## 🧪 How Authentication Works in Test Mode

**When Firebase is disabled:**
- All API requests automatically use a "Test User"
- No authentication tokens required
- Perfect for testing UI and functionality
- Data persists in PostgreSQL

**To enable real authentication later:**
1. Set up Firebase (see RAILWAY_DEPLOYMENT.md)
2. Add Firebase environment variables
3. Add `ENABLE_FIREBASE=true` to Railway
4. Redeploy

---

## 🌐 Now Test Your App!

### Update Flutter App

1. **Open:** `app/lib/core/config/api_config.dart`

2. **Update baseUrl with YOUR Railway URL:**
   ```dart
   static const String baseUrl = 'https://birthdayapp-production.up.railway.app';
   ```

3. **Save the file**

### Run as Website

```bash
cd app
flutter run -d chrome
```

🎉 **App opens in browser and connects to Railway!**

---

## 🧪 Test the API Directly

You can test the backend with curl or Postman:

**Health check:**
```bash
curl https://your-url.railway.app/health
```

**Get upcoming birthdays:**
```bash
curl https://your-url.railway.app/api/people/upcoming
```

**Create a birthday:**
```bash
curl -X POST https://your-url.railway.app/api/people \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "birthdayMonth": 12,
    "birthdayDay": 25,
    "birthYear": 1990
  }'
```

**All endpoints work without authentication tokens!**

---

## 📊 Monitor Your Deployment

**In Railway dashboard:**

- **Deployments** - See build status and history
- **Logs** - Real-time backend logs
- **Metrics** - CPU, memory, network usage
- **Variables** - Environment variables

---

## 🔄 Update Your Backend

When you make code changes:

```bash
git add .
git commit -m "Your changes"
git push
```

**Railway auto-deploys in 1-2 minutes!** 🚀

---

## 💰 Cost

**Railway Free Tier:**
- $5/month free credit
- Enough for development and testing
- Supports hundreds of requests per day

**Your app stays FREE for testing!**

---

## 🐛 Troubleshooting

### "Build failed"

**Check logs:**
1. Click Deployments
2. Click the failed deployment
3. Read the error

**Common fixes:**
- Make sure code is pushed to GitHub
- Check `railway.toml` exists in backend folder

### "Can't connect to backend"

**Verify:**
1. Backend is running (green status in Railway)
2. Database is connected
3. Health check works: `/health` endpoint
4. Your app has correct Railway URL in `api_config.dart`

### "Database error"

**Run migrations:**
```bash
railway run npx prisma migrate deploy
```

---

## ⬆️ Add Firebase Later

**When ready for real authentication:**

See **RAILWAY_DEPLOYMENT.md** for full Firebase setup.

**Quick version:**
1. Create Firebase project
2. Get service account JSON
3. Add to Railway variables:
   ```env
   ENABLE_FIREBASE=true
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
   ```
4. Redeploy

---

## ✅ Success Checklist

- [ ] Railway account created
- [ ] App deployed from GitHub
- [ ] PostgreSQL database added
- [ ] Environment variables set (NODE_ENV, PORT)
- [ ] Database migrations run
- [ ] Domain generated
- [ ] Health check works
- [ ] Flutter app updated with Railway URL
- [ ] App runs in browser: `flutter run -d chrome`
- [ ] Can add/view birthdays

---

## 🚀 Next Steps

1. **Test the web app** - `flutter run -d chrome`
2. **Add some birthdays** - Test all the features
3. **Share with testers** - Deploy web version
4. **Add Firebase** - When ready for real auth
5. **Build for app stores** - Final step!

---

## 📚 Related Guides

- **WEB_TESTING.md** - How to run as website
- **RAILWAY_DEPLOYMENT.md** - Full guide with Firebase
- **BEFORE_YOU_BUILD.md** - Pre-app store checklist
- **HOW_IT_WORKS.md** - Architecture explanation

---

**You're all set! Test mode backend is running on Railway!** 🎉

No Firebase needed for now - add it later when you're ready for production!
