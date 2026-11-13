import React from "react";
import FingerprintMark from "@/components/FingerprintMark";
import RippleRings from "@/components/RippleRings";
import Wordmark from "@/components/Wordmark";

const PILLARS = [
  { label: "Finger identity", detail: "One enrolment, every payment" },
  { label: "Ripple connection", detail: "Identity · technology · money" },
  { label: "NFC transaction", detail: "Terminal or phone, same identity" },
];

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink">
      <div className="pointer-events-none absolute -left-52 -top-52 h-[560px] w-[560px] rounded-full bg-gold/[0.07] blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-56 right-[-10%] h-[520px] w-[520px] rounded-full bg-gold/[0.05] blur-[140px]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_408px] lg:gap-20 lg:py-20">
        {/* Brand panel — desktop */}
        <div className="hidden flex-col lg:flex">
          <Wordmark size="md" id="auth-brand" />

          <div className="relative mt-12 h-56 w-56">
            <RippleRings count={4} duration={7} />
            <div className="absolute inset-0 flex items-center justify-center">
              <FingerprintMark id="auth-hero" framed className="h-40 w-40" />
            </div>
          </div>

          <h2 className="mt-12 max-w-md font-display text-[42px] font-light leading-[1.08] text-foreground">
            Your Finger.
            <span className="gold-text block">Your Finance.</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-foreground/45">
            The biometric payment identity layer for banks and payment providers, live in markets
            worldwide. Enrol once — verify at every terminal, and every phone.
          </p>
          <p className="mt-6 max-w-sm font-display text-[15px] italic leading-relaxed text-gold/60">
            An effortless way to pay. Unmistakably LEGACY.
          </p>

          <div className="mt-11 flex flex-wrap gap-x-9 gap-y-4">
            {PILLARS.map((p) => (
              <div key={p.label} className="border-l border-gold/20 pl-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80">
                  {p.label}
                </p>
                <p className="mt-1 text-[11px] text-foreground/35">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form column */}
        <div className="w-full">
          <div className="mb-11 flex flex-col items-center text-center lg:hidden">
            <div className="relative h-24 w-24">
              <RippleRings count={3} duration={6} />
              <div className="absolute inset-0 flex items-center justify-center">
                <FingerprintMark id="auth-hero-m" framed className="h-20 w-20" />
              </div>
            </div>
            <Wordmark size="sm" showMark={false} className="mt-5" id="auth-brand-m" />
            <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-gold/50">
              Your Finger. Your Finance.
            </p>
          </div>

          <div className="rounded-[26px] border border-gold/12 bg-white/[0.025] p-7 shadow-[0_40px_120px_-60px_rgba(201,169,110,0.55)] backdrop-blur-sm sm:p-9">
            <div className="mb-8">
              <h1 className="font-display text-[30px] font-light leading-tight text-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/45">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </div>

          {footer && (
            <p className="mt-6 text-center text-[13px] text-foreground/45">{footer}</p>
          )}
        </div>
      </div>

      <p className="relative pb-6 text-center text-[9px] uppercase tracking-[0.32em] text-foreground/20">
        Prototype environment · biometric verification simulated
      </p>
    </div>
  );
}