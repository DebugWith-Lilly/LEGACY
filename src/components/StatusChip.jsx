import React from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  authorised: "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300/90",
  enrolled: "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300/90",
  verified: "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300/90",
  approved: "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300/90",
  declined: "border-red-400/25 bg-red-400/[0.08] text-red-300/90",
  failed: "border-red-400/25 bg-red-400/[0.08] text-red-300/90",
  suspended: "border-red-400/25 bg-red-400/[0.08] text-red-300/90",
  pending: "border-gold/30 bg-gold/[0.08] text-gold-soft",
  requested: "border-gold/30 bg-gold/[0.08] text-gold-soft",
  reviewing: "border-sky-400/25 bg-sky-400/[0.08] text-sky-300/90",
  neutral: "border-white/10 bg-white/[0.04] text-foreground/50",
};

export default function StatusChip({ status = "neutral", label, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.16em]",
        VARIANTS[status] || VARIANTS.neutral,
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {label || status.replace(/_/g, " ")}
    </span>
  );
}