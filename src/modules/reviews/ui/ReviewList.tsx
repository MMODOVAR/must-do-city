import type { Review } from "@prisma/client";
import { Avatar } from "@/modules/shared/ui/Avatar";
import { Stars } from "@/modules/shared/ui/Stars";
import { formatDate } from "@/modules/shared/money";

export function ReviewSummary({ average, count, distribution }: { average: number; count: number; distribution: { star: number; count: number; share: number }[] }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="text-center">
        <p className="font-display text-5xl font-bold">{count ? average.toFixed(1) : "–"}</p>
        <Stars value={average} size="lg" />
        <p className="text-sm text-stone-500">{count} {count === 1 ? "review" : "reviews"}</p>
      </div>
      <div className="flex-1 space-y-1">
        {distribution.map((d) => (
          <div key={d.star} className="flex items-center gap-2 text-sm">
            <span className="w-6 text-stone-500">{d.star}★</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
              <span className="block h-full rounded-full bg-amber-500" style={{ width: `${d.share * 100}%` }} />
            </span>
            <span className="w-6 text-right text-stone-500">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return <p className="text-stone-500">No reviews yet — be the first after your experience!</p>;
  return (
    <ul className="space-y-6">
      {reviews.map((r) => (
        <li key={r.id} className="flex gap-4">
          <Avatar name={r.authorName} size={44} />
          <div>
            <p className="font-semibold">
              {r.authorName}
              {r.authorCountry && <span className="font-normal text-stone-500"> · {r.authorCountry}</span>}
            </p>
            <p className="flex items-center gap-2 text-xs text-stone-500">
              <Stars value={r.rating} /> {formatDate(r.createdAt, { month: "long", year: "numeric" })}
              {r.bookingId && <span className="text-sea">· Verified guest</span>}
            </p>
            {r.title && <p className="mt-2 font-medium">{r.title}</p>}
            <p className="mt-1 text-stone-700">{r.comment}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
