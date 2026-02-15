"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const AFFIRMATIONS = [
  "I am capable of handling challenges.",
  "I believe in my skills and abilities.",
  "I grow stronger every day.",
  "Mistakes help me improve.",
  "I deserve success and happiness.",
  "I am confident in my decisions.",
  "I trust myself.",
  "I can achieve my goals."
];

const GAME_DURATION = 60; // 60 seconds

export default function ConfidenceBuilder() {
  const [currentText, setCurrentText] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const getRandomAffirmation = () => {
    const random =
      AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    setCurrentText(random);
  };

  useEffect(() => {
    if (isPlaying) {
      getRandomAffirmation();
    }
  }, [isPlaying]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(((GAME_DURATION - newTime) / GAME_DURATION) * 100);
          return newTime;
        });
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleAccept = () => {
    setScore((prev) => prev + 1);
    getRandomAffirmation();
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setProgress(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-lg mx-auto 
                    bg-white dark:bg-gray-900 rounded-xl shadow-md transition-colors duration-300 space-y-6">

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Confidence Builder 💪
      </h2>

      {!isPlaying && !gameOver && (
        <Button onClick={() => setIsPlaying(true)}>
          Start Session
        </Button>
      )}

      {isPlaying && (
        <>
          <Progress value={progress} className="w-full h-2" />

          <motion.div
            key={currentText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center p-6 bg-gray-100 dark:bg-gray-800 
                       rounded-lg text-lg font-medium 
                       text-gray-800 dark:text-gray-200"
          >
            {currentText}
          </motion.div>

          <div className="flex gap-4">
            <Button onClick={handleAccept}>
              I Believe This
            </Button>
            <Button variant="outline" onClick={getRandomAffirmation}>
              Next
            </Button>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            ⏳ {timeLeft}s | 🌟 Score: {score}
          </div>
        </>
      )}

      {gameOver && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Session Complete 🎉
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            You reinforced {score} positive beliefs!
          </p>
          <Button onClick={restartGame}>
            Restart
          </Button>
        </div>
      )}
    </div>
  );
}
