import React from "react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { key: "match", label: "Genuine finger" },
  { key: "mismatch", label: "Different finger" },
  { key: "noread", label: "Reader offline" },
];

export default function SimulateControl({ value, onChange }) {
  return (
    <div className="rounded-xl border border-white/[0.06] p-3">
      <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/25">
        Demo · reader simulation
      </p>
      <div className="mt-2 flex gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            className={cn(
              "flex-1 rounded-lg border px-2 py-1.5 text-[9px] uppercase tracking-[0.1em] transition",
              value === o.key
                ? "border-gold/40 bg-gold/[0.08] text-gold-soft"
                : "border-white/[0.06] text-foreground/30 hover:text-foreground/60",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}