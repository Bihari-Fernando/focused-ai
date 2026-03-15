export interface DashboardOverview {
  stressLevelPercent: number;
  stressLevelLabel: "low" | "moderate" | "high";
  stressDescription: string;
  moodScore: number | null;
  emotionalState: string;
  aiCheckIns: number;
  focusSessions: number;
  studySessionsCompleted: number;
  lastUpdated: string;
}

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`/api/dashboard/overview`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch dashboard overview");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    throw error;
  }
};
