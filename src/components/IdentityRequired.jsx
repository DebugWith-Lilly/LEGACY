import React from "react";
import { Link } from "react-router-dom";
import FingerprintMark from "@/components/FingerprintMark";
import RippleRings from "@/components/RippleRings";

export default function IdentityRequired({ title = "Fingerprint required" }) {
  return (
    <div className="mx-auto max-w-md py-8 text-center">
      <div className="relative mx-auto h-32 w-32">
        <RippleRings count={3} duration={7} />
        <div className="absolute inset-0 flex items-center justify-center">
          <FingerprintMark id="identity-required" framed className="h-28 w-28" />
        </div>
      </div>
      <h2 className="mt-7 font-display text-[26px] font-light text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-sm text-[11.5px] leading-relaxed text-foreground/40">
        Payments are authorised by your registered fingerprint identity. Register your finger once —
        it then works at every terminal and every recipient phone.
      </p>
      <Link to="/enroll" className="btn-gold mt-7 inline-flex w-full max-w-xs">
        Register your fingerprint
      </Link>
    </div>
  );
}