import React from "react";
import FingerprintMark from "@/components/FingerprintMark";
import RippleRings from "@/components/RippleRings";
import { formatMoney } from "@/lib/legacy";

export default function BalanceCard({ wallet, holder }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-gold/15 bg-gradient-to-br from-[#15120d] via-[#0d0d10] to-[#08080a] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full bg-gold/[0.07] blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="eyebrow">Available balance</p>
          <p className="mt-3 font-display text-[38px] font-light leading-none tracking-tight gold-text sm:text-[46px]">
            {formatMoney(wallet?.balance, wallet?.currency)}
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-foreground/35">
            <span className="font-mono tracking-[0.14em]">{wallet?.account_number || "—"}</span>
            <span className="h-2.5 w-px bg-white/10" />
            <span>{holder || "LEGACY member"}</span>
          </p>
        </div>

        <div className="relative hidden h-24 w-24 shrink-0 sm:block">
          <RippleRings count={3} duration={8} />
          <div className="absolute inset-0 flex items-center justify-center">
            <FingerprintMark id="balance-mark" className="h-16 w-16 opacity-90" />
          </div>
        </div>
      </div>

      <div className="relative mt-7 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
        <p className="text-[10.5px] leading-relaxed text-foreground/30">
          Prototype ledger · payments authorised by your registered fingerprint
        </p>
        <span className="hidden shrink-0 rounded-full border border-gold/20 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.22em] text-gold/60 sm:block">
          Effortless
        </span>
      </div>
    </div>
  );
}