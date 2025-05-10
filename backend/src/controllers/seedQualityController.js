import { asessSeedQuality } from "../ai/seedQualityAi.js";
import {
  saveQualityAssessment,
  listQualityAssessments,
  getQualityAssessment,
} from "../models/seedQualityModel.js";

const assessQuality = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Please upload an image file.",
      });
    }
    const imageBase64 = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype; // Check the actual MIME type
    const imageContent = {
      mimeType: mimeType,
      data: imageBase64,
    };

    const response = await asessSeedQuality(imageContent);
    if (response.error) {
      return res.status(500).json({ error: response.error });
    }

    //TODO: save the assessment to database
    const savedResult = await saveQualityAssessment(
      req.user.uid,
      response,
      req.file.publicUrl
    );
    if (!savedResult.success) {
      return res.status(500).json({ error: savedResult.message });
    }
    // development only
    console.log(response); //
    res.send(response); //
  } catch (error) {
    console.error("Error in seed quality assessment:", error);
    return res.status(500).json({
      error: "An error occurred while processing the image. Please try again.",
    });
  }
};

const getAllAssessments = async (req, res) => {
  const userId = req.user.uid;
  try {
    const assessments = await listQualityAssessments(userId);
    if (!assessments) {
      return res.status(200).json({
        data: [],
        message: "No assessments found.",
      });
    }
    res.status(200).json({
      data: assessments,
    });
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return res.status(500).json({
      error: "An error occurred while fetching assessments. Please try again.",
    });
  }
};

const getAssessmentById = async (req, res) => {
  const assessmentId = req.params.id;
  const userId = req.user.uid;
  if (!assessmentId) {
    return res.status(400).json({
      error: "Assessment ID is required.",
    });
  }
  try {
    const assessment = await getQualityAssessment(userId, assessmentId);
    if (!assessment) {
      return res.status(404).json({
        error: "Assessment not found.",
      });
    }
    res.status(200).json({
      data: assessment,
    });
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return res.status(500).json({
      error:
        "An error occurred while fetching the assessment. Please try again.",
    });
  }
};

export { assessQuality, getAllAssessments, getAssessmentById };
