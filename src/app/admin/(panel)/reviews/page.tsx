import Link from "next/link";
import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { DataTable } from "@/modules/shared/admin/DataTable";
import { ConfirmButton } from "@/modules/shared/admin/ui";
import { Stars } from "@/modules/shared/ui/Stars";
import { formatDate } from "@/modules/shared/money";
import { deleteReview, setReviewPublished } from "@/modules/reviews/actions";
import { reviewsService } from "@/modules/reviews/service";

const FILTERS = ["all", "published", "hidden"] as const;

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ filter?: string; experience?: string }> }) {
  const sp = await searchParams;
  const filter = FILTERS.find((f) => f === sp.filter) ?? "all";
  const all = await reviewsService.list(filter);
  const reviews = sp.experience ? all.filter((r) => r.experienceId === sp.experience) : all;

  return (
    <>
      <PageHeader title="Reviews" subtitle="Guests with a completed booking can review from the experience page." action={{ href: "/admin/reviews/new", label: "+ Add review" }} />
      <div className="mb-4 flex gap-2 text-sm">
        {FILTERS.map((f) => (
          <Link key={f} href={`/admin/reviews?filter=${f}`} className={`rounded-full px-3 py-1 capitalize ${filter === f ? "bg-ink text-white" : "bg-white"}`}>{f}</Link>
        ))}
      </div>
      <DataTable head={["Review", "Experience", "Source", "Date", ""]} empty="No reviews." isEmpty={reviews.length === 0}>
        {reviews.map((r) => (
          <tr key={r.id} className={`align-top hover:bg-stone-50 ${r.published ? "" : "opacity-60"}`}>
            <td className="max-w-md p-4">
              <Stars value={r.rating} /> <span className="font-medium">{r.authorName}</span>
              {r.title && <p className="font-medium">{r.title}</p>}
              <p className="line-clamp-3 text-stone-600">{r.comment}</p>
            </td>
            <td className="p-4"><Link href={`/admin/experiences/${r.experience.id}`} className="hover:text-clay">{r.experience.title}</Link></td>
            <td className="p-4 text-xs">{r.booking ? <span className="text-sea">Verified · {r.booking.reference}</span> : "Added by admin"}</td>
            <td className="p-4 whitespace-nowrap text-stone-500">{formatDate(r.createdAt)}</td>
            <td className="space-y-2 p-4 text-right">
              <form action={setReviewPublished.bind(null, r.id, !r.published)}>
                <button className="btn-ghost w-full px-2 py-1">{r.published ? "Hide" : "Publish"}</button>
              </form>
              <ConfirmButton action={deleteReview.bind(null, r.id)} label="Delete" warning="Delete this review permanently?" className="btn-danger w-full px-2 py-1" />
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
