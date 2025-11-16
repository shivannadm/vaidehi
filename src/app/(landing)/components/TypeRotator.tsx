"use client";

import { useEffect, useState } from "react";

export default function TypeRotator({ words = [], interval = 1200 }: { words: string[]; interval?: number; }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(t);
  }, [words, interval]);

  // Animated part is aria-hidden; we include sr-only text in parent for screen readers.
  return (
    <span aria-hidden="true" className="inline-block align-middle">
      <span key={index} className="inline-block transition-opacity duration-400">
        {words[index]}
      </span>
    </span>
  );
}
