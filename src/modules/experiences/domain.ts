/** Experiences domain: pricing rules and value objects shared by UI and services. */
import { formatPrice } from "@/modules/shared/money";

export const PRICING_TYPES = {
  PER_PERSON: "per person",
  PER_GROUP: "per group",
} as const;
export type PricingType = keyof typeof PRICING_TYPES;

export const isPricingType = (v: string): v is PricingType => v in PRICING_TYPES;

/** "$45 per person", "Free", or null when no price is set. */
export function priceLabel(price: number | null, currency: string, pricingType: string) {
  const p = formatPrice(price, currency);
  if (!p || price === 0) return p;
  return `${p} ${isPricingType(pricingType) ? PRICING_TYPES[pricingType] : ""}`.trim();
}

/** Total for a booking: per-person prices scale with group size, per-group prices don't. */
export function totalPrice(price: number | null, pricingType: string, guests: number) {
  if (price === null) return null;
  return pricingType === "PER_GROUP" ? price : price * guests;
}

export function durationLabel(hours: number | null) {
  if (hours === null) return null;
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} ${hours === 1 ? "hour" : "hours"}`;
}

export const SORTS = {
  recommended: "Recommended",
  rating: "Top rated",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  newest: "Newest",
} as const;
export type Sort = keyof typeof SORTS;

export type ExperienceFilters = {
  q?: string;
  country?: string;
  city?: string;
  category?: string;
  language?: string;
  maxPrice?: number;
  sort: Sort;
  page: number;
};

/** Parse URL search params into safe, typed filters. */
export function parseFilters(sp: Record<string, string | string[] | undefined>): ExperienceFilters {
  const one = (k: string) => {
    const v = sp[k];
    const s = (Array.isArray(v) ? v[0] : v)?.trim();
    return s ? s.slice(0, 100) : undefined;
  };
  const maxPrice = Number(one("maxPrice"));
  const page = Math.max(1, Math.floor(Number(one("page")) || 1));
  const sort = one("sort");
  return {
    q: one("q"),
    country: one("country"),
    city: one("city"),
    category: one("category"),
    language: one("language"),
    maxPrice: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : undefined,
    sort: sort && sort in SORTS ? (sort as Sort) : "recommended",
    page,
  };
}

/* ---- itinerary stops ---- */

export const ADMISSION = {
  INCLUDED: "Admission ticket included",
  FREE: "Admission ticket free",
  NOT_INCLUDED: "Admission ticket not included",
  PASS_BY: "Pass by (no stop inside)",
} as const;
export type Admission = keyof typeof ADMISSION;

export const admissionLabel = (v: string | null) => (v && v in ADMISSION ? ADMISSION[v as Admission] : null);

/* ---- photos & badges ---- */

/** Gallery photos: the cover image first, then the uploaded photos (no duplicates). */
export function galleryPhotos(e: { title: string; imageUrl: string | null; photos: { url: string; caption: string | null }[] }) {
  const all = [...(e.imageUrl ? [{ url: e.imageUrl, caption: e.title }] : []), ...e.photos];
  return all.filter((p, i) => all.findIndex((q) => q.url === p.url) === i);
}

/** Viator-style badges earned from reviews and setup. */
export function badges(e: { ratingAverage: number; reviewCount: number; isPrivate: boolean; featured: boolean; cancellationPolicy: string | null }) {
  const out: string[] = [];
  if (e.reviewCount >= 3 && e.ratingAverage >= 4.7) out.push("Top rated");
  if (e.featured) out.push("Local favourite");
  if (e.isPrivate) out.push("Private tour");
  if (e.cancellationPolicy && /free cancellation/i.test(e.cancellationPolicy)) out.push("Free cancellation");
  return out;
}
