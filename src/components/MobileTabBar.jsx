import React from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/components/navItems";
import { cn } from "@/lib/utils";

export default function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-ink/95 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {NAV_ITEMS.map(({ to, short, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1.5 rounded-lg py-1.5 text-[9px] uppercase tracking-[0.1em] transition",
                isActive ? "text-gold" : "text-foreground/35",
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
            {short}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}