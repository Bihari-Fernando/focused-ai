"use client"
import { useState, useEffect, useCallback } from "react";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { MessageSquare, ArrowRight, Heart, BrainCircuit, Brain, Activity, Trophy, Bell } from "lucide-react";
import { format } from "date-fns";
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

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnxietyGames } from "@/components/games/stress-games";
import { MoodForm } from "@/components/mood/mood-form";
import { ActivityLogger } from "@/components/activities/activity-logger";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/contexts/session-context";
import { getDashboardOverview, DashboardOverview } from "@/lib/api/dashboard";

export default function dashboardPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showMoodModal, setShowMoodModal] = useState(false);
    const [showActivityLogger, setShowActivityLogger] = useState(false);
    const [overview, setOverview] = useState<DashboardOverview | null>(null);
    const [loadingOverview, setLoadingOverview] = useState(true);
    const { user } = useSession();
    const router = useRouter();

    const wellnessStats = overview
        ? [
              {
                  title: "Stress Level",
                  value: `${overview.stressLevelPercent}%`,
                  icon: Brain,
                  color: "text-purple-500",
                  bgColor: "bg-purple-500/10",
                  description: overview.stressDescription,
              },
              {
                  title: "Mood Score",
                  value: overview.moodScore !== null ? `${overview.moodScore}%` : "—",
                  icon: Heart,
                  color: "text-rose-500",
                  bgColor: "bg-rose-500/10",
                  description: overview.emotionalState,
              },
              {
                  title: "AI Check-ins",
                  value: `${overview.aiCheckIns}`,
                  icon: Activity,
                  color: "text-blue-500",
                  bgColor: "bg-blue-500/10",
                  description: "Conversations with AI today",
              },
              {
                  title: "Focus Sessions",
                  value: `${overview.focusSessions}`,
                  icon: Trophy,
                  color: "text-yellow-500",
                  bgColor: "bg-yellow-500/10",
                  description: "Study sessions completed",
              },
          ]
        : [
              {
                  title: "Stress Level",
                  value: "—",
                  icon: Brain,
                  color: "text-purple-500",
                  bgColor: "bg-purple-500/10",
                  description: "AI detected exam stress",
              },
              {
                  title: "Mood Score",
                  value: "—",
                  icon: Heart,
                  color: "text-rose-500",
                  bgColor: "bg-rose-500/10",
                  description: "Today's emotional state",
              },
              {
                  title: "AI Check-ins",
                  value: "—",
                  icon: Activity,
                  color: "text-blue-500",
                  bgColor: "bg-blue-500/10",
                  description: "Conversations with AI today",
              },
              {
                  title: "Focus Sessions",
                  value: "—",
                  icon: Trophy,
                  color: "text-yellow-500",
                  bgColor: "bg-yellow-500/10",
                  description: "Study sessions completed",
              },
          ];

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const loadOverview = useCallback(async () => {
        try {
            setLoadingOverview(true);
            const data = await getDashboardOverview();
            setOverview(data);
        } catch (error) {
            console.error("Failed to load dashboard overview:", error);
        } finally {
            setLoadingOverview(false);
        }
    }, []);

    useEffect(() => {
        loadOverview();
    }, [loadOverview]);

    const handleAICheckIn = () => {
        setShowActivityLogger(true);
    };

    const handleStartTherapy = () => {
        router.push("/therapy/session");
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <Container className="pt-20 pb-8 space-y-6">
                <div className="flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <h1 className="text-3xl font-bold text-foreground">
                            Welcome back, {user?.name || "there"}
                        </h1>
                        <p className="text-muted-foreground">
                            {currentTime.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </motion.div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* main grid layout */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {/* quick action cars */}
                        <Card className="border-primary/10 relative overflow-hidden group">
                            <div className="absoulute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />
                            <CardContent className="p-6 relative">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Quick Actions</h3>
                                            <p className="text-sm text-muted-foreground">Support for a calmer study experience</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        <Button
                                            variant="default"
                                            className={cn(
                                                "w-full justify-between items-center p-6 h-auto group/button",
                                                "bg-gradient-to-r from-primary/90 to primary hover:from-primary/90",
                                                "transition-all duration-20 group-hover:translate-y-[-2px]"
                                            )}
                                            onClick={handleStartTherapy}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                                    <MessageSquare className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-semibold text-white">
                                                        Start Therapy
                                                    </div>
                                                    <div className="text-xs text-white/80">
                                                        Begin a new session
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover/button:opacity-100 transition-opacity">
                                                <ArrowRight className="w-5 h-5 text-white" />
                                            </div>
                                        </Button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "flex flex-col h-[120px] px-4 py-3 group/mood hover:border-primary/50",
                                                    "justify-center items-center text-center",
                                                    "transition-all duration-200 group-hover:translate-y-[-2px]"
                                                )}
                                                onClick={() => setShowMoodModal(true)}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mb-2">
                                                    <Heart className="w-5 h-5 text-rose-500" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">Track Mood</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">
                                                        How are you feeling?
                                                    </div>
                                                </div>
                                            </Button>

                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "flex flex-col h-[120px] px-4 py-3 group/ai hover:border-primary/50",
                                                    "justify-center items-center text-center",
                                                    "transition-all duration-200 group-hover:translate-y-[-2px]"
                                                )}
                                                onClick={handleAICheckIn}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                                                    <BrainCircuit className="w-5 h-5 text-blue-500" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">Check-in</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">
                                                        Share what's stressing you
                                                    </div>
                                                </div>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* overview card */}
                        <Card className="border-primary/10">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Today's Overview</CardTitle>
                                        <CardDescription>
                                            Your stress metrics for{" "}
                                            {format(new Date(), "MMMM d, yyyy")}
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                    >

                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="grid grid-cols-2 gap-3">
                                    {wellnessStats.map((stat) => (
                                        <div
                                            key={stat.title}
                                            className={cn(
                                                "p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]",
                                                stat.bgColor
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <stat.icon className={cn("w-5 h-5", stat.color)} />
                                                <p className="text-sm font-medium">{stat.title}</p>
                                            </div>
                                            <p className="text-2xl font-bold mt-2">{stat.value}</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {stat.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-xs text-muted-foreground text-right">
                                    {loadingOverview
                                        ? "Loading..."
                                        : `Last updated: ${format(
                                              overview?.lastUpdated
                                                  ? new Date(overview.lastUpdated)
                                                  : new Date(),
                                              "h:mm a"
                                          )}`}
                                </div>
                            </CardContent>

                        </Card>
                    </div>

                    {/* content grid for games */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-3 space-y-6">
                            {/* anxiety games */}
                            <AnxietyGames />
                        </div>
                    </div>


                </div>
            </Container>
            {/* mood trracking modal */}
            <Dialog open={showMoodModal} onOpenChange={setShowMoodModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>How are exams making you feel?</DialogTitle>
                        <DialogDescription>
                            Slide to tell us your current stress level
                        </DialogDescription>
                    </DialogHeader>
                    {/* moodform */}
                    <MoodForm
                        onSuccess={() => {
                            setShowMoodModal(false);
                            loadOverview();
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* activity logger */}
            <ActivityLogger
                open={showActivityLogger}
                onOpenChange={setShowActivityLogger}
            />

        </div>
    )
}