import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function PaymentTile({ to, icon: Icon, title, description }) {
  return (
    <Link
      to={to}
      className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.02] p-5 transition duration-300 hover:border-gold/30 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-gold/[0.06] text-gold transition duration-300 group-hover:border-gold/40">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </span>
        <ArrowUpRight
          className="h-4 w-4 text-foreground/20 transition duration-300 group-hover:text-gold"
          strokeWidth={1.5}
        />
      </div>
      <div className="mt-6">
        <p className="font-display text-[19px] font-light text-foreground">{title}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-foreground/35">{description}</p>
      </div>
    </Link>
  );
}