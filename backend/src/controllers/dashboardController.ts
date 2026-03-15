import { Request, Response } from "express";
import { Types } from "mongoose";
import { Mood } from "../models/mood";
import { ChatSession } from "../models/ChatSession";
import { Activity } from "../models/Activity";
import { logger } from "../utils/logger";

const STRESS_LEVEL_PERCENT: Record<string, number> = {
  low: 25,
  moderate: 65,
  high: 85,
};

const STRESS_DESCRIPTION: Record<string, string> = {
  low: "You're feeling calm today",
  moderate: "AI detected exam stress",
  high: "AI detected high stress",
};

const mapMoodToEmotion = (score: number) => {
  if (score <= 20) return "Overwhelmed";
  if (score <= 40) return "Anxious";
  if (score <= 60) return "Calm";
  if (score <= 80) return "Relaxed";
  return "Confident";
};

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.user._id);

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Latest mood entry
    const latestMood = await Mood.findOne({ userId })
      .sort({ timestamp: -1 })
      .lean()
      .exec();

    const moodScore = latestMood?.score ?? null;

    // Determine emotional state from mood score
    const emotionalState =
      moodScore !== null ? mapMoodToEmotion(moodScore) : "Neutral";

    // Find the most recent message analysis for today
    const recentMessageAnalysis = await ChatSession.aggregate([
      { $match: { userId } },
      { $unwind: "$messages" },
      {
        $match: {
          "messages.timestamp": { $gte: startOfDay, $lt: endOfDay },
        },
      },
      { $sort: { "messages.timestamp": -1 } },
      {
        $limit: 1,
      },
      {
        $project: {
          analysis: "$messages.metadata.analysis",
        },
      },
    ]).exec();

    const analysis = recentMessageAnalysis?.[0]?.analysis;

    const stressLevelLabel =
      analysis?.stressLevel ||
      (moodScore !== null
        ? moodScore < 40
          ? "high"
          : moodScore < 70
          ? "moderate"
          : "low"
        : "moderate");

    const stressLevelPercent =
      STRESS_LEVEL_PERCENT[stressLevelLabel] ?? STRESS_LEVEL_PERCENT.moderate;
    const stressDescription =
      STRESS_DESCRIPTION[stressLevelLabel] ??
      STRESS_DESCRIPTION.moderate;

    // AI Check-ins: number of assistant messages today
    const aiCheckInsResult = await ChatSession.aggregate([
      { $match: { userId } },
      { $unwind: "$messages" },
      {
        $match: {
          "messages.role": "assistant",
          "messages.timestamp": { $gte: startOfDay, $lt: endOfDay },
        },
      },
      { $count: "count" },
    ]).exec();

    const aiCheckIns = aiCheckInsResult?.[0]?.count ?? 0;

    // Focus sessions: activities of type focus-training today
    const focusSessions = await Activity.countDocuments({
      userId,
      type: "focus-training",
      timestamp: { $gte: startOfDay, $lt: endOfDay },
    });

    // Study sessions completed: chat sessions marked completed today
    const studySessionsCompleted = await ChatSession.countDocuments({
      userId,
      status: "completed",
      updatedAt: { $gte: startOfDay, $lt: endOfDay },
    });

    res.json({
      stressLevelPercent,
      stressLevelLabel,
      stressDescription,
      moodScore,
      emotionalState,
      aiCheckIns,
      focusSessions,
      studySessionsCompleted,
      lastUpdated: new Date(),
    });
  } catch (error) {
    logger.error("Error fetching dashboard overview:", error);
    res.status(500).json({
      message: "Error fetching dashboard overview",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
