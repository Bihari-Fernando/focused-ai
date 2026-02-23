import express from "express";
import { auth } from "../middleware/auth";
import {
  createChatSession,
  sendMessage,
  getSessionHistory,
  getChatSession,
  getChatHistory,
} from "../controllers/chat";

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Create a new chat session
router.post("/sessions", createChatSession);

// Get a specific chat session
router.get("/sessions/:sessionId", getChatSession);

// Send a message in a chat session
router.post("/sessions/:sessionId/messages", sendMessage);

// Get chat history for a session
router.get("/sessions/:sessionId/history", getChatHistory);

export default router;