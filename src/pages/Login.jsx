import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginWithMfa } from "@/lib/authMfa";
import { signInWithProvider } from "@/lib/authMfaFlow";
import MfaFlow from "@/components/MfaFlow";
import { MfaScreen } from "@/components/MfaParts";
import { Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState(null);
  // Post-login destination (e.g. the MCP OAuth consent page sends users here
  // with returnTo so the grant flow can resume). Same-origin paths only.
  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginWithMfa(email, password);
      if (result.mfa_required) {
        setMfaChallenge(result);
        return;
      }
      window.location.href = returnTo;
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try { await signInWithProvider("google", returnTo); }
    catch (err) { setError(err.message || 'Unable to sign in with Google'); }
  };

  // The second sign-in step (authenticator app or text message) replaces the whole page.
  if (mfaChallenge) return <MfaScreen><MfaFlow challenge={mfaChallenge} returnTo={returnTo} /></MfaScreen>;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Authenticate to your LEGACY identity."
      footer={
        <>
          New to LEGACY?{" "}
          <Link
            to={"/register" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "")}
            className="font-medium text-gold transition hover:text-gold-soft"
          >
            Register your fingerprint
          </Link>
        </>
      }
    >
      <button type="button" onClick={handleGoogle} className="btn-gold-ghost h-12 w-full">
        <GoogleIcon className="h-4 w-4" />
        Continue with Google
      </button>

      <div className="relative my-6">
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
        <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-[12.5px] text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="eyebrow block">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40" aria-hidden="true" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field pl-11"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="eyebrow block">
              Password
            </label>
            <Link to="/forgot-password" className="text-[11px] text-foreground/40 transition hover:text-gold">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40" aria-hidden="true" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field pl-11"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-gold mt-2" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying identity…
            </>
          ) : (
            "Enter LEGACY"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-[10.5px] leading-relaxed text-foreground/25">
        Payments require your registered fingerprint.
      </p>
    </AuthLayout>
  );
}