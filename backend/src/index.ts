import app from './app';
import { environment, validateEnvironment } from './config/environment';
import { connectDatabase } from './config/database';
import { initializeFirebase } from './config/firebase';

async function startServer() {
  try {
    // Validate environment variables
    validateEnvironment();
    console.log('✅ Environment variables validated');

    // Initialize Firebase
    initializeFirebase();
    console.log('✅ Firebase initialized');

    // Connect to database
    await connectDatabase();

    // Start Express server
    app.listen(environment.port, () => {
      console.log(`🚀 Server running on port ${environment.port}`);
      console.log(`📝 Environment: ${environment.nodeEnv}`);
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
