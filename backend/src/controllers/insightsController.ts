import { Request, Response } from "express";
import { Types } from "mongoose";
import { GoogleGenAI } from "@google/genai";
import { Mood } from "../models/mood";
import { Activity } from "../models/Activity";
import { logger } from "../utils/logger";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getMoodInsights = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = new Types.ObjectId(req.user._id);

    // Fetch last 7 days of mood entries
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const [moods, activities] = await Promise.all([
      Mood.find({ userId, timestamp: { $gte: since } })
        .sort({ timestamp: -1 })
        .limit(20)
        .lean(),
      Activity.find({ userId, timestamp: { $gte: since } })
        .sort({ timestamp: -1 })
        .limit(20)
        .lean(),
    ]);

    if (moods.length === 0 && activities.length === 0) {
      return res.json({
        insight:
          "No recent mood or activity data found. Start logging your mood and activities so I can give you personalized insights!",
        summary: null,
      });
    }

    // Build a readable summary for the prompt
    const moodSummary = moods.map((m) => ({
      score: m.score,
      note: m.note ?? null,
      date: new Date(m.timestamp).toLocaleDateString(),
    }));

    const activitySummary = activities.map((a) => ({
      type: a.type,
      name: a.name,
      description: a.description ?? null,
      duration: a.duration ?? null,
      date: new Date(a.timestamp).toLocaleDateString(),
    }));

    const avgMoodScore =
      moods.length > 0
        ? (moods.reduce((sum, m) => sum + m.score, 0) / moods.length).toFixed(1)
        : null;

    const prompt = `
You are Focused-AI, a student wellness assistant.

Analyze the student's mood and activity data from the past 7 days and provide a 
personalized, practical wellness insight.

Mood entries (${moods.length} total, avg score: ${avgMoodScore}/10):
${JSON.stringify(moodSummary, null, 2)}

Activity entries (${activities.length} total):
${JSON.stringify(activitySummary, null, 2)}

Rules:
1. Identify genuine patterns — don't invent trends that aren't in the data.
2. Be specific: reference actual scores, activity types, or notes when relevant.
3. Keep tone warm, non-clinical, and student-friendly.
4. Give 1–2 concrete, actionable suggestions based on what you see.
5. Keep the response under 150 words.
6. If data is sparse (< 3 entries), acknowledge that and encourage more logging.

Respond with ONLY valid JSON:
{
  "insight": "your personalized insight text",
  "trend": "improving | stable | declining | insufficient_data",
  "topSuggestion": "single most important suggestion",
  "moodAverage": ${avgMoodScore ?? null},
  "dataPoints": ${moods.length}
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = result.text?.trim() ?? "";
    const cleanText = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanText);

    logger.info(`Mood insights generated for user ${userId}`);

    res.json({
      ...parsed,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error generating mood insights:", error);
    res.status(500).json({
      message: "Error generating insights",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};