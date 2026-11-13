import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck } from "lucide-react";
import FingerprintMark from "@/components/FingerprintMark";
import RippleRings from "@/components/RippleRings";
import { formatDateTime } from "@/lib/legacy";
import { maskReference } from "@/lib/biometric";

export default function EnrolSuccess({ result, reEnrol, onboarding }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center py-2 text-center">
      <div className="relative h-44 w-44">
        <RippleRings count={4} duration={5} color="rgba(201,169,110,0.5)" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FingerprintMark id="enrol-done" framed className="h-32 w-32" />
        </div>
        <span className="absolute -bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/15 text-emerald-300">
          <Check className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>

      <h3 className="mt-8 font-display text-[28px] font-light text-foreground">
        Fingerprint registered
      </h3>
      <p className="mt-2 max-w-sm text-[12px] leading-relaxed text-foreground/40">
        {reEnrol
          ? "Your registered finger has been replaced. Use this finger for every LEGACY payment from now on."
          : "Your fingerprint is now your payment identity. Use it to authorise payments at terminals and on recipient phones."}
      </p>

      <div className="mt-7 w-full max-w-sm divide-y divide-white/[0.06] rounded-xl border border-white/[0.07] bg-white/[0.02] text-left">
        <Detail label="Registered finger" value={result.finger} />
        <Detail label="Ridge quality" value={`${result.quality}%`} />
        <Detail label="Enrolled" value={formatDateTime(result.date)} />
        <Detail label="Biometric reference" value={maskReference(result.reference)} mono />
        <Detail label="Reader" value={result.device} />
      </div>

      <div className="mt-5 flex max-w-sm items-start gap-2.5 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.03] p-3.5 text-left">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/70" strokeWidth={1.5} />
        <p className="text-[10.5px] leading-relaxed text-foreground/40">
          LEGACY stores an opaque biometric reference against your user ID — never a fingerprint
          image, and never a raw template.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate(onboarding ? "/" : "/identity")}
        className="btn-gold mt-7 max-w-sm"
      >
        {onboarding ? "Continue to dashboard" : "View my identity"}
      </button>
    </div>
  );
}

function Detail({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-[9.5px] uppercase tracking-[0.2em] text-foreground/30">{label}</span>
      <span
        className={`text-right text-[11.5px] text-foreground/75 ${mono ? "font-mono tracking-[0.06em]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}