// Define the JSON Schema for the structured response
const diseaseSchema = {
  type: "object",
  properties: {
    diseaseName: {
      type: "string",
      description:
        "The name of the plant disease (e.g., Late Blight, Powdery Mildew).",
    },
    confidenceLevel: {
      type: "number",
      description:
        "A number between 0 and 1 representing the confidence level of the disease prediction (e.g., 0.85 for 85% confidence).",
    },
    symptomsObserved: {
      type: "string",
      description: "Description of the symptoms observed in the image.",
    },
    mitigationSteps: {
      type: "string",
      description:
        "Easy-to-understand steps farmers can take to mitigate the disease (e.g., 'Apply fungicide, remove affected leaves'). Write in a simple and direct way",
    },
    recommendations: {
      type: "string",
      description:
        "Specific recommendations for treatment or prevention (e.g., 'Use copper-based fungicide every 7 days, ensure proper ventilation'). Write in a simple and direct way",
    },
  },
  required: [
    "diseaseName",
    "confidenceLevel",
    "mitigationSteps",
    "recommendations",
    "symptomsObserved",
  ],
};

export default diseaseSchema;
