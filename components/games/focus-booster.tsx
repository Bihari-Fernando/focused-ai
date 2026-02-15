import React, { useState, useEffect } from "react";

const colors: string[] = ["red", "blue", "green", "yellow", "purple"];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const FocusBooster: React.FC = () => {
  const [word, setWord] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const generateChallenge = () => {
    const randomWord = getRandomItem(colors);
    const randomColor = getRandomItem(colors);
    setWord(randomWord.toUpperCase());
    setTextColor(randomColor);
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (selectedColor: string) => {
    if (selectedColor === textColor) {
      setScore(score + 1);
    }
    generateChallenge();
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    generateChallenge();
  };

  if (gameOver) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Time's Up ⏳</h2>
        <p className="text-lg mb-4">Your Score: {score}</p>
        <button
          onClick={restartGame}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md text-center">
      <h2 className="text-xl font-semibold mb-4">Color Focus Challenge</h2>

      <p className="mb-2 text-gray-500">Select the COLOR of the text</p>

      <h1
        className="text-4xl font-bold mb-6"
        style={{ color: textColor }}
      >
        {word}
      </h1>

      <div className="grid grid-cols-2 gap-3">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(color)}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: color }}
          >
            {color.toUpperCase()}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-600">
        ⏳ Time: {timeLeft}s | 🎯 Score: {score}
      </p>
    </div>
  );
};

export default FocusBooster;
