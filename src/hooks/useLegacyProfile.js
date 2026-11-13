import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { makeAccountNumber } from "@/lib/legacy";

const first = (page) => (page?.items ? page.items[0] : page?.[0]) || null;

/**
 * Loads the signed-in LEGACY member: user, registered biometric identity, wallet.
 * Creates the prototype ledger wallet on first visit.
 */
export default function useLegacyProfile() {
  const [state, setState] = useState({
    user: null,
    profile: null,
    identity: null,
    wallet: null,
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    const user = await base44.auth.me();
    const [identities, wallets, profiles] = await Promise.all([
      base44.entities.BiometricIdentity.filter(
        { user_id: user.id },
        { sort: "-created_date", limit: 1 },
      ),
      base44.entities.Wallet.filter(
        { user_id: user.id },
        { sort: "-created_date", limit: 1 },
      ),
      base44.entities.MemberProfile.filter(
        { user_id: user.id },
        { sort: "-created_date", limit: 1 },
      ),
    ]);

    let profile = first(profiles);
    if (!profile) {
      profile = await base44.entities.MemberProfile.create({
        user_id: user.id,
        full_name: user.full_name || "",
        phone_number: "",
        member_since: new Date().toISOString(),
      });
    }

    let wallet = first(wallets);
    if (!wallet) {
      wallet = await base44.entities.Wallet.create({
        user_id: user.id,
        holder_name: profile.full_name || user.full_name || user.email,
        currency: "USD",
        balance: 12500,
        account_number: makeAccountNumber(user.id),
        status: "active",
      });
    }

    setState({
      user,
      profile,
      identity: first(identities),
      wallet,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    load().catch((error) =>
      setState((prev) => ({ ...prev, loading: false, error })),
    );
  }, [load]);

  return { ...state, reload: load };
}