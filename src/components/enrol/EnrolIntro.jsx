import React from "react";
import { Link } from "react-router-dom";
import { Loader2, PlugZap, ShieldCheck, Fingerprint } from "lucide-react";
import FingerprintReader from "@/components/FingerprintReader";
import StatusChip from "@/components/StatusChip";
import { cn } from "@/lib/utils";

export const FINGERS = [
  "Right thumb",
  "Right index",
  "Right middle",
  "Left thumb",
  "Left index",
  "Left middle",
];

export default function EnrolIntro({
  finger,
  setFinger,
  reader,
  onConnect,
  onStart,
  busy,
  reEnrol,
  simulateFail,
  setSimulateFail,
  stepLabel,
}) {
  const connected = reader.status === "connected";

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
      <div className="flex flex-col items-center justify-center">
        <FingerprintReader state="idle" id="enrol-intro" size="lg" />
        <div className="mt-6 flex items-center gap-2 rounded-full border border-gold/15 bg-white/[0.02] px-3.5 py-2">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              connected ? "bg-emerald-400" : "bg-foreground/25",
            )}
          />
          <span className="text-[9.5px] uppercase tracking-[0.2em] text-foreground/45">
            {connected ? "Reader connected" : "Reader not connected"}
          </span>
        </div>
      </div>

      <div className="space-y-7">
        <div>
          <h2 className="eyebrow">{stepLabel || "Fingerprint enrolment"}</h2>
          <h3 className="mt-2 font-display text-[24px] font-light text-foreground">
            Choose your finger
          </h3>
          <p className="mt-1 text-[11.5px] leading-relaxed text-foreground/35">
            Use the same finger every time you pay. This cannot be changed quietly later.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {FINGERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFinger(f)}
                disabled={busy}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-[10.5px] uppercase tracking-[0.14em] transition",
                  finger === f
                    ? "border-gold/50 bg-gold/[0.1] text-gold-soft"
                    : "border-white/[0.08] text-foreground/35 hover:border-white/20 hover:text-foreground/60",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-foreground/40">
            <Fingerprint className="h-3.5 w-3.5 text-gold/60" strokeWidth={1.5} />
            How to place your finger
          </p>
          <ol className="mt-3 space-y-2 text-[11.5px] leading-relaxed text-foreground/45">
            <li>1. Place your {finger.toLowerCase()} flat on the sensor, covering the glowing ring.</li>
            <li>2. Hold still until the ring completes, then lift and place it again.</li>
            <li>3. Repeat five times with the same finger to build the reference.</li>
          </ol>
        </div>

        {!connected && (
          <button
            type="button"
            onClick={onConnect}
            disabled={reader.status === "connecting"}
            className="btn-gold-ghost h-11 w-full text-[10.5px] uppercase tracking-[0.2em]"
          >
            {reader.status === "connecting" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Connecting to reader
              </>
            ) : (
              <>
                <PlugZap className="h-3.5 w-3.5" />
                Connect fingerprint reader
              </>
            )}
          </button>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={onStart}
            disabled={busy}
            className="btn-gold"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Contacting reader
              </>
            ) : reEnrol ? (
              "Begin re-enrolment"
            ) : (
              "Begin enrolment"
            )}
          </button>

          <button
            type="button"
            onClick={() => setSimulateFail((v) => !v)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition",
              simulateFail
                ? "border-red-400/25 bg-red-400/[0.05]"
                : "border-white/[0.06] hover:border-white/15",
            )}
          >
            <span className="text-[10.5px] text-foreground/40">
              Demo control · simulate a failed scan
            </span>
            <span
              className={cn(
                "relative h-4 w-8 rounded-full transition",
                simulateFail ? "bg-red-400/60" : "bg-white/10",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all",
                  simulateFail ? "left-4" : "left-0.5",
                )}
              />
            </span>
          </button>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.03] p-3.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/70" strokeWidth={1.5} />
          <p className="text-[10.5px] leading-relaxed text-foreground/40">
            The reader returns an opaque reference only. No fingerprint image or raw template is
            ever sent to LEGACY.{" "}
            <Link to="/identity" className="text-gold/70 underline-offset-2 hover:underline">
              How identity is stored
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusChip status="neutral" label="Simulated reader" />
          <span className="text-[9.5px] uppercase tracking-[0.18em] text-foreground/20">
            {reader.device || "LGC-R2"}
          </span>
        </div>
      </div>
    </div>
  );
}