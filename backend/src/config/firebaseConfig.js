import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { FIREBASE_SERVICE_ACCOUNT_KEY } from "./envConfig.js";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY);

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

