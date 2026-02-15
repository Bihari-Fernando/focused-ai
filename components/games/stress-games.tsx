"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Flower2, Wind, TreePine, Waves, Music2, Brain, Heart, Trophy, } from "lucide-react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button";

const games = [
    {
        id: "breathing",
        title: "Quick Calm Breathing",
        description: "5-minute guided breathing to reduce exam anxiety",
        icon: Wind,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        duration: "5 mins",
    },
    {
        id: "focus",
        title: "Focus Booster",
        description: "Short guided session to improve concentration before studying",
        icon: Brain,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        duration: "10 mins",
    },
    {
        id: "reset",
        title: "Stress Reset",
        description: "Relax your mind after intense study sessions",
        icon: Heart,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
        duration: "8 mins",
    },
    {
        id: "confidence",
        title: "Exam Confidence Builder",
        description: "Positive reinforcement to boost exam confidence",
        icon: Trophy,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        duration: "7 mins",
    },
];

interface AnxietyGamesProps {
    onGamePlayed?: (gameName: string, description: string) => Promise<void>;
}

export const AnxietyGames = ({ onGamePlayed }: AnxietyGamesProps) => {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [showGame, setShowGame] = useState(false);

    const handleGameStart = async (gameId: string) => {
        setSelectedGame(gameId);
        setShowGame(true);

        // Log the activity
        if (onGamePlayed) {
            try {
                await onGamePlayed(
                    gameId,
                    games.find((g) => g.id === gameId)?.description || ""
                );
            } catch (error) {
                console.error("Error logging game activity:", error);
            }
        }
    };

    const renderGame = () => {
        switch (selectedGame) {
            case "breathing":
            //return <QuickCalmBreathing />;

            case "focus":
            //return <FocusBooster />;

            case "reset":
            //return <StressReset />;

            case "confidence":
            //return <ConfidenceBuilder />;

            default:
                return null;
        }
    };

    return (
        <>
            <Card className="border-primary/10">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <Gamepad2 className="h-5 w-5 text-primary" />
                        Stress Relief Activities
                    </CardTitle>
                    <CardDescription>
                        Interactive exercises to help reduce stress and anxiety
                    </CardDescription>
                </CardHeader>
            </Card>
        </>
    );


};


