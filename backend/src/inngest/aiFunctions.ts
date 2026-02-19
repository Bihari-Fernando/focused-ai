import { inngest } from "./index";
import { GoogleGenAI } from "@google/genai";
import { logger } from "@/utils/logger";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const processChatMessage = inngest.createFunction(
    {
        id: "process-chat-message",
    },
    { event: "therapy/session.message" },
    async ({ event, step }) => {
        try {
            const {
                message,
                history,
                memory = {
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
                goals = [],
            } = event.data;

            logger.info("Processing chat message:", {
                message,
                historyLength: history?.length,
            });

            const analysis = await step.run("analyze-message", async () => {
                try {
                    const prompt = `Analyze this therapy message and provide insights. 
Return ONLY a valid JSON object with no markdown formatting or additional text.

Message: ${message}
Context: ${JSON.stringify({ memory, goals })}

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

                    const response = await ai.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: prompt,
                    });

                    const text = response.text?.trim() || "";

                    logger.info("Received analysis from Gemini:", { text });

                    const cleanText = text.replace(/```json|```/g, "").trim();
                    const parsedAnalysis = JSON.parse(cleanText || "{}");

                    logger.info("Successfully parsed analysis:", parsedAnalysis);

                    return parsedAnalysis;
                } catch (error) {
                    logger.error("Error in message analysis:", error);

                    // Fallback aligned with your system
                    return {
                        emotionalState: "calm",
                        stressLevel: "low",
                        focusLevel: "average",
                        confidenceLevel: "stable",
                        recommendedActivity: "breathing",
                        encouragementMessage:
                            "You're doing well. Let's take a short breathing session to reset and refocus.",
                    };
                }
            });

            return analysis;
        } catch (error) {
            logger.error("Outer function error:", error);
            throw error;
        }
    }
);
