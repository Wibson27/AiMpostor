// This schema defines the structure of the seed quality assessment response.
const qualitySchema = {
  type: "object",
  properties: {
    qualityAssessment: {
      type: "string",
      description:
        "The quality assessment of the seed (e.g., High Quality, Medium Quality, Low Quality).",
    },
    recommendation: {
      type: "string",
      description:
        "The recommendation based on the quality assessment (e.g., 'Recommended for sowing', 'Consider testing germination', 'Not recommended for sowing').",
    },
    details: {
      type: "string",
      description:
        "Additional details or explanation about the quality assessment and recommendation.",
    },
  },
  required: ["qualityAssessment", "recommendation", "details"],
};

export default qualitySchema;
