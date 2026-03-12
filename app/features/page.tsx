"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Bot,
  Activity,
  LineChart,
  Target,
  Heart,
  Sparkles,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: "AI Wellness Assistant",
    description:
      "Students can chat with an AI-powered assistant that provides supportive responses and guidance for managing stress, focus, and emotional well-being.",
  },
  {
    icon: <Brain className="w-10 h-10 text-primary" />,
    title: "Emotion & Stress Analysis",
    description:
      "Using natural language processing with Google Gemini, the system analyzes messages to detect emotional state, stress level, focus level, and confidence.",
  },
  {
    icon: <Activity className="w-10 h-10 text-primary" />,
    title: "Personalized Wellness Activities",
    description:
      "The platform recommends activities such as breathing exercises, mindfulness practices, and focus games to help students improve mental balance.",
  },
  {
    icon: <LineChart className="w-10 h-10 text-primary" />,
    title: "Progress Tracking",
    description:
      "Track improvements in stress, focus, and confidence levels over time with smart analytics and session-based insights.",
  },
  {
    icon: <Target className="w-10 h-10 text-primary" />,
    title: "Focus & Productivity Support",
    description:
      "Focused-AI helps students stay productive by suggesting techniques that improve concentration and reduce academic stress.",
  },
  {
    icon: <MessageCircle className="w-10 h-10 text-primary" />,
    title: "Therapy Chat Sessions",
    description:
      "Each interaction is saved as a therapy session, allowing students to review conversations and monitor their mental wellness journey.",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-primary" />,
    title: "AI-Generated Encouragement",
    description:
      "The assistant provides motivational responses and positive reinforcement to help students stay confident and resilient.",
  },
  {
    icon: <Heart className="w-10 h-10 text-primary" />,
    title: "Student-Centered Design",
    description:
      "Focused-AI is designed specifically for students to support mental wellness during exams, deadlines, and academic pressure.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Platform Features
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Focused-AI helps students improve focus, manage stress, and maintain
          emotional well-being through AI-powered guidance and personalized
          wellness insights.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center mt-16"
      >
        <h2 className="text-2xl font-semibold mb-4">Start Your Wellness Journey</h2>
        <p className="text-muted-foreground mb-8">
          Talk with the AI assistant and begin improving your focus, confidence,
          and emotional well-being today.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard
          <Heart className="ml-2 w-5 h-5" />
        </a>
      </motion.div>
    </div>
  );
}