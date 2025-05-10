import { auth } from "../config/firebaseConfig.js";

export const verifyUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }
  try {
    // Here you can verify the token if needed
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // Store the user ID in the request object
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
