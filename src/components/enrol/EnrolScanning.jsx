import React from "react";
import { X } from "lucide-react";
import FingerprintReader from "@/components/FingerprintReader";
import { cn } from "@/lib/utils";

export default function EnrolScanning({ finger, scans, quality, onCancel }) {
  const done = quality.length;
  const total = 5;
  const progress = done / total;

  return (
    <div className="flex flex-col items-center py-2 text-center">
      <p className="eyebrow">Capturing ridge pattern</p>
      <h3 className="mt-2 font-display text-[26px] font-light text-foreground">
        Place your {finger?.toLowerCase() || "finger"} on the reader
      </h3>

      <div className="mt-7">
        <FingerprintReader state="scanning" progress={progress} size="lg" id="enrol-scan" />
      </div>

      <p className="mt-7 text-[12px] text-foreground/50">
        {done === 0
          ? "Hold still — the sensor is warming up."
          : done < total
            ? `Placement ${done} of ${total} captured. Lift and place again.`
            : "Building your secure reference…"}
      </p>

      <div className="mt-4 flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-7 rounded-full transition-colors duration-500",
              i < done ? "bg-gold" : "bg-white/10",
            )}
          />
        ))}
      </div>

      <div className="mt-3 h-4 text-[10.5px] text-foreground/30">
        {quality.length > 0 && `Ridge quality ${quality[quality.length - 1]}%`}
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-foreground/25 transition hover:text-foreground/60"
      >
        <X className="h-3 w-3" />
        Cancel enrolment
      </button>
    </div>
  );
}