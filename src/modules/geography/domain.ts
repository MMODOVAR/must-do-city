/** Geography domain: what makes a city a "hotspot" on the map. */

export type CityStats = { experienceCount: number; reviewCount: number; ratingAverage: number };

/**
 * Popularity score used to rank hotspots. Cities flagged as hotspots by an admin
 * get a boost; otherwise the score grows with the number of experiences and
 * their reviews, weighted by rating.
 */
export function hotspotScore(stats: CityStats, flagged: boolean) {
  const reviewWeight = Math.log10(1 + stats.reviewCount) * (stats.ratingAverage || 3);
  return (flagged ? 10 : 0) + stats.experienceCount * 2 + reviewWeight;
}

export function hasCoordinates<T extends { latitude: number | null; longitude: number | null }>(
  x: T,
): x is T & { latitude: number; longitude: number } {
  return x.latitude !== null && x.longitude !== null;
}
