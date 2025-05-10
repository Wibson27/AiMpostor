import {
  getAssessmentById,
  getAllAssessments,
  assessQuality,
} from "../controllers/seedQualityController.js";
import upload from "../config/multerConfig.js";
import {
  saveImage,
  multerErrorHandler,
} from "../middlewares/imageMiddleware.js";
import { Router } from "express";
import { verifyUser } from "../middlewares/userMiddleware.js";

const router = Router();

// Route to handle seed quality prediction
router.post(
  "/assess",
  verifyUser,
  upload.single("seedImage"),
  multerErrorHandler,
  saveImage,
  assessQuality
);

// Route to handle list of all seed quality predictions
router.get("/assessments", verifyUser, getAllAssessments);

// Route to handle get seed quality prediction by id
router.get("/assessments/:id", verifyUser, getAssessmentById);
export default router;
