"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Ripple } from "@/components/ui/ripple";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Waves,
  HeartPulse,
  Lightbulb,
  Lock,
  MessageSquareHeart,
  Brain,
  MessageCircle,
  Shield,
  Clock,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const emotions = [
    { value: 0, lable: "😰 Overwhelmed", color: "from-blue-500/50" },
    { value: 25, lable: "😟 Anxious", color: "from-green-500/50" },
    { value: 50, lable: "😌 Calm", color: "from-purple-500/50" },
    { value: 75, lable: "🙂 Relaxed", color: "from-yellow-500/50" },
    { value: 100, lable: "😄 Confident", color: "from-pink-500/50" },
  ];

  const features = [
  {
    icon: Brain,
    title: "Empathetic AI",
    description: "Our AI understands your feelings and responds with genuine empathy to help you process exam anxiety.",
  },
  {
    icon: MessageCircle,
    title: "24/7 Support",
    description: "Available whenever stress hits, day or night. Talk through your worries at any time.",
  },
  {
    icon: Shield,
    title: "Safe Space",
    description: "A judgment-free zone where you can express your fears and find comfort without worry.",
  },
  {
    icon: Clock,
    title: "Quick Relief",
    description: "Guided breathing exercises and calming techniques that work in minutes, not hours.",
  },
]

  const router = useRouter();
  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentEmotion =
    emotions.find((em) => Math.abs(emotion - em.value) < 15) || emotions[2];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <section className="relative min-h-[90vh] mt-20 flex flex-col items-center justify-center py-12 px-4">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 -left-20 transition-all duration-700 ease-in-out bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-60`}
          >
            <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl bottom-0 right-0 animate-pulse delay-700">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl"></div>
            </div>
          </div>
        </div>
        <Ripple className="opacity-60" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative space-y-8 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm border border-primary/20 bg-primary/5 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
            <Waves className="w-4 h-4 animate-wave text-primary" />
            <span className="relative text-foreground/90 dark:text-foreground after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-primary/30 after:scale-x-0 hover:bg-primary/30 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
              Your AI Companion for Exam Stress Relief
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-plus-jakarta tracking-tight">
            <span className="inline-block bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent [text-shadow:_0_1px_0_rgb(0_0_0_/_20%)] hover:to-primary transition-all duration-300">
              Reduce Exam Stress
            </span>
            <br />
            <span className="inline-block mt-2 bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text text-transparent">
              Stay Calm & Focused
            </span>
          </h1>
          <p className="max-w-[600px] mx-auto text-base md:text-lg text-muted-foreground leading-relaxed tracking-wide">
            Experience a supportive way to manage exam stress. Our AI companion
            listens, understands your feelings, and gently guides you toward
            calmness and focus during exam preparation.
          </p>

          <motion.div
            className="w-full max-w-[600px] mx-auto space-y-6 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="space-y-2 text=center">
              <p className="text-sm text-muted-foreground/80 font-medium">
                Feeling stressed about exams? Our AI companion is here for you
              </p>

              <div className="flex justify-between items-center px-2">
                {emotions.map((em) => (
                  <div
                    key={em.value}
                    className={`transition-all duration-500 ease-out cursor-pointer hover:scale-105 ${Math.abs(emotion - em.value) < 15 ? "opacity-100 scale-110 transform-gpu" : "opacity-50 scale-100"}`}
                    onClick={() => setEmotion(em.value)}
                  >
                    <div className="text-2xl transform-gpu">
                      {em.lable.split(" ")[0]}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">
                      {em.lable.split(" ")[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div className="relative px-2">
              <div
                className={`absolute unnset-0 bg-gradient-to-r ${currentEmotion.color} to-transparent blur-2xl -z-10 transition-all duration-500`}
              />
              <Slider
                value={[emotion]}
                onValueChange={(value) => setEmotion(value[0])}
                min={0}
                max={100}
                step={1}
                className="py-4"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground animate-pulse">
                Slide to share how you’re feeling about your studies today
              </p>
            </div>

            {/*  */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Button
                size="lg"
                onClick={() => router.push("/dashboard")}
                className="relative group h-12 px-8 rounded-full bg-gradient-to-r from-primary via-primary/90 to-secondary hover:to-primary shadow-lg shadow-primary/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/30"
              >
                <span className="relative z-10 font-medium flex items-center gap-2">
                  Start Your Calm Journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Section header */}
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How FocusedAI Helps You
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience gentle emotional support, powered by empathetic AI 
              to help you manage study-related stress
            </p>
          </div>

          {/* Features grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Stats Section */}
      <section className="border-y border-border bg-card/30 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "10K+", label: "Students Helped" },
              { value: "85%", label: "Stress Reduction" },
              { value: "24/7", label: "Availability" },
              { value: "4.9", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
