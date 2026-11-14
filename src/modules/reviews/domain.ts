/** Reviews domain: rating rules and aggregation. */

export const MIN_RATING = 1;
export const MAX_RATING = 5;

export function aggregate(ratings: number[]) {
  const count = ratings.length;
  const average = count ? ratings.reduce((a, b) => a + b, 0) / count : 0;
  return { average: Math.round(average * 100) / 100, count };
}

/** Share of reviews per star, 5 → 1, for the rating breakdown bars. */
export function distribution(ratings: number[]) {
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r === star).length,
    share: ratings.length ? ratings.filter((r) => r === star).length / ratings.length : 0,
  }));
}
