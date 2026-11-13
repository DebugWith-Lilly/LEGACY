import React from "react";
import { cn } from "@/lib/utils";

// Nested ridge arches, narrowing toward the core — a symmetrical emblem
// rather than a generic fingerprint glyph.
const RIDGES = Array.from({ length: 12 }, (_, i) => ({
  w: 5 + i * 3.05,
  h: 6.6 + i * 3.24,
  o: 1 - i * 0.024,
}));

const arch = (w, h) =>
  `M ${-w} ${h} C ${-w} ${h * 0.05} ${-w * 0.6} ${-h} 0 ${-h} C ${w * 0.6} ${-h} ${w} ${h * 0.05} ${w} ${h}`;

export default function FingerprintMark({
  className,
  framed = false,
  glow = true,
  id = "legacy-fp",
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-16 w-16", className)}
      role="img"
      aria-label="LEGACY fingerprint mark"
    >
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FAF2E2" />
          <stop offset="34%" stopColor="#E0C79B" />
          <stop offset="62%" stopColor="#C09A5E" />
          <stop offset="84%" stopColor="#A8863F" />
          <stop offset="100%" stopColor="#F3E7CE" />
        </linearGradient>
        <radialGradient id={`${id}-sheen`} cx="50%" cy="20%" r="72%">
          <stop offset="0%" stopColor="#FFF8E9" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#FFF8E9" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {framed && (
        <>
          <circle cx="50" cy="50" r="47.5" fill={`url(#${id}-sheen)`} />
          <circle
            cx="50"
            cy="50"
            r="47.5"
            fill="none"
            stroke={`url(#${id}-gold)`}
            strokeWidth="0.45"
            opacity="0.4"
          />
        </>
      )}

      <g
        transform="translate(50 46)"
        fill="none"
        stroke={`url(#${id}-gold)`}
        strokeLinecap="round"
        filter={glow ? `url(#${id}-soft)` : undefined}
      >
        {RIDGES.map((r, i) => (
          <path key={i} d={arch(r.w, r.h)} strokeWidth="1.4" opacity={r.o} />
        ))}
        <ellipse cx="0" cy="-5.6" rx="1.5" ry="2.9" strokeWidth="1.25" opacity="0.95" />
      </g>
    </svg>
  );
}