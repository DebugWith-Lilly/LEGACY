import React from "react";
import { cn } from "@/lib/utils";

/**
 * Signature ripple motif — concentric champagne rings travelling outward
 * from a fingerprint. Parent should be relative and square.
 */
export default function RippleRings({
  count = 4,
  duration = 6,
  color = "rgba(201,169,110,0.42)",
  className,
  thickness = "border",
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center",
        className,
      )}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn("absolute h-full w-full rounded-full", thickness)}
          style={{
            borderColor: color,
            animation: `legacy-ripple ${duration}s cubic-bezier(0.22,0.61,0.36,1) ${(
              (i * duration) /
              count
            ).toFixed(2)}s infinite`,
          }}
        />
      ))}
    </div>
  );
}