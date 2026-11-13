import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import TransactionRow from "@/components/TransactionRow";

export default function RecentActivity({ items = [], loading, seeAll = true }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="eyebrow">Recent activity</h2>
        {seeAll && (
          <Link
            to="/activity"
            className="flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-foreground/35 transition hover:text-gold"
          >
            All
            <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="space-y-4 pt-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3.5">
              <div className="h-9 w-9 animate-pulse rounded-full bg-white/[0.04]" />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-1/3 animate-pulse rounded bg-white/[0.04]" />
                <div className="h-2 w-1/4 animate-pulse rounded bg-white/[0.03]" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-[11.5px] text-foreground/30">
          No payments yet. Your first fingerprint-authorised payment will appear here.
        </p>
      ) : (
        <div className="divide-y divide-white/[0.05]">
          {items.map((tx) => (
            <div key={tx.id} className="py-3.5">
              <TransactionRow tx={tx} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}