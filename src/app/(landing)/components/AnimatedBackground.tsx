"use client";

export default function AnimatedBackground() {
  return (
    // This is a lightweight visual layer. Replace with more complex canvas/SVG later.
    <div className="pointer-events-none absolute inset-0 -z-10">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.06)"/>
            <stop offset="100%" stopColor="rgba(14,165,233,0.03)"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g1)" />
        {/* subtle animated circles */}
        <circle cx="140" cy="120" r="80" fill="rgba(99,102,241,0.06)">
          <animate attributeName="cx" values="140;180;140" dur="8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="1200" cy="520" r="60" fill="rgba(79,70,229,0.04)">
          <animate attributeName="cy" values="520;480;520" dur="10s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
}
