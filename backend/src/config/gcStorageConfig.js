import { Storage } from "@google-cloud/storage";
import { GC_CREDENTIAL, GC_BUCKET_NAME } from "./envConfig.js";

const credentials = JSON.parse(GC_CREDENTIAL);

const gcStorage = new Storage({
  projectId: credentials.projectId,
  credentials: credentials,
});

const plants = gcStorage.bucket(GC_BUCKET_NAME);

export { plants };
