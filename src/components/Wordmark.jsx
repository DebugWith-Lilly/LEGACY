import React from "react";
import { cn } from "@/lib/utils";
import FingerprintMark from "@/components/FingerprintMark";

const SIZES = {
  sm: { mark: "h-6 w-6", text: "text-[15px] tracking-[0.42em]" },
  md: { mark: "h-9 w-9", text: "text-xl tracking-[0.44em]" },
  lg: { mark: "h-12 w-12", text: "text-3xl tracking-[0.46em]" },
};

export default function Wordmark({ size = "md", className, showMark = true, id }) {
  const s = SIZES[size] || SIZES.md;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showMark && <FingerprintMark id={id} className={cn(s.mark, "shrink-0")} />}
      <span
        className={cn(
          "gold-text font-display font-medium uppercase leading-none",
          s.text,
        )}
      >
        Legacy
      </span>
    </div>
  );
}