"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {  Gamepad2, Flower2, Wind, TreePine, Waves, Music2, Brain, Heart, Trophy } from "lucide-react";
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