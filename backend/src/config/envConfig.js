import dotenv from "dotenv";

dotenv.config();
// Load environment variables from .env file
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const GC_CREDENTIAL = process.env.GC_CREDENTIAL;
const GC_BUCKET_NAME = process.env.GC_BUCKET_NAME;
export {
  PORT,
  GEMINI_API_KEY,
  FIREBASE_SERVICE_ACCOUNT_KEY,
  GC_CREDENTIAL,
  GC_BUCKET_NAME,
};
