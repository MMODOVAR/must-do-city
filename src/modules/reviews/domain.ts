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

export const REVIEW_SORTS = {
  recent: "Most recent",
  highest: "Highest rated",
  lowest: "Lowest rated",
} as const;
export type ReviewSort = keyof typeof REVIEW_SORTS;

export type ReviewQuery = { rating?: number; sort: ReviewSort; take: number };

export const REVIEWS_PAGE = 5;

/** Parse ?rating=&sort=&reviews= from the experience page URL. */
export function parseReviewQuery(sp: Record<string, string | string[] | undefined>): ReviewQuery {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined));
  const rating = Number(one("rating"));
  const sort = one("sort");
  const take = Number(one("reviews"));
  return {
    rating: Number.isInteger(rating) && rating >= MIN_RATING && rating <= MAX_RATING ? rating : undefined,
    sort: sort && sort in REVIEW_SORTS ? (sort as ReviewSort) : "recent",
    take: Number.isInteger(take) && take > 0 ? Math.min(take, 200) : REVIEWS_PAGE,
  };
}
