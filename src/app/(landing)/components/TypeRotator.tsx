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

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[index];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), interval);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, words, interval, typingSpeed, deletingSpeed]);

  return (
    <span className="inline-block relative">
      <span className="transition-opacity duration-200">
        {displayText}
        <span
          className="inline-block w-[2px] h-[1em] bg-indigo-600 ml-0.5 align-middle"
          style={{
            animation: "blink 1.3s step-end infinite",
          }}
        />
      </span>
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}