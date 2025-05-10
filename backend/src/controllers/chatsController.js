import { getChat, listChats } from "../models/chatModel.js";

// Get chat by ID for a user
const getChatById = async (req, res) => {
  const userId = req.user.uid;
  const chatId = req.params.chatId;
  if (!chatId) {
    return res.status(400).json({
      success: false,
      message: "Chat ID is required",
    });
  }
  try {
    const response = await getChat(userId, chatId);
    if (response.success) {
      return res.status(200).json({
        success: true,
        message: "Chat retrieved successfully",
        data: response.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: response.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// List all chats for a user
const getAllChats = async (req, res) => {
  const userId = req.user.uid;
  try {
    const response = await listChats(userId);
    if (response.success) {
      return res.status(200).json({
        data: response.data,
      });
    } else {
      return res.status(200).json({
        message: response.message,
        data: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export { getAllChats, getChatById };
