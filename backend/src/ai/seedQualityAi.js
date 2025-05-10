import {
  getModelInstance,
  generationConfig,
  safetySettings,
  seedToolConfig,
} from "../config/genAiConfig.js";

async function asessSeedQuality(imageContent) {
  const model = getModelInstance();
  const ModelConfig = generationConfig();

  const chat = model.startChat({
    ...ModelConfig,
    safetySettings,
    tools: [seedToolConfig],
  });

  const prompt = `You are an expert seed quality analyst specializing in identifying seed quality from images. You must analyze the provided image and use the 'predict_seed_quality' tool to provide your analysis in a language that a farmer can easily understand. DO NOT generate the JSON response directly. YOU MUST use the provided tool function.`;

  const parts = [{ text: prompt }, { inlineData: imageContent }];

  try {
    const result = await chat.sendMessage(parts);

    const response = result.response;

    if (response.candidates && response.candidates.length > 0) {
      const functionCall = response.functionCalls();
      if (functionCall && functionCall.length > 0) {
        if (functionCall[0]) {
          const functionName = functionCall[0].name;
          const argumentsData = functionCall[0].args;
          if (functionName === "predict_seed_quality") {
            return argumentsData;
          }
        }
      }
    } else {
      // Descriptive fallback
      return {
        qualityAssessment: "Unable to assess seed quality",
        recommendation: "Please provide a clearer image of the seeds.",
        details:
          "The image provided does not contain clear seed characteristics.",
      };
    }
  } catch (error) {
    console.error("Error in seed quality prediction:", error);
    return {
      error: "An error occurred while processing the image. Please try again.",
    };
  }
}

export { asessSeedQuality };
