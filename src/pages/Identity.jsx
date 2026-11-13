import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import useLegacyProfile from "@/hooks/useLegacyProfile";
import IdentityCard from "@/components/identity/IdentityCard";
import VerificationPanel from "@/components/identity/VerificationPanel";
import RecoveryPanel from "@/components/identity/RecoveryPanel";
import FingerprintMark from "@/components/FingerprintMark";
import { verifyFingerprint } from "@/lib/biometric";

export default function Identity() {
  const { identity, loading, reload } = useLegacyProfile();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [recoveryBusy, setRecoveryBusy] = useState(false);

  const runVerification = async (simulate) => {
    if (!identity) return;
    setRunning(true);
    const verdict = await verifyFingerprint({
      reference: identity.template_reference,
      simulate,
    });
    setResult({ ...verdict, at: new Date().toISOString() });

    if (verdict.verified) {
      await base44.entities.BiometricIdentity.update(identity.id, {
        verification_status: "verified",
        last_verified_date: new Date().toISOString(),
        failed_attempts: identity.failed_attempts || 0,
      });
    } else if (verdict.result_code !== "READER_UNAVAILABLE") {
      await base44.entities.BiometricIdentity.update(identity.id, {
        verification_status: "failed",
        failed_attempts: (identity.failed_attempts || 0) + 1,
      });
    }
    await reload();
    setRunning(false);
  };

  const requestRecovery = async () => {
    if (!identity) return;
    setRecoveryBusy(true);
    await base44.entities.BiometricIdentity.update(identity.id, {
      recovery_status: "requested",
      recovery_requested_date: new Date().toISOString(),
    });
    await reload();
    setRecoveryBusy(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-gold/60" />
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <FingerprintMark id="identity-empty" framed className="mx-auto h-28 w-28" />
        <h1 className="mt-7 font-display text-[30px] font-light text-foreground">
          No fingerprint registered
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[12px] leading-relaxed text-foreground/40">
          Register your finger to create the identity that authorises every LEGACY payment.
        </p>
        <Link to="/enroll" className="btn-gold mt-7 inline-flex w-full max-w-xs">
          Register your fingerprint
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow">Biometric identity</p>
        <h1 className="mt-2 font-display text-[32px] font-light leading-none text-foreground">
          Your identity
        </h1>
        <p className="mt-2 text-[11.5px] text-foreground/35">
          One fingerprint authorises every terminal payment and every phone-to-phone transfer.
        </p>
      </header>

      <IdentityCard identity={identity} />

      <div className="grid gap-4 lg:grid-cols-2">
        <VerificationPanel
          identity={identity}
          running={running}
          result={result}
          onVerify={runVerification}
        />
        <RecoveryPanel
          identity={identity}
          busy={recoveryBusy}
          onRequestRecovery={requestRecovery}
        />
      </div>
    </div>
  );
}