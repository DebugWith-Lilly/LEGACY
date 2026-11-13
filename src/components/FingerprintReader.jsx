import React from "react";
import FingerprintMark from "@/components/FingerprintMark";
import RippleRings from "@/components/RippleRings";
import { cn } from "@/lib/utils";

const CIRCUMFERENCE = 2 * Math.PI * 48;

/**
 * The gold fingerprint reader visual: concentric ripple rings, a travelling
 * scan line while capturing, and a progress arc around the sensor.
 */
export default function FingerprintReader({
  state = "idle",
  progress = 0,
  size = "md",
  id = "reader-mark",
  className,
}) {
  const scanning = state === "scanning";
  const box = size === "lg" ? "h-64 w-64" : "h-52 w-52";

  return (
    <div className={cn("relative", box, className)}>
      <RippleRings count={4} duration={scanning ? 3.6 : 7.5} />

      <div className="absolute inset-4 rounded-full border border-gold/10 bg-[radial-gradient(circle_at_50%_32%,rgba(201,169,110,0.12),transparent_72%)]" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="0.7"
        />
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="#C9A96E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE * Math.min(progress, 1)} ${CIRCUMFERENCE}`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
          opacity={progress > 0 ? 0.9 : 0}
        />
      </svg>

      <div className="absolute inset-[18%] flex items-center justify-center overflow-hidden rounded-full">
        <FingerprintMark id={id} className="h-full w-full" />
        {scanning && (
          <span
            className="pointer-events-none absolute inset-x-3 h-14 bg-gradient-to-b from-transparent via-gold/30 to-transparent"
            style={{ animation: "legacy-scan 1.9s ease-in-out infinite" }}
          />
        )}
      </div>
    </div>
  );
}