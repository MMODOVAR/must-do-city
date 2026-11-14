/** Explore read model: plain, serialisable data handed to the client-side map. */

export type MapCity = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  imageUrl: string | null;
  lat: number;
  lng: number;
  countryId: string;
  countryName: string;
  countrySlug: string;
  experienceCount: number;
  reviewCount: number;
  ratingAverage: number;
  isHotspot: boolean;
  score: number;
  rank: number | null; // 1-based rank among top hotspots, null if not top
  href: string;
  experiencesHref: string;
};

export type MapCountry = {
  id: string;
  name: string;
  slug: string;
  href: string;
  cityIds: string[];
  center: [number, number] | null;
};

export type MapData = { cities: MapCity[]; countries: MapCountry[]; topHotspots: string[] };

export const TOP_HOTSPOTS = 8;
