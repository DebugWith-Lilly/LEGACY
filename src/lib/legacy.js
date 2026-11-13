const LOCALES = { USD: "en-US", EUR: "de-DE", GBP: "en-GB", ZAR: "en-ZA" };

const SYMBOLS = { USD: "$", EUR: "€", GBP: "£", ZAR: "R" };

export function currencySymbol(currency = "USD") {
  return SYMBOLS[currency] || "$";
}

export function formatMoney(value, currency = "USD") {
  const amount = Number(value || 0);
  try {
    return new Intl.NumberFormat(LOCALES[currency] || "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `R ${amount.toFixed(2)}`;
  }
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${formatDate(value)} · ${date.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const body = Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `LGC-${body.slice(0, 4)}-${body.slice(4)}`;
}

export function makeAccountNumber(seed = "") {
  const digits = (seed.replace(/[^0-9a-f]/gi, "") + "48219073").slice(0, 8);
  return `LG ${digits.slice(0, 4).toUpperCase()} ${digits.slice(4).toUpperCase()}`;
}

export function firstNameOf(user) {
  if (!user) return "there";
  const name = user.full_name || user.email?.split("@")[0] || "there";
  return name.split(" ")[0];
}
