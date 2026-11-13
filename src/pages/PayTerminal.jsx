import React, { useState } from "react";
import { Loader2, ScanLine, ShieldCheck } from "lucide-react";
import useLegacyProfile from "@/hooks/useLegacyProfile";
import FingerprintReader from "@/components/FingerprintReader";
import PaymentResult from "@/components/PaymentResult";
import IdentityRequired from "@/components/IdentityRequired";
import SimulateControl from "@/components/SimulateControl";
import { authorisePayment } from "@/lib/payment";
import { currencySymbol, formatMoney } from "@/lib/legacy";
import { cn } from "@/lib/utils";

const MERCHANTS = ["Blue Bottle Coffee", "Whole Foods Market", "Apple Store", "Uber"];

export default function PayTerminal() {
  const { user, identity, wallet, loading, reload } = useLegacyProfile();
  const [stage, setStage] = useState("form");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [simulate, setSimulate] = useState("match");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const enrolled = identity?.status === "enrolled";

  const present = async () => {
    const value = Number(amount);
    if (!merchant.trim()) {
      setError("Enter the merchant you are paying.");
      return;
    }
    if (!value || value <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    setError("");
    setBusy(true);
    setStage("reader");
    try {
      const res = await authorisePayment({
        user,
        wallet,
        identity,
        amount: value,
        type: "finger_to_machine",
        counterparty: merchant.trim(),
        channel: "Finger-to-Machine · NFC terminal",
        note: note.trim(),
        simulate,
      });
      setResult(res);
      await reload();
      setStage("result");
    } catch (err) {
      setError(err.message || "The payment could not be completed.");
      setStage("form");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-gold/60" />
      </div>
    );
  }

  if (!enrolled) {
    return <IdentityRequired title="Fingerprint required to pay" />;
  }

  return (
    <div className="mx-auto max-w-lg">
      <header className="mb-7">
        <p className="eyebrow">Finger-to-Machine</p>
        <h1 className="mt-2 font-display text-[32px] font-light leading-none text-foreground">
          {stage === "result" ? "Payment result" : "Pay at a terminal"}
        </h1>
      </header>

      {stage === "form" && (
        <>
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/25 bg-red-400/[0.06] px-3.5 py-2.5 text-[11.5px] text-red-200/80">
              {error}
            </div>
          )}

          <div className="space-y-5 rounded-[26px] border border-gold/12 bg-ink-soft/50 p-6 sm:p-8">
            <div>
              <label className="eyebrow block" htmlFor="merchant">
                Merchant
              </label>
              <input
                id="merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Who are you paying?"
                className="field mt-2"
              />
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {MERCHANTS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMerchant(m)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[9.5px] tracking-[0.08em] transition",
                      merchant === m
                        ? "border-gold/40 text-gold-soft"
                        : "border-white/[0.07] text-foreground/30 hover:text-foreground/60",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="eyebrow block" htmlFor="amount">
                Amount
              </label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-[19px] text-gold/60">
                  {currencySymbol(wallet?.currency)}
                </span>
                <input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                  inputMode="decimal"
                  placeholder="0.00"
                  className="field pl-9 font-display text-[19px]"
                />
              </div>
              <p className="mt-2 text-[10.5px] text-foreground/30">
                Available {formatMoney(wallet?.balance, wallet?.currency)}
              </p>
            </div>

            <div>
              <label className="eyebrow block" htmlFor="note">
                Note <span className="text-foreground/20">(optional)</span>
              </label>
              <input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What is this for?"
                className="field mt-2"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
              <ScanLine className="h-4 w-4 shrink-0 text-gold/50" strokeWidth={1.5} />
              <p className="text-[10.5px] leading-relaxed text-foreground/35">
                The terminal checks your presented finger against your registered identity before
                authorising.
              </p>
            </div>

            <button type="button" onClick={present} disabled={busy} className="btn-gold">
              Authorise with fingerprint
            </button>

            <SimulateControl value={simulate} onChange={setSimulate} />
          </div>
        </>
      )}

      {stage === "reader" && (
        <div className="rounded-[26px] border border-gold/15 bg-ink-soft/60 p-8">
          <div className="flex flex-col items-center text-center">
            <FingerprintReader state="scanning" progress={0.68} size="lg" id="terminal-scan" />
            <h2 className="mt-7 font-display text-[24px] font-light text-foreground">
              Present your finger
            </h2>
            <p className="mt-1.5 text-[12px] text-foreground/45">
              {merchant} · {formatMoney(amount, wallet?.currency)}
            </p>
            <p className="mt-5 text-[10.5px] uppercase tracking-[0.2em] text-foreground/25">
              {identity.finger} · LGC-R2 terminal
            </p>
            <p className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-gold/50">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
              Checking against your registered identity
            </p>
          </div>
        </div>
      )}

      {stage === "result" && result && (
        <div className="rounded-[26px] border border-gold/12 bg-ink-soft/50 p-6 sm:p-8">
          <PaymentResult
            result={result}
            onRetry={() => {
              setStage("form");
              setResult(null);
            }}
            retryLabel="Try the payment again"
          />
        </div>
      )}
    </div>
  );
}