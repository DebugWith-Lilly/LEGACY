import React from "react";
import { ScanLine, Smartphone, Plus } from "lucide-react";
import StatusChip from "@/components/StatusChip";
import { formatDateTime, formatMoney } from "@/lib/legacy";
import { cn } from "@/lib/utils";

const ICONS = {
  finger_to_machine: ScanLine,
  finger_to_phone: Smartphone,
  top_up: Plus,
};

const LABELS = {
  finger_to_machine: "Finger to machine",
  finger_to_phone: "Finger to phone",
  top_up: "Top up",
};

export default function TransactionRow({ tx }) {
  const Icon = ICONS[tx.type] || ScanLine;
  const incoming = tx.type === "top_up" && tx.status === "authorised";
  const dimmed = tx.status !== "authorised";

  return (
    <div className="flex items-center gap-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-foreground/45">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] text-foreground/90">{tx.counterparty || "LEGACY"}</p>
        <p className="mt-0.5 truncate text-[10.5px] text-foreground/30">
          {LABELS[tx.type] || "Payment"} · {formatDateTime(tx.created_date)}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={cn(
            "text-[13px] tabular-nums tracking-tight",
            dimmed ? "text-foreground/30" : "text-foreground",
          )}
        >
          {incoming ? "+" : "−"}
          {formatMoney(tx.amount, tx.currency)}
        </p>
        <div className="mt-1 flex justify-end">
          <StatusChip status={tx.status} />
        </div>
      </div>
    </div>
  );
}