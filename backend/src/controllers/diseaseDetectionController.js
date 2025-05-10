import {
  generateDiseasePrediction,
  generateContentResponse,
} from "../ai/diseaseDetectionAi.js";
import {
  addMsgToNewChat,
  cloneChatHistory,
  addMsgToChat,
} from "../models/chatModel.js";

export const predictDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image file." });
    }

    // const conversationId =
    //   req.body.conversationId || Math.random().toString(36).substring(2, 15); // Generate a unique ID if not provided    const conversationId =
    // req.body.conversationId || Math.random().toString(36).substring(2, 15); // Generate a unique ID if not provided

    // Get previous messages from chat history
    // const previousMessages = chatHistory[conversationId] || [];

    // Convert the image buffer to a base64 string
    const imageBase64 = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype; // Check the actual MIME type

    const imageContent = {
      mimeType: mimeType,
      data: imageBase64,
    };

    const response = await generateDiseasePrediction(imageContent);

    if (response.error) {
      return res.status(500).json({ error: response.error });
    } else if (response.message) {
      return res.status(200).json({ message: response.message });
    }

    // Don't store the full image in chat history as it causes issues with the Gemini API
    // Instead, store a text reference to the uploaded image
    const messages = [
      {
        sender: "user",
        content: "I uploaded a plant image for disease analysis.",
      },
      {
        sender: "model",
        content: JSON.stringify(response),
        publicUrl: req.file.publicUrl,
      },
    ];

    const result = await addMsgToNewChat(req.user.uid, messages);
    if (!result.success) {
      throw new Error(result.message);
    }
    // Store the conversation ID in the request body
    // chatHistory[conversationId].push({
    //   role: "user",
    //   parts: [
    //     {
    //       text: "I uploaded a plant image for disease analysis.",
    //     },
    //   ],
    // });

    // Store model's message
    // chatHistory[conversationId].push({
    //   role: "model",
    //   parts: result.error
    //     ? [{ text: result.error }]
    //     : [{ text: JSON.stringify(result) }],
    // });

    res.json({ response, chatId: result.chatId });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process image." });
  }
};

export const chatWithModel = async (req, res) => {
  const { chatId, message } = req.body;

  if (!chatId || !message) {
    return res
      .status(400)
      .json({ error: "Conversation ID and message are required." });
  }

  try {
    // Get previous messages from chat history
    const result = await cloneChatHistory(req.user.uid, chatId);
    if (!result.success) {
      if (result.error) {
        return res.status(500).json({
          error: "Internal server error",
        });
      } else if (result.message) {
        return res.status(404).json({
          error: "Conversation ID not found or no previous messages.",
        });
      }
    }
    const clonedMessages = result.data;

    const responseText = await generateContentResponse(clonedMessages, message);
    if (responseText.error) {
      return res.status(500).json({ error: responseText.error });
    }
    const messages = [
      {
        sender: "user",
        content: message,
      },
      {
        sender: "model",
        content: responseText,
      },
    ];

    // Append only the new messages to the chat history
    const response = await addMsgToChat(req.user.uid, chatId, messages);
    if (!response.success) {
      throw new Error(response.message);
    }
    // if (!chatHistory[conversationId]) {
    //   chatHistory[conversationId] = [];
    // }
    // chatHistory[conversationId].push({
    //   role: "user",
    //   parts: [{ text: message }],
    // });
    // chatHistory[conversationId].push({
    //   role: "model",
    //   parts: [{ text: responseText }],
    // });

    // console.log(JSON.stringify(chatHistory, null, 4));
    res.json({ response: responseText });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
};
