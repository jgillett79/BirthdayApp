import app from './app';
import { environment, validateEnvironment } from './config/environment';
import { connectDatabase } from './config/database';
import { initializeFirebase } from './config/firebase';
import { startNotificationScheduler } from './jobs/notificationScheduler';

async function startServer() {
  try {
    // Validate environment variables
    validateEnvironment();
    console.log('✅ Environment variables validated');

    // Initialize Firebase (optional)
    initializeFirebase();

    // Connect to database
    await connectDatabase();

    // Start notification scheduler (only if Firebase is enabled)
    if (environment.firebase.enabled) {
      startNotificationScheduler();
    } else {
      console.log('⚠️  Notification scheduler disabled (Firebase not enabled)');
    }

    // Start Express server
    app.listen(environment.port, () => {
      console.log(`🚀 Server running on port ${environment.port}`);
      console.log(`📝 Environment: ${environment.nodeEnv}`);
      console.log(`🔥 Firebase: ${environment.firebase.enabled ? 'Enabled' : 'Disabled'}`);
      console.log(`🏥 Health check: http://localhost:${environment.port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();
