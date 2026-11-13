import React from "react";
import FingerprintMark from "@/components/FingerprintMark";
import RippleRings from "@/components/RippleRings";
import StatusChip from "@/components/StatusChip";
import { formatDate, formatDateTime } from "@/lib/legacy";
import { maskReference } from "@/lib/biometric";

function Field({ label, value, mono }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/25">{label}</p>
      <p
        className={`mt-1 text-[11.5px] text-foreground/75 ${mono ? "font-mono tracking-[0.04em]" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function IdentityCard({ identity }) {
  const verificationLabel =
    identity.verification_status === "verified"
      ? "Verified"
      : identity.verification_status === "failed"
        ? "Last attempt failed"
        : "Not yet verified";

  return (
    <section className="rounded-2xl border border-gold/12 bg-gradient-to-br from-[#131109] to-[#0b0b0d] p-6 sm:p-7">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-28 w-28 shrink-0">
          <RippleRings count={3} duration={9} />
          <div className="absolute inset-0 flex items-center justify-center">
            <FingerprintMark id="identity-card" framed className="h-24 w-24" />
          </div>
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <StatusChip status="enrolled" label="Registered finger" />
            <StatusChip
              status={
                identity.verification_status === "failed"
                  ? "failed"
                  : identity.verification_status === "verified"
                    ? "verified"
                    : "neutral"
              }
              label={verificationLabel}
            />
          </div>
          <p className="mt-3 font-display text-[26px] font-light text-foreground">{identity.finger}</p>
          <p className="mt-1 text-[11.5px] text-foreground/40">
            Enrolled {formatDate(identity.enrolled_date)} ·{" "}
            {identity.re_enrolments || 0} replacement
            {(identity.re_enrolments || 0) === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.06] pt-6 sm:grid-cols-3">
        <Field label="Last verified" value={formatDateTime(identity.last_verified_date)} />
        <Field
          label="Failed authentications"
          value={String(identity.failed_attempts || 0)}
        />
        <Field label="Ridge quality" value={`${identity.quality_score || "—"}%`} />
        <Field label="Reader" value={identity.device_label || "—"} />
        <Field label="Biometric reference" value={maskReference(identity.template_reference)} mono />
        <Field
          label="Recovery"
          value={
            identity.recovery_status === "none"
              ? "No request open"
              : identity.recovery_status.replace(/_/g, " ")
          }
        />
      </div>
    </section>
  );
}