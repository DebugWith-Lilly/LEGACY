import React from "react";
import { Loader2, Fingerprint } from "lucide-react";
import StatusChip from "@/components/StatusChip";
import { formatDateTime } from "@/lib/legacy";
import { maskReference } from "@/lib/biometric";
import { cn } from "@/lib/utils";

const CONTROLS = [
  { key: "match", label: "Genuine finger" },
  { key: "mismatch", label: "Different finger" },
  { key: "noread", label: "Reader offline" },
];

export default function VerificationPanel({ identity, running, result, onVerify }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
      <h2 className="eyebrow">Test verification</h2>
      <p className="mt-2 text-[11.5px] leading-relaxed text-foreground/40">
        The reader compares a presented finger against your registered reference and returns a
        verdict only. Failed attempts are recorded against your account.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {CONTROLS.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => onVerify(c.key)}
            disabled={running}
            className={cn(
              "flex items-center gap-2 rounded-full border border-white/[0.08] px-3.5 py-2 text-[10px] uppercase tracking-[0.14em] text-foreground/45 transition hover:border-gold/40 hover:text-gold-soft",
              running && "opacity-50",
            )}
          >
            {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Fingerprint className="h-3 w-3" />}
            {c.label}
          </button>
        ))}
      </div>

      {result && (
        <div className="mt-4 flex flex-wrap items-center gap-2.5 rounded-xl border border-white/[0.06] bg-ink-soft/60 px-3.5 py-3">
          <StatusChip
            status={result.verified ? "verified" : "failed"}
            label={
              result.verified
                ? "Match"
                : result.result_code === "READER_UNAVAILABLE"
                  ? "Reader offline"
                  : "No match"
            }
          />
          <span className="font-mono text-[10.5px] tracking-[0.08em] text-foreground/50">
            {result.result_code}
          </span>
          <span className="text-[10.5px] text-foreground/35">
            score {result.match_score ? `${result.match_score}%` : "—"}
          </span>
          <span className="text-[10.5px] text-foreground/25">{formatDateTime(result.at)}</span>
        </div>
      )}

      <div className="mt-6 border-t border-white/[0.06] pt-5">
        <h3 className="eyebrow">What the bank or merchant receives</h3>
        <div className="mt-3 divide-y divide-white/[0.05]">
          <Row label="Decision" value={result ? (result.verified ? "AUTHORISED" : "DECLINED") : "—"} />
          <Row
            label="Match score"
            value={result?.match_score ? `${result.match_score}%` : "—"}
          />
          <Row label="Identity reference" value={maskReference(identity.template_reference)} mono />
          <Row label="Occurred" value={formatDateTime(result?.at || identity.last_verified_date)} />
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-foreground/25">
          A verification result is all a payment application ever receives — never a fingerprint
          image or raw template.
        </p>
      </div>
    </section>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-[9.5px] uppercase tracking-[0.2em] text-foreground/30">{label}</span>
      <span
        className={`text-right text-[11px] text-foreground/70 ${mono ? "font-mono tracking-[0.04em]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}