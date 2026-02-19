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


            // Update memory based on wellness analysis
            const updatedMemory = await step.run("update-memory", async () => {
                if (analysis.emotionalState) {
                    memory.userProfile.emotionalHistory =
                        memory.userProfile.emotionalHistory || [];
                    memory.userProfile.emotionalHistory.push(analysis.emotionalState);
                }

                if (analysis.stressLevel) {
                    memory.userProfile.stressLevel = analysis.stressLevel;
                }

                if (analysis.focusLevel) {
                    memory.userProfile.focusLevel = analysis.focusLevel;
                }

                if (analysis.confidenceLevel) {
                    memory.userProfile.confidenceLevel = analysis.confidenceLevel;
                }

                if (analysis.recommendedActivity) {
                    memory.sessionContext.recommendedActivities =
                        memory.sessionContext.recommendedActivities || [];
                    memory.sessionContext.recommendedActivities.push(
                        analysis.recommendedActivity
                    );
                }

                return memory;
            });

            // If high stress detected, trigger calming support log
            if (analysis.stressLevel === "high") {
                await step.run("trigger-stress-support", async () => {
                    logger.warn("High stress level detected in wellness session", {
                        message,
                        stressLevel: analysis.stressLevel,
                    });
                });
            }

            // Generate wellness coaching response
            const response = await step.run("generate-response", async () => {
                try {
                  const prompt = `
              You are an AI Wellness Coach focused on stress relief, focus improvement, and confidence building.
              
              Based on the following context, generate a supportive and motivational response.
              
              Message: ${message}
              Analysis: ${JSON.stringify(analysis)}
              Memory: ${JSON.stringify(memory)}
              Goals: ${JSON.stringify(goals)}
              
              Provide a response that:
              1. Acknowledges the user's emotional state
              2. Offers practical guidance for stress, focus, or confidence
              3. Suggests an appropriate activity (breathing, focus-game, confidence-builder, stress-reset, mindfulness)
              4. Encourages positive action
              5. Maintains a calm, supportive tone
              
              Do NOT mention therapy or clinical terms.
              Keep it clear, encouraging, and actionable.
              `;
              
                  const geminiResponse = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: prompt,
                  });
              
                  const responseText = geminiResponse.text?.trim() || "";
              
                  logger.info("Generated wellness response:", { responseText });
              
                  return responseText;
              
                } catch (error) {
                  logger.error("Error generating wellness response:", error);
              
                  return "You're doing your best, and that matters. Let’s take a short breathing session to reset your mind and improve focus.";
                }
              });
              










        } catch (error) {
            logger.error("Outer function error:", error);
            throw error;
        }
    });
