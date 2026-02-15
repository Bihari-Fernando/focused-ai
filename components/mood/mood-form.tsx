"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";

interface MoodFormProps {
    onSuccess?: () => void;
}

export function MoodForm({ onSuccess }:
    MoodFormProps) {
    const [moodScore, setMoodScore] = useState(50);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const emotions = [
        { value: 0, label: "😔", description: "Very Low" },
        { value: 25, label: "😕", description: "Low" },
        { value: 50, label: "😊", description: "Neutral" },
        { value: 75, label: "😃", description: "Good" },
        { value: 100, label: "🤗", description: "Great" },
    ];

    const currentEmotion =
        emotions.find((em) => Math.abs(moodScore - em.value) < 15) || emotions[2];
}