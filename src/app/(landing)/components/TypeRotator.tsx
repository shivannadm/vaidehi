"use client";

import { useEffect, useState } from "react";

export default function TypeRotator({ 
  words = [], 
  interval = 2500,
  typingSpeed = 100,
  deletingSpeed = 50,
}: { 
  words: string[]; 
  interval?: number;
  typingSpeed?: number;
  deletingSpeed?: number;
}) {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[index];

    // Typing logic
    if (!isDeleting && !isPaused) {
      if (displayText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Word is complete, pause before deleting
        setIsPaused(true);
        const timeout = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, interval);
        return () => clearTimeout(timeout);
      }
    }

    // Deleting logic
    if (isDeleting && !isPaused) {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deletingSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Deleted completely, move to next word
        setIsDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }
    }
  }, [displayText, isDeleting, isPaused, index, words, interval, typingSpeed, deletingSpeed]);

  return (
    <span aria-hidden="true" className="inline-block align-middle relative">
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