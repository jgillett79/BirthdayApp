import dotenv from 'dotenv';

dotenv.config();

export const environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || '',

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  },

  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],

  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Validate required environment variables
export function validateEnvironment() {
  const required = [
    'DATABASE_URL',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
