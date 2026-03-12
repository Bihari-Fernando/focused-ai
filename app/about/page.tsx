"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Brain, Target, Sparkles } from "lucide-react";

const missions = [
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "Our Mission",
    description:
      "To support students in managing stress, improving focus, and maintaining emotional well-being through AI-powered guidance and personalized wellness insights.",
  },
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Our Vision",
    description:
      "To create a future where every student has access to intelligent wellness support that helps them stay productive, confident, and mentally balanced.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "Our Values",
    description:
      "Empathy, Accessibility, and Innovation guide the design of Focused-AI, ensuring students receive supportive, personalized, and trustworthy AI assistance.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-20"
      >
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          About Focused-AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Focused-AI is an intelligent student wellness assistant designed to
          help students manage stress, improve focus, and build confidence
          through AI-powered conversations and personalized wellness
          recommendations.
        </p>
      </motion.div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 text-center h-full bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="mb-4 flex justify-center">{mission.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{mission.title}</h3>
              <p className="text-muted-foreground">{mission.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}