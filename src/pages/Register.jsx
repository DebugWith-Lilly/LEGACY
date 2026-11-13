import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { signInWithProvider } from "@/lib/authMfaFlow";
import MfaFlow from "@/components/MfaFlow";
import { MfaScreen } from "@/components/MfaParts";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import FingerprintMark from "@/components/FingerprintMark";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";
import { Check, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Details", "Verify", "Fingerprint"];

function StepBar({ current }) {
  return (
    <div className="mb-7 flex gap-1.5">
      {STEPS.map((step, i) => (
        <div key={step} className="flex-1">
          <div
            className={cn(
              "h-[3px] rounded-full transition-colors duration-500",
              i <= current ? "bg-gold" : "bg-white/10",
            )}
          />
          <p
            className={cn(
              "mt-2 text-[8.5px] uppercase tracking-[0.16em]",
              i <= current ? "text-gold/70" : "text-foreground/25",
            )}
          >
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [mfaChallenge, setMfaChallenge] = useState(null);

  const returnTo = safeReturnTo();
  const enrolUrl = "/enroll?onboarding=1";
  const loginPath =
    "/login" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (fullName.trim().length < 2) {
      setError("Enter your full name as it appears on your ID.");
      return;
    }
    if (!/^[0-9+()\s-]{7,}$/.test(phone.trim())) {
      setError("Enter a valid phone number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!accepted) {
      setError("Please accept the Terms and Conditions to continue.");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.mfa_required) {
        setMfaChallenge(result);
        return;
      }
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      try {
        const me = await base44.auth.me();
        await base44.entities.MemberProfile.create({
          user_id: me.id,
          full_name: fullName.trim(),
          phone_number: phone.trim(),
          member_since: new Date().toISOString(),
        });
      } catch {
        // The member profile is created on first visit if this call is skipped.
      }
      window.location.href = returnTo !== "/" ? returnTo : enrolUrl;
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({
        title: "Code sent",
        description: "Check your email for the new code.",
      });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithProvider("google", returnTo !== "/" ? returnTo : enrolUrl);
    } catch (err) {
      setError(err.message || "Unable to sign in with Google");
    }
  };

  // The account is verified; the second sign-in step replaces the whole page and finishes signing in.
  if (mfaChallenge)
    return (
      <MfaScreen>
        <MfaFlow challenge={mfaChallenge} returnTo={enrolUrl} />
      </MfaScreen>
    );

  if (showOtp) {
    return (
      <AuthLayout
        title="Verify your email"
        subtitle={`We sent a six-digit code to ${email}. Next you will register your fingerprint.`}
      >
        <StepBar current={1} />
        {error && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-[12.5px] text-destructive">
            {error}
          </div>
        )}
        <div className="mb-6 flex justify-center">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <button
          type="button"
          className="btn-gold"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying…
            </>
          ) : (
            "Verify and continue"
          )}
        </button>
        <p className="mt-4 text-center text-[11.5px] text-foreground/35">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="font-medium text-gold hover:text-gold-soft">
            Resend
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your LEGACY account"
      subtitle="One enrolment. Every payment, everywhere."
      footer={
        <>
          Already registered?{" "}
          <Link to={loginPath} className="font-medium text-gold transition hover:text-gold-soft">
            Log in
          </Link>
        </>
      }
    >
      <StepBar current={0} />

      <button type="button" onClick={handleGoogle} className="btn-gold-ghost h-12 w-full">
        <GoogleIcon className="h-4 w-4" />
        Continue with Google
      </button>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gold/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#0d0d10] px-3 text-[9px] uppercase tracking-[0.32em] text-foreground/30">
            or email
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-[12.5px] text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="relative">
          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40" />
          <input
            type="text"
            autoComplete="name"
            autoFocus
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="field pl-11"
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40" />
          <input
            type="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field pl-11"
            required
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40" />
          <input
            type="tel"
            autoComplete="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="field pl-11"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40" />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field pl-11"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40" />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="field pl-11"
            required
          />
        </div>

        <button
          type="button"
          onClick={() => setAccepted((v) => !v)}
          className="flex w-full items-start gap-2.5 pt-1 text-left"
        >
          <span
            className={cn(
              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
              accepted ? "border-gold bg-gold text-ink" : "border-gold/30 bg-white/[0.03]",
            )}
          >
            {accepted && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
          <span className="text-[10.5px] leading-relaxed text-foreground/40">
            I accept the LEGACY Terms and Conditions and consent to my fingerprint being used as my
            payment identity.
          </span>
        </button>

        <button type="submit" className="btn-gold mt-1" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <div className="mt-5 flex items-center gap-3 rounded-xl border border-gold/15 bg-gold/[0.04] p-3.5">
        <FingerprintMark id="register-teaser" className="h-7 w-7 shrink-0" />
        <div>
          <p className="text-[10.5px] text-foreground/70">Next: register your fingerprint</p>
          <p className="mt-0.5 text-[10px] text-foreground/35">
            Your finger becomes your payment identity.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}