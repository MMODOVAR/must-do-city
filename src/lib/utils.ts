export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Read a trimmed string from FormData; empty -> null. */
export function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

export function num(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function bool(fd: FormData, key: string) {
  return fd.get(key) === "on";
}

export function formatPrice(price: number | null, currency: string) {
  if (price === null || price === undefined) return null;
  if (price === 0) return "Free";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
}

export const CATEGORIES = [
  "Culture",
  "Food & Drink",
  "Nature",
  "Adventure",
  "Nightlife",
  "History",
  "Shopping",
  "Wellness",
];
