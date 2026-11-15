import type { Review } from "@prisma/client";
import { Avatar } from "@/modules/shared/ui/Avatar";
import { Stars } from "@/modules/shared/ui/Stars";
import { formatDate } from "@/modules/shared/money";

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
