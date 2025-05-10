import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "./envConfig.js";
import diseaseSchema from "../schemas/detectionResponseSchema.js";
import seedSchema from "../schemas/seedQualityResponseSchema.js";
/**
 * Instance of Google Generative AI initialized with API key
 * @type {GoogleGenerativeAI}
 */
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Creates and returns a model instance of Google's Generative AI
 * @param {Object} options - Configuration options
 * @param {string} [options.systemInstruction] - System instruction to guide model behavior
 * @returns {GenerativeModel} Configured Gemini 2.0 Flash model instance
 */
/**
 * Creates and returns an instance of a generative AI model with the specified configuration.
 *
 * @param {string|null} [systemInstruction=null] - Optional system instruction to guide the model's behavior.
 * @returns {Object} - An instance of the generative AI model.
 */
const getModelInstance = (systemInstruction = null) => {
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction,
  });
};

/**
 * Definition of the structured function for plant disease prediction
 * @type {Object}
 * @property {string} name - Function name to be called by the model
 * @property {string} description - Description of what the function does
 * @property {Object} parameters - JSON schema defining function parameters
 */
const diseasePredStructureFun = {
  name: "predict_plant_disease",
  description:
    "Predicts plant diseases from an image and provides mitigation steps.",
  parameters: diseaseSchema,
};

const seedStructureFun = {
  name: "predict_seed_quality",
  description:
    "Predicts seed quality from an image and provides recommendations.",
  parameters: seedSchema,
};

/**
 * Configuration for tool calling with structured function
 * @type {Object}
 * @property {Array} functionDeclarations - List of available functions for the model
 */
const disToolConfig = {
  functionDeclarations: [diseasePredStructureFun],
};

const seedToolConfig = {
  functionDeclarations: [seedStructureFun],
};

/**
 * Factory function that creates generation configuration settings
 * @param {number} [temperature=0.4] - Controls randomness in output (lower is more deterministic)
 * @param {number} [maxOutputTokens=2048] - Maximum length of model response
 * @returns {Object} Generation configuration object
 */
const generationConfig = (temperature = 0.4, maxOutputTokens = 2048) => {
  return {
    temperature: temperature, // More deterministic
    maxOutputTokens: maxOutputTokens, // or as needed
  };
};

/**
 * Safety settings to prevent harmful content in model responses
 * @type {Array<Object>}
 */
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
];

/**
 * System instruction for the agricultural chatbot
 * Defines behavior, tone, style and capabilities of the chatbot assistant
 * @type {string}
 */
const chatbotSysInstruction = `You are an expert agricultural assistant designed to help farmers with plant diseases and other farming-related questions. Your primary goal is to provide clear, helpful, and friendly advice in simple language that farmers can easily understand.

      Specifically:

      *   Always use clear, simple language. Avoid technical jargon or explain it clearly if necessary.
      *   Be friendly and encouraging.
      *   If you don't know the answer, say so. But try to suggest other resources that might be helpful.
      *   Provide practical advice that farmers can easily implement.
      *   When discussing treatments or products, mention both organic and conventional options if possible.
      *   Ask clarifying questions if needed to better understand the farmer's problem.
      *   Always prioritize safety and environmental sustainability.
      *   Use metric units whenever possible.
      *   Use positive and encouraging language!
      *   Assume the farmer is new to the technology.

      When the farmer provides you with a picture of a plant, use the predict_plant_disease tool, and then tell the farmer your findings using easy-to-understand language.
      `;

export {
  getModelInstance,
  disToolConfig,
  seedToolConfig,
  generationConfig,
  safetySettings,
  chatbotSysInstruction,
};
