# Before You Build - Pre-Distribution Checklist

**⚠️ IMPORTANT: Complete these steps BEFORE building your app for distribution!**

This checklist ensures your app is properly configured to connect to your Railway backend.

---

## 📋 Quick Checklist

- [ ] Deploy backend to Railway
- [ ] Get your Railway URL
- [ ] Update `api_config.dart` with Railway URL
- [ ] Configure Firebase for your app
- [ ] Test the connection
- [ ] Build and distribute

---

## Step-by-Step Instructions

### 1️⃣ Deploy Your Backend to Railway

Follow the complete guide in **RAILWAY_DEPLOYMENT.md**.

At the end, you'll have:
- ✅ Backend running on Railway
- ✅ PostgreSQL database created
- ✅ A Railway URL like: `https://birthdayapp-production.railway.app`

**⏱️ Time:** 10-15 minutes

---

### 2️⃣ Get Your Railway Backend URL

1. Go to [railway.app](https://railway.app)
2. Open your BirthdayApp project
3. Click on your backend service
4. Go to **Settings** → **Domains**
5. Copy the domain (e.g., `birthdayapp-production.railway.app`)

**✏️ Write it down:** `https://______________________.railway.app`

---

### 3️⃣ Update Your API Configuration

Open this file: **`app/lib/core/config/api_config.dart`**

**Find this line:**
```dart
static const String baseUrl = 'https://your-app.railway.app';
```

**Replace with YOUR Railway URL:**
```dart
static const String baseUrl = 'https://birthdayapp-production.railway.app';
```

**Example:**
```dart
class ApiConfig {
  /// Production backend URL (Railway)
  static const String baseUrl = 'https://birthdayapp-production.railway.app'; // ✅ Your actual URL

  /// Local development URL
  static const String localUrl = 'http://localhost:3000';

  // ... rest of the file
}
```

**Save the file!** 💾

---

### 4️⃣ Verify Firebase Configuration

Make sure these files exist with YOUR Firebase project credentials:

**For Android:**
- ✅ `app/android/app/google-services.json`

**For iOS:**
- ✅ `app/ios/Runner/GoogleService-Info.plist`

**Don't have these?** Follow Firebase setup in **BEGINNER_SETUP.md** (Part 4).

---

### 5️⃣ Test the Connection

Before building for distribution, TEST that everything works:

```bash
# Make sure you're in the app directory
cd app

# Build a release APK for testing
flutter build apk --release

# Install on a test device
adb install build/app/outputs/flutter-apk/app-release.apk
```

**Test these features:**
1. ✅ Open the app
2. ✅ Sign in with Google or Apple
3. ✅ Add a test birthday
4. ✅ See it appear in the list
5. ✅ Check that it syncs (close app, reopen, data persists)

**If anything fails:**
- Check your Railway URL in `api_config.dart`
- Verify Railway backend is running
- Check Firebase configuration
- Look at logs: `flutter run --release` to see errors

---

### 6️⃣ Update Version Info (Optional but Recommended)

**For Android:** `app/android/app/build.gradle`

```gradle
android {
    defaultConfig {
        applicationId "com.yourdomain.birthdayapp"  // ✅ Change this
        versionCode 1
        versionName "1.0.0"
    }
}
```

**For iOS:** `app/ios/Runner/Info.plist`

```xml
<key>CFBundleIdentifier</key>
<string>com.yourdomain.birthdayapp</string>  <!-- ✅ Change this -->
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
```

---

### 7️⃣ Build for Distribution

Now you're ready to build!

#### **For Google Play Store:**

```bash
cd app

# Build Android App Bundle (required for Play Store)
flutter build appbundle --release
```

**Output:** `build/app/outputs/bundle/release/app-release.aab`

Upload this `.aab` file to Google Play Console.

---

#### **For Apple App Store:**

```bash
cd app

# Build iOS app
flutter build ios --release
```

Then open in Xcode:
```bash
open ios/Runner.xcworkspace
```

1. Select **Product** → **Archive**
2. Wait for build to complete
3. Click **Distribute App**
4. Follow App Store upload wizard

---

#### **For Direct Distribution (Testing):**

```bash
cd app

# Build APK (Android only)
flutter build apk --release
```

**Output:** `build/app/outputs/flutter-apk/app-release.apk`

Share this `.apk` file for manual installation (Android only).

---

## 🔍 Verification Checklist

Before distributing, verify:

### Backend (Railway)
- [ ] Backend is deployed and running
- [ ] Database is created with all tables
- [ ] Environment variables are set (Firebase credentials, etc.)
- [ ] Health check endpoint works: `https://your-url.railway.app/health`

### App Configuration
- [ ] `api_config.dart` has correct Railway URL
- [ ] Firebase configuration files are present
- [ ] App builds successfully without errors
- [ ] Release build tested on real device

### Functionality
- [ ] User can sign in with Google/Apple
- [ ] User can create household
- [ ] User can add birthdays
- [ ] Birthdays appear in list
- [ ] Data persists after closing app
- [ ] Sync works (data survives app restart)

---

## 🚨 Common Mistakes

### ❌ Mistake #1: Forgot to Update Railway URL
**Symptom:** App can't connect, shows offline mode always

**Fix:** Check `app/lib/core/config/api_config.dart` has your Railway URL

---

### ❌ Mistake #2: Wrong Firebase Configuration
**Symptom:** Sign-in fails, crashes on auth screen

**Fix:**
- Android: Verify `google-services.json` is from YOUR Firebase project
- iOS: Verify `GoogleService-Info.plist` is from YOUR Firebase project

---

### ❌ Mistake #3: Backend Not Running
**Symptom:** App shows "Can't connect to server"

**Fix:**
- Go to Railway dashboard
- Check backend service is running (green status)
- Check logs for errors
- Verify database is connected

---

### ❌ Mistake #4: Railway URL Has Typo
**Symptom:** App can't connect, shows network errors

**Fix:**
- Copy URL directly from Railway dashboard
- Make sure it starts with `https://`
- Make sure there's no trailing slash: ✅ `https://app.railway.app` ❌ `https://app.railway.app/`

---

## 📱 Platform-Specific Notes

### Android
- **Minimum SDK:** 21 (Android 5.0)
- **Target SDK:** 34 (Android 14)
- **File to upload:** `.aab` for Play Store, `.apk` for direct distribution
- **Signing:** Automatically handled by Flutter for release builds

### iOS
- **Minimum Version:** iOS 12.0
- **File to upload:** Archive created in Xcode
- **Signing:** Requires Apple Developer account and provisioning profiles
- **Mac Required:** Yes, can't build iOS apps on Windows/Linux

---

## 🎯 What Happens After Distribution

Once you upload to the App Store / Play Store:

1. **Review Process:**
   - Google Play: 1-3 days
   - Apple App Store: 1-3 days (sometimes longer)

2. **All Users Connect to Your Railway Backend:**
   - Every installed app connects to `https://your-app.railway.app`
   - Data is isolated by household (users can't see each other's data)
   - You can monitor usage in Railway dashboard

3. **Updates:**
   - **Backend updates:** Deploy to Railway, all users get it immediately
   - **App updates:** Build new version, upload to store, users update app

---

## 💰 Cost Reminder

**Railway Costs (where all users connect):**
- Free tier: $5/month credit (enough for ~50-200 users)
- Paid tier: Starts at $5/month usage-based

**Store Fees:**
- Google Play: $25 one-time
- Apple App Store: $99/year

---

## 🆘 Need Help?

**If you get stuck:**

1. **Check Railway logs:**
   - Go to Railway dashboard
   - Click on backend service
   - View "Logs" tab
   - Look for errors

2. **Check Flutter logs:**
   ```bash
   flutter run --release
   # Watch for errors when testing features
   ```

3. **Verify API connection manually:**
   ```bash
   # Test your Railway backend directly
   curl https://your-app.railway.app/health

   # Should return: {"status":"ok"}
   ```

4. **Common issues and fixes:**
   - "Can't connect": Check Railway URL in `api_config.dart`
   - "Auth failed": Check Firebase configuration files
   - "Database error": Check Railway database is running
   - "Build failed": Run `flutter clean` then rebuild

---

## ✅ You're Ready When:

- ✅ Railway backend is deployed and healthy
- ✅ `api_config.dart` has correct Railway URL
- ✅ Firebase is configured for your app
- ✅ Release build tested successfully
- ✅ All features work (sign in, add birthday, sync)

**Now you can build and distribute with confidence!** 🚀

---

## 📚 Related Guides

- **RAILWAY_DEPLOYMENT.md** - Deploy your backend (do this first!)
- **FLUTTER_EXPLAINED.md** - Understanding Flutter and app stores
- **HOW_IT_WORKS.md** - Architecture and how users connect
- **BEGINNER_SETUP.md** - Detailed setup for local development
