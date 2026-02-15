"use client";

import { useState, useEffect } from "react";

export function QuickCalmBreathing() {
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [progress, setProgress] = useState(0);
    const [round, setRound] = useState(1);
    const [isComplete, setIsComplete] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

}