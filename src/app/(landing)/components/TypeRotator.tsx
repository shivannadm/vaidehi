"use client";

import { useState, useEffect } from "react";

interface TypeRotatorProps {
  words: string[];
  interval?: number;
  typingSpeed?: number;
}

export default function TypeRotator({
  words,
  interval = 2000,
  typingSpeed = 100
}: TypeRotatorProps) {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentWord = words[index];

    const timeout = setTimeout(() => {
      if (isPaused) {
        // Pause after completing a word
        setIsPaused(false);
        setIsDeleting(true);
        return;
      }

      if (!isDeleting) {
        // Typing forward
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          // Word complete, pause before deleting
          setIsPaused(true);
        }
      } else {
        // Deleting backward
        if (displayText.length > 0) {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        } else {
          // Deleted completely, move to next word
          setIsDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        }
      }
    }, isPaused ? interval : isDeleting ? typingSpeed / 2 : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, isPaused, index, words, interval, typingSpeed]);

  return (
    <span className="inline-block align-middle relative">
      <span className="inline-block transition-opacity duration-200">
        {displayText}
      </span>
      {/* Blinking cursor */}
      <span
        className="inline-block w-0.5 h-5 bg-indigo-600 ml-0.5 animate-pulse"
        style={{
          animation: "blink 1s step-end infinite",
        }}
      />
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}