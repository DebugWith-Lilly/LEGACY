import React from "react";
import FingerprintMark from "@/components/FingerprintMark";
import RippleRings from "@/components/RippleRings";
import Wordmark from "@/components/Wordmark";

export default function BrandSplash() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink">
      <div className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-gold/[0.06] blur-[110px]" />
      <div className="relative h-40 w-40">
        <RippleRings count={4} duration={4.4} />
        <div className="absolute inset-0 flex items-center justify-center">
          <FingerprintMark id="splash-fp" framed className="h-32 w-32" />
        </div>
      </div>
      <Wordmark size="sm" showMark={false} className="relative mt-9" id="splash-word" />
      <p className="relative mt-3 text-[9px] uppercase tracking-[0.34em] text-gold/40">
        Your Finger. Your Finance.
      </p>
    </div>
  );
}