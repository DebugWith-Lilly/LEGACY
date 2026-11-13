import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import useLegacyProfile from "@/hooks/useLegacyProfile";
import TransactionRow from "@/components/TransactionRow";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "all", label: "All", query: null },
  { key: "machine", label: "Finger to machine", query: "finger_to_machine" },
  { key: "phone", label: "Finger to phone", query: "finger_to_phone" },
];

export default function Activity() {
  const { user } = useLegacyProfile();
  const [tab, setTab] = useState("all");
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);

  const load = async (nextTab = tab, nextCursor = null) => {
    if (!user?.id) return;
    const query = { user_id: user.id };
    const active = TABS.find((t) => t.key === nextTab);
    if (active?.query) query.type = active.query;

    if (nextCursor) setMore(true);
    else setLoading(true);

    const page = await base44.entities.Transaction.filter(query, {
      sort: "-created_date",
      limit: 20,
      ...(nextCursor ? { cursor: nextCursor } : {}),
    });

    setItems((prev) => (nextCursor ? [...prev, ...(page.items || [])] : page.items || []));
    setCursor(page.next_cursor || null);
    setLoading(false);
    setMore(false);
  };

  useEffect(() => {
    if (!user?.id) return;
    setItems([]);
    setCursor(null);
    load(tab).catch(() => {
      setItems([]);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, tab]);

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Transaction history</p>
        <h1 className="mt-2 font-display text-[32px] font-light leading-none text-foreground">
          Activity
        </h1>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[10.5px] uppercase tracking-[0.16em] transition",
              tab === t.key
                ? "border-gold/40 bg-gold/[0.08] text-gold-soft"
                : "border-white/[0.08] text-foreground/35 hover:border-white/20 hover:text-foreground/60",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 sm:px-6">
        {loading ? (
          <div className="space-y-5 py-8">
            {[0, 1, 2, 3].map((i) => (
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
          <div className="py-16 text-center">
            <p className="text-[12px] text-foreground/40">No payments in this view yet.</p>
            <p className="mt-2 text-[11px] text-foreground/25">
              Every payment is authorised by your registered fingerprint.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {items.map((tx) => (
              <div key={tx.id} className="py-4">
                <TransactionRow tx={tx} />
              </div>
            ))}
          </div>
        )}
      </div>

      {cursor && (
        <button
          type="button"
          onClick={() => load(tab, cursor)}
          disabled={more}
          className="btn-gold-ghost mx-auto block h-10 px-6 text-[10.5px] uppercase tracking-[0.2em]"
        >
          {more ? "Loading…" : "Load earlier payments"}
        </button>
      )}
    </div>
  );
}