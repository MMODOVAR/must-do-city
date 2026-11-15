import Link from "next/link";
import { REVIEW_SORTS, REVIEWS_PAGE, type ReviewQuery } from "../domain";

/** Builds experience-page URLs that keep the other review params and jump to #reviews. */
function href(base: string, q: ReviewQuery, patch: Partial<ReviewQuery>) {
  const next = { ...q, ...patch };
  const p = new URLSearchParams();
  if (next.rating) p.set("rating", String(next.rating));
  if (next.sort !== "recent") p.set("sort", next.sort);
  if (next.take !== REVIEWS_PAGE) p.set("reviews", String(next.take));
  return `${base}${p.size ? `?${p}` : ""}#reviews`;
}

/** Clickable rating breakdown (filters by star), like Viator. */
export function RatingFilter({ base, query, distribution, average, count }: {
  base: string;
  query: ReviewQuery;
  distribution: { star: number; count: number; share: number }[];
  average: number;
  count: number;
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="text-center sm:w-40">
        <p className="font-display text-5xl font-bold">{count ? average.toFixed(1) : "–"}</p>
        <p className="text-amber-500">{"★★★★★".slice(0, Math.round(average)).padEnd(5, "☆")}</p>
        <p className="text-sm text-stone-500">{count} {count === 1 ? "review" : "reviews"}</p>
      </div>
      <div className="flex-1 space-y-1">
        {distribution.map((d) => {
          const on = query.rating === d.star;
          return (
            <Link key={d.star} href={href(base, query, { rating: on ? undefined : d.star, take: REVIEWS_PAGE })} scroll={false}
              aria-pressed={on} aria-disabled={!d.count}
              className={`flex items-center gap-2 rounded-md px-1 text-sm ${on ? "bg-orange-50 font-semibold" : "hover:bg-stone-100"} ${d.count ? "" : "pointer-events-none opacity-50"}`}>
              <span className="w-14 text-stone-600">{d.star} stars</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                <span className="block h-full rounded-full bg-amber-500" style={{ width: `${d.share * 100}%` }} />
              </span>
              <span className="w-6 text-right text-stone-500">{d.count}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ReviewSortBar({ base, query, shown, total }: { base: string; query: ReviewQuery; shown: number; total: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-y border-stone-200 py-3 text-sm">
      <p className="text-stone-600">
        Showing {shown} of {total} {query.rating ? `${query.rating}-star ` : ""}reviews
        {query.rating && <Link href={href(base, query, { rating: undefined })} scroll={false} className="ml-2 font-semibold text-clay">Clear filter ✕</Link>}
      </p>
      <div className="flex gap-1">
        {Object.entries(REVIEW_SORTS).map(([value, label]) => (
          <Link key={value} href={href(base, query, { sort: value as ReviewQuery["sort"] })} scroll={false}
            className={`rounded-full px-3 py-1 ${query.sort === value ? "bg-ink text-white" : "hover:bg-stone-100"}`}>{label}</Link>
        ))}
      </div>
    </div>
  );
}

export function ShowMoreReviews({ base, query, shown, total }: { base: string; query: ReviewQuery; shown: number; total: number }) {
  if (shown >= total) return null;
  return <Link href={href(base, query, { take: query.take + REVIEWS_PAGE })} scroll={false} className="btn-ghost">Show more reviews</Link>;
}
