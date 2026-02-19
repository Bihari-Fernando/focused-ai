import { inngest } from "./index";
import { GoogleGenAI } from "@google/genai";
import { logger } from "@/utils/logger";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'AIzaSyDIaNP8hRN6dTU28b9mi5nl_JAGvSaAHZ4'
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
                        emotionalState: [],
                        riskLevel: 0,
                        preferences: {},
                    },
                    sessionContext: {
                        conversationThemes: [],
                        currentTechnique: null,
                    },
                },
                goals = [],
                systemPrompt,
            } = event.data;

            logger.info("Processing chat message:", {
                message,
                historyLength: history?.length,
              });
        } catch (error) { }
    }
);