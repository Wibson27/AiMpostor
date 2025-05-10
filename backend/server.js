import express from "express";
import cors from "cors";
import morgan from "morgan";

import { PORT } from "./src/config/envConfig.js";

import chatsRoute from "./src/routes/chatsRoute.js";
import userRoute from "./src/routes/userRoute.js";
import seedRoute from "./src/routes/seedRoute.js";

// Inizialize the logger function
const logger = morgan("tiny");

const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to log requests
app.use(logger);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to serve static files
app.use(express.static("public"));
// Middleware to handle file uploads
app.use("/api/v1/chats/", chatsRoute);
app.use("/api/v1/user/", userRoute);
app.use("/api/v1/seed/", seedRoute);
// Middleware to handle 404 errors

// TODO: Make a middleware to handle errors
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
