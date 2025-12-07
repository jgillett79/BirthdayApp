import admin from 'firebase-admin';
import { environment } from './environment';

let firebaseApp: admin.app.App;

export function initializeFirebase() {
  if (!firebaseApp) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: environment.firebase.projectId,
        privateKey: environment.firebase.privateKey,
        clientEmail: environment.firebase.clientEmail,
      }),
    });
  }
  return firebaseApp;
}

export function getFirebaseAuth() {
  return admin.auth();
}

export function getFirebaseMessaging() {
  return admin.messaging();
}
