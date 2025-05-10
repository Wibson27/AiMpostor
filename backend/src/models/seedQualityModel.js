import { db } from "../config/firebaseConfig.js";
import { FieldValue } from "firebase-admin/firestore";
import { checkDocExists } from "../helpers/firestore.js";

const usersRef = db.collection("users");

const saveQualityAssessment = async (userId, assessment, seedImageUrl) => {
  try {
    const assessmentRef = usersRef
      .doc(userId)
      .collection("qualityAssessments")
      .doc();
    await assessmentRef.set({
      seedImageUrl: seedImageUrl,
      recommendation: assessment.recommendation,
      qualityAssessment: assessment.qualityAssessment,
      details: assessment.details,
      createdAt: FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error New creating qualityAssessment:", error);
    return { success: false, message: error.message };
  }
};

const listQualityAssessments = async (userId) => {
  try {
    const assessmentsRef = usersRef
      .doc(userId)
      .collection("qualityAssessments");
    const snapshot = await assessmentsRef.get();
    const assessments = [];
    snapshot.forEach((doc) => {
      assessments.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, assessments };
  } catch (error) {
    console.error("Error listing quality assessments:", error);
    return { success: false, message: error.message };
  }
};

const getQualityAssessment = async (userId, assessmentId) => {
  try {
    const assessmentRef = usersRef
      .doc(userId)
      .collection("qualityAssessments")
      .doc(assessmentId);
    // check if assessmentId exists
    const assessmentSnap = await checkDocExists(
      assessmentRef,
      "Quality assessment does not exist"
    );
    const assessment = {
      ...assessmentSnap.data(),
    };
    return { success: true, assessment };
  } catch (error) {
    console.error("Error fetching quality assessment:", error);
    return { success: false, message: error.message };
  }
};

export { saveQualityAssessment, listQualityAssessments, getQualityAssessment };
