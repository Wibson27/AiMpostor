import { db } from "../config/firebaseConfig.js";
import { FieldValue } from "firebase-admin/firestore";
import { Router } from "express";
import { verifyUser } from "../middlewares/userMiddleware.js";
const router = Router();

router.post("/signup", verifyUser, async (req, res) => {
  const { email, uid } = req.user;
  const name = req.body?.name;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "username is required" });
  }
  try {
    const userDocRef = db.collection("users").doc(uid);
    const userSnap = await userDocRef.get();
    if (userSnap.exists) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
      });
    }
    await userDocRef.set({
      email,
      name,
      createdAt: FieldValue.serverTimestamp(),
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default router;
