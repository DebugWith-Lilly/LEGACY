import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, RefreshCw, ShieldAlert, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import useLegacyProfile from "@/hooks/useLegacyProfile";
import EnrolIntro from "@/components/enrol/EnrolIntro";
import EnrolScanning from "@/components/enrol/EnrolScanning";
import EnrolSuccess from "@/components/enrol/EnrolSuccess";
import FingerprintMark from "@/components/FingerprintMark";
import StatusChip from "@/components/StatusChip";
import { connectReader, enrolFingerprint, READER_DEVICE, READER_MODEL } from "@/lib/biometric";
import { formatDate } from "@/lib/legacy";

export default function EnrolFingerprint() {
  const { user, identity, loading, reload } = useLegacyProfile();
  const [finger, setFinger] = useState("Right index");
  const [reader, setReader] = useState({ status: "idle" });
  const [stage, setStage] = useState("intro");
  const [quality, setQuality] = useState([]);
  const [error, setError] = useState("");
  const [simulateFail, setSimulateFail] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(null);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const cancelled = useRef(false);

  const params = new URLSearchParams(window.location.search);
  const onboarding = params.get("onboarding") === "1";
  const reEnrol = params.get("re") === "1";
  const alreadyRegistered = identity?.status === "enrolled" && !reEnrol;

  const connect = async () => {
    setReader({ status: "connecting" });
    const conn = await connectReader();
    setReader({ status: "connected", ...conn });
  };

  const persist = async (result) => {
    const now = new Date().toISOString();
    const payload = {
      user_id: user.id,
      user_email: user.email,
      status: "enrolled",
      finger,
      template_reference: result.reference,
      quality_score: result.quality_score,
      device_label: `${READER_DEVICE} · ${READER_MODEL}`,
      enrolled_date: now,
      last_verified_date: now,
      verification_status: "verified",
      failed_attempts: 0,
      recovery_status: "none",
    };
    if (identity?.id) {
      await base44.entities.BiometricIdentity.update(identity.id, {
        ...payload,
        re_enrolments: (identity.re_enrolments || 0) + 1,
      });
    } else {
      await base44.entities.BiometricIdentity.create({ ...payload, re_enrolments: 0 });
    }
    await reload();
  };

  const start = async () => {
    cancelled.current = false;
    setError("");
    setQuality([]);
    setStage("scanning");
    setBusy(true);
    try {
      if (reader.status !== "connected") {
        setReader({ status: "connecting" });
        const conn = await connectReader();
        setReader({ status: "connected", ...conn });
      }
      const result = await enrolFingerprint({
        scans: 5,
        failAt: simulateFail ? 3 : null,
        onScan: (n, q) => {
          if (!cancelled.current) setQuality((prev) => [...prev, q]);
        },
      });
      if (cancelled.current) return;
      if (!result.ok) {
        setError(result.message);
        setStage("error");
        return;
      }
      await persist(result);
      if (cancelled.current) return;
      setSaved({
        finger,
        quality: result.quality_score,
        reference: result.reference,
        date: new Date().toISOString(),
        device: `${READER_DEVICE} · ${READER_MODEL}`,
      });
      setStage("success");
    } catch (err) {
      setError(err.message || "Enrolment could not be completed. Please try again.");
      setStage("error");
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    cancelled.current = true;
    setStage("intro");
    setQuality([]);
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-gold/60" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-foreground/30 transition hover:text-foreground/70"
      >
        <ArrowLeft className="h-3 w-3" />
        Overview
      </Link>

      <header className="mt-5">
        <p className="eyebrow">
          {onboarding ? "Account setup · payment identity" : "Biometric identity"}
        </p>
        <h1 className="mt-3 font-display text-[34px] leading-[1.08] text-foreground sm:text-[38px]">
          Register Your Fingerprint
        </h1>
        <p className="mt-3 max-w-lg text-[12.5px] leading-relaxed text-foreground/40">
          Your fingerprint is your payment identity. Register your preferred finger once and use it
          to authorise your LEGACY payments.
        </p>
      </header>

      <div className="mt-8 rounded-[26px] border border-gold/12 bg-ink-soft/50 p-6 sm:p-9">
        {alreadyRegistered ? (
          <div className="flex flex-col items-center text-center">
            <FingerprintMark id="enrol-existing" framed className="h-28 w-28" />
            <h2 className="mt-6 font-display text-[24px] font-light text-foreground">
              Your fingerprint is already registered
            </h2>
            <p className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11.5px] text-foreground/40">
              <span>{identity.finger}</span>
              <span className="h-2.5 w-px bg-white/10" />
              <span>enrolled {formatDate(identity.enrolled_date)}</span>
              <StatusChip status="enrolled" label="Registered" />
            </p>

            <p className="mt-6 max-w-sm rounded-xl border border-gold/15 bg-gold/[0.04] px-3.5 py-3 text-[11px] leading-relaxed text-foreground/45">
              Profile changes never alter your biometric identity. Replacing your registered finger
              revokes the current reference and issues a new one.
            </p>

            {!confirmReplace ? (
              <div className="mt-6 flex w-full max-w-sm flex-col gap-2.5">
                <Link to="/identity" className="btn-gold">
                  Manage identity
                </Link>
                <button
                  type="button"
                  onClick={() => setConfirmReplace(true)}
                  className="btn-gold-ghost h-11 text-[10.5px] uppercase tracking-[0.18em]"
                >
                  Replace registered finger
                </button>
              </div>
            ) : (
              <div className="mt-6 w-full max-w-sm rounded-xl border border-red-400/25 bg-red-400/[0.05] p-4 text-left">
                <p className="flex items-center gap-2 text-[11px] text-red-200/80">
                  <ShieldAlert className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  Replace {identity.finger}?
                </p>
                <p className="mt-2 text-[10.5px] leading-relaxed text-foreground/40">
                  Your current reference stops authorising payments immediately. You will be asked to
                  enrol the new finger now.
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
                    onClick={() => setConfirmReplace(false)}
                    className="flex-1 rounded-full border border-white/10 py-2 text-[10px] uppercase tracking-[0.16em] text-foreground/40"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {reEnrol && (
              <div className="mb-7 flex items-start gap-2.5 rounded-xl border border-gold/20 bg-gold/[0.04] p-3.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
                <p className="text-[10.5px] leading-relaxed text-foreground/45">
                  You are replacing the finger registered on {formatDate(identity?.enrolled_date)}.
                  The existing reference will be revoked once the new enrolment completes.
                </p>
              </div>
            )}

            {stage === "intro" && (
              <EnrolIntro
                finger={finger}
                setFinger={setFinger}
                reader={reader}
                onConnect={connect}
                onStart={start}
                busy={busy}
                reEnrol={reEnrol}
                simulateFail={simulateFail}
                setSimulateFail={setSimulateFail}
                stepLabel={onboarding ? "Account setup · fingerprint" : "Registered identity"}
              />
            )}

            {stage === "scanning" && (
              <EnrolScanning finger={finger} quality={quality} onCancel={cancel} />
            )}

            {stage === "error" && (
              <div className="flex flex-col items-center py-4 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-red-400/25 bg-red-400/[0.08] text-red-300">
                  <AlertTriangle className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 font-display text-[24px] font-light text-foreground">
                  Enrolment did not complete
                </h3>
                <p className="mt-2 max-w-sm text-[11.5px] leading-relaxed text-foreground/45">
                  {error}
                </p>
                <div className="mt-7 flex w-full max-w-sm flex-col gap-2.5">
                  <button type="button" onClick={start} className="btn-gold" disabled={busy}>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry enrolment
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage("intro")}
                    className="btn-gold-ghost h-11 text-[10.5px] uppercase tracking-[0.18em]"
                  >
                    Review instructions
                  </button>
                </div>
              </div>
            )}

            {stage === "success" && saved && (
              <EnrolSuccess
                result={saved}
                reEnrol={reEnrol}
                onboarding={onboarding}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}