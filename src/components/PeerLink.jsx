import React from "react";
import { Smartphone } from "lucide-react";
import RippleRings from "@/components/RippleRings";

function Device({ label, active }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative flex h-16 w-11 items-center justify-center rounded-[10px] border ${
          active ? "border-gold/50 bg-gold/[0.08]" : "border-white/10 bg-white/[0.03]"
        }`}
      >
        <span
          className={`absolute inset-x-2 top-1.5 h-px ${active ? "bg-gold/40" : "bg-white/10"}`}
        />
        <Smartphone
          className={`h-4 w-4 ${active ? "text-gold" : "text-foreground/30"}`}
          strokeWidth={1.5}
        />
        <span
          className={`absolute inset-x-2 bottom-1.5 h-px ${active ? "bg-gold/40" : "bg-white/10"}`}
        />
      </div>
      <span className="text-[9px] uppercase tracking-[0.18em] text-foreground/35">{label}</span>
    </div>
  );
}

export default function PeerLink({ recipient }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex w-full max-w-xs items-center justify-between gap-4">
        <Device label="Your phone" active />
        <div className="relative h-px flex-1">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <span
            className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-gold shadow-[0_0_12px_2px_rgba(201,169,110,0.55)]"
            style={{ animation: "legacy-travel 1.9s ease-in-out infinite" }}
          />
        </div>
        <Device label={recipient || "Recipient"} active />
      </div>
      <div className="relative mt-4 h-20 w-20">
        <RippleRings count={3} duration={3.4} />
      </div>
    </div>
  );
}