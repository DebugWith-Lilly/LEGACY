import {
  LayoutDashboard,
  ScanLine,
  Smartphone,
  History,
  Fingerprint,
} from "lucide-react";

export const NAV_ITEMS = [
  { to: "/", label: "Overview", short: "Home", icon: LayoutDashboard },
  { to: "/pay/terminal", label: "Finger to machine", short: "Terminal", icon: ScanLine },
  { to: "/pay/phone", label: "Finger to phone", short: "Send", icon: Smartphone },
  { to: "/activity", label: "Activity", short: "Activity", icon: History },
  { to: "/identity", label: "Identity", short: "Identity", icon: Fingerprint },
];