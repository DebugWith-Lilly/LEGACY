import React from "react";
import { Outlet } from "react-router-dom";
import SideRail from "@/components/SideRail";
import MobileTabBar from "@/components/MobileTabBar";

export default function AppShell() {
  return (
    <div className="relative min-h-screen bg-ink">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(201,169,110,0.08),transparent)]" />
      <SideRail />
      <div className="relative lg:pl-[236px]">
        <main className="mx-auto w-full max-w-[1060px] px-5 pb-28 pt-8 sm:px-8 lg:pb-20 lg:pt-12">
          <Outlet />
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}