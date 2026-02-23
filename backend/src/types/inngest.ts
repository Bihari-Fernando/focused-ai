export interface WellnessAgentMemory {
    userProfile: {
        stressLevel: "low" | "moderate" | "high";
        focusLevel: "low" | "average" | "high";
        confidenceLevel: "low" | "stable" | "high";
        emotionalHistory?: string[];
        preferences: Record<string, any>;
    };
    sessionContext: {
        recentActivities: string[];
        currentActivity: string | null;
        recommendedActivities?: string[];
    };
}


export interface MessageAnalysis {
    emotionalState: string;
    stressLevel: "low" | "moderate" | "high";
    focusLevel: "low" | "average" | "high";
    confidenceLevel: "low" | "stable" | "high";
    recommendedActivity:
    | "breathing"
    | "focus-game"
    | "confidence-builder"
    | "stress-reset"
    | "mindfulness";
    encouragementMessage: string;
}


export interface InngestResponse<T> {
    id: string;
    data: T;
}


export interface InngestMessageData {
    response: string;
    analysis: MessageAnalysis;
    updatedMemory?: WellnessAgentMemory;
}


export interface InngestSessionData {
    sessionId: string;
    userId: string;
    startTime: Date;
}


export interface InngestEventData {
    message?: string;
    history?: any[];
    memory?: WellnessAgentMemory;
    goals?: string[];
    sessionId?: string;
    userId?: string;
    startTime?: Date;
}

export type InngestMessageResponse =
    InngestResponse<InngestMessageData>;

export type InngestSessionResponse =
    InngestResponse<InngestSessionData>;

export interface InngestEvent {
    name: string;
    data: InngestEventData;
}
