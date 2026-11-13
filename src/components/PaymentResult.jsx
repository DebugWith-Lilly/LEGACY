import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, ShieldCheck } from "lucide-react";
import RippleRings from "@/components/RippleRings";
import FingerprintMark from "@/components/FingerprintMark";
import { formatMoney } from "@/lib/legacy";

export default function PaymentResult({ result, onRetry, retryLabel = "Try again" }) {
  const navigate = useNavigate();
  const ok = result.status === "authorised";

  return (
    <div className="flex flex-col items-center py-4 text-center">
      <div className="relative h-48 w-48">
        {ok && <RippleRings count={4} duration={5} color="rgba(201,169,110,0.5)" />}
        <div className="absolute inset-0 flex items-center justify-center">
          <FingerprintMark
            id={ok ? "pay-ok" : "pay-no"}
            framed
            className={`h-32 w-32 ${ok ? "" : "opacity-45"}`}
          />
        </div>
        <span
          className={`absolute -bottom-1 right-2 flex h-10 w-10 items-center justify-center rounded-full border ${
            ok
              ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-300"
              : "border-red-400/30 bg-red-400/15 text-red-300"
          }`}
        >
          {ok ? <Check className="h-4 w-4" strokeWidth={2} /> : <X className="h-4 w-4" strokeWidth={2} />}
        </span>
      </div>

      <p className="mt-8 eyebrow">
        {ok ? "Authorised by fingerprint" : "Not authorised"}
      </p>
      <h2 className="mt-2 font-display text-[30px] font-light text-foreground">
        {ok ? "Payment complete" : "Payment declined"}
      </h2>
      <p className="mt-2 font-display text-[26px] font-light gold-text">
        {formatMoney(result.amount, result.currency)}
      </p>
      <p className="mt-1 text-[12px] text-foreground/45">{result.counterparty}</p>

      {!ok && result.reason && (
        <p className="mt-4 max-w-sm rounded-xl border border-red-400/20 bg-red-400/[0.05] px-3.5 py-2.5 text-[11px] leading-relaxed text-red-200/70">
          {result.reason}
        </p>
      )}

      <div className="mt-7 w-full max-w-sm divide-y divide-white/[0.06] rounded-xl border border-white/[0.07] bg-white/[0.02] text-left">
        <Row label="Reference" value={result.reference} mono />
        <Row label="Channel" value={result.channel} />
        <Row label="Biometric result" value={result.result_code || "—"} mono />
        <Row
          label="Match score"
          value={result.match_score ? `${result.match_score}%` : "—"}
        />
        <Row label="Identity reference" value={result.identity_reference} mono />
        {ok && result.balance_after !== undefined && (
          <Row label="Balance after" value={formatMoney(result.balance_after, result.currency)} />
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-foreground/25">
        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
        Simulated biometric verification
      </p>

      <div className="mt-7 flex w-full max-w-sm flex-col gap-2.5">
        <button type="button" onClick={() => navigate("/")} className="btn-gold">
          Done
        </button>
        {!ok && (
          <button type="button" onClick={onRetry} className="btn-gold-ghost h-11">
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5">
      <span className="text-[9.5px] uppercase tracking-[0.2em] text-foreground/30">{label}</span>
      <span
        className={`text-right text-[11px] text-foreground/75 ${mono ? "font-mono tracking-[0.04em]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
