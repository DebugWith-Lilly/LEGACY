import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScanLine, Smartphone, ArrowUpRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import useLegacyProfile from "@/hooks/useLegacyProfile";
import BalanceCard from "@/components/BalanceCard";
import PaymentTile from "@/components/PaymentTile";
import IdentityStrip from "@/components/IdentityStrip";
import RecentActivity from "@/components/RecentActivity";
import Wordmark from "@/components/Wordmark";
import { firstNameOf } from "@/lib/legacy";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { user, profile, identity, wallet, loading } = useLegacyProfile();
  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return undefined;
    let alive = true;
    base44.entities.Transaction.filter(
      { user_id: user.id },
      { sort: "-created_date", limit: 4 },
    )
      .then((page) => {
        if (alive) setRecent(page.items || []);
      })
      .catch(() => {
        if (alive) setRecent([]);
      })
      .finally(() => {
        if (alive) setRecentLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user?.id]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 lg:hidden">
        <Wordmark size="sm" id="dash-mobile" />
        <Link to="/identity" className="btn-gold-ghost h-9 px-3 text-[10px] uppercase tracking-[0.18em]">
          Identity
        </Link>
      </div>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{greeting()}</p>
          <h1 className="mt-2 font-display text-[34px] font-light leading-none text-foreground">
            {loading
              ? "—"
              : firstNameOf({ full_name: profile?.full_name, email: user?.email })}
          </h1>
        </div>
        <p className="text-[10.5px] uppercase tracking-[0.2em] text-foreground/25">
          An effortless way to pay
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BalanceCard wallet={wallet} holder={profile?.full_name || user?.email} />
        </div>
        <div className="flex gap-4 lg:flex-col">
          <PaymentTile
            to="/pay/terminal"
            icon={ScanLine}
            title="Finger to machine"
            description="Pay at any compatible reader in store."
          />
          <PaymentTile
            to="/pay/phone"
            icon={Smartphone}
            title="Finger to phone"
            description="Authorise a transfer on a recipient's phone."
          />
        </div>
      </div>

      {!loading && <IdentityStrip identity={identity} />}

      {!loading && identity && (
        <Link
          to="/identity"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-gold/12 bg-gradient-to-r from-gold/[0.06] to-transparent p-5 transition hover:border-gold/30"
        >
          <div>
            <p className="text-[12.5px] text-foreground/85">
              One finger. Every terminal, every phone.
            </p>
            <p className="mt-1 text-[11px] text-foreground/35">
              Your enrolled identity travels with you — no re-enrolment at checkout.
            </p>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-gold/50 transition group-hover:text-gold" strokeWidth={1.5} />
        </Link>
      )}

      <RecentActivity items={recent} loading={recentLoading || loading} />
    </div>
  );
}