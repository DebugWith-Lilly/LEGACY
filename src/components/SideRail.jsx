import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Wordmark from "@/components/Wordmark";
import { NAV_ITEMS } from "@/components/navItems";
import { cn } from "@/lib/utils";

export default function SideRail() {
  const [leaving, setLeaving] = useState(false);

  const signOut = async () => {
    setLeaving(true);
    await base44.auth.logout();
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[236px] flex-col border-r border-white/[0.06] bg-ink px-5 py-8 lg:flex">
      <Link to="/" className="px-1" aria-label="LEGACY home">
        <Wordmark size="sm" id="rail-mark" />
      </Link>

      <nav className="mt-11 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] transition duration-300",
                isActive
                  ? "bg-white/[0.05] text-foreground"
                  : "text-foreground/40 hover:bg-white/[0.03] hover:text-foreground/80",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "absolute left-0 h-4 w-px rounded-full bg-gold transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon
                  className={cn(
                    "h-[17px] w-[17px] transition-colors",
                    isActive ? "text-gold" : "text-foreground/35 group-hover:text-gold/70",
                  )}
                  strokeWidth={1.5}
                />
                <span className="tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-4">
        <div className="rounded-xl border border-gold/12 bg-gold/[0.03] px-3 py-2.5">
          <p className="text-[8.5px] uppercase tracking-[0.26em] text-gold/60">
            Reader status
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[10.5px] text-foreground/45">
            <span className="h-1 w-1 rounded-full bg-emerald-400/80" />
            Simulated · LGC-R2
          </p>
        </div>

        <button
          type="button"
          onClick={signOut}
          disabled={leaving}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[11.5px] text-foreground/35 transition hover:text-foreground/70"
        >
          {leaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
          )}
          Sign out
        </button>
      </div>
    </aside>
  );
}