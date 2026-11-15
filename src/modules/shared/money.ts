export function formatPrice(price: number | null | undefined, currency = "USD") {
  if (price === null || price === undefined) return null;
  if (price === 0) return "Free";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: price % 1 ? 2 : 0 }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
}

export function formatDate(d: Date | string, opts: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) {
  return new Intl.DateTimeFormat("en-GB", opts).format(typeof d === "string" ? new Date(d) : d);
}
