import { base44 } from "@/api/base44Client";
import { maskReference, verifyFingerprint } from "@/lib/biometric";
import { makeReference } from "@/lib/legacy";

const REASONS = {
  NO_MATCH: "The presented fingerprint did not match your registered identity.",
  READER_UNAVAILABLE: "The fingerprint reader could not be reached. No authorisation was given.",
  NOT_ENROLLED: "No registered fingerprint on this account.",
  INSUFFICIENT_FUNDS: "This payment exceeds your available balance.",
};

/**
 * Authorises a payment against the member's registered biometric identity.
 * Persists the transaction and debits the prototype ledger on success.
 * Biometric matching runs through the reader SDK — only its verdict is stored.
 */
export async function authorisePayment({
  user,
  wallet,
  identity,
  amount,
  type,
  counterparty,
  counterpartyHandle,
  channel,
  note,
  simulate = "match",
}) {
  const value = Number(amount);

  const base = {
    user_id: user?.id,
    type,
    amount: value,
    currency: wallet?.currency || "USD",
    counterparty,
    counterparty_handle: counterpartyHandle,
    channel,
    note,
    reference: makeReference(),
    identity_reference: identity?.template_reference
      ? maskReference(identity.template_reference)
      : "—",
  };

  if (!identity?.template_reference) {
    return {
      ...base,
      status: "declined",
      result_code: "NOT_ENROLLED",
      biometric_verified: false,
      reason: REASONS.NOT_ENROLLED,
    };
  }

  const verdict = await verifyFingerprint({
    reference: identity.template_reference,
    simulate,
  });

  const record = {
    ...base,
    biometric_verified: verdict.verified,
    match_score: verdict.match_score,
    result_code: verdict.result_code,
  };

  if (!verdict.verified) {
    await base44.entities.Transaction.create({ ...record, status: "declined" });
    if (verdict.result_code !== "READER_UNAVAILABLE") {
      await base44.entities.BiometricIdentity.update(identity.id, {
        verification_status: "failed",
        failed_attempts: (identity.failed_attempts || 0) + 1,
      });
    }
    return {
      ...record,
      status: "declined",
      reason: REASONS[verdict.result_code] || "Authorisation failed.",
    };
  }

  if (value > Number(wallet?.balance || 0)) {
    await base44.entities.Transaction.create({
      ...record,
      status: "declined",
      result_code: "INSUFFICIENT_FUNDS",
    });
    return {
      ...record,
      status: "declined",
      result_code: "INSUFFICIENT_FUNDS",
      reason: REASONS.INSUFFICIENT_FUNDS,
    };
  }

  await base44.entities.Transaction.create({ ...record, status: "authorised" });
  await base44.entities.Wallet.update(wallet.id, {
    balance: Number(wallet.balance) - value,
  });
  await base44.entities.BiometricIdentity.update(identity.id, {
    verification_status: "verified",
    last_verified_date: new Date().toISOString(),
    failed_attempts: identity.failed_attempts || 0,
  });

  return {
    ...record,
    status: "authorised",
    balance_after: Number(wallet.balance) - value,
    authorised_at: new Date().toISOString(),
  };
}