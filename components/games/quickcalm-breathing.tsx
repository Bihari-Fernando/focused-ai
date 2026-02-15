"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function QuickCalmBreathing() {
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [progress, setProgress] = useState(0);
    const [round, setRound] = useState(1);
    const [isComplete, setIsComplete] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

}