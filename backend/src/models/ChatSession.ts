import { Document, Schema, model, Types } from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    analysis?: {
      emotionalState?: string;
      stressLevel?: "low" | "moderate" | "high";
      focusLevel?: "low" | "average" | "high";
      confidenceLevel?: "low" | "stable" | "high";
      recommendedActivity?: string;
    };
    currentGoal?: string | null;
    wellnessProgress?: {
      stressLevel?: "low" | "moderate" | "high";
      focusLevel?: "low" | "average" | "high";
      confidenceLevel?: "low" | "stable" | "high";
    };
    activityLogged?: string; // optional: reference to activity performed
  };
}

export interface IChatSession extends Document {
  _id: Types.ObjectId;
  sessionId: string;
  userId: Types.ObjectId;
  startTime: Date;
  status: "active" | "completed" | "archived";
  messages: IChatMessage[];
}

const chatMessageSchema = new Schema<IChatMessage>({
  role: { type: String, required: true, enum: ["user", "assistant"] },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  metadata: {
    analysis: {
      emotionalState: String,
      stressLevel: { type: String, enum: ["low", "moderate", "high"] },
      focusLevel: { type: String, enum: ["low", "average", "high"] },
      confidenceLevel: { type: String, enum: ["low", "stable", "high"] },
      recommendedActivity: String,
    },
    currentGoal: String,
    wellnessProgress: {
      stressLevel: { type: String, enum: ["low", "moderate", "high"] },
      focusLevel: { type: String, enum: ["low", "average", "high"] },
      confidenceLevel: { type: String, enum: ["low", "stable", "high"] },
    },
    activityLogged: String,
  },
});

const chatSessionSchema = new Schema<IChatSession>({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    required: true,
    enum: ["active", "completed", "archived"],
    default: "active",
  },
  messages: [chatMessageSchema],
}, { timestamps: true }); // adds createdAt and updatedAt

export const ChatSession = model<IChatSession>("ChatSession", chatSessionSchema);