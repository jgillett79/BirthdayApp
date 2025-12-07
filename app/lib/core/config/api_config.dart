/// API Configuration
///
/// This file contains the backend API URL configuration.
/// Update the [baseUrl] with your Railway backend URL before building for production.

class ApiConfig {
  /// Production backend URL (Railway)
  ///
  /// IMPORTANT: Replace this with your actual Railway deployment URL
  /// Example: 'https://birthdayapp-production.railway.app'
  ///
  /// To find your Railway URL:
  /// 1. Go to railway.app
  /// 2. Open your project
  /// 3. Click on your backend service
  /// 4. Copy the domain from "Settings" → "Domains"
  static const String baseUrl = 'https://your-app.railway.app';

  /// Local development URL
  ///
  /// Used when running the app in debug mode on an emulator/simulator
  static const String localUrl = 'http://localhost:3000';

  /// Android emulator URL
  ///
  /// When testing on Android emulator, use this to connect to your local backend
  /// (Android emulator uses 10.0.2.2 to reach the host machine's localhost)
  static const String androidEmulatorUrl = 'http://10.0.2.2:3000';

  /// Get the appropriate API URL based on the environment
  ///
  /// Returns:
  /// - [localUrl] when running in debug mode
  /// - [baseUrl] when running in release mode (production)
  static String get apiUrl {
    // In production builds, always use the production URL
    const bool isProduction = bool.fromEnvironment('dart.vm.product');
    if (isProduction) {
      return baseUrl;
    }

    // In debug mode, you can override via environment variable
    // Example: flutter run --dart-define=USE_PRODUCTION=true
    const bool useProduction = bool.fromEnvironment('USE_PRODUCTION');
    if (useProduction) {
      return baseUrl;
    }

    // Default to local URL for development
    return localUrl;
  }

  /// Check if we're using the production backend
  static bool get isUsingProduction => apiUrl == baseUrl;

  /// Check if we're using a local backend
  static bool get isUsingLocal => apiUrl == localUrl || apiUrl == androidEmulatorUrl;
}
