import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";
import { inngest } from "../inngest/index";
import { User } from "@/models/User";
import { Types } from "mongoose";
import { GoogleGenAI } from "@google/genai";
//import { InngestSesionResponse, InngestEvent } from "../types/inngest";
import { ChatSession, IChatSession } from "../models/chat";


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

 // Send a message in the chat session
export const sendMessage = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const { message } = req.body;
      const userId = new Types.ObjectId(req.user.id);
  
      logger.info("Processing wellness message:", { sessionId, message });
  
      // Find session
      const session = await ChatSession.findOne({ sessionId });
      if (!session) {
        logger.warn("Session not found:", { sessionId });
        return res.status(404).json({ message: "Session not found" });
      }
  
      if (session.userId.toString() !== userId.toString()) {
        logger.warn("Unauthorized access attempt:", { sessionId, userId });
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      // Create Inngest event
      const event: InngestEvent = {
        name: "therapy/session.message", 
        data: {
          message,
          history: session.messages,
          memory: {
            userProfile: {
              stressLevel: "moderate",
              focusLevel: "average",
              confidenceLevel: "stable",
              preferences: {},
            },
            sessionContext: {
              recentActivities: [],
              currentActivity: null,
            },
          },
          goals: [],
        },
      };
  
      logger.info("Sending wellness event to Inngest:", { event });
  
      await inngest.send(event);
  
      const analysisPrompt = `
  Analyze this student wellness message and return ONLY valid JSON.
  
  Message: ${message}
  
  Required JSON structure:
  {
    "emotionalState": "string",
    "stressLevel": "low | moderate | high",
    "focusLevel": "low | average | high",
    "confidenceLevel": "low | stable | high",
    "recommendedActivity": "breathing | focus-game | confidence-builder | stress-reset | mindfulness",
    "encouragementMessage": "string"
  }
  `;
  
      const analysisResult = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: analysisPrompt,
      });
      const analysisText = analysisResult.text?.trim() || "";
      const cleanAnalysisText = analysisText.replace(/```json|```/g, "").trim();
      const analysis = JSON.parse(cleanAnalysisText);
  
      logger.info("Wellness analysis:", analysis);
  
     
      //  Generate Wellness Response
      
      const responsePrompt = `
  You are an AI Wellness Coach for students.
  
  Based on the message and analysis below, generate a supportive and motivating response.
  
  Message: ${message}
  Analysis: ${JSON.stringify(analysis)}
  
  Guidelines:
  1. Acknowledge emotional state
  2. Suggest a helpful activity (breathing, focus-game, confidence-builder, stress-reset, mindfulness)
  3. Encourage positive action
  4. Keep tone calm, supportive, and practical
  5. Do NOT use therapy or clinical language
  `;
  
      const responseResult = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: responsePrompt,
      });
      const response = responseResult.text?.trim() || "";
  
      logger.info("Generated wellness response:", response);
  
      // Save to Session
      
      session.messages.push({
        role: "user",
        content: message,
        timestamp: new Date(),
      });
  
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
      logger.info("Session updated successfully:", { sessionId });
  
      // Return Response
      
      res.json({
        response,
        analysis,
        metadata: {
          wellnessProgress: {
            stressLevel: analysis.stressLevel,
            focusLevel: analysis.focusLevel,
            confidenceLevel: analysis.confidenceLevel,
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