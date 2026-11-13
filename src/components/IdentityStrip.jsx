import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck } from "lucide-react";
import FingerprintMark from "@/components/FingerprintMark";
import StatusChip from "@/components/StatusChip";
import { formatDate } from "@/lib/legacy";

export default function IdentityStrip({ identity }) {
  if (!identity) {
    return (
      <Link
        to="/enroll"
        className="group flex items-center gap-4 rounded-2xl border border-gold/30 bg-gold/[0.05] p-5 transition hover:border-gold/50"
      >
        <div className="relative h-12 w-12 shrink-0">
          <div className="absolute inset-0 animate-[legacy-breathe_3.4s_ease-in-out_infinite] rounded-full bg-gold/15" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FingerprintMark id="id-strip-cta" className="h-8 w-8" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-foreground">
            Fingerprint not registered
          </p>
          <p className="mt-0.5 text-[11px] text-foreground/40">
            Register your finger to authorise payments.
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-gold/60 transition group-hover:translate-x-0.5" />
      </Link>
    );
  }

  return (
    <Link
      to="/identity"
      className="group flex flex-wrap items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:border-gold/25"
    >
      <FingerprintMark id="id-strip" className="h-10 w-10 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] text-foreground">Registered fingerprint</p>
          <StatusChip status="enrolled" label="Registered" />
        </div>
        <p className="mt-1 text-[11px] text-foreground/40">
          {identity.finger} · enrolled {formatDate(identity.enrolled_date)}
        </p>
      </div>
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold/60 transition group-hover:text-gold">
        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
        Manage
      </span>
    </Link>
  );
}