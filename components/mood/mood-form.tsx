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
}