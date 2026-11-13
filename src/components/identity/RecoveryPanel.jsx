import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LifeBuoy, Loader2, ShieldAlert } from "lucide-react";
import StatusChip from "@/components/StatusChip";
import { formatDateTime } from "@/lib/legacy";

export default function RecoveryPanel({ identity, busy, onRequestRecovery }) {
  const [confirming, setConfirming] = useState(false);
  const open = identity.recovery_status && identity.recovery_status !== "none";

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
        <h2 className="eyebrow">Replace registered finger</h2>
        <p className="mt-2 text-[11.5px] leading-relaxed text-foreground/40">
          If you change the finger you pay with, the old reference is revoked and a new one is
          issued. This never happens from ordinary profile editing.
        </p>

        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="btn-gold-ghost mt-4 h-11 w-full text-[10.5px] uppercase tracking-[0.18em]"
          >
            Re-enrol my fingerprint
          </button>
        ) : (
          <div className="mt-4 rounded-xl border border-red-400/25 bg-red-400/[0.05] p-4">
            <p className="flex items-center gap-2 text-[11px] text-red-200/80">
              <ShieldAlert className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              Revoke {identity.finger} and enrol a new finger?
            </p>
            <p className="mt-2 text-[10.5px] leading-relaxed text-foreground/40">
              {identity.finger} will stop authorising payments immediately. You will complete a new
              five-placement enrolment before your next payment.
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                to="/enroll?re=1"
                className="flex-1 rounded-full border border-red-400/40 bg-red-400/10 py-2 text-center text-[10px] uppercase tracking-[0.16em] text-red-200/80"
              >
                Continue
              </Link>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="flex-1 rounded-full border border-white/10 py-2 text-[10px] uppercase tracking-[0.16em] text-foreground/40"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="eyebrow">Reader unavailable?</h2>
            <p className="mt-2 text-[11.5px] leading-relaxed text-foreground/40">
              If your fingerprint reader is lost, damaged or offline, open an account recovery
              request. Payments stay blocked until identity review is complete.
            </p>
          </div>
          <LifeBuoy className="mt-1 h-5 w-5 shrink-0 text-gold/40" strokeWidth={1.5} />
        </div>

        {open ? (
          <div className="mt-4 rounded-xl border border-gold/20 bg-gold/[0.04] px-3.5 py-3">
            <StatusChip
              status={identity.recovery_status === "requested" ? "requested" : identity.recovery_status === "approved" ? "approved" : "reviewing"}
              label="Recovery requested"
            />
            <p className="mt-2 text-[10.5px] leading-relaxed text-foreground/40">
              Logged {formatDateTime(identity.recovery_requested_date)}. Your bank or payment
              provider completes the identity review.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={onRequestRecovery}
            disabled={busy}
            className="btn-gold-ghost mt-4 h-11 w-full text-[10.5px] uppercase tracking-[0.18em]"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Request account recovery
          </button>
        )}
      </section>
    </div>
  );
}