import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";
import { inngest } from "../inngest/index";
import { User } from "../models/User";
import { Types } from "mongoose";
import { GoogleGenAI } from "@google/genai";
import {  InngestEvent, InngestSessionResponse } from "../types/inngest";
import { ChatSession, IChatSession } from "../models/ChatSession";
import { Mood } from "../models/mood";       
import { Activity } from "../models/Activity"; 
import dotenv from "dotenv";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

// Create a new chat session
export const createChatSession = async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        return res
          .status(401)
          .json({ message: "Unauthorized - User not authenticated" });
      }
  
      const userId = new Types.ObjectId(req.user.id);
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate a unique sessionId
      const sessionId = uuidv4();
  
      const session = new ChatSession({
        sessionId,
        userId,
        startTime: new Date(),
        status: "active",
        messages: [],
      });
  
      await session.save();
  
      res.status(201).json({
        message: "Chat session created successfully",
        sessionId: session.sessionId,
      });
    } catch (error) {
      logger.error("Error creating chat session:", error);
      res.status(500).json({
        message: "Error creating chat session",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

// Get all chat sessions for the authenticated user
export const getAllChatSessions = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User not authenticated" });
    }

    const userId = new Types.ObjectId(req.user.id);

    const sessions = await ChatSession.find({ userId })
      .sort({ updatedAt: -1 })
      .exec();

    logger.info(`Found ${sessions.length} chat sessions for user ${userId}`);

    res.json(sessions);
  } catch (error) {
    logger.error("Error fetching chat sessions:", error);
    res.status(500).json({
      message: "Error fetching chat sessions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    const userId = new Types.ObjectId(req.user._id);

    if (!message || message.trim().length < 3) {
      return res.json({
        response: "I'm here to support you. Could you share more about what you are feeling or what kind of support you need?",
        analysis: {
          intent: "unclear",
          emotionalState: "unknown",
          stressLevel: "low",
          focusLevel: "average",
          confidenceLevel: "stable",
          recommendedActivity: "mindfulness",
        },
      });
    }

    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ STEP 1: Fetch user's recent mood & activity data
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const [recentMoods, recentActivities] = await Promise.all([
      Mood.find({ userId, timestamp: { $gte: since } })
        .sort({ timestamp: -1 })
        .limit(5)
        .lean(),
      Activity.find({ userId, timestamp: { $gte: since } })
        .sort({ timestamp: -1 })
        .limit(5)
        .lean(),
    ]);

    // ✅ STEP 2: Build a readable user context from that data
    const avgMoodScore =
      recentMoods.length > 0
        ? (recentMoods.reduce((sum, m) => sum + m.score, 0) / recentMoods.length).toFixed(1)
        : null;

    const moodContext =
      recentMoods.length > 0
        ? recentMoods
            .map((m) => `- Score: ${m.score}/100, Note: "${m.note ?? "none"}", Date: ${new Date(m.timestamp).toLocaleDateString()}`)
            .join("\n")
        : "No mood data logged this week.";

    const activityContext =
      recentActivities.length > 0
        ? recentActivities
            .map((a) => `- ${a.name} (${a.type}), Duration: ${a.duration ?? "?"}min, Date: ${new Date(a.timestamp).toLocaleDateString()}`)
            .join("\n")
        : "No activities logged this week.";

    // ✅ STEP 3: Analysis prompt now includes user context
    const analysisPrompt = `
You are analyzing messages for Focused-AI, a student wellness assistant.

Here is what you know about this student from their tracked data this week:
- Average mood score: ${avgMoodScore ?? "unknown"}/100
- Recent moods:
${moodContext}
- Recent activities:
${activityContext}

Now analyze their current message with this context in mind.

Student message:
"""
${message}
"""

Return ONLY valid JSON:
{
  "intent": "stress | motivation | productivity | focus | work-life-balance | unclear",
  "emotionalState": "string",
  "stressLevel": "low | moderate | high",
  "focusLevel": "low | average | high",
  "confidenceLevel": "low | stable | high",
  "recommendedActivity": "breathing | focus-game | confidence-builder | stress-reset | mindfulness",
  "encouragementMessage": "string"
}
`;

    const analysisResult = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: analysisPrompt,
    });

    const analysisText = analysisResult.text?.trim() ?? "";
    const analysis = JSON.parse(analysisText.replace(/```json|```/g, "").trim());

    // ✅ STEP 4: Response prompt is fully personalized
    const responsePrompt = `
You are Focused-AI, a student wellness assistant.

You know the following about this student from their tracked data this week:
- Average mood score: ${avgMoodScore ?? "unknown"}/100
- Recent moods:
${moodContext}
- Recent activities:
${activityContext}

Use this context to give a personalized, relevant response. For example:
- If their mood has been dropping, acknowledge it.
- If they've been doing breathing exercises, reference that progress.
- If they haven't logged any activities, gently suggest one.

Student's current message:
"""
${message}
"""

Analysis of their message:
${JSON.stringify(analysis)}

Rules:
1. The student's MESSAGE is the primary signal. Mood data is only background context.
2. Only reference mood scores if it's genuinely relevant to what they said.
3. Don't be generic. A student with score 30/100 needs different support than one at 80/100.
4. Keep tone warm, practical, and student-friendly.
5. No clinical or therapy language.
6. Keep response under 120 words.
7. If intent is "unclear" (gibberish, random letters, very short meaningless text):
   ONLY ask ONE simple clarifying question like "Hey, are you okay? What's on your mind?"
   Do NOT reference mood scores or activities for unclear messages.
   Do NOT assume they are struggling.
`;

    const responseResult = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: responsePrompt,
    });

    const response = responseResult.text?.trim() ?? "";

    // Save messages
    session.messages.push({ role: "user", content: message, timestamp: new Date() });
    session.messages.push({
      role: "assistant",
      content: response,
      timestamp: new Date(),
      metadata: {
        analysis,
        wellnessProgress: {
          stressLevel: analysis.stressLevel,
          focusLevel: analysis.focusLevel,
          confidenceLevel: analysis.confidenceLevel,
        },
      },
    });

    await session.save();

    res.json({
      response,
      analysis,
      metadata: {
        wellnessProgress: {
          stressLevel: analysis.stressLevel,
          focusLevel: analysis.focusLevel,
          confidenceLevel: analysis.confidenceLevel,
        },
        moodContext: {
          avgMoodScore: avgMoodScore ? parseFloat(avgMoodScore) : null,
          dataPoints: recentMoods.length,
        },
      },
    });
  } catch (error) {
    logger.error("Error in sendMessage:", error);
    res.status(500).json({
      message: "Error processing message",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

  

  // Get chat session history
export const getSessionHistory = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const userId = new Types.ObjectId(req.user.id);
  
      const session = (await ChatSession.findById(
        sessionId
      ).exec()) as IChatSession;
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
  
      if (session.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      res.json({
        messages: session.messages,
        startTime: session.startTime,
        status: session.status,
      });
    } catch (error) {
      logger.error("Error fetching session history:", error);
      res.status(500).json({ message: "Error fetching session history" });
    }
  };

  export const getChatSession = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      logger.info(`Getting chat session: ${sessionId}`);
      const chatSession = await ChatSession.findOne({ sessionId });
      if (!chatSession) {
        logger.warn(`Chat session not found: ${sessionId}`);
        return res.status(404).json({ error: "Chat session not found" });
      }
      logger.info(`Found chat session: ${sessionId}`);
      res.json(chatSession);
    } catch (error) {
      logger.error("Failed to get chat session:", error);
      res.status(500).json({ error: "Failed to get chat session" });
    }
  };

  export const getChatHistory = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const userId = new Types.ObjectId(req.user.id);
  
      // Find session by sessionId instead of _id
      const session = await ChatSession.findOne({ sessionId });
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
  
      if (session.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      res.json(session.messages);
    } catch (error) {
      logger.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Error fetching chat history" });
    }
  };

  // Delete a chat session
export const deleteChatSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = new Types.ObjectId(req.user.id);

    // Find and delete the session
    const session = await ChatSession.findOneAndDelete({ 
      sessionId, 
      userId 
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    logger.info(`Chat session deleted: ${sessionId} by user ${userId}`);
    res.json({ message: "Chat session deleted successfully" });
  } catch (error) {
    logger.error("Error deleting chat session:", error);
    res.status(500).json({
      message: "Error deleting chat session",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};