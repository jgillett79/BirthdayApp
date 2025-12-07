import admin from 'firebase-admin';
import { environment } from './environment';

let firebaseApp: admin.app.App | null = null;

export function initializeFirebase() {
  if (!environment.firebase.enabled) {
    console.log('⚠️  Firebase disabled - auth and notifications will not work');
    return null;
  }

  if (!firebaseApp) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: environment.firebase.projectId,
        privateKey: environment.firebase.privateKey,
        clientEmail: environment.firebase.clientEmail,
      }),
    });
    console.log('✅ Firebase initialized');
  }
  return firebaseApp;
}

export function getFirebaseAuth() {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Set ENABLE_FIREBASE=true and provide credentials.');
  }
  return admin.auth();
}

export function getFirebaseMessaging() {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Set ENABLE_FIREBASE=true and provide credentials.');
  }
  return admin.messaging();
}

export function isFirebaseEnabled(): boolean {
  return environment.firebase.enabled && firebaseApp !== null;
}
