import { checkCollectionExists, checkDocExists } from "../helpers/firestore.js";
import { db } from "../config/firebaseConfig.js";
import { FieldValue } from "firebase-admin/firestore";
const MAX_CHAT_HISTORY = 10; // max chat history to keep
const usersRef = db.collection("users");

const createNewChat = async (userRef) => {
  try {
    const chatRef = userRef.collection("chats").doc();
    await chatRef.set({
      createdAt: FieldValue.serverTimestamp(),
      title: "first chat",
    });
    console.log("Chat created with ID:", chatRef.id);
    return { success: true, chatRef: chatRef };
  } catch (error) {
    console.error("Error New creating chat:", error);
    return { success: false, message: error.message };
  }
};

const saveMsg = async (chatRef, messages) => {
  try {
    for (const message of messages) {
      const messageRef = chatRef.collection("messages").doc();
      await messageRef.set({
        ...message,
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log("Message added with ID:", messageRef.id);
    }
    return { success: true };
  } catch (error) {
    console.error("Error saving message:", error);
    return { success: false, message: error.message };
  }
};

const addMsgToChat = async (userId, chatId, messages) => {
  try {
    // check if userId exists
    const userRef = usersRef.doc(userId);
    await checkDocExists(userRef, "User does not exist");

    // check if chatId exists
    const chatRef = userRef.collection("chats").doc(chatId);
    await checkDocExists(chatRef, "Chat does not exist");

    const saveMsgResult = await saveMsg(chatRef, messages);
    if (!saveMsgResult.success) {
      throw new Error(saveMsgResult.message);
    }
    return { success: true };
  } catch (error) {
    console.error("Error adding message:", error.message);
    return { success: false, message: error.message };
  }
};

const addMsgToNewChat = async (userId, messages) => {
  try {
    // check if userId exists
    const userRef = usersRef.doc(userId);
    await checkDocExists(userRef, "User does not exist");

    // create new chat
    const newChatResult = await createNewChat(userRef);
    if (!newChatResult.success) {
      throw new Error(newChatResult.message);
    }
    // save messages
    const saveMsgResult = await saveMsg(newChatResult.chatRef, messages);
    if (!saveMsgResult.success) {
      throw new Error(saveMsgResult.message);
    }
    return { success: true, chatId: newChatResult.chatRef.id };
  } catch (error) {
    console.error("Error creating chat:", error);
    return { success: false, message: error.message };
  }
};

const listChats = async (userId) => {
  try {
    // check if userId exists
    const userRef = usersRef.doc(userId);
    await checkDocExists(userRef, "User does not exist");

    // get all chats
    const chatsRef = userRef.collection("chats");
    const chatSnap = await chatsRef.get();
    if (chatSnap.empty) {
      return { success: false, message: "No chats found" };
    }
    const chats = [];
    chatSnap.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: chats };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// get chat by id for a user
const getChat = async (userId, chatId) => {
  try {
    // check if userId exists
    const userRef = usersRef.doc(userId);
    await checkDocExists(userRef, "User does not exist");

    // check if chatId exists and get chat
    const chatRef = userRef.collection("chats").doc(chatId);
    await checkDocExists(chatRef, "Chat Not Found");

    const messagesRef = chatRef.collection("messages");
    const messagesSnap = await messagesRef.orderBy("createdAt", "desc").get();
    if (messagesSnap.empty) {
      console.log("No messages found");
      return { success: false, message: "No messages found" };
    }

    const messages = [];
    messagesSnap.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: messages };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// clone chat history for the LLM
const cloneChatHistory = async (userId, chatId) => {
  try {
    // check if userId exists
    const userRef = usersRef.doc(userId);
    await checkDocExists(userRef, "User does not exist");

    // check if chatId exists and get chat
    const chatRef = userRef.collection("chats").doc(chatId);
    await checkDocExists(chatRef, "Chat Not Found");

    const messagesRef = chatRef.collection("messages");
    const messagesSnap = await messagesRef
      .orderBy("createdAt", "asc")
      .limit(MAX_CHAT_HISTORY)
      .get();
    if (messagesSnap.empty) {
      console.log("No messages found");
      return { success: false, message: "No messages found" };
    }

    if (messagesSnap.empty) {
      console.log("No messages found");
      return { success: false, message: "No messages found" };
    }
    const messages = [];
    messagesSnap.forEach((doc) => {
      messages.push({
        role: doc.get("sender"),
        parts: [
          {
            text: `${doc.get("content")}`,
          },
        ],
      });
    });
    // get all messages
    return { success: true, data: messages };
  } catch (error) {
    console.error("Error getting chat:", error);
    return { success: false, error: error.message };
  }
};

export { cloneChatHistory, getChat, addMsgToChat, addMsgToNewChat, listChats };
